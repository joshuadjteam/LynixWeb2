import { Pool } from 'pg';
import bcrypt from 'bcrypt';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { User } from '../src/types';

const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required.' });
        }

        const { rows } = await pool.query(
            "SELECT id, username, password_hash, role, plan, email, sip, billing FROM users WHERE lower(username) = $1",
            [username.toLowerCase()]
        );

        if (rows.length === 0) {
            return res.status(401).json({ message: 'Invalid username or password.' });
        }

        const user = rows[0];
        const passwordMatch = await bcrypt.compare(password, user.password_hash);

        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid username or password.' });
        }

        // Do not send the password hash to the client
        const userToReturn: User = {
            id: user.id,
            username: user.username,
            role: user.role,
            plan: user.plan,
            email: user.email,
            sip: user.sip,
            billing: user.billing,
        };

        return res.status(200).json(userToReturn);

    } catch (error) {
        console.error('Authentication error:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}
