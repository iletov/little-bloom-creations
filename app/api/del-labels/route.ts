import prisma from '@/lib/prismaClient';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(req: NextRequest) {
  try {
    const days = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const result = await prisma.userCheckout.deleteMany({
      where: {
        createdAt: {
          lt: days,
        },
      },
    });

    console.log(`Deleted ${result.count} old checkouts`);

    return NextResponse.json({
      message: 'Old checkouts deleted successfully',
      deletedCount: result.count,
    });
  } catch (error) {
    console.error('Error deleting old checkouts:', error);
    return NextResponse.json(
      { message: 'Failed to delete old checkouts' },
      { status: 500 },
    );
  }
}
