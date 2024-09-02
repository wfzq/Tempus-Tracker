import os
from PIL import Image


def compress_images(input_dir, output_dir, quality=85):

    for filename in os.listdir(input_dir):
        if filename.endswith(".jpg") or filename.endswith(".jpeg") or filename.endswith(".png"):
            img_path = os.path.join(input_dir, filename)
            img = Image.open(img_path)

            # Convert PNG to JPG if necessary
            if filename.endswith(".png"):
                filename = filename.replace(".png", ".jpg")
                img = img.convert("RGB")

            output_path = os.path.join(output_dir, filename)
            img.save(output_path, "JPEG", quality=quality)

            print(f"Compressed {filename} and saved to {output_path}")


IN_PATH = '../../Desktop/newThumbnails'
OUT_PATH = 'src/data/thumbnails/'

if not os.path.exists(IN_PATH):
    raise RuntimeError("IN_PATH doesn't exist")

if not os.path.exists(OUT_PATH):
    raise RuntimeError("OUT_PATH doesn't exist")


compress_images(IN_PATH, OUT_PATH, quality=73)
