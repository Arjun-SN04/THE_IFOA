import os
from PIL import Image, ImageChops

def make_transparent(img, threshold=245):
    img = img.convert("RGBA")
    datas = img.getdata()
    new_data = []
    for item in datas:
        # If it's near-white, make it transparent
        if item[0] > threshold and item[1] > threshold and item[2] > threshold:
            new_data.append((255, 255, 255, 0))
        else:
            new_data.append(item)
    img.putdata(new_data)
    # Trim empty transparent borders
    bg = Image.new(img.mode, img.size, (255, 255, 255, 0))
    diff = ImageChops.difference(img, bg)
    bbox = diff.getbbox()
    if bbox:
        img = img.crop(bbox)
    return img

output_dir = "/home/arjun/the_IFOA/frontend/src/assets/images/course-icons"
os.makedirs(output_dir, exist_ok=True)

img_sched = Image.open("/home/arjun/.gemini/antigravity-ide/brain/6e5c535a-b584-4da6-9078-3bb4aee81253/.user_uploaded/media_1787828835587.png")
img_deliv = Image.open("/home/arjun/.gemini/antigravity-ide/brain/6e5c535a-b584-4da6-9078-3bb4aee81253/.user_uploaded/media_1787828839749.png")

# 1. Schedule Banner Icon (Calendar + Clock)
icon_schedule = img_sched.crop((140, 35, 225, 125))
make_transparent(icon_schedule).save(os.path.join(output_dir, "icon-schedule-header.png"))

# 2. Duration Icon (Clock)
icon_duration = img_sched.crop((140, 180, 205, 260))
make_transparent(icon_duration).save(os.path.join(output_dir, "icon-duration.png"))

# 3. Start Date Icon (Calendar)
icon_start = img_sched.crop((335, 180, 395, 260))
make_transparent(icon_start).save(os.path.join(output_dir, "icon-start.png"))

# 4. Location Icon (Globe with Pin)
icon_location = img_sched.crop((530, 180, 595, 260))
make_transparent(icon_location).save(os.path.join(output_dir, "icon-location.png"))

# 5. Price Icon (Graduation Cap & Bill)
icon_price = img_sched.crop((725, 180, 795, 260))
make_transparent(icon_price).save(os.path.join(output_dir, "icon-price.png"))

# 6. Format Icon (Teleconference / Virtual Classroom)
icon_teleconference = img_deliv.crop((580, 130, 660, 230))
make_transparent(icon_teleconference).save(os.path.join(output_dir, "icon-teleconference.png"))

# 7. School Logo (IFOA India)
icon_school = img_deliv.crop((150, 130, 235, 230))
make_transparent(icon_school).save(os.path.join(output_dir, "icon-ifoa-india.png"))

print("All icons successfully extracted and transparent PNGs created!")
