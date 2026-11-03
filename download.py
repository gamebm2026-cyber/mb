import requests

file_id = "1tqUIOAMdiJPB7ZjSK0ahkfNoeZ2SmwBlu"

url = f"https://drive.google.com/uc?export=download&id={file_id}"

response = requests.get(url)

with open("downloaded_file.zip", "wb") as f:
    f.write(response.content)

print("Download complete!")
