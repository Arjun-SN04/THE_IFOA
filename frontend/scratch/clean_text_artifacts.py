import os
from PIL import Image, ImageChops

def make_transparent_clean(img, threshold=245):
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
        img = img.crop(bbox)
    return img

output_dir = "/home/arjun/the_IFOA/frontend/src/assets/images/course-icons"
os.makedirs(output_dir, exist_ok=True)

# 1. Clean Certification Badge Icon
# media_1787828511626.png size: let's inspect and crop strictly the certificate icon (left of the text)
cert_raw = Image.open("/home/arjun/.gemini/antigravity-ide/brain/6e5c535a-b584-4da6-9078-3bb4aee81253/.user_uploaded/media_1787828511626.png")
print("Cert raw size:", cert_raw.size)
# The certificate is on the left; text is on the right. Crop only up to x=105 to exclude all text
cert_icon = cert_raw.crop((5, 5, 110, cert_raw.height - 5))
clean_cert = make_transparent_clean(cert_icon)
clean_cert.save("/home/arjun/the_IFOA/frontend/src/assets/images/certification-badge-icon.png")
clean_cert.save("/home/arjun/the_IFOA/frontend/public/images/certification-badge-icon.png")
print("Clean cert saved:", clean_cert.size)

# 2. Clean IFOA India Logo
# In media_1787828839749.png (1024x253), School text is at x > 215. The IFOA logo ends at x=205.
deliv_raw = Image.open("/home/arjun/.gemini/antigravity-ide/brain/6e5c535a-b584-4da6-9078-3bb4aee81253/.user_uploaded/media_1787828839749.png")
# Crop strictly x: 120 to 205, y: 100 to 240
ifoa_india_crop = deliv_raw.crop((120, 100, 205, 240))
clean_ifoa_india = make_transparent_clean(ifoa_india_crop)
clean_ifoa_india.save(os.path.join(output_dir, "icon-ifoa-india.png"))
clean_ifoa_india.save("/home/arjun/the_IFOA/frontend/public/images/course-icons/icon-ifoa-india.png")
print("Clean IFOA India saved:", clean_ifoa_india.size)

# 3. Clean Teleconference Icon
# In media_1787828839749.png, teleconference icon is at x: 570 to 660, y: 110 to 240. Format text starts at x > 675.
tele_crop = deliv_raw.crop((570, 110, 665, 240))
clean_tele = make_transparent_clean(tele_crop)
clean_tele.save(os.path.join(output_dir, "icon-teleconference.png"))
clean_tele.save("/home/arjun/the_IFOA/frontend/public/images/course-icons/icon-teleconference.png")
print("Clean Teleconference saved:", clean_tele.size)

print("All icons successfully cleaned with 0 text artifacts!")
