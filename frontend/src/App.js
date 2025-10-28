import React, { useState } from "react";

function App() {
  const [board, setBoard] = useState([
    ["-", "-", "-"],
    ["-", "-", "-"],
    ["-", "-", "-"],
  ]);
  const [currentPlayer, setCurrentPlayer] = useState("X");
  const [winner, setWinner] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleClick(pos) {
    console.log("Sending move:", pos); // should print 0–8 in order

    if (winner || loading) return;

    setLoading(true);
    try {
      const response = await fetch("http://localhost:5050/api/tictactoe/move", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pos }), // Backend expects { pos: int }
      });

      const data = await response.json();

      if (data.error) {
        console.error(data.error);
        setLoading(false);
        return;
      }

      // Convert backend 1D list into 2D grid
      setBoard([
        data.board.slice(0, 3),
        data.board.slice(3, 6),
        data.board.slice(6, 9),
      ]);
      setWinner(data.winner);
      setCurrentPlayer(data.currentPlayer);
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  }

  async function resetBoard() {
    try {
      await fetch("http://localhost:5050/api/tictactoe/reset", {
        method: "POST",
      });
    } catch (err) {
      console.error("Error resetting:", err);
    }

    setBoard([
      ["-", "-", "-"],
      ["-", "-", "-"],
      ["-", "-", "-"],
    ]);
    setWinner(null);
    setCurrentPlayer("X");
  }

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Tic Tac Toe</h1>
      {winner ? <h2>Winner: {winner}</h2> : <h2>Player: {currentPlayer}</h2>}

      <div style={{ display: "inline-block" }}>
        {board.map((row, rIndex) => (
          <div key={rIndex} style={{ display: "flex" }}>
            {row.map((cell, cIndex) => {
              const pos = rIndex * 3 + cIndex; // 0–8 layout (same as backend)
              return (
                <button
                  key={cIndex}
                  onClick={() => handleClick(pos)}
                  style={{
                    width: 80,
                    height: 80,
                    fontSize: "2em",
                    margin: 3,
                    cursor: "pointer",
                  }}
                >
                  {cell === "-" ? "" : cell}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      <div>
        <button onClick={resetBoard} style={{ marginTop: "20px" }}>
          Reset
        </button>
      </div>
    </div>
  );
}

export default App;
