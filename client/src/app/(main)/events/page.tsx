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
    const event = events.find(e => e.id === eventId);
    if (event && isUserRegistered(event)) {
      alert('You are already registered for this event');
      return;
    }
    
    setSelectedEventId(eventId);
    setShowRegistrationModal(true);
  }

  const isUserRegistered = (event: Event) => {
    return event.participants?.includes(user?.id || '');
  };

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
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-md py-4 mb-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-800 font-serif">Sports101</h1>
            {user ? (
              <button onClick={() => logout} className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition duration-200">
                Sign Out
              </button>
            ) : (
              <button onClick={() => router.push('/admin-login')} className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition duration-200">
                Login
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 mt-20">
        <h1 className="text-4xl font-bold text-gray-900 font-serif">Upcoming Events</h1>
        <p className="text-gray-600 text-lg mb-4 font-serif">Find the best events for you to participate in!</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <div key={event.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition duration-300">
              {event.banner_url && (
                <div className="relative h-56">
                  <img
                    src={event.banner_url}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-3 font-serif">{event.title}</h2>
                <p className="text-gray-600 text-lg mb-4 font-serif">{event.description}</p>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-gray-700">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-base font-medium">{event.location}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-700">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-base font-medium">{new Date(event.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-700">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span className="text-base font-medium">
                      {event.participants ? `${event.participants.length} / ${event.max_participants} participants` : `0 / ${event.max_participants} participants`}
                    </span>
                  </div>
                </div>

                <button
                  className={`w-full py-3 px-4 rounded-lg text-white font-semibold transition duration-200 ${
                    !user 
                      ? 'bg-gray-400'
                      : isUserRegistered(event)
                        ? 'bg-stone-500 cursor-not-allowed'
                        : 'bg-black hover:bg-stone-800'
                  }`}
                  onClick={() => handleRegister(event.id)}
                  disabled={!user || isUserRegistered(event)}
                >
                  {!user 
                    ? 'Login to Register' 
                    : isUserRegistered(event)
                      ? 'Already Registered'
                      : 'Register for Event'
                  }
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {showRegistrationModal && selectedEventId && (
        <RegistrationModal
          isOpen={showRegistrationModal}
          onClose={() => setShowRegistrationModal(false)}
          eventId={selectedEventId}
          onSuccess={() => {
            alert('Registration successful! You are now registered for this event.')
          }}
        />
      )}
    </div>
  )
}

export default EventsPage