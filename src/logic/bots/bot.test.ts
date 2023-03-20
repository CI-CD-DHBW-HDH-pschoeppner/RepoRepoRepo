import { Field, Mode, newBoard } from "../game";
import { moveWithMode, winningMove } from "./bot";

describe("winning move", () => {
  it("no winning move", () => {
    const board = newBoard();
    const move = winningMove(board, Field.PLAYER1);
    expect(move).toBe(-1);
  });
  it("reject empty field", () => {
    const board = newBoard();
    expect(() => winningMove(board, Field.EMPTY)).toThrow(
      "Player 0 is not valid"
    );
  });
  it("pick winning move", () => {
    const board = newBoard();
    board[0] = Field.PLAYER1;
    board[1] = Field.PLAYER1;
    const move = winningMove(board, Field.PLAYER1);
    expect(move).toBe(2);
  });
});

describe("moveWithMode with invalid mode", () => {
  it("Mode.HUMAN", () => {
    const move = moveWithMode(Mode.HUMAN);
    expect(move).toBe(undefined);
  });
  it("Mode.ONLINE", () => {
    const move = moveWithMode(Mode.ONLINE);
    expect(move).toBe(undefined);
  });
});
