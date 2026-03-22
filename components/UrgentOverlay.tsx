
import React, { useState, useEffect } from 'react';
import { UrgentEvent } from '../types';
import { Flame, AlertTriangle, Droplets, ShieldAlert, BellRing, MapPin, Clock } from 'lucide-react';

interface UrgentOverlayProps {
  event: UrgentEvent;
  onAcknowledge: () => void;
}

export const UrgentOverlay: React.FC<UrgentOverlayProps> = ({ event, onAcknowledge }) => {
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setPulse(p => !p), 1000);
    return () => clearInterval(interval);
  }, []);

  const config = {
    FIRE: {
      color: 'bg-red-600',
      icon: Flame,
      label: '紧急火警',
      bgPattern: 'from-red-500 to-red-700'
    },
    HIGH_THROW: {
      color: 'bg-orange-500',
      icon: AlertTriangle,
      label: '高空抛物预警',
      bgPattern: 'from-orange-400 to-orange-600'
    },
    WATER_CUT: {
      color: 'bg-blue-500',
      icon: Droplets,
      label: '停水通知',
      bgPattern: 'from-blue-400 to-blue-600'
    },
    SECURITY: {
      color: 'bg-purple-600',
      icon: ShieldAlert,
      label: '治安预警',
      bgPattern: 'from-purple-500 to-purple-700'
    }
  }[event.type] || {
    color: 'bg-gray-800',
    icon: BellRing,
    label: '紧急通知',
    bgPattern: 'from-gray-700 to-gray-900'
  };

  const Icon = config.icon;

  return (
    <div className={`fixed inset-0 z-[100] flex flex-col items-center justify-center p-6 text-white overflow-hidden`}>
      {/* Background with Pulse Effect */}
      <div className={`absolute inset-0 bg-gradient-to-br ${config.bgPattern}`}></div>
      <div className={`absolute inset-0 bg-black/20 ${pulse ? 'opacity-0' : 'opacity-30'} transition-opacity duration-1000`}></div>
      
      {/* Ripple Animation Circles */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
         <div className={`w-[500px] h-[500px] rounded-full border-4 border-white/20 scale-50 animate-ping absolute`}></div>
         <div className={`w-[300px] h-[300px] rounded-full border-4 border-white/30 scale-75 animate-ping absolute animation-delay-500`}></div>
      </div>

      <div className="relative z-10 flex flex-col items-center w-full max-w-md text-center">
        {/* Icon */}
        <div className={`w-28 h-28 rounded-full bg-white text-${config.color.split('-')[1]}-600 flex items-center justify-center mb-8 shadow-2xl animate-bounce`}>
           <Icon size={64} className={event.type === 'FIRE' ? 'text-red-600' : event.type === 'HIGH_THROW' ? 'text-orange-500' : 'text-blue-500'} />
        </div>

        <h1 className="text-4xl font-black mb-2 tracking-wide uppercase shadow-sm">{config.label}</h1>
        <h2 className="text-xl font-bold mb-8 opacity-90">{event.title}</h2>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 w-full border border-white/20 shadow-lg mb-8">
            <div className="flex flex-col gap-4">
                <div className="flex items-start gap-3 text-left">
                    <AlertTriangle className="shrink-0 mt-1 text-yellow-300" size={20} />
                    <p className="text-lg font-medium leading-relaxed">{event.content}</p>
                </div>
                {event.location && (
                    <div className="flex items-center gap-3 text-left border-t border-white/10 pt-3">
                        <MapPin className="shrink-0 text-white/70" size={18} />
                        <span className="font-mono text-sm">{event.location}</span>
                    </div>
                )}
                <div className="flex items-center gap-3 text-left">
                    <Clock className="shrink-0 text-white/70" size={18} />
                    <span className="font-mono text-sm">{event.time}</span>
                </div>
            </div>
        </div>

        <button 
            onClick={onAcknowledge}
            className="w-full bg-white text-gray-900 py-4 rounded-xl font-bold text-lg shadow-xl active:scale-95 transition-transform hover:bg-gray-100 flex items-center justify-center gap-2"
        >
            我已收到 / 安全确认
        </button>
      </div>
    </div>
  );
};
