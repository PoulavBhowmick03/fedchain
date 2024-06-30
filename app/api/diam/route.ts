// import { NextRequest, NextResponse } from 'next/server';
// // import { gigs } from '../gigs/route';

// export async function POST(req: NextRequest) {
//     try {
//         const body = await req.json();
//         const { gigName, details, totalBounty, deadline, creatorAddress } = body;

//         if (!gigName || !details || !totalBounty || !deadline || !creatorAddress) {
//             return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
//         }

//         // const newGig = {
//         //     id: gigs.length + 1,
//         //     gigName,
//         //     details,
//         //     totalBounty,
//         //     deadline,
//         //     creatorAddress,
//         // };

//         // gigs.push(newGig);

//         // Here you would typically interact with the Diamante blockchain
//         // For example, you might call a function to store DIAM

// //         return NextResponse.json(newGig, { status: 200 });
// //     } catch (error) {
// //         console.error('Error adding gig:', error);
// //         return NextResponse.json({ message: 'Error adding gig', error }, { status: 500 });
// //     }
// // }

// export async function GET(req: NextRequest) {
//     // This function could be used to get Diamante-specific information
//     // For now, we'll just return a placeholder message
//     return NextResponse.json({ message: 'Diamante API endpoint' }, { status: 200 });
// }