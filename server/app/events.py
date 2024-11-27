from fastapi import APIRouter, HTTPException, UploadFile, File, Depends
from boto3.dynamodb.conditions import Key
import boto3
import os
from uuid import uuid4
from datetime import datetime
from .models import Event, EventStatus
from .middleware import require_role

router = APIRouter()

# Initialize AWS clients
dynamodb = boto3.resource('dynamodb')
s3 = boto3.client('s3')
events_table = dynamodb.Table(os.getenv('DYNAMODB_EVENTS_TABLE'))

@router.post("/events")
@require_role("organizer")
async def create_event(event: Event, banner: UploadFile = File(None)):
    try:
        # Generate unique event ID
        event_id = str(uuid4())
        event.id = event_id
        
        # Upload banner to S3 if provided
        if banner:
            bucket_name = os.getenv('S3_BUCKET_NAME')
            file_key = f"events/{event_id}/{banner.filename}"
            s3.upload_fileobj(banner.file, bucket_name, file_key)
            event.banner_url = f"https://{bucket_name}.s3.amazonaws.com/{file_key}"

        # Store event in DynamoDB
        events_table.put_item(Item=event.dict())
        
        return {"message": "Event created successfully", "event_id": event_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

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
