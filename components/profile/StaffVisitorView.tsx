
import React, { useState } from 'react';
import { ChevronLeft, Search, Filter, Plus, X, Calendar, User, Phone, Clock, CheckCircle, History } from 'lucide-react';
import { ViewState } from '../../types';

interface StaffVisitorViewProps {
    onChangeView: (v: ViewState) => void;
}

export const StaffVisitorView: React.FC<StaffVisitorViewProps> = ({ onChangeView }) => {
    const [mode, setMode] = useState<'LIST' | 'FORM'>('LIST');
    const [showHistory, setShowHistory] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    
    const [visitorRecords, setVisitorRecords] = useState([
        { id: 1, name: '张三', phone: '138****8888', room: '3-1-1202', type: '亲友拜访', time: '14:30', status: 'ENTERED' },
        { id: 2, name: '李四', phone: '139****9999', room: '1-2-0503', type: '外卖配送', time: '14:45', status: 'PENDING' },
        { id: 3, name: '王五', phone: '137****7777', room: '5-1-0801', type: '快递物流', time: '15:00', status: 'PENDING' },
    ]);

    const [newVisitor, setNewVisitor] = useState({
        name: '',
        phone: '',
        room: '',
        type: '亲友拜访',
        date: new Date().toISOString().split('T')[0],
        time: '12:00'
    });

    const handleAddVisitor = () => {
        if (!newVisitor.name || !newVisitor.phone || !newVisitor.room) {
            alert('请填写完整访客信息');
            return;
        }
        const record = {
            id: Date.now(),
            ...newVisitor,
            status: 'PENDING' as const
        };
        setVisitorRecords([record, ...visitorRecords]);
        setMode('LIST');
        setNewVisitor({ name: '', phone: '', room: '', type: '亲友拜访', date: new Date().toISOString().split('T')[0], time: '12:00' });
        alert('访客登记成功！');
    };

    const handleAction = (id: number, action: 'ENTER' | 'LEAVE') => {
        setVisitorRecords(prev => prev.map(v => {
            if (v.id === id) {
                return { ...v, status: action === 'ENTER' ? 'ENTERED' : 'LEFT' };
            }
            return v;
        }));
    };

    if (mode === 'FORM') {
        return (
            <div className="min-h-full bg-gray-50 flex flex-col">
                <div className="bg-white p-4 flex items-center border-b sticky top-0 z-10">
                    <button onClick={() => setMode('LIST')}><ChevronLeft /></button>
                    <span className="ml-4 font-bold text-lg">访客登记</span>
                </div>
                <div className="p-4 space-y-4">
                    <div className="bg-white rounded-xl p-4 shadow-sm space-y-4">
                        <div>
                            <label className="text-xs font-bold text-gray-600 mb-1 block">访客姓名</label>
                            <div className="flex items-center bg-gray-50 rounded-lg px-3 py-2">
                                 <User size={16} className="text-gray-400 mr-2"/>
                                 <input 
                                    className="bg-transparent flex-1 outline-none text-sm" 
                                    placeholder="请输入访客姓名" 
                                    value={newVisitor.name}
                                    onChange={e => setNewVisitor({...newVisitor, name: e.target.value})}
                                 />
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-600 mb-1 block">手机号码</label>
                            <div className="flex items-center bg-gray-50 rounded-lg px-3 py-2">
                                 <Phone size={16} className="text-gray-400 mr-2"/>
                                 <input 
                                    className="bg-transparent flex-1 outline-none text-sm" 
                                    placeholder="请输入访客手机号" 
                                    type="tel"
                                    value={newVisitor.phone}
                                    onChange={e => setNewVisitor({...newVisitor, phone: e.target.value})}
                                 />
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-600 mb-1 block">访问房号</label>
                            <div className="flex items-center bg-gray-50 rounded-lg px-3 py-2">
                                 <Search size={16} className="text-gray-400 mr-2"/>
                                 <input 
                                    className="bg-transparent flex-1 outline-none text-sm" 
                                    placeholder="例如：3-1-1202" 
                                    value={newVisitor.room}
                                    onChange={e => setNewVisitor({...newVisitor, room: e.target.value})}
                                 />
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-600 mb-2 block">访问事由</label>
                            <div className="grid grid-cols-3 gap-2">
                                {['亲友拜访', '外卖配送', '快递物流', '家政维修', '中介带看', '其他'].map(t => (
                                    <button 
                                        key={t}
                                        onClick={() => setNewVisitor({...newVisitor, type: t})}
                                        className={`py-2 text-xs rounded-lg border transition-colors ${newVisitor.type === t ? 'bg-brand-50 border-brand-500 text-brand-600 font-bold' : 'border-gray-100 text-gray-600'}`}
                                    >
                                        {t}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-xs font-bold text-gray-600 mb-1 block">访问日期</label>
                                <input 
                                    type="date" 
                                    className="w-full bg-gray-50 rounded-lg p-2 text-sm outline-none"
                                    value={newVisitor.date}
                                    onChange={e => setNewVisitor({...newVisitor, date: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-600 mb-1 block">预计时间</label>
                                <input 
                                    type="time" 
                                    className="w-full bg-gray-50 rounded-lg p-2 text-sm outline-none"
                                    value={newVisitor.time}
                                    onChange={e => setNewVisitor({...newVisitor, time: e.target.value})}
                                />
                            </div>
                        </div>
                    </div>
                    <button 
                        onClick={handleAddVisitor}
                        className="w-full bg-brand-500 text-white py-3 rounded-xl font-bold shadow-lg shadow-brand-500/30"
                    >
                        确认登记
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-full bg-gray-50 flex flex-col relative">
            <div className="bg-white p-4 flex items-center justify-between border-b sticky top-0 z-10">
                <div className="flex items-center">
                    <button onClick={() => onChangeView(ViewState.PROFILE)}><ChevronLeft /></button>
                    <span className="ml-4 font-bold text-lg">访客管理</span>
                </div>
                <button onClick={() => setShowHistory(true)} className="text-gray-500"><History size={20}/></button>
            </div>

            <div className="p-4 space-y-4">
                <div className="flex gap-2">
                    <div className="flex-1 bg-white rounded-xl px-3 py-2 flex items-center shadow-sm border border-gray-100">
                        <Search size={16} className="text-gray-400 mr-2" />
                        <input 
                            className="bg-transparent flex-1 outline-none text-sm" 
                            placeholder="搜索访客、房号..." 
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button className="bg-white p-2 rounded-xl shadow-sm border border-gray-100 text-gray-500">
                        <Filter size={20} />
                    </button>
                </div>

                <div className="space-y-3">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">今日待访</h3>
                    {visitorRecords.filter(v => v.status !== 'LEFT').map(record => (
                        <div key={record.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-brand-50 rounded-full flex items-center justify-center text-brand-500 font-bold">
                                        {record.name.slice(0, 1)}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-800 text-sm">{record.name}</h4>
                                        <p className="text-[10px] text-gray-400">{record.phone}</p>
                                    </div>
                                </div>
                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${record.status === 'ENTERED' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                                    {record.status === 'ENTERED' ? '已进入' : '待进入'}
                                </span>
                            </div>
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <Clock size={14} className="text-gray-300" />
                                    <span>预计 {record.time}</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <Search size={14} className="text-gray-300" />
                                    <span>房号 {record.room}</span>
                                </div>
                            </div>
                            <div className="flex gap-2 pt-3 border-t border-gray-50">
                                {record.status === 'PENDING' ? (
                                    <button 
                                        onClick={() => handleAction(record.id, 'ENTER')}
                                        className="flex-1 bg-brand-500 text-white py-2 rounded-lg text-xs font-bold shadow-md shadow-brand-500/20"
                                    >
                                        确认进入
                                    </button>
                                ) : (
                                    <button 
                                        onClick={() => handleAction(record.id, 'LEAVE')}
                                        className="flex-1 bg-gray-100 text-gray-600 py-2 rounded-lg text-xs font-bold"
                                    >
                                        确认离开
                                    </button>
                                )}
                                <button className="px-3 bg-gray-50 text-gray-500 rounded-lg border border-gray-100"><Phone size={14}/></button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <button 
                onClick={() => setMode('FORM')}
                className="fixed bottom-6 right-6 w-14 h-14 bg-brand-500 text-white rounded-full shadow-xl shadow-brand-500/40 flex items-center justify-center active:scale-90 transition-transform z-20"
            >
                <Plus size={28} />
            </button>

            {/* History Modal */}
            {showHistory && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-6 animate-in fade-in">
                    <div className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-xl space-y-4 relative max-h-[70vh] flex flex-col">
                        <div className="flex justify-between items-center mb-2 shrink-0">
                            <h3 className="font-bold text-lg text-gray-800">历史访客记录</h3>
                            <button onClick={() => setShowHistory(false)}><X size={20} className="text-gray-400" /></button>
                        </div>
                        <div className="flex-1 overflow-y-auto space-y-4">
                            {visitorRecords.filter(v => v.status === 'LEFT').length > 0 ? (
                                visitorRecords.filter(v => v.status === 'LEFT').map(record => (
                                    <div key={record.id} className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="font-bold text-sm text-gray-700">{record.name}</span>
                                            <span className="text-[10px] text-gray-400">已离开</span>
                                        </div>
                                        <p className="text-xs text-gray-500">房号: {record.room}</p>
                                        <p className="text-xs text-gray-500">时间: {record.time}</p>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-10 text-gray-400 text-sm">暂无历史记录</div>
                            )}
                        </div>
                        <button 
                            onClick={() => setShowHistory(false)}
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
