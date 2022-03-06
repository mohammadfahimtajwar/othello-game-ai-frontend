import React from "react";
import BoardLine from "./BoardLine.js";

const GameBoard = (props) => {
  return (
    <div className="flex-col">
      {props.board.map((line, y) => {
        return (
          <BoardLine
            key={y}
            y={y}
            line={line}
            clickHandler={props.clickHandler}
            showMoveOptions={props.showMoveOptions}
          />
        );
      })}
    </div>
  );
};

export default GameBoard;
