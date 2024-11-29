'use client'
import { useEffect, useState } from 'react'
import { apiClient } from '@/lib/api'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { RegistrationModal } from '@/components/RegistrationModal'

interface Event {
  id: string
  title: string
  description: string
  date: string
  location: string
  max_participants: number
  banner_url?: string
  participants?: string[]
}

const EventsPage = () => {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const { user, logout } = useAuth()
  const router = useRouter();
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null)
  const [showRegistrationModal, setShowRegistrationModal] = useState(false)

  const handleRegister = (eventId: string) => {
    setSelectedEventId(eventId)
    setShowRegistrationModal(true)
  }

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
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Project Name</h1>
        {user ? (
          <button onClick={() => logout} className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
            Sign Out
          </button>
        ) : (
          <button onClick={() => router.push('/admin-login')} className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
            Login
          </button>
        )}
      </header>
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
              className="mt-4 w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
              onClick={() => handleRegister(event.id)}
              disabled={!user}
            >
              {user ? 'Register for Event' : 'Login to Register'}
            </button>
          </div>
        ))}
      </div>
      {showRegistrationModal && selectedEventId && (
        <RegistrationModal
          isOpen={showRegistrationModal}
          onClose={() => setShowRegistrationModal(false)}
          eventId={selectedEventId}
          onSuccess={() => {
            alert('Registration request submitted successfully! Admin will review your application.')
          }}
        />
      )}
    </div>
  )
}

export default EventsPage