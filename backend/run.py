from flask import Flask
from flask_cors import CORS
from app.routes.game_routes import game_bp

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})  # Allow all origins (for local dev)

app.register_blueprint(game_bp)

if __name__ == "__main__":
    app.run(debug=True, port=5050)
