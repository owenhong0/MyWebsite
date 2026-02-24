import uuid
import re
from typing import Final

OBJECT_TYPES = {
    'car_glb': 'cars/glbs',
    'car_image': 'cars/previews',
    'car_emblem': 'cars/emblems',
    'brand_logo': 'brands/logos'
}


def generate_s3_key(object_type: str, original_filename: str = None) -> tuple[str, str]:
    """
    Returns (s3_key, filename)
    """
    if object_type not in OBJECT_TYPES:
        raise ValueError(f"Unknown object type: {object_type}")

    # Generate UUID + extension
    file_uuid = uuid.uuid4()
    ext = original_filename.split('.')[-1].lower() if original_filename else 'glb'

    # Type-prefixed filename
    filename = f"{object_type}_{str(file_uuid).replace('-', '')}.{ext}"
    s3_key = f"{OBJECT_TYPES[object_type]}/{filename}"

    return s3_key, filename
