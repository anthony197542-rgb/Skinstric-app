async function fetchWithTimeout(url, options, timeoutMs = 15000) {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('The analysis service took too long to respond. Please try again.');
    }
    throw error;
  } finally {
    window.clearTimeout(timeout);
  }
}

export async function submitPhaseOne(name, location) {
  const response = await fetchWithTimeout(
    '/skinstric-api/skinstricPhaseOne',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, location }),
    }
  );

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'Failed to submit user details to Phase 1 API.');
  }

  return data;
}

export async function submitPhaseTwo(base64Image) {
  // Ensure we send clean base64 string
  const cleanBase64 = base64Image.includes(',')
    ? base64Image.split(',')[1]
    : base64Image;

  const response = await fetchWithTimeout(
    '/skinstric-api/skinstricPhaseTwo',
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
