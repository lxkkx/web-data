import requests

url = "http://localhost:8000/api/auth/login"
payload = {
    "email": "sodalikhitha@gmail.com",
    "password": "Lxkxx@2411"
}

try:
    response = requests.post(url, json=payload)
    print(f"Status Code: {response.status_code}")
    print(f"Response Body: {response.text}")
except Exception as e:
    print(f"Failed to connect: {e}")
