import React from "react";
import { classes, E, P } from "./constants.js";

const Cell = ({ clickHandler, showMoveOptions, x, y, type }) => {
  const handleClick = () => {
    clickHandler(x, y);
  };

  const cellClass = classes[type];

  return (
    <div className="cell">
      <span
        onClick={handleClick}
        className={
          !showMoveOptions && cellClass === classes[P] ? classes[E] : cellClass
        }
      />
    </div>
  );
};

export default Cell;
