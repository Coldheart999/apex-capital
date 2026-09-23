"""Seed data for initial packages"""

import asyncio
import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from app.middleware.database import AsyncSessionLocal, engine, Base
# Import ALL models before running so they're registered
from app.models.user import User, AuthToken, PasswordReset
from app.models.package import Package, Investment
from app.models.deposit import Deposit, Withdrawal, Referral
from app.models.referral import ReferralBonus, ReferralSetting
from sqlalchemy import select
from app.core.security import get_password_hash


SEED_PACKAGES = [
    {
        "name": "Starter Plan",
        "description": "Perfect for beginners looking to dip their toes into investing",
        "price": 100.0,
        "currency": "USD",
        "roi_percentage": 12.0,
        "daily_return_percentage": 0.4,
        "duration_days": 30,
        "features": [
            "Daily automated returns",
            "Access to basic portfolio insights",
            "Email support",
        ],
        "icon": "🌱",
        "color_scheme": "from-green-400 to-emerald-500",
        "is_popular": 0,
        "is_active": 1,
        "sort_order": 1,
    },
    {
        "name": "Growth Plan",
        "description": "Balanced investment with solid returns for growing portfolios",
        "price": 500.0,
        "currency": "USD",
        "roi_percentage": 25.0,
        "daily_return_percentage": 0.833,
        "duration_days": 30,
        "features": [
            "Daily automated returns",
            "Advanced portfolio analytics",
            "Priority email support",
            "Referral bonus multiplier x2",
        ],
        "icon": "📈",
        "color_scheme": "from-blue-400 to-cyan-500",
        "is_popular": 1,
        "is_active": 1,
        "sort_order": 2,
    },
    {
        "name": "Premium Plan",
        "description": "Maximum returns for experienced investors",
        "price": 1000.0,
        "currency": "USD",
        "roi_percentage": 50.0,
        "daily_return_percentage": 1.667,
        "duration_days": 30,
        "features": [
            "Daily automated returns",
            "Real-time portfolio tracking",
            "24/7 priority support",
            "Referral bonus multiplier x3",
            "Exclusive market insights",
            "Early access to new features",
        ],
        "icon": "💎",
        "color_scheme": "from-purple-400 to-violet-500",
        "is_popular": 0,
        "is_active": 1,
        "sort_order": 3,
    },
    {
        "name": "Enterprise Plan",
        "description": "White-glove investment service with VIP treatment",
        "price": 5000.0,
        "currency": "USD",
        "roi_percentage": 120.0,
        "daily_return_percentage": 4.0,
        "duration_days": 30,
        "features": [
            "Daily automated returns",
            "Personal investment manager",
            "Exclusive market research",
            "Referral bonus multiplier x5",
            "VIP support line",
            "Early access to new investment opportunities",
            "Custom portfolio management",
        ],
        "icon": "👑",
        "color_scheme": "from-yellow-400 to-amber-500",
        "is_popular": 0,
        "is_active": 1,
        "sort_order": 4,
    },
]


async def seed_packages():
    """Create initial seed packages"""
    async with AsyncSessionLocal() as db:
        existing = await db.execute(select(Package))
        if existing.scalars().first():
            print("Packages already exist, skipping seed")
            return

        for pkg_data in SEED_PACKAGES:
            pkg = Package(**pkg_data)
            db.add(pkg)
        await db.commit()
        print(f"Seeded {len(SEED_PACKAGES)} packages")


async def seed_admin():
    """Create initial admin user"""
    async with AsyncSessionLocal() as db:
        existing = await db.execute(select(User).where(User.email == "admin@apexcapital.com"))
        if existing.scalar_one_or_none():
            print("Admin user already exists, skipping")
            return

        admin = User(
            email="admin@apexcapital.com",
            full_name="Apex Capital Admin",
            hashed_password=get_password_hash("Admin@123!"),
            is_admin=True,
            is_active=True,
            is_verified=True,
            referral_code="ADMIN-0001",
        )
        db.add(admin)
        await db.commit()
        print("Created admin user: admin@apexcapital.com / Admin@123!")


async def run_seed():
    """Run all seed operations"""
    # Create tables first
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    await seed_packages()
    await seed_admin()
    print("Seeding complete!")


if __name__ == "__main__":
    asyncio.run(run_seed())