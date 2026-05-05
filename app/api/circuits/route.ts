import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';

export async function GET() {
    const sql = neon(process.env.DATABASE_URL!);

    try {
        const circuits = await sql`
            SELECT DISTINCT 
                t.circuit_name, 
                COUNT(s.id) as session_count,
                MIN(s.year) as first_year,
                MAX(s.year) as latest_year,
                s.country
            FROM tracks t
            LEFT JOIN sessions s ON s.circuit ILIKE t.circuit_name
            GROUP BY t.circuit_name, s.country
            ORDER BY t.circuit_name ASC
        `;

        return NextResponse.json(circuits);
    } catch (error: any) {
        console.error('Database error in /api/circuits:', error);
        return NextResponse.json({ error: "Failed to fetch circuits", details: error.message }, { status: 500 });
    }
}
