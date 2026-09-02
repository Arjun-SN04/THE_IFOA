from PIL import Image

img = Image.open("/home/arjun/.gemini/antigravity-ide/brain/6e5c535a-b584-4da6-9078-3bb4aee81253/.user_uploaded/media_1787828533619.png")
print("media_1787828533619 size:", img.size)

# Let's crop a wide area around the IFOA logo: x from 90 to 220, y from 10 to 180 (or full height)
# Let's see the height and width
print("Image width:", img.width, "height:", img.height)

# Also check media_1787828839749.png
img2 = Image.open("/home/arjun/.gemini/antigravity-ide/brain/6e5c535a-b584-4da6-9078-3bb4aee81253/.user_uploaded/media_1787828839749.png")
print("media_1787828839749 size:", img2.size)
