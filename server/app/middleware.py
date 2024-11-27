from fastapi import Request, HTTPException
import jwt
from functools import wraps

def require_role(role: str):
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            request = next(arg for arg in args if isinstance(arg, Request))
            token = request.headers.get('Authorization')
            
            if not token:
                raise HTTPException(status_code=401, detail="No token provided")
            
            try:
                # Verify the JWT token and extract claims
                decoded = jwt.decode(token.split(' ')[1], verify=False)
                user_role = decoded.get('custom:role')
                
                if user_role != role:
                    raise HTTPException(
                        status_code=403, 
                        detail="Insufficient permissions"
                    )
                
                return await func(*args, **kwargs)
            except Exception as e:
                raise HTTPException(status_code=401, detail="Invalid token")
        return wrapper
    return decorator