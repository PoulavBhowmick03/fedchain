// pages/api/gigs.js
import { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from 'next/server';

// Define a global array to store the gigs
let gigs = [];

// POST function to add a new gig
export async function POST(req) {
    try {
        // const { gigName, details, totalBounty, deadline } = req.body;
        const body = await req.json()
        const { gigName, details, totalBounty, deadline } = body

        if (!gigName || !details || !totalBounty || !deadline) {
            return NextResponse.json({ message: 'All fields are required' }, {status:400});
        }

        const newGig = {
            id: gigs.length + 1,
            gigName,
            details,
            totalBounty,
            deadline,
        };

        gigs.push(newGig);

        return NextResponse.json(newGig, {status: 200});
    } catch (error) {
        console.error('Error adding gig:', error);
        return NextResponse.json({ message: 'Error adding gig', error }, {status: 500});
    }
}

// GET function to retrieve all gigs
export async function GET(req) {
    try {
        return NextResponse.json(gigs, {status: 200});
    } catch (error) {
        console.error('Error retrieving gigs:', error);
        NextResponse.json({ message: 'Error retrieving gigs', error }, {status:400});
    }
}

// export default async function handler(req, res) {
//     if (req.method === 'POST') {
//         return POST(req, res);
//     } else if (req.method === 'GET') {
//         return GET(req, res);
//     } else {
//         res.setHeader('Allow', ['GET', 'POST']);
//         return res.status(405).end(`Method ${req.method} Not Allowed`);
//     }
// }
