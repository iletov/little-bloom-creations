import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const speedyUrl = process.env.SPEEDY_BASE_URL;
  const user = process.env.SPEEDY_USER;
  const password = process.env.SPEEDY_PASS;

  try {
    const body = await req.json();
    console.log('Received body:', body);

    const response = await fetch(`${speedyUrl}/location/office`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userName: user,
        password: password,
        siteId: body.siteId,
      }),
    });

    if (!response.ok) {
      throw new Error(
        `Speedy API get speedy offices error: ${response.status}`,
      );
    }

    const data = await response.json();
    // console.log('Speedy Speedy Offices', data.offices);
    const offices = data.offices.filter(
      (office: any) => office?.type !== 'APT',
    );

    return NextResponse.json(offices, {
      status: 200,
      headers: {
        'Cache-Control': 'private, max-age=3600',
      },
    });
  } catch (error) {
    console.error('Error fetching speedy offices:', error);
    return NextResponse.json(
      {
        message: 'Failed to fetch speedy offices',
        error: (error as Error).message,
      },
      { status: 500 },
    );
  }
}
