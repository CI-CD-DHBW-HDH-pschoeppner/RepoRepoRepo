import { Field, getBlanks, invertPlayer } from "../game";
import { randomMove, winningMove } from "./bot";

// the medium bot:
// - chooses a random move otherwise
export function mediumMove(board: Field[], own: Field): number {
  const blanks = getBlanks(board);

// - chooses the winning move, if it can win
  const win = winningMove(board, own);
  if (win >= 0) return win;

// - blocks the player from winning, if it can
  const block = winningMove(board, invertPlayer(own));
  if (block >= 0) return block;
// - chooses the middle (4) field, if it can
  if (blanks.some((field) => field === 4)) return 4;

  return blanks[randomMove(blanks.length)];
}


// petty bot:
// - blocks the player from winning, if it can
// - chooses a random move otherwise
export function pettyMove(board: Field[], own: Field): number {
  const blanks = getBlanks(board);

  const block = winningMove(board, invertPlayer(own));
  if (block >= 0) return block;

  return blanks[randomMove(blanks.length)];
}

