"""Database configuration and initialization"""

from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from sqlalchemy.orm import declarative_base
from app.core.config import settings

DATABASE_URL = settings.DATABASE_URL

engine = create_async_engine(DATABASE_URL, echo=True)
AsyncSessionLocal = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

Base = declarative_base()


async def get_db() -> AsyncSession:
    async with AsyncSessionLocal() as session:
        yield session


async def init_db():
    from app.models.user import User, AuthToken, PasswordReset
    from app.models.package import Package, Investment
    from app.models.deposit import Deposit, Withdrawal, Referral
    from app.models.referral import ReferralBonus, ReferralSetting

    # Import all models so they register with Base.metadata
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)