'use client'
import { useState } from 'react'

export default function AdminSignup() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [adminKey, setAdminKey] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const response = await fetch(
                `http://localhost:8000/auth/create-organizer?admin_key=${adminKey}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email,
                        password
                    })
                }
            )
            if (response.ok) {
                alert('Organizer account created successfully!')
                // Redirect to login or dashboard
            } else {
                const error = await response.json()
                alert(error.detail || 'Failed to create organizer account')
            }
        } catch (error) {
            console.error('Error:', error)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto mt-8">
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border rounded"
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border rounded"
            />
            <input
                type="password"
                placeholder="Admin Key"
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
                className="w-full p-2 border rounded"
            />
            <button
                type="submit"
                className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
                Create Organizer Account
            </button>
        </form>
    )
}