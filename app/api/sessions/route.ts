import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';

export async function GET() {
    const sql = neon(process.env.DATABASE_URL!);

    try {
        const sessions = await sql`
            SELECT id, year, round, circuit, country, session_type, session_date
            FROM sessions
            ORDER BY year DESC, round ASC
        `;

        return NextResponse.json(sessions);
    } catch (error) {
        console.error('Database error:', error);
        return NextResponse.json({ error: "Failed to fetch sessions" }, { status: 500 });
    }
}