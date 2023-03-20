import { moveWithMode, type BotMove } from "./bots/bot";

// all possible modes of the game
export enum Mode {
  EASY = 0,
  PETTY,
  MEDIUM,
  HARD,
  HUMAN,
  ONLINE, // will be implemented later
}

// All possible states of a single Field on the board
export enum Field {
  EMPTY = 0,
  PLAYER1,
  PLAYER2,
}

export const winningPos = [
  //horizontal
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  //vertical
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  //diagonal
  [0, 4, 8],
  [2, 4, 6],
];

// Player describes a single player
export class Player {
  score = 0;
  field: Field.PLAYER1 | Field.PLAYER2;
  botMove: BotMove | undefined = undefined;

  constructor(f: Field.PLAYER1 | Field.PLAYER2) {
    this.field = f;
  }

  addWin() {
    this.score++;
  }

  // isHuman returns, if this player is controlled by a human, or a bot
  isHuman(): boolean {
    return this.botMove === undefined;
  }

  // if this player is a bot, execute the associated botMove function
  move(board: Field[]): number {
    if (this.botMove !== undefined) return this.botMove(board, this.field);
    return -1;
  }
}

// Game keeps track of the games state (mode and scores)
export class Game {
  player: Player; // this is always X
  enemy: Player; // this is always O
  mode: Mode;

  constructor(
    player: Player = new Player(Field.PLAYER1),
    enemy: Player = new Player(Field.PLAYER2),
    mode: Mode = Mode.EASY
  ) {
    player.score = 0;
    enemy.score = 0;
    this.mode = mode;
    this.player = player;
    this.enemy = enemy;
    this.enemy.botMove = moveWithMode(this.mode);
  }

  // score a win for the given player
  addWin(player: Field) {
    switch (player) {
      case Field.PLAYER1:
        this.player.addWin();
        break;
      case Field.PLAYER2:
        this.enemy.addWin();
        break;
    }
  }

  // switches the side of both players
  switchSides() {
    const botMove = this.player.botMove;
    this.player.botMove = this.enemy.botMove;
    this.enemy.botMove = botMove;
    const score = this.player.score;
    this.player.score = this.enemy.score;
    this.enemy.score = score;
  }

  // updates the difficulty of the bot, changes to PvP
  updateMode(mode: Mode) {
    this.mode = mode;
    if (this.player.isHuman() && this.enemy.isHuman() && mode != Mode.HUMAN) {
      this.enemy.botMove = moveWithMode(this.mode);
      return;
    }
    if (!this.player.isHuman()) this.player.botMove = moveWithMode(this.mode);
    if (!this.enemy.isHuman()) this.enemy.botMove = moveWithMode(this.mode);
  }
}

// Outcome describes the current state of a given board
export class Outcome {
  finished: boolean;
  winner: Field = Field.EMPTY;

  constructor(board: Field[]) {
    this.winner = won(board);
    this.finished = isFull(board) || this.winner !== Field.EMPTY;
  }

  isDraw(): boolean {
    return this.finished === true && this.winner === Field.EMPTY;
  }
}

// isFull tests, if there are any blank spaces are left
export function isFull(board: Field[]): boolean {
  return !board.some((field) => field === Field.EMPTY);
}

// won tests, if either player has won the game
// returns: the player, that won, or Field.EMPTY if no one won (draw or not finished)
export function won(board: Field[]): Field {
  for (const player of [Field.PLAYER1, Field.PLAYER2]) {
    for (const positions of winningPos) {
      //check every array element, all elements must match condition
      if (positions.every((position) => board[position] === player)) {
        return player;
      }
    }
  }

  return Field.EMPTY;
}

// newBoard returns a new, empty Array of Fields with length 9
export function newBoard(): Field[] {
  const board = new Array<Field>(9);
  board.fill(Field.EMPTY);
  return board;
}

// getBlanks returns the indices of all empty fields in a given board
export function getBlanks(board: Field[]): number[] {
  return (
    board
      // first, map all Field.EMPTY to their index, all others to -1
      .map<number>((field, index) => {
        if (field !== Field.EMPTY) return -1;
        return index;
      })
      // than, filter out all -1 values
      .filter((value) => {
        return value >= 0;
      })
  );
}

// invertPlayer returns:
// Field.EMPTY => Field.EMPTY
// Field.PLAYER1 => Field.PLAYER2
// Field.PLAYER2 => Field.PLAYER1
export function invertPlayer(player: Field): Field {
  if (!isPlayer(player)) return Field.EMPTY;
  return 3 - player;
}

// isPlayer tests, that player is either Field.PLAYER1 or Field.PLAYER2
export function isPlayer(player: Field): boolean {
  return player === Field.PLAYER1 || player === Field.PLAYER2;
}
