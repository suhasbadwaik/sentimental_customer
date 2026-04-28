from flask import Flask, request, jsonify
from flask_cors import CORS
from analyser import analyse
import os

app = Flask(__name__)
CORS(app)


@app.route("/analyze", methods=["POST"])
def analyze():
    #  print("/analyze endpoint hit")

    body = request.get_json(force=True, silent=True) or {}
    text = body.get("text", "").strip()

    if not text:
        return jsonify({"error": "text field is required"}), 400

    result = analyse(text)
    return jsonify(result), 200




if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5001))
    print(f"🐍 Python sentiment service running on http://localhost:{port}")
    app.run(host="0.0.0.0", port=port, debug=True)