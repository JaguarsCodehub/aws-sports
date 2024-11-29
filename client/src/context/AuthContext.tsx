'use client'
import { createContext, useContext, useState, useEffect } from 'react'

interface User {
    id: string
    email: string
    token: string
    role: string
}

interface AuthContextType {
    user: User | null
    login: (userData: User) => Promise<void>
    logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)

    useEffect(() => {
        // Check for stored auth data on component mount
        const token = localStorage.getItem('token')
        if (token) {
            try {
                const decodedToken = parseJwt(token)
                setUser({
                    id: decodedToken.sub,
                    email: decodedToken.email,
                    token: token,
                    role: decodedToken['custom:role']
                })
            } catch (error) {
                console.error('Error parsing token:', error)
                localStorage.removeItem('token')
            }
        }
    }, [])

    const login = async (userData: User) => {
        setUser(userData)
        localStorage.setItem('token', userData.token)
    }

    const logout = async () => {
        setUser(null)
        localStorage.removeItem('token')
    }

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}

function parseJwt(token: string) {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
        atob(base64)
            .split('')
            .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
    )
    return JSON.parse(jsonPayload)
}