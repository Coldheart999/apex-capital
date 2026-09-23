"""Referral model"""

from datetime import datetime
from sqlalchemy import Column, String, DateTime, Float, Integer, ForeignKey, Text
from app.middleware.database import Base


class ReferralBonus(Base):
    __tablename__ = "referral_bonuses"

    id = Column(Integer, primary_key=True, index=True)
    referrer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    referred_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    amount = Column(Float, nullable=False)
    currency = Column(String(3), default="USD")
    source_type = Column(String(50))
    source_id = Column(Integer)
    status = Column(String(20), default="pending")
    note = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    processed_at = Column(DateTime, nullable=True)


class ReferralSetting(Base):
    __tablename__ = "referral_settings"

    id = Column(Integer, primary_key=True, index=True)
    key = Column(String(100), unique=True, nullable=False)
    value = Column(String, nullable=False)
    description = Column(Text, nullable=True)