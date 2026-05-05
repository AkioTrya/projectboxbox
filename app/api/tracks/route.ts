import { neon } from '@neondatabase/serverless';
import { NextResponse, NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const circuit = searchParams.get('circuit');

    if (!circuit) {
        return NextResponse.json({ error: "circuit name is required" }, { status: 400 });
    }

    const sql = neon(process.env.DATABASE_URL!);

    try {
        const track = await sql`
            SELECT circuit_name, points, sector_boundaries
            FROM tracks
            WHERE circuit_name ILIKE ${circuit}
            LIMIT 1
        `;

        if (track.length === 0) {
            return NextResponse.json({ error: "Track not found" }, { status: 404 });
        }

        return NextResponse.json(track[0]);
    } catch (error: any) {
        console.error('Database error in /api/tracks:', error);
        return NextResponse.json({ error: "Failed to fetch track", details: error.message }, { status: 500 });
    }
}
