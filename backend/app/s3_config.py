import os
from typing import Final

# S3 Settings (from .env)
AWS_BUCKET: Final[str] = os.getenv("AWS_S3_BUCKET", "my-website8")
AWS_REGION: Final[str] = os.getenv("AWS_S3_REGION", "us-east-2")
CAR_GLBS_FOLDER: Final[str] = "cars/glbs"
CAR_IMAGES_FOLDER: Final[str] = "cars/images"
CAR_EMBLEMS_FOLDER: Final[str] = "cars/emblems"
BRAND_LOGOS_FOLDER: Final[str] = "brands/logos"

# Base CDN URL
CDN_BASE_URL = f"https://{AWS_BUCKET}.s3.{AWS_REGION}.amazonaws.com"

def get_car_glb_url(filename: str) -> str:
    return f"{CDN_BASE_URL}/{CAR_GLBS_FOLDER}/{filename}"

def get_car_image_url(filename: str) -> str:
    return f"{CDN_BASE_URL}/{CAR_IMAGES_FOLDER}/{filename}"

def get_emblem_url(filename: str) -> str:
    return f"{CDN_BASE_URL}/{CAR_EMBLEMS_FOLDER}/{filename}"
