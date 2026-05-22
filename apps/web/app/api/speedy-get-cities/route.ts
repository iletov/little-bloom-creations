import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const speedyUrl = process.env.SPEEDY_BASE_URL;
  const userName = process.env.SPEEDY_USER;
  const password = process.env.SPEEDY_PASS;

  try {
    const response = await fetch(`${speedyUrl}/location/site`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userName: userName,
        password: password,
        countryId: '100',
      }),
    });

    if (!response.ok) {
      throw new Error(`Speedy API getCountries error: ${response.status}`);
    }

    const data = await response.json();
    // console.log('Speedy Cities', data.sites);

    return NextResponse.json(data.sites, {
      status: 200,
      headers: {
        'Cache-Control': 'private, max-age=3600',
      },
    });
  } catch (error) {
    console.error('Error fetching cities:', error);
    return NextResponse.json(
      { message: 'Failed to fetch cities', error: (error as Error).message },
      { status: 500 },
    );
  }
}
