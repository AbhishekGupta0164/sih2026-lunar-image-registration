import threading
import torch

def test_thread():
    try:
        print("Thread starting")
        x = torch.randn(1000, 1000)
        y = x @ x.T
        print("Thread success")
    except Exception as e:
        print("Error:", e)

t = threading.Thread(target=test_thread)
t.start()
t.join()
