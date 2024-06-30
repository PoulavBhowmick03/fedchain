import { NextRequest, NextResponse } from 'next/server';

// Define a global array to store the gigs
let gigs: any[] = [];

export async function GET() {
    try {
        return NextResponse.json(gigs, { status: 200 });
    } catch (error) {
        console.error('Error retrieving gigs:', error);
        return NextResponse.json({ message: 'Error retrieving gigs', error }, { status: 400 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { gigName, details, totalBounty, deadline, creatorAddress } = body;

        if (!gigName || !details || !totalBounty || !deadline || !creatorAddress) {
            return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
        }

        const newGig = {
            id: gigs.length + 1,
            gigName,
            details,
            totalBounty,
            deadline,
            creatorAddress,
        };

        gigs.push(newGig);

        return NextResponse.json(newGig, { status: 200 });
    } catch (error) {
        console.error('Error adding gig:', error);
        return NextResponse.json({ message: 'Error adding gig', error }, { status: 500 });
    }
}