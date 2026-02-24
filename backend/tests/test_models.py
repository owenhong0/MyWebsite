import pytest
from uuid import UUID
from .fixtures.sample_data import create_sample_bmw_m3
from app.models import Car, Brand

def test_car_relationships(db_session):
    """Test full BMW M3 hierarchy"""
    car = create_sample_bmw_m3(db_session)

    # Test relationships work
    assert car.variant is not None
    assert car.variant.model is not None
    assert car.variant.model.brand is not None

    # Test properties work
    assert car.display_title == "2023 BMW M3 Competition"
    assert car.brand.name == "BMW"
    assert car.glb_url.endswith(car.glb_filename)

    # Test GUID generation
    assert isinstance(car.guid, UUID)


def test_brand_logo_url(db_session):
    """Test S3 URL generation"""
    car = create_sample_bmw_m3(db_session)
    brand = car.variant.model.brand

    assert brand.logo_url.endswith("brands/logos/brand_logo_bmw.png")
    assert "https://" in brand.logo_url


def test_car_s3_urls(db_session):
    """Test all S3 properties"""
    car = create_sample_bmw_m3(db_session)

    assert len(car.image_urls) == 2
    assert car.glb_url.startswith("https://")
    assert car.emblem_url.startswith("https://")
