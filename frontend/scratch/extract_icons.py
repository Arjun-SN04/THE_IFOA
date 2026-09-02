import os
from PIL import Image

output_dir = "/home/arjun/the_IFOA/frontend/src/assets/images/course-icons"
os.makedirs(output_dir, exist_ok=True)

# 1. media_1787828835587.png contains Course Schedule + 4 Fact Cards
img_schedule = Image.open("/home/arjun/.gemini/antigravity-ide/brain/6e5c535a-b584-4da6-9078-3bb4aee81253/.user_uploaded/media_1787828835587.png")
w, h = img_schedule.size
print("Schedule img size:", w, h)

# 2. media_1787828839749.png contains Course Delivery (School & Format)
img_delivery = Image.open("/home/arjun/.gemini/antigravity-ide/brain/6e5c535a-b584-4da6-9078-3bb4aee81253/.user_uploaded/media_1787828839749.png")
w2, h2 = img_delivery.size
print("Delivery img size:", w2, h2)

# Save high-res copies and crops
img_schedule.save(os.path.join(output_dir, "course-schedule-card.png"))
img_delivery.save(os.path.join(output_dir, "course-delivery-card.png"))
print("Done saving baseline cards!")
