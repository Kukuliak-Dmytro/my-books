import apiClient from "@/lib/http";

export async function registerUser(username: string, email: string, password: string) {
    const response = await apiClient.post('/auth/register', {
        full_name: username,
        email,
        password
    });
    localStorage.setItem('accessToken', response.data.accessToken);
    localStorage.setItem('refreshToken', response.data.refreshToken);
    return response.data;
}
export async function loginUser(email: string, password: string) {
    const response = await apiClient.post('/auth/login', {
        email,
        password
    });
    localStorage.setItem('accessToken', response.data.accessToken);
    localStorage.setItem('refreshToken', response.data.refreshToken);
    return response.data;
}
export async function verifyToken(token: string) {
    const response = await apiClient.post('/auth/verify', { token });
    return response.data;
}