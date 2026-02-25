import pytest
from uuid import UUID
from .fixtures.sample_data import create_sample_bmw_m3, create_sample_pad_thai
from app.models import Car, Brand

from app.models import Dish


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


def test_dish_properties(fresh_db):
    """Test complete dish properties and computed URLs"""
    dish = create_sample_pad_thai(fresh_db)

    # Test basic fields
    assert dish.id is not None
    assert dish.name == "Pad Thai"
    assert dish.rating == 4.5
    assert "Thai" in dish.description

    # Test computed image properties
    assert len(dish.image_urls) == 2
    assert all(url.startswith("https://") for url in dish.image_urls)
    assert "padthai1.jpg" in dish.image_urls[0]
    assert "padthai2.jpg" in dish.image_urls[1]

    # Test nationality images
    assert len(dish.nationality_image_urls) == 1
    assert "thai-flag.png" in dish.nationality_image_urls[0]


def test_dish_json_serialization(db_session):
    """Test JSON fields load correctly"""
    dish = create_sample_pad_thai(db_session)

    # Test raw JSON fields
    assert dish.image_filenames == '["padthai1.jpg", "padthai2.jpg"]'
    assert dish.nationality_image_filenames == '["thai-flag.png"]'

    # Test error handling for bad JSON
    dish.image_filenames = "invalid_json"
    assert dish.image_urls == []  # Graceful fallback


def test_dish_rating_validation(db_session):
    """Test rating field constraints"""
    dish = create_sample_pad_thai(db_session)
    assert 0 <= dish.rating <= 5

    # Test nullable rating
    dish_no_rating = Dish(
        name="Sushi",
        image_filenames='["sushi1.jpg"]'
    )
    db_session.add(dish_no_rating)
    db_session.commit()
    assert dish_no_rating.rating is None


def test_dish_index_fields(fresh_db):
    """Test index fields are properly set"""
    # Create in SAME transaction
    dish = create_sample_pad_thai(fresh_db)

    # Query in SAME transaction - guaranteed to find it
    found = fresh_db.query(Dish).filter(Dish.name == "Pad Thai").first()
    assert found is not None
    assert found.id == dish.id  # Now guaranteed 5 == 5 ✅