import { describe, expect, it } from 'vitest';
import { layoutSignature, makeBoard, rotate, routeIsContinuous, solved, type Board, type Tile } from './game';

describe('continuous deterministic routes', () => {
  it('creates the same connected route for the same seed', () => {
    expect(makeBoard('2026-09-01')).toEqual(makeBoard('2026-09-01'));
    const board = makeBoard('2026-09-01'); board.tiles = board.tiles.map(tile => ({ ...tile, rotation: tile.solution }));
    expect(routeIsContinuous(board)).toBe(true);
  });
  it('rejects the disconnected candidate layout even when every rotation equals its authored solution', () => {
    const definitions: Array<[Tile['kind'], number]> = [['straight',0],['straight',0],['straight',0],['corner',2],['corner',1],['straight',0],['straight',0],['straight',1],['straight',1],['straight',0],['straight',0],['corner',2],['straight',0],['straight',0],['straight',0],['straight',1]];
    const tiles = definitions.map(([kind, solution]) => ({ kind, solution, rotation: solution }));
    const candidate = { size: 4, tiles, seed: 'candidate', par: 4, maxTurns: 12, dock: { index: 0, direction: 3 }, harbor: { index: 12, direction: 3 } } satisfies Board;
    expect(routeIsContinuous(candidate)).toBe(false); expect(solved(candidate)).toBe(false);
  });
  it('sets the sample fewest score to the four presses that solve it', () => {
    let board = makeBoard('sample-harbor', true); expect(board.par).toBe(4); let presses = 0;
    for (let index = 0; index < board.tiles.length; index++) while (board.tiles[index].rotation !== board.tiles[index].solution) { board = rotate(board, index); presses++; }
    expect(presses).toBe(4); expect(solved(board)).toBe(true);
  });
  it('@claim:procedural-routes generates substantial route variety from daily seeds', () => {
    const layouts = new Set(Array.from({ length: 20 }, (_, day) => layoutSignature(makeBoard(`2026-09-${String(day + 1).padStart(2, '0')}`))));
    expect(layouts.size).toBeGreaterThanOrEqual(12);
  });
});
