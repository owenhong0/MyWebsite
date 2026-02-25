from app.models import Brand, Model, Variant, Car
from sqlalchemy.orm import Session

from app.models import Dish


def create_sample_bmw_m3(db: Session):
    """Create complete BMW M3 hierarchy"""
    # Brand
    bmw = Brand(
        name="BMW",
        nation="Germany",
        logo_filename="brand_logo_bmw.png"
    )
    db.add(bmw)
    db.flush()  # Get ID without commit

    # Model
    m3 = Model(name="M3", brand=bmw)
    db.add(m3)
    db.flush()

    # Variant
    m3_comp = Variant(year=2023, trim="Competition", model=m3)
    db.add(m3_comp)
    db.flush()

    # Car
    car = Car(
        variant=m3_comp,
        glb_filename="car_glb_test123.glb",
        emblem_filename="car_emblem_m3.png",
        horsepower=523,
        image_filenames='["img1.jpg", "img2.jpg"]'
    )
    db.add(car)
    db.commit()

    return car

def create_sample_pad_thai(db: Session):
    """Create complete Pad Thai dish with images"""
    dish = Dish(
        name="Pad Thai",
        rating=4.5,
        description="Classic Thai street food with rice noodles, shrimp, tofu, and peanuts",
        image_filenames='["padthai1.jpg", "padthai2.jpg"]',
        nationality_image_filenames='["thai-flag.png"]'
    )
    db.add(dish)
    db.commit()
    db.refresh(dish)
    return dish