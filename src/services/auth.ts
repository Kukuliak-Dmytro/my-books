import apiClient from '@/lib/http';

// Decode JWT token to get user data
export function getCurrentUserFromToken(): { userId: string; email: string; fullName: string; role: string } | null {
  const token = localStorage.getItem('accessToken');
  if (!token) return null;

  try {
    // Decode JWT payload (this is safe since we're only reading the payload, not verifying)
    const payload = JSON.parse(atob(token.split('.')[1]));
    return {
      userId: payload.userId,
      email: payload.email,
      fullName: payload.fullName,
      role: payload.role || 'user'
    };
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
}

export async function registerUser(
  username: string,
  email: string,
  password: string
) {
  const response = await apiClient.post('/auth/register', {
    full_name: username,
    email,
    password,
  });
  localStorage.setItem('accessToken', response.data.data.accessToken);
  localStorage.setItem('refreshToken', response.data.data.refreshToken);
  return response.data.data;
}
export async function loginUser(email: string, password: string) {
  const response = await apiClient.post('/auth/login', {
    email,
    password,
  });
  localStorage.setItem('accessToken', response.data.data.accessToken);
  localStorage.setItem('refreshToken', response.data.data.refreshToken);
  return response.data.data;
}
export async function verifyToken(token: string) {
  const response = await apiClient.post('/auth/verify', { token });
  return response.data.data;
}