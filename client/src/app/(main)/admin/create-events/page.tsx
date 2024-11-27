'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { apiClient } from '@/lib/api'

interface EventForm {
    title: string
    description: string
    date: string
    location: string
    max_participants: number
    banner?: File
}

export default function EventsPage() {
    const router = useRouter()
    const [event, setEvent] = useState<EventForm>({
        title: '',
        description: '',
        date: '',
        location: '',
        max_participants: 0
    })
    const [banner, setBanner] = useState<File | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const formData = new FormData()
        formData.append('event', JSON.stringify(event))
        if (banner) {
            formData.append('banner', banner)
        }

        try {
            await apiClient('/events', {
                method: 'POST',
                body: formData,
                headers: {}
            })

            alert('Event created successfully!')
            router.push('/dashboard/events/list')
        } catch (error) {
            console.error('Error:', error)
            alert(error instanceof Error ? error.message : 'Failed to create event')
        }
    }

    return (
        <div className="max-w-2xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Create New Event</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block mb-1">Event Title</label>
                    <input
                        type="text"
                        value={event.title}
                        onChange={(e) => setEvent({ ...event, title: e.target.value })}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>

                <div>
                    <label className="block mb-1">Description</label>
                    <textarea
                        value={event.description}
                        onChange={(e) => setEvent({ ...event, description: e.target.value })}
                        className="w-full p-2 border rounded"
                        rows={4}
                        required
                    />
                </div>

                <div>
                    <label className="block mb-1">Date</label>
                    <input
                        type="datetime-local"
                        value={event.date}
                        onChange={(e) => setEvent({ ...event, date: e.target.value })}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>

                <div>
                    <label className="block mb-1">Location</label>
                    <input
                        type="text"
                        value={event.location}
                        onChange={(e) => setEvent({ ...event, location: e.target.value })}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>

                <div>
                    <label className="block mb-1">Maximum Participants</label>
                    <input
                        type="number"
                        value={event.max_participants}
                        onChange={(e) => setEvent({ ...event, max_participants: parseInt(e.target.value) })}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>

                <div>
                    <label className="block mb-1">Event Banner</label>
                    <input
                        type="file"
                        onChange={(e) => setBanner(e.target.files?.[0] || null)}
                        className="w-full p-2 border rounded"
                        accept="image/*"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                >
                    Create Event
                </button>
            </form>
        </div>
    )
}