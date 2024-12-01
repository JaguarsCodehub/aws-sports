# Sports Event Management System

A full-stack application for managing sports events, built with Next.js (frontend) and FastAPI (backend).

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or higher)
- Python (v3.8 or higher)
- npm (usually comes with Node.js)
- pip (Python package manager)

## Project Structure
project/
├── client/ # Frontend Next.js application
└── server/ # Backend FastAPI application


## Frontend Setup (Client)

1. Navigate to the client directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the client directory with the following content:
   ```bash
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```


The frontend will be available at `http://localhost:3000`

## Backend Setup (Server)

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Create a Python virtual environment (optional, you can skip this step if you have Python installed properly, just check your interpreter in VSCode):
   ```bash
   python -m venv venv
   ```

3. Install required packages:
   ```bash
   pip install -r requirements.txt
   ```

4. Create a `.env` file in the server directory with the following content:
   ```bash
   AWS_ACCESS_KEY_ID=your_aws_access_key
   AWS_SECRET_ACCESS_KEY=your_aws_secret_key
   AWS_REGION=us-east-1
   COGNITO_USER_POOL_CLIENT_ID=your_cognito_client_id
   COGNITO_CLIENT_SECRET=your_cognito_client_secret
   COGNITO_USER_POOL_ID=your_cognito_pool_id
   ADMIN_SECRET_KEY=your_admin_secret
   DYNAMODB_EVENTS_TABLE=Events
   S3_BUCKET_NAME=your_s3_bucket_name
   DYNAMODB_REGISTRATION_REQUESTS_TABLE=registration-requests
   ```


5. Start the backend server:
   ```bash
   python -m app.run
   ```

The backend API will be available at `http://localhost:8000`

## API Documentation

Once the backend server is running, you can access the API documentation at:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## AWS Services Used

This application uses several AWS services:
- Amazon Cognito for authentication
- Amazon DynamoDB for database
- Amazon S3 for file storage
- Amazon SNS for notifications
- AWS IAM for user management and Secure Policies to avoid breach.

Make sure you have the necessary AWS credentials and permissions set up.

## Development Notes

- The frontend is built with Next.js and uses modern React features
- The backend uses FastAPI with Python
- Authentication is handled through AWS Cognito
- File uploads are stored in AWS S3
- Database operations use AWS DynamoDB


## Common Issues

1. **Connection Refused Error**: Make sure both frontend and backend servers are running
2. **AWS Credentials Error**: Verify your AWS credentials in the `.env` file
3. **Module Not Found Errors**: Ensure all dependencies are installed via npm/pip

## Support

For technical support or questions, please open an issue in the repository.