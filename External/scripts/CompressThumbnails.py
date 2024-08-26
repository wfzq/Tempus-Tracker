import os
from PIL import Image


def compress_images(input, output, quality=85):
    if not os.path.exists(output):
        os.makedirs(output)

    for filename in os.listdir(input):
        if filename.endswith(".jpg") or filename.endswith(".jpeg"):
            img_path = os.path.join(input, filename)
            img = Image.open(img_path)

            # Save the image with the specified quality
            output_path = os.path.join(output, filename)
            img.save(output_path, "JPEG", quality=quality)

            print(f"Compressed {filename} and saved to {output_path}")


IN_PATH = 'src/data/thumbnails'
OUT_PATH = 'src/data/thumbnails'

compress_images(IN_PATH, OUT_PATH, quality=73)
