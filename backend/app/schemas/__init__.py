"""Schemas for API validation"""

from datetime import datetime
from typing import Optional, List, Any
from pydantic import BaseModel, EmailStr, Field


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TokenPayload(BaseModel):
    sub: Optional[str] = None
    exp: Optional[int] = None
    type: Optional[str] = None


class UserBase(BaseModel):
    email: EmailStr
    full_name: str = Field(..., min_length=2, max_length=100)
    phone: Optional[str] = Field(None, max_length=20)


class UserCreate(UserBase):
    password: str = Field(..., min_length=8, max_length=128)
    referral_code: Optional[str] = None


class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None
    password: Optional[str] = None
    is_active: Optional[bool] = None
    is_admin: Optional[bool] = None


class UserResponse(UserBase):
    id: int
    is_active: bool
    is_admin: bool
    is_verified: bool
    balance: float
    invested: float
    total_deposits: float
    total_withdrawals: float
    referral_code: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True


class PackageBase(BaseModel):
    name: str
    description: Optional[str] = None
    price: float = Field(..., gt=0)
    currency: str = "USD"
    roi_percentage: float = Field(..., ge=0)
    daily_return_percentage: float = Field(..., ge=0)
    duration_days: int = Field(..., gt=0)
    min_duration_days: Optional[int] = None
    max_duration_days: Optional[int] = None
    features: List[str] = Field(default_factory=list)
    icon: Optional[str] = None
    color_scheme: Optional[str] = None
    is_popular: bool = False
    is_active: bool = True


class PackageCreate(PackageBase):
    pass


class PackageUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    roi_percentage: Optional[float] = None
    daily_return_percentage: Optional[float] = None
    duration_days: Optional[int] = None
    features: Optional[List[str]] = None
    is_active: Optional[bool] = None
    is_popular: Optional[bool] = None


class PackageResponse(PackageBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class DepositBase(BaseModel):
    amount: float = Field(..., gt=0)
    currency: str = "USD"
    method: str = "stripe"
    note: Optional[str] = None


class DepositCreate(DepositBase):
    pass


class DepositResponse(BaseModel):
    id: int
    user_id: int
    amount: float
    currency: str
    method: str
    status: str
    transaction_id: Optional[str]
    created_at: datetime
    processed_at: Optional[datetime]

    class Config:
        from_attributes = True


class WithdrawalBase(BaseModel):
    amount: float = Field(..., gt=0)
    currency: str = "USD"
    method: str = "bank"
    wallet_address: Optional[str] = None
    bank_account: Optional[str] = None
    note: Optional[str] = None


class WithdrawalCreate(WithdrawalBase):
    pass


class WithdrawalResponse(BaseModel):
    id: int
    user_id: int
    amount: float
    currency: str
    method: str
    status: str
    created_at: datetime
    processed_at: Optional[datetime]

    class Config:
        from_attributes = True


class ReferralBase(BaseModel):
    referred_id: int


class ReferralCreate(ReferralBase):
    pass


class ReferralResponse(BaseModel):
    id: int
    referrer_id: int
    referred_id: int
    referral_bonus: float
    status: str
    created_at: datetime

    class Config:
        from_attributes = True