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

export default function CreateEvent() {
    const router = useRouter()
    const [event, setEvent] = useState<EventForm>({
        title: '',
        description: '',
        date: '',
        location: '',
        max_participants: 0,
    })
    const [banner, setBanner] = useState<File | null>(null)
    const [error, setError] = useState<string | null>(null)

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === 'max_participants') {
            setEvent((prev) => ({
                ...prev,
                [name]: Number(value)
            }));
        } else {
            setEvent((prev) => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        const formData = new FormData();
        formData.append('title', event.title);
        formData.append('description', event.description);
        formData.append('date', new Date(event.date).toISOString());
        formData.append('location', event.location);
        formData.append('max_participants', String(event.max_participants));
        formData.append('organizer_id', localStorage.getItem('organizer_id')!);
        if (banner) {
            formData.append('banner', banner);
        }

        try {
            const response = await fetch('http://localhost:8000/events', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.detail || 'Failed to create event');
            }

            alert('Event created successfully!');
            router.push('/admin/events');
        } catch (error) {
            setError(error instanceof Error ? error.message : 'An error occurred');
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Create New Event</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block mb-1">Event Title</label>
                    <input
                        type="text"
                        name="title"
                        value={event.title}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>

                <div>
                    <label className="block mb-1">Description</label>
                    <input
                        name="description"
                        value={event.description}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                        // rows={4}
                        required
                    />
                </div>

                <div>
                    <label className="block mb-1">Date</label>
                    <input
                        type="datetime-local"
                        name="date"
                        value={event.date}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>

                <div>
                    <label className="block mb-1">Location</label>
                    <input
                        type="text"
                        name="location"
                        value={event.location}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>

                <div>
                    <label className="block mb-1">Maximum Participants</label>
                    <input
                        type="number"
                        name="max_participants"
                        value={event.max_participants}
                        onChange={handleInputChange}
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

                {error && <div className="text-red-500">{error}</div>}

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