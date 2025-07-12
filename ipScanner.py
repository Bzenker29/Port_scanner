import socket
import requests

def get_public_ip():
    try:
        return requests.get("https://api.ipify.org").text
    except requests.RequestException:
        return "Could not retrieve public IP"

def get_local_ip():
    try:
        hostname = socket.gethostname()
        return socket.gethostbyname(hostname)
    except socket.error:
        return "Could not retrieve local IP"

if __name__ == "__main__":
    print("Local IP Address:", get_local_ip())
    print("Public IP Address:", get_public_ip())
