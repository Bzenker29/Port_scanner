import socket
import time
from concurrent.futures import ThreadPoolExecutor

# Configuration
target = "69.255.8.148"
start_port = 1
end_port = 1024
timeout = 1.0
interval = 5  # Seconds between scans
max_threads = 100

def scan_port(ip, port):
    """Return True if the port is open, else False."""
    try:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            s.settimeout(timeout)
            return s.connect_ex((ip, port)) == 0
    except:
        return False

def scan_ports(ip, start_port, end_port):
    """Scan a range of ports and return the open ones."""
    open_ports = []

    def check(port):
        if scan_port(ip, port):
            open_ports.append(port)

    with ThreadPoolExecutor(max_workers=max_threads) as executor:
        for port in range(start_port, end_port + 1):
            executor.submit(check, port)

    return sorted(open_ports)

if __name__ == "__main__":
    print(f"Scanning {target} from port {start_port} to {end_port} every {interval} seconds. Press Ctrl+C to stop.\n")

    try:
        while True:
            print(f"[{time.strftime('%H:%M:%S')}] Starting scan...")
            open_ports = scan_ports(target, start_port, end_port)
            if open_ports:
                print(f"Open ports: {', '.join(str(p) for p in open_ports)}")
            else:
                print("No open ports found.")
            print("-" * 40)
            time.sleep(interval)
    except KeyboardInterrupt:
        print("\nStopped scanning.")
