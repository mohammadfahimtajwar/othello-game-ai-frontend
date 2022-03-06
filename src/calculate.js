import { B, W, E, P } from "./constants.js";

export function searchPlaceable(board, user) {
  const size = board.length;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (board[y][x] === B || board[y][x] === W) {
        continue;
      }

      board[y][x] = E;

      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (dx === 0 && dy === 0) {
            continue;
          }

          let nx = x + dx;
          let ny = y + dy;
          if (!isOnBoard(board, ny, nx) || !(board[ny][nx] === 1 - user)) {
            continue;
          }

          while (true) {
            nx = nx + dx;
            ny = ny + dy;
            if (
              !isOnBoard(board, ny, nx) ||
              board[ny][nx] === E ||
              board[ny][nx] === P
            ) {
              break;
            } else if (board[ny][nx] === 1 - user) {
              continue;
            } else {
              board[y][x] = P;
              break;
            }
          }
        }
      }
    }
  }

  return board;
}

function isOnBoard(board, y, x) {
  const size = board.length;
  if (y < 0 || y >= size || x < 0 || x >= size) {
    return false;
  }
  return true;
}

export function reverse(board, user, y, x) {
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      if (dx === 0 && dy === 0) {
        continue;
      }

      let nx = x + dx;
      let ny = y + dy;
      if (!isOnBoard(board, ny, nx) || !(board[ny][nx] === 1 - user)) {
        continue;
      }

      let step = 2;
      let flippable = false;
      let flippable_points = [
        [x, y],
        [nx, ny],
      ];
      while (true) {
        nx = x + dx * step;
        ny = y + dy * step;

        if (!isOnBoard(board, ny, nx) || board[ny][nx] === P || board[ny][nx] === E) {
          break;
        } else if (board[ny][nx] === user) {
          flippable = true;
          break;
        }
        flippable_points.push([nx, ny]);
        step += 1;
      }

      if (flippable) {
        for (const p of flippable_points) {
          board[p[1]][p[0]] = user;
        }
      }
    }
  }
  return board;
}

export function countStone(board) {
  const size = board.length;
  let b = 0;
  let w = 0;
  let p = 0;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (board[y][x] === B) {
        b++;
      } else if (board[y][x] === W) {
        w++;
      } else if (board[y][x] === P) {
        p++;
      }
    }
  }
  return [b, w, p];
}

export function getUserColor(user) {
  if (user === B) {
    return "Black";
  }
  return "White";
}

export function getPlayerName(player) {
  if (player === B) {
    return "Dark";
  }
  return "Light";
}

export const randomInList = (items) => {
  return items[Math.floor(Math.random() * items.length)];
};

export const getPossiblePoints = (board) => {
  const placeablePoints = [];
  for (let y = 0; y < board.length; y++) {
    for (let x = 0; x < board[y].length; x++) {
      if (board[y][x] === P) {
        placeablePoints.push({ x, y });
      }
    }
  }
  return placeablePoints;
};
