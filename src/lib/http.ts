import axios from "axios";

const apiClient = axios.create({
    baseURL: '/api/',
    headers: {
        "Content-Type": "application/json",
    },
});

// Flag to prevent multiple refresh attempts
let isRefreshing = false;
let failedQueue: Array<{
    resolve: (value: any) => void;
    reject: (error: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach(({ resolve, reject }) => {
        if (error) {
            reject(error);
        } else {
            resolve(token);
        }
    });
    
    failedQueue = [];
};

// Add a request interceptor to include the authorization header
apiClient.interceptors.request.use(
    (config) => {
        // Get token from localStorage
        const token = localStorage.getItem('accessToken');
        
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle token refresh
apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                // If we're already refreshing, queue this request
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then(token => {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return apiClient(originalRequest);
                }).catch(err => {
                    return Promise.reject(err);
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            const refreshToken = localStorage.getItem('refreshToken');

            if (refreshToken) {
                try {
                    console.log('🔄 Attempting to refresh access token...');
                    const response = await axios.post('/api/auth/refresh', {
                        refreshToken: refreshToken
                    });

                    const { accessToken, refreshToken: newRefreshToken } = response.data.data;

                    // Update stored tokens
                    localStorage.setItem('accessToken', accessToken);
                    localStorage.setItem('refreshToken', newRefreshToken);

                    // Update default authorization header
                    apiClient.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
                    originalRequest.headers.Authorization = `Bearer ${accessToken}`;

                    console.log('✅ Access token refreshed successfully');
                    processQueue(null, accessToken);

                    return apiClient(originalRequest);
                } catch (refreshError) {
                    console.log('❌ Token refresh failed:', refreshError);
                    processQueue(refreshError, null);
                    
                    // Clear tokens and redirect to login
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                    
                    // Redirect to login page
                    window.location.href = '/auth/login';
                    
                    return Promise.reject(refreshError);
                } finally {
                    isRefreshing = false;
                }
            } else {
                console.log('❌ No refresh token available');
                // No refresh token, redirect to login
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                window.location.href = '/auth/login';
                return Promise.reject(error);
            }
        }

        return Promise.reject(error);
    }
);

export default apiClient;
