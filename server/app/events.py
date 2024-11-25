from fastapi import APIRouter
import boto3

router = APIRouter()

# Initialize DynamoDB client
dynamodb = boto3.resource("dynamodb", region_name="your-region")
events_table = dynamodb.Table("Events")

@router.post("/")
def create_event(event_name: str, event_date: str, location: str):
    response = events_table.put_item(
        Item={
            "EventID": "event-123",  # Generate dynamically
            "EventName": event_name,
            "EventDate": event_date,
            "Location": location
        }
    )
    return {"message": "Event created successfully", "response": response}

@router.get("/")
def list_events():
    response = events_table.scan()
    return {"events": response.get("Items", [])}
