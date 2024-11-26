from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import boto3
from botocore.exceptions import ClientError
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

router = APIRouter()

# Initialize Cognito client
cognito_client = boto3.client(
    "cognito-idp",
    region_name="us-east-1",
    aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
    aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY")
)

class UserAuth(BaseModel):
    email: str
    password: str

@router.post("/signup")
async def sign_up(user: UserAuth):
    try:
        response = cognito_client.sign_up(
            ClientId=os.getenv("COGNITO_USER_POOL_CLIENT_ID"),
            Username=user.email,
            Password=user.password,
            UserAttributes=[
                {
                    'Name': 'email',
                    'Value': user.email
                },
            ]
        )
        return {"message": "User registered successfully", "userSub": response["UserSub"]}
    except ClientError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/signin")
async def sign_in(user: UserAuth):
    try:
        response = cognito_client.initiate_auth(
            ClientId=os.getenv("COGNITO_USER_POOL_CLIENT_ID"),
            AuthFlow='USER_PASSWORD_AUTH',
            AuthParameters={
                'USERNAME': user.email,
                'PASSWORD': user.password
            }
        )
        return {
            "message": "Login successful",
            "token": response["AuthenticationResult"]["AccessToken"]
        }
    except ClientError as e:
        raise HTTPException(status_code=401, detail="Invalid credentials")
