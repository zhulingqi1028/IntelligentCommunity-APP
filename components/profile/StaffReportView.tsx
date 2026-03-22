
import React, { useState, useRef } from 'react';
import { ChevronLeft, MapPin, Clock, Camera, X, AlertCircle, Plus } from 'lucide-react';
import { ViewState } from '../../types';

interface StaffReportViewProps {
    onChangeView: (v: ViewState) => void;
}

export const StaffReportView: React.FC<StaffReportViewProps> = ({ onChangeView }) => {
    const [mode, setMode] = useState<'LIST' | 'FORM' | 'DETAIL'>('LIST');
    const [category, setCategory] = useState('清洁问题');
    const [location, setLocation] = useState('');
    const [description, setDescription] = useState('');
    const [images, setImages] = useState<string[]>([]);
    const [selectedReportId, setSelectedReportId] = useState<number | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [history, setHistory] = useState([
        { id: 1, type: '清洁问题', loc: '3栋大堂', desc: '地面有大片水渍，容易滑倒', time: '10分钟前', status: 'PENDING', images: ['https://picsum.photos/400/300?random=10'], logs: [{time: '10分钟前', text: '提交报事'}] },
        { id: 2, type: '工程维修', loc: '地下车库B区', desc: 'B-021车位上方照明灯闪烁', time: '1小时前', status: 'PROCESSING', images: ['https://picsum.photos/400/300?random=11'], logs: [{time: '1小时前', text: '提交报事'}, {time: '45分钟前', text: '已指派维修工'}] },
        { id: 3, type: '绿化养护', loc: '中心花园', desc: '草坪护栏损坏', time: '昨天 14:00', status: 'COMPLETED', images: ['https://picsum.photos/400/300?random=12'], logs: [{time: '昨天 14:00', text: '提交报事'}, {time: '昨天 15:30', text: '已完成修复'}] },
    ]);

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
        if (!description || !location) {
            alert('请填写完整信息');
            return;
        }
        const newReport = {
            id: Date.now(),
            type: category,
            loc: location,
            desc: description,
            time: '刚刚',
            status: 'PENDING',
            images: images,
            logs: [{time: '刚刚', text: '提交报事'}]
        };
        setHistory([newReport, ...history]);
        alert('报事提交成功！');
        setMode('LIST');
        setDescription('');
        setLocation('');
        setImages([]);
    };

    if (mode === 'DETAIL' && selectedReportId) {
        const report = history.find(r => r.id === selectedReportId);
        if (!report) return null;
        return (
            <div className="min-h-full bg-gray-50 flex flex-col">
                <div className="bg-white p-4 flex items-center border-b sticky top-0 z-10">
                    <button onClick={() => setMode('LIST')}><ChevronLeft /></button>
                    <span className="ml-4 font-bold text-lg">报事详情</span>
                </div>
                <div className="p-4 space-y-4">
                    <div className="bg-white p-5 rounded-xl shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-xs text-gray-400">报事编号: {report.id}</span>
                            <span className={`text-[10px] px-2 py-1 rounded ${
                                report.status === 'PENDING' ? 'bg-orange-50 text-orange-600' :
                                report.status === 'PROCESSING' ? 'bg-blue-50 text-blue-600' :
                                'bg-green-50 text-green-600'
                            }`}>
                                {report.status === 'PENDING' ? '待处理' : report.status === 'PROCESSING' ? '处理中' : '已完成'}
                            </span>
                        </div>
                        <h3 className="font-bold text-gray-800 mb-2">{report.type}</h3>
                        <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
                            <MapPin size={12} /> {report.loc}
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed mb-4">{report.desc}</p>
                        {report.images && report.images.length > 0 && (
                            <div className="grid grid-cols-2 gap-2 mt-3">
                                {report.images.map((img, idx) => (
                                    <img key={idx} src={img} className="w-full h-32 object-cover rounded-lg bg-gray-50 border border-gray-100" />
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="bg-white p-5 rounded-xl shadow-sm">
                        <h3 className="text-sm font-bold text-gray-800 mb-6 flex items-center gap-2">
                            <Clock size={16} className="text-brand-500"/> 处理进度
                        </h3>
                        <div className="relative pl-6 border-l-2 border-gray-100 ml-2 space-y-8">
                            {report.logs.map((log, idx) => (
                                <div key={idx} className="relative">
                                    <div className={`absolute -left-[33px] top-1 w-4 h-4 rounded-full border-2 border-white shadow-sm ${idx === 0 ? 'bg-brand-500 ring-4 ring-brand-100' : 'bg-gray-300'}`}></div>
                                    <div className="flex flex-col">
                                        <span className={`text-sm font-bold ${idx === 0 ? 'text-gray-800' : 'text-gray-500'}`}>{log.text}</span>
                                        <span className="text-xs text-gray-400 mt-1">{log.time}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (mode === 'FORM') {
        return (
            <div className="min-h-full bg-gray-50 flex flex-col">
                <div className="bg-white p-4 flex items-center border-b sticky top-0 z-10">
                    <button onClick={() => setMode('LIST')}><ChevronLeft /></button>
                    <span className="ml-4 font-bold text-lg">内部报事</span>
                </div>
                <div className="p-4 space-y-4">
                    <div className="bg-white rounded-xl p-4 shadow-sm">
                        <h3 className="text-sm font-bold text-gray-800 mb-3">问题分类</h3>
                        <div className="grid grid-cols-3 gap-3">
                            {['清洁问题', '工程维修', '秩序安全', '绿化养护', '其他问题'].map(c => (
                                <button 
                                    key={c}
                                    onClick={() => setCategory(c)}
                                    className={`py-2 text-xs rounded-lg border transition-colors ${category === c ? 'bg-purple-50 border-purple-500 text-purple-600 font-bold' : 'border-gray-100 text-gray-600'}`}
                                >
                                    {c}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-sm space-y-4">
                        <div>
                            <label className="text-xs font-bold text-gray-600 mb-1 block">具体位置</label>
                            <div className="flex items-center bg-gray-50 rounded-lg px-3 py-2">
                                 <MapPin size={16} className="text-gray-400 mr-2"/>
                                 <input 
                                    className="bg-transparent flex-1 outline-none text-sm" 
                                    placeholder="例如：3栋大堂、南门岗亭" 
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                 />
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-600 mb-1 block">问题描述</label>
                            <textarea 
                                className="w-full bg-gray-50 rounded-lg p-3 text-sm h-24 outline-none" 
                                placeholder="请详细描述发现的问题..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            ></textarea>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-600 mb-2 block">现场照片</label>
                            <div className="grid grid-cols-4 gap-2">
                                {images.map((img, idx) => (
                                    <div key={idx} className="aspect-square relative rounded-lg overflow-hidden bg-gray-100 border border-gray-100">
                                        <img src={img} className="w-full h-full object-cover" />
                                        <button 
                                            onClick={() => removeImage(idx)}
                                            className="absolute top-0 right-0 bg-black/50 text-white p-1 rounded-bl-lg"
                                        >
                                            <X size={12}/>
                                        </button>
                                    </div>
                                ))}
                                {images.length < 4 && (
                                    <div 
                                        onClick={() => fileInputRef.current?.click()}
                                        className="aspect-square bg-gray-50 rounded-lg flex flex-col items-center justify-center border-2 border-dashed border-gray-200 text-gray-400 cursor-pointer"
                                    >
                                        <Camera size={20} />
                                        <span className="text-[10px] mt-1">添加</span>
                                    </div>
                                )}
                            </div>
                            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageSelect} />
                        </div>
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-orange-50 rounded-lg text-orange-600 text-xs">
                        <AlertCircle size={16} />
                        <span>紧急情况请直接拨打指挥中心电话</span>
                    </div>
                    <button 
                        onClick={handleSubmit}
                        className="w-full bg-brand-500 text-white py-3 rounded-xl font-bold shadow-lg shadow-brand-500/30"
                    >
                        立即提交
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-full bg-gray-50 flex flex-col relative">
            <div className="bg-white p-4 flex items-center border-b sticky top-0 z-10">
                <button onClick={() => onChangeView(ViewState.PROFILE)}><ChevronLeft /></button>
                <span className="ml-4 font-bold text-lg">物业报事</span>
            </div>
            <div className="p-4 pb-24 space-y-4">
                {history.map(item => (
                    <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-2">
                                <span className="font-bold text-gray-800 text-sm">{item.type}</span>
                                <span className="text-xs text-gray-400">|</span>
                                <span className="text-xs text-gray-500">{item.loc}</span>
                            </div>
                            <span className={`text-[10px] px-2 py-1 rounded ${
                                item.status === 'PENDING' ? 'bg-orange-50 text-orange-600' :
                                item.status === 'PROCESSING' ? 'bg-blue-50 text-blue-600' :
                                'bg-green-50 text-green-600'
                            }`}>
                                {item.status === 'PENDING' ? '待处理' : item.status === 'PROCESSING' ? '处理中' : '已完成'}
                            </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{item.desc}</p>
                        {item.images && item.images.length > 0 && (
                            <div className="flex gap-2 mb-3 overflow-x-auto no-scrollbar">
                                {item.images.map((img, idx) => (
                                    <img key={idx} src={img} className="w-16 h-16 rounded-lg object-cover bg-gray-100 flex-shrink-0" />
                                ))}
                            </div>
                        )}
                        <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                            <span className="text-xs text-gray-400">{item.time}</span>
                            <button 
                                onClick={() => { setSelectedReportId(item.id); setMode('DETAIL'); }}
                                className="text-xs font-bold text-gray-500 border border-gray-200 px-3 py-1.5 rounded-full active:bg-gray-50 transition-colors"
                            >
                                查看进度
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            <button 
                onClick={() => setMode('FORM')}
                className="fixed bottom-6 right-6 w-14 h-14 bg-brand-500 text-white rounded-full shadow-xl shadow-brand-500/40 flex items-center justify-center active:scale-90 transition-transform z-20"
            >
                <Plus size={28} />
            </button>
        </div>
    );
};
