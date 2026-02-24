import json
import uuid

from sqlalchemy import Column, Integer, String, ForeignKey, Text, Numeric, UUID
from sqlalchemy.orm import relationship
from .s3_config import (
    CAR_GLBS_FOLDER, CAR_IMAGES_FOLDER, CAR_EMBLEMS_FOLDER,
    get_car_glb_url, get_car_image_url, get_emblem_url, CDN_BASE_URL, BRAND_LOGOS_FOLDER
)
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    name = Column(String, nullable=False, index=True)
    email = Column(String, nullable=False, index=True, unique=True)


class Brand(Base):
    __tablename__ = "brands"

    id = Column(Integer, primary_key=True)
    guid = Column(UUID(as_uuid=True), default=uuid.uuid4, unique=True, nullable=False)
    name = Column(String(50), index=True)
    nation = Column(String(50))
    logo_filename = Column(String(100))

    models = relationship("Model", back_populates="brand")

    @property
    def logo_url(self) -> str:
        """Full S3 URL for brand logo"""
        if self.logo_filename:
            return f"{CDN_BASE_URL}/{BRAND_LOGOS_FOLDER}/{self.logo_filename}"
        return ""

    @property
    def display_name(self) -> str:
        """Forza-style: 'BMW (Germany)'"""
        return f"{self.name} ({self.nation})"


class Model(Base):
    __tablename__ = "models"

    id = Column(Integer, primary_key=True)
    guid = Column(UUID(as_uuid=True), default=uuid.uuid4, unique=True, nullable=False)
    name = Column(String(100), index=True)
    brand_id = Column(Integer, ForeignKey("brands.id"))

    brand = relationship("Brand", back_populates="models")
    variants = relationship("Variant", back_populates="model")

    @property
    def full_name(self) -> str:
        """Forza-style: 'BMW M3'"""
        return f"{self.brand.name} {self.name}" if self.brand else self.name

    @property
    def display_name(self) -> str:
        """Forza-style: 'M3 (BMW)'"""
        return f"{self.name} ({self.brand.name})" if self.brand else self.name


class Variant(Base):
    __tablename__ = "variants"

    id = Column(Integer, primary_key=True)
    guid = Column(UUID(as_uuid=True), default=uuid.uuid4, unique=True, nullable=False)
    year = Column(Integer)
    trim = Column(String(100))
    model_id = Column(Integer, ForeignKey("models.id"))

    model = relationship("Model", back_populates="variants")
    cars = relationship("Car", back_populates="variant")

    @property
    def full_name(self) -> str:
        """Forza-style: '2023 BMW M3 Competition'"""
        return f"{self.year} {self.model.full_name} {self.trim}".strip()

    @property
    def short_name(self) -> str:
        """Compact: '23 M3 Competition'"""
        return f"{self.year % 100} {self.model.name} {self.trim}"


class Car(Base):
    __tablename__ = "cars"

    id = Column(Integer, primary_key=True)
    guid = Column(UUID(as_uuid=True), default=uuid.uuid4, unique=True, nullable=False)
    variant_id = Column(Integer, ForeignKey("variants.id"))

    # S3 Filenames
    glb_filename = Column(String(200))
    emblem_filename = Column(String(100))
    image_filenames = Column(Text)  # JSON array

    # Stats
    horsepower = Column(Integer)
    weight_kg = Column(Numeric(8, 2))
    top_speed_kmh = Column(Integer)

    variant = relationship("Variant", back_populates="cars")

    @property
    def glb_url(self) -> str:
        """Full S3 CDN URL for 3D model"""
        if self.glb_filename:
            return f"{CDN_BASE_URL}/{CAR_GLBS_FOLDER}/{self.glb_filename}"
        return ""

    @property
    def emblem_url(self) -> str:
        """Full S3 URL for car emblem"""
        if self.emblem_filename:
            return f"{CDN_BASE_URL}/{CAR_EMBLEMS_FOLDER}/{self.emblem_filename}"
        return ""

    @property
    def image_urls(self) -> list[str]:
        """List of full S3 image URLs"""
        try:
            filenames = json.loads(self.image_filenames or "[]")
            return [f"{CDN_BASE_URL}/{CAR_IMAGES_FOLDER}/{f}" for f in filenames]
        except:
            return []

    @property
    def display_title(self) -> str:
        """Forza-style header: '2023 BMW M3 Competition'"""
        return self.variant.full_name if self.variant else "Unnamed Car"

    @property
    def brand(self):
        """Quick brand access"""
        return self.variant.model.brand if self.variant and self.variant.model else None

    @property
    def brand_logo_url(self) -> str:
        """Brand logo from relationship"""
        return self.brand.logo_url if self.brand else ""