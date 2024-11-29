export const apiClient = async (endpoint: string, options: RequestInit = {}) => {
    const token = localStorage.getItem('token')

    const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
    }

    const url = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}${endpoint}`;
    console.log('Making request to:', url);
    console.log('Request options:', {
        ...options,
        headers,
        body: options.body
    });

    try {
        const response = await fetch(url, {
            ...options,
            headers,
            mode: 'cors',
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error response:', errorText);
            try {
                const errorJson = JSON.parse(errorText);
                throw new Error(errorJson.detail || 'API request failed');
            } catch {
                throw new Error(errorText);
            }
        }

        const data = await response.json();
        console.log('Response data:', data);
        return data;
    } catch (error) {
        console.error('API request failed:', error);
        throw error;
    }
}