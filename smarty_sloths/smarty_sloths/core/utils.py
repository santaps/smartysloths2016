import base64
import io

from django.conf import settings
from PIL import Image, ImageOps
from pytesseract import image_to_string, pytesseract


def get_encoded_image(file, from_file=True):
    if from_file:
        image = Image.open(file)
    else:
        image = file

    buffer = io.BytesIO()
    image.convert('RGB').save(buffer, format="JPEG")

    return base64.b64encode(buffer.getvalue())


def decode_image(encoded_image):
    decoded_image = io.BytesIO(base64.b64decode(encoded_image))

    return Image.open(decoded_image)


def extract_text(file):
    pytesseract.tesseract_cmd = settings.TESSERACT_PATH
    image = Image.open(file)

    return image_to_string(image)


def get_encoded_thumbnail(file):
    size = settings.THUMBNAIL_SIZE
    image = Image.open(file)
    thumb = ImageOps.fit(image, size, Image.ANTIALIAS)

    return get_encoded_image(thumb, from_file=False)
