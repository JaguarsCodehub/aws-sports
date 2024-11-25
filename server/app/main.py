from fastapi import FastAPI
from app import auth, events

app = FastAPI()

# Root route
@app.get("/")
def read_root():
    return {"message": "Sports Event Management API"}

# Include auth routes
app.include_router(auth.router, prefix="/auth", tags=["Authentication"])

# Include event management routes
app.include_router(events.router, prefix="/events", tags=["Events"])
