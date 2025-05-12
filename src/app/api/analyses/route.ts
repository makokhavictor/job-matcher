import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Received analysis result:', body);
    const result = await prisma.analysisResult.create({ data: body });
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error saving analysis result:', error);
    return NextResponse.json({ error: 'Failed to save analysis result' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const results = await prisma.analysisResult.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { cv: true, jobDescription: true },
    });
    return NextResponse.json(results);
  } catch (error) {
    console.error('Error fetching recent analyses:', error);
    return NextResponse.json({ error: 'Failed to fetch analyses' }, { status: 500 });
  }
}
