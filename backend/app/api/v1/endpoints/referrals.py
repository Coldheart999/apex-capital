"""Referral endpoints"""

from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.deposit import Referral as ReferralModel
from app.models.user import User
from app.schemas import ReferralCreate, ReferralResponse
from app.middleware.database import get_db
from app.core.deps import get_current_active_user_dep

router = APIRouter()


@router.get("/", response_model=List[ReferralResponse])
async def list_referrals(current_user: get_current_active_user_dep, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(ReferralModel).where(ReferralModel.referrer_id == current_user.id)
    )
    referrals = result.scalars().all()
    return referrals


@router.get("/stats")
async def get_referral_stats(current_user: get_current_active_user_dep, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(ReferralModel).where(ReferralModel.referrer_id == current_user.id)
    )
    referrals = result.scalars().all()
    total = len(referrals)
    active = len([r for r in referrals if r.status == "completed"])
    total_bonus = sum(r.referral_bonus for r in referrals if r.status == "completed")

    return {
        "total_referrals": total,
        "active_referrals": active,
        "total_earned": total_bonus,
        "referral_code": current_user.referral_code,
    }


@router.post("/apply", response_model=ReferralResponse)
async def apply_referral(
    current_user: get_current_active_user_dep,
    referral_in: ReferralCreate,
    db: AsyncSession = Depends(get_db)
):
    # Check if already has referral relationship
    existing = await db.execute(
        select(ReferralModel).where(
            ReferralModel.referrer_id == referral_in.referred_id,
            ReferralModel.referred_id == current_user.id
        )
    )
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Already referred by this user")

    # Verify the referred_id user exists and has a referral_code
    result = await db.execute(select(User).where(User.id == referral_in.referred_id))
    referred_user = result.scalar_one_or_none()
    if not referred_user:
        raise HTTPException(status_code=404, detail="Referred user not found")

    referral = ReferralModel(
        referrer_id=current_user.id,
        referred_id=referral_in.referred_id,
        status="pending",
    )
    db.add(referral)
    await db.commit()
    await db.refresh(referral)
    return referral