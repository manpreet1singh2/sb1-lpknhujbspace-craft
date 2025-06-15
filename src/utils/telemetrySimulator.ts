import { SpacecraftTelemetry } from '../types/mission';

export class TelemetrySimulator {
  private baseData: SpacecraftTelemetry;
  private isRunning: boolean = false;
  private intervalId?: NodeJS.Timeout;

  constructor() {
    this.baseData = {
      id: 'astromind-1',
      name: 'AstroMind Explorer',
      position: { x: 0, y: 0, z: 0 },
      velocity: { x: 0, y: 0, z: 0 },
      fuel: 85,
      temperature: 23,
      radiation: 150,
      batteryLevel: 87,
      systemHealth: 94,
      status: 'active',
      lastUpdate: new Date()
    };
  }

  start(callback: (data: SpacecraftTelemetry) => void, interval: number = 2000): void {
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.intervalId = setInterval(() => {
      this.updateTelemetry();
      callback({ ...this.baseData });
    }, interval);
  }

  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
    this.isRunning = false;
  }

  private updateTelemetry(): void {
    // Simulate position changes (orbital mechanics simplified)
    this.baseData.position.x += this.baseData.velocity.x * 0.1 + (Math.random() - 0.5) * 100;
    this.baseData.position.y += this.baseData.velocity.y * 0.1 + (Math.random() - 0.5) * 100;
    this.baseData.position.z += this.baseData.velocity.z * 0.1 + (Math.random() - 0.5) * 50;

    // Simulate velocity changes
    this.baseData.velocity.x += (Math.random() - 0.5) * 10;
    this.baseData.velocity.y += (Math.random() - 0.5) * 10;
    this.baseData.velocity.z += (Math.random() - 0.5) * 5;

    // Clamp velocities
    this.baseData.velocity.x = Math.max(-1000, Math.min(1000, this.baseData.velocity.x));
    this.baseData.velocity.y = Math.max(-1000, Math.min(1000, this.baseData.velocity.y));
    this.baseData.velocity.z = Math.max(-500, Math.min(500, this.baseData.velocity.z));

    // Simulate fuel consumption
    const velocityMagnitude = Math.sqrt(
      this.baseData.velocity.x ** 2 + 
      this.baseData.velocity.y ** 2 + 
      this.baseData.velocity.z ** 2
    );
    this.baseData.fuel = Math.max(0, this.baseData.fuel - (velocityMagnitude / 10000) - 0.1);

    // Simulate temperature variations
    this.baseData.temperature += (Math.random() - 0.5) * 5;
    this.baseData.temperature = Math.max(-60, Math.min(100, this.baseData.temperature));

    // Simulate radiation exposure
    this.baseData.radiation += (Math.random() - 0.5) * 50;
    this.baseData.radiation = Math.max(0, Math.min(2000, this.baseData.radiation));

    // Simulate battery drain and charging
    const solarEfficiency = Math.random() > 0.3 ? 1.2 : 0.8; // Solar panel efficiency
    this.baseData.batteryLevel += (Math.random() - 0.5) * 2 * solarEfficiency;
    this.baseData.batteryLevel = Math.max(0, Math.min(100, this.baseData.batteryLevel));

    // Simulate system health
    if (this.baseData.fuel < 20 || this.baseData.batteryLevel < 20) {
      this.baseData.systemHealth = Math.max(30, this.baseData.systemHealth - 1);
    } else {
      this.baseData.systemHealth = Math.min(100, this.baseData.systemHealth + 0.1);
    }

    // Update status based on conditions
    if (this.baseData.fuel < 10 || this.baseData.systemHealth < 40) {
      this.baseData.status = 'critical';
    } else if (this.baseData.fuel < 30 || this.baseData.systemHealth < 70) {
      this.baseData.status = 'maintenance';
    } else {
      this.baseData.status = 'active';
    }

    this.baseData.lastUpdate = new Date();
  }

  getCurrentData(): SpacecraftTelemetry {
    return { ...this.baseData };
  }

  setMissionActive(active: boolean): void {
    if (active) {
      this.baseData.velocity.x = 500 + Math.random() * 200;
      this.baseData.velocity.y = 300 + Math.random() * 200;
      this.baseData.velocity.z = 100 + Math.random() * 100;
    } else {
      this.baseData.velocity.x *= 0.1;
      this.baseData.velocity.y *= 0.1;
      this.baseData.velocity.z *= 0.1;
    }
  }
}