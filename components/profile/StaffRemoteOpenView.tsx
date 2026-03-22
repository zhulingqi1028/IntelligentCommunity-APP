
import React, { useState } from 'react';
import { ChevronLeft, Lock, Unlock, MapPin, Search, Clock, ShieldCheck, AlertCircle, History, X } from 'lucide-react';
import { ViewState, User } from '../../types';

interface StaffRemoteOpenViewProps {
    user: User;
    onChangeView: (v: ViewState) => void;
}

export const StaffRemoteOpenView: React.FC<StaffRemoteOpenViewProps> = ({ user, onChangeView }) => {
    const [selectedDoor, setSelectedDoor] = useState<string | null>(null);
    const [roomNumber, setRoomNumber] = useState('');
    const [reason, setReason] = useState('');
    const [isOpening, setIsOpening] = useState(false);
    const [showLogs, setShowLogs] = useState(false);

    const doors = [
        { id: 'd1', name: '南门人行主入口', status: 'ONLINE', area: '南门' },
        { id: 'd2', name: '北门人行入口', status: 'ONLINE', area: '北门' },
        { id: 'd3', name: '1栋1单元单元门', status: 'ONLINE', area: '1栋' },
        { id: 'd4', name: '3栋2单元单元门', status: 'ONLINE', area: '3栋' },
        { id: 'd5', name: '地下车库A区电梯厅', status: 'OFFLINE', area: '地下车库' },
    ];

    const [logs, setLogs] = useState([
        { id: 1, door: '南门人行主入口', operator: '张三', time: '10:30', reason: '访客进入' },
        { id: 2, door: '1栋1单元单元门', operator: '李四', time: '09:15', reason: '业主忘带卡' },
    ]);

    const handleOpen = () => {
        if (!selectedDoor) {
            alert('请选择要开启的门禁');
            return;
        }
        if (!roomNumber || !reason) {
            alert('请填写房号和开门原因');
            return;
        }

        setIsOpening(true);
        // Simulate API call
        setTimeout(() => {
            setIsOpening(false);
            const door = doors.find(d => d.id === selectedDoor);
            const newLog = {
                id: Date.now(),
                door: door?.name || '未知门禁',
                operator: user.name,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                reason: reason
            };
            setLogs([newLog, ...logs]);
            alert('门禁已远程开启！');
            setRoomNumber('');
            setReason('');
            setSelectedDoor(null);
        }, 1500);
    };

    return (
        <div className="min-h-full bg-gray-50 flex flex-col relative">
            <div className="bg-white p-4 flex items-center justify-between border-b sticky top-0 z-10">
                <div className="flex items-center">
                    <button onClick={() => onChangeView(ViewState.PROFILE)}><ChevronLeft /></button>
                    <span className="ml-4 font-bold text-lg">远程开门</span>
                </div>
                <button onClick={() => setShowLogs(true)} className="text-gray-500"><History size={20}/></button>
            </div>

            <div className="p-4 space-y-4 pb-24">
                <div className="bg-white rounded-xl p-4 shadow-sm space-y-4">
                    <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                        <ShieldCheck size={18} className="text-brand-500"/> 安全验证
                    </h3>
                    <div className="space-y-3">
                        <div>
                            <label className="text-xs font-bold text-gray-500 mb-1 block">访问房号</label>
                            <input 
                                className="w-full bg-gray-50 p-3 rounded-xl outline-none text-sm border border-transparent focus:border-brand-500 transition-colors" 
                                placeholder="请输入房号 (如: 3-1-1202)" 
                                value={roomNumber}
                                onChange={e => setRoomNumber(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-500 mb-1 block">开门原因</label>
                            <select 
                                className="w-full bg-gray-50 p-3 rounded-xl outline-none text-sm border border-transparent focus:border-brand-500 transition-colors appearance-none"
                                value={reason}
                                onChange={e => setReason(e.target.value)}
                            >
                                <option value="">请选择开门原因</option>
                                <option value="访客进入">访客进入</option>
                                <option value="业主忘带卡">业主忘带卡</option>
                                <option value="外卖/快递">外卖/快递</option>
                                <option value="工程维修">工程维修</option>
                                <option value="其他">其他</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="space-y-3">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">选择门禁设备</h3>
                    <div className="grid grid-cols-1 gap-3">
                        {doors.map(door => (
                            <button 
                                key={door.id}
                                onClick={() => door.status === 'ONLINE' && setSelectedDoor(door.id)}
                                className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                                    selectedDoor === door.id 
                                    ? 'bg-brand-50 border-brand-500 shadow-md' 
                                    : 'bg-white border-gray-100'
                                } ${door.status === 'OFFLINE' ? 'opacity-50 grayscale cursor-not-allowed' : ''}`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${selectedDoor === door.id ? 'bg-brand-500 text-white' : 'bg-gray-100 text-gray-400'}`}>
                                        {selectedDoor === door.id ? <Unlock size={20}/> : <Lock size={20}/>}
                                    </div>
                                    <div className="text-left">
                                        <h4 className="font-bold text-gray-800 text-sm">{door.name}</h4>
                                        <div className="flex items-center gap-1 text-[10px] text-gray-400">
                                            <MapPin size={10}/> {door.area}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className={`text-[10px] font-bold ${door.status === 'ONLINE' ? 'text-green-500' : 'text-red-500'}`}>
                                        {door.status === 'ONLINE' ? '● 在线' : '● 离线'}
                                    </span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="fixed bottom-0 left-0 w-full max-w-md mx-auto p-4 bg-white border-t border-gray-100 z-20">
                <button 
                    onClick={handleOpen}
                    disabled={isOpening || !selectedDoor}
                    className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2 ${
                        isOpening || !selectedDoor ? 'bg-gray-300 shadow-none' : 'bg-brand-500 shadow-brand-500/30 active:scale-95'
                    }`}
                >
                    {isOpening ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            正在开启...
                        </>
                    ) : (
                        <>
                            <Unlock size={20}/> 立即开门
                        </>
                    )}
                </button>
                <p className="text-[10px] text-gray-400 text-center mt-3 flex items-center justify-center gap-1">
                    <AlertCircle size={10}/> 远程开门操作将被系统实时记录，请规范操作
                </p>
            </div>

            {/* Logs Modal */}
            {showLogs && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-6 animate-in fade-in">
                    <div className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-xl space-y-4 relative max-h-[70vh] flex flex-col">
                        <div className="flex justify-between items-center mb-2 shrink-0">
                            <h3 className="font-bold text-lg text-gray-800">开门历史记录</h3>
                            <button onClick={() => setShowLogs(false)}><X size={20} className="text-gray-400" /></button>
                        </div>
                        <div className="flex-1 overflow-y-auto space-y-4">
                            {logs.map(log => (
                                <div key={log.id} className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="font-bold text-sm text-gray-700">{log.door}</span>
                                        <span className="text-[10px] text-gray-400">{log.time}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-gray-500">操作人: {log.operator}</span>
                                        <span className="text-xs text-brand-500 font-medium">{log.reason}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button 
                            onClick={() => setShowLogs(false)}
                            className="w-full bg-gray-100 text-gray-600 py-3 rounded-xl font-bold text-sm shrink-0"
                        >
                            关闭
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
