#!/usr/bin/env python3
import requests
from picamera import PiCamera
import time

url = "http://192.168.100.132:5000/counter/2/photo"

camera = PiCamera()
camera.resolution = (1280, 720)
camera.rotation = 180
time.sleep(2)
print("Camera Init OK")

file_name = "/home/pi/camera/image.jpg"

if __name__ == '__main__':
    while True:
        print("Take picture, save it at " + file_name)
        camera.capture(file_name)
        files = {'image': open(file_name, 'rb')}
        print("Send picture to server")
        r = requests.post(url, files=files)
        print(vars(r))
        time.sleep(5)