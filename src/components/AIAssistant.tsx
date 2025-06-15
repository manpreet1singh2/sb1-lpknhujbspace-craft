import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Send, Bot, User, X } from 'lucide-react';
import { SpacecraftTelemetry } from '../types/mission';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

interface AIAssistantProps {
  telemetry: SpacecraftTelemetry;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({ telemetry }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: 'Hello! I\'m AstroMind AI, your intelligent mission advisor. I can help you with navigation, system diagnostics, mission planning, and space exploration queries. How can I assist you today?',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateAIResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    // Mission status queries
    if (message.includes('status') || message.includes('health')) {
      return `Current mission status: ${telemetry.status.toUpperCase()}
      
System Health: ${telemetry.systemHealth}%
Fuel Level: ${telemetry.fuel}%
Battery: ${telemetry.batteryLevel}%
Temperature: ${telemetry.temperature}°C

${telemetry.systemHealth < 70 ? 'Recommendation: System diagnostics advised due to degraded health metrics.' : 'All systems operating within normal parameters.'}`;
    }

    // Navigation queries
    if (message.includes('navigation') || message.includes('position') || message.includes('location')) {
      return `Current Position:
X: ${telemetry.position.x.toFixed(2)} km
Y: ${telemetry.position.y.toFixed(2)} km  
Z: ${telemetry.position.z.toFixed(2)} km

Velocity Vector:
X: ${telemetry.velocity.x.toFixed(2)} km/h
Y: ${telemetry.velocity.y.toFixed(2)} km/h
Z: ${telemetry.velocity.z.toFixed(2)} km/h

Navigation systems are active and tracking nominal trajectory.`;
    }

    // Fuel queries
    if (message.includes('fuel') || message.includes('energy')) {
      const fuelStatus = telemetry.fuel > 50 ? 'adequate' : telemetry.fuel > 20 ? 'low' : 'critical';
      return `Fuel Analysis:
Current Level: ${telemetry.fuel}% (${fuelStatus})
Estimated Range: ${(telemetry.fuel * 100).toFixed(0)} km

${telemetry.fuel < 30 ? 'Warning: Consider fuel conservation measures or refueling options.' : 'Fuel levels are sufficient for continued operations.'}`;
    }

    // Mars mission queries
    if (message.includes('mars') || message.includes('launch window')) {
      return `Mars Mission Planning:

Optimal Launch Windows:
- Next window: 2026 (26 months from Earth)
- Journey duration: 6-9 months
- Fuel requirement: ~15,000 kg for Mars transfer

Current Earth-Mars distance: ~225 million km
Recommended trajectory: Hohmann transfer orbit

Would you like me to calculate specific launch parameters based on current spacecraft capabilities?`;
    }

    // Asteroid mining queries
    if (message.includes('asteroid') || message.includes('mining')) {
      return `Asteroid Mining Operations:

Target Selection Criteria:
- Near-Earth asteroids (NEAs) preferred
- Metallic composition (M-type asteroids)
- Accessible orbit (ΔV < 6 km/s)

Valuable Resources:
- Platinum: $30,000/oz
- Gold: $2,000/oz  
- Rare earth elements: $50-500/kg
- Water ice: Critical for fuel production

Current mission capability: Survey and sample collection. Full mining operations require specialized equipment deployment.`;
    }

    // System diagnostics
    if (message.includes('diagnostic') || message.includes('problem') || message.includes('error')) {
      const issues = [];
      if (telemetry.fuel < 30) issues.push('Low fuel levels detected');
      if (telemetry.systemHealth < 80) issues.push('System health degradation');
      if (telemetry.temperature > 60 || telemetry.temperature < -30) issues.push('Temperature anomaly');
      if (telemetry.batteryLevel < 30) issues.push('Battery charge low');

      return `System Diagnostics Report:

${issues.length === 0 ? 'No critical issues detected.' : 'Issues Identified:'}
${issues.map(issue => `• ${issue}`).join('\n')}

Recommended Actions:
${telemetry.fuel < 30 ? '• Implement fuel conservation protocols\n' : ''}
${telemetry.systemHealth < 80 ? '• Schedule maintenance cycle\n' : ''}
${telemetry.batteryLevel < 30 ? '• Optimize power consumption\n' : ''}

All systems continue to operate within acceptable parameters.`;
    }

    // General space exploration
    if (message.includes('space') || message.includes('exploration') || message.includes('mission')) {
      return `Space Exploration Insights:

Current Mission Capabilities:
✓ Autonomous navigation and obstacle avoidance
✓ Real-time telemetry and health monitoring  
✓ Advanced pathfinding through asteroid fields
✓ Mineral detection and analysis
✓ Emergency fault detection and response

Future Mission Possibilities:
• Deep space exploration beyond Mars
• Asteroid belt resource mapping
• Jupiter moon reconnaissance
• Interstellar probe missions

The future of space exploration lies in AI-driven autonomous systems that can make intelligent decisions in the vast emptiness of space.`;
    }

    // Default response
    return `I understand you're asking about "${userMessage}". As your AI mission advisor, I can help with:

• Mission status and system diagnostics
• Navigation and trajectory planning  
• Fuel optimization and resource management
• Mars mission planning and launch windows
• Asteroid mining operations and target selection
• Space exploration strategies and technologies

Please feel free to ask specific questions about any of these topics, and I'll provide detailed analysis based on current telemetry data and space mission expertise.`;
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: generateAIResponse(inputValue),
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 z-40"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <MessageCircle className="w-6 h-6 text-white" />
      </motion.button>

      {/* Chat Interface */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            className="fixed bottom-6 right-6 w-96 h-[500px] bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 flex flex-col z-50"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-700">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">AstroMind AI</h3>
                  <p className="text-xs text-slate-400">Mission Advisor</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start gap-2 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.type === 'user' 
                        ? 'bg-blue-600' 
                        : 'bg-gradient-to-r from-purple-500 to-pink-500'
                    }`}>
                      {message.type === 'user' ? (
                        <User className="w-3 h-3 text-white" />
                      ) : (
                        <Bot className="w-3 h-3 text-white" />
                      )}
                    </div>
                    <div className={`rounded-2xl px-3 py-2 ${
                      message.type === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-700 text-slate-100'
                    }`}>
                      <p className="text-sm whitespace-pre-line">{message.content}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="flex items-start gap-2">
                    <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <Bot className="w-3 h-3 text-white" />
                    </div>
                    <div className="bg-slate-700 rounded-2xl px-3 py-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-slate-700">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about mission status, navigation, or space exploration..."
                  className="flex-1 bg-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isTyping}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white rounded-lg px-3 py-2 transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};