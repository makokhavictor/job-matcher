const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

export const serverApiClient = async (
  url: string, 
  options: RequestInit = {}, 
  authToken?: string
) => {
  if (!BACKEND_API_URL) {
    throw new Error('Backend API URL is not configured');
  }

  const config: RequestInit = {
    ...options,
    headers: {
      ...options.headers,
      // Add Authorization header if token is provided
      ...(authToken && { Authorization: `Bearer ${authToken}` }),
    },
  };

  const response = await fetch(`${BACKEND_API_URL}${url}`, config);

  if (!response.ok) {
    let errorDetail = undefined;
    try {
      const data = await response.json();
      errorDetail = data.detail || data.message || undefined;
      throw { 
        message: `HTTP error! status: ${response.status}`,
        status: response.status,
        detail: errorDetail,
        raw: data
      };
    } catch (e) {
      // If not JSON, throw default error
      if (e instanceof SyntaxError) {
        throw new Error(`HTTP error! status: ${response.status}`);
      } else {
        throw e;
      }
    }
  }

  return response.json();
};
