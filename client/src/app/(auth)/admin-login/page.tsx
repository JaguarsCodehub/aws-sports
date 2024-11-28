'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import routes from '@/lib/routes'

export default function AdminLogin() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        try {
            const response = await fetch('http://localhost:8000/auth/admin/signin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email,
                    password
                })
            })

            if (!response.ok) {
                const data = await response.json()
                throw new Error(data.detail || 'Login failed')
            }

            const result = await response.json()
            localStorage.setItem('token', result.token)
            localStorage.setItem('organizer_id', result.organizer_id)
            console.log('Token stored:', result.token)
            router.push(routes.admin.eventsList)
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Login failed')
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50">
            <Card className="w-[400px]">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">
                        Organizer Login
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Email</label>
                            <Input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Password</label>
                            <Input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        {error && (
                            <div className="text-red-500 text-sm text-center">{error}</div>
                        )}
                        <Button type="submit" className="w-full">
                            Login
                        </Button>
                        <div className="text-center text-sm">
                            <Button
                                variant="link"
                                onClick={() => router.push(routes.auth.organizer)}
                            >
                                Register as new organizer
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}