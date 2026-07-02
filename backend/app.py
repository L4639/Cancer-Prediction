from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import joblib

app = Flask(__name__)
CORS(app)

# Load model and scaler
model = joblib.load("cancer_model.pkl")
scaler = joblib.load("scaler.pkl")

@app.route("/")
def home():
    return "🧬 Cancer Prediction API is Running"

@app.route("/predict", methods=["POST"])
def predict():
    try:
        input_data = request.json["data"]
        print("🔹 Received input:", input_data)

        # Convert to DataFrame
        df = pd.DataFrame(input_data)
        print("🔹 DataFrame format:\n", df)

        # Round to 2 decimals
        df = df.round(2)

        # Scale inputs
        scaled_input = scaler.transform(df)
        print("🔹 Scaled input:", scaled_input)

        # Prediction
        prediction = model.predict(scaled_input)
        print("✅ Prediction:", prediction)

        return jsonify({"prediction": prediction.tolist()})

    except Exception as e:
        print("❌ Error during prediction:", e)
        return jsonify({"error": str(e)})

if __name__ == "__main__":
    app.run(debug=True)
