import os
from flask import Flask, send_from_directory
from flask_cors import CORS
from app.routes.game_routes import game_bp

# Configure Flask to serve static files from the 'static' directory
app = Flask(__name__, static_folder='static', static_url_path='')
CORS(app, resources={r"/*": {"origins": "*"}})  # Allow all origins (for local dev)

app.register_blueprint(game_bp)

# Serve React frontend
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_react(path):
    """Serve React app - API routes are handled by blueprints first"""
    # Don't serve React for API routes
    if path.startswith('api/'):
        return {'error': 'API route not found'}, 404

    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

if __name__ == "__main__":
    # Use PORT from environment for Cloud Run compatibility, default to 5050 for local dev
    port = int(os.environ.get('PORT', 5050))
    app.run(debug=True, host='0.0.0.0', port=port)
