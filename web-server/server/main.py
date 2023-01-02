import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from predict_controller import predict_image

app = Flask(__name__)
CORS(app)

@app.route("/", methods=['POST'])
def predict():

  file = request.files['image'].read()
  response = jsonify(predict_image(file))
  response.headers.add('Access-Control-Allow-Origin', '*')
  response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
  return response

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)