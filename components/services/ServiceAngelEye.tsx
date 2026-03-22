
import React, { useState } from 'react';
import { ViewState, CaredPerson } from '../../types';
import { MOCK_CARED_PERSONS } from '../../constants';
import { ChevronLeft, Plus, MapPin, ChevronRight, History, Play, Phone, Eye, Video, Volume2, Wifi, X, UserPlus, Camera, Trash2, AlertCircle } from 'lucide-react';

export const ServiceAngelEyeView = ({ onChangeView, onSelectPerson }: { onChangeView: (v: ViewState) => void, onSelectPerson: (p: CaredPerson) => void }) => {
    const [persons, setPersons] = useState<CaredPerson[]>(MOCK_CARED_PERSONS);
    const [isAdding, setIsAdding] = useState(false);
    const [deletingPerson, setDeletingPerson] = useState<CaredPerson | null>(null);
    
    // Form state
    const [newName, setNewName] = useState('');
    const [newIdCard, setNewIdCard] = useState('');
    const [newRelation, setNewRelation] = useState('');
    const [idCardFront, setIdCardFront] = useState<string | null>(null);
    const [idCardBack, setIdCardBack] = useState<string | null>(null);

    const calculateAge = (idCard: string) => {
        if (!idCard || idCard.length !== 18) return 0;
        const birthYear = parseInt(idCard.substring(6, 10));
        const currentYear = new Date().getFullYear();
        return currentYear - birthYear;
    };

    const handleAdd = () => {
        if (!newName || !newIdCard || !newRelation) {
            alert('请填写完整信息');
            return;
        }
        if (newIdCard.length !== 18) {
            alert('请输入正确的18位身份证号');
            return;
        }
        if (!idCardFront || !idCardBack) {
            alert('请上传身份证正反面照片');
            return;
        }

        const age = calculateAge(newIdCard);
        const newPerson: CaredPerson = {
            id: `cp_${Date.now()}`,
            name: newName,
            idCard: newIdCard,
            age: age,
            relation: newRelation,
            status: 'SAFE',
            lastLocation: '暂无位置信息',
            lastTime: '刚刚',
            avatar: `https://ui-avatars.com/api/?name=${newName}&background=random`,
            idCardFront,
            idCardBack
        };
        setPersons([newPerson, ...persons]);
        setIsAdding(false);
        setNewName('');
        setNewIdCard('');
        setNewRelation('');
        setIdCardFront(null);
        setIdCardBack(null);
        alert('添加成功');
    };

    const handleDelete = (e: React.MouseEvent, person: CaredPerson) => {
        e.stopPropagation();
        setDeletingPerson(person);
    };

    const confirmDelete = () => {
        if (deletingPerson) {
            setPersons(persons.filter(p => p.id !== deletingPerson.id));
            setDeletingPerson(null);
        }
    };

    const handleMockUpload = (side: 'front' | 'back') => {
        // Simulate file upload
        const mockUrl = side === 'front' 
            ? 'https://picsum.photos/400/250?random=id_front' 
            : 'https://picsum.photos/400/250?random=id_back';
        
        if (side === 'front') setIdCardFront(mockUrl);
        else setIdCardBack(mockUrl);
    };

    return (
        <div className="min-h-full bg-gray-50 flex flex-col relative">
            <div className="bg-brand-500 text-white p-4 flex items-center sticky top-0 z-10">
                <button onClick={() => onChangeView(ViewState.SERVICES)}><ChevronLeft /></button>
                <span className="ml-4 font-bold text-lg">天使之眼</span>
                <button onClick={() => setIsAdding(true)} className="ml-auto bg-white/20 p-1.5 rounded-lg active:scale-95 transition-transform">
                    <Plus className="text-white" size={20} />
                </button>
            </div>
            
            <div className="p-4 space-y-4">
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex items-start gap-3">
                    <div className="bg-blue-500 p-2 rounded-lg text-white">
                        <Eye size={20} />
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-blue-800">什么是天使之眼？</h4>
                        <p className="text-xs text-blue-600 mt-1 leading-relaxed">
                            通过小区智能摄像头，实时关注老人和小孩的活动轨迹。
                        </p>
                    </div>
                </div>

                {persons.map(person => (
                    <div 
                        key={person.id} 
                        className="bg-white rounded-xl p-4 shadow-sm flex items-center gap-4 active:bg-gray-50 transition-colors cursor-pointer group" 
                        onClick={() => onSelectPerson(person)}
                    >
                        <img src={person.avatar} className="w-16 h-16 rounded-full object-cover border-2 border-brand-100" />
                        <div className="flex-1">
                            <div className="flex justify-between items-center mb-1">
                                <h3 className="font-bold text-lg text-gray-800">
                                    {person.name} 
                                    <span className="text-xs font-normal text-gray-500 ml-2">({person.relation} · {person.age}岁)</span>
                                </h3>
                                <button 
                                    onClick={(e) => handleDelete(e, person)}
                                    className="p-2.5 bg-red-50 text-red-400 hover:text-red-600 hover:bg-red-100 rounded-full active:scale-90 transition-all shadow-sm border border-red-100/50"
                                    title="删除"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                            <div className="flex items-center gap-1 text-sm text-gray-600 mb-1">
                                <MapPin size={14} className="text-brand-500" /> {person.lastLocation}
                            </div>
                            <div className="text-xs text-gray-400">
                                更新于: {person.lastTime}
                            </div>
                        </div>
                        <ChevronRight className="text-gray-300" />
                    </div>
                ))}

                {persons.length === 0 && (
                    <div className="py-20 flex flex-col items-center justify-center text-gray-400">
                        <UserPlus size={48} strokeWidth={1} />
                        <p className="mt-4 text-sm">暂无被关爱人员</p>
                        <button onClick={() => setIsAdding(true)} className="mt-4 text-brand-500 font-bold text-sm">立即添加</button>
                    </div>
                )}
            </div>

            {/* Add Person Modal */}
            {isAdding && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[100] animate-in fade-in overflow-y-auto">
                    <div className="bg-white w-full max-w-md rounded-2xl p-6 space-y-5 animate-in zoom-in-95 duration-200 my-8">
                        <div className="flex justify-between items-center">
                            <h3 className="font-bold text-lg">新增被关爱人员</h3>
                            <button onClick={() => setIsAdding(false)} className="text-gray-400 p-1"><X size={20}/></button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-gray-600 mb-1 block">姓名</label>
                                <input 
                                    type="text" 
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    className="w-full bg-gray-50 p-3 rounded-xl text-sm outline-none border border-transparent focus:border-brand-500 transition-all" 
                                    placeholder="请输入姓名"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-600 mb-1 block">身份证号</label>
                                <input 
                                    type="text" 
                                    value={newIdCard}
                                    onChange={(e) => setNewIdCard(e.target.value)}
                                    className="w-full bg-gray-50 p-3 rounded-xl text-sm outline-none border border-transparent focus:border-brand-500 transition-all" 
                                    placeholder="请输入18位身份证号"
                                    maxLength={18}
                                />
                                {newIdCard.length === 18 && (
                                    <p className="text-[10px] text-brand-500 mt-1 ml-1">识别年龄: {calculateAge(newIdCard)}岁</p>
                                )}
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-600 mb-1 block">关系</label>
                                <input 
                                    type="text" 
                                    value={newRelation}
                                    onChange={(e) => setNewRelation(e.target.value)}
                                    className="w-full bg-gray-50 p-3 rounded-xl text-sm outline-none border border-transparent focus:border-brand-500 transition-all" 
                                    placeholder="如：父亲、女儿"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-600 block">身份证照片</label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button 
                                        onClick={() => handleMockUpload('front')}
                                        className="aspect-[1.6/1] bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-2 overflow-hidden group active:bg-gray-100 transition-all"
                                    >
                                        {idCardFront ? (
                                            <img src={idCardFront} className="w-full h-full object-cover" />
                                        ) : (
                                            <>
                                                <Camera className="text-gray-400 group-hover:text-brand-500 transition-colors" size={24} />
                                                <span className="text-[10px] text-gray-400">上传人像面</span>
                                            </>
                                        )}
                                    </button>
                                    <button 
                                        onClick={() => handleMockUpload('back')}
                                        className="aspect-[1.6/1] bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-2 overflow-hidden group active:bg-gray-100 transition-all"
                                    >
                                        {idCardBack ? (
                                            <img src={idCardBack} className="w-full h-full object-cover" />
                                        ) : (
                                            <>
                                                <Camera className="text-gray-400 group-hover:text-brand-500 transition-colors" size={24} />
                                                <span className="text-[10px] text-gray-400">上传国徽面</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="pt-2">
                            <button 
                                onClick={handleAdd}
                                className="w-full bg-brand-500 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-brand-500/30 active:scale-[0.98] transition-transform"
                            >
                                确认添加
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* Delete Confirmation Modal */}
            {deletingPerson && (
                <div className="fixed inset-0 bg-black/60 z-[200] flex items-center justify-center p-6 animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-xs rounded-2xl p-6 space-y-4 animate-in zoom-in-95 duration-200 shadow-2xl">
                        <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center text-red-500 mx-auto">
                            <AlertCircle size={24} />
                        </div>
                        <div className="text-center">
                            <h3 className="font-bold text-gray-800 text-lg">确认删除？</h3>
                            <p className="text-sm text-gray-500 mt-1">
                                确定要删除 <span className="font-bold text-gray-700">{deletingPerson.name}</span> 吗？删除后将无法查看其活动轨迹。
                            </p>
                        </div>
                        <div className="flex gap-3 pt-2">
                            <button 
                                onClick={() => setDeletingPerson(null)}
                                className="flex-1 py-2.5 rounded-xl font-bold text-gray-500 bg-gray-50 active:scale-95 transition-transform"
                            >
                                取消
                            </button>
                            <button 
                                onClick={confirmDelete}
                                className="flex-1 py-2.5 rounded-xl font-bold text-white bg-red-500 shadow-lg shadow-red-500/20 active:scale-95 transition-transform"
                            >
                                确认删除
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export const AngelEyeTrackView: React.FC<{onChangeView: (v: ViewState) => void, person?: CaredPerson}> = ({ onChangeView, person }) => {
    const [selectedCapture, setSelectedCapture] = useState<string | null>(null);
    const [viewingLive, setViewingLive] = useState<string | null>(null);

    // Mock Trajectory Data
    const trajectoryData = [
        { date: '2023-12-08', time: '20:00', location: '健身步道', image: 'https://picsum.photos/300/200?random=t1' },
        { date: '2023-12-08', time: '14:45', location: '休闲广场', image: 'https://picsum.photos/300/200?random=t2' },
        { date: '2023-12-08', time: '12:00', location: '康养区', image: 'https://picsum.photos/300/200?random=t3' },
        { date: '2023-12-08', time: '08:30', location: '3号居民楼', image: 'https://picsum.photos/300/200?random=t4' },
        { date: '2023-12-08', time: '02:15', location: '中央花园', image: 'https://picsum.photos/300/200?random=t5' },
    ];

    if (!person) {
        return (
            <div className="min-h-full bg-gray-50 flex flex-col items-center justify-center p-6">
                <p className="text-gray-400">未选择人员</p>
                <button onClick={() => onChangeView(ViewState.SERVICE_ANGEL_EYE)} className="mt-4 text-brand-500">返回列表</button>
            </div>
        );
    }

    return (
    <div className="min-h-full bg-gray-50 flex flex-col">
        <div className="bg-brand-500 text-white p-4 flex items-center shadow-none z-10 relative">
            <button onClick={() => onChangeView(ViewState.SERVICE_ANGEL_EYE)}><ChevronLeft /></button>
            <span className="ml-4 font-bold text-lg">{person.name}的轨迹</span>
        </div>
        
        {/* Info Header */}
        <div className="bg-brand-500 px-6 pb-16 pt-2 text-white rounded-b-[2.5rem] shadow-xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -mr-10 -mt-10 pointer-events-none"></div>
             
             <div className="relative z-10">
                 <div className="flex items-baseline gap-3 mb-3">
                     <h1 className="text-3xl font-bold tracking-tight">{person.name}</h1>
                     <span className="text-lg opacity-90 font-medium">{person.age}岁</span>
                 </div>
                 
                 <div className="flex items-center gap-2 bg-white/20 w-fit px-3 py-1.5 rounded-full backdrop-blur-md border border-white/10">
                     <MapPin size={16} className="text-white" />
                     <span className="text-sm font-medium">当前位置: {person.lastLocation}</span>
                 </div>
             </div>
        </div>

        <div className="flex-1 p-4 overflow-y-auto -mt-10 relative z-20">
             <div className="bg-white rounded-2xl p-6 shadow-md min-h-[60vh]">
                 <h3 className="font-bold text-gray-800 mb-8 flex items-center gap-2 border-b border-gray-100 pb-4">
                    <History size={18} className="text-brand-500"/>
                    近期轨迹记录
                 </h3>
                 
                 <div className="relative pl-6 space-y-8 border-l-2 border-brand-100 ml-2 pb-2">
                     {trajectoryData.map((item, index) => (
                         <div key={index} className="relative">
                             <div className={`absolute -left-[31px] top-1.5 w-4 h-4 rounded-full border-2 border-white shadow-sm z-10 ${index === 0 ? 'bg-brand-500 ring-4 ring-brand-100' : 'bg-gray-300'}`}></div>
                             
                             <div className="flex items-baseline gap-2 mb-1.5">
                                 <span className={`text-xl font-mono font-bold ${index === 0 ? 'text-brand-600' : 'text-gray-800'}`}>{item.time}</span>
                                 <span className="text-xs text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded">{item.date}</span>
                             </div>

                             <div className="flex justify-between items-center mb-3">
                                 <div className="flex items-center gap-1.5 text-sm font-medium text-gray-700">
                                     <MapPin size={14} className={index === 0 ? 'text-brand-500' : 'text-gray-400'} /> 
                                     {item.location}
                                 </div>
                                 <button 
                                    onClick={(e) => { e.stopPropagation(); setViewingLive(item.location); }}
                                    className="flex items-center gap-1 text-[10px] text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100 active:scale-95 transition-transform"
                                >
                                    <Eye size={12} /> 实时监控
                                 </button>
                             </div>
                             
                             <div 
                                className="relative rounded-xl overflow-hidden shadow-sm group cursor-pointer border border-gray-100 hover:shadow-md transition-shadow"
                                onClick={() => setSelectedCapture(item.location)}
                             >
                                 <img src={item.image} className="w-full h-32 object-cover" />
                                 <div className="absolute inset-0 bg-black/5 group-hover:bg-black/20 transition-colors"></div>
                                 <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 flex justify-between items-center">
                                     <span className="text-[10px] text-white/90 font-medium">点击查看历史回放</span>
                                     <div className="w-7 h-7 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30">
                                        <Play size={12} fill="white" className="text-white ml-0.5" />
                                     </div>
                                 </div>
                             </div>
                         </div>
                     ))}
                 </div>
             </div>
        </div>

        <div className="p-4 bg-white border-t sticky bottom-0 z-30 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
             <button className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-red-500/30 flex items-center justify-center gap-2 active:scale-[0.98] transition-transform">
                 <Phone size={20} fill="white" /> 紧急呼叫物业
             </button>
        </div>

        {/* History Capture Modal */}
        {selectedCapture && (
            <div className="fixed inset-0 z-50 bg-black flex flex-col animate-in fade-in duration-300">
                <div className="p-4 flex justify-between items-center text-white bg-black/50 absolute top-0 w-full z-10 backdrop-blur-md">
                    <button onClick={() => setSelectedCapture(null)}><ChevronLeft /></button>
                    <span className="font-bold">{selectedCapture} - 历史回放</span>
                    <div className="w-6"></div>
                </div>
                
                <div className="flex-1 flex items-center justify-center relative">
                    <img src="https://picsum.photos/800/600?random=history" className="w-full h-full object-contain" />
                    <div className="absolute bottom-10 left-0 w-full text-center text-white/50 text-sm">
                        正在播放历史画面...
                    </div>
                </div>
            </div>
        )}

        {/* Live Video Modal */}
        {viewingLive && (
            <div className="fixed inset-0 z-50 bg-black flex flex-col animate-in fade-in duration-300">
                <div className="p-4 flex justify-between items-center text-white bg-black/50 absolute top-0 w-full z-10 backdrop-blur-md">
                    <button onClick={() => setViewingLive(null)}><ChevronLeft /></button>
                    <span className="font-bold">{viewingLive}</span>
                    <div className="flex items-center gap-1 text-red-500 bg-red-500/10 px-2 py-0.5 rounded text-xs font-bold border border-red-500/20">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>
                        LIVE
                    </div>
                </div>
                
                <div className="flex-1 flex items-center justify-center relative bg-gray-900">
                    {/* Mock Live Feed */}
                    <img src={`https://picsum.photos/800/600?random=${viewingLive}`} className="w-full h-full object-contain opacity-90" />
                    
                    {/* Live Controls Overlay */}
                    <div className="absolute top-20 right-4 flex flex-col gap-4">
                        <button className="bg-black/40 p-2 rounded-full text-white backdrop-blur-sm hover:bg-black/60 active:scale-95 transition-all">
                            <Video size={20} />
                        </button>
                        <button className="bg-black/40 p-2 rounded-full text-white backdrop-blur-sm hover:bg-black/60 active:scale-95 transition-all">
                            <Volume2 size={20} />
                        </button>
                    </div>

                    <div className="absolute bottom-10 left-0 w-full text-center text-white/70 text-sm flex flex-col items-center gap-3">
                        <div className="flex items-center gap-2 text-xs font-mono bg-black/40 px-3 py-1 rounded-full backdrop-blur-md">
                            <Wifi size={12} className="text-green-500"/>
                            信号正常 | 24fps | 1080P
                        </div>
                        <p className="text-xs opacity-50">正在查看实时监控画面</p>
                    </div>
                </div>
            </div>
        )}
    </div>
    );
};
