# backend/app/routes/game_routes.py
from flask import Blueprint, jsonify, request
from flask_cors import cross_origin
from app.services.game_logic.TTT import TicTacToe

game_bp = Blueprint("game", __name__)

# Global game state (for local dev)
current_game = TicTacToe()

@game_bp.route("/api/tictactoe/move", methods=["POST"])
@cross_origin()  # allow React frontend access
def make_move():
    global current_game
    data = request.get_json()

    # Expect {"pos": 0-8}
    pos = data.get("pos")
    try:
        # Create new game state
        next_state = current_game.makeMove(pos)
        current_game = next_state
    except ValueError as e:
        return jsonify({"error": str(e)}), 400

    return jsonify({
        "board": current_game.state,
        "currentPlayer": current_game.current_player,
        "winner": current_game.checkWin()
    })

@game_bp.route("/api/tictactoe/reset", methods=["POST"])
@cross_origin()
def reset_game():
    global current_game
    current_game = TicTacToe()
    return jsonify({
        "board": current_game.state,
        "currentPlayer": current_game.current_player,
        "winner": None
    })
