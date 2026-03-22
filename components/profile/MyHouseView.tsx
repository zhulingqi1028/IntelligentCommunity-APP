
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Home, Plus, Trash2, X } from 'lucide-react';
import { ViewState, HouseInfo } from '../../types';
import { MOCK_HOUSES, MOCK_HOUSE_MEMBERS } from '../../constants';

interface MyHouseViewProps {
    onChangeView: (v: ViewState) => void;
}

export const MyHouseView: React.FC<MyHouseViewProps> = ({ onChangeView }) => {
    const [selectedHouse, setSelectedHouse] = useState<HouseInfo | null>(null);
    const [members, setMembers] = useState(MOCK_HOUSE_MEMBERS);
    const [isAddingMember, setIsAddingMember] = useState(false);
    const [deletingMember, setDeletingMember] = useState<any | null>(null);
    
    // Form state for adding member
    const [newMemberName, setNewMemberName] = useState('');
    const [newMemberPhone, setNewMemberPhone] = useState('');
    const [newMemberRole, setNewMemberRole] = useState<'家属' | '租客'>('家属');

    const handleAddMember = () => {
        if (!newMemberName || !newMemberPhone) {
            alert('请填写完整信息');
            return;
        }
        const newMember = {
            id: `m_${Date.now()}`,
            name: newMemberName,
            phone: newMemberPhone,
            role: newMemberRole,
            avatar: `https://ui-avatars.com/api/?name=${newMemberName}&background=random`,
            status: 'CERTIFIED' as const
        };
        setMembers([...members, newMember]);
        setIsAddingMember(false);
        setNewMemberName('');
        setNewMemberPhone('');
        alert('成员新增成功，该成员现在可以登录并使用APP。');
    };

    // If no specific house selected, show list
    if (!selectedHouse) {
        return (
            <div className="min-h-full bg-gray-50 flex flex-col">
                <div className="bg-white p-4 flex items-center border-b sticky top-0">
                    <button onClick={() => onChangeView(ViewState.PROFILE)}><ChevronLeft /></button>
                    <span className="ml-4 font-bold text-lg">我的房屋</span>
                </div>
                <div className="p-4 space-y-4">
                    {MOCK_HOUSES.map(house => (
                        <div 
                            key={house.id} 
                            onClick={() => setSelectedHouse(house)}
                            className="bg-white rounded-xl p-5 shadow-sm border border-transparent hover:border-brand-200 transition-all cursor-pointer relative overflow-hidden group"
                        >
                            <div className="absolute top-0 right-0 p-2 bg-brand-50 rounded-bl-xl text-xs font-bold text-brand-600">
                                {house.role === 'OWNER' ? '户主' : house.role === 'FAMILY' ? '家属' : '租客'}
                            </div>
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-500">
                                    <Home size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-800">{house.communityName}</h3>
                                    <p className="text-sm text-gray-500">{house.building} {house.unit} {house.room}</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-gray-50">
                                <div className="text-center">
                                    <p className="text-xs text-gray-400">面积</p>
                                    <p className="text-sm font-bold text-gray-700">{house.area}m²</p>
                                </div>
                                <div className="text-center border-l border-gray-100 flex items-center justify-center">
                                    <ChevronRight className="text-gray-300" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // Detail View
    return (
        <div className="min-h-full bg-gray-50 flex flex-col">
            <div className="bg-white p-4 flex items-center border-b sticky top-0 z-10">
                <button onClick={() => setSelectedHouse(null)}><ChevronLeft /></button>
                <span className="ml-4 font-bold text-lg">房屋详情</span>
            </div>
            
            <div className="p-4 space-y-4 overflow-y-auto">
                {/* House Card */}
                <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
                    <Home className="absolute right-[-20px] bottom-[-20px] w-40 h-40 opacity-10" />
                    <h2 className="text-2xl font-bold mb-1">{selectedHouse.room}室</h2>
                    <p className="opacity-90 text-sm mb-6">{selectedHouse.communityName} {selectedHouse.building} {selectedHouse.unit}</p>
                    
                    <div className="flex gap-6">
                        <div>
                            <p className="text-xs opacity-60">建筑面积</p>
                            <p className="font-bold">{selectedHouse.area}m²</p>
                        </div>
                        <div>
                            <p className="text-xs opacity-60">我的身份</p>
                            <p className="font-bold bg-white/20 px-2 rounded text-sm">{selectedHouse.role === 'OWNER' ? '户主' : '住户'}</p>
                        </div>
                    </div>
                </div>

                {/* Members List */}
                <div className="bg-white rounded-xl shadow-sm p-4">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-gray-800">住户管理 ({members.length})</h3>
                        {selectedHouse.role === 'OWNER' && (
                            <button onClick={() => setIsAddingMember(true)} className="hidden text-brand-500 text-sm font-medium items-center gap-1">
                                <Plus size={16} /> 新增成员
                            </button>
                        )}
                    </div>
                    
                    <div className="space-y-4">
                        {members.map(member => (
                            <div key={member.id} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <img src={member.avatar} className="w-10 h-10 rounded-full bg-gray-100" />
                                        {member.role === '户主' && <div className="absolute -bottom-1 -right-1 bg-yellow-400 text-[8px] px-1 rounded font-bold border border-white">户主</div>}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-gray-800 text-sm">{member.name}</span>
                                            <span className="text-xs text-gray-500 bg-gray-100 px-1.5 rounded">{member.role}</span>
                                        </div>
                                        <p className="text-xs text-gray-400 mt-0.5">{member.phone}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    {selectedHouse.role === 'OWNER' && member.role !== '户主' && (
                                        <button 
                                            onClick={() => setDeletingMember(member)}
                                            className="hidden p-2 text-gray-400 hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Add Member Modal */}
            {isAddingMember && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-in fade-in">
                    <div className="bg-white w-full max-w-sm rounded-2xl p-6 space-y-4 relative">
                        <button onClick={() => setIsAddingMember(false)} className="absolute top-4 right-4 text-gray-400"><X size={20}/></button>
                        <h3 className="font-bold text-lg text-center">新增成员</h3>
                        
                        <div className="space-y-3">
                            <div>
                                <label className="text-xs text-gray-400 mb-1 block">姓名</label>
                                <input 
                                    type="text" 
                                    value={newMemberName}
                                    onChange={(e) => setNewMemberName(e.target.value)}
                                    className="w-full bg-gray-50 p-2.5 rounded-lg text-sm outline-none" 
                                    placeholder="请输入姓名"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-gray-400 mb-1 block">手机号</label>
                                <input 
                                    type="tel" 
                                    value={newMemberPhone}
                                    onChange={(e) => setNewMemberPhone(e.target.value)}
                                    className="w-full bg-gray-50 p-2.5 rounded-lg text-sm outline-none" 
                                    placeholder="请输入手机号"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-gray-400 mb-1 block">成员类型</label>
                                <div className="flex gap-2">
                                    {(['家属', '租客'] as const).map(r => (
                                        <button 
                                            key={r}
                                            onClick={() => setNewMemberRole(r)}
                                            className={`flex-1 py-2 text-xs rounded-lg border transition-all ${newMemberRole === r ? 'bg-brand-50 border-brand-500 text-brand-600 font-bold' : 'border-gray-100 text-gray-500'}`}
                                        >
                                            {r}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <button 
                            onClick={handleAddMember}
                            className="w-full bg-brand-500 text-white py-3 rounded-xl font-bold shadow-lg shadow-brand-500/30 active:scale-95 transition-transform"
                        >
                            确认新增
                        </button>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deletingMember && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-in fade-in">
                    <div className="bg-white w-full max-w-sm rounded-2xl p-6 space-y-4 animate-in zoom-in-95">
                        <div className="text-center">
                            <div className="w-12 h-12 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Trash2 size={24} />
                            </div>
                            <h3 className="font-bold text-lg text-gray-900">确认移除成员?</h3>
                            <p className="text-sm text-gray-500 mt-2">
                                您即将移除成员 <span className="font-bold text-gray-800">{deletingMember.name}</span>
                                <br />
                                ({deletingMember.role})
                            </p>
                            <p className="text-xs text-red-500 mt-2 bg-red-50 p-2 rounded">
                                移除后该成员将无法再通过APP访问本房屋的相关服务。
                            </p>
                        </div>
                        
                        <div className="flex gap-3 mt-6">
                            <button 
                                onClick={() => setDeletingMember(null)}
                                className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 font-bold hover:bg-gray-50 transition-colors"
                            >
                                取消
                            </button>
                            <button 
                                onClick={() => {
                                    setMembers(members.filter(m => m.id !== deletingMember.id));
                                    setDeletingMember(null);
                                }}
                                className="flex-1 py-3 rounded-xl bg-red-500 text-white font-bold shadow-lg shadow-red-500/30 hover:bg-red-600 transition-colors"
                            >
                                确认移除
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
