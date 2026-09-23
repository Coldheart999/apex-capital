from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.package import Package
from app.models.user import User
from app.schemas import PackageCreate, PackageResponse, PackageUpdate
from app.middleware.database import get_db
from app.core.deps import get_current_admin

router = APIRouter()


@router.get("/", response_model=List[PackageResponse])
async def list_packages(
    is_active: bool = True,
    db: AsyncSession = Depends(get_db),
):
    query = select(Package)
    if is_active:
        query = query.where(Package.is_active == 1)
    result = await db.execute(query)
    packages = result.scalars().all()
    return packages


@router.get("/{package_id}", response_model=PackageResponse)
async def get_package(package_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Package).where(Package.id == package_id))
    package = result.scalar_one_or_none()
    if not package:
        raise HTTPException(status_code=404, detail="Package not found")
    return package


@router.post("/", response_model=PackageResponse, status_code=status.HTTP_201_CREATED)
async def create_package(
    pkg: PackageCreate,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    package = Package(**pkg.model_dump())
    db.add(package)
    await db.commit()
    await db.refresh(package)
    return package


@router.put("/{package_id}", response_model=PackageResponse)
async def update_package(
    package_id: int,
    pkg: PackageUpdate,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    result = await db.execute(select(Package).where(Package.id == package_id))
    package = result.scalar_one_or_none()
    if not package:
        raise HTTPException(status_code=404, detail="Package not found")

    for field, value in pkg.dict(exclude_unset=True).items():
        setattr(package, field, value)

    db.add(package)
    await db.commit()
    await db.refresh(package)
    return package


@router.delete("/{package_id}")
async def delete_package(
    package_id: int,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    result = await db.execute(select(Package).where(Package.id == package_id))
    package = result.scalar_one_or_none()
    if not package:
        raise HTTPException(status_code=404, detail="Package not found")

    await db.delete(package)
    await db.commit()
    return {"message": "Package deleted"}