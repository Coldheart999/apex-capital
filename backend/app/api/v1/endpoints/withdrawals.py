"""Withdrawal endpoints"""

from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.deposit import Withdrawal
from app.schemas import WithdrawalCreate, WithdrawalResponse
from app.middleware.database import get_db
from app.core.deps import get_current_active_user_dep

router = APIRouter()


@router.get("/", response_model=List[WithdrawalResponse])
async def list_withdrawals(
    current_user: get_current_active_user_dep,
    status_filter: str = None,
    db: AsyncSession = Depends(get_db),
):
    query = select(Withdrawal)
    if not current_user.is_admin:
        query = query.where(Withdrawal.user_id == current_user.id)

    if status_filter:
        query = query.where(Withdrawal.status == status_filter)

    result = await db.execute(query)
    withdrawals = result.scalars().all()
    return withdrawals


@router.post("/", response_model=WithdrawalResponse, status_code=status.HTTP_201_CREATED)
async def create_withdrawal(
    current_user: get_current_active_user_dep,
    withdrawal_in: WithdrawalCreate,
    db: AsyncSession = Depends(get_db),
):
    if current_user.balance < withdrawal_in.amount:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Insufficient balance"
        )

    withdrawal = Withdrawal(
        user_id=current_user.id,
        amount=withdrawal_in.amount,
        currency=withdrawal_in.currency,
        method=withdrawal_in.method,
        wallet_address=withdrawal_in.wallet_address,
        bank_account=withdrawal_in.bank_account,
        note=withdrawal_in.note,
    )
    db.add(withdrawal)

    current_user.balance -= withdrawal_in.amount
    current_user.total_withdrawals += withdrawal_in.amount

    db.add(current_user)
    await db.commit()
    await db.refresh(withdrawal)
    return withdrawal


@router.get("/{withdrawal_id}", response_model=WithdrawalResponse)
async def get_withdrawal(
    withdrawal_id: int,
    current_user: get_current_active_user_dep,
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Withdrawal).where(Withdrawal.id == withdrawal_id))
    withdrawal = result.scalar_one_or_none()
    if not withdrawal:
        raise HTTPException(status_code=404, detail="Withdrawal not found")
    if not current_user.is_admin and withdrawal.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")
    return withdrawal