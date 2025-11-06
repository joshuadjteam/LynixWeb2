import { Pool } from 'pg';
import bcrypt from 'bcrypt';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import type { User } from '../src/types';

const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
});

const SALT_ROUNDS = 10;

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (!process.env.POSTGRES_URL) {
        console.error('FATAL: POSTGRES_URL environment variable is not set.');
        return res.status(503).json({ message: 'Service Unavailable: Database connection is not configured.' });
    }
    
    // GET /api/users - Fetch all users (except admin)
    if (req.method === 'GET') {
        try {
            const { rows } = await pool.query("SELECT id, username, role, plan, email, sip, billing FROM users WHERE role != 'admin'");
            const users: User[] = rows.map(row => ({
                ...row,
                plan: typeof row.plan === 'string' ? JSON.parse(row.plan) : row.plan,
                billing: typeof row.billing === 'string' ? JSON.parse(row.billing) : row.billing,
            }));
            return res.status(200).json(users);
        } catch (error) {
            console.error('Error fetching users:', error);
            const errorMessage = error instanceof Error ? error.message : 'An unknown internal error occurred.';
            return res.status(500).json({ message: errorMessage });
        }
    }

    // POST /api/users - Create a new user
    if (req.method === 'POST') {
        try {
            const { userData, password } = req.body;
            if (!userData || !password || !userData.username || !userData.email || !userData.role) {
                return res.status(400).json({ message: 'Missing required fields.' });
            }

            const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
            const newId = userData.username.toLowerCase();

            const query = `
                INSERT INTO users (id, username, password_hash, role, plan, email, sip, billing)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                RETURNING id, username, role, plan, email, sip, billing;
            `;
            const values = [
                newId, 
                userData.username, 
                passwordHash, 
                userData.role, 
                JSON.stringify(userData.plan), 
                userData.email, 
                userData.sip, 
                JSON.stringify(userData.billing)
            ];

            const { rows } = await pool.query(query, values);
            return res.status(201).json(rows[0]);

        } catch (error: any) {
            console.error('Error creating user:', error);
            if (error.code === '23505') { // Unique constraint violation
                 return res.status(409).json({ message: 'Username or email already exists.' });
            }
            const errorMessage = error instanceof Error ? error.message : 'An unknown internal error occurred.';
            return res.status(500).json({ message: errorMessage });
        }
    }

    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
}