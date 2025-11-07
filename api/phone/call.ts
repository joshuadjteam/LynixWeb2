import { Pool } from 'pg';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
});

const getUserIdFromRequest = (req: VercelRequest): string | null => {
    return req.headers['x-user-id'] as string || null;
}

const ensureTableExists = async () => {
    // This relies on the `users` table already being created by other API endpoints
    await pool.query(`
        CREATE TABLE IF NOT EXISTS calls (
            id SERIAL PRIMARY KEY,
            caller_id VARCHAR(255) NOT NULL,
            receiver_id VARCHAR(255) NOT NULL,
            caller_username VARCHAR(255) NOT NULL,
            receiver_username VARCHAR(255) NOT NULL,
            status VARCHAR(50) NOT NULL,
            start_time TIMESTAMPTZ,
            end_time TIMESTAMPTZ,
            created_at TIMESTAMPTZ DEFAULT NOW(),
            FOREIGN KEY (caller_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE
        );
    `);
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
    const callerId = getUserIdFromRequest(req);
    if (!callerId) {
        return res.status(401).json({ message: 'Authentication required.' });
    }

    try {
        await ensureTableExists();
    } catch (e) {
        console.error("Failed to ensure calls table exists", e);
        return res.status(500).json({ message: 'Database initialization failed.' });
    }

    if (req.method === 'POST') {
        try {
            const { receiverId } = req.body;
            if (!receiverId) {
                return res.status(400).json({ message: 'receiverId is required.' });
            }

            // Fetch usernames
            const callerRes = await pool.query('SELECT username FROM users WHERE id = $1', [callerId]);
            const receiverRes = await pool.query('SELECT username FROM users WHERE id = $1', [receiverId]);

            if (callerRes.rows.length === 0 || receiverRes.rows.length === 0) {
                return res.status(404).json({ message: 'Caller or receiver not found.' });
            }

            const caller_username = callerRes.rows[0].username;
            const receiver_username = receiverRes.rows[0].username;

            const { rows } = await pool.query(
                'INSERT INTO calls (caller_id, receiver_id, caller_username, receiver_username, status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
                [callerId, receiverId, caller_username, receiver_username, 'ringing']
            );

            return res.status(201).json(rows[0]);
        } catch (error) {
            console.error('Error initiating call:', error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
}