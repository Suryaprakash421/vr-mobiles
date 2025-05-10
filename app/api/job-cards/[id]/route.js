import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';

// GET a single job card by ID
export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }
    
    const jobCard = await prisma.jobCard.findUnique({
      where: { id },
      include: {
        createdBy: {
          select: {
            name: true,
            username: true,
          },
        },
      },
    });
    
    if (!jobCard) {
      return NextResponse.json({ error: 'Job card not found' }, { status: 404 });
    }
    
    return NextResponse.json(jobCard);
  } catch (error) {
    console.error('Error fetching job card:', error);
    return NextResponse.json({ error: 'Failed to fetch job card' }, { status: 500 });
  }
}

// PUT update a job card
export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }
    
    const data = await request.json();
    
    // Check if the job card exists
    const existingJobCard = await prisma.jobCard.findUnique({
      where: { id },
    });
    
    if (!existingJobCard) {
      return NextResponse.json({ error: 'Job card not found' }, { status: 404 });
    }
    
    // Update the job card
    const updatedJobCard = await prisma.jobCard.update({
      where: { id },
      data,
    });
    
    return NextResponse.json(updatedJobCard);
  } catch (error) {
    console.error('Error updating job card:', error);
    return NextResponse.json({ error: 'Failed to update job card' }, { status: 500 });
  }
}

// DELETE a job card
export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }
    
    // Check if the job card exists
    const existingJobCard = await prisma.jobCard.findUnique({
      where: { id },
    });
    
    if (!existingJobCard) {
      return NextResponse.json({ error: 'Job card not found' }, { status: 404 });
    }
    
    // Delete the job card
    await prisma.jobCard.delete({
      where: { id },
    });
    
    return NextResponse.json({ message: 'Job card deleted successfully' });
  } catch (error) {
    console.error('Error deleting job card:', error);
    return NextResponse.json({ error: 'Failed to delete job card' }, { status: 500 });
  }
}
