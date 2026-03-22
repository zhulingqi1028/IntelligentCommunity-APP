
import React, { useState } from 'react';
import { ChevronLeft, AlertTriangle, Info, MessageSquare, Bell, ClipboardList } from 'lucide-react';
import { ViewState, Message } from '../types';

interface MessageCenterProps {
    messages: Message[];
    onReadMessage: (id: string) => void;
    onBack: () => void;
}

export const MessageCenter: React.FC<MessageCenterProps> = ({ messages, onReadMessage, onBack }) => {
    const [activeMessageTab, setActiveMessageTab] = useState('ALL');
    const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);

    const handleSelectMessage = (id: string) => {
        onReadMessage(id);
        setSelectedMessageId(id);
    };

    const messageCategories = [
        { id: 'ALL', name: '全部' },
        { id: 'URGENT', name: '告警' },
        { id: 'INTERACTION', name: '互动' },
        { id: 'NOTIFICATION', name: '通知' },
        { id: 'WORK_ORDER', name: '工单' },
        { id: 'SYSTEM', name: '系统' },
    ];

    const filteredMessages = activeMessageTab === 'ALL' 
        ? messages 
        : messages.filter(m => m.type === activeMessageTab);

    if (selectedMessageId) {
        const message = messages.find(m => m.id === selectedMessageId);
        if (!message) return null;

        return (
            <div className="min-h-full bg-white flex flex-col pb-20 animate-in slide-in-from-right duration-300">
                <div className="bg-white p-4 flex items-center border-b sticky top-0 z-10">
                    <button onClick={() => setSelectedMessageId(null)}><ChevronLeft /></button>
                    <span className="ml-4 font-bold text-lg">消息详情</span>
                </div>
                
                <div className="p-5">
                    <h1 className="text-xl font-bold text-gray-900 leading-normal mb-4">{message.title}</h1>
                    <div className="flex items-center justify-between text-xs text-gray-400 mb-6">
                        <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 rounded font-medium ${
                                message.type === 'URGENT' ? 'bg-red-100 text-red-600' :
                                message.type === 'SYSTEM' ? 'bg-blue-100 text-blue-500' :
                                message.type === 'INTERACTION' ? 'bg-green-100 text-green-500' :
                                message.type === 'NOTIFICATION' ? 'bg-orange-100 text-orange-500' :
                                message.type === 'WORK_ORDER' ? 'bg-purple-100 text-purple-500' :
                                'bg-gray-100 text-gray-500'
                            }`}>
                                {message.type === 'URGENT' ? '告警' :
                                 message.type === 'SYSTEM' ? '系统' :
                                 message.type === 'INTERACTION' ? '互动' :
                                 message.type === 'NOTIFICATION' ? '通知' :
                                 message.type === 'WORK_ORDER' ? '工单' : '消息'}
                            </span>
                            <span>{message.time}</span>
                        </div>
                    </div>
                    
                    <div className="text-gray-700 leading-relaxed text-sm space-y-4">
                        <p>{message.content}</p>
                        <p className="text-gray-400 text-xs mt-8 pt-4 border-t">
                            此消息由系统自动发送，请勿直接回复。
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    const getUnreadCount = (type: string) => {
        if (type === 'ALL') return messages.filter(m => !m.read).length;
        return messages.filter(m => m.type === type && !m.read).length;
    };

    return (
        <div className="min-h-full bg-gray-50 flex flex-col pb-20 animate-in slide-in-from-right duration-300">
            <div className="bg-brand-500 text-white p-4 flex items-center sticky top-0 z-10">
                <button onClick={onBack}><ChevronLeft /></button>
                <span className="ml-4 font-bold text-lg">消息中心</span>
            </div>
            
            <div className="bg-white px-4 pt-2 border-b border-gray-100 overflow-x-auto no-scrollbar sticky top-[60px] z-10">
                <div className="flex gap-6">
                    {messageCategories.map(cat => {
                        const unreadCount = getUnreadCount(cat.id);
                        return (
                            <button
                                key={cat.id}
                                onClick={() => setActiveMessageTab(cat.id)}
                                className={`pb-3 whitespace-nowrap text-sm font-medium transition-colors border-b-2 relative ${
                                    activeMessageTab === cat.id 
                                        ? 'text-brand-500 border-brand-500' 
                                        : 'text-gray-500 border-transparent'
                                }`}
                            >
                                {cat.name}
                                {unreadCount > 0 && (
                                    <span className="absolute -top-0.5 -right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="p-4 space-y-4">
                {filteredMessages.map(msg => (
                    <div 
                        key={msg.id} 
                        onClick={() => handleSelectMessage(msg.id)}
                        className={`bg-white p-4 rounded-xl shadow-sm relative cursor-pointer active:scale-[0.98] transition-transform ${msg.type === 'URGENT' ? 'border-l-4 border-red-500' : ''}`}
                    >
                        {!msg.read && <div className="absolute top-4 right-4 w-2 h-2 bg-red-500 rounded-full"></div>}
                        <div className="flex items-center gap-2 mb-2">
                            {msg.type === 'URGENT' ? (
                                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600"><AlertTriangle size={16}/></div>
                            ) : msg.type === 'SYSTEM' ? (
                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-500"><Info size={16}/></div>
                            ) : msg.type === 'INTERACTION' ? (
                                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-500"><MessageSquare size={16}/></div>
                            ) : msg.type === 'NOTIFICATION' ? (
                                <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-500"><Bell size={16}/></div>
                            ) : msg.type === 'WORK_ORDER' ? (
                                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-500"><ClipboardList size={16}/></div>
                            ) : (
                                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500"><Info size={16}/></div>
                            )}
                            <span className={`font-bold text-sm ${msg.type === 'URGENT' ? 'text-red-600' : 'text-gray-800'}`}>{msg.title}</span>
                            <span className="text-[10px] text-gray-400 ml-auto">{msg.time}</span>
                        </div>
                        <p className="text-sm text-gray-600 pl-10">{msg.content}</p>
                        <div className="pl-10 mt-2">
                            <button className="text-xs text-brand-500 font-medium flex items-center gap-1">
                                查看详情 <ChevronLeft className="rotate-180 w-3 h-3" />
                            </button>
                        </div>
                    </div>
                ))}
                {filteredMessages.length === 0 && (
                    <div className="text-center py-10 text-gray-400">暂无{messageCategories.find(c => c.id === activeMessageTab)?.name}消息</div>
                )}
            </div>
        </div>
    );
};
