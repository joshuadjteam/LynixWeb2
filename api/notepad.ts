import { Pool } from 'pg';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
});

// Simplified auth helper - NOT FOR PRODUCTION
const getUserIdFromRequest = (req: VercelRequest): string | null => {
    return req.headers['x-user-id'] as string || null;
}

const EXPIRATION_HOURS = 72;

export default async function handler(req: VercelRequest, res: VercelResponse) {
    const userId = getUserIdFromRequest(req);
    if (!userId) {
        return res.status(401).json({ message: 'Authentication required.' });
    }

    // GET /api/notepad - Fetch user's note
    if (req.method === 'GET') {
        const client = await pool.connect();
        try {
            const { rows } = await client.query(
                'SELECT notepad_content, notepad_timestamp FROM users WHERE id = $1',
                [userId]
            );

            if (rows.length === 0) {
                return res.status(404).json({ message: 'User not found.' });
            }

            const { notepad_content, notepad_timestamp } = rows[0];

            // Check for expiration
            if (notepad_timestamp) {
                const lastUpdated = new Date(notepad_timestamp).getTime();
                const expirationTime = lastUpdated + EXPIRATION_HOURS * 60 * 60 * 1000;
                if (Date.now() > expirationTime) {
                    // Note has expired, clear it
                    await client.query(
                        'UPDATE users SET notepad_content = $1, notepad_timestamp = NULL WHERE id = $2',
                        ['', userId]
                    );
                    return res.status(200).json({ content: '' });
                }
            }
            
            return res.status(200).json({ content: notepad_content || '' });

        } catch (error) {
            console.error('Error fetching note:', error);
            return res.status(500).json({ message: 'Internal Server Error' });
        } finally {
            client.release();
        }
    }

    // PUT /api/notepad - Save user's note
    if (req.method === 'PUT') {
        try {
            const { content } = req.body;
            if (typeof content !== 'string') {
                return res.status(400).json({ message: 'A "content" string is required.' });
            }

            const { rowCount } = await pool.query(
                'UPDATE users SET notepad_content = $1, notepad_timestamp = NOW() WHERE id = $2',
                [content, userId]
            );
            
            if (rowCount === 0) {
                return res.status(404).json({ message: 'User not found.' });
            }

            return res.status(200).json({ message: 'Note saved successfully.' });

        } catch (error) {
            console.error('Error saving note:', error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    res.setHeader('Allow', ['GET', 'PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
}