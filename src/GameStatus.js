import React from "react";
import { getUserColor } from "./calculate.js";

const GameStatus = ({ player, remainSecond, cntBlack, cntWhite }) => {
  return (
    <table className="game-status">
      <thead>
        <tr>
          <th className="green-cell">TURN</th>
          <th className="green-cell">REMAINING TIME</th>
          <th className="green-cell">
            <span className="black"></span>
          </th>
          <th className="green-cell">
            <span className="white"></span>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="green-cell">
            <span className={getUserColor(player).toLowerCase()} />
          </td>
          <td>{remainSecond}</td>
          <td>{cntBlack}</td>
          <td>{cntWhite}</td>
        </tr>
      </tbody>
    </table>
  );
};

export default GameStatus;
