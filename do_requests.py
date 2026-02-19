import time
import requests

for i in range(1000):
    url = f'http://localhost:3000/users/{i+1}'
    try:
        print('-'*40)
        start = time.time()
        response = requests.get(url)
        if response.status_code == 200:
            data = response.json()
        elif response.status_code == 404:
            print("Resource not found")
        elif response.status_code >= 500:
            print("Server error – retry later")
        else:
            print(f"Unexpected status: {response.status_code}")
        end = time.time()
        print(url)
        print(f"First request took {end - start:.5f} seconds")
        start = time.time()
        response = requests.get(url)
        if response.status_code == 200:
            data = response.json()
        elif response.status_code == 404:
            print("Resource not found")
        elif response.status_code >= 500:
            print("Server error – retry later")
        else:
            print(f"Unexpected status: {response.status_code}")
        end = time.time()
        print(f"Second request took {end - start:.5f} seconds")
    except requests.exceptions.RequestException as e:
        print(f"Request failed: {e}")
        print(url)
