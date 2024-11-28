from fastapi import APIRouter, HTTPException, UploadFile, File, Depends, Form
from boto3.dynamodb.conditions import Key
import boto3
import os
from uuid import uuid4
from datetime import datetime
from .models.models import Event
from .middleware import require_role

router = APIRouter()

# Initialize AWS clients with explicit region
dynamodb = boto3.resource('dynamodb', region_name=os.getenv('AWS_REGION'))
s3 = boto3.client('s3', region_name=os.getenv('AWS_REGION'))
events_table = dynamodb.Table(os.getenv('DYNAMODB_EVENTS_TABLE'))

@router.post("/")
async def create_event(
    title: str = Form(...),
    description: str = Form(...),
    date: str = Form(...),
    location: str = Form(...),
    max_participants: int = Form(...),
    organizer_id: str = Form(...),
    banner: UploadFile = File(None)  # Optional file upload
):
    try:
        # Convert the date string to a datetime object
        event_date = datetime.fromisoformat(date)
        event_date_str = event_date.isoformat()
    except ValueError as e:
        raise HTTPException(status_code=400, detail=f"Invalid date format: {e}")

    # Prepare event data
    event_data = {
        "id": str(uuid4()),  # Generate a unique ID
        "title": title,
        "description": description,
        "date": event_date_str,  # Store as string
        "location": location,
        "max_participants": max_participants,
        "organizer_id": organizer_id,
    }

    # Ensure all datetime fields are strings before storing
    for key, value in event_data.items():
        if isinstance(value, datetime):
            event_data[key] = value.isoformat()  # Convert to string if it's a datetime


    # Handle banner upload
    if banner:
        try:
            # Upload the file to S3
            s3_key = f"banners/{event_data['id']}/{banner.filename}"
            s3.upload_fileobj(banner.file, os.getenv('S3_BUCKET_NAME'), s3_key)
            # Store the S3 URL in the event data
            event_data['banner_url'] = f"https://{os.getenv('S3_BUCKET_NAME')}.s3.amazonaws.com/{s3_key}"
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error uploading banner: {e}")

    # Store event in DynamoDB
    try:
        events_table.put_item(Item=event_data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error storing event: {e}")

    return {"message": "Event created successfully", "banner_url": event_data.get('banner_url')}

@router.get("/events/{event_id}")
async def get_event(event_id: str):
    try:
        response = events_table.get_item(Key={'id': event_id})
        if 'Item' not in response:
            raise HTTPException(status_code=404, detail="Event not found")
        return response['Item']
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/events/{event_id}/register")
@require_role("participant")
async def register_for_event(event_id: str, user_id: str):
    try:
        # Get event
        response = events_table.get_item(Key={'id': event_id})
        if 'Item' not in response:
            raise HTTPException(status_code=404, detail="Event not found")
        
        event = response['Item']
        if len(event['participants']) >= event['max_participants']:
            raise HTTPException(status_code=400, detail="Event is full")
            
        # Add participant
        events_table.update_item(
            Key={'id': event_id},
            UpdateExpression="SET participants = list_append(participants, :user)",
            ExpressionAttributeValues={':user': [user_id]}
        )
        
        return {"message": "Successfully registered for event"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/events/organizer/{organizer_id}")
@require_role("organizer")
async def get_organizer_events(organizer_id: str):
    try:
        response = events_table.query(
            IndexName='organizer-index',
            KeyConditionExpression=Key('organizer_id').eq(organizer_id)
        )
        return response['Items']
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/")
async def get_all_events():
    try:
        response = events_table.scan()  # Use scan to get all items
        return response['Items']  # Return the list of events
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
