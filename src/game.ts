export type Kind = 'straight' | 'corner';
export type GameState = 'playing' | 'won' | 'lost';
export type Tile = { kind: Kind; solution: number; rotation: number };
export type Port = { index: number; direction: number };
export type Board = { size: number; tiles: Tile[]; seed: string; par: number; maxTurns: number; dock: Port; harbor: Port };

const vectors = [[-1, 0], [0, 1], [1, 0], [0, -1]] as const;

export function dailySeed(date = new Date()): string { return date.toISOString().slice(0, 10); }
export function hash(seed: string) { let value = 2166136261; for (const character of seed) value = Math.imul(value ^ character.charCodeAt(0), 16777619); return value >>> 0; }
function randomFor(seed: string) { let value = hash(seed) || 1; return () => { value = (Math.imul(value, 1664525) + 1013904223) >>> 0; return value / 4294967296; }; }
function neighbors(index: number, size: number) {
  const row = Math.floor(index / size), column = index % size;
  return vectors.flatMap(([dr, dc], direction) => {
    const nextRow = row + dr, nextColumn = column + dc;
    return nextRow >= 0 && nextRow < size && nextColumn >= 0 && nextColumn < size ? [{ index: nextRow * size + nextColumn, direction }] : [];
  });
}
function boundary(index: number, size: number) { const row = Math.floor(index / size), column = index % size; return row === 0 || column === 0 || row === size - 1 || column === size - 1; }
function pathFor(seed: string, size: number) {
  const total = size * size;
  for (let attempt = 0; attempt < 32; attempt++) {
    const random = randomFor(`${seed}:route:${attempt}`);
    const edge = Array.from({ length: total }, (_, index) => index).filter(index => boundary(index, size));
    const start = edge[Math.floor(random() * edge.length)], path = [start], used = new Set([start]);
    const visit = (): boolean => {
      if (path.length === total) return boundary(path[path.length - 1], size);
      const options = neighbors(path[path.length - 1], size).filter(next => !used.has(next.index))
        .map(next => ({ ...next, noise: random(), onward: neighbors(next.index, size).filter(candidate => !used.has(candidate.index)).length }))
        .sort((a, b) => a.onward - b.onward || a.noise - b.noise);
      for (const next of options) { used.add(next.index); path.push(next.index); if (visit()) return true; path.pop(); used.delete(next.index); }
      return false;
    };
    if (visit()) return path;
  }
  return Array.from({ length: total }, (_, position) => { const row = Math.floor(position / size), offset = position % size; return row * size + (row % 2 ? size - 1 - offset : offset); });
}
function directionBetween(from: number, to: number, size: number) {
  const delta = to - from;
  if (delta === -size) return 0; if (delta === 1) return 1; if (delta === size) return 2; if (delta === -1) return 3;
  throw new Error('Route contains non-neighboring tiles');
}
function outsideDirections(index: number, size: number) {
  const row = Math.floor(index / size), column = index % size, directions: number[] = [];
  if (row === 0) directions.push(0); if (column === size - 1) directions.push(1); if (row === size - 1) directions.push(2); if (column === 0) directions.push(3);
  return directions;
}
function tileFor(directions: number[]): Omit<Tile, 'rotation'> {
  const ordered = [...directions].sort((a, b) => a - b);
  if ((ordered[0] + 2) % 4 === ordered[1]) return { kind: 'straight', solution: ordered.includes(0) ? 1 : 0 };
  for (let rotation = 0; rotation < 4; rotation++) {
    const candidate = [rotation, (rotation + 1) % 4].sort((a, b) => a - b);
    if (candidate[0] === ordered[0] && candidate[1] === ordered[1]) return { kind: 'corner', solution: rotation };
  }
  throw new Error('A tile must join two distinct directions');
}
function period(tile: Pick<Tile, 'kind'>) { return tile.kind === 'straight' ? 2 : 4; }

