import { Pool } from 'pg';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
});

const ensureTableExists = async () => {
    // Note: This relies on the `users` table already existing with a primary key on `id`.
    // Other API endpoints (like notepad) ensure the `users` table is created.
    await pool.query(`
        CREATE TABLE IF NOT EXISTS messages (
            id SERIAL PRIMARY KEY,
            sender_id VARCHAR(255) NOT NULL,
            recipient_id VARCHAR(255) NOT NULL,
            text TEXT NOT NULL,
            timestamp TIMESTAMPTZ DEFAULT NOW(),
            is_read BOOLEAN DEFAULT FALSE,
            FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (recipient_id) REFERENCES users(id) ON DELETE CASCADE
        );
    `);
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
    try {
        await ensureTableExists();
    } catch(e) {
        console.error("Failed to ensure messages table exists", e);
        return res.status(500).json({ message: 'Database initialization failed.' });
    }

    // GET /api/chat/messages?senderId=...&recipientId=...
    if (req.method === 'GET') {
        const client = await pool.connect();
        try {
            const { senderId, recipientId } = req.query;
            if (typeof senderId !== 'string' || typeof recipientId !== 'string') {
                return res.status(400).json({ message: 'senderId and recipientId are required.' });
            }
            
            await client.query('BEGIN');

            const { rows } = await client.query(
                `SELECT * FROM messages 
                 WHERE (sender_id = $1 AND recipient_id = $2) OR (sender_id = $2 AND recipient_id = $1)
                 ORDER BY timestamp ASC`,
                [senderId, recipientId]
            );

            // Mark fetched messages as read for the recipient
            await client.query(
                `UPDATE messages SET is_read = TRUE WHERE recipient_id = $1 AND sender_id = $2 AND is_read = FALSE`,
                [senderId, recipientId]
            );
            
            await client.query('COMMIT');

            return res.status(200).json(rows);
        } catch (error) {
            await client.query('ROLLBACK');
            console.error('Error fetching messages:', error);
            return res.status(500).json({ message: 'Internal Server Error' });
        } finally {
            client.release();
        }
    }

    // POST /api/chat/messages
    if (req.method === 'POST') {
        try {
            const { senderId, recipientId, text } = req.body;
            if (!senderId || !recipientId || !text) {
                return res.status(400).json({ message: 'senderId, recipientId, and text are required.' });
            }

            // Set is_read to false for new messages
            const { rows } = await pool.query(
                'INSERT INTO messages (sender_id, recipient_id, text, is_read) VALUES ($1, $2, $3, FALSE) RETURNING *',
                [senderId, recipientId, text]
            );
            return res.status(201).json(rows[0]);
        } catch (error) {
            console.error('Error sending message:', error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
}