
import React, { useState } from 'react';
import { ViewState, VisitorRecord } from '../../types';
import { ChevronLeft, QrCode, Share2, Download, CheckCircle2, X, RefreshCw, MessageCircle, Clock, Info, AlertCircle, ChevronRight, History } from 'lucide-react';

const MOCK_RECORDS: VisitorRecord[] = [
    { id: 'vr1', name: '李明', reason: '亲友聚会', time: '2026-02-25 14:00', expiry: '2026-02-26 23:59', status: 'ACTIVE', phone: '13800138000', plate: '粤B12345' },
    { id: 'vr2', name: '顺丰快递', reason: '快递配送', time: '2026-02-24 10:30', expiry: '2026-02-24 12:00', status: 'EXPIRED', phone: '13911112222' },
    { id: 'vr3', name: '张华', reason: '家政服务', time: '2026-02-23 09:00', expiry: '2026-02-23 18:00', status: 'REVOKED', plate: '粤B66666' },
    { id: 'vr4', name: '王强', reason: '装修维修', time: '2026-02-22 15:00', expiry: '2026-02-22 20:00', status: 'EXPIRED', phone: '13722223333', plate: '粤B99999' },
    { id: 'vr5', name: '美团外卖', reason: '外卖送餐', time: '2026-02-26 12:00', expiry: '2026-02-26 13:00', status: 'ACTIVE', phone: '13544445555' },
    { id: 'vr6', name: '赵敏', reason: '亲友聚会', time: '2026-02-26 18:00', expiry: '2026-02-27 02:00', status: 'ACTIVE', phone: '18866667777', plate: '粤B88888' },
    { id: 'vr7', name: '搬家公司', reason: '搬家服务', time: '2026-02-21 08:00', expiry: '2026-02-21 18:00', status: 'EXPIRED', plate: '粤B11111' },
    { id: 'vr8', name: '孙悟空', reason: '参观访问', time: '2026-02-26 10:00', expiry: '2026-02-26 18:00', status: 'ACTIVE', phone: '13388889999' },
    { id: 'vr9', name: '周杰伦', reason: '商业洽谈', time: '2026-02-20 14:00', expiry: '2026-02-20 16:00', status: 'REVOKED', phone: '15500001111' },
    { id: 'vr10', name: '叮咚买菜', reason: '快递配送', time: '2026-02-26 09:30', expiry: '2026-02-26 10:30', status: 'ACTIVE', phone: '13122224444' },
];

const maskPhone = (phone?: string) => {
    if (!phone) return '';
    if (phone.length < 11) return phone;
    return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
};

