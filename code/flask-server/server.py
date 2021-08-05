# !/usr/bin/env python3
from flask import Flask, request, jsonify
from PIL import Image
import requests
import boto3
import io
import time


##############################
###### Flask server ##########
##############################

app = Flask(__name__)

@app.route("/")
def index():
    return "Hola"

@app.route("/counter/<counter_id>/photo", methods=['POST'])
def receive_counter_image(counter_id):
    print("Received photo for counter " + str(counter_id))
    file = request.files['image']
    pil_image = Image.open(file.stream)
    print(pil_image.format)

    in_mem_file = io.BytesIO()
    pil_image.save(in_mem_file, format=pil_image.format)
    in_mem_file.seek(0)

    # We create a path for the picture based on the data we have
    timestamp=str(int(time.time()*1000))
    pic_path='dev/'+counter_id+"/"+timestamp+'.jpg'

    s3 = boto3.client('s3', aws_access_key_id='HERE_YOUR_AWS_ACCESS_KEY', aws_secret_access_key='HERE_YOUR_AWS_ACCESS_SECRET')
    try:
        s3.upload_fileobj(in_mem_file, 'anceu-water', pic_path,ExtraArgs={'ACL':'public-read', 'ContentType':'image/jpeg'})
        print("Upload Successful")
        url = "http://192.168.100.191:3000/rest/v1/counter/"+counter_id+"/measure"
        r = requests.post(url, data = {'bucket': 'anceu-water', 'pic_path': pic_path})
    except FileNotFoundError:
        print("error no file found")

    return jsonify({'msg': 'success'})

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=8000)
