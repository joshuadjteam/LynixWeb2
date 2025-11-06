import { Pool } from 'pg';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // GET /api/chat/messages?senderId=...&recipientId=...
    if (req.method === 'GET') {
        try {
            const { senderId, recipientId } = req.query;
            if (typeof senderId !== 'string' || typeof recipientId !== 'string') {
                return res.status(400).json({ message: 'senderId and recipientId are required.' });
            }

            const { rows } = await pool.query(
                `SELECT * FROM messages 
                 WHERE (sender_id = $1 AND recipient_id = $2) OR (sender_id = $2 AND recipient_id = $1)
                 ORDER BY timestamp ASC`,
                [senderId, recipientId]
            );
            return res.status(200).json(rows);
        } catch (error) {
            console.error('Error fetching messages:', error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    // POST /api/chat/messages
    if (req.method === 'POST') {
        try {
            const { senderId, recipientId, text } = req.body;
            if (!senderId || !recipientId || !text) {
                return res.status(400).json({ message: 'senderId, recipientId, and text are required.' });
            }

            const { rows } = await pool.query(
                'INSERT INTO messages (sender_id, recipient_id, text) VALUES ($1, $2, $3) RETURNING *',
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