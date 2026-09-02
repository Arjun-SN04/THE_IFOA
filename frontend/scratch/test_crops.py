from PIL import Image

img = Image.open("/home/arjun/.gemini/antigravity-ide/brain/6e5c535a-b584-4da6-9078-3bb4aee81253/.user_uploaded/media_1787828533619.png")
# Let's crop from x=80 to x=220, y=0 to y=185
crop1 = img.crop((80, 0, 220, 185))
crop1.save("/home/arjun/the_IFOA/frontend/scratch/crop_test1.png")

# In media_1787828839749.png
img2 = Image.open("/home/arjun/.gemini/antigravity-ide/brain/6e5c535a-b584-4da6-9078-3bb4aee81253/.user_uploaded/media_1787828839749.png")
crop2 = img2.crop((120, 80, 260, 250))
crop2.save("/home/arjun/the_IFOA/frontend/scratch/crop_test2.png")

print("Crop test saved!")
