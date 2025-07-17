export const apiClient = async (url: string, options: RequestInit = {}) => {
  // Get token from wherever you store it (localStorage, cookies, etc.)
  const auth = localStorage.getItem('auth');
  const token = auth ? JSON.parse(auth).access_token : null;

  const config = {
    ...options,
    headers: {
      ...options.headers,
      // Only add Authorization header if token exists
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  };

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL

  const response = await fetch(`${backendUrl}${url}`, config);

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