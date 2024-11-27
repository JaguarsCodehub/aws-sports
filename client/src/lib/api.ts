const API_BASE_URL = 'http://localhost:8000'

export async function apiClient(endpoint: string, options: RequestInit = {}) {
    const token = localStorage.getItem('token')

    const defaultHeaders: HeadersInit = {
        'Content-Type': 'application/json',
    }

    if (token) {
        defaultHeaders['Authorization'] = `Bearer ${token}`
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers,
        },
    })

    if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || 'Something went wrong')
    }

    return response.json()
}