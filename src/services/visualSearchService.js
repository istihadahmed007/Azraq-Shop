/**
 * Client Visual Search Service
 * Dispatches image search queries to backend /api/search-by-image
 * Strictly avoids inaccurate color/modulo browser fallbacks that cause category leakage.
 */

export async function performVisualSearch({ imageBase64, mimeType = 'image/jpeg', filters = {} }) {
  if (!imageBase64) {
    throw new Error('Please select or capture a photo first.');
  }

  const startTime = Date.now();

  try {
    const response = await fetch('/api/search-by-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        imageBase64,
        mimeType,
        filters
      })
    });

    if (!response.ok) {
      let errorMessage = `Server error (${response.status})`;
      try {
        const errJson = await response.json();
        if (errJson && errJson.error) {
          errorMessage = errJson.error;
        }
      } catch (e) {}
      throw new Error(errorMessage);
    }

    const data = await response.json();
    if (!data || !data.success) {
      throw new Error((data && data.error) || 'Visual search could not process the photo.');
    }

    return data;
  } catch (err) {
    console.error('[Visual Search Service Error]:', err.message);
    throw new Error(
      err.message || 'Visual search is currently unavailable. Please try again or search by keyword.'
    );
  }
}
