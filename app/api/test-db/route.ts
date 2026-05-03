import { neon } from '@neondatabase/serverless';

export async function GET() {
    const sql = neon(process.env.DATABASE_URL!);
    const result = await sql`SELECT version()`;
    return Response.json({ version: result[0].version });
}