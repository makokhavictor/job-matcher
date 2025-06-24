export const apiClient = async (url: string, options: RequestInit = {}) => {
  // Get token from wherever you store it (localStorage, cookies, etc.)
  
  const auth = localStorage.getItem('auth');
  const token = auth ? JSON.parse(auth).access_token : null;
  
  
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
      // Only add Authorization header if token exists
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  };

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL

  const response = await fetch(`${backendUrl}${url}`, config);
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response.json();
};