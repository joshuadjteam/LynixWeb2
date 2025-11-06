import { Pool } from 'pg';
import bcrypt from 'bcrypt';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
});
const SALT_ROUNDS = 10;

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (!process.env.POSTGRES_URL) {
        console.error('FATAL: POSTGRES_URL environment variable is not set.');
        return res.status(503).json({ message: 'Service Unavailable: Database connection is not configured.' });
    }

    const { id } = req.query;

    if (typeof id !== 'string') {
        return res.status(400).json({ message: 'Invalid user ID.' });
    }

    // PUT /api/users/[id] - Update user details
    if (req.method === 'PUT') {
        try {
            const userData = req.body;
            const query = `
                UPDATE users
                SET username = $1, email = $2, sip = $3, plan = $4, billing = $5
                WHERE id = $6
                RETURNING id, username, role, plan, email, sip, billing;
            `;
            const values = [
                userData.username,
                userData.email,
                userData.sip,
                JSON.stringify(userData.plan),
                JSON.stringify(userData.billing),
                id
            ];
            const { rows } = await pool.query(query, values);
            if (rows.length === 0) {
                return res.status(404).json({ message: 'User not found.' });
            }
            return res.status(200).json(rows[0]);
        } catch (error) {
            console.error(`Error updating user ${id}:`, error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }
    
    // PATCH /api/users/[id] - Update user password
    if (req.method === 'PATCH') {
        try {
            const { password } = req.body;
            if (!password) {
                return res.status(400).json({ message: 'Password is required.' });
            }
            const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
            const query = `UPDATE users SET password_hash = $1 WHERE id = $2;`;
            await pool.query(query, [passwordHash, id]);
            return res.status(200).json({ message: 'Password updated successfully.' });
        } catch (error) {
            console.error(`Error updating password for user ${id}:`, error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    // DELETE /api/users/[id]
    if (req.method === 'DELETE') {
        try {
            const { rowCount } = await pool.query('DELETE FROM users WHERE id = $1', [id]);
            if (rowCount === 0) {
                return res.status(404).json({ message: 'User not found.' });
            }
            return res.status(204).end();
        } catch (error) {
            console.error(`Error deleting user ${id}:`, error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    res.setHeader('Allow', ['PUT', 'PATCH', 'DELETE']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
}