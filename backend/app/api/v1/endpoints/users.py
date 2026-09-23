"""User endpoints"""

from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.user import User
from app.schemas import UserResponse, UserUpdate
from app.middleware.database import get_db
from app.core.deps import get_current_active_user, get_current_admin
from app.core.security import get_password_hash

router = APIRouter()


@router.get("/", response_model=List[UserResponse])
async def list_users(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    query = select(User).offset(skip).limit(limit)
    result = await db.execute(query)
    users = result.scalars().all()
    return users


@router.get("/me/balance", response_model=dict)
async def get_balance(current_user: User = Depends(get_current_active_user)):
    return {
        "balance": current_user.balance,
        "invested": current_user.invested,
        "total_deposits": current_user.total_deposits,
        "total_withdrawals": current_user.total_withdrawals,
    }


@router.put("/me", response_model=UserResponse)
async def update_user_me(
    user_in: UserUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    for field, value in user_in.model_dump(exclude_unset=True).items():
        if field == "password" and value:
            current_user.hashed_password = get_password_hash(value)
        elif hasattr(current_user, field):
            setattr(current_user, field, value)

    db.add(current_user)
    await db.commit()
    await db.refresh(current_user)
    return current_user


@router.get("/{user_id}", response_model=UserResponse)
async def get_user(
    user_id: int,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user