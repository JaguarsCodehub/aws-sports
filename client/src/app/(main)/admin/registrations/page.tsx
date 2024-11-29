'use client'

import { useEffect, useState } from 'react'
import { apiClient } from '@/lib/api'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from '@/context/AuthContext'

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
    const { user } = useAuth()

    useEffect(() => {
        fetchRequests()
    }, [])

    const fetchRequests = async () => {
        try {
            setLoading(true)
            setError(null)
            console.log('Fetching registration requests...')
            const data = await apiClient('/events/registration-requests/PENDING')
            console.log('Raw response:', data)

            if (Array.isArray(data)) {
                setRequests(data)
            } else {
                console.error('Unexpected response format:', data)
                setError('Unexpected response format')
                setRequests([])
            }
        } catch (error) {
            console.error('Failed to fetch requests:', error)
            setError(error instanceof Error ? error.message : 'Failed to fetch requests')
            setRequests([])
        } finally {
            setLoading(false)
        }
    }

    const handleStatusUpdate = async (requestId: string, status: 'APPROVED' | 'REJECTED') => {
        try {
            await apiClient(`/events/registration-requests/${requestId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: status })
            })
            await fetchRequests()
        } catch (error) {
            console.error('Failed to update status:', error)
        }
    }

    if (loading) {
        return <div className="container mx-auto py-6">Loading...</div>
    }

    if (error) {
        return <div className="container mx-auto py-6 text-red-500">Error: {error}</div>
    }

    if (!requests.length) {
        return <div className="container mx-auto py-6">No pending registration requests found.</div>
    }

    return (
        <div className="container mx-auto py-6">
            <h1 className="text-2xl font-bold mb-6">Registration Requests ({requests.length})</h1>
            <div className="grid gap-4">
                {requests.map((request) => (
                    <Card key={request.id} className="shadow-md">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>{request.full_name}</CardTitle>
                                <Badge>{request.status}</Badge>
                            </div>
                            <div className="text-sm text-gray-500">
                                {new Date(request.created_at).toLocaleDateString()}
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-2">
                                <p><strong>Email:</strong> {request.email}</p>
                                <p><strong>College:</strong> {request.college_name}</p>
                                <p><strong>Year:</strong> {request.year_of_study}</p>
                                <p><strong>Phone:</strong> {request.phone_number}</p>
                                <p><strong>Why Interested:</strong> {request.why_interested}</p>
                                <div className="flex gap-2 mt-4">
                                    <Button
                                        onClick={() => handleStatusUpdate(request.id, 'APPROVED')}
                                        className="bg-green-500 hover:bg-green-600"
                                    >
                                        Approve
                                    </Button>
                                    <Button
                                        onClick={() => handleStatusUpdate(request.id, 'REJECTED')}
                                        className="bg-red-500 hover:bg-red-600"
                                    >
                                        Reject
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}