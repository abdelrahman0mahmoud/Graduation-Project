import os
from PIL import Image, ImageDraw, ImageFont

def generate_image_from_text(text):
    # This is a simple example using PIL to create an image from text.
    # Replace this with your actual image generation logic.
    
    img = Image.new('RGB', (200, 100), color=(73, 109, 137))
    d = ImageDraw.Draw(img)
    d.text((10, 10), text, fill=(255, 255, 0))
    
    image_path = f'static/images/{secure_filename(text)}.png'
    img.save(image_path)
    
    return image_path
