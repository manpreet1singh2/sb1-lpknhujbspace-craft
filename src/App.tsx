import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Rocket, 
  Brain, 
  Camera, 
  Cpu, 
  Satellite, 
  Zap, 
  Target, 
  Shield, 
  Database, 
  ArrowRight,
  Play,
  Pause,
  BarChart3,
  MapPin,
  Battery,
  Thermometer,
  AlertTriangle,
  CheckCircle,
  Activity,
  Navigation,
  Fuel,
  Gauge
} from 'lucide-react';

import { TelemetryChart } from './components/TelemetryChart';
import { PathfindingVisualizer } from './components/PathfindingVisualizer';
import { AIAssistant } from './components/AIAssistant';
import { TelemetrySimulator } from './utils/telemetrySimulator';
import { AIEngine } from './utils/aiEngine';
import { SpacecraftTelemetry, AIRecommendation } from './types/mission';

function App() {
  const [missionStatus, setMissionStatus] = useState<'idle' | 'active' | 'mining' | 'transmitting'>('idle');
  const [telemetry, setTelemetry] = useState<SpacecraftTelemetry | null>(null);
  const [telemetryHistory, setTelemetryHistory] = useState<Array<{
    timestamp: string;
    fuel: number;
    temperature: number;
    systemHealth: number;
    batteryLevel: number;
  }>>([]);
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [simulator] = useState(() => new TelemetrySimulator());
  const [aiEngine] = useState(() => new AIEngine());

  useEffect(() => {
    const handleTelemetryUpdate = (data: SpacecraftTelemetry) => {
      setTelemetry(data);
      
      // Update history for charts
      setTelemetryHistory(prev => {
        const newEntry = {
          timestamp: new Date().toLocaleTimeString(),
          fuel: data.fuel,
          temperature: data.temperature,
          systemHealth: data.systemHealth,
          batteryLevel: data.batteryLevel
        };
        const updated = [...prev, newEntry];
        return updated.slice(-20); // Keep last 20 entries
      });

      // Generate AI recommendations
      const newRecommendations = aiEngine.analyzeTelemetry(data);
      setRecommendations(newRecommendations);
    };

    simulator.start(handleTelemetryUpdate, 2000);

    return () => {
      simulator.stop();
    };
  }, [simulator, aiEngine]);

  const toggleMission = () => {
    const newStatus = missionStatus === 'idle' ? 'active' : 'idle';
    setMissionStatus(newStatus);
    simulator.setMissionActive(newStatus === 'active');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400';
      case 'critical': return 'text-red-400';
      case 'maintenance': return 'text-yellow-400';
      default: return 'text-slate-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4" />;
      case 'critical': return <AlertTriangle className="w-4 h-4" />;
      case 'maintenance': return <Activity className="w-4 h-4" />;
      default: return <Pause className="w-4 h-4" />;
    }
  };

  const features = [
    {
      icon: <Target className="w-8 h-8" />,
      title: "Autonomous Navigation AI",
      description: "Advanced reinforcement learning models enable rovers to navigate unknown terrain, avoid obstacles, and adapt to changing conditions on Mars and asteroid surfaces.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <Camera className="w-8 h-8" />,
      title: "Computer Vision Mineral Scanner",
      description: "Deep learning algorithms analyze surface visuals and spectral data to identify valuable resources like platinum, gold, and water ice with 94% accuracy.",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: "AI Planning Module",
      description: "Intelligent decision-making system optimizes mission operations, energy management, and task scheduling for maximum efficiency in space environments.",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Emergency Fault Detection",
      description: "Real-time anomaly detection monitors system health, identifying potential failures before they occur and implementing automatic corrective measures.",
      color: "from-orange-500 to-red-500"
    }
  ];

  const technologies = [
    { name: "Python", category: "Programming", icon: <Cpu className="w-6 h-6" /> },
    { name: "Reinforcement Learning", category: "AI/ML", icon: <Brain className="w-6 h-6" /> },
    { name: "Computer Vision", category: "AI/ML", icon: <Camera className="w-6 h-6" /> },
    { name: "ROS", category: "Robotics", icon: <Satellite className="w-6 h-6" /> },
    { name: "TensorFlow", category: "Deep Learning", icon: <Zap className="w-6 h-6" /> },
    { name: "OpenCV", category: "Vision", icon: <Target className="w-6 h-6" /> }
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900"></div>
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(156, 146, 172, 0.15) 1px, transparent 0)`,
            backgroundSize: '20px 20px'
          }}></div>
        </div>
        
        <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-6">
              <Rocket className="w-10 h-10 text-white" />
            </div>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent"
          >
            AstroMind
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-2xl mb-4 text-slate-300 font-light"
          >
            AI-Powered Autonomous Space Exploration
          </motion.p>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-xl mb-8 text-slate-400 max-w-2xl mx-auto leading-relaxed"
          >
            Revolutionary artificial intelligence system for asteroid mining and robotic Mars missions, 
            enabling autonomous navigation, resource detection, and intelligent decision-making in deep space.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
              Explore Mission Dashboard
            </button>
            <button className="px-8 py-4 border-2 border-slate-400 hover:border-white rounded-lg font-semibold transition-all duration-300 hover:bg-white hover:text-slate-900">
              View Technical Specs
            </button>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce"
        >
          <ArrowRight className="w-6 h-6 rotate-90 text-slate-400" />
        </motion.div>
      </section>

      {/* Advanced Mission Control Dashboard */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Advanced Mission Control
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Real-time AI-powered telemetry, pathfinding algorithms, and intelligent mission planning
            </p>
          </motion.div>

          {/* Main Control Panel */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
            {/* Spacecraft Status */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="bg-slate-800 rounded-2xl p-6 shadow-2xl border border-slate-700"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-blue-400">Spacecraft Status</h3>
                {telemetry && (
                  <div className={`flex items-center gap-2 ${getStatusColor(telemetry.status)}`}>
                    {getStatusIcon(telemetry.status)}
                    <span className="font-semibold capitalize">{telemetry.status}</span>
                  </div>
                )}
              </div>

              <button 
                onClick={toggleMission}
                className={`w-full flex items-center justify-center gap-3 px-6 py-4 rounded-lg font-semibold transition-all duration-300 mb-6 ${
                  missionStatus === 'active' 
                    ? 'bg-red-600 hover:bg-red-700' 
                    : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {missionStatus === 'active' ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                {missionStatus === 'active' ? 'Pause Mission' : 'Start Mission'}
              </button>

              {telemetry && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-700 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Fuel className="w-5 h-5 text-yellow-400" />
                      <span>Fuel Level</span>
                    </div>
                    <div className="text-right">
                      <span className={`font-semibold ${telemetry.fuel > 50 ? 'text-green-400' : telemetry.fuel > 20 ? 'text-yellow-400' : 'text-red-400'}`}>
                        {telemetry.fuel.toFixed(1)}%
                      </span>
                      <div className="w-20 h-2 bg-slate-600 rounded-full mt-1">
                        <div 
                          className={`h-full rounded-full transition-all duration-300 ${
                            telemetry.fuel > 50 ? 'bg-green-400' : telemetry.fuel > 20 ? 'bg-yellow-400' : 'bg-red-400'
                          }`}
                          style={{ width: `${Math.max(0, telemetry.fuel)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-700 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Battery className="w-5 h-5 text-blue-400" />
                      <span>Battery Level</span>
                    </div>
                    <span className={`font-semibold ${telemetry.batteryLevel > 50 ? 'text-green-400' : 'text-yellow-400'}`}>
                      {telemetry.batteryLevel.toFixed(1)}%
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-700 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Thermometer className="w-5 h-5 text-orange-400" />
                      <span>Temperature</span>
                    </div>
                    <span className="text-blue-400 font-semibold">{telemetry.temperature.toFixed(1)}°C</span>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-700 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Gauge className="w-5 h-5 text-purple-400" />
                      <span>System Health</span>
                    </div>
                    <span className={`font-semibold ${telemetry.systemHealth > 80 ? 'text-green-400' : telemetry.systemHealth > 60 ? 'text-yellow-400' : 'text-red-400'}`}>
                      {telemetry.systemHealth.toFixed(1)}%
                    </span>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Telemetry Charts */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-slate-800 rounded-2xl p-6 shadow-2xl border border-slate-700"
            >
              <h3 className="text-xl font-semibold text-purple-400 mb-6">Live Telemetry</h3>
              
              {telemetryHistory.length > 0 && (
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-medium text-slate-300 mb-2">Fuel Level</h4>
                    <TelemetryChart
                      data={telemetryHistory}
                      metric="fuel"
                      title="Fuel"
                      color="#22d3ee"
                      unit="%"
                    />
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-slate-300 mb-2">System Health</h4>
                    <TelemetryChart
                      data={telemetryHistory}
                      metric="systemHealth"
                      title="Health"
                      color="#10b981"
                      unit="%"
                    />
                  </div>
                </div>
              )}
            </motion.div>

            {/* AI Recommendations */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="bg-slate-800 rounded-2xl p-6 shadow-2xl border border-slate-700"
            >
              <h3 className="text-xl font-semibold text-green-400 mb-6">AI Recommendations</h3>
              
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {recommendations.length === 0 ? (
                  <div className="text-center py-8 text-slate-400">
                    <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-400" />
                    <p>All systems nominal</p>
                    <p className="text-sm">No recommendations at this time</p>
                  </div>
                ) : (
                  recommendations.map((rec, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`p-3 rounded-lg border-l-4 ${
                        rec.priority === 'critical' ? 'bg-red-900/20 border-red-500' :
                        rec.priority === 'high' ? 'bg-orange-900/20 border-orange-500' :
                        rec.priority === 'medium' ? 'bg-yellow-900/20 border-yellow-500' :
                        'bg-blue-900/20 border-blue-500'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <AlertTriangle className={`w-4 h-4 mt-0.5 ${
                          rec.priority === 'critical' ? 'text-red-400' :
                          rec.priority === 'high' ? 'text-orange-400' :
                          rec.priority === 'medium' ? 'text-yellow-400' :
                          'text-blue-400'
                        }`} />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-white">{rec.type.toUpperCase()}</p>
                          <p className="text-xs text-slate-300 mt-1">{rec.message}</p>
                          {rec.action && (
                            <p className="text-xs text-slate-400 mt-1">Action: {rec.action}</p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          </div>

          {/* Pathfinding Visualizer */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="bg-slate-800 rounded-2xl p-6 shadow-2xl border border-slate-700"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-cyan-400">AI Pathfinding Through Asteroid Field</h3>
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <Navigation className="w-4 h-4" />
                <span>A* Algorithm Active</span>
              </div>
            </div>
            
            <PathfindingVisualizer 
              width={800} 
              height={400} 
              isActive={missionStatus === 'active'} 
            />
          </motion.div>
        </div>
      </section>

      {/* Core Features */}
      <section className="py-20 px-6 bg-slate-800">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-6">Core AI Capabilities</h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Advanced artificial intelligence systems designed for the harsh realities of space exploration
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="group bg-slate-900 rounded-2xl p-8 hover:bg-slate-850 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-2xl border border-slate-700 hover:border-slate-600"
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-r ${feature.color} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                
                <h3 className="text-2xl font-semibold mb-4 text-white group-hover:text-blue-300 transition-colors">
                  {feature.title}
                </h3>
                
                <p className="text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-6">Technology Stack</h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Cutting-edge technologies powering the future of autonomous space exploration
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {technologies.map((tech, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="bg-slate-800 rounded-xl p-6 text-center hover:bg-slate-700 transition-all duration-300 hover:transform hover:scale-105 border border-slate-700 hover:border-blue-500"
              >
                <div className="text-blue-400 mb-3 flex justify-center">
                  {tech.icon}
                </div>
                <h4 className="font-semibold text-white mb-1">{tech.name}</h4>
                <p className="text-xs text-slate-400">{tech.category}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Real-World Impact */}
      <section className="py-20 px-6 bg-gradient-to-r from-blue-900 via-purple-900 to-slate-900">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-6">Real-World Impact</h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Revolutionary applications that will transform space exploration and resource acquisition
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Rocket className="w-8 h-8" />,
                title: "Space Agencies",
                description: "Accelerate missions for NASA, ISRO, SpaceX with autonomous exploration capabilities",
                color: "bg-blue-500"
              },
              {
                icon: <Database className="w-8 h-8" />,
                title: "Resource Mining",
                description: "Enable low-cost asteroid mining for rare earth elements worth trillions of dollars",
                color: "bg-purple-500"
              },
              {
                icon: <BarChart3 className="w-8 h-8" />,
                title: "Mars Colonization",
                description: "Support human settlement with autonomous robots for construction and maintenance",
                color: "bg-green-500"
              }
            ].map((item, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className="text-center p-8 bg-slate-800/50 rounded-2xl backdrop-blur-sm border border-slate-700 hover:bg-slate-800/70 transition-all duration-300"
              >
                <div className={`w-16 h-16 ${item.color} rounded-full flex items-center justify-center mx-auto mb-6`}>
                  {item.icon}
                </div>
                <h3 className="text-xl font-semibold mb-4">{item.title}</h3>
                <p className="text-slate-300">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-6 bg-slate-900">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold mb-6">Ready to Explore the Future?</h2>
            <p className="text-xl text-slate-400 mb-8 max-w-2xl mx-auto">
              Join us in revolutionizing space exploration with artificial intelligence. 
              Contact us to learn more about partnerships, investments, or technical collaboration.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg">
                Request Demo
              </button>
              <button className="px-8 py-4 bg-slate-800 hover:bg-slate-700 rounded-lg font-semibold transition-all duration-300 border border-slate-600 hover:border-slate-500">
                View Documentation
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-slate-950 border-t border-slate-800">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <Rocket className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold">AstroMind</span>
            </div>
            
            <div className="text-slate-400 text-center md:text-right">
              <p>&copy; 2025 AstroMind AI. Pioneering the future of space exploration.</p>
              <p className="text-sm mt-1">Built for the next generation of space missions.</p>
            </div>
          </div>
        </div>
      </footer>

      {/* AI Assistant */}
      {telemetry && <AIAssistant telemetry={telemetry} />}
    </div>
  );
}

export default App;