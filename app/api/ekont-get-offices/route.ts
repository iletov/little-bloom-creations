import { NextRequest, NextResponse } from 'next/server';

//NOT IN USE!

export async function POST(req: NextRequest) {
  const ekontApiKey = process.env.ECONT_API_KEY;
  const ekontUrl = process.env.EKONT_API_URL;
  const auth = Buffer.from(`${ekontApiKey}`).toString('base64');

  try {
    const filters = await req.json();

    const requestBody = {
      countryCode: filters.countryCode || 'BGR',
      cityId: filters.cityId || undefined,
    };

    const response = await fetch(
      `${ekontUrl}/Nomenclatures/NomenclaturesService.getOffices.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${auth}`,
        },
        body: JSON.stringify(requestBody),
      },
    );

    if (!response.ok) {
      throw new Error(`Econt API getOffices error: ${response.status}`);
    }
    const data = await response.json();

    return NextResponse.json(data.offices, {
      status: 200,
      headers: {
        'Cache-Control': 'private, max-age=3600',
      },
    });
  } catch (error) {
    console.error('Error fetching offices:', error);
    return NextResponse.json(
      { message: 'Failed to fetch offices', error: (error as Error).message },
      { status: 500 },
    );
  }
}
