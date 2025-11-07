
import { Pool } from 'pg';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { CallStatus } from '../src/types';

const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
});

const getUserIdFromRequest = (req: VercelRequest): string | null => {
    return req.headers['x-user-id'] as string || null;
}

const ensureTableExists = async () => {
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
    const { type, id } = req.query;
    const userId = getUserIdFromRequest(req);

    if (req.method === 'GET') {
        if (type === 'users') {
            try {
                const { rows } = await pool.query("SELECT id, username FROM users ORDER BY username ASC");
                return res.status(200).json(rows);
            } catch (error) {
                console.error('Error fetching users for phone:', error);
                return res.status(500).json({ message: 'Internal Server Error' });
            }
        }
        if (type === 'status') {
            if (!userId) return res.status(401).json({ message: 'Authentication required.' });
            try {
                const { rows } = await pool.query(
                    `SELECT * FROM calls 
                     WHERE (receiver_id = $1 OR caller_id = $1) 
                     AND status IN ('ringing', 'answered') 
                     ORDER BY created_at DESC
                     LIMIT 1`,
                    [userId]
                );
                return res.status(200).json(rows.length > 0 ? rows[0] : null);
            } catch (error) {
                console.error('Error fetching call status:', error);
                return res.status(500).json({ message: 'Internal Server Error' });
            }
        }
    }

    if (req.method === 'POST') {
        if (type === 'call') {
            if (!userId) return res.status(401).json({ message: 'Authentication required.' });
            try {
                await ensureTableExists();
                const { receiverId } = req.body;
                if (!receiverId) return res.status(400).json({ message: 'receiverId is required.' });

                const callerRes = await pool.query('SELECT username FROM users WHERE id = $1', [userId]);
                const receiverRes = await pool.query('SELECT username FROM users WHERE id = $1', [receiverId]);
                if (callerRes.rows.length === 0 || receiverRes.rows.length === 0) {
                    return res.status(404).json({ message: 'Caller or receiver not found.' });
                }
                const { rows } = await pool.query(
                    'INSERT INTO calls (caller_id, receiver_id, caller_username, receiver_username, status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
                    [userId, receiverId, callerRes.rows[0].username, receiverRes.rows[0].username, 'ringing']
                );
                return res.status(201).json(rows[0]);
            } catch (error) {
                console.error('Error initiating call:', error);
                return res.status(500).json({ message: 'Internal Server Error' });
            }
        }
    }
    
    if (req.method === 'PUT') {
        if (type === 'call-update' && typeof id === 'string' && /^\d+$/.test(id)) {
            const callId = parseInt(id, 10);
            try {
                const { status } = req.body;
                if (!status || !Object.values(CallStatus).includes(status)) {
                    return res.status(400).json({ message: 'Invalid status provided.' });
                }

                let query;
                if (status === CallStatus.Answered) {
                    query = 'UPDATE calls SET status = $1, start_time = NOW() WHERE id = $2 RETURNING *';
                } else if (status === CallStatus.Ended || status === CallStatus.Declined) {
                    query = 'UPDATE calls SET status = $1, end_time = NOW() WHERE id = $2 RETURNING *';
                } else {
                     return res.status(400).json({ message: 'This status update is not permitted.' });
                }
                const { rows } = await pool.query(query, [status, callId]);
                if (rows.length === 0) return res.status(404).json({ message: 'Call not found.' });
                return res.status(200).json(rows[0]);
            } catch (error) {
                console.error(`Error updating call ${id}:`, error);
                return res.status(500).json({ message: 'Internal Server Error' });
            }
        }
    }

    res.setHeader('Allow', ['GET', 'POST', 'PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
}
