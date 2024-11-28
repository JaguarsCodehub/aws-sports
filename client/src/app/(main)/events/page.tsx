'use client'
import { useEffect, useState } from 'react'
import { apiClient } from '@/lib/api'

interface Event {
  id: string
  title: string
  description: string
  date: string
  location: string
  max_participants: number
  banner_url?: string
}

const EventsPage = () => {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await apiClient('/events')
        setEvents(response)
        console.log("Event Data for participants: ", response)
      } catch (error) {
        console.error('Failed to fetch events:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  if (loading) {
    return <div>Loading events...</div>
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Available Events</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <div key={event.id} className="border rounded-lg shadow-sm p-4">
            {event.banner_url && (
              <img
                src={event.banner_url}
                alt={event.title}
                className="w-full h-48 object-cover rounded-t-lg mb-4"
              />
            )}
            <h2 className="text-xl font-semibold mb-2">{event.title}</h2>
            <p className="text-gray-600 mb-2">{event.description}</p>
            <div className="text-sm text-gray-500">
              <p>📍 {event.location}</p>
              <p>📅 {new Date(event.date).toLocaleDateString()}</p>
              <p>👥 Max Participants: {event.max_participants}</p>
            </div>
            <button
              className="mt-4 w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
              onClick={() => {/* Add registration handler */ }}
            >
              Register for Event
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default EventsPage