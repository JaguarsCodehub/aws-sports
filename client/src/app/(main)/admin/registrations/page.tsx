'use client'

import { useEffect, useState } from 'react'
import { apiClient } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'

interface RegistrationRequest {
    id: string
    event_id: string
    user_id: string
    status: 'PENDING' | 'APPROVED' | 'REJECTED'
    full_name: string
    email: string
    college_name: string
    year_of_study: string
    phone_number: string
    why_interested: string
    created_at: string
}

export default function RegistrationsPage() {
    const [requests, setRequests] = useState<RegistrationRequest[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const { user, logout } = useAuth()
    const router = useRouter()

    useEffect(() => {
        fetchRequests()
    }, [])

    const fetchRequests = async () => {
        try {
            setLoading(true)
            setError(null)
            const data = await apiClient('/events/registration-requests')
            if (Array.isArray(data)) {
                setRequests(data)
            } else {
                setError('Unexpected response format')
                setRequests([])
            }
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Failed to fetch requests')
            setRequests([])
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return <div className="min-h-screen bg-gray-50 flex items-center justify-center font-serif">Loading...</div>
    }

    if (error) {
        return <div className="min-h-screen bg-gray-50 flex items-center justify-center text-red-600 font-serif">Error: {error}</div>
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow-md py-4 mb-8">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex justify-between items-center">
                        <h1 className="text-3xl font-bold text-gray-800 font-serif">Sports101</h1>
                        {user ? (
                            <button 
                                onClick={() => logout()} 
                                className="bg-stone-700 text-white px-6 py-2 rounded-lg hover:bg-stone-800 transition duration-200 font-serif"
                            >
                                Sign Out
                            </button>
                        ) : (
                            <button 
                                onClick={() => router.push('/admin-login')} 
                                className="bg-stone-700 text-white px-6 py-2 rounded-lg hover:bg-stone-800 transition duration-200 font-serif"
                            >
                                Login
                            </button>
                        )}
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 mt-8">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 font-serif mb-2">Registration Requests</h1>
                    <p className="text-gray-600 text-lg font-serif">Manage participant registrations for all events</p>
                </div>

                {!requests.length ? (
                    <p className="text-gray-600 text-lg font-serif">No pending registration requests found.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {requests.map((request) => (
                            <Card key={request.id} className="shadow-lg hover:shadow-xl transition duration-300 bg-white">
                                <CardHeader className="flex flex-row items-center justify-between bg-stone-500 text-white rounded-t-lg">
                                    <div>
                                        <CardTitle className="font-serif text-2xl">{request.full_name}</CardTitle>
                                        <Badge className="bg-stone-700 text-white mt-2">{request.status}</Badge>
                                    </div>
                                    <div className="text-sm text-stone-200 font-serif">
                                        {new Date(request.created_at).toLocaleDateString('en-US', {
                                            weekday: 'long',
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </div>
                                </CardHeader>
                                <CardContent className="mt-4">
                                    <div className="grid gap-3 text-gray-700 font-serif">
                                        <p><span className="font-semibold">Email:</span> {request.email}</p>
                                        <p><span className="font-semibold">College:</span> {request.college_name}</p>
                                        <p><span className="font-semibold">Year:</span> {request.year_of_study}</p>
                                        <p><span className="font-semibold">Phone:</span> {request.phone_number}</p>
                                        <p><span className="font-semibold">Why Interested:</span> {request.why_interested}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </main>
        </div>
    )
}