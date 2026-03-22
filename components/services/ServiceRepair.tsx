
import React, { useState, useRef } from 'react';
import { ViewState, RepairItem } from '../../types';
import { MOCK_REPAIRS, MOCK_USER } from '../../constants';
import { ChevronLeft, Plus, MapPin, Camera, X, Clock, Phone, CalendarClock, ChevronRight, AlertCircle, Wrench } from 'lucide-react';

type ViewMode = 'LIST' | 'FORM' | 'DETAIL';

export const ServiceRepairView = ({ onChangeView }: { onChangeView: (v: ViewState) => void }) => {
    const [mode, setMode] = useState<ViewMode>('LIST');
    const [repairs, setRepairs] = useState<RepairItem[]>(MOCK_REPAIRS);
    const [selectedRepairId, setSelectedRepairId] = useState<string | null>(null);

    // Form State
    const [repairType, setRepairType] = useState<'PRIVATE' | 'PUBLIC'>('PRIVATE');
    const [category, setCategory] = useState('水电维修');
    const [location, setLocation] = useState(MOCK_USER.unit);
    const [description, setDescription] = useState('');
    const [contactName, setContactName] = useState(MOCK_USER.name);
    const [contactPhone, setContactPhone] = useState(MOCK_USER.phone);
    const [preferredTime, setPreferredTime] = useState('');
    const [images, setImages] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const categories = ['水电维修', '门窗家具', '墙面地面', '家电维修', '管道疏通', '其他问题'];

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                if (reader.result) setImages([...images, reader.result as string]);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = (index: number) => {
        setImages(images.filter((_, i) => i !== index));
    };

    const handleSubmit = () => {
        if (!description) {
            alert('请填写问题描述');
            return;
        }

        const newRepair: RepairItem = {
            id: `r_${Date.now()}`,
            title: category,
            status: 'PENDING',
            date: new Date().toISOString().split('T')[0],
            description: description,
            image: images[0],
            logs: [{ time: new Date().toLocaleString(), text: '用户提交报修' }]
        };

        setRepairs([newRepair, ...repairs]);
        alert('报修提交成功！物业将尽快为您处理。');
        
        // Reset and switch back
        setDescription('');
        setImages([]);
        setMode('LIST');
    };

    // --- RENDER: FORM VIEW (Redesigned) ---
    if (mode === 'FORM') {
        return (
            <div className="min-h-full bg-gray-50 flex flex-col">
                <div className="bg-white p-4 flex items-center border-b sticky top-0 z-10">
                    <button onClick={() => setMode('LIST')}><ChevronLeft /></button>
                    <span className="ml-4 font-bold text-lg">新建报修</span>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {/* Main Form Card */}
                    <div className="bg-white rounded-xl p-5 shadow-sm">
                        <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <Wrench size={16} className="text-purple-500"/> 报修信息
                        </h3>

                        {/* Repair Type Toggle */}
                        <div className="bg-gray-100 p-1 rounded-lg flex mb-5">
                            <button 
                                onClick={() => {
                                    setRepairType('PRIVATE');
                                    setLocation(MOCK_USER.unit);
                                }}
                                className={`flex-1 py-2 text-xs font-bold rounded-md transition-all ${repairType === 'PRIVATE' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-500'}`}
                            >
                                居家报修
                            </button>
                            <button 
                                onClick={() => {
                                    setRepairType('PUBLIC');
                                    setLocation('');
                                }}
                                className={`flex-1 py-2 text-xs font-bold rounded-md transition-all ${repairType === 'PUBLIC' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-500'}`}
                            >
                                公共区域
                            </button>
                        </div>

                        {/* Category Grid */}
                        <div className="mb-5">
                            <label className="text-xs font-bold text-gray-600 mb-2 block">故障类型</label>
                            <div className="grid grid-cols-3 gap-3">
                                {categories.map(c => (
                                    <button 
                                        key={c}
                                        onClick={() => setCategory(c)}
                                        className={`py-2.5 text-xs rounded-lg border transition-colors ${category === c ? 'bg-purple-50 border-purple-500 text-purple-600 font-bold' : 'border-gray-100 text-gray-600'}`}
                                    >
                                        {c}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Location Input */}
                        <div className="mb-5">
                            <label className="text-xs font-bold text-gray-600 mb-2 block">具体位置</label>
                            <div className="flex items-center bg-gray-50 rounded-lg px-3 py-3 border border-transparent focus-within:border-purple-200 transition-colors">
                                <MapPin size={16} className="text-gray-400 mr-2 shrink-0"/>
                                <input 
                                    className="bg-transparent flex-1 outline-none text-sm text-gray-800 placeholder:text-gray-400" 
                                    placeholder={repairType === 'PRIVATE' ? "例如: 厨房、主卧卫生间" : "例如: 3栋大堂、南门岗亭"}
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Description Input */}
                        <div className="mb-5">
                            <label className="text-xs font-bold text-gray-600 mb-2 block">问题描述</label>
                            <textarea 
                                className="w-full bg-gray-50 rounded-lg p-3 text-sm h-32 outline-none resize-none border border-transparent focus:border-purple-200 transition-colors placeholder:text-gray-400"
                                placeholder="请详细描述故障情况，以便师傅快速处理..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>

                        {/* Photo Upload */}
                        <div>
                            <label className="text-xs font-bold text-gray-600 mb-2 block">现场照片</label>
                            <div className="grid grid-cols-4 gap-2">
                                {images.map((img, idx) => (
                                    <div key={idx} className="aspect-square relative rounded-lg overflow-hidden bg-gray-100 border border-gray-100">
                                        <img src={img} className="w-full h-full object-cover" />
                                        <button 
                                            onClick={() => removeImage(idx)}
                                            className="absolute top-0 right-0 bg-black/50 text-white p-1 rounded-bl-lg active:bg-red-500 transition-colors"
                                        >
                                            <X size={12}/>
                                        </button>
                                    </div>
                                ))}
                                {images.length < 4 && (
                                    <div 
                                        onClick={() => fileInputRef.current?.click()}
                                        className="aspect-square bg-gray-50 rounded-lg flex flex-col items-center justify-center border-2 border-dashed border-gray-200 text-gray-400 cursor-pointer hover:border-purple-300 hover:text-purple-500 transition-all"
                                    >
                                        <Camera size={24} />
                                        <span className="text-[10px] mt-1 font-medium">上传</span>
                                    </div>
                                )}
                            </div>
                            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageSelect} />
                        </div>
                    </div>

                    {/* Contact Info Card */}
                    <div className="bg-white rounded-xl p-5 shadow-sm">
                        <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <Phone size={16} className="text-purple-500"/> 联系方式
                        </h3>
                        
                        <div className="space-y-4">
                            <div className="flex gap-3">
                                <div className="flex-1">
                                    <label className="text-xs text-gray-400 mb-1 block">联系人</label>
                                    <input 
                                        value={contactName} 
                                        onChange={(e) => setContactName(e.target.value)}
                                        className="w-full bg-gray-50 p-2.5 rounded-lg text-sm font-bold text-gray-800 outline-none" 
                                    />
                                </div>
                                <div className="flex-[1.5]">
                                    <label className="text-xs text-gray-400 mb-1 block">联系电话</label>
                                    <input 
                                        value={contactPhone} 
                                        onChange={(e) => setContactPhone(e.target.value)}
                                        className="w-full bg-gray-50 p-2.5 rounded-lg text-sm font-bold text-gray-800 outline-none" 
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs text-gray-400 mb-1 block">期望上门时间</label>
                                <div className="relative">
                                    <select 
                                        className="w-full bg-gray-50 p-2.5 rounded-lg text-sm font-bold text-gray-800 outline-none appearance-none"
                                        value={preferredTime}
                                        onChange={(e) => setPreferredTime(e.target.value)}
                                    >
                                        <option value="">尽快上门</option>
                                        <option value="weekday">工作日 (9:00-18:00)</option>
                                        <option value="weekend">周末 (9:00-18:00)</option>
                                        <option value="night">晚间 (18:00-21:00)</option>
                                    </select>
                                    <CalendarClock size={16} className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-start gap-2 p-3 bg-purple-50 rounded-lg text-purple-600 text-xs">
                        <AlertCircle size={16} className="shrink-0 mt-0.5" />
                        <span>温馨提示：报修提交后，运维人员将在30分钟内响应。紧急情况请直接拨打24小时物业电话。</span>
                    </div>
                </div>

                <div className="p-4 bg-white border-t sticky bottom-0 z-20">
                    <button 
                        onClick={handleSubmit}
                        className="w-full bg-purple-600 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-purple-600/30 active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
                    >
                        提交报修单
                    </button>
                </div>
            </div>
        );
    }

    // --- RENDER: DETAIL VIEW ---
    if (mode === 'DETAIL' && selectedRepairId) {
        const repair = repairs.find(r => r.id === selectedRepairId);
        if (!repair) return null;

        return (
            <div className="min-h-full bg-gray-50 flex flex-col">
                <div className="bg-white p-4 flex items-center border-b sticky top-0 z-10">
                    <button onClick={() => { setMode('LIST'); setSelectedRepairId(null); }}><ChevronLeft /></button>
                    <span className="ml-4 font-bold text-lg">报修进度</span>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {/* Status Card */}
                    <div className="bg-white rounded-xl p-5 shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-xs text-gray-400">报修单号: {repair.id}</span>
                            <span className={`text-xs px-2 py-0.5 rounded font-bold ${
                                repair.status === 'PENDING' ? 'bg-orange-50 text-orange-600' : 
                                repair.status === 'PROCESSING' ? 'bg-blue-50 text-blue-600' : 
                                'bg-green-50 text-green-600'
                            }`}>
                                {repair.status === 'PENDING' ? '待处理' : repair.status === 'PROCESSING' ? '维修中' : '已完成'}
                            </span>
                        </div>
                        <h3 className="text-lg font-bold text-gray-800 mb-2">{repair.title}</h3>
                        <p className="text-sm text-gray-600 leading-relaxed mb-4">{repair.description}</p>
                        
                        {repair.image && (
                            <img src={repair.image} className="w-full h-48 object-cover rounded-xl bg-gray-50 border border-gray-100" />
                        )}
                    </div>

                    {/* Timeline Card */}
                    <div className="bg-white rounded-xl p-5 shadow-sm">
                        <h3 className="text-sm font-bold text-gray-800 mb-6 flex items-center gap-2">
                            <Clock size={16} className="text-purple-500"/> 处理进度
                        </h3>
                        
                        <div className="relative pl-6 border-l-2 border-gray-100 ml-2 space-y-8">
                            {repair.logs?.map((log, idx) => (
                                <div key={idx} className="relative">
                                    {/* Dot */}
                                    <div className={`absolute -left-[33px] top-1 w-4 h-4 rounded-full border-2 border-white shadow-sm ${idx === 0 ? 'bg-purple-500 ring-4 ring-purple-100' : 'bg-gray-300'}`}></div>
                                    
                                    <div className="flex flex-col">
                                        <span className={`text-sm font-bold ${idx === 0 ? 'text-gray-800' : 'text-gray-500'}`}>{log.text}</span>
                                        <span className="text-xs text-gray-400 mt-1">{log.time}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Contact Support */}
                    <div className="bg-white rounded-xl p-4 shadow-sm flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                                <Phone size={20} />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-gray-800">联系物业客服</p>
                                <p className="text-[10px] text-gray-400">24小时在线为您服务</p>
                            </div>
                        </div>
                        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg text-xs font-bold">立即拨打</button>
                    </div>
                </div>
            </div>
        );
    }

    // --- RENDER: LIST VIEW ---
    return (
        <div className="min-h-full bg-gray-50 flex flex-col relative">
            <div className="bg-white p-4 flex items-center border-b sticky top-0 z-10">
                <button onClick={() => onChangeView(ViewState.SERVICES)}><ChevronLeft /></button>
                <span className="ml-4 font-bold text-lg">业主报修</span>
            </div>
            
            <div className="p-4 pb-24 space-y-4">
                 {repairs.map(item => (
                     <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                         <div className="flex justify-between items-start mb-2">
                             <div className="flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${item.status === 'PENDING' ? 'bg-orange-500' : item.status === 'PROCESSING' ? 'bg-blue-500' : 'bg-green-500'}`}></span>
                                <h4 className="font-bold text-gray-800">{item.title}</h4>
                             </div>
                             <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                                 item.status === 'PENDING' ? 'bg-orange-50 text-orange-600' : 
                                 item.status === 'PROCESSING' ? 'bg-blue-50 text-blue-600' : 
                                 'bg-green-50 text-green-600'
                             }`}>
                                 {item.status === 'PENDING' ? '待处理' : item.status === 'PROCESSING' ? '维修中' : '已完成'}
                             </span>
                         </div>
                         <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.description}</p>
                         
                         {item.image && (
                             <div className="mb-3">
                                 <img src={item.image} className="w-16 h-16 rounded-lg object-cover bg-gray-100" />
                             </div>
                         )}

                         <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                             <span className="text-xs text-gray-400 flex items-center gap-1">
                                 <Clock size={12} /> {item.date}
                             </span>
                             <button 
                                onClick={() => { setSelectedRepairId(item.id); setMode('DETAIL'); }}
                                className="text-xs font-bold text-gray-500 border border-gray-200 px-3 py-1.5 rounded-full active:bg-gray-50 transition-colors"
                             >
                                查看进度
                             </button>
                         </div>
                     </div>
                 ))}
                 
                 {repairs.length === 0 && (
                     <div className="text-center py-10 text-gray-400">
                         <Wrench className="mx-auto mb-2 opacity-20" size={48} />
                         <p className="text-sm">暂无报修记录</p>
                     </div>
                 )}
            </div>

            {/* Floating Action Button */}
            <button 
                onClick={() => setMode('FORM')}
                className="fixed bottom-6 right-6 w-14 h-14 bg-purple-600 text-white rounded-full shadow-xl shadow-purple-600/40 flex items-center justify-center active:scale-90 transition-transform z-20"
            >
                <Plus size={28} />
            </button>
        </div>
    );
};
