
import React, { useState } from 'react';
import { ChevronLeft, Lightbulb, Power, Settings, Clock, BarChart3, ShieldCheck, X, CheckSquare, Square, CalendarClock, Zap } from 'lucide-react';
import { ViewState } from '../../types';

interface StaffSmartLightingViewProps {
    onChangeView: (v: ViewState) => void;
}

export const StaffSmartLightingView: React.FC<StaffSmartLightingViewProps> = ({ onChangeView }) => {
    const [isBatchMode, setIsBatchMode] = useState(false);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [showTimeModal, setShowTimeModal] = useState(false);
    const [timeRange, setTimeRange] = useState({ start: '18:00', end: '06:00' });
    
    const [zones, setZones] = useState([
        { id: 'z1', name: '南门广场', status: true, brightness: 80, mode: 'AUTO', devices: 24, online: 24, energy: 12.5, schedule: '18:00 - 06:00' },
        { id: 'z2', name: '中心花园', status: true, brightness: 60, mode: 'SCHEDULE', devices: 48, online: 46, energy: 28.2, schedule: '19:00 - 05:30' },
        { id: 'z3', name: '地下车库A区', status: true, brightness: 40, mode: 'SENSOR', devices: 120, online: 118, energy: 45.8, schedule: '24小时' },
        { id: 'z4', name: '地下车库B区', status: false, brightness: 0, mode: 'MANUAL', devices: 96, online: 95, energy: 0, schedule: '手动控制' },
        { id: 'z5', name: '景观步道', status: false, brightness: 0, mode: 'AUTO', devices: 32, online: 32, energy: 0, schedule: '18:30 - 06:00' },
    ]);

    const [editingZone, setEditingZone] = useState<any>(null);

    const toggleZone = (id: string) => {
        setZones(prev => prev.map(z => {
            if (z.id === id) {
                const newStatus = !z.status;
                return { ...z, status: newStatus, brightness: newStatus ? 80 : 0 };
            }
            return z;
        }));
    };

    const handleSelect = (id: string) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(i => i !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    };

    const handleSelectAll = () => {
        if (selectedIds.length === zones.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(zones.map(z => z.id));
        }
    };

    const applySchedule = () => {
        const scheduleStr = `${timeRange.start} - ${timeRange.end}`;
        setZones(prev => prev.map(z => {
            if (selectedIds.includes(z.id)) {
                return { ...z, schedule: scheduleStr, mode: 'SCHEDULE' };
            }
            return z;
        }));
        setShowTimeModal(false);
        setIsBatchMode(false);
        setSelectedIds([]);
        alert('时间表已成功应用到选中区域');
    };

    const saveSettings = () => {
        setZones(prev => prev.map(z => z.id === editingZone.id ? editingZone : z));
        setEditingZone(null);
        alert('设置已保存');
    };

    return (
        <div className="min-h-full bg-gray-50 flex flex-col relative">
            <div className="bg-white p-4 flex items-center justify-between border-b sticky top-0 z-10">
                <div className="flex items-center">
                    <button onClick={() => onChangeView(ViewState.PROFILE)}><ChevronLeft /></button>
                    <span className="ml-4 font-bold text-lg">智慧照明</span>
                </div>
                <button 
                    onClick={() => {
                        setIsBatchMode(!isBatchMode);
                        setSelectedIds([]);
                    }}
                    className={`text-sm font-bold px-3 py-1.5 rounded-lg transition-colors ${isBatchMode ? 'bg-brand-50 text-brand-500' : 'text-gray-500'}`}
                >
                    {isBatchMode ? '取消批量' : '批量管理'}
                </button>
            </div>

            <div className="p-4 space-y-4 pb-24">
                {/* Stats Overview */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex items-center gap-2 text-gray-400 text-[10px] font-bold uppercase mb-1">
                            <Zap size={12} className="text-yellow-500"/> 今日能耗
                        </div>
                        <div className="flex items-baseline gap-1">
                            <span className="text-xl font-bold text-gray-800">86.5</span>
                            <span className="text-[10px] text-gray-400">kWh</span>
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex items-center gap-2 text-gray-400 text-[10px] font-bold uppercase mb-1">
                            <ShieldCheck size={12} className="text-green-500"/> 设备在线
                        </div>
                        <div className="flex items-baseline gap-1">
                            <span className="text-xl font-bold text-gray-800">317</span>
                            <span className="text-[10px] text-gray-400">/ 320</span>
                        </div>
                    </div>
                </div>

                {/* Zone List */}
                <div className="space-y-3">
                    {zones.map(zone => (
                        <div 
                            key={zone.id} 
                            className={`bg-white rounded-xl shadow-sm border transition-all ${
                                selectedIds.includes(zone.id) ? 'border-brand-500 bg-brand-50/30' : 'border-gray-100'
                            }`}
                        >
                            <div className="p-4">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        {isBatchMode && (
                                            <button onClick={() => handleSelect(zone.id)} className="text-brand-500">
                                                {selectedIds.includes(zone.id) ? <CheckSquare size={20}/> : <Square size={20} className="text-gray-300"/>}
                                            </button>
                                        )}
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${zone.status ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100 text-gray-400'}`}>
                                            <Lightbulb size={20} fill={zone.status ? "currentColor" : "none"}/>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-800 text-sm">{zone.name}</h4>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                                                    zone.mode === 'AUTO' ? 'bg-blue-50 text-blue-600' :
                                                    zone.mode === 'SCHEDULE' ? 'bg-purple-50 text-purple-600' :
                                                    zone.mode === 'SENSOR' ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-500'
                                                }`}>
                                                    {zone.mode === 'AUTO' ? '自动感光' : zone.mode === 'SCHEDULE' ? '定时任务' : zone.mode === 'SENSOR' ? '红外感应' : '手动控制'}
                                                </span>
                                                <span className="text-[10px] text-gray-400">{zone.online}/{zone.devices} 在线</span>
                                            </div>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => toggleZone(zone.id)}
                                        className={`w-12 h-6 rounded-full relative transition-colors ${zone.status ? 'bg-brand-500' : 'bg-gray-200'}`}
                                    >
                                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${zone.status ? 'left-7' : 'left-1'}`}></div>
                                    </button>
                                </div>

                                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-50">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-gray-400 mb-1">亮度</span>
                                        <span className="text-xs font-bold text-gray-700">{zone.brightness}%</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-gray-400 mb-1">能耗 (kWh)</span>
                                        <span className="text-xs font-bold text-gray-700">{zone.energy}</span>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <button 
                                            onClick={() => setEditingZone({...zone})}
                                            className="text-brand-500 p-1 hover:bg-brand-50 rounded-lg transition-colors"
                                        >
                                            <Settings size={18}/>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Editing Modal */}
            {editingZone && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-end justify-center animate-in fade-in duration-200">
                    <div className="bg-white w-full rounded-t-2xl p-6 space-y-6 animate-in slide-in-from-bottom duration-300">
                        <div className="flex justify-between items-center">
                            <h3 className="font-bold text-lg text-gray-800">{editingZone.name} 设置</h3>
                            <button onClick={() => setEditingZone(null)}><X size={24} className="text-gray-400" /></button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label className="text-sm font-bold text-gray-700">亮度调节</label>
                                    <span className="text-sm font-mono text-brand-500 font-bold">{editingZone.brightness}%</span>
                                </div>
                                <input 
                                    type="range" 
                                    min="0" 
                                    max="100" 
                                    value={editingZone.brightness}
                                    onChange={(e) => setEditingZone({...editingZone, brightness: parseInt(e.target.value), status: parseInt(e.target.value) > 0})}
                                    className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-brand-500"
                                />
                            </div>

                            <div>
                                <label className="text-sm font-bold text-gray-700 mb-3 block">工作模式</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {[
                                        { id: 'AUTO', name: '自动感光', icon: <Zap size={14}/> },
                                        { id: 'SCHEDULE', name: '定时任务', icon: <Clock size={14}/> },
                                        { id: 'SENSOR', name: '红外感应', icon: <BarChart3 size={14}/> },
                                        { id: 'MANUAL', name: '手动控制', icon: <Power size={14}/> },
                                    ].map(m => (
                                        <button 
                                            key={m.id}
                                            onClick={() => setEditingZone({...editingZone, mode: m.id})}
                                            className={`flex items-center justify-center gap-2 py-3 rounded-xl border text-xs font-bold transition-all ${
                                                editingZone.mode === m.id 
                                                ? 'bg-brand-50 border-brand-500 text-brand-600' 
                                                : 'border-gray-100 text-gray-400'
                                            }`}
                                        >
                                            {m.icon}
                                            {m.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Time Range Selection for SCHEDULE mode */}
                            {editingZone.mode === 'SCHEDULE' && (
                                <div className="space-y-3 animate-in slide-in-from-top duration-200">
                                    <span className="text-sm font-bold text-gray-700">开启时段 (24小时制)</span>
                                    <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
                                        <div className="flex-1">
                                            <p className="text-[10px] text-gray-400 mb-1 ml-1">开启时间</p>
                                            <input 
                                                type="time" 
                                                value={editingZone.schedule.split(' - ')[0] || '18:00'}
                                                onChange={(e) => {
                                                    const parts = editingZone.schedule.split(' - ');
                                                    const end = parts[1] || '06:00';
                                                    setEditingZone({ ...editingZone, schedule: `${e.target.value} - ${end}` });
                                                }}
                                                className="w-full bg-white border border-gray-200 rounded-lg p-2 text-sm font-mono outline-none focus:border-brand-500"
                                            />
                                        </div>
                                        <div className="text-gray-300 mt-4">至</div>
                                        <div className="flex-1">
                                            <p className="text-[10px] text-gray-400 mb-1 ml-1">关闭时间</p>
                                            <input 
                                                type="time" 
                                                value={editingZone.schedule.split(' - ')[1] || '06:00'}
                                                onChange={(e) => {
                                                    const parts = editingZone.schedule.split(' - ');
                                                    const start = parts[0] || '18:00';
                                                    setEditingZone({ ...editingZone, schedule: `${start} - ${e.target.value}` });
                                                }}
                                                className="w-full bg-white border border-gray-200 rounded-lg p-2 text-sm font-mono outline-none focus:border-brand-500"
                                            />
                                        </div>
                                    </div>
                                    <p className="text-[10px] text-gray-400 text-center">当前设置: {editingZone.schedule}</p>
                                </div>
                            )}
                        </div>

                        <button 
                            onClick={saveSettings}
                            className="w-full bg-brand-500 text-white py-3 rounded-xl font-bold shadow-lg shadow-brand-500/30 active:scale-95 transition-transform"
                        >
                            保存设置
                        </button>
                    </div>
                </div>
            )}

            {/* Batch Action Bar */}
            {isBatchMode && (
                <div className="fixed bottom-0 left-0 w-full max-w-md mx-auto bg-white border-t border-gray-200 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-20 flex justify-between items-center animate-in slide-in-from-bottom duration-300">
                    <button 
                        onClick={handleSelectAll}
                        className="flex items-center gap-2 text-sm text-gray-600 font-medium"
                    >
                        {selectedIds.length === zones.length ? <CheckSquare size={18} className="text-brand-500"/> : <Square size={18}/>}
                        全选
                    </button>
                    
                    <button 
                        onClick={() => setShowTimeModal(true)}
                        disabled={selectedIds.length === 0}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-bold text-sm transition-colors ${
                            selectedIds.length > 0 
                            ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/30' 
                            : 'bg-gray-100 text-gray-400'
                        }`}
                    >
                        <CalendarClock size={16} />
                        设置工作时间 ({selectedIds.length})
                    </button>
                </div>
            )}

            {/* Time Setting Modal */}
            {showTimeModal && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-6 animate-in fade-in">
                    <div className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-xl space-y-4 relative">
                         <div className="flex justify-between items-center mb-2">
                             <h3 className="font-bold text-lg text-gray-800">设置照明工作时间</h3>
                             <button onClick={() => setShowTimeModal(false)}><X size={20} className="text-gray-400" /></button>
                         </div>
                         <p className="text-xs text-gray-500">将为选中的 {selectedIds.length} 个区域应用以下时间表</p>

                         <div className="flex items-center gap-3">
                             <div className="flex-1">
                                 <label className="text-xs font-bold text-gray-600 block mb-1">开启时间</label>
                                 <input 
                                    type="time" 
                                    value={timeRange.start} 
                                    onChange={(e) => setTimeRange({...timeRange, start: e.target.value})}
                                    className="w-full bg-gray-50 p-3 rounded-lg border border-gray-200 font-mono text-center outline-none focus:border-brand-500"
                                 />
                             </div>
                             <span className="text-gray-300 mt-5">-</span>
                             <div className="flex-1">
                                 <label className="text-xs font-bold text-gray-600 block mb-1">关闭时间</label>
                                 <input 
                                    type="time" 
                                    value={timeRange.end}
                                    onChange={(e) => setTimeRange({...timeRange, end: e.target.value})}
                                    className="w-full bg-gray-50 p-3 rounded-lg border border-gray-200 font-mono text-center outline-none focus:border-brand-500"
                                 />
                             </div>
                         </div>

                         <div className="pt-4 flex gap-3">
                             <button 
                                onClick={() => setShowTimeModal(false)}
                                className="flex-1 py-3 text-sm font-bold text-gray-600 bg-gray-100 rounded-xl"
                             >
                                 取消
                             </button>
                             <button 
                                onClick={applySchedule}
                                className="flex-1 py-3 text-sm font-bold text-white bg-brand-500 rounded-xl shadow-lg shadow-brand-500/20"
                             >
                                 确认应用
                             </button>
                         </div>
                    </div>
                </div>
            )}
        </div>
    );
};
