import { Field, getBlanks, invertPlayer, won } from "../game";

// the medium bot:
// - chooses the winning move, if it can win
// - blocks the player from winning, if it can
// - chooses the middle (4) field, if it can
// - chooses a random move otherwise
export function mediumMove(board: Field[], own: Field): number {
  const blanks = getBlanks(board);

  const moves: Map<number, number> = new Map();
  for (const move of blanks) {
    const copyBoard = [...board];
    copyBoard[move] = own;
    moves.set(move, pettyMove(copyBoard, own));
    copyBoard[move] = Field.EMPTY;
  }

  let bestScore: [number, number] = [-1, -Infinity];
  for (const move of moves) {
    if (move[1] > bestScore[1]) bestScore = move;
  }

  return bestScore[0];
}

// this bot:
// - blocks the player from winning, if it can
// - chooses a random move otherwise
export function pettyMove(board: Field[], own: Field): number {
  const blanks = getBlanks(board);

  const winner = won(board);
  if (winner === own) return 1; // win
  else if (winner === invertPlayer(own)) return -1; // loss
  else if (!blanks.length) return 0; // draw

  return -1;
}
