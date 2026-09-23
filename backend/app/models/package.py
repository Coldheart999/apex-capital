"""Package model"""

from datetime import datetime
from sqlalchemy import Column, String, DateTime, Float, Integer, Text, JSON, ForeignKey
from sqlalchemy.orm import relationship
from app.middleware.database import Base


class Package(Base):
    __tablename__ = "packages"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    price = Column(Float, nullable=False)
    currency = Column(String(3), default="USD")
    roi_percentage = Column(Float, nullable=False, default=0.0)
    daily_return_percentage = Column(Float, nullable=False, default=0.0)
    duration_days = Column(Integer, nullable=False, default=0)
    min_duration_days = Column(Integer, default=0)
    max_duration_days = Column(Integer, default=0)
    features = Column(JSON, default=list)
    icon = Column(String, nullable=True)
    color_scheme = Column(String, nullable=True)
    is_popular = Column(Integer, default=0)
    is_active = Column(Integer, default=1)
    sort_order = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class Investment(Base):
    __tablename__ = "investments"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    package_id = Column(Integer, ForeignKey("packages.id"), nullable=False)
    amount = Column(Float, nullable=False)
    expected_return = Column(Float, nullable=False)
    actual_return = Column(Float, default=0.0)
    status = Column(String(20), default="active")
    start_date = Column(DateTime, default=datetime.utcnow)
    end_date = Column(DateTime, nullable=True)
    completed_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="investments")
    package = relationship("Package")