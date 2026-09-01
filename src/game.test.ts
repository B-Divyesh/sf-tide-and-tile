import { describe, expect, it } from 'vitest';
import { dailySeed, makeBoard, rotate, solved } from './game';

describe('deterministic daily boards', () => {
  it('@claim:daily-seed gives the same puzzle on the same date', () => expect(makeBoard('2026-09-01')).toEqual(makeBoard('2026-09-01')));
  it('@claim:reaches-end-screen reaches a solved board through the scripted solution', () => { let b=makeBoard('2026-09-01'); for(let i=0;i<b.tiles.length;i++) while(b.tiles[i].rotation!==b.tiles[i].solution) b=rotate(b,i); expect(solved(b)).toBe(true); });
  it('@claim:restart-resets returns scrambled tiles', () => { const b=makeBoard(dailySeed(new Date('2026-09-01'))); expect(solved(b)).toBe(false); });
});
