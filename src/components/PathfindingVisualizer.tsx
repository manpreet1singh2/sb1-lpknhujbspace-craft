import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { AStarPathfinder } from '../utils/pathfinding';
import { Asteroid, PathNode } from '../types/mission';

interface PathfindingVisualizerProps {
  width: number;
  height: number;
  isActive: boolean;
}

export const PathfindingVisualizer: React.FC<PathfindingVisualizerProps> = ({
  width,
  height,
  isActive
}) => {
  const [asteroids, setAsteroids] = useState<Asteroid[]>([]);
  const [path, setPath] = useState<PathNode[]>([]);
  const [spacecraft, setSpacecraft] = useState({ x: 50, y: 50 });
  const [target, setTarget] = useState({ x: width - 50, y: height - 50 });

  useEffect(() => {
    // Generate random asteroids
    const newAsteroids: Asteroid[] = [];
    for (let i = 0; i < 15; i++) {
      newAsteroids.push({
        id: `asteroid-${i}`,
        position: {
          x: Math.random() * (width - 100) + 50,
          y: Math.random() * (height - 100) + 50
        },
        radius: Math.random() * 20 + 10,
        mineralContent: {
          platinum: Math.random() * 100,
          gold: Math.random() * 100,
          water: Math.random() * 100,
          rareEarth: Math.random() * 100
        }
      });
    }
    setAsteroids(newAsteroids);
  }, [width, height]);

  useEffect(() => {
    if (isActive && asteroids.length > 0) {
      const pathfinder = new AStarPathfinder(asteroids, 20, 30);
      const newPath = pathfinder.findPath(spacecraft, target);
      setPath(newPath);

      // Animate spacecraft along path
      if (newPath.length > 0) {
        let currentIndex = 0;
        const interval = setInterval(() => {
          if (currentIndex < newPath.length - 1) {
            currentIndex++;
            setSpacecraft({ x: newPath[currentIndex].x, y: newPath[currentIndex].y });
          } else {
            clearInterval(interval);
          }
        }, 200);

        return () => clearInterval(interval);
      }
    }
  }, [isActive, asteroids, target]);

  return (
    <div className="relative bg-slate-900 rounded-lg overflow-hidden border border-slate-700">
      <svg width={width} height={height} className="absolute inset-0">
        {/* Background stars */}
        {Array.from({ length: 50 }).map((_, i) => (
          <circle
            key={`star-${i}`}
            cx={Math.random() * width}
            cy={Math.random() * height}
            r={Math.random() * 1.5 + 0.5}
            fill="rgba(255, 255, 255, 0.3)"
          />
        ))}

        {/* Asteroids */}
        {asteroids.map((asteroid) => (
          <g key={asteroid.id}>
            <circle
              cx={asteroid.position.x}
              cy={asteroid.position.y}
              r={asteroid.radius}
              fill="rgba(156, 163, 184, 0.6)"
              stroke="rgba(203, 213, 225, 0.8)"
              strokeWidth="1"
            />
            <circle
              cx={asteroid.position.x}
              cy={asteroid.position.y}
              r={asteroid.radius + 30}
              fill="none"
              stroke="rgba(239, 68, 68, 0.3)"
              strokeWidth="1"
              strokeDasharray="2,2"
            />
          </g>
        ))}

        {/* Path */}
        {path.length > 1 && (
          <polyline
            points={path.map(p => `${p.x},${p.y}`).join(' ')}
            fill="none"
            stroke="rgba(34, 197, 94, 0.8)"
            strokeWidth="2"
            strokeDasharray="5,5"
          />
        )}

        {/* Target */}
        <g>
          <circle
            cx={target.x}
            cy={target.y}
            r="8"
            fill="rgba(34, 197, 94, 0.8)"
            stroke="rgba(34, 197, 94, 1)"
            strokeWidth="2"
          />
          <circle
            cx={target.x}
            cy={target.y}
            r="15"
            fill="none"
            stroke="rgba(34, 197, 94, 0.5)"
            strokeWidth="1"
            strokeDasharray="3,3"
          />
        </g>

        {/* Spacecraft */}
        <motion.g
          animate={{ x: spacecraft.x, y: spacecraft.y }}
          transition={{ duration: 0.2, ease: "linear" }}
        >
          <polygon
            points="0,-8 -6,6 0,3 6,6"
            fill="rgba(59, 130, 246, 0.9)"
            stroke="rgba(59, 130, 246, 1)"
            strokeWidth="1"
          />
          <circle
            cx="0"
            cy="0"
            r="12"
            fill="none"
            stroke="rgba(59, 130, 246, 0.3)"
            strokeWidth="1"
          />
        </motion.g>
      </svg>

      <div className="absolute top-4 left-4 text-xs text-slate-400">
        <div>Pathfinding: A* Algorithm</div>
        <div>Obstacles: {asteroids.length} asteroids</div>
        <div>Path nodes: {path.length}</div>
      </div>
    </div>
  );
};