import { Client } from '@neondatabase/serverless';

export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const data = await request.json();

    // สร้างการเชื่อมต่อโดยใช้ DATABASE_URL จาก Environment Variables
    const client = new Client(env.DATABASE_URL);
    await client.connect();

    const query = `
      INSERT INTO behavior_logs (mouse_data, click_data, key_data, idle_data, features) 
      VALUES ($1, $2, $3, $4, $5)
    `;
    
    const values = [
      JSON.stringify(data.mouse_data || {}),
      JSON.stringify(data.click_data || {}),
      JSON.stringify(data.key_data || {}),
      JSON.stringify(data.idle_data || {}),
      JSON.stringify(data.features || {})
    ];

    await client.query(query, values);
    await client.end();

    return new Response(JSON.stringify({ message: "Success" }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}