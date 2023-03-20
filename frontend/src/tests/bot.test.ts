import { moveWithMode, randomMove, winningMove } from "../logic/bots/bot";
import { Field, Mode } from "../logic/game";

describe("bot randomMove test", () => {
  it("lower edge", () => {
    const result: number = randomMove(0);
    expect(result).toBe(0);
  });
  it("random number <= 5", () => {
    const result: number = randomMove(5);
    expect(result).toBeLessThanOrEqual(5);
  });
  it("random number not >0 ", () => {
    const result: number = randomMove(1);
    expect(result).toBeLessThan(1);
  });
});

describe("bot moveWith test", () => {
  it("mode: human", () => {
    const result = moveWithMode(Mode.HUMAN);
    expect(result).toBeUndefined();
  });
  it("mode: human", () => {
    const result = moveWithMode(Mode.HUMAN);
    expect(result).toBeUndefined();
  });
  it("mode: online", () => {
    const result = moveWithMode(Mode.ONLINE);
    expect(result).toBeUndefined();
  });
  it("mode: easy mode", () => {
    const result = moveWithMode(Mode.EASY);
    expect(result).toEqual(expect.any(Function));
  });
  it("mode: hard mode", () => {
    const result = moveWithMode(Mode.HARD);
    expect(result).toEqual(expect.any(Function));
  });
});

const p1: Field = Field.PLAYER1;
const p2: Field = Field.PLAYER2;
const E: Field = Field.EMPTY;
const board2: Field[] = [p1, p1, p2, p2, E, p1, E, p2, p2];
const invalidPlayer: Field = "invalid" as unknown as Field;

describe("bot winningMove test", () => {
  it("no winning move player 1", () => {
    const result: number = winningMove(board2, p1);
    expect(result).toBe(-1);
  });
  it("no valid player", () => {
    expect(() => winningMove(board2, invalidPlayer)).toThrow(
      `Player ${invalidPlayer} is not valid`
    );
  });
});
