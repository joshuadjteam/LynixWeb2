import { Pool } from 'pg';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
});

const getUserIdFromRequest = (req: VercelRequest): string | null => {
    return req.headers['x-user-id'] as string || null;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    const userId = getUserIdFromRequest(req);
    if (!userId) {
        return res.status(401).json({ message: 'Authentication required.' });
    }

    if (req.method !== 'GET') {
        res.setHeader('Allow', ['GET']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    try {
        // Find any call that this user is a part of and is currently 'ringing' or 'answered'.
        // This single query handles incoming calls, outgoing ringing calls, and active calls.
        const { rows } = await pool.query(
            `SELECT * FROM calls 
             WHERE (receiver_id = $1 OR caller_id = $1) 
             AND status IN ('ringing', 'answered') 
             ORDER BY created_at DESC
             LIMIT 1`,
            [userId]
        );

        if (rows.length > 0) {
            return res.status(200).json(rows[0]);
        } else {
            // Return null or an empty object if no active call is found
            return res.status(200).json(null);
        }
    } catch (error) {
        console.error('Error fetching call status:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}