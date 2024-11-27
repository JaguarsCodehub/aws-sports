from fastapi import APIRouter, Depends
from .middleware import require_role
from pydantic import BaseModel
from typing import List

router = APIRouter()

class Event(BaseModel):
    title: str
    description: str
    date: str
    location: str
    max_participants: int

@router.post("/create")
@require_role("organizer")
async def create_event(event: Event):
    # Add event to database
    return {"message": "Event created successfully"}

@router.post("/{event_id}/register")
@require_role("participant")
async def register_for_event(event_id: str):
    # Register participant for event
    return {"message": "Successfully registered for event"}
