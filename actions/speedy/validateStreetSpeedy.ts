'use server';

export const validateStreetSpeedy = async (
  streetName: string | undefined,
  siteId: number,
) => {
  const speedyUrl = process.env.SPEEDY_BASE_URL;
  const userName = process.env.SPEEDY_USER;
  const password = process.env.SPEEDY_PASS;

  const labelData = {
    userName,
    password,
    siteId,
    name: streetName,
  };

  try {
    const res = await fetch(`${speedyUrl}/location/street`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(labelData),
    });

    if (!res.ok) {
      throw new Error(`Speedy API calculateLabel error: ${res.statusText}`);
    }

    const data = await res.json();

    return data.streets?.[0];
  } catch (error) {
    console.error('Error calculating label:', error);
    return null;
  }
};
