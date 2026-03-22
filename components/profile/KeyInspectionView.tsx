
import React, { useState } from 'react';
import { ChevronLeft, Camera, MapPin, X, Maximize2 } from 'lucide-react';
import { ViewState, CameraItem } from '../../types';
import { MOCK_CAMERAS } from '../../constants';

interface KeyInspectionViewProps {
    onChangeView: (v: ViewState) => void;
}

export const KeyInspectionView: React.FC<KeyInspectionViewProps> = ({ onChangeView }) => {
    const [selectedArea, setSelectedArea] = useState('全部');
    const [zoomedCamera, setZoomedCamera] = useState<CameraItem | null>(null);
    
    // Extract unique areas from cameras
    const areas = ['全部', ...Array.from(new Set(MOCK_CAMERAS.map(c => c.area))).filter(Boolean)];

    const filteredCameras = selectedArea === '全部' 
        ? MOCK_CAMERAS 
        : MOCK_CAMERAS.filter(c => c.area === selectedArea);

    return (
        <div className="h-full bg-gray-50 flex flex-col">
            <div className="bg-brand-500 text-white p-4 sticky top-0 z-10 shrink-0">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <button onClick={() => onChangeView(ViewState.PROFILE)}><ChevronLeft /></button>
                        <span className="ml-4 font-bold text-lg">重点稽查</span>
                    </div>
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar Areas */}
                <div className="w-24 bg-gray-100 border-r border-gray-200 overflow-y-auto">
                    {areas.map(area => (
                        <button 
                            key={area}
                            onClick={() => setSelectedArea(area)}
                            className={`w-full p-4 text-xs font-medium text-left transition-colors border-l-4 ${
                                selectedArea === area 
                                ? 'bg-white text-brand-500 border-brand-500' 
                                : 'text-gray-500 border-transparent hover:bg-gray-50'
                            }`}
                        >
                            {area}
                        </button>
                    ))}
                </div>

                {/* Main Content */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    <div className="flex justify-between items-center mb-2">
                         <span className="text-xs text-gray-500 font-medium">区域: {selectedArea}</span>
                         <span className="text-xs text-gray-400">共 {filteredCameras.length} 个设备</span>
                    </div>

                    {filteredCameras.map(cam => (
                        <div key={cam.id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
                            <div className="relative h-32 bg-black group cursor-pointer" onClick={() => setZoomedCamera(cam)}>
                                <img src={cam.image} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition" />
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                                    <Maximize2 className="text-white w-8 h-8" />
                                </div>
                                <div className="absolute top-2 left-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded flex items-center gap-1">
                                    <div className={`w-2 h-2 rounded-full ${cam.status === 'ONLINE' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                                    {cam.status === 'ONLINE' ? '在线' : '离线'}
                                </div>
                                <div className="absolute bottom-2 right-2 bg-black/60 text-white p-1.5 rounded-full active:bg-brand-500 transition-colors cursor-pointer" onClick={() => alert('抓拍成功！已保存到相册')}>
                                    <Camera size={14} />
                                </div>
                            </div>
                            <div className="p-3">
                                <div className="flex justify-between items-start mb-1">
                                    <h4 className="font-bold text-gray-800 text-sm truncate">{cam.name}</h4>
                                </div>
                                <div className="flex items-center gap-1 text-[10px] text-gray-400">
                                    <MapPin size={10} /> {cam.area}
                                </div>
                            </div>
                        </div>
                    ))}
                    
                    {filteredCameras.length === 0 && (
                        <div className="text-center py-10 text-gray-400 text-xs">
                            该区域暂无监控设备
                        </div>
                    )}
                </div>
            </div>

            {/* Zoomed Camera Modal */}
            {zoomedCamera && (
                <div className="fixed inset-0 bg-black z-[100] flex flex-col animate-in fade-in duration-300">
                    <div className="p-4 flex items-center justify-between text-white bg-black/40 backdrop-blur-md absolute top-0 left-0 right-0 z-10">
                        <div className="flex items-center gap-3">
                            <button onClick={() => setZoomedCamera(null)} className="p-1">
                                <ChevronLeft size={24} />
                            </button>
                            <div>
                                <h3 className="font-bold text-base">{zoomedCamera.name}</h3>
                                <p className="text-[10px] opacity-70 flex items-center gap-1">
                                    <MapPin size={10} /> {zoomedCamera.area}
                                </p>
                            </div>
                        </div>
                        <button onClick={() => setZoomedCamera(null)} className="p-2 bg-white/10 rounded-full">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="flex-1 flex items-center justify-center p-4">
                        <div className="relative w-full aspect-video bg-gray-900 rounded-lg overflow-hidden shadow-2xl">
                            <img src={zoomedCamera.image} className="w-full h-full object-contain" />
                            
                            {/* Overlay Controls */}
                            <div className="absolute bottom-4 right-4 flex gap-3">
                                <button 
                                    onClick={() => alert('抓拍成功！已保存到相册')}
                                    className="bg-brand-500 text-white p-3 rounded-full shadow-lg active:scale-90 transition-transform"
                                >
                                    <Camera size={20} />
                                </button>
                            </div>

                            <div className="absolute top-4 left-4 bg-black/60 text-white text-xs px-3 py-1 rounded-full flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${zoomedCamera.status === 'ONLINE' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                                {zoomedCamera.status === 'ONLINE' ? '实时监控中' : '设备离线'}
                            </div>
                        </div>
                    </div>

                    <div className="p-6 bg-black/40 backdrop-blur-md text-white/60 text-center text-xs">
                        双指捏合或点击返回退出全屏查看
                    </div>
                </div>
            )}
        </div>
    );
};
