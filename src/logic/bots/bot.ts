import { Field, getBlanks, isPlayer, Mode, won } from "../game";
import { easyMove } from "./easy";
import { hardMove } from "./hard";
import { mediumMove, pettyMove } from "./medium";

export interface BotMove {
  (board: Field[], own: Field): number;
}

export function botMoveWithMode(mode: Mode): BotMove | undefined {
  switch (mode) {
    case Mode.EASY:
      return easyMove;
    case Mode.PETTY:
      return pettyMove;
    case Mode.MEDIUM:
      return mediumMove;
    case Mode.HARD:
      return hardMove;
    case Mode.HUMAN || Mode.ONLINE:
      return undefined;
    default:
      return undefined;
  }
}

export function winningMove(board: Field[], player: Field): number {
  if (!isPlayer(player)) throw new Error(`Player ${player} is not valid`);
  const blanks = getBlanks(board);
  const copyBoard = [...board];

  for (const move of blanks) {
    copyBoard[move] = player;
    if (won(copyBoard) === player) return move;
    copyBoard[move] = Field.EMPTY;
  }

  return -1;
}

export function randomMove(bounds: number): number {
  return Math.floor(Math.random() * bounds);
}
