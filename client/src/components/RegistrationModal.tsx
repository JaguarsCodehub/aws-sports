'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { apiClient } from '@/lib/api'

interface RegistrationModalProps {
    isOpen: boolean
    onClose: () => void
    eventId: string
    onSuccess: () => void
}

export function RegistrationModal({ isOpen, onClose, eventId, onSuccess }: RegistrationModalProps) {
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        college_name: '',
        year_of_study: '',
        phone_number: '',
        why_interested: ''
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await apiClient(`/events/${eventId}/register-request`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })
            onSuccess()
            onClose()
        } catch (error) {
            console.error('Failed to submit registration:', error)
            alert('Failed to submit registration. Please try again.')
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Event Registration</DialogTitle>
                    <DialogDescription>
                        Please fill in your details to register for this event.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="full_name">Full Name</Label>
                        <Input
                            id="full_name"
                            value={formData.full_name}
                            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="college_name">College Name</Label>
                        <Input
                            id="college_name"
                            value={formData.college_name}
                            onChange={(e) => setFormData({ ...formData, college_name: e.target.value })}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="year_of_study">Year of Study</Label>
                        <Select
                            value={formData.year_of_study}
                            onValueChange={(value) => setFormData({ ...formData, year_of_study: value })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select year" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="1">First Year</SelectItem>
                                <SelectItem value="2">Second Year</SelectItem>
                                <SelectItem value="3">Third Year</SelectItem>
                                <SelectItem value="4">Fourth Year</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="phone_number">Phone Number</Label>
                        <Input
                            id="phone_number"
                            value={formData.phone_number}
                            onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="why_interested">Why are you interested in this event?</Label>
                        <Textarea
                            id="why_interested"
                            value={formData.why_interested}
                            onChange={(e) => setFormData({ ...formData, why_interested: e.target.value })}
                            required
                        />
                    </div>
                    <Button type="submit" className="w-full">Submit Registration</Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}