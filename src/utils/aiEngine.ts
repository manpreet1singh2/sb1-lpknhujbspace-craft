import { SpacecraftTelemetry, AIRecommendation, MissionPlan } from '../types/mission';

export class AIEngine {
  private telemetryHistory: SpacecraftTelemetry[] = [];

  analyzeTelemetry(telemetry: SpacecraftTelemetry): AIRecommendation[] {
    const recommendations: AIRecommendation[] = [];
    
    // Fuel analysis
    if (telemetry.fuel < 20) {
      recommendations.push({
        type: 'fuel',
        priority: 'critical',
        message: `Critical fuel level: ${telemetry.fuel}%. Immediate refueling or mission abort required.`,
        action: 'ABORT_MISSION',
        timestamp: new Date()
      });
    } else if (telemetry.fuel < 40) {
      recommendations.push({
        type: 'fuel',
        priority: 'high',
        message: `Low fuel warning: ${telemetry.fuel}%. Consider fuel-efficient maneuvers.`,
        action: 'OPTIMIZE_TRAJECTORY',
        timestamp: new Date()
      });
    }

    // System health analysis
    if (telemetry.systemHealth < 60) {
      recommendations.push({
        type: 'maintenance',
        priority: 'high',
        message: `System health degraded: ${telemetry.systemHealth}%. Diagnostic check recommended.`,
        action: 'RUN_DIAGNOSTICS',
        timestamp: new Date()
      });
    }

    // Temperature analysis
    if (telemetry.temperature > 80 || telemetry.temperature < -50) {
      recommendations.push({
        type: 'maintenance',
        priority: 'medium',
        message: `Temperature anomaly detected: ${telemetry.temperature}°C. Monitor thermal systems.`,
        action: 'THERMAL_REGULATION',
        timestamp: new Date()
      });
    }

    // Radiation analysis
    if (telemetry.radiation > 1000) {
      recommendations.push({
        type: 'navigation',
        priority: 'high',
        message: `High radiation detected: ${telemetry.radiation} mSv/h. Consider course correction.`,
        action: 'AVOID_RADIATION',
        timestamp: new Date()
      });
    }

    return recommendations;
  }

  predictFuelUsage(telemetry: SpacecraftTelemetry, missionDuration: number): number {
    // Simple fuel consumption model based on velocity and system efficiency
    const baseConsumption = 0.1; // Base fuel consumption per hour
    const velocityFactor = Math.sqrt(
      telemetry.velocity.x ** 2 + 
      telemetry.velocity.y ** 2 + 
      telemetry.velocity.z ** 2
    ) / 1000; // Normalize velocity
    
    const efficiencyFactor = telemetry.systemHealth / 100;
    
    return (baseConsumption + velocityFactor) * missionDuration * (2 - efficiencyFactor);
  }

  generateMissionPlan(
    startPos: { x: number; y: number; z: number },
    targetPos: { x: number; y: number; z: number },
    currentTelemetry: SpacecraftTelemetry
  ): MissionPlan {
    const distance = Math.sqrt(
      (targetPos.x - startPos.x) ** 2 +
      (targetPos.y - startPos.y) ** 2 +
      (targetPos.z - startPos.z) ** 2
    );

    const estimatedDuration = distance / 10000; // Simplified duration calculation
    const fuelRequirement = this.predictFuelUsage(currentTelemetry, estimatedDuration);
    
    let riskLevel: 'low' | 'medium' | 'high' = 'low';
    if (fuelRequirement > currentTelemetry.fuel * 0.8) riskLevel = 'high';
    else if (fuelRequirement > currentTelemetry.fuel * 0.6) riskLevel = 'medium';

    return {
      id: `mission-${Date.now()}`,
      name: `Navigation to Target ${targetPos.x.toFixed(0)}, ${targetPos.y.toFixed(0)}`,
      launchWindow: {
        start: new Date(),
        end: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        optimal: new Date(Date.now() + 2 * 60 * 60 * 1000) // 2 hours
      },
      trajectory: [
        { x: startPos.x, y: startPos.y, g: 0, h: 0, f: 0 },
        { x: targetPos.x, y: targetPos.y, g: distance, h: 0, f: distance }
      ],
      fuelRequirement,
      duration: estimatedDuration,
      riskLevel,
      objectives: [
        'Navigate to target coordinates',
        'Maintain system integrity',
        'Optimize fuel consumption'
      ]
    };
  }

  detectAnomalies(telemetry: SpacecraftTelemetry): string[] {
    const anomalies: string[] = [];
    
    // Add to history
    this.telemetryHistory.push(telemetry);
    if (this.telemetryHistory.length > 100) {
      this.telemetryHistory.shift();
    }

    if (this.telemetryHistory.length > 5) {
      const recent = this.telemetryHistory.slice(-5);
      
      // Check for rapid fuel depletion
      const fuelTrend = recent.map(t => t.fuel);
      const fuelDecrease = fuelTrend[0] - fuelTrend[fuelTrend.length - 1];
      if (fuelDecrease > 10) {
        anomalies.push('Rapid fuel depletion detected');
      }

      // Check for temperature spikes
      const tempTrend = recent.map(t => t.temperature);
      const tempVariance = Math.max(...tempTrend) - Math.min(...tempTrend);
      if (tempVariance > 30) {
        anomalies.push('Temperature instability detected');
      }

      // Check for system health degradation
      const healthTrend = recent.map(t => t.systemHealth);
      const healthDecrease = healthTrend[0] - healthTrend[healthTrend.length - 1];
      if (healthDecrease > 15) {
        anomalies.push('System health degradation detected');
      }
    }

    return anomalies;
  }
}