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

def upscale_logo(img, scale=3):
    return img.resize((img.width * scale, img.height * scale), Image.Resampling.LANCZOS)

output_dir = "/home/arjun/the_IFOA/frontend/src/assets/images/standards-logos"
os.makedirs(output_dir, exist_ok=True)

banner = Image.open("/home/arjun/.gemini/antigravity-ide/brain/6e5c535a-b584-4da6-9078-3bb4aee81253/.user_uploaded/media_1787828525529.png")

# 1. ICAO Logo
icao = make_transparent_clean(banner.crop((55, 5, 180, banner.height - 5)))
icao_hq = upscale_logo(icao)
icao_hq.save(os.path.join(output_dir, "logo-icao.png"))

# 2. EASA Logo
easa = make_transparent_clean(banner.crop((290, 5, 430, banner.height - 5)))
easa_hq = upscale_logo(easa)
easa_hq.save(os.path.join(output_dir, "logo-easa.png"))

# 3. DGCA India Logo
dgca = make_transparent_clean(banner.crop((495, 5, 710, banner.height - 5)))
dgca_hq = upscale_logo(dgca)
dgca_hq.save(os.path.join(output_dir, "logo-dgca.png"))

# 4. IFOA Logo
ifoa = make_transparent_clean(banner.crop((785, 5, 900, banner.height - 5)))
ifoa_hq = upscale_logo(ifoa)
ifoa_hq.save(os.path.join(output_dir, "logo-ifoa.png"))

# Also copy to public
os.system(f"cp {output_dir}/* /home/arjun/the_IFOA/frontend/public/images/")

print("Extracted 4 individual ultra-crisp standards logos:")
print("ICAO:", icao_hq.size)
print("EASA:", easa_hq.size)
print("DGCA:", dgca_hq.size)
print("IFOA:", ifoa_hq.size)
