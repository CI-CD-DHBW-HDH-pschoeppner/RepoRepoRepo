import {
  Field,
  Game,
  getBlanks,
  invertPlayer,
  isFull,
  Mode,
  newBoard,
  Outcome,
  won,
} from "./game";

describe("invert player", () => {
  it("invert player1 to player2", () => {
    const result: Field = invertPlayer(Field.PLAYER1);
    expect(result).toBe(Field.PLAYER2);
  });
  it("invert player2 to player1", () => {
    const result: Field = invertPlayer(Field.PLAYER2);
    expect(result).toBe(Field.PLAYER1);
  });
  it("return empty field as empty", () => {
    const result: Field = invertPlayer(Field.EMPTY);
    expect(result).toBe(Field.EMPTY);
  });
  it("return empty field if bigger than 2", () => {
    const result: Field = invertPlayer(3);
    expect(result).toBe(Field.EMPTY);
  });
});

describe("get blank fields", () => {
  it("get all blank fields", () => {
    const board: Field[] = newBoard();
    const result: number[] = getBlanks(board);
    expect(result).toStrictEqual([0, 1, 2, 3, 4, 5, 6, 7, 8]);
  });
  it("get blanks except middle", () => {
    const board: Field[] = newBoard();
    board[4] = Field.PLAYER1;
    const result: number[] = getBlanks(board);
    expect(result).toStrictEqual([0, 1, 2, 3, 5, 6, 7, 8]);
  });
});

describe("init new board", () => {
  it("test create empty board", () => {
    const board: Field[] = newBoard();
    expect(board).toStrictEqual([0, 0, 0, 0, 0, 0, 0, 0, 0]);
  });
});

describe("won", () => {
  it("empty board", () => {
    const board: Field[] = newBoard();
    const winner: Field = won(board);
    expect(winner).toBe(Field.EMPTY);
  });
  it("first row", () => {
    const board: Field[] = newBoard();
    board[0] = Field.PLAYER1;
    board[1] = Field.PLAYER1;
    board[2] = Field.PLAYER1;
    const winner: Field = won(board);
    expect(winner).toBe(Field.PLAYER1);
  });
  it("second row", () => {
    const board: Field[] = newBoard();
    board[3] = Field.PLAYER2;
    board[4] = Field.PLAYER2;
    board[5] = Field.PLAYER2;
    const winner: Field = won(board);
    expect(winner).toBe(Field.PLAYER2);
  });
  it("third row", () => {
    const board: Field[] = newBoard();
    board[6] = Field.PLAYER1;
    board[7] = Field.PLAYER1;
    board[8] = Field.PLAYER1;
    const winner = won(board);
    expect(winner).toBe(Field.PLAYER1);
  });
  it("first column", () => {
    const board = newBoard();
    board[0] = Field.PLAYER2;
    board[3] = Field.PLAYER2;
    board[6] = Field.PLAYER2;
    const winner = won(board);
    expect(winner).toBe(Field.PLAYER2);
  });
  it("second column", () => {
    const board = newBoard();
    board[1] = Field.PLAYER1;
    board[4] = Field.PLAYER1;
    board[7] = Field.PLAYER1;
    const winner = won(board);
    expect(winner).toBe(Field.PLAYER1);
  });
  it("third column", () => {
    const board = newBoard();
    board[2] = Field.PLAYER1;
    board[5] = Field.PLAYER1;
    board[8] = Field.PLAYER1;
    const winner = won(board);
    expect(winner).toBe(Field.PLAYER1);
  });
  it("left to right", () => {
    const board = newBoard();
    board[0] = Field.PLAYER1;
    board[4] = Field.PLAYER1;
    board[8] = Field.PLAYER1;
    const winner = won(board);
    expect(winner).toBe(Field.PLAYER1);
  });
  it("right to left", () => {
    const board = newBoard();
    board[2] = Field.PLAYER1;
    board[4] = Field.PLAYER1;
    board[6] = Field.PLAYER1;
    const winner = won(board);
    expect(winner).toBe(Field.PLAYER1);
  });
  it("draw", () => {
    const board = newBoard();
    board[0] = Field.PLAYER1;
    board[1] = Field.PLAYER1;
    board[2] = Field.PLAYER2;
    board[3] = Field.PLAYER2;
    board[4] = Field.PLAYER2;
    board[5] = Field.PLAYER1;
    board[6] = Field.PLAYER1;
    board[7] = Field.PLAYER1;
    board[8] = Field.PLAYER2;
    const winner = won(board);
    expect(winner).toBe(Field.EMPTY);
  });
});

describe("is full", () => {
  it("board is full", () => {
    const board = newBoard();
    board[0] = Field.PLAYER1;
    board[1] = Field.PLAYER1;
    board[2] = Field.PLAYER2;
    board[3] = Field.PLAYER2;
    board[4] = Field.PLAYER2;
    board[5] = Field.PLAYER1;
    board[6] = Field.PLAYER1;
    board[7] = Field.PLAYER1;
    board[8] = Field.PLAYER2;
    const full = isFull(board);
    expect(full).toBeTruthy();
  });
});

describe("outcome", () => {
  it("outcome is a draw", () => {
    const board = newBoard();
    board[0] = Field.PLAYER1;
    board[1] = Field.PLAYER1;
    board[2] = Field.PLAYER2;
    board[3] = Field.PLAYER2;
    board[4] = Field.PLAYER2;
    board[5] = Field.PLAYER1;
    board[6] = Field.PLAYER1;
    board[7] = Field.PLAYER1;
    board[8] = Field.PLAYER2;
    const outcome = new Outcome(board);
    expect(outcome.isDraw()).toBeTruthy();
    expect(outcome.finished).toBeTruthy();
    expect(outcome.winner).toBe(Field.EMPTY);
  });
  it("not yet finished", () => {
    const board = newBoard();
    const outcome = new Outcome(board);
    expect(outcome.finished).toBeFalsy();
    expect(outcome.isDraw()).toBeFalsy();
    expect(outcome.winner).toBe(Field.EMPTY);
  });
});

describe("game.updateMode", () => {
  it("from Mode.Human to Mode.EASY", () => {
    const game = new Game();

    game.updateMode(Mode.HUMAN);

    expect(game.player.isHuman()).toBeTruthy();
    expect(game.enemy.isHuman()).toBeTruthy();

    game.updateMode(Mode.EASY);

    expect(game.player.isHuman()).toBeTruthy();
    expect(game.enemy.isHuman()).toBeFalsy();
  });
});
