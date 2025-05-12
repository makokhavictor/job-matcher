import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await prisma.document.create({ data: body });
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error saving document:', error);
    return NextResponse.json({ error: 'Failed to save document' }, { status: 500 });
  }
}
