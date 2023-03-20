import { botMoveWithMode } from "./bots/bot";

export enum Mode {
  EASY = 0,
  PETTY,
  MEDIUM,
  HARD,
  HUMAN,
  ONLINE,
}

export enum Field {
  EMPTY = 0,
  PLAYER1,
  PLAYER2,
}

export class Player {
  score = 0;
  field: Field.PLAYER1 | Field.PLAYER2;
  mode: Mode = Mode.EASY;
  connection: WebSocket | undefined = undefined;

  constructor(f: Field.PLAYER1 | Field.PLAYER2, m: Mode = Mode.EASY) {
    this.field = f;
    this.mode = m;
  }

  addWin() {
    this.score++;
  }
  resetScore() {
    this.score = 0;
  }
  isHuman(): boolean {
    return this.mode === Mode.HUMAN;
  }
  isOnline(): boolean {
    return this.mode === Mode.ONLINE;
  }
  move(board: Field[]): number {
    switch (this.mode) {
      case Mode.ONLINE:
        return -1;
      case Mode.HUMAN:
        return -1;
      default: {
        const botMove = botMoveWithMode(this.mode);
        if (botMove) {
          return botMove(board, this.field);
        }
        return -1;
      }
    }
  }
}

export class Game {
  player: Player;
  enemy: Player;

  constructor(
    player: Player = new Player(Field.PLAYER1),
    enemy: Player = new Player(Field.PLAYER2)
  ) {
    player.resetScore();
    player.mode = Mode.HUMAN;
    enemy.resetScore();
    this.player = player;
    this.enemy = enemy;
  }

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
  switchSides() {
    const tempPlayer = this.player;
    this.player = this.enemy;
    this.enemy = tempPlayer;
    this.player.field = Field.PLAYER1;
    this.enemy.field = Field.PLAYER2;
  }
  updateMode(mode: Mode) {
    if (this.player.isHuman() && this.enemy.isHuman() && mode != Mode.HUMAN) {
      this.enemy.mode = mode;
      return;
    }
    if (!this.player.isHuman()) this.player.mode = mode;
    if (!this.enemy.isHuman()) this.enemy.mode = mode;
  }
}

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

export function isFull(board: Field[]): boolean {
  return !board.some((field) => field === Field.EMPTY);
}

export function won(board: Field[]): Field {
  for (const player of [Field.PLAYER1, Field.PLAYER2]) {
    if (
      (board[0] === player && board[1] === player && board[2] === player) ||
      (board[3] === player && board[4] === player && board[5] === player) ||
      (board[6] === player && board[7] === player && board[8] === player) ||
      (board[0] === player && board[4] === player && board[8] === player) ||
      (board[2] === player && board[4] === player && board[6] === player) ||
      (board[0] === player && board[3] === player && board[6] === player) ||
      (board[1] === player && board[4] === player && board[7] === player) ||
      (board[2] === player && board[5] === player && board[8] === player)
    )
      return player;
  }
  return Field.EMPTY;
}

export function newBoard(): Field[] {
  const board = new Array<Field>(9);
  board.fill(Field.EMPTY);
  return board;
}

export function getBlanks(board: Field[]): number[] {
  return board
    .map<number>((field, index) => {
      if (field !== Field.EMPTY) return -1;
      return index;
    })
    .filter((value) => {
      return value >= 0;
    });
}

export function invertPlayer(player: Field): Field {
  if (!isPlayer(player)) return Field.EMPTY;
  return 3 - player;
}

export function isPlayer(player: Field): boolean {
  return player === Field.PLAYER1 || player === Field.PLAYER2;
}
