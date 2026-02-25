import os

from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session, joinedload
from typing import List

from .database import get_db, engine
from . import models, schemas
from .models import Car, Variant, Model
from .schemas import DishList, DishResponse, DishCreate

S3_BUCKET = os.environ.get("S3_BUCKET")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],  # React/Vite ports
    allow_credentials=True,
    allow_methods=["*"],  # Handles OPTIONS automatically
    allow_headers=["*"],
)

@app.post("/users/", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = models.User(**user.dict())
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@app.get("/users/", response_model=List[schemas.User])
def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    users = db.query(models.User).offset(skip).limit(limit).all()
    return users

@app.get("/users/{user_id}", response_model=schemas.User)
def read_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@app.get("/cars/{car_id}/info")
def get_car_info(car_id: int, db: Session = Depends(get_db)):
    car = db.query(Car).options(
        joinedload(Car.variant).joinedload(Variant.model).joinedload(Model.brand)
    ).filter(Car.id == car_id).first()

    return {
        "car": {
            "id": car.id,
            "glb_url": f"https://{S3_BUCKET}.s3.amazonaws.com/{car.s3_glb_key}",
            "images": [f"https://{S3_BUCKET}.s3.amazonaws.com/{img}" for img in json.loads(car.images_s3_keys or "[]")],
            "emblem_url": f"https://{S3_BUCKET}.s3.amazonaws.com/{car.emblems_s3_key}",
        },
        "stats": {
            "horsepower": car.horsepower,
            "weight": f"{car.weight_kg} kg",
            "top_speed": f"{car.top_speed_kmh} km/h",
            "zero_to_100": f"{car.zero_to_100}s",
            "price": f"${car.price_usd:,.0f}",
        },
        "forza_info": {
            "brand": car.variant.model.brand.name,
            "nation": car.variant.model.brand.nation,
            "model": car.variant.model.name,
            "year": car.variant.year,
            "trim": car.variant.trim,
        }
    }


# === BRANDS (you probably already have these) ===
@app.post("/brands/", response_model=schemas.BrandResponse)
async def create_brand(brand: schemas.BrandCreate, db: Session = Depends(get_db)):
    db_brand = models.Brand(**brand.dict())
    db.add(db_brand)
    db.commit()
    db.refresh(db_brand)
    return db_brand


@app.get("/brands/", response_model=schemas.BrandList)
async def get_brands(db: Session = Depends(get_db), limit: int = 100):
    brands = db.query(models.Brand).limit(limit).all()
    return schemas.BrandList(brands=brands)


# === MODELS ===
@app.post("/brands/{brand_id}/models/", response_model=schemas.ModelResponse)
async def create_model(
        brand_id: int,
        model: schemas.ModelCreate,
        db: Session = Depends(get_db)
):
    # Verify brand exists
    brand = db.query(models.Brand).filter(models.Brand.id == brand_id).first()
    if not brand:
        raise HTTPException(status_code=404, detail="Brand not found")

    db_model = models.Model(**model.dict())
    db.add(db_model)
    db.commit()
    db.refresh(db_model)
    return db_model


@app.get("/brands/{brand_id}/models/", response_model=schemas.ModelList)
async def get_models(brand_id: int, db: Session = Depends(get_db), limit: int = 100):
    models_list = db.query(models.Model).filter(models.Model.brand_id == brand_id).limit(limit).all()
    return schemas.ModelList(models=models_list)


# === VARIANTS ===
@app.post("/models/{model_id}/variants/", response_model=schemas.VariantResponse)
async def create_variant(
        model_id: int,
        variant: schemas.VariantCreate,
        db: Session = Depends(get_db)
):
    # Verify model exists
    model = db.query(models.Model).filter(models.Model.id == model_id).first()
    if not model:
        raise HTTPException(status_code=404, detail="Model not found")

    db_variant = models.Variant(**variant.dict())
    db.add(db_variant)
    db.commit()
    db.refresh(db_variant)
    return db_variant


@app.get("/models/{model_id}/variants/", response_model=schemas.VariantList)
async def get_variants(model_id: int, db: Session = Depends(get_db), limit: int = 100):
    variants = db.query(models.Variant).filter(models.Variant.model_id == model_id).limit(limit).all()
    return schemas.VariantList(variants=variants)
@app.post("/cars/", response_model=schemas.CarResponse)
async def create_car(car: schemas.CarCreate, db: Session = Depends(get_db)):
    db_car = models.Car(**car.dict())
    db.add(db_car)
    db.commit()
    db.refresh(db_car)
    return db_car  # ← All computed properties included!


@app.get("/cars/", response_model=schemas.CarList)
async def get_cars(db: Session = Depends(get_db), limit: int = 100):
    cars = db.query(models.Car).options(
        joinedload(models.Car.variant)
        .joinedload(models.Variant.model)
        .joinedload(models.Model.brand)
    ).limit(limit).all()

    return schemas.CarList(cars=cars)

@app.post("/dishes/", response_model=DishResponse)
async def create_dish(dish: DishCreate, db: Session = Depends(get_db)):
    db_dish = models.Dish(**dish.dict())
    db.add(db_dish)
    db.commit()
    db.refresh(db_dish)
    return db_dish

@app.get("/dishes/", response_model=DishList)
async def get_dishes(limit: int = 50, db: Session = Depends(get_db)):
    dishes = db.query(models.Dish).limit(limit).all()
    return schemas.DishList(dishes=dishes)