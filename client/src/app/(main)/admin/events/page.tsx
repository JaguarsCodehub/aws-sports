'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { apiClient } from '@/lib/api'

interface Event {
    id: string
    title: string
    date: string
    location: string
    max_participants: number
    participants: string[]
    banner_url?: string
}

export default function EventsList() {
    const [events, setEvents] = useState<Event[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const data = await apiClient('/events/organizer/me')
                setEvents(data)
            } catch (error) {
                setError(error instanceof Error ? error.message : 'Failed to fetch events')
            } finally {
                setLoading(false)
            }
        }

        fetchEvents()
    }, [])

    if (loading) return <div>Loading...</div>
    if (error) return <div>Error: {error}</div>

    return (
        <div className="max-w-4xl mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">My Events</h1>
                <Link
                    href="/dashboard/events"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Create New Event
                </Link>
            </div>

            {events.length === 0 ? (
                <p>No events found. Create your first event!</p>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {events.map((event) => (
                        <div key={event.id} className="border rounded-lg p-4 shadow-sm">
                            {event.banner_url && (
                                <img
                                    src={event.banner_url}
                                    alt={event.title}
                                    className="w-full h-40 object-cover rounded mb-4"
                                />
                            )}
                            <h2 className="text-xl font-semibold mb-2">{event.title}</h2>
                            <p className="text-gray-600 mb-2">
                                {new Date(event.date).toLocaleDateString()}
                            </p>
                            <p className="text-gray-600 mb-2">{event.location}</p>
                            <p className="text-gray-600">
                                Participants: {event.participants.length}/{event.max_participants}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}