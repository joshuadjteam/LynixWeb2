import { Pool } from 'pg';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'GET') {
        res.setHeader('Allow', ['GET']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    try {
        const { rows } = await pool.query(
            "SELECT id, username FROM users WHERE chat_enabled = TRUE ORDER BY username ASC"
        );
        return res.status(200).json(rows);
    } catch (error) {
        console.error('Error fetching chat users:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}