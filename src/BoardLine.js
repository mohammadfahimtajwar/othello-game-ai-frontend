import React from "react";
import Cell from "./Cell.js";

const BoardLine = props => {
  const { y, line } = props;
  return (
    <div className="flex-row">
      {line.map((cellType, x) => {
        return (
          <Cell
            key={"" + y + x}
            x={x}
            y={y}
            clickHandler={props.clickHandler}
            type={cellType}
            showMoveOptions={props.showMoveOptions}
          />
        );
      })}
    </div>
  );
};

export default BoardLine;
