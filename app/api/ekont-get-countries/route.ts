import { NextRequest, NextResponse } from 'next/server';
//NOT IN USE!
export async function GET() {
  const ekontApiKey = process.env.ECONT_API_KEY;
  const ekontUrl = process.env.EKONT_API_URL;
  const auth = Buffer.from(`${ekontApiKey}`).toString('base64');

  try {
    const response = await fetch(
      `${ekontUrl}/Nomenclatures/NomenclaturesService.getCountries.json`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${auth}`,
        },
        cache: 'force-cache',
        next: {
          revalidate: 86400, // 24 hours in seconds
          tags: ['countries'], // Add a tag for targeted revalidation
        },
      },
    );

    if (!response.ok) {
      throw new Error(`Econt API getCountries error: ${response.status}`);
    }
    const data = await response.json();

    return NextResponse.json(data.countries, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=43200',
      },
    });
  } catch (error) {
    console.error('Error while fetching countries:', error);
    return NextResponse.json(
      { message: 'Failed to fetch countries', error: (error as Error).message },
      { status: 500 },
    );
  }
}
