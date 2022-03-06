export const B = 0;
export const W = 1;
export const E = 2;
export const P = 3;

export const DEFAULT_SIZE = 8;
export const DEFAULT_TIME = process.env.REACT_APP_TIMEOUT
  ? parseInt(process.env.REACT_APP_TIMEOUT)
  : 30;

export const MODES = {
  human: "human",
  randy: "randy",
  minimax: "minimax",
  alphabeta: "alphabeta",
};

export const PLAYER_OPTIONS = [
  { value: MODES.human, label: "Human" },
  { value: MODES.randy, label: "Randy" },
  { value: MODES.minimax, label: "Minimax" },
  { value: MODES.alphabeta, label: "Alphabeta" },
];

export const SIZE_OPTIONS = Array.from({ length: 8 }, (v, i) => ({
  value: i + 4,
  label: `${i + 4}x${i + 4}`,
}));

export const classes = ["black", "white", "empty", "placeable"];
