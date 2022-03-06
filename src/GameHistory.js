import React, { useMemo } from "react";
import { B, W } from "./constants.js";

const GameHistory = ({ blackMode, whiteMode, moveHistory }) => {
  const [blackMoves, whiteMoves] = useMemo(() => {
    const blackMoves = moveHistory.filter((m) => m.player === B);
    const whiteMoves = moveHistory.filter((m) => m.player === W);
    return [blackMoves, whiteMoves];
  }, [moveHistory]);

  return (
    <div className="game-history">
      <div className="flex-row">
        <div className="green-cell">
          <span className="black"></span>
          <div>{blackMode}</div>
        </div>
        <div className="green-cell">
          <span className="white"></span>
          <div>{whiteMode}</div>
        </div>
      </div>
      <div
        className="flex-row"
        style={{
          height: "500px",
          overflowY: "auto",
        }}
      >
        <div style={{ width: "50%" }}>
          {blackMoves.map((point, i) => (
            <div key={i} style={{ border: "1px solid black" }}>
              {point.x + 1}, {point.y + 1}
            </div>
          ))}
        </div>
        <div style={{ width: "50%" }}>
          {whiteMoves.map((point, i) => (
            <div key={i} style={{ border: "1px solid black" }}>
              {point.x + 1}, {point.y + 1}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GameHistory;
