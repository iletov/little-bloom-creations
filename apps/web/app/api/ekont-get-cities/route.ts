import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  // const searchParams = req.nextUrl.searchParams;
  // const country = searchParams.get('country') || '';
  const ekontApiKey = process.env.ECONT_API_KEY;
  const ekontUrl = process.env.EKONT_API_URL;
  const auth = Buffer.from(`${ekontApiKey}`).toString('base64');

  try {
    const response = await fetch(
      `${ekontUrl}/Nomenclatures/NomenclaturesService.getCities.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${auth}`,
        },
        body: JSON.stringify({ countryCode: 'BGR' }),
      },
    );

    if (!response.ok) {
      throw new Error(`Econt API getCountries error: ${response.status}`);
    }
    const data = await response.json();

    return NextResponse.json(data.cities, {
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
