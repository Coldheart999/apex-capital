"""Deposit and withdrawal models"""

from datetime import datetime
from sqlalchemy import Column, String, DateTime, Float, Integer, Text, JSON, ForeignKey
from sqlalchemy.orm import relationship
from app.middleware.database import Base


class Deposit(Base):
    __tablename__ = "deposits"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    amount = Column(Float, nullable=False)
    currency = Column(String(3), default="USD")
    method = Column(String(50), default="stripe")
    transaction_id = Column(String, nullable=True)
    stripe_payment_intent_id = Column(String, nullable=True)
    status = Column(String(20), default="pending")
    note = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    processed_at = Column(DateTime, nullable=True)

    user = relationship("User", back_populates="deposits")


class Withdrawal(Base):
    __tablename__ = "withdrawals"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    amount = Column(Float, nullable=False)
    currency = Column(String(3), default="USD")
    method = Column(String(50), default="bank")
    transaction_id = Column(String, nullable=True)
    status = Column(String(20), default="pending")
    note = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    processed_at = Column(DateTime, nullable=True)
    wallet_address = Column(String, nullable=True)
    bank_account = Column(String, nullable=True)

    user = relationship("User", back_populates="withdrawals")


class Referral(Base):
    __tablename__ = "referrals"

    id = Column(Integer, primary_key=True, index=True)
    referrer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    referred_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    referral_bonus = Column(Float, default=0.0)
    status = Column(String(20), default="pending")
    created_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)

    referrer = relationship("User", foreign_keys=[referrer_id])