import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const ekontApiKey = process.env.ECONT_API_KEY;
  const ekontUrl = process.env.EKONT_API_URL;
  const auth = Buffer.from(`${ekontApiKey}`).toString('base64');

  try {
    const body = await req.json();
    // console.log('Received body:', body);

    const requestBody = {
      countryCode: body.countryCode || 'BGR',
      cityId: body.cityId || undefined,
    };

    // console.log('Sending to Ekont:', requestBody);

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

    const offices = data?.offices.filter(
      (office: any) =>
        office.isAPS == false && office.address.city.id === body.cityId,
    );

    return NextResponse.json(offices, {
      status: 200,
    });
  } catch (error) {
    console.error('Error fetching offices:', error);
    return NextResponse.json(
      { message: 'Failed to fetch offices', error: (error as Error).message },
      { status: 500 },
    );
  }
}
