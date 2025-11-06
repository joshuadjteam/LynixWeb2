import { Pool } from 'pg';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getUserId } from '../../utils/auth'; // A utility to get user ID from session/token

const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
});

// This is a simplified auth helper. In a real app, you'd use JWT or sessions.
const getUserIdFromRequest = (req: VercelRequest): string | null => {
    // For this app's structure, we can't easily get the user ID on the backend
    // without a proper session management system.
    // This is a placeholder for where that logic would go.
    // We will simulate this on the client-side for now by passing the user ID.
    // In a production app, this would be a security risk.
    return req.headers['x-user-id'] as string || null;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'GET') {
        res.setHeader('Allow', ['GET']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    // In a real app, you would get the user ID from a secure session/token.
    // Since we don't have that, we'll have to rely on a header for demo purposes.
    // This is NOT secure for a production application.
    const userId = getUserIdFromRequest(req);

    if (!userId) {
        // This part is tricky without a session. The client will need to manage this.
        // For our simplified case, we assume the polling happens when logged in.
        // Let's adjust the logic in App.tsx to handle this.
        // For the API, let's assume the client passes its ID.
        return res.status(401).json({ message: 'Authentication required.' });
    }

    try {
        const { rows } = await pool.query(
            `SELECT
                m.sender_id,
                u.username as sender_username,
                LEFT(m.text, 50) as message_snippet
             FROM messages m
             JOIN users u ON m.sender_id = u.id
             WHERE m.recipient_id = $1 AND m.is_read = FALSE
             ORDER BY m.timestamp DESC`,
            [userId]
        );
        return res.status(200).json(rows);
    } catch (error) {
        console.error('Error fetching alerts:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}