export const ServiceVisitorView = ({ onChangeView, visitorRecords = [], onUpdateVisitorRecords }: { onChangeView: (v: ViewState) => void, visitorRecords?: VisitorRecord[], onUpdateVisitorRecords?: (records: VisitorRecord[]) => void }) => {
    const [step, setStep] = useState<'FORM' | 'SUCCESS' | 'HISTORY'>('FORM');
    const [visitorName, setVisitorName] = useState('');
    const [visitorPhone, setVisitorPhone] = useState('');
    const [visitorPlate, setVisitorPlate] = useState('');
    const [reason, setReason] = useState('');
    const [expiry, setExpiry] = useState('');
    const [selectedRecord, setSelectedRecord] = useState<VisitorRecord | null>(null);

    const handleGenerate = () => {
        if (!visitorName) {
            alert('请输入访客姓名');
            return;
        }
        const newRecord: VisitorRecord = {
            id: `vr_${Date.now()}`,
            name: visitorName,
            phone: visitorPhone,
            plate: visitorPlate,
            reason: reason || '访客预约',
            time: new Date().toLocaleString(),
            expiry: expiry || '2026-02-26 23:59',
            status: 'ACTIVE'
        };
        if (onUpdateVisitorRecords) {
            onUpdateVisitorRecords([newRecord, ...visitorRecords]);
        }
        setStep('SUCCESS');
    };

    const handleRevoke = (id: string) => {
        if (confirm('确定要收回该通行证吗？收回后访客将无法进入。')) {
            if (onUpdateVisitorRecords) {
                onUpdateVisitorRecords(visitorRecords.map(r => r.id === id ? { ...r, status: 'REVOKED' } : r));
            }
            if (selectedRecord?.id === id) {
                setSelectedRecord({ ...selectedRecord, status: 'REVOKED' });
            }
            alert('已成功收回');
        }
    };

    const [isSaving, setIsSaving] = useState(false);
    const [showShareOverlay, setShowShareOverlay] = useState(false);

    const handleSaveImage = () => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            alert('通行证已保存至相册');
        }, 1500);
    };

    const handleShare = () => {
        setShowShareOverlay(true);
    };

    const getStatusInfo = (status: VisitorRecord['status']) => {
        switch (status) {
            case 'ACTIVE': return { label: '生效中', color: 'bg-green-100 text-green-600', dot: 'bg-green-500' };
            case 'EXPIRED': return { label: '已过期', color: 'bg-gray-100 text-gray-500', dot: 'bg-gray-400' };
            case 'REVOKED': return { label: '已收回', color: 'bg-red-100 text-red-600', dot: 'bg-red-500' };
        }
    };

    return (
        <div className="min-h-full bg-gray-50 flex flex-col animate-in slide-in-from-right duration-300 relative">
            {step === 'SUCCESS' ? (
                <>
                    <div className="bg-white p-4 flex items-center border-b sticky top-0 z-20 shadow-sm">
                        <button onClick={() => setStep('FORM')} className="p-1 -ml-1 text-gray-600 active:scale-90 transition-transform"><ChevronLeft /></button>
                        <span className="ml-3 font-bold text-lg text-gray-800">通行证已生成</span>
                    </div>
                    
                    <div className="flex-1 p-6 flex flex-col items-center overflow-y-auto pb-10">
                        <div className="bg-white w-full max-w-sm rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                            <div className="bg-brand-500 p-6 text-white text-center">
                                <div className="bg-white/20 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <CheckCircle2 size={24} />
                                </div>
                                <h3 className="text-xl font-bold">访客邀请函</h3>
                                <p className="text-sm opacity-80 mt-1">请将此页面分享给访客</p>
                            </div>
                            
                            <div className="p-8 flex flex-col items-center">
                                <div className="bg-gray-50 p-4 rounded-2xl mb-6 border-2 border-dashed border-gray-200">
                                    <QrCode size={180} className="text-gray-800" />
                                </div>
                                
                                <div className="w-full space-y-4">
                                    <div className="flex justify-between border-b border-gray-50 pb-2">
                                        <span className="text-gray-400 text-sm">访客姓名</span>
                                        <span className="font-bold text-gray-800">{visitorName}</span>
                                    </div>
                                    {visitorPhone && (
                                        <div className="flex justify-between border-b border-gray-50 pb-2">
                                            <span className="text-gray-400 text-sm">手机号码</span>
                                            <span className="font-bold text-gray-800">{maskPhone(visitorPhone)}</span>
                                        </div>
                                    )}
                                    {visitorPlate && (
                                        <div className="flex justify-between border-b border-gray-50 pb-2">
                                            <span className="text-gray-400 text-sm">车牌号码</span>
                                            <span className="font-bold text-gray-800">{visitorPlate}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between border-b border-gray-50 pb-2">
                                        <span className="text-gray-400 text-sm">访问事由</span>
                                        <span className="font-bold text-gray-800">{reason || '访客预约'}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-gray-50 pb-2">
                                        <span className="text-gray-400 text-sm">有效期至</span>
                                        <span className="font-bold text-brand-500">{expiry || '2026-02-26 23:59'}</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="bg-gray-50 p-4 flex gap-3">
                                <button 
                                    onClick={handleSaveImage}
                                    disabled={isSaving}
                                    className="flex-1 bg-white border border-gray-200 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 text-gray-700 active:scale-95 transition-all disabled:opacity-50"
                                >
                                    {isSaving ? <RefreshCw className="animate-spin" size={18} /> : <Download size={18} />}
                                    {isSaving ? '正在保存...' : '保存图片'}
                                </button>
                                <button 
                                    onClick={handleShare}
                                    className="flex-1 bg-brand-500 text-white py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-brand-500/20 active:scale-95 transition-transform"
                                >
                                    <Share2 size={18} /> 微信分享
                                </button>
                            </div>
                        </div>
                        
                        <button 
                            onClick={() => onChangeView(ViewState.SERVICE_ACCESS)}
                            className="mt-8 text-gray-400 text-sm font-medium flex items-center gap-1"
                        >
                            返回门禁首页
                        </button>
                    </div>
                </>
            ) : step === 'HISTORY' ? (
                <>
                    <div className="bg-white p-4 flex items-center border-b sticky top-0 z-20 shadow-sm">
                        <button onClick={() => setStep('FORM')} className="p-1 -ml-1 text-gray-600 active:scale-90 transition-transform"><ChevronLeft /></button>
                        <span className="ml-3 font-bold text-lg text-gray-800">访客记录</span>
                    </div>
                    
                    <div className="flex-1 p-4 overflow-y-auto space-y-3">
                        {visitorRecords.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                                <History size={48} className="opacity-20 mb-4" />
                                <p>暂无访客记录</p>
                            </div>
                        ) : (
                            visitorRecords.map((v) => {
                                const statusInfo = getStatusInfo(v.status);
                                return (
                                    <div 
                                        key={v.id} 
                                        onClick={() => setSelectedRecord(v)}
                                        className="bg-white rounded-xl p-4 shadow-sm flex items-center justify-between border border-gray-100 hover:border-brand-100 transition-all cursor-pointer active:bg-gray-50"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-brand-50 rounded-full flex items-center justify-center text-brand-500 font-bold">
                                                {v.name[0]}
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-800 text-sm">{v.name}</p>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <p className="text-[10px] text-gray-400">{v.time}</p>
                                                    {(v.phone || v.plate) && (
                                                        <span className="text-[10px] text-gray-300">|</span>
                                                    )}
                                                    <p className="text-[10px] text-gray-400">{v.phone ? maskPhone(v.phone) : v.plate}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-1">
                                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${statusInfo.color}`}>
                                                {statusInfo.label}
                                            </span>
                                            <ChevronRight size={14} className="text-gray-300" />
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </>
            ) : (
                <>
                    <div className="bg-white p-4 flex items-center border-b sticky top-0 z-10">
                        <button onClick={() => onChangeView(ViewState.SERVICE_ACCESS)}><ChevronLeft /></button>
                        <span className="ml-4 font-bold text-lg">访客邀请</span>
                        <button 
                            onClick={() => setStep('HISTORY')}
                            className="ml-auto text-sm font-medium flex items-center gap-1 text-brand-500 active:opacity-70 transition-opacity"
                        >
                            <History size={16} /> 访客记录
                        </button>
                    </div>
                    
                    <div className="p-6 space-y-6">
                        <div className="bg-white p-6 rounded-2xl shadow-sm space-y-6">
                            <h3 className="font-bold text-gray-800 text-lg">填写访客信息</h3>
                            
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-400 mb-1 block uppercase tracking-wider">访客姓名</label>
                                    <input 
                                        type="text" 
                                        value={visitorName}
                                        onChange={(e) => setVisitorName(e.target.value)}
                                        placeholder="请输入访客真实姓名" 
                                        className="w-full bg-gray-50 p-3 rounded-xl text-sm outline-none border border-transparent focus:border-brand-500 transition-all" 
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <div className="flex justify-between items-center mb-1">
                                            <label className="text-xs font-bold text-gray-400 block uppercase tracking-wider">手机号码</label>
                                            <span className="text-[10px] text-gray-300">可选</span>
                                        </div>
                                        <input 
                                            type="tel" 
                                            value={visitorPhone}
                                            onChange={(e) => setVisitorPhone(e.target.value)}
                                            placeholder="访客手机号" 
                                            className="w-full bg-gray-50 p-3 rounded-xl text-sm outline-none border border-transparent focus:border-brand-500 transition-all" 
                                        />
                                    </div>
                                    <div>
                                        <div className="flex justify-between items-center mb-1">
                                            <label className="text-xs font-bold text-gray-400 block uppercase tracking-wider">车牌号码</label>
                                            <span className="text-[10px] text-gray-300">可选</span>
                                        </div>
                                        <input 
                                            type="text" 
                                            value={visitorPlate}
                                            onChange={(e) => setVisitorPlate(e.target.value)}
                                            placeholder="如: 粤B88888" 
                                            className="w-full bg-gray-50 p-3 rounded-xl text-sm outline-none border border-transparent focus:border-brand-500 transition-all" 
                                        />
                                    </div>
                                </div>
                                
                                <div>
                                    <div className="flex justify-between items-center mb-1">
                                        <label className="text-xs font-bold text-gray-400 block uppercase tracking-wider">访问事由</label>
                                        <span className="text-[10px] text-gray-300">可选</span>
                                    </div>
                                    
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {['亲友聚会', '快递配送', '外卖送餐', '家政服务', '装修维修'].map(r => (
                                            <button 
                                                key={r}
                                                onClick={() => setReason(r)}
                                                className={`px-3 py-1.5 rounded-full text-[10px] font-medium transition-all border ${reason === r ? 'bg-brand-500 text-white border-brand-500 shadow-sm shadow-brand-500/20' : 'bg-gray-50 text-gray-500 border-gray-100 hover:border-brand-200'}`}
                                            >
                                                {r}
                                            </button>
                                        ))}
                                    </div>

                                    <input 
                                        type="text" 
                                        value={reason}
                                        onChange={(e) => setReason(e.target.value)}
                                        placeholder="或输入其他事由" 
                                        className="w-full bg-gray-50 p-3 rounded-xl text-sm outline-none border border-transparent focus:border-brand-500 transition-all" 
                                    />
                                </div>
                                
                                <div>
                                    <label className="text-xs font-bold text-gray-400 mb-1 block uppercase tracking-wider">有效期至</label>
                                    <input 
                                        type="datetime-local" 
                                        value={expiry}
                                        onChange={(e) => setExpiry(e.target.value)}
                                        className="w-full bg-gray-50 p-3 rounded-xl text-sm outline-none border border-transparent focus:border-brand-500 transition-all text-gray-700" 
                                    />
                                </div>
                            </div>
                            
                            <button 
                                onClick={handleGenerate}
                                className="w-full bg-brand-500 text-white py-4 rounded-xl font-bold shadow-lg shadow-brand-500/30 active:scale-[0.98] transition-transform"
                            >
                                立即生成通行证
                            </button>
                        </div>
                    </div>
                </>
            )}

            {/* Record Detail Modal (Unified with ServiceAccess) */}
            {selectedRecord && (
                <div 
                    className="fixed inset-0 bg-black/60 z-[110] flex items-end justify-center animate-in fade-in"
                    onClick={() => setSelectedRecord(null)}
                >
                    <div 
                        className="bg-white w-full max-w-md rounded-t-[2.5rem] p-6 space-y-6 animate-in slide-in-from-bottom duration-300 max-h-[92vh] overflow-y-auto shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center sticky top-0 bg-white z-10 pb-2">
                            <h3 className="font-bold text-xl text-gray-800">访客通行证详情</h3>
                            <button onClick={() => setSelectedRecord(null)} className="bg-gray-100 p-2 rounded-full text-gray-400 active:scale-90 transition-transform">
                                <X size={20}/>
                            </button>
                        </div>

                        <div className="flex flex-col items-center py-4">
                            <div className={`p-4 rounded-2xl mb-4 border-2 border-dashed ${selectedRecord.status === 'ACTIVE' ? 'border-brand-200' : 'border-gray-200 opacity-50'} relative`}>
                                <QrCode size={160} className={selectedRecord.status === 'ACTIVE' ? 'text-gray-800' : 'text-gray-300'} />
                                {selectedRecord.status !== 'ACTIVE' && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="bg-white/80 px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
                                            <span className="text-gray-500 font-bold text-sm">已失效</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                            
                            <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold ${getStatusInfo(selectedRecord.status).color}`}>
                                <div className={`w-1.5 h-1.5 rounded-full ${getStatusInfo(selectedRecord.status).dot}`}></div>
                                {getStatusInfo(selectedRecord.status).label}
                            </div>
                        </div>

                        <div className="space-y-4 bg-gray-50 p-4 rounded-2xl">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400">访客姓名</span>
                                <span className="font-bold text-gray-800">{selectedRecord.name}</span>
                            </div>
                            {selectedRecord.phone && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">手机号码</span>
                                    <span className="font-bold text-gray-800">{maskPhone(selectedRecord.phone)}</span>
                                </div>
                            )}
                            {selectedRecord.plate && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">车牌号码</span>
                                    <span className="font-bold text-gray-800">{selectedRecord.plate}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400">访问事由</span>
                                <span className="font-bold text-gray-800">{selectedRecord.reason}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400">生成时间</span>
                                <span className="font-bold text-gray-800">{selectedRecord.time}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400">有效期至</span>
                                <span className="font-bold text-gray-800">{selectedRecord.expiry}</span>
                            </div>
                        </div>

                        <div className="space-y-3 pt-2">
                            {selectedRecord.status === 'ACTIVE' && (
                                <div className="flex gap-3">
                                    <button 
                                        onClick={() => handleRevoke(selectedRecord.id)}
                                        className="flex-1 bg-red-50 text-red-600 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform"
                                    >
                                        <AlertCircle size={18} /> 提前收回
                                    </button>
                                    <button 
                                        onClick={handleShare}
                                        className="flex-1 bg-brand-500 text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-brand-500/30 active:scale-95 transition-transform"
                                    >
                                        <Share2 size={18} /> 微信分享
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Share Overlay */}
            {showShareOverlay && (
                <div className="fixed inset-0 bg-black/80 z-[120] flex flex-col items-end p-6 animate-in fade-in" onClick={() => setShowShareOverlay(false)}>
                    <div className="text-white flex flex-col items-end gap-2">
                        <div className="flex items-center gap-2">
                            <span className="text-lg font-bold">点击右上角分享给好友</span>
                            <Share2 size={24} className="rotate-[-45deg]" />
                        </div>
                        <p className="text-sm opacity-70">让访客凭此码进入小区</p>
                    </div>
                    <div className="mt-20 self-center bg-white/10 backdrop-blur-md p-8 rounded-3xl border border-white/20 flex flex-col items-center gap-4">
                        <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-green-500/20">
                            <MessageCircle size={32} fill="white" />
                        </div>
                        <p className="text-white font-bold">正在调起微信分享...</p>
                    </div>
                </div>
            )}
        </div>
    );
};
