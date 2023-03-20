import { Field, getBlanks } from "../game";
import { randomMove, winningMove } from "./bot";

export function easyMove(board: Field[], own: Field): number {
  const blanks = getBlanks(board);

  // test if the bot can win
  const win = winningMove(board, own);
  if (win >= 0) return win;

  return blanks[randomMove(blanks.length)];
}
