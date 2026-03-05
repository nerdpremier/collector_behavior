import pkg from 'pg';
const { Client } = pkg;

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        const data = req.body;

        const query = `
            INSERT INTO behavior_logs (mouse, click, key, idle, features) 
            VALUES ($1, $2, $3, $4, $5)
        `;
        
        const values = [
            data.mouse || {},  
            data.click || {},  
            data.key || {},    
            data.idle || {},   
            data.features || {}
        ];

        await client.query(query, values);
        await client.end();
        return res.status(200).json({ message: "Success" });
    } catch (err) {
        if (client) await client.end().catch(() => {});
        return res.status(500).json({ error: "Database Error", details: err.message });
    }
}