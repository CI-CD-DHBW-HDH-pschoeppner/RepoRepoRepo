import { getBlanks, invertPlayer, type Field } from "../game";
import { randomMove, winningMove } from "./bot";

export function mediumMove(board: Field[], own: Field): number {
  const blanks = getBlanks(board);

  // first check, if the bot can win
  const win = winningMove(board, own);
  if (win >= 0) return win;

  // then check, if we can block a win
  const block = winningMove(board, invertPlayer(own));
  if (block >= 0) return block;

  if (blanks.some((field) => field === 4)) return 4;

  return blanks[randomMove(blanks.length)];
}

// this bot just tries to block a win
export function pettyMove(board: Field[], own: Field): number {
  const blanks = getBlanks(board);

  const block = winningMove(board, invertPlayer(own));
  if (block >= 0) return block;

  return blanks[randomMove(blanks.length)];
}
