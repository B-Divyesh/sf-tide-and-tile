export type Kind = 'straight' | 'corner';
export type Tile = { kind: Kind; solution: number; rotation: number };
export type Board = { size: number; tiles: Tile[]; seed: string; par: number };

const base: { kind: Kind; solution: number }[] = [
  {kind:'straight',solution:0},{kind:'straight',solution:0},{kind:'straight',solution:0},{kind:'corner',solution:2},
  {kind:'corner',solution:1},{kind:'straight',solution:0},{kind:'straight',solution:0},{kind:'straight',solution:1},
  {kind:'straight',solution:1},{kind:'straight',solution:0},{kind:'straight',solution:0},{kind:'corner',solution:2},
  {kind:'straight',solution:0},{kind:'straight',solution:0},{kind:'straight',solution:0},{kind:'straight',solution:1}
];
export function dailySeed(date = new Date()): string { return date.toISOString().slice(0,10); }
export function hash(seed: string) { let n=2166136261; for(const c of seed) n=Math.imul(n^c.charCodeAt(0),16777619); return n>>>0; }
export function makeBoard(seed: string, tutorial = 0): Board {
  let n=hash(seed), par=0;
  const tiles=base.map((cell,i)=>{ n=(Math.imul(n,1664525)+1013904223)>>>0; const turns=tutorial===1 ? (i%4===0?1:0) : (n%3)+1; par+=turns; return {...cell,rotation:(cell.solution+turns)%4}; });
  return {size:4,tiles,seed,par};
}
export function rotate(board: Board, index: number): Board { const tiles=board.tiles.map((t,i)=>i===index?{...t,rotation:(t.rotation+1)%4}:t); return {...board,tiles}; }
export function solved(board: Board): boolean { return board.tiles.every(t=>t.rotation===t.solution); }
export function exits(tile: Tile): number[] { if(tile.kind==='straight') return tile.rotation%2===0?[1,3]:[0,2]; return [tile.rotation,(tile.rotation+1)%4]; }
export function label(tile: Tile): string { const d=['north','east','south','west']; return `${tile.kind==='straight'?'straight':'corner'} water channel joining ${exits(tile).map(x=>d[x]).join(' and ')}`; }
