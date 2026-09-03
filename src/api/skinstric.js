export async function submitPhaseOne(name, location) {
  const response = await fetch(
    'https://us-central1-frontend-simplified.cloudfunctions.net/skinstricPhaseOne',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, location }),
    }
  );

  if (!response.ok) {
    throw new Error('Failed to submit user details to Phase 1 API.');
  }

  return response.json();
}

export async function submitPhaseTwo(base64Image) {
  // Ensure we send clean base64 string
  const cleanBase64 = base64Image.includes(',')
    ? base64Image.split(',')[1]
    : base64Image;

  const response = await fetch(
    'https://us-central1-frontend-simplified.cloudfunctions.net/skinstricPhaseTwo',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ image: cleanBase64 }),
    }
  );

  const data = await response.json();

  if (!response.ok || data.success === false) {
    throw new Error(data.message || 'Failed to process image with Phase 2 API.');
  }

  return data;
}
