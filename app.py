from flask import Flask, request, render_template, jsonify
import numpy as np
from PIL import Image
import io
import tensorflow as tf
import csv

app = Flask(__name__)
model = tf.keras.models.load_model('digit.h5')

def preprocess_image(image):
    image = image.resize((28, 28))
    image = np.array(image) / 255.0
    image = np.expand_dims(image, axis=0)
    
    return image

def save_to_csv(image):
    with open('image_data.csv', mode='a', newline='') as file:
        writer = csv.writer(file)
        writer.writerow(image.flatten())

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    uploaded_file = request.files['file']
    image_path = "uploaded_image.png"
    uploaded_file.save(image_path)
    image = Image.open(image_path).convert('L') 
    # Preprocess the image
    
    
    image = preprocess_image(image)
    save_to_csv(image)
    # Save raw binary values to CSV

    
    # Predict using the loaded model
    prediction = model.predict(image)
    predicted_digit = np.argmax(prediction)
    print(predicted_digit)
    return jsonify({'predicted_digit': int(predicted_digit)})

if __name__ == '__main__':
    app.run(debug=True)
