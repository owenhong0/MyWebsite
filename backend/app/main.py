import os

from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session, joinedload
from typing import List

from .database import get_db, engine
from . import models, schemas
from .models import Car, Variant, Model

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