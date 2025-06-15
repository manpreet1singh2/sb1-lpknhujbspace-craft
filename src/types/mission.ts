export interface SpacecraftTelemetry {
  id: string;
  name: string;
  position: {
    x: number;
    y: number;
    z: number;
  };
  velocity: {
    x: number;
    y: number;
    z: number;
  };
  fuel: number;
  temperature: number;
  radiation: number;
  batteryLevel: number;
  systemHealth: number;
  status: 'active' | 'idle' | 'critical' | 'maintenance';
  lastUpdate: Date;
}

export interface AsteroidField {
  id: string;
  asteroids: Asteroid[];
  bounds: {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
  };
}

export interface Asteroid {
  id: string;
  position: { x: number; y: number };
  radius: number;
  mineralContent: {
    platinum: number;
    gold: number;
    water: number;
    rareEarth: number;
  };
}

export interface PathNode {
  x: number;
  y: number;
  g: number; // Cost from start
  h: number; // Heuristic cost to goal
  f: number; // Total cost
  parent?: PathNode;
}

export interface MissionPlan {
  id: string;
  name: string;
  launchWindow: {
    start: Date;
    end: Date;
    optimal: Date;
  };
  trajectory: PathNode[];
  fuelRequirement: number;
  duration: number;
  riskLevel: 'low' | 'medium' | 'high';
  objectives: string[];
}

export interface AIRecommendation {
  type: 'navigation' | 'fuel' | 'maintenance' | 'mission';
  priority: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  action?: string;
  timestamp: Date;
}