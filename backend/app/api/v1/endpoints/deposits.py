"""Deposit endpoints"""

from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.deposit import Deposit
from app.schemas import DepositCreate, DepositResponse
from app.middleware.database import get_db
from app.core.deps import get_current_active_user_dep, get_current_admin_dep

router = APIRouter()


@router.get("/", response_model=List[DepositResponse])
async def list_deposits(
    current_user: get_current_active_user_dep,
    status_filter: str = None,
    db: AsyncSession = Depends(get_db),
):
    # Admin sees all deposits; regular users see their own
    query = select(Deposit)
    if not current_user.is_admin:
        query = query.where(Deposit.user_id == current_user.id)

    if status_filter:
        query = query.where(Deposit.status == status_filter)

    result = await db.execute(query)
    deposits = result.scalars().all()
    return deposits


@router.post("/", response_model=DepositResponse, status_code=status.HTTP_201_CREATED)
async def create_deposit(
    current_user: get_current_active_user_dep,
    deposit_in: DepositCreate,
    db: AsyncSession = Depends(get_db),
):
    deposit = Deposit(
        user_id=current_user.id,
        amount=deposit_in.amount,
        currency=deposit_in.currency,
        method=deposit_in.method,
        note=deposit_in.note,
    )
    db.add(deposit)
    await db.commit()
    await db.refresh(deposit)
    return deposit


@router.get("/{deposit_id}", response_model=DepositResponse)
async def get_deposit(
    deposit_id: int,
    current_user: get_current_active_user_dep,
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Deposit).where(Deposit.id == deposit_id))
    deposit = result.scalar_one_or_none()
    if not deposit:
        raise HTTPException(status_code=404, detail="Deposit not found")
    if not current_user.is_admin and deposit.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")
    return deposit