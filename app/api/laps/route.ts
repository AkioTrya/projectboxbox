import { neon } from '@neondatabase/serverless';
import { NextResponse, NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const session_id = searchParams.get('session_id');

    if (!session_id) {
        return NextResponse.json({ error: "session_id is required" }, { status: 400 });
    }

    const sql = neon(process.env.DATABASE_URL!);

    try {
        const laps = await sql`
            SELECT driver, team, lap_number, lap_time_ms, compound, tyre_life, is_personal_best
            FROM laps
            WHERE session_id = ${parseInt(session_id)}
            AND lap_time_ms IS NOT NULL
            AND lap_time_ms < 600000
            ORDER BY driver, lap_number ASC
        `;

        return NextResponse.json(laps);
    } catch (error) {
        console.error('Database error:', error);
        return NextResponse.json({ error: "Failed to fetch laps" }, { status: 500 });
    }
}
