import { Field, isPlayer, Mode, winningPos } from "../game";
import { easyMove } from "./easy";
import { hardMove } from "./hard";
import { mediumMove, pettyMove } from "./medium";

export interface BotMove {
  (board: Field[], own: Field): number;
}

// returns the appropriated function for the given mode
export function moveWithMode(mode: Mode): BotMove | undefined {
  switch (mode) {
    case Mode.EASY:
      return easyMove;
    case Mode.PETTY:
      return pettyMove;
    case Mode.MEDIUM:
      return mediumMove;
    case Mode.HARD:
      return hardMove;
    case Mode.HUMAN || Mode.ONLINE: // if both players are controlled by a human, returns undefined
      return undefined;
    default:
      return undefined;
  }
}

// winningMove returns:
// - the winning move for a given player
// - -1 if there is none
export function winningMove(board: Field[], player: Field): number {
  if (!isPlayer(player)) throw new Error(`Player ${player} is not valid`);

  winningPos.forEach(function (element) {
    let amountCorrect = 0;
    let nextMove = -1;
    for (let i = 0; i < 3; i++) {
      if (board[element[i]] == player) {
        amountCorrect = amountCorrect + 1;
      } else {
        if (board[element[i]] == 0) {
          nextMove = board[element[i]];
        }
      }
    }
    if (nextMove != -1) {
      return nextMove;
    }
  });
  return -1;
}

export function randomMove(bounds: number): number {
  return Math.floor(Math.random() * bounds);
}
