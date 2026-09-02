from PIL import Image

img = Image.open("/home/arjun/.gemini/antigravity-ide/brain/6e5c535a-b584-4da6-9078-3bb4aee81253/.user_uploaded/media_1787828525529.png")
print("Banner size:", img.size)

# Find active logo columns
col_activity = []
for x in range(img.width):
    non_white = sum(1 for y in range(img.height) if any(c < 240 for c in img.getpixel((x, y))))
    col_activity.append((x, non_white))

active_ranges = []
in_range = False
start = 0
for x, nw in col_activity:
    if nw > 0 and not in_range:
        in_range = True
        start = x
    elif nw == 0 and in_range:
        in_range = False
        active_ranges.append((start, x-1))
if in_range:
    active_ranges.append((start, img.width - 1))

print("Active logo ranges in banner:", active_ranges)
