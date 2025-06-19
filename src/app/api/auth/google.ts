import type { NextApiRequest, NextApiResponse } from 'next';

interface GoogleAuthResponse {
  // Add specific response data types based on your API
  token?: string;
  user?: {
    id: string;
    email: string;
    // ... other user fields
  };
  message?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GoogleAuthResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const response = await fetch(`${process.env.BACKEND_URL}/auth/google`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    
    if (response.ok) {
      res.status(200).json(data);
    } else {
      res.status(response.status).json(data);
    }
  } catch (error: unknown) {
    console.error('Error during Google authentication:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}