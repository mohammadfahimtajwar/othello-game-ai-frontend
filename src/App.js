import React, { useEffect, useMemo, useState } from "react";
import { CSSTransition } from "react-transition-group";
import { useTimer } from "react-timer-hook";
import Select from "react-select";
import "./App.css";
import GameBoard from "./GameBoard.js";
import GameStatus from "./GameStatus.js";
import {
  searchPlaceable,
  reverse,
  countStone,
  getUserColor,
  getPlayerName,
} from "./calculate.js";

import {
  B,
  W,
  E,
  P,
  MODES,
  DEFAULT_SIZE,
  SIZE_OPTIONS,
  PLAYER_OPTIONS,
  DEFAULT_TIME,
} from "./constants.js";
import { getPoint } from "./api";
import GameHistory from "./GameHistory";

const App = () => {
  const [start, setStart] = useState(false);
  const [player, setPlayer] = useState(B);
  const [board, setBoard] = useState(null);
  const [size, setSize] = useState(DEFAULT_SIZE);
  const [blackMode, setBlackMode] = useState(MODES.human);
  const [whiteMode, setWhiteMode] = useState(MODES.alphabeta);
  const [message, setMessage] = useState("");
  const [numberBlack, setNumberBlack] = useState(2);
  const [numberWhite, setNumberWhite] = useState(2);
  const [gameOver, setGameOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [moveHistory, setMoveHistory] = useState([]);
  const { seconds, restart } = useTimer({
    expiryTimestamp: null,
    onExpire: () => {
      if (!gameOver && !isTurnOfHuman()) {
        setGameOver(true);
        setMessage(`${getPlayerName(1 - player)} won!`);
      }
    },
  });

  const showMoveOptions = useMemo(() => {
    const mode = {
      [B]: blackMode,
      [W]: whiteMode,
    }[player];
    if (mode !== MODES.human) {
      if (
        (player === B && whiteMode === MODES.human) ||
        (player === W && blackMode === MODES.human)
      ) {
        return false;
      }
    }
    return true;
  }, [player, start]);

  useEffect(() => {
    console.log("Init board", size);
    const b = [];
    const center = Math.round((size - 1) / 2);
    for (let i = 0; i < size; i++) {
      const row = [];
      for (let j = 0; j < size; j++) {
        if (i === j && (i === center || i === center - 1)) {
          row.push(W);
        } else if (
          (i === center - 1 && j === center) ||
          (j === center - 1 && i === center)
        ) {
          row.push(B);
        } else {
          row.push(E);
        }
      }
      b.push(row);
    }
    setBoard(searchPlaceable(b, player));
  }, [size]);

  useEffect(() => {
    if (!start) return;
    console.log("TURN OF", getUserColor(player));
    const gameover = checkGameStatus();
    if (gameover) return;
    if (isTurnOfHuman()) return;
    const time = new Date();
    time.setSeconds(time.getSeconds() + DEFAULT_TIME);
    restart(time);
    const mode = {
      [B]: blackMode,
      [W]: whiteMode,
    }[player];
    setLoading(true);
    getPoint(MODES[mode], { board, player })
      .then((point) => {
        handleClick(point.x, point.y, true);
      })
      .catch((error) => {
        setGameOver(true);
        setMessage(
          `${getPlayerName(1 - player)} won, ${getPlayerName(
            player
          )} lost by timeout!`
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, [player, start]);

  const checkGameStatus = () => {
    let [cntBlack, cntWhite, cnt_placeable] = countStone(board);
    let gameover = false;
    if (
      cntBlack + cntWhite === size * size ||
      cntBlack === 0 ||
      cntWhite === 0 ||
      cnt_placeable === 0
    ) {
      gameover = true;
    }

    let mess = "";
    if (gameover) {
      if (cntBlack > cntWhite) {
        mess = `Dark won!`;
      } else if (cntBlack < cntWhite) {
        mess = `Light won!`;
      } else {
        mess = "Draw";
      }
    }

    setMessage(mess);
    setNumberBlack(cntBlack);
    setNumberWhite(cntWhite);
    setGameOver(gameover);
    return gameover;
  };

  const isTurnOfHuman = () => {
    return (
      (player === B && blackMode === MODES.human) ||
      (player === W && whiteMode === MODES.human)
    );
  };

  const handleClick = (x, y, fromAI = false) => {
    if (gameOver || board[y][x] !== P || (loading && !fromAI)) {
      return;
    }
    setMoveHistory((history) => history.concat({ x, y, player }));
    console.log(`Handling point x=${x}, y=${y}`);
    let newBoard = reverse(board, player, y, x);

    let newPlayer = 1 - player;
    newBoard = searchPlaceable(newBoard, newPlayer);

    setBoard(newBoard);
    setPlayer(newPlayer);
  };

  return (
    <div className="App">
      <h1 style={{ marginBottom: "0px" }}>Othello Game AI</h1>
      <h2 style={{ marginTop: "0px" }}>(by Mohammad Fahim Tajwar)</h2>

      {!start && (
        <div className="form">
          <span>Size of the board:</span>
          <Select
            value={SIZE_OPTIONS.find((option) => option.value === size)}
            onChange={(option) => setSize(option.value)}
            options={SIZE_OPTIONS}
            isSearchable={false}
            className="selector"
          />
          <span>Who plays the dark pieces:</span>
          <Select
            value={PLAYER_OPTIONS.find((option) => option.value === blackMode)}
            onChange={(option) => setBlackMode(option.value)}
            options={PLAYER_OPTIONS}
            isSearchable={false}
            className="selector"
          />
          <span>Who plays the light pieces:</span>
          <Select
            value={PLAYER_OPTIONS.find((option) => option.value === whiteMode)}
            onChange={(option) => setWhiteMode(option.value)}
            options={PLAYER_OPTIONS}
            isSearchable={false}
            className="selector"
          />
          <button className="startBtn" onClick={() => setStart(true)}>
            Start
          </button>
        </div>
      )}
      <CSSTransition in={start} timeout={300} classNames="game" unmountOnExit>
        <>
          <div className="main-game">
            <div className="col-1-5">
              <GameStatus
                blackMode={blackMode}
                whiteMode={whiteMode}
                player={player}
                remainSecond={gameOver || isTurnOfHuman() ? "" : seconds}
                cntBlack={numberBlack}
                cntWhite={numberWhite}
              />
            </div>
            <GameBoard
              board={board}
              clickHandler={handleClick}
              showMoveOptions={showMoveOptions}
            />
            <div className="col-1-5">
              <GameHistory
                blackMode={blackMode}
                whiteMode={whiteMode}
                moveHistory={moveHistory}
              />
            </div>
          </div>

          {message && (
            <>
              <h3>{message}</h3>
              <button
                className="startBtn"
                onClick={() => window.location.reload()}
              >
                Play again
              </button>
            </>
          )}
        </>
      </CSSTransition>

      {!start && (
        <div className="description">
          <p>
            Othello (Reversi) is one of the most popular board games in the
            world. It is a two-player abstract strategy game, played using 64
            round disks, each colored dark on one side and light on the other,
            and a square, 8 by 8, uncheckered board. The players are
            traditionally referred to as dark and light, with dark making the
            first move by convention.
          </p>
          <p>
            The starting position occurs with 4 discs on the 4 central squares
            of the grid, 2 with dark sides facing up and 2 with light sides up,
            such that both discs of each color rest on intersecting diagonals.
            The dark player now makes a move by placing a dark disc on the board
            so that there exists at least one straight horizontal, vertical, or
            diagonal occupied line between the new disc and another dark piece,
            with one or more contiguous light pieces between them, a theme known
            as outflanking. After the move, the dark player captures all light
            pieces on the line between the new piece and an anchoring dark
            piece, by turning over those discs so that they now face dark sides
            up. Light makes the next move and play alternates until a player on
            move has no legal moves or the board is completely filled. The
            player with the greater number of discs facing up at the end wins.
            More information about the game can be found{" "}
            <a
              href="https://en.wikipedia.org/wiki/Reversi"
              target="_blank"
              rel="noopener noreferrer"
            >
              here
            </a>
            , or alternatively, in this{" "}
            <a
              href="https://www.youtube.com/watch?v=xDnYEOsjZnM"
              target="_blank"
              rel="noopener noreferrer"
            >
              video tutorial
            </a>
            .
          </p>
          <p>
            The game logic was implemented using object-oriented programming in
            Python. This implementation allows gameplay on all
            square board sizes ranging from 4 by 4 to 11 by 11 inclusive, as
            chosen by the user. The user can also choose one of 4 options to
            play each side: Human, Randy, Minimax or Alphabeta. Hence, the
            application allows a human player to play against another
            human, as well as to visualize games between two engine instances in
            real time. The application has been programmed to show all
            possible moves in a given position, using red circles, so that it
            becomes user-friendly, even for human players who may be complete
            beginners in the game. The interface also shows the move history
            using standard Othello board notation so players can keep track of
            their previous moves and moves by engines.
          </p>
          <p>
            Randy is a random engine that is based on the Python Random library,
            and selects a move at random in any given position.
          </p>
          <p>
            Minimax is a perfectly calculating artificially intelligent engine
            that uses the recursive algorithm, minimax, for turn-based two
            player games, under the assumptions of the deterministic,
            adversarial, zero sum and fully observable game model. This engine
            calculates the full game tree from every possible position,
            considering every possible move by both sides, at every step, in its
            search for the best possible move in each position. It is impossible
            for human players to beat this engine unless one plays the
            objectively perfect moves in every position. Unfortunately, since game
            trees become exponentially more complex with increasing board size,
            the engine tends to approach infeasible runtimes in finding best
            moves on larger boards. For this reason, a timeout feature was
            incorporated in this implementation, that causes any engine to lose
            by timeout if it is unable to make a move within {DEFAULT_TIME}{" "}
            seconds in any given position. In this scenario, a minimax engine
            will time out on any board larger than 4 by 4, because it becomes
            infeasible to brute-force search the objectively strongest move in all
            positions within {DEFAULT_TIME} seconds in such cases, by expanding
            the full game tree. Interestingly, Minimax can also occasionally
            lose to Randy on a 4 by 4 board, when playing the dark pieces,
            because the player moving second has an inherent advantage in such a
            case and Randy may make the best moves out of pure coincidence since
            there are a very small number of moves to choose from. More
            information about the minimax algorithm can be found{" "}
            <a
              href="https://en.wikipedia.org/wiki/Minimax"
              target="_blank"
              rel="noopener noreferrer"
            >
              here
            </a>
            .
          </p>
          <p>
            The timeout limitation of Minimax is solved by introducing the
            Alphabeta engine. Alphabeta is a Minimax engine equipped with
            Alpha-beta pruning, a modern, state-of-the-art artificial
            intelligence algorithm that allows the pruning of game trees by
            eliminating and scrapping complete branches and sub-branches of a
            game tree that are not relevant to the best move, thereby bypassing
            massive potential wastages in calculation time and resources. This
            is somewhat analogous to a human player automatically discarding
            obviously bad moves at the start of each new position, by intuition,
            and focusing deeply on calculating variations arising from better
            candidate moves instead. Furthermore, move ordering was accomplished
            in the Alphabeta engine by referencing the Heapq Python module, as
            this helps ordering possible moves by perceived move utility,
            greatly optimizing the pruning process, and fine-tuning the
            effectiveness of the algorithm so that pruning becomes much more
            likely, thereby reducing wasted time and resources. Unfortunately,
            even with these modifications, a Minimax engine equipped with
            Alpha-beta pruning and heap move ordering is not always able to find
            the best move in every position within {DEFAULT_TIME} seconds for
            large boards and complex positions. To address this, depth-limited
            Alpha-beta pruning was further effectuated in the Alphabeta engine.
            This feature enables the algorithm to recursively expand the game
            tree up to a certain depth and stop the search there by treating the
            resulting positions as though they were terminal positions. For
            instance, if the Alphabeta engine runs on a depth of 10 on a given
            position, it will calculate all possible variations arising out of
            the position up to 10 plies (moves) after the current position, and
            pick the move that leads to the best possible position for a side
            after 10 moves. That is, the engine picks the move to maximize the
            number of discs of the side on move, 10 moves down the line from the
            given position, without knowledge or calculation further down the
            game tree. Thus, in this scenario, the engine no longer makes the
            optimal moves but makes the moves that lead to the best position
            after 10 moves instead, for example. From analysis, such moves quite
            frequently tend to be the objectively strongest moves in every
            position (even though the game tree was not fully traversed) or
            reasonably very strong moves otherwise, except in rare cases,
            owing to the calculating power of the engine. This creates an
            interesting dynamic between the human player and the engine, which
            makes it difficult for all but the strongest human players to
            occasionally beat the Alphabeta engine. Thus, it poses an
            interesting challenge for players, while also making the engine
            practical to run, in terms of time taken to calculate move
            variations. From trial-and-error experience, a maximum depth of 5
            seemed suitable to run Alphabeta for all board sizes up to and
            including the upper limit, while posing enough of a challenge to
            experienced human players, and so, that depth has been used to run
            the Alphabeta engine for all board sizes, in this application. More
            information about the Alpha-beta pruning algorithm can be found{" "}
            <a
              href="https://en.wikipedia.org/wiki/Alpha-beta_pruning"
              target="_blank"
              rel="noopener noreferrer"
            >
              here
            </a>
            .
          </p>
          <p>
            This implementation uses Flask on the backend, deployed online using
            Heroku, and React on the frontend, which was installed on Netlify.
          </p>
        </div>
      )}
      <a href='https://github.com/mohammadfahimtajwar/othello-game-ai-frontend'><button>Frontend GitHub Repository</button></a>
      <a href='https://github.com/mohammadfahimtajwar/othello-game-ai-backend'><button>Backend GitHub Repository</button></a>
      <a href='https://mohammadfahimtajwar.com'><button>Click here to learn more about me!</button></a>
    </div>
  );
};

export default App;
