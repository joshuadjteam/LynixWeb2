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

    const { id } = req.query;
    if (typeof id !== 'string' || !/^\d+$/.test(id)) {
        return res.status(400).json({ message: 'Invalid contact ID.' });
    }
    const contactId = parseInt(id, 10);

    if (req.method === 'PUT') {
        try {
            const { name, email, phone, notes } = req.body;
            if (!name) {
                return res.status(400).json({ message: 'Name is a required field.' });
            }
            const { rows } = await pool.query(
                'UPDATE contacts SET name = $1, email = $2, phone = $3, notes = $4 WHERE id = $5 AND user_id = $6 RETURNING *',
                [name, email, phone, notes, contactId, userId]
            );
            if (rows.length === 0) {
                return res.status(404).json({ message: 'Contact not found or you do not have permission to edit it.' });
            }
            return res.status(200).json(rows[0]);
        } catch (error) {
            console.error(`Error updating contact ${id}:`, error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    if (req.method === 'DELETE') {
        try {
            const { rowCount } = await pool.query('DELETE FROM contacts WHERE id = $1 AND user_id = $2', [contactId, userId]);
            if (rowCount === 0) {
                return res.status(404).json({ message: 'Contact not found or you do not have permission to delete it.' });
            }
            return res.status(204).end();
        } catch (error) {
            console.error(`Error deleting contact ${id}:`, error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    res.setHeader('Allow', ['PUT', 'DELETE']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
}
