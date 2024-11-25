from fastapi import APIRouter
import boto3
from botocore.exceptions import ClientError

router = APIRouter()

# Initialize Cognito client
cognito_client = boto3.client("cognito-idp", region_name="your-region")

# Sign up user
@router.post("/signup")
def sign_up(username: str, password: str):
    try:
        response = cognito_client.sign_up(
            ClientId="Your_App_Client_ID",
            Username=username,
            Password=password
        )
        return {"message": "User signed up successfully", "response": response}
    except ClientError as e:
        return {"error": str(e)}
