import { Pool } from 'pg';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { CallStatus } from '../../../types';

const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
    const { id } = req.query;
    if (typeof id !== 'string' || !/^\d+$/.test(id)) {
        return res.status(400).json({ message: 'Invalid call ID.' });
    }
    const callId = parseInt(id, 10);

    if (req.method === 'PUT') {
        try {
            const { status } = req.body;
            if (!status || !Object.values(CallStatus).includes(status)) {
                return res.status(400).json({ message: 'Invalid status provided.' });
            }

            let query;
            let values;

            if (status === CallStatus.Answered) {
                query = 'UPDATE calls SET status = $1, start_time = NOW() WHERE id = $2 RETURNING *';
                values = [status, callId];
            } else if (status === CallStatus.Ended || status === CallStatus.Declined) {
                query = 'UPDATE calls SET status = $1, end_time = NOW() WHERE id = $2 RETURNING *';
                values = [status, callId];
            } else {
                 return res.status(400).json({ message: 'This status update is not permitted.' });
            }

            const { rows } = await pool.query(query, values);

            if (rows.length === 0) {
                return res.status(404).json({ message: 'Call not found.' });
            }
            return res.status(200).json(rows[0]);

        } catch (error) {
            console.error(`Error updating call ${id}:`, error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    res.setHeader('Allow', ['PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
}