export function makeBoard(seed: string, guided = false, size = 4): Board {
  const path = pathFor(seed, size), random = randomFor(`${seed}:scramble`), routeDirections = new Map<number, number[]>();
  path.forEach((index, position) => {
    const directions: number[] = [];
    if (position > 0) directions.push(directionBetween(index, path[position - 1], size));
    if (position < path.length - 1) directions.push(directionBetween(index, path[position + 1], size));
    routeDirections.set(index, directions);
  });
  const startInternal = routeDirections.get(path[0])![0], endInternal = routeDirections.get(path[path.length - 1])![0];
  const startOutside = outsideDirections(path[0], size).find(direction => direction !== startInternal)!;
  const endOutside = outsideDirections(path[path.length - 1], size).find(direction => direction !== endInternal)!;
  routeDirections.get(path[0])!.push(startOutside); routeDirections.get(path[path.length - 1])!.push(endOutside);
  const solvedTiles = Array.from({ length: size * size }, (_, index) => tileFor(routeDirections.get(index)!));
  const guidedIndexes = new Set(path.slice(0, 4)); let par = 0;
  const tiles = solvedTiles.map((tile, index) => {
    const turnsNeeded = guided ? (guidedIndexes.has(index) ? 1 : 0) : Math.floor(random() * period(tile));
    par += turnsNeeded;
    return { ...tile, rotation: (tile.solution - turnsNeeded + period(tile)) % period(tile) };
  });
  if (par === 0) { const tile = tiles[path[0]]; tile.rotation = (tile.solution - 1 + period(tile)) % period(tile); par = 1; }
  return { size, tiles, seed, par, maxTurns: Math.max(par + 8, 12), dock: { index: path[0], direction: startOutside }, harbor: { index: path[path.length - 1], direction: endOutside } };
}
export function rotate(board: Board, index: number): Board { return { ...board, tiles: board.tiles.map((tile, tileIndex) => tileIndex === index ? { ...tile, rotation: (tile.rotation + 1) % period(tile) } : tile) }; }
export function exits(tile: Tile): number[] { return tile.kind === 'straight' ? (tile.rotation % 2 === 0 ? [1, 3] : [0, 2]) : [tile.rotation, (tile.rotation + 1) % 4]; }
export function routeIsContinuous(board: Board): boolean {
  const { size, tiles } = board, exterior: Port[] = [], edges = new Map<number, number[]>();
  tiles.forEach((tile, index) => {
    edges.set(index, []); const row = Math.floor(index / size), column = index % size;
    for (const direction of exits(tile)) {
      const [dr, dc] = vectors[direction], nextRow = row + dr, nextColumn = column + dc;
      if (nextRow < 0 || nextRow >= size || nextColumn < 0 || nextColumn >= size) { exterior.push({ index, direction }); continue; }
      const next = nextRow * size + nextColumn;
      if (!exits(tiles[next]).includes((direction + 2) % 4)) return false;
      edges.get(index)!.push(next);
    }
  });
  const hasPort = (port: Port) => exterior.some(candidate => candidate.index === port.index && candidate.direction === port.direction);
  if (exterior.length !== 2 || !hasPort(board.dock) || !hasPort(board.harbor)) return false;
  const visited = new Set<number>(), stack = [board.dock.index];
  while (stack.length) { const index = stack.pop()!; if (visited.has(index)) continue; visited.add(index); stack.push(...edges.get(index)!.filter(next => !visited.has(next))); }
  return visited.size === tiles.length && visited.has(board.harbor.index);
}
export function solved(board: Board): boolean { return board.tiles.every(tile => tile.rotation === tile.solution) && routeIsContinuous(board); }
export function label(tile: Tile): string { const directions = ['north', 'east', 'south', 'west']; return `${tile.kind} water channel joining ${exits(tile).map(direction => directions[direction]).join(' and ')}`; }
export function layoutSignature(board: Board) { return board.tiles.map(tile => `${tile.kind[0]}${tile.solution}`).join(''); }
