import os
from PIL import Image, ImageChops

def make_transparent(img, threshold=245):
    img = img.convert("RGBA")
    datas = img.getdata()
    new_data = []
    for item in datas:
        if item[0] > threshold and item[1] > threshold and item[2] > threshold:
            new_data.append((255, 255, 255, 0))
        else:
            new_data.append(item)
    img.putdata(new_data)
    bg = Image.new(img.mode, img.size, (255, 255, 255, 0))
    diff = ImageChops.difference(img, bg)
    bbox = diff.getbbox()
    if bbox:
        # Add 4px padding
        p = 4
        crop_box = (
            max(0, bbox[0] - p),
            max(0, bbox[1] - p),
            min(img.width, bbox[2] + p),
            min(img.height, bbox[3] + p)
        )
        img = img.crop(crop_box)
    return img

output_dir = "/home/arjun/the_IFOA/frontend/src/assets/images/course-icons"
os.makedirs(output_dir, exist_ok=True)

# Use media_1787828839749.png
img_deliv = Image.open("/home/arjun/.gemini/antigravity-ide/brain/6e5c535a-b584-4da6-9078-3bb4aee81253/.user_uploaded/media_1787828839749.png")
print("Delivery image size:", img_deliv.size)

# Format Teleconference Icon: x from 550 to 670, y from 80 to 240 (giving ample top & bottom headroom)
icon_teleconference = img_deliv.crop((550, 80, 680, 245))
make_transparent(icon_teleconference).save(os.path.join(output_dir, "icon-teleconference.png"))

# School IFOA India Logo: x from 120 to 250, y from 90 to 245
icon_school = img_deliv.crop((120, 90, 255, 245))
make_transparent(icon_school).save(os.path.join(output_dir, "icon-ifoa-india.png"))

# Also copy to public
os.system(f"cp {output_dir}/* /home/arjun/the_IFOA/frontend/public/images/course-icons/")
print("Regenerated zoomed-out teleconference icon and crisp IFOA India school logo successfully!")
