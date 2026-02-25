from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
from uuid import UUID


class UserBase(BaseModel):
    name: str
    email: str

class UserCreate(UserBase):
    pass

class User(UserBase):
    id: int

    class Config:
        from_attributes = True

# === REQUEST SCHEMAS (Frontend → Backend) ===
class DishCreate(BaseModel):
    name: str = Field(..., max_length=100, description="Dish name")
    rating: Optional[float] = Field(None, ge=0, le=5, description="Average rating (0-5)")
    description: Optional[str] = Field(None, max_length=500)
    image_filenames: Optional[List[str]] = Field(None, max_items=10)
    nationality_image_filenames: Optional[List[str]] = Field(None, max_items=5)

class BrandCreate(BaseModel):
    name: str = Field(..., max_length=50)
    nation: str = Field(..., max_length=50)
    logo_filename: Optional[str] = Field(None, max_length=100)


class ModelCreate(BaseModel):
    name: str = Field(..., max_length=100)
    brand_id: int = Field(..., gt=0)


class VariantCreate(BaseModel):
    year: int = Field(..., ge=1900, le=2026)
    trim: str = Field(..., max_length=100)
    model_id: int = Field(..., gt=0)


class CarCreate(BaseModel):
    variant_id: int = Field(..., gt=0)
    horsepower: Optional[int] = Field(None, ge=0)
    weight_kg: Optional[float] = Field(None, ge=0)
    top_speed_kmh: Optional[int] = Field(None, ge=0)
    glb_filename: Optional[str] = Field(None, max_length=200)
    emblem_filename: Optional[str] = Field(None, max_length=100)
    image_filenames: Optional[List[str]] = Field(None, max_items=20)


# === RESPONSE SCHEMAS (Backend → Frontend) ===
class DishResponse(BaseModel):
    id: int
    name: str
    rating: Optional[float]
    description: Optional[str]
    image_filenames: Optional[str]  # Keep as JSON string (matches DB)
    nationality_image_filenames: Optional[str]  # Keep as JSON string (matches DB)

    # Computed properties from your model
    image_urls: List[str]
    nationality_image_urls: List[str]

    class Config:
        from_attributes = True  # Converts SQLAlchemy model → Pydantic

class BrandResponse(BaseModel):
    id: int
    guid: UUID
    name: str
    nation: str
    logo_filename: Optional[str]
    logo_url: str  # Computed property
    display_name: str  # Computed property

    class Config:
        from_attributes = True


class ModelResponse(BaseModel):
    id: int
    guid: UUID
    name: str
    brand_id: int
    full_name: str
    display_name: str
    brand: BrandResponse  # Nested!

    class Config:
        from_attributes = True


class VariantResponse(BaseModel):
    id: int
    guid: UUID
    year: int
    trim: str
    model_id: int
    full_name: str
    short_name: str
    model: ModelResponse  # Nested!

    class Config:
        from_attributes = True


class CarResponse(BaseModel):
    id: int
    guid: UUID
    variant_id: int
    horsepower: Optional[int]
    weight_kg: Optional[float]
    top_speed_kmh: Optional[int]
    glb_filename: Optional[str]
    emblem_filename: Optional[str]
    image_filenames: Optional[str]  # Keep as JSON string for DB
    glb_url: str
    emblem_url: str
    image_urls: List[str]  # Computed property
    display_title: str
    brand_logo_url: str
    variant: VariantResponse  # Full nested variant!

    class Config:
        from_attributes = True


# === LIST SCHEMAS ===
class DishList(BaseModel):
    dishes: List[DishResponse]

class BrandList(BaseModel):
    brands: List[BrandResponse]


class ModelList(BaseModel):
    models: List[ModelResponse]


class VariantList(BaseModel):
    variants: List[VariantResponse]


class CarList(BaseModel):
    cars: List[CarResponse]
