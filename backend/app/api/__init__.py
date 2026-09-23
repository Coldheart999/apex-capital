"""API endpoints for v1"""

from fastapi import APIRouter

from app.api.v1.endpoints import auth, users, packages, deposits, withdrawals, referrals

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(packages.router, prefix="/packages", tags=["packages"])
api_router.include_router(deposits.router, prefix="/deposits", tags=["deposits"])
api_router.include_router(withdrawals.router, prefix="/withdrawals", tags=["withdrawals"])
api_router.include_router(referrals.router, prefix="/referrals", tags=["referrals"])