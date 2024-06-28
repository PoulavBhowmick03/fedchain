import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req:Request){
  try{
    const {walletAddress } = await req.json();
    if(!walletAddress) {
      return NextResponse.json({ message: 'Wallet address is required' });
    }
    const newUser = await prisma.user.create({
      data: {
        walletAddress,
        solDeposited: 0,
      },
    });  
    return NextResponse.json(newUser, {status: 201});
  }catch(error){
    return NextResponse.json({message: 'Error creating user', error});
  }
  }
  export async function GET(req:Request){
    try{
      const users = await prisma.user.findMany();
      return NextResponse.json(users, {status: 200});
    }catch(error){
      return NextResponse.json({message: 'Error fetching users', error});
    }
  }
