import { PathNode, Asteroid } from '../types/mission';

export class AStarPathfinder {
  private asteroids: Asteroid[];
  private gridSize: number;
  private safetyMargin: number;

  constructor(asteroids: Asteroid[], gridSize = 10, safetyMargin = 50) {
    this.asteroids = asteroids;
    this.gridSize = gridSize;
    this.safetyMargin = safetyMargin;
  }

  findPath(start: { x: number; y: number }, goal: { x: number; y: number }): PathNode[] {
    const openSet: PathNode[] = [];
    const closedSet: Set<string> = new Set();
    
    const startNode: PathNode = {
      x: start.x,
      y: start.y,
      g: 0,
      h: this.heuristic(start, goal),
      f: 0
    };
    startNode.f = startNode.g + startNode.h;
    
    openSet.push(startNode);
    
    while (openSet.length > 0) {
      // Find node with lowest f score
      let current = openSet.reduce((min, node) => node.f < min.f ? node : min);
      
      // Remove current from open set
      const currentIndex = openSet.indexOf(current);
      openSet.splice(currentIndex, 1);
      
      // Add to closed set
      closedSet.add(`${current.x},${current.y}`);
      
      // Check if we reached the goal
      if (this.distance(current, goal) < this.gridSize) {
        return this.reconstructPath(current);
      }
      
      // Check neighbors
      const neighbors = this.getNeighbors(current);
      
      for (const neighbor of neighbors) {
        const neighborKey = `${neighbor.x},${neighbor.y}`;
        
        if (closedSet.has(neighborKey) || this.isCollision(neighbor)) {
          continue;
        }
        
        const tentativeG = current.g + this.distance(current, neighbor);
        
        const existingNeighbor = openSet.find(n => n.x === neighbor.x && n.y === neighbor.y);
        
        if (!existingNeighbor) {
          neighbor.g = tentativeG;
          neighbor.h = this.heuristic(neighbor, goal);
          neighbor.f = neighbor.g + neighbor.h;
          neighbor.parent = current;
          openSet.push(neighbor);
        } else if (tentativeG < existingNeighbor.g) {
          existingNeighbor.g = tentativeG;
          existingNeighbor.f = existingNeighbor.g + existingNeighbor.h;
          existingNeighbor.parent = current;
        }
      }
    }
    
    return []; // No path found
  }

  private heuristic(a: { x: number; y: number }, b: { x: number; y: number }): number {
    return Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2));
  }

  private distance(a: { x: number; y: number }, b: { x: number; y: number }): number {
    return Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2));
  }

  private getNeighbors(node: PathNode): PathNode[] {
    const neighbors: PathNode[] = [];
    const directions = [
      { x: 0, y: this.gridSize },
      { x: this.gridSize, y: 0 },
      { x: 0, y: -this.gridSize },
      { x: -this.gridSize, y: 0 },
      { x: this.gridSize, y: this.gridSize },
      { x: -this.gridSize, y: this.gridSize },
      { x: this.gridSize, y: -this.gridSize },
      { x: -this.gridSize, y: -this.gridSize }
    ];

    for (const dir of directions) {
      neighbors.push({
        x: node.x + dir.x,
        y: node.y + dir.y,
        g: 0,
        h: 0,
        f: 0
      });
    }

    return neighbors;
  }

  private isCollision(point: { x: number; y: number }): boolean {
    return this.asteroids.some(asteroid => {
      const distance = Math.sqrt(
        Math.pow(point.x - asteroid.position.x, 2) + 
        Math.pow(point.y - asteroid.position.y, 2)
      );
      return distance < (asteroid.radius + this.safetyMargin);
    });
  }

  private reconstructPath(node: PathNode): PathNode[] {
    const path: PathNode[] = [];
    let current: PathNode | undefined = node;
    
    while (current) {
      path.unshift(current);
      current = current.parent;
    }
    
    return path;
  }
}