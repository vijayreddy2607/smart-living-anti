import os
import google.generativeai as genai

keys_to_test = [
    "AIzaSyDjG7i4ugUv3f9DPOKOn4tIixw2AWFjXKk", # user typed this
    "AIzaSyDjG7i4ugUv3f9DPOKOn4tlixw2AWFjXKk", # what I saw
    "AIzaSyDjG7i4ugUv3f9DPOKOn4t1ixw2AWFjXKk", 
]

for key in keys_to_test:
    try:
        genai.configure(api_key=key)
        model = genai.GenerativeModel("gemini-2.5-flash")
        response = model.generate_content("Say hi")
        print(f"SUCCESS with key {key}")
        break
    except Exception as e:
        print(f"Failed {key}: {e}")
