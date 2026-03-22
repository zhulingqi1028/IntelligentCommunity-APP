
import React, { useState, useEffect } from 'react';
import { ViewState, VisitorRecord } from '../../types';
import { ChevronLeft, QrCode, RefreshCw, UserPlus, History, MapPin, Clock, X, ChevronRight, AlertCircle, Share2, MessageCircle } from 'lucide-react';

const MOCK_VISITOR_RECORDS: VisitorRecord[] = [
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

export const ServiceAccessView = ({ onChangeView, visitorRecords = [], onUpdateVisitorRecords }: { onChangeView: (v: ViewState) => void, visitorRecords?: VisitorRecord[], onUpdateVisitorRecords?: (records: VisitorRecord[]) => void }) => {
  const [qrCode, setQrCode] = useState(Date.now().toString());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<VisitorRecord | null>(null);
  const [showShareOverlay, setShowShareOverlay] = useState(false);

  const refreshQR = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setQrCode(Date.now().toString());
      setIsRefreshing(false);
    }, 500);
  };

  // Auto refresh QR every 60s
  useEffect(() => {
    const interval = setInterval(refreshQR, 60000);
    return () => clearInterval(interval);
  }, []);

  const getStatusInfo = (status: VisitorRecord['status']) => {
    switch (status) {
      case 'ACTIVE': return { label: '生效中', color: 'bg-green-100 text-green-600', dot: 'bg-green-500' };
      case 'EXPIRED': return { label: '已过期', color: 'bg-gray-100 text-gray-500', dot: 'bg-gray-400' };
      case 'REVOKED': return { label: '已收回', color: 'bg-red-100 text-red-600', dot: 'bg-red-500' };
    }
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

  const handleShare = () => {
    setShowShareOverlay(true);
  };

  return (
    <div className="min-h-full bg-gray-50 flex flex-col animate-in slide-in-from-right duration-300 relative">
      {/* Header */}
      <div className="bg-brand-500 text-white p-4 flex items-center sticky top-0 z-10 shadow-md">
        <button onClick={() => onChangeView(ViewState.SERVICES)} className="p-1 -ml-1"><ChevronLeft /></button>
        <span className="ml-3 font-bold text-lg">智慧门禁</span>
        <button className="ml-auto text-sm font-medium flex items-center gap-1" onClick={() => setShowHistory(true)}>
          <History size={16} /> 访客记录
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="flex flex-col items-center mt-8">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center w-full max-w-xs relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-brand-500"></div>
            <h3 className="font-bold text-gray-800 mb-2">通行码</h3>
            <p className="text-xs text-gray-400 mb-6">请将二维码对准门禁扫描口</p>
            
            <div className={`w-48 h-48 bg-gray-50 rounded-xl flex items-center justify-center mb-6 relative ${isRefreshing ? 'opacity-50' : ''}`}>
              <QrCode size={160} className="text-gray-800" />
              {isRefreshing && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <RefreshCw className="animate-spin text-brand-500" size={32} />
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-2 text-xs text-brand-500 font-medium bg-brand-50 px-3 py-1.5 rounded-full cursor-pointer" onClick={refreshQR}>
              <RefreshCw size={12} className={isRefreshing ? 'animate-spin' : ''} />
              每分钟自动刷新
            </div>
          </div>

          <div className="mt-8 w-full max-w-xs space-y-3">
            <button 
              onClick={() => onChangeView(ViewState.SERVICE_VISITOR)}
              className="w-full bg-white border border-gray-200 text-gray-700 py-3.5 rounded-xl font-medium text-sm shadow-sm flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
            >
              <UserPlus size={18} className="text-brand-500" /> 生成访客通行码
            </button>
          </div>
        </div>
      </div>

      {/* History Modal */}
      {showHistory && (
        <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50 animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-t-3xl p-6 space-y-4 animate-in slide-in-from-bottom duration-300 max-h-[80vh] flex flex-col">
            <div className="flex justify-between items-center border-b pb-4">
              <h3 className="font-bold text-lg">访客记录</h3>
              <button onClick={() => setShowHistory(false)} className="text-gray-400 p-1"><X size={24}/></button>
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-3 py-2">
              {visitorRecords.map((v) => {
                const statusInfo = getStatusInfo(v.status);
                return (
                  <div 
                    key={v.id} 
                    onClick={() => setSelectedRecord(v)}
                    className="bg-white rounded-xl p-4 shadow-sm flex items-center justify-between border border-gray-100 hover:border-brand-100 transition-all cursor-pointer active:bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 font-bold">
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
              })}
            </div>
          </div>
        </div>
      )}

      {/* Record Detail Modal */}
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
