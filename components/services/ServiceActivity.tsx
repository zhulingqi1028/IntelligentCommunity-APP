
import React, { useState } from 'react';
import { ChevronLeft, MapPin, Calendar, Users, Info, Plus, Trash2, CheckCircle2, Clock, History, X, AlertTriangle } from 'lucide-react';
import { ViewState, Activity, ActivityStatus, ActivityParticipant, User } from '../../types';
import { MOCK_ACTIVITIES } from '../../constants';

interface ServiceActivityProps {
    user: User;
    onChangeView: (view: ViewState) => void;
    selectedActivityId?: string | null;
    onSelectActivity?: (id: string | null) => void;
}

export const ServiceActivityView: React.FC<ServiceActivityProps> = ({ user, onChangeView, selectedActivityId, onSelectActivity }) => {
    const [activeTab, setActiveTab] = useState<ActivityStatus | 'ALL'>('ALL');
    const [showMyActivities, setShowMyActivities] = useState(false);
    const [registeredActivityIds, setRegisteredActivityIds] = useState<string[]>(['act1']); // Mock one registered activity
    const [cancellingId, setCancellingId] = useState<string | null>(null);

    const filteredActivities = MOCK_ACTIVITIES.filter(act => {
        if (activeTab === 'ALL') return true;
        return act.status === activeTab;
    });

    const getStatusInfo = (status: ActivityStatus) => {
        switch(status) {
            case ActivityStatus.WARMING_UP: return { text: '预热中', color: 'bg-blue-500', textColor: 'text-blue-500', bgColor: 'bg-blue-50' };
            case ActivityStatus.REGISTERING: return { text: '报名中', color: 'bg-green-500', textColor: 'text-green-500', bgColor: 'bg-green-50' };
            case ActivityStatus.FULL: return { text: '名额已满', color: 'bg-orange-500', textColor: 'text-orange-500', bgColor: 'bg-orange-50' };
            case ActivityStatus.REGISTRATION_CLOSED: return { text: '报名截止', color: 'bg-gray-500', textColor: 'text-gray-500', bgColor: 'bg-gray-50' };
            case ActivityStatus.IN_PROGRESS: return { text: '进行中', color: 'bg-brand-500', textColor: 'text-brand-500', bgColor: 'bg-brand-50' };
            case ActivityStatus.ENDED: return { text: '已结束', color: 'bg-gray-400', textColor: 'text-gray-400', bgColor: 'bg-gray-50' };
            default: return { text: '未知', color: 'bg-gray-300', textColor: 'text-gray-300', bgColor: 'bg-gray-50' };
        }
    };

    const handleRegister = (id: string) => {
        if (!registeredActivityIds.includes(id)) {
            setRegisteredActivityIds(prev => [...prev, id]);
        }
    };

    const handleCancelRegistration = (id: string) => {
        const activity = MOCK_ACTIVITIES.find(a => a.id === id);
        if (!activity) return;

        // Only allow cancellation if registration is still open
        if (activity.status === ActivityStatus.REGISTERING || activity.status === ActivityStatus.WARMING_UP || activity.status === ActivityStatus.FULL) {
            setCancellingId(id);
        } else {
            alert('该活动已进入进行中或已结束阶段，无法取消报名。');
        }
    };

    const confirmCancel = () => {
        if (cancellingId) {
            setRegisteredActivityIds(prev => prev.filter(item => item !== cancellingId));
            setCancellingId(null);
        }
    };

    let content;
    if (selectedActivityId) {
        const activity = MOCK_ACTIVITIES.find(a => a.id === selectedActivityId);
        if (activity) {
            content = (
                <ServiceActivityDetailView 
                    user={user}
                    activity={activity} 
                    isRegistered={registeredActivityIds.includes(activity.id)}
                    onBack={() => onSelectActivity?.(null)} 
                    onRegister={() => handleRegister(activity.id)}
                    onCancel={() => handleCancelRegistration(activity.id)}
                />
            );
        }
    } else if (showMyActivities) {
        content = (
            <MyActivitiesListView 
                registeredIds={registeredActivityIds}
                onBack={() => setShowMyActivities(false)}
                onSelectActivity={(id) => {
                    setShowMyActivities(false);
                    onSelectActivity?.(id);
                }}
                onCancel={handleCancelRegistration}
                getStatusInfo={getStatusInfo}
            />
        );
    } else {
        content = (
            <div className="min-h-full bg-gray-50 pb-20 animate-in slide-in-from-right duration-300">
                {/* Header */}
                <div className="bg-white sticky top-0 z-10 border-b px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={() => onChangeView(ViewState.SERVICES)} className="p-1 -ml-1">
                            <ChevronLeft className="text-gray-700" />
                        </button>
                        <h2 className="text-lg font-bold text-gray-800">社区活动</h2>
                    </div>
                    <button 
                        onClick={() => setShowMyActivities(true)}
                        className="flex items-center gap-1.5 text-xs font-bold text-brand-500 bg-brand-50 px-3 py-1.5 rounded-full active:scale-95 transition-all"
                    >
                        <History size={14} />
                        我的活动
                    </button>
                </div>

                {/* Tabs */}
                <div className="bg-white px-4 py-2 flex gap-4 overflow-x-auto no-scrollbar border-b border-gray-100">
                    {[
                        { id: 'ALL', label: '全部' },
                        { id: ActivityStatus.WARMING_UP, label: '预热中' },
                        { id: ActivityStatus.REGISTERING, label: '报名中' },
                        { id: ActivityStatus.FULL, label: '名额已满' },
                        { id: ActivityStatus.REGISTRATION_CLOSED, label: '报名截止' },
                        { id: ActivityStatus.IN_PROGRESS, label: '进行中' },
                        { id: ActivityStatus.ENDED, label: '已结束' }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                                activeTab === tab.id ? 'bg-brand-500 text-white shadow-md shadow-brand-500/20' : 'bg-gray-100 text-gray-500'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* List */}
                <div className="p-4 space-y-4">
                    {filteredActivities.map(activity => {
                        const status = getStatusInfo(activity.status);
                        return (
                            <div 
                                key={activity.id}
                                onClick={() => onSelectActivity?.(activity.id)}
                                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 active:scale-[0.98] transition-transform cursor-pointer"
                            >
                                <div className="relative h-40">
                                    <img src={activity.image} className="w-full h-full object-cover" alt={activity.title} />
                                    <div className={`absolute top-3 right-3 px-2 py-1 rounded text-[10px] font-bold text-white ${status.color}`}>
                                        {status.text}
                                    </div>
                                </div>
                                <div className="p-4">
                                    <h3 className="font-bold text-gray-900 mb-2 line-clamp-1">{activity.title}</h3>
                                    <div className="space-y-1.5">
                                        <div className="flex items-center gap-2 text-xs text-gray-500">
                                            <Calendar size={14} className="text-gray-400" />
                                            <span>活动时间: {activity.startTime}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-gray-500">
                                            <MapPin size={14} className="text-gray-400" />
                                            <span>活动地点: {activity.location}</span>
                                        </div>
                                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
                                            <div className="flex items-center gap-1.5">
                                                <Users size={14} className="text-brand-500" />
                                                <span className="text-xs font-bold text-gray-700">{activity.currentParticipants}/{activity.maxParticipants} 人已报</span>
                                            </div>
                                            <button className={`text-xs font-bold px-4 py-1.5 rounded-full ${
                                                activity.status === ActivityStatus.REGISTERING ? 'bg-brand-500 text-white' : 'bg-gray-100 text-gray-400'
                                            }`}>
                                                {activity.status === ActivityStatus.REGISTERING ? '立即报名' : '查看详情'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }

    return (
        <div className="relative h-full">
            {content}

            {/* Cancel Confirmation Drawer */}
            {cancellingId && (
                <div className="fixed inset-0 z-[100] flex items-end justify-center">
                    <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setCancellingId(null)}></div>
                    <div className="relative bg-white w-full max-w-md rounded-t-[40px] shadow-2xl p-8 animate-in slide-in-from-bottom duration-300">
                        <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-8"></div>
                        
                        <div className="flex flex-col items-center text-center mb-8">
                            <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center text-red-500 mb-6 rotate-12">
                                <AlertTriangle size={40} />
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 mb-3 tracking-tight">确认取消报名？</h3>
                            <p className="text-gray-500 text-sm leading-relaxed max-w-[240px]">
                                取消后您的名额将立即释放给其他邻居，该操作无法撤销。
                            </p>
                        </div>

                        <div className="bg-gray-50 rounded-3xl p-5 mb-8 border border-gray-100">
                            <div className="flex items-center gap-4">
                                <img 
                                    src={MOCK_ACTIVITIES.find(a => a.id === cancellingId)?.image} 
                                    className="w-14 h-14 rounded-2xl object-cover shadow-sm"
                                    alt="Activity"
                                />
                                <div className="flex-1 text-left">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">您正准备取消</p>
                                    <p className="text-sm font-bold text-gray-900 line-clamp-1">
                                        {MOCK_ACTIVITIES.find(a => a.id === cancellingId)?.title}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <button 
                                onClick={() => setCancellingId(null)}
                                className="py-4 bg-gray-100 text-gray-500 rounded-2xl font-bold text-sm active:scale-95 transition-all"
                            >
                                我再想想
                            </button>
                            <button 
                                onClick={confirmCancel}
                                className="py-4 bg-red-500 text-white rounded-2xl font-bold text-sm shadow-xl shadow-red-500/20 active:scale-95 transition-all"
                            >
                                确认取消
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

interface DetailProps {
    user: User;
    activity: Activity;
    isRegistered: boolean;
    onBack: () => void;
    onRegister: () => void;
    onCancel: () => void;
}

const ServiceActivityDetailView: React.FC<DetailProps> = ({ user, activity, isRegistered, onBack, onRegister, onCancel }) => {
    const [showRegForm, setShowRegForm] = useState(false);
    const [participants, setParticipants] = useState<ActivityParticipant[]>([
        { name: user.name, phone: user.phone, remark: '' }
    ]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const getStatusInfo = (status: ActivityStatus) => {
        switch(status) {
            case ActivityStatus.WARMING_UP: return { text: '预热中', color: 'bg-blue-500', textColor: 'text-blue-500', bgColor: 'bg-blue-50' };
            case ActivityStatus.REGISTERING: return { text: '报名中', color: 'bg-green-500', textColor: 'text-green-500', bgColor: 'bg-green-50' };
            case ActivityStatus.FULL: return { text: '名额已满', color: 'bg-orange-500', textColor: 'text-orange-500', bgColor: 'bg-orange-50' };
            case ActivityStatus.REGISTRATION_CLOSED: return { text: '报名截止', color: 'bg-gray-500', textColor: 'text-gray-500', bgColor: 'bg-gray-50' };
            case ActivityStatus.IN_PROGRESS: return { text: '进行中', color: 'bg-brand-500', textColor: 'text-brand-500', bgColor: 'bg-brand-50' };
            case ActivityStatus.ENDED: return { text: '已结束', color: 'bg-gray-400', textColor: 'text-gray-400', bgColor: 'bg-gray-50' };
            default: return { text: '未知', color: 'bg-gray-300', textColor: 'text-gray-300', bgColor: 'bg-gray-50' };
        }
    };

    const status = getStatusInfo(activity.status);

    const handleAddParticipant = () => {
        if (participants.length + activity.currentParticipants >= activity.maxParticipants) {
            alert('报名人数已达上限');
            return;
        }
        setParticipants([...participants, { name: '', phone: '', remark: '' }]);
    };

    const handleRemoveParticipant = (index: number) => {
        if (participants.length === 1) return;
        setParticipants(participants.filter((_, i) => i !== index));
    };

    const handleInputChange = (index: number, field: keyof ActivityParticipant, value: string) => {
        const newParticipants = [...participants];
        newParticipants[index][field] = value;
        setParticipants(newParticipants);
    };

    const handleSubmit = () => {
        // Validation
        for (const p of participants) {
            if (!p.name.trim() || !p.phone.trim()) {
                alert('请填写所有参与者的姓名和手机号');
                return;
            }
            if (!/^1[3-9]\d{9}$/.test(p.phone)) {
                alert(`手机号格式错误: ${p.phone}`);
                return;
            }
        }

        setIsSubmitting(true);
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSuccess(true);
            onRegister();
        }, 1500);
    };

    if (isSuccess) {
        return (
            <div className="min-h-full bg-white flex flex-col items-center justify-center p-8 animate-in zoom-in duration-300">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-500 mb-6">
                    <CheckCircle2 size={48} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">报名成功</h2>
                <p className="text-gray-500 text-center mb-10">您已成功报名参加《{activity.title}》，请准时参加活动。</p>
                <button 
                    onClick={onBack}
                    className="w-full max-w-xs py-4 bg-brand-500 text-white rounded-2xl font-bold shadow-lg shadow-brand-500/30"
                >
                    返回列表
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-full bg-gray-50 pb-32 animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="bg-white sticky top-0 z-10 border-b px-4 py-4 flex items-center justify-between">
                <button onClick={onBack} className="p-1 -ml-1">
                    <ChevronLeft className="text-gray-700" />
                </button>
                <h2 className="text-lg font-bold text-gray-800">活动详情</h2>
                <div className="w-8"></div>
            </div>

            {/* Banner */}
            <div className="h-56 relative">
                <img src={activity.image} className="w-full h-full object-cover" alt={activity.title} />
                <div className={`absolute bottom-4 right-4 px-3 py-1 rounded-full text-xs font-bold text-white shadow-lg ${status.color}`}>
                    {status.text}
                </div>
            </div>

            {/* Content */}
            <div className="p-5 space-y-6">
                <div>
                    <h1 className="text-xl font-bold text-gray-900 leading-tight mb-4">{activity.title}</h1>
                    <div className="grid grid-cols-1 gap-4">
                        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4">
                            <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center text-brand-500 shrink-0">
                                <MapPin size={20} />
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">活动地点</p>
                                <p className="text-sm font-bold text-gray-800">{activity.location}</p>
                            </div>
                        </div>

                        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4">
                            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500 shrink-0">
                                <Calendar size={20} />
                            </div>
                            <div className="flex-1">
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">活动时间</p>
                                <p className="text-sm font-bold text-gray-800">{activity.startTime} 至 {activity.endTime.split(' ')[1]}</p>
                            </div>
                        </div>

                        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4">
                            <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-500 shrink-0">
                                <Clock size={20} />
                            </div>
                            <div className="flex-1">
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">报名时间</p>
                                <p className="text-sm font-bold text-gray-800">{activity.regStartTime} 至 {activity.regEndTime}</p>
                            </div>
                        </div>

                        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4">
                            <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-500 shrink-0">
                                <Users size={20} />
                            </div>
                            <div className="flex-1">
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">报名人数</p>
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-bold text-gray-800">{activity.currentParticipants} / {activity.maxParticipants} 人</p>
                                    <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-brand-500" 
                                            style={{ width: `${(activity.currentParticipants / activity.maxParticipants) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <Info size={18} className="text-brand-500" />
                        活动详情
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
                        {activity.description}
                    </p>
                </div>
            </div>

            {/* Registration Form Modal */}
            {showRegForm && (
                <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
                    <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setShowRegForm(false)}></div>
                    <div className="relative bg-white w-full max-w-md h-[85vh] sm:h-auto sm:max-h-[80vh] rounded-t-[40px] sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom duration-300">
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between shrink-0">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">活动报名</h3>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Activity Registration</p>
                            </div>
                            <button 
                                onClick={() => setShowRegForm(false)}
                                className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400"
                            >
                                <Plus size={20} className="rotate-45" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar">
                            {participants.map((p, index) => (
                                <div key={index} className="relative p-5 bg-gray-50 rounded-2xl border border-gray-100">
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-xs font-bold text-brand-500 bg-brand-50 px-3 py-1 rounded-full">参与者 {index + 1}</span>
                                        {participants.length > 1 && (
                                            <button onClick={() => handleRemoveParticipant(index)} className="text-red-400 p-1">
                                                <Trash2 size={16} />
                                            </button>
                                        )}
                                    </div>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 ml-1">姓名</label>
                                            <input 
                                                type="text"
                                                value={p.name}
                                                onChange={(e) => handleInputChange(index, 'name', e.target.value)}
                                                placeholder="请输入姓名"
                                                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-500 transition-colors"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 ml-1">手机号</label>
                                            <input 
                                                type="tel"
                                                value={p.phone}
                                                onChange={(e) => handleInputChange(index, 'phone', e.target.value)}
                                                placeholder="请输入手机号"
                                                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-500 transition-colors"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 ml-1">备注 (选填)</label>
                                            <input 
                                                type="text"
                                                value={p.remark}
                                                onChange={(e) => handleInputChange(index, 'remark', e.target.value)}
                                                placeholder="如：房号、特殊需求等"
                                                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-500 transition-colors"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <button 
                                onClick={handleAddParticipant}
                                className="w-full py-4 border-2 border-dashed border-gray-200 rounded-2xl text-gray-400 text-sm font-bold flex items-center justify-center gap-2 hover:border-brand-500 hover:text-brand-500 transition-all"
                            >
                                <Plus size={18} />
                                添加参与者
                            </button>
                        </div>

                        <div className="p-6 bg-white border-t border-gray-100 shrink-0">
                            <button 
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="w-full py-4 bg-brand-500 text-white rounded-2xl font-bold shadow-lg shadow-brand-500/30 flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-50"
                            >
                                {isSubmitting ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    <>确认报名 ({participants.length}人)</>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Bottom Action Bar */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 flex gap-4 z-40 max-w-md mx-auto">
                {isRegistered ? (
                    <div className="flex-1 flex gap-3">
                        <div className="flex-1 py-4 bg-green-50 text-green-600 rounded-2xl font-bold flex items-center justify-center gap-2">
                            <CheckCircle2 size={18} />
                            已报名
                        </div>
                        {(activity.status === ActivityStatus.REGISTERING || activity.status === ActivityStatus.WARMING_UP || activity.status === ActivityStatus.FULL) && (
                            <button 
                                onClick={onCancel}
                                className="px-6 py-4 bg-gray-100 text-gray-500 rounded-2xl font-bold active:scale-95 transition-all"
                            >
                                取消报名
                            </button>
                        )}
                    </div>
                ) : activity.status === ActivityStatus.REGISTERING ? (
                    <button 
                        onClick={() => setShowRegForm(true)}
                        className="flex-1 py-4 bg-brand-500 text-white rounded-2xl font-bold shadow-lg shadow-brand-500/30 active:scale-95 transition-all"
                    >
                        立即报名
                    </button>
                ) : (
                    <button 
                        disabled
                        className="flex-1 py-4 bg-gray-100 text-gray-400 rounded-2xl font-bold cursor-not-allowed"
                    >
                        {status.text}
                    </button>
                )}
            </div>
        </div>
    );
};

// --- SUB-COMPONENT: My Activities List ---
interface MyActivitiesProps {
    registeredIds: string[];
    onBack: () => void;
    onSelectActivity: (id: string) => void;
    onCancel: (id: string) => void;
    getStatusInfo: (status: ActivityStatus) => any;
}

const MyActivitiesListView: React.FC<MyActivitiesProps> = ({ registeredIds, onBack, onSelectActivity, onCancel, getStatusInfo }) => {
    const myActivities = MOCK_ACTIVITIES.filter(a => registeredIds.includes(a.id));

    return (
        <div className="min-h-full bg-gray-50 pb-20 animate-in slide-in-from-right duration-300">
            <div className="bg-white sticky top-0 z-10 border-b px-4 py-4 flex items-center gap-4">
                <button onClick={onBack} className="p-1 -ml-1">
                    <ChevronLeft className="text-gray-700" />
                </button>
                <h2 className="text-lg font-bold text-gray-800">我的报名</h2>
            </div>

            <div className="p-4 space-y-4">
                {myActivities.length > 0 ? (
                    myActivities.map(activity => {
                        const status = getStatusInfo(activity.status);
                        const canCancel = activity.status === ActivityStatus.REGISTERING || activity.status === ActivityStatus.WARMING_UP || activity.status === ActivityStatus.FULL;
                        
                        return (
                            <div 
                                key={activity.id}
                                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100"
                            >
                                <div className="flex p-3 gap-3">
                                    <img 
                                        src={activity.image} 
                                        className="w-24 h-24 object-cover rounded-xl shrink-0" 
                                        alt={activity.title}
                                        onClick={() => onSelectActivity(activity.id)}
                                    />
                                    <div className="flex-1 flex flex-col justify-between py-0.5">
                                        <div onClick={() => onSelectActivity(activity.id)}>
                                            <div className="flex justify-between items-start gap-2">
                                                <h3 className="font-bold text-gray-900 text-sm line-clamp-1">{activity.title}</h3>
                                                <span className={`shrink-0 px-2 py-0.5 rounded text-[10px] font-bold text-white ${status.color}`}>
                                                    {status.text}
                                                </span>
                                            </div>
                                            <div className="mt-2 space-y-1">
                                                <div className="flex items-center gap-1.5 text-[10px] text-gray-500">
                                                    <Calendar size={12} className="text-gray-400" />
                                                    <span>{activity.startTime}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5 text-[10px] text-gray-500">
                                                    <MapPin size={12} className="text-gray-400" />
                                                    <span>{activity.location}</span>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="flex justify-end gap-2 mt-2">
                                            {canCancel && (
                                                <button 
                                                    onClick={() => onCancel(activity.id)}
                                                    className="px-3 py-1.5 border border-gray-200 text-gray-500 text-[10px] font-bold rounded-lg active:bg-gray-50 transition-colors"
                                                >
                                                    取消报名
                                                </button>
                                            )}
                                            <button 
                                                onClick={() => onSelectActivity(activity.id)}
                                                className="px-3 py-1.5 bg-brand-50 text-brand-500 text-[10px] font-bold rounded-lg active:bg-brand-100 transition-colors"
                                            >
                                                查看详情
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="py-20 text-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                            <History size={32} />
                        </div>
                        <p className="text-gray-400 text-sm">暂无报名活动</p>
                        <button 
                            onClick={onBack}
                            className="mt-4 text-brand-500 font-bold text-sm"
                        >
                            去看看热门活动
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
