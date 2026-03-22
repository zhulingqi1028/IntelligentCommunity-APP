
import React, { useState, useRef, useEffect } from 'react';
import { ViewState, User, UserRole, WorkOrder, CameraItem, HouseInfo, WorkOrderLog, ParkingSpot, Message, LightingZone } from '../types';
import { Settings, ChevronRight, ThumbsUp, FileText, Home, Shield, LogOut, ChevronLeft, Trash2, Edit, Camera, ClipboardList, CheckCircle, Lock, Smartphone, MessageSquare, Info, Heart, MessageCircle, Eye, CreditCard, Car, UserPlus, Unlock, FilePlus, MapPin, Clock, AlertCircle, History, Send, Power, Check, QrCode, Share2, Zap, Plus, X, Lightbulb, ToggleRight, ToggleLeft, CalendarClock, CheckSquare, Square, Phone, Upload, Circle, AlertTriangle, Bell, Search, Calendar, Filter, Tag, ArrowUpDown } from 'lucide-react';
import { MOCK_HOUSE_MEMBERS, MOCK_WORK_ORDERS, MOCK_NEWS, MOCK_POSTS, MOCK_COMMENTS, MOCK_FEEDBACKS, MOCK_CAMERAS, MOCK_PARKING_SPOTS, MOCK_VEHICLES, MOCK_HOUSES, MOCK_LIGHTING_ZONES, MOCK_USER } from '../constants';
import { PersonalInfoView } from './profile/PersonalInfoView';
import { KeyInspectionView } from './profile/KeyInspectionView';

interface ProfileProps {
  user: User;
  onLogout: () => void;
  onUpdateUser?: (user: User) => void;
  currentView?: ViewState;
  onChangeView?: (view: ViewState) => void;
  messages?: Message[];
}

const ROLE_MAP: Record<UserRole, string> = {
    [UserRole.OWNER]: '业主',
    [UserRole.TENANT]: '租户',
    [UserRole.PROPERTY_STAFF]: '物业人员',
    [UserRole.OPS_STAFF]: '运营人员',
    [UserRole.SUPER_ADMIN]: '超级管理员'
};

// --- COMPONENT: Post Detail View (Reusable) ---
const PostDetailView = ({ postId, onBack }: { postId: string, onBack: () => void }) => {
    const post = MOCK_POSTS.find(p => p.id === postId);
    if (!post) return null;

    return (
        <div className="min-h-full bg-white flex flex-col pb-20 animate-in slide-in-from-right duration-300">
            <div className="sticky top-0 bg-white z-10 border-b p-4 flex justify-between items-center">
                <button onClick={onBack} className="p-1 -ml-2">
                    <ChevronLeft className="text-gray-700" />
                </button>
                <span className="font-bold">帖子详情</span>
                <div className="w-6"></div>
            </div>
            
            <div className="flex-1 overflow-y-auto">
                 <div className="p-4">
                    <div className="flex gap-3 mb-3">
                        <img src={post.avatar} className="w-10 h-10 rounded-full" />
                        <div>
                            <h4 className="font-bold text-sm text-gray-800">{post.author}</h4>
                            <p className="text-xs text-gray-400">{post.time}</p>
                        </div>
                    </div>

                    <p className="text-base text-gray-800 mb-4 leading-relaxed whitespace-pre-wrap">{post.content} <span className="text-brand-500">{post.tag}</span></p>

                    {post.video && (
                        <div className="mb-4 rounded-xl overflow-hidden bg-black">
                            <video src={post.video} controls className="w-full max-h-96 object-contain" />
                        </div>
                    )}

                    {post.images && (
                        <div className="grid grid-cols-2 gap-2 mb-4">
                            {post.images.map((img, idx) => (
                                <img key={idx} src={img} className="rounded-lg w-full object-cover" />
                            ))}
                        </div>
                    )}

                    <div className="flex justify-between items-center py-3 border-t border-b border-gray-50 mb-4">
                        <button className={`flex-1 flex items-center justify-center gap-2 text-sm ${post.isLiked ? 'text-red-500' : 'text-gray-500'}`}>
                            <Heart size={20} className={post.isLiked ? "fill-red-500" : ""} />
                            {post.likes > 0 ? post.likes : '点赞'}
                        </button>
                        <button className="flex-1 flex items-center justify-center gap-2 text-gray-500 text-sm border-l border-r border-gray-100">
                            <MessageSquare size={20} />
                            {post.comments > 0 ? post.comments : '评论'}
                        </button>
                        <button className="flex-1 flex items-center justify-center gap-2 text-gray-500 text-sm">
                            <Share2 size={20} />
                            分享
                        </button>
                    </div>
                 </div>

                 <div className="p-4 pt-0">
                    <h3 className="font-bold text-sm text-gray-700 mb-4">全部评论</h3>
                    <div className="space-y-6">
                        {MOCK_COMMENTS.map(comment => (
                            <div key={comment.id} className="flex gap-3">
                                <img src={comment.avatar || `https://ui-avatars.com/api/?name=${comment.author}&background=random`} className="w-8 h-8 rounded-full" />
                                <div className="flex-1">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-bold text-gray-700">{comment.author}</span>
                                        <div className="flex items-center gap-1 text-xs text-gray-400">
                                            <ThumbsUp size={12} /> {comment.likes}
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-800 mt-1">{comment.content}</p>
                                    <div className="mt-2 flex items-center gap-4 text-xs text-gray-400">
                                        <span>{comment.time}</span>
                                        <button className="text-gray-500 font-medium">回复</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                 </div>
            </div>
        </div>
    );
};

// --- COMPONENT: My Dynamics ---
const MyDynamicsView = ({ onChangeView }: { onChangeView: (v: ViewState) => void }) => {
    const [tab, setTab] = useState('笔记');
    const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

    if (selectedPostId) {
        return <PostDetailView postId={selectedPostId} onBack={() => setSelectedPostId(null)} />;
    }

    return (
        <div className="min-h-full bg-gray-50 flex flex-col">
            <div className="bg-white p-4 flex items-center border-b sticky top-0 z-10">
                <button onClick={() => onChangeView(ViewState.PROFILE)}><ChevronLeft /></button>
                <span className="ml-4 font-bold text-lg">我的动态</span>
            </div>
            <div className="bg-white px-4 border-b border-gray-100 sticky top-[61px] z-10">
                <div className="flex gap-6">
                    {['笔记', '评论过', '赞过'].map(t => (
                        <button 
                            key={t}
                            onClick={() => setTab(t)}
                            className={`py-3 text-sm font-medium transition-colors ${tab === t ? 'text-brand-500 border-b-2 border-brand-500' : 'text-gray-500'}`}
                        >
                            {t}
                        </button>
                    ))}
                </div>
            </div>
            <div className="p-4 space-y-4">
                {tab === '笔记' && MOCK_POSTS.map(post => (
                    <div key={post.id} onClick={() => setSelectedPostId(post.id)} className="bg-white rounded-xl p-4 shadow-sm active:bg-gray-50 transition-colors cursor-pointer">
                        <div className="flex gap-3 mb-3">
                            <img src={post.avatar} className="w-10 h-10 rounded-full bg-gray-100" />
                            <div>
                                <h4 className="font-bold text-sm text-gray-800">{post.author}</h4>
                                <p className="text-xs text-gray-400">{post.time}</p>
                            </div>
                        </div>
                        <p className="text-sm text-gray-700 mb-3 line-clamp-3">{post.content} <span className="text-brand-500">{post.tag}</span></p>
                        {post.images && post.images.length > 0 && (
                            <div className="grid grid-cols-3 gap-2 mb-3">
                                {post.images.slice(0, 3).map((img, i) => (
                                    <img key={i} src={img} className="w-full aspect-square object-cover rounded-lg" />
                                ))}
                            </div>
                        )}
                        <div className="flex gap-4 pt-3 border-t border-gray-50">
                            <div className="flex items-center gap-1 text-xs text-gray-400">
                                <Heart size={14} className={post.isLiked ? "fill-red-500 text-red-500" : ""} />
                                {post.likes}
                            </div>
                            <div className="flex items-center gap-1 text-xs text-gray-400">
                                <MessageSquare size={14} />
                                {post.comments}
                            </div>
                        </div>
                    </div>
                ))}

                {tab === '评论过' && MOCK_COMMENTS.map(comment => (
                    <div key={comment.id} onClick={() => setSelectedPostId('p1')} className="bg-white p-4 rounded-xl shadow-sm active:bg-gray-50 transition-colors cursor-pointer">
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-xs font-bold text-brand-500 bg-brand-50 px-2 py-0.5 rounded">我的评论</span>
                            <span className="text-[10px] text-gray-400">{comment.time}</span>
                        </div>
                        <p className="text-sm text-gray-800 mb-3">{comment.content}</p>
                        <div className="bg-gray-50 p-3 rounded-lg flex gap-3 items-center">
                            <img src={MOCK_POSTS[0].avatar} className="w-10 h-10 rounded object-cover" />
                            <div className="flex-1 min-w-0">
                                <p className="text-xs text-gray-500 truncate">原帖：{MOCK_POSTS[0].content}</p>
                            </div>
                        </div>
                    </div>
                ))}

                {tab === '赞过' && MOCK_POSTS.filter(p => p.isLiked || p.id === 'p2').map(post => (
                    <div key={post.id} onClick={() => setSelectedPostId(post.id)} className="bg-white rounded-xl p-4 shadow-sm active:bg-gray-50 transition-colors cursor-pointer">
                        <div className="flex gap-3 mb-3">
                            <img src={post.avatar} className="w-10 h-10 rounded-full bg-gray-100" />
                            <div>
                                <h4 className="font-bold text-sm text-gray-800">{post.author}</h4>
                                <p className="text-xs text-gray-400">{post.time}</p>
                            </div>
                        </div>
                        <p className="text-sm text-gray-700 mb-3 line-clamp-3">{post.content}</p>
                        <div className="flex gap-4 pt-3 border-t border-gray-50">
                            <div className="flex items-center gap-1 text-xs text-red-500">
                                <Heart size={14} className="fill-red-500" />
                                {post.likes}
                            </div>
                            <div className="flex items-center gap-1 text-xs text-gray-400">
                                <MessageSquare size={14} />
                                {post.comments}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// --- COMPONENT: My Parking ---
const MyParkingView: React.FC<{onChangeView: (v: ViewState) => void}> = ({ onChangeView }) => {
    const [activeTab, setActiveTab] = useState<'VEHICLES' | 'SPOTS'>('VEHICLES');
    const [vehicles, setVehicles] = useState(MOCK_VEHICLES);
    const [isAddingVehicle, setIsAddingVehicle] = useState(false);
    const [newVehicle, setNewVehicle] = useState<Partial<typeof MOCK_VEHICLES[0]>>({ type: 'FUEL', status: 'OUTSIDE' });

    const [spots, setSpots] = useState(MOCK_PARKING_SPOTS);

    // Renewal State
    const [renewingSpot, setRenewingSpot] = useState<typeof MOCK_PARKING_SPOTS[0] | null>(null);
    const [renewalDuration, setRenewalDuration] = useState(1); // Months
    const [renewalStep, setRenewalStep] = useState<'DURATION' | 'PAYMENT'>('DURATION');
    const [paymentMethod, setPaymentMethod] = useState<'WECHAT' | 'ALIPAY'>('WECHAT');
    
    // Access History State
    const [showingAccessHistoryFor, setShowingAccessHistoryFor] = useState<string | null>(null);
    
    // Payment History State
    const [showingPaymentHistory, setShowingPaymentHistory] = useState(false);
    
    // Binding State
    const [bindingSpot, setBindingSpot] = useState<ParkingSpot | null>(null);
    
    // Deletion State
    const [deletingVehicle, setDeletingVehicle] = useState<typeof MOCK_VEHICLES[0] | null>(null);

    // Helper to check status dynamically
    const getSpotStatus = (expiryDate: string) => {
        const today = new Date();
        const expiry = new Date(expiryDate);
        const diffTime = expiry.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays < 0) return 'OVERDUE';
        if (diffDays <= 30) return 'EXPIRING_SOON';
        return 'NORMAL';
    };

    const handleAddVehicle = () => {
        if (!newVehicle.plate || !newVehicle.brand || !newVehicle.color) {
            alert('请填写完整车辆信息');
            return;
        }
        
        const vehicle = {
            id: `v_${Date.now()}`,
            plate: newVehicle.plate,
            brand: newVehicle.brand,
            color: newVehicle.color,
            type: newVehicle.type as 'FUEL' | 'NEV',
            status: 'OUTSIDE' as const,
            boundSpotId: undefined
        };
        
        setVehicles([...vehicles, vehicle]);
        setIsAddingVehicle(false);
        setNewVehicle({ type: 'FUEL', status: 'OUTSIDE' });
        alert('车辆添加成功！');
    };
    
    const handleBindVehicleToSpot = (spotId: string, plate: string) => {
        setSpots(prev => prev.map(s => {
            if (s.id === spotId) {
                const currentPlates = s.boundPlates || [];
                if (currentPlates.includes(plate)) return s;
                return { ...s, boundPlates: [...currentPlates, plate] };
            }
            return s;
        }));
        setBindingSpot(null);
    };

    const handleUnbindVehicleFromSpot = (spotId: string, plate: string) => {
        if (window.confirm(`确定要解绑车辆 ${plate} 吗？`)) {
            setSpots(prev => prev.map(s => {
                if (s.id === spotId) {
                    return { ...s, boundPlates: (s.boundPlates || []).filter(p => p !== plate) };
                }
                return s;
            }));
        }
    };

    const handleDeleteVehicle = (vehicleId: string) => {
        const vehicle = vehicles.find(v => v.id === vehicleId);
        if (!vehicle) return;

        if (vehicle.status === 'INSIDE') {
            alert('车辆当前在场内，无法删除。请先出场后再操作。');
            return;
        }

        setDeletingVehicle(vehicle);
    };

    const confirmDeleteVehicle = () => {
        if (!deletingVehicle) return;
        
        setVehicles(prev => prev.filter(v => v.id !== deletingVehicle.id));
        // Also unbind from any spots
        setSpots(prev => prev.map(s => ({
            ...s,
            boundPlates: (s.boundPlates || []).filter(p => p !== deletingVehicle.plate)
        })));
        setDeletingVehicle(null);
    };

    const handleProceedToPayment = () => {
        setRenewalStep('PAYMENT');
    };

    const handleConfirmPayment = () => {
        if (!renewingSpot) return;

        // Simple date calculation logic
        const currentExpiry = new Date(renewingSpot.expiryDate);
        // If already expired, start from today? Or extend from expiry? 
        // Usually extend from expiry if not too long ago, but for simplicity let's extend from expiry.
        // If it's way in the past, maybe reset to today + duration. 
        // Let's stick to extending existing date for now.
        const baseDate = getSpotStatus(renewingSpot.expiryDate) === 'OVERDUE' ? new Date() : currentExpiry;
        
        const newExpiry = new Date(baseDate.setMonth(baseDate.getMonth() + renewalDuration));
        const newExpiryStr = newExpiry.toISOString().split('T')[0];

        setSpots(prev => prev.map(s => 
            s.id === renewingSpot.id 
                ? { ...s, expiryDate: newExpiryStr, feeStatus: 'NORMAL' } 
                : s
        ));

        setRenewingSpot(null);
        setRenewalDuration(1);
        setRenewalStep('DURATION');
        alert(`支付成功！已使用${paymentMethod === 'WECHAT' ? '微信' : '支付宝'}支付。有效期已更新。`);
    };

    return (
        <div className="min-h-full bg-gray-50 flex flex-col">
            <div className="bg-white p-4 flex items-center justify-between border-b sticky top-0 z-10">
                <div className="flex items-center">
                    <button onClick={() => onChangeView(ViewState.PROFILE)}><ChevronLeft /></button>
                    <span className="ml-4 font-bold text-lg">我的车位/车辆</span>
                </div>
                <button onClick={() => setShowingPaymentHistory(true)} className="text-sm font-medium text-gray-600 flex items-center gap-1">
                    <History size={16} /> 缴费记录
                </button>
            </div>
            
            {/* Tabs */}
            <div className="bg-white px-4 flex gap-8 border-b border-gray-100">
                <button 
                    onClick={() => setActiveTab('VEHICLES')}
                    className={`py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'VEHICLES' ? 'text-brand-500 border-brand-500' : 'text-gray-500 border-transparent'}`}
                >
                    我的车辆 ({vehicles.length})
                </button>
                <button 
                    onClick={() => setActiveTab('SPOTS')}
                    className={`py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'SPOTS' ? 'text-brand-500 border-brand-500' : 'text-gray-500 border-transparent'}`}
                >
                    我的车位 ({spots.length})
                </button>
            </div>

            <div className="p-4 space-y-4 flex-1 overflow-y-auto">
                {activeTab === 'VEHICLES' && (
                    <>
                        {vehicles.map(vehicle => {
                            const isNev = vehicle.type === 'NEV';
                            return (
                                <div key={vehicle.id} className="bg-white rounded-xl p-5 shadow-sm relative overflow-hidden">
                                    <div className="flex justify-between items-start mb-4 relative z-10">
                                        <div className="flex items-center gap-3">
                                            <div className={`px-2 py-1 rounded border-2 font-mono font-bold text-sm ${isNev ? 'bg-green-50 border-green-500 text-green-700' : 'bg-blue-50 border-blue-600 text-blue-700'}`}>
                                                {vehicle.plate}
                                            </div>
                                            {isNev && <div className="text-[10px] bg-green-100 text-green-600 px-1.5 py-0.5 rounded flex items-center gap-1"><Zap size={10} fill="currentColor"/> 新能源</div>}
                                        </div>
                                        <div className={`text-xs px-2 py-1 rounded-full font-medium ${vehicle.status === 'INSIDE' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                                            {vehicle.status === 'INSIDE' ? '已入场' : '外出中'}
                                        </div>
                                    </div>
                                    
                                    <div className="flex justify-between items-end relative z-10">
                                        <div className="text-sm text-gray-500">
                                            <p>{vehicle.brand} - {vehicle.color}</p>
                                            {spots.find(s => s.boundPlates?.includes(vehicle.plate)) && (
                                                <p className="text-xs text-gray-400 mt-1">
                                                    关联车位: {spots.find(s => s.boundPlates?.includes(vehicle.plate))?.number}
                                                </p>
                                            )}
                                        </div>
                                        <div className="flex gap-2">
                                            <button 
                                                onClick={() => handleDeleteVehicle(vehicle.id)}
                                                disabled={vehicle.status === 'INSIDE'}
                                                className={`text-xs px-3 py-1.5 rounded-lg border transition-colors flex items-center gap-1 ${
                                                    vehicle.status === 'INSIDE' 
                                                        ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' 
                                                        : 'bg-white text-red-500 border-red-200 hover:bg-red-50'
                                                }`}
                                            >
                                                <Trash2 size={14} />
                                                {vehicle.status === 'INSIDE' ? '不可删' : '删除'}
                                            </button>
                                            <button 
                                                onClick={() => setShowingAccessHistoryFor(vehicle.id)}
                                                className="text-xs px-3 py-1.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                                            >
                                                出入记录
                                            </button>
                                        </div>
                                    </div>

                                    {/* Decor */}
                                    <Car className={`absolute -bottom-2 -right-2 w-24 h-24 opacity-5 ${isNev ? 'text-green-500' : 'text-blue-500'}`} />
                                </div>
                            );
                        })}
                        <button 
                            onClick={() => setIsAddingVehicle(true)}
                            className="w-full py-4 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 font-medium flex items-center justify-center gap-2 hover:border-brand-200 hover:text-brand-500 hover:bg-brand-50/50 transition-all"
                        >
                            <Plus size={18} /> 添加新车辆
                        </button>
                        <p className="text-xs text-gray-400 text-center mt-2">请确保添加的车辆行驶证在您名下，以便快速审核。</p>
                    </>
                )}

                {activeTab === 'SPOTS' && (
                    <>
                         {spots.map(spot => {
                            const status = getSpotStatus(spot.expiryDate);
                            const isExpired = status === 'OVERDUE';
                            const isSoon = status === 'EXPIRING_SOON';
                            const isOwned = spot.type === 'OWNED';
                            
                            return (
                                <div key={spot.id} className="bg-white rounded-xl overflow-hidden shadow-sm relative">
                                    <div className={`absolute right-0 top-0 w-24 h-24 rounded-bl-full opacity-10 ${isOwned ? 'bg-orange-500' : 'bg-blue-500'}`}></div>
                                    <div className="absolute right-4 top-4 flex flex-col items-end">
                                        <span className={`text-xs px-2 py-0.5 rounded border ${isOwned ? 'text-orange-600 border-orange-200 bg-orange-50' : 'text-blue-600 border-blue-200 bg-blue-50'}`}>
                                            {isOwned ? '产权车位' : '月租车位'}
                                        </span>
                                    </div>

                                    <div className="p-5">
                                        <div className="mb-4">
                                            <h3 className="text-2xl font-bold text-gray-800 font-mono">{spot.number}</h3>
                                            <p className="text-xs text-gray-500 mt-1">{spot.zone}</p>
                                        </div>

                                        <div className="flex justify-between items-center bg-gray-50 rounded-lg p-3 mb-3 border border-gray-100">
                                            <span className="text-xs text-gray-500">当前状态</span>
                                            <div className="flex items-center gap-2">
                                                {spot.parkedPlate ? (
                                                    <>
                                                        <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                                        <span className="font-mono font-bold text-gray-800">{spot.parkedPlate}</span>
                                                        <span className="text-[10px] bg-gray-200 text-gray-500 px-1 rounded">已占用</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                                        <span className="text-green-600 font-bold">空闲</span>
                                                    </>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-center bg-gray-50 rounded-lg p-3 mb-4 border border-gray-100">
                                            <div>
                                                <p className="text-xs text-gray-400 mb-0.5">{isOwned ? '管理费有效期' : '租赁有效期'}</p>
                                                <p className={`text-sm font-bold ${isSoon || isExpired ? 'text-red-500' : 'text-gray-800'}`}>{spot.expiryDate}</p>
                                            </div>
                                            {(isSoon || isExpired) && (
                                                <button 
                                                    onClick={() => setRenewingSpot(spot)}
                                                    className="bg-brand-500 text-white text-xs px-3 py-1.5 rounded-lg shadow-sm animate-pulse"
                                                >
                                                    立即续费
                                                </button>
                                            )}
                                        </div>
                                        
                                        <div className="mt-4 border-t border-gray-50 pt-3">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-xs font-bold text-gray-500">已绑定车辆</span>
                                                <button 
                                                    onClick={() => setBindingSpot(spot)}
                                                    className="text-xs text-brand-600 font-bold flex items-center gap-1"
                                                >
                                                    <Plus size={14} /> 绑定
                                                </button>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {(spot.boundPlates && spot.boundPlates.length > 0) ? spot.boundPlates.map(plate => (
                                                    <div key={plate} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded flex items-center gap-1">
                                                        {plate}
                                                        <button onClick={() => handleUnbindVehicleFromSpot(spot.id, plate)} className="text-gray-400 hover:text-red-500">
                                                            <X size={12} />
                                                        </button>
                                                    </div>
                                                )) : (
                                                    <span className="text-xs text-gray-300 italic">暂无绑定车辆</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            {deletingVehicle && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-in fade-in">
                    <div className="bg-white w-full max-w-sm rounded-2xl p-6 space-y-4 animate-in zoom-in-95">
                        <div className="text-center">
                            <div className="w-12 h-12 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <AlertTriangle size={24} />
                            </div>
                            <h3 className="font-bold text-lg text-gray-900">确认删除车辆?</h3>
                            <p className="text-sm text-gray-500 mt-2">
                                您即将删除车辆 <span className="font-bold text-gray-800">{deletingVehicle.plate}</span>
                                <br />
                                ({deletingVehicle.brand} - {deletingVehicle.color})
                            </p>
                            <p className="text-xs text-red-500 mt-2 bg-red-50 p-2 rounded">
                                此操作无法撤销，且会解除该车辆与所有车位的绑定关系。
                            </p>
                        </div>
                        
                        <div className="flex gap-3 mt-6">
                            <button 
                                onClick={() => setDeletingVehicle(null)}
                                className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 font-bold hover:bg-gray-50 transition-colors"
                            >
                                取消
                            </button>
                            <button 
                                onClick={confirmDeleteVehicle}
                                className="flex-1 py-3 rounded-xl bg-red-500 text-white font-bold shadow-lg shadow-red-500/30 hover:bg-red-600 transition-colors"
                            >
                                确认删除
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Vehicle Modal */}
            {isAddingVehicle && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4 animate-in fade-in">
                    <div className="bg-white w-full max-w-sm rounded-t-2xl sm:rounded-2xl p-6 space-y-4 animate-in slide-in-from-bottom sm:slide-in-from-bottom-0 sm:zoom-in-95">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="font-bold text-lg">添加新车辆</h3>
                            <button onClick={() => setIsAddingVehicle(false)}><X size={24} className="text-gray-400" /></button>
                        </div>
                        
                        <div className="space-y-3">
                            <div>
                                <label className="text-xs font-bold text-gray-500 mb-1 block">车牌号码</label>
                                <input 
                                    type="text" 
                                    placeholder="请输入车牌号 (如: 渝A·88888)"
                                    className="w-full bg-gray-50 p-3 rounded-xl outline-none focus:ring-2 focus:ring-brand-500 font-mono font-bold uppercase"
                                    value={newVehicle.plate || ''}
                                    onChange={e => setNewVehicle({...newVehicle, plate: e.target.value})}
                                />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 mb-1 block">品牌</label>
                                    <input 
                                        type="text" 
                                        placeholder="如: BMW"
                                        className="w-full bg-gray-50 p-3 rounded-xl outline-none focus:ring-2 focus:ring-brand-500"
                                        value={newVehicle.brand || ''}
                                        onChange={e => setNewVehicle({...newVehicle, brand: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 mb-1 block">颜色</label>
                                    <input 
                                        type="text" 
                                        placeholder="如: 白色"
                                        className="w-full bg-gray-50 p-3 rounded-xl outline-none focus:ring-2 focus:ring-brand-500"
                                        value={newVehicle.color || ''}
                                        onChange={e => setNewVehicle({...newVehicle, color: e.target.value})}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-500 mb-2 block">车辆类型</label>
                                <div className="flex gap-3">
                                    <button 
                                        onClick={() => setNewVehicle({...newVehicle, type: 'FUEL'})}
                                        className={`flex-1 py-3 rounded-xl border font-bold text-sm transition-all ${newVehicle.type === 'FUEL' ? 'bg-blue-50 border-blue-500 text-blue-600' : 'border-gray-200 text-gray-400'}`}
                                    >
                                        燃油车
                                    </button>
                                    <button 
                                        onClick={() => setNewVehicle({...newVehicle, type: 'NEV'})}
                                        className={`flex-1 py-3 rounded-xl border font-bold text-sm transition-all ${newVehicle.type === 'NEV' ? 'bg-green-50 border-green-500 text-green-600' : 'border-gray-200 text-gray-400'}`}
                                    >
                                        新能源
                                    </button>
                                </div>
                            </div>
                        </div>

                        <button 
                            onClick={handleAddVehicle}
                            className="w-full bg-brand-500 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-brand-500/30 mt-4 active:scale-[0.98] transition-transform"
                        >
                            确认添加
                        </button>
                    </div>
                </div>
            )}

            {/* Binding Spot Modal */}
            {bindingSpot && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4 animate-in fade-in">
                    <div className="bg-white w-full max-w-sm rounded-t-2xl sm:rounded-2xl p-6 space-y-4 animate-in slide-in-from-bottom sm:slide-in-from-bottom-0 sm:zoom-in-95">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="font-bold text-lg">绑定车辆到车位 {bindingSpot.number}</h3>
                            <button onClick={() => setBindingSpot(null)}><X size={24} className="text-gray-400" /></button>
                        </div>
                        
                        <div className="space-y-3 max-h-[50vh] overflow-y-auto">
                            {vehicles.length > 0 ? (
                                vehicles.map(vehicle => {
                                    const isBound = bindingSpot.boundPlates?.includes(vehicle.plate);
                                    return (
                                        <button 
                                            key={vehicle.id}
                                            disabled={isBound}
                                            onClick={() => handleBindVehicleToSpot(bindingSpot.id, vehicle.plate)}
                                            className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${isBound ? 'bg-gray-50 border-gray-100 opacity-50 cursor-not-allowed' : 'bg-white border-gray-200 hover:border-brand-500 hover:bg-brand-50'}`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-xs ${vehicle.type === 'NEV' ? 'bg-green-500' : 'bg-blue-500'}`}>
                                                    {vehicle.plate.slice(0, 1)}
                                                </div>
                                                <div className="text-left">
                                                    <p className="font-bold text-gray-800">{vehicle.plate}</p>
                                                    <p className="text-xs text-gray-400">{vehicle.brand} - {vehicle.color}</p>
                                                </div>
                                            </div>
                                            {isBound ? (
                                                <span className="text-xs text-gray-400">已绑定</span>
                                            ) : (
                                                <div className="w-6 h-6 rounded-full border-2 border-gray-200 flex items-center justify-center group-hover:border-brand-500">
                                                    <Plus size={14} className="text-gray-400 group-hover:text-brand-500" />
                                                </div>
                                            )}
                                        </button>
                                    );
                                })
                            ) : (
                                <div className="text-center py-8 text-gray-400">
                                    <p>暂无车辆可绑定</p>
                                    <button onClick={() => { setBindingSpot(null); setIsAddingVehicle(true); }} className="text-brand-500 text-sm font-bold mt-2">去添加车辆</button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Renewal Modal */}
            {renewingSpot && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4 animate-in fade-in">
                    <div className="bg-white w-full max-w-sm rounded-t-2xl sm:rounded-2xl p-6 space-y-4 animate-in slide-in-from-bottom sm:slide-in-from-bottom-0 sm:zoom-in-95">
                        <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center gap-2">
                                {renewalStep === 'PAYMENT' && (
                                    <button onClick={() => setRenewalStep('DURATION')} className="p-1 -ml-2">
                                        <ChevronLeft size={24} className="text-gray-600" />
                                    </button>
                                )}
                                <h3 className="font-bold text-lg">{renewalStep === 'DURATION' ? '车位续费' : '确认支付'}</h3>
                            </div>
                            <button onClick={() => { setRenewingSpot(null); setRenewalStep('DURATION'); }}><X size={24} className="text-gray-400" /></button>
                        </div>
                        
                        {renewalStep === 'DURATION' ? (
                            <>
                                <div className="bg-gray-50 p-4 rounded-xl flex justify-between items-center">
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">当前车位</p>
                                        <p className="font-bold text-lg text-gray-800">{renewingSpot.number}</p>
                                        <p className="text-xs text-gray-400">{renewingSpot.zone}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-gray-500 mb-1">当前有效期至</p>
                                        <p className="font-bold text-red-500">{renewingSpot.expiryDate}</p>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-gray-500 mb-2 block">选择续费时长</label>
                                    <div className="grid grid-cols-3 gap-3">
                                        {[1, 3, 6, 12].map(months => (
                                            <button 
                                                key={months}
                                                onClick={() => setRenewalDuration(months)}
                                                className={`py-3 rounded-xl border font-bold text-sm transition-all ${renewalDuration === months ? 'bg-brand-50 border-brand-500 text-brand-600' : 'border-gray-200 text-gray-400'}`}
                                            >
                                                {months}个月
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex justify-between items-center py-2">
                                    <span className="text-sm font-bold text-gray-600">应付金额</span>
                                    <span className="text-2xl font-bold text-brand-500">
                                        ¥{(renewingSpot.type === 'RENTED' ? 300 : 50) * renewalDuration}.00
                                    </span>
                                </div>
                                <p className="text-xs text-gray-400 text-right -mt-2">
                                    {renewingSpot.type === 'RENTED' ? '租赁费: 300元/月' : '管理费: 50元/月'}
                                </p>

                                <button 
                                    onClick={handleProceedToPayment}
                                    className="w-full bg-brand-500 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-brand-500/30 mt-2 active:scale-[0.98] transition-transform"
                                >
                                    下一步
                                </button>
                            </>
                        ) : (
                            <>
                                <div className="text-center py-4">
                                    <p className="text-sm text-gray-500 mb-1">支付金额</p>
                                    <p className="text-3xl font-bold text-gray-900">¥{(renewingSpot.type === 'RENTED' ? 300 : 50) * renewalDuration}.00</p>
                                </div>

                                <div className="space-y-3">
                                    <button 
                                        onClick={() => setPaymentMethod('WECHAT')}
                                        className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${paymentMethod === 'WECHAT' ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white">
                                                <MessageCircle size={18} />
                                            </div>
                                            <span className="font-bold text-gray-800">微信支付</span>
                                        </div>
                                        {paymentMethod === 'WECHAT' && <div className="w-4 h-4 rounded-full bg-green-500 border-2 border-white ring-1 ring-green-500"></div>}
                                    </button>

                                    <button 
                                        onClick={() => setPaymentMethod('ALIPAY')}
                                        className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${paymentMethod === 'ALIPAY' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white">
                                                <CreditCard size={18} />
                                            </div>
                                            <span className="font-bold text-gray-800">支付宝</span>
                                        </div>
                                        {paymentMethod === 'ALIPAY' && <div className="w-4 h-4 rounded-full bg-blue-500 border-2 border-white ring-1 ring-blue-500"></div>}
                                    </button>
                                </div>

                                <button 
                                    onClick={handleConfirmPayment}
                                    className={`w-full text-white py-3.5 rounded-xl font-bold shadow-lg mt-4 active:scale-[0.98] transition-transform ${paymentMethod === 'WECHAT' ? 'bg-green-500 shadow-green-500/30' : 'bg-blue-500 shadow-blue-500/30'}`}
                                >
                                    立即支付 ¥{(renewingSpot.type === 'RENTED' ? 300 : 50) * renewalDuration}
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* Access History Modal */}
            {showingAccessHistoryFor && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4 animate-in fade-in">
                    <div className="bg-white w-full max-w-sm rounded-t-2xl sm:rounded-2xl p-6 space-y-4 animate-in slide-in-from-bottom sm:slide-in-from-bottom-0 sm:zoom-in-95 h-[60vh] flex flex-col">
                        <div className="flex justify-between items-center mb-4 shrink-0">
                            <h3 className="font-bold text-lg">车辆出入记录</h3>
                            <button onClick={() => setShowingAccessHistoryFor(null)}><X size={24} className="text-gray-400" /></button>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto space-y-4">
                            {/* Mock Access History Data */}
                            {[
                                { id: 1, time: '2024-02-18 18:30:45', gate: '南门出口', type: 'EXIT', image: 'https://picsum.photos/200/120' },
                                { id: 2, time: '2024-02-18 08:15:20', gate: '北门入口', type: 'ENTRY', image: 'https://picsum.photos/200/121' },
                                { id: 3, time: '2024-02-17 19:40:10', gate: '南门出口', type: 'EXIT', image: 'https://picsum.photos/200/122' },
                                { id: 4, time: '2024-02-17 09:05:33', gate: '北门入口', type: 'ENTRY', image: 'https://picsum.photos/200/123' },
                                { id: 5, time: '2024-02-16 20:10:55', gate: '东门出口', type: 'EXIT', image: 'https://picsum.photos/200/124' },
                            ].map(record => (
                                <div key={record.id} className="bg-gray-50 rounded-xl overflow-hidden">
                                    <div className="p-3 flex justify-between items-center border-b border-gray-100">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${record.type === 'ENTRY' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                                                    {record.type === 'ENTRY' ? '入场' : '出场'}
                                                </span>
                                                <span className="font-bold text-gray-800 text-sm">{record.gate}</span>
                                            </div>
                                            <p className="text-xs text-gray-400 mt-1 font-mono">{record.time}</p>
                                        </div>
                                    </div>
                                    <div className="relative h-32 bg-gray-200">
                                        <img src={record.image} alt="Vehicle Capture" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                        <div className="absolute bottom-2 right-2 bg-black/50 text-white text-[10px] px-1.5 py-0.5 rounded backdrop-blur-sm">
                                            监控抓拍
                                        </div>
                                    </div>
                                </div>
                            ))}
                            
                            <div className="text-center py-4 text-xs text-gray-400">
                                仅展示最近7天的出入记录
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* Payment History Modal */}
            {showingPaymentHistory && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4 animate-in fade-in">
                    <div className="bg-white w-full max-w-sm rounded-t-2xl sm:rounded-2xl p-6 space-y-4 animate-in slide-in-from-bottom sm:slide-in-from-bottom-0 sm:zoom-in-95 h-[70vh] flex flex-col">
                        <div className="flex justify-between items-center mb-4 shrink-0">
                            <h3 className="font-bold text-lg">车位缴费记录</h3>
                            <button onClick={() => setShowingPaymentHistory(false)}><X size={24} className="text-gray-400" /></button>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto space-y-4">
                            {[
                                { id: 1, type: 'MANAGEMENT_FEE', amount: 600, date: '2023-12-20 14:30', period: '12个月', spot: 'A-102', status: 'SUCCESS' },
                                { id: 2, type: 'RENTAL_FEE', amount: 900, date: '2023-11-15 09:12', period: '3个月', spot: 'B-055', status: 'SUCCESS' },
                                { id: 3, type: 'MANAGEMENT_FEE', amount: 300, date: '2023-06-18 11:20', period: '6个月', spot: 'A-102', status: 'SUCCESS' },
                                { id: 4, type: 'RENTAL_FEE', amount: 300, date: '2023-10-15 16:45', period: '1个月', spot: 'B-055', status: 'SUCCESS' },
                            ].map(record => (
                                <div key={record.id} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${record.type === 'MANAGEMENT_FEE' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>
                                                    {record.type === 'MANAGEMENT_FEE' ? '车位管理费' : '车位租赁费'}
                                                </span>
                                                <span className="font-bold text-gray-800">{record.spot}</span>
                                            </div>
                                            <p className="text-xs text-gray-400 mt-1">{record.date}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-lg text-gray-900">-¥{record.amount}</p>
                                            <p className="text-xs text-gray-500">缴费时长: {record.period}</p>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center pt-2 border-t border-gray-200 mt-2">
                                        <span className="text-xs text-gray-400">支付方式: 微信支付</span>
                                        <span className="text-xs font-bold text-green-600 flex items-center gap-1">
                                            <CheckCircle size={12} /> 支付成功
                                        </span>
                                    </div>
                                </div>
                            ))}
                            
                            <div className="text-center py-4 text-xs text-gray-400">
                                仅展示最近一年的缴费记录
                            </div>
                            
                            <div className="bg-orange-50 p-3 rounded-lg flex items-start gap-2 text-xs text-orange-600">
                                <Info size={14} className="mt-0.5 shrink-0" />
                                <p>如需开具发票，请携带相关证件前往物业服务中心线下办理。</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// --- COMPONENT: My House ---
const MyHouseView: React.FC<{onChangeView: (v: ViewState) => void}> = ({ onChangeView }) => {
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
                            <button onClick={() => setIsAddingMember(true)} className="text-brand-500 text-sm font-medium flex items-center gap-1">
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
                                            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
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

// --- COMPONENT: Staff - Internal Report ---
const StaffReportView: React.FC<{onChangeView: (v: ViewState) => void}> = ({ onChangeView }) => {
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


// --- COMPONENT: Staff - Visitor Registration ---
interface StaffVisitorRecord {
    id: string;
    name: string;
    phone: string;
    house: string;
    plate?: string;
    reason?: string;
    enterDate: string; // YYYY-MM-DD
    enterTime: string; // HH:mm
    leaveDate?: string; // YYYY-MM-DD
    leaveTime?: string; // HH:mm
    expectedLeaveDate?: string; // YYYY-MM-DD
    expectedLeaveTime?: string; // HH:mm
    status: 'ENTERED' | 'LEFT';
}

const StaffVisitorView: React.FC<{onChangeView: (v: ViewState) => void}> = ({ onChangeView }) => {
    const formRef = useRef<HTMLDivElement>(null);
    const [visitorName, setVisitorName] = useState('');
    const [phone, setPhone] = useState('');
    const [house, setHouse] = useState('');
    const [plate, setPlate] = useState('');
    const [reason, setReason] = useState('');
    const [expectedLeaveDate, setExpectedLeaveDate] = useState('');
    const [expectedLeaveTime, setExpectedLeaveTime] = useState('');
    const [showAllRecords, setShowAllRecords] = useState(false);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [showToast, setShowToast] = useState(false);
    
    const [records, setRecords] = useState<StaffVisitorRecord[]>([
        { id: '1', name: '王大锤', phone: '138****1111', house: '3栋-201', enterDate: '2026-02-26', enterTime: '09:30', status: 'LEFT', leaveDate: '2026-02-26', leaveTime: '11:20', reason: '亲友聚会' },
        { id: '2', name: '李小龙', phone: '139****2222', house: '5栋-102', enterDate: '2026-02-26', enterTime: '10:15', status: 'ENTERED', expectedLeaveTime: '18:00', reason: '家政服务' },
        { id: '3', name: '张三', phone: '137****3333', house: '1栋-501', enterDate: '2026-02-25', enterTime: '13:45', status: 'ENTERED', reason: '快递配送' },
        { id: '4', name: '赵六', phone: '136****4444', house: '8栋-1203', enterDate: '2026-02-25', enterTime: '14:20', status: 'LEFT', leaveDate: '2026-02-25', leaveTime: '15:10', reason: '装修维修' },
        { id: '5', name: '孙七', phone: '135****5555', house: '2栋-302', enterDate: '2026-02-24', enterTime: '15:50', status: 'ENTERED', expectedLeaveTime: '20:00', reason: '外卖送餐' },
    ]);

    const handleRegister = () => {
        if (!visitorName || !phone || !house) {
            alert('请填写访客姓名、手机号和被访房屋');
            return;
        }
        
        const now = new Date();
        const dateStr = now.toISOString().split('T')[0];
        const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        const newRecord: StaffVisitorRecord = {
            id: Date.now().toString(),
            name: visitorName,
            phone: phone.includes('*') ? phone : phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2'),
            house,
            plate,
            reason,
            enterDate: dateStr,
            enterTime: timeStr,
            expectedLeaveDate: expectedLeaveDate || undefined,
            expectedLeaveTime: expectedLeaveTime || undefined,
            status: 'ENTERED'
        };

        setRecords([newRecord, ...records]);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
        
        setVisitorName('');
        setPhone('');
        setHouse('');
        setPlate('');
        setReason('');
        setExpectedLeaveDate('');
        setExpectedLeaveTime('');
    };

    const handleRegisterAgain = (record: StaffVisitorRecord) => {
        setVisitorName(record.name);
        setPhone(record.phone);
        setHouse(record.house);
        setPlate(record.plate || '');
        setReason(record.reason || '');
        setExpectedLeaveDate('');
        setExpectedLeaveTime('');
        setShowAllRecords(false);
        setTimeout(() => {
            formRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    const setQuickExpectedTime = (hours: number) => {
        const now = new Date();
        now.setHours(now.getHours() + hours);
        setExpectedLeaveDate(now.toISOString().split('T')[0]);
        setExpectedLeaveTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
    };

    const handleLeave = (id: string) => {
        const now = new Date();
        const dateStr = now.toISOString().split('T')[0];
        const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        setRecords(prev => prev.map(r => 
            r.id === id 
                ? { ...r, status: 'LEFT', leaveDate: dateStr, leaveTime: timeStr } 
                : r
        ));
        alert('离开登记成功');
    };

    // Filtered and sorted records for "All Records" view
    const todayStr = new Date().toISOString().split('T')[0];
    const filteredRecords = records
        .filter(r => {
            const effectiveLeaveDate = r.leaveDate || todayStr;
            // Overlap check: [enterDate, leaveDate] overlaps [startDate, endDate]
            // Condition: enterDate <= endDate AND leaveDate >= startDate
            if (startDate && effectiveLeaveDate < startDate) return false;
            if (endDate && r.enterDate > endDate) return false;
            
            // Search filter
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                const nameMatch = r.name.toLowerCase().includes(query);
                const phoneMatch = r.phone.includes(query);
                if (!nameMatch && !phoneMatch) return false;
            }
            
            return true;
        })
        .sort((a, b) => {
            if (a.enterDate !== b.enterDate) return b.enterDate.localeCompare(a.enterDate);
            return b.enterTime.localeCompare(a.enterTime);
        });

    // Today's records for the main view
    const todayRecords = records
        .filter(r => r.enterDate === todayStr || (r.status === 'ENTERED' && r.enterDate < todayStr))
        .sort((a, b) => b.enterTime.localeCompare(a.enterTime));

    if (showAllRecords) {
        return (
            <div className="min-h-full bg-gray-50 flex flex-col animate-in slide-in-from-right duration-300">
                <div className="bg-white p-4 flex items-center border-b sticky top-0 z-10">
                    <button onClick={() => setShowAllRecords(false)}><ChevronLeft /></button>
                    <span className="ml-4 font-bold text-lg">所有访客记录</span>
                </div>

                <div className="p-4 space-y-4">
                    {/* Search and Date Filter */}
                    <div className="bg-white p-4 rounded-xl shadow-sm space-y-4">
                        <div className="flex items-center gap-2 text-sm font-bold text-gray-700">
                            <Filter size={16} className="text-brand-500" /> 记录检索
                        </div>
                        
                        {/* Search Input */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <input 
                                type="text"
                                placeholder="搜索访客姓名或手机号"
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-100 rounded-lg py-2.5 pl-10 pr-4 text-sm outline-none focus:ring-1 focus:ring-brand-500 transition-all"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <p className="text-[10px] text-gray-400 mb-1 ml-1">开始日期</p>
                                <input 
                                    type="date" 
                                    value={startDate}
                                    onChange={e => setStartDate(e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-100 rounded-lg p-2 text-xs outline-none focus:border-brand-500"
                                />
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-400 mb-1 ml-1">结束日期</p>
                                <input 
                                    type="date" 
                                    value={endDate}
                                    onChange={e => setEndDate(e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-100 rounded-lg p-2 text-xs outline-none focus:border-brand-500"
                                />
                            </div>
                        </div>
                        {(startDate || endDate || searchQuery) && (
                            <button 
                                onClick={() => { setStartDate(''); setEndDate(''); setSearchQuery(''); }}
                                className="w-full text-xs text-brand-500 font-medium py-1"
                            >
                                重置筛选
                            </button>
                        )}
                    </div>

                    {/* Records List */}
                    <div className="space-y-3">
                        {filteredRecords.length > 0 ? (
                            filteredRecords.map(record => (
                                <div key={record.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-gray-800 text-base">{record.name}</span>
                                                <span className="text-xs text-gray-400">{record.phone}</span>
                                            </div>
                                            <div className="text-xs text-gray-500 mt-1 flex flex-col gap-0.5">
                                                <div className="flex items-center gap-1.5">
                                                    <span className="text-blue-500 font-bold">入:</span>
                                                    <span>{record.enterDate} {record.enterTime}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <span className="text-gray-400 font-bold">出:</span>
                                                    <span>
                                                        {record.leaveDate ? `${record.leaveDate} ${record.leaveTime}` : (record.expectedLeaveTime ? `预计 ${record.expectedLeaveTime}` : '未登记')}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="text-xs text-gray-500 mt-1">
                                                访问: {record.house}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                                                record.status === 'ENTERED' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'
                                            }`}>
                                                {record.status === 'ENTERED' ? '已准入' : '已离开'}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-3 pt-3 border-t border-gray-50 flex justify-end gap-2">
                                        {record.status === 'ENTERED' ? (
                                            <button 
                                                onClick={() => handleLeave(record.id)}
                                                className="text-xs bg-gray-900 text-white px-4 py-1.5 rounded-lg font-medium active:scale-95 transition-transform"
                                            >
                                                登记离开
                                            </button>
                                        ) : (
                                            <button 
                                                onClick={() => handleRegisterAgain(record)}
                                                className="text-xs bg-brand-50 text-brand-600 border border-brand-100 px-4 py-1.5 rounded-lg font-medium active:scale-95 transition-transform flex items-center gap-1"
                                            >
                                                <Plus size={12} /> 再次登记
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="bg-white p-10 rounded-xl text-center space-y-2">
                                <Search size={40} className="mx-auto text-gray-200" />
                                <p className="text-gray-400 text-sm">暂无符合条件的记录</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-full bg-gray-50 flex flex-col">
            <div className="bg-white p-4 flex items-center border-b sticky top-0">
                <button onClick={() => onChangeView(ViewState.PROFILE)}><ChevronLeft /></button>
                <span className="ml-4 font-bold text-lg">访客登记</span>
                <button 
                    onClick={() => setShowAllRecords(true)}
                    className="ml-auto text-xs bg-brand-50 text-brand-600 px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 active:scale-95 transition-transform"
                >
                    查看所有访客记录 <ChevronRight size={14} />
                </button>
            </div>

            <div className="p-4 space-y-4">
                {/* Registration Form */}
                <div ref={formRef} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                            <div className="w-8 h-8 bg-brand-50 rounded-lg flex items-center justify-center">
                                <UserPlus size={18} className="text-brand-600"/>
                            </div>
                            现场登记
                        </h3>
                        <span className="text-[10px] text-gray-400 bg-gray-50 px-2 py-1 rounded-md font-medium">请如实填写访客信息</span>
                    </div>
                    
                    <div className="space-y-5">
                        {/* Basic Info Section */}
                        <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="relative group">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-500 transition-colors">
                                        <UserPlus size={14} />
                                    </div>
                                    <input 
                                        className="w-full bg-gray-50 border border-transparent focus:border-brand-500 focus:bg-white p-2.5 pl-9 rounded-xl text-sm outline-none transition-all" 
                                        placeholder="访客姓名" 
                                        value={visitorName}
                                        onChange={e => setVisitorName(e.target.value)}
                                    />
                                </div>
                                <div className="relative group">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-500 transition-colors">
                                        <Phone size={14} />
                                    </div>
                                    <input 
                                        className="w-full bg-gray-50 border border-transparent focus:border-brand-500 focus:bg-white p-2.5 pl-9 rounded-xl text-sm outline-none transition-all" 
                                        placeholder="手机号码" 
                                        value={phone}
                                        onChange={e => setPhone(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="relative group">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-500 transition-colors">
                                    <Home size={14} />
                                </div>
                                <input 
                                    className="w-full bg-gray-50 border border-transparent focus:border-brand-500 focus:bg-white p-2.5 pl-9 rounded-xl text-sm outline-none transition-all" 
                                    placeholder="被访房屋 (例如: 1-1301)" 
                                    value={house}
                                    onChange={e => setHouse(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Visit Details Section */}
                        <div className="space-y-3">
                            <div className="relative group">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-500 transition-colors">
                                    <Car size={14} />
                                </div>
                                <input 
                                    className="w-full bg-gray-50 border border-transparent focus:border-brand-500 focus:bg-white p-2.5 pl-9 rounded-xl text-sm outline-none transition-all" 
                                    placeholder="车牌号码 (选填)" 
                                    value={plate}
                                    onChange={e => setPlate(e.target.value)}
                                />
                            </div>
                            <div className="bg-gray-50 rounded-xl p-2.5 flex items-center gap-2 border border-transparent">
                                <CalendarClock size={14} className="text-brand-500" />
                                <span className="text-xs text-gray-600 font-medium">预计离开时间</span>
                            </div>

                            {/* Quick Expected Time Selection */}
                            <div className="bg-gray-50/50 p-3 rounded-xl border border-gray-100 space-y-3">
                                <div className="flex overflow-x-auto gap-1.5 pb-1 no-scrollbar">
                                    {[
                                        { label: '1h后', val: 1 },
                                        { label: '3h后', val: 3 },
                                        { label: '6h后', val: 6 },
                                        { label: '12h后', val: 12 },
                                        { label: '1天后', val: 24 }
                                    ].map(opt => (
                                        <button 
                                            key={opt.val}
                                            onClick={() => setQuickExpectedTime(opt.val)}
                                            className="flex-shrink-0 px-2.5 py-1.5 bg-white text-gray-600 rounded-lg text-[10px] border border-gray-200 hover:border-brand-300 hover:text-brand-600 hover:bg-brand-50 transition-all font-medium active:scale-95"
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="relative group">
                                        <input 
                                            type="date"
                                            className="w-full bg-white border border-gray-200 focus:border-brand-500 p-2 rounded-lg text-xs outline-none transition-all" 
                                            value={expectedLeaveDate}
                                            onChange={e => setExpectedLeaveDate(e.target.value)}
                                        />
                                    </div>
                                    <div className="relative group">
                                        <input 
                                            type="time"
                                            className="w-full bg-white border border-gray-200 focus:border-brand-500 p-2 rounded-lg text-xs outline-none transition-all" 
                                            value={expectedLeaveTime}
                                            onChange={e => setExpectedLeaveTime(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Reason Section */}
                        <div className="space-y-3">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">来访事由</p>
                            <div className="flex flex-wrap gap-2">
                                {['亲友聚会', '快递配送', '外卖送餐', '家政服务', '装修维修'].map(r => (
                                    <button 
                                        key={r}
                                        onClick={() => setReason(r)}
                                        className={`px-3 py-1.5 rounded-full text-[10px] font-medium transition-all border ${reason === r ? 'bg-brand-500 text-white border-brand-500 shadow-md shadow-brand-500/20' : 'bg-white text-gray-500 border-gray-200 hover:border-brand-200 hover:text-brand-500'}`}
                                    >
                                        {r}
                                    </button>
                                ))}
                            </div>
                            <div className="relative group">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-500 transition-colors">
                                    <Tag size={14} />
                                </div>
                                <input 
                                    className="w-full bg-gray-50 border border-transparent focus:border-brand-500 focus:bg-white p-2.5 pl-9 rounded-xl text-sm outline-none transition-all" 
                                    placeholder="其他事由备注" 
                                    value={reason}
                                    onChange={e => setReason(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <button 
                        onClick={handleRegister}
                        className="w-full mt-8 bg-brand-500 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-brand-500/20 hover:bg-brand-600 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                    >
                        <CheckCircle size={18} />
                        确认登记 & 放行
                    </button>
                </div>

                {/* Success Toast */}
                {showToast && (
                    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
                        <div className="bg-gray-900 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/10">
                            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                <Check size={14} className="text-white" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-bold">登记成功</span>
                                <span className="text-[10px] text-gray-400">已通知业主并同步记录</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Recent History */}
                <div>
                    <h3 className="font-bold text-gray-700 text-sm mb-3 ml-1 flex items-center gap-2">
                        <History size={16} /> 今日访客记录 ({todayRecords.length})
                    </h3>
                    <div className="space-y-3">
                        {todayRecords.length > 0 ? (
                            todayRecords.map(record => (
                                <div key={record.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-gray-800 text-base">{record.name}</span>
                                                <span className="text-xs text-gray-400">{record.phone}</span>
                                            </div>
                                            <div className="text-xs text-gray-500 mt-1 flex flex-col gap-0.5">
                                                <div className="flex items-center gap-1.5">
                                                    <span className="text-blue-500 font-bold">入:</span>
                                                    <span>{record.enterDate} {record.enterTime}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <span className="text-gray-400 font-bold">出:</span>
                                                    <span>
                                                        {record.leaveDate ? `${record.leaveDate} ${record.leaveTime}` : (record.expectedLeaveTime ? `预计 ${record.expectedLeaveTime}` : '未登记')}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="text-xs text-gray-500 mt-1">
                                                访问: {record.house}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                                                record.status === 'ENTERED' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'
                                            }`}>
                                                {record.status === 'ENTERED' ? '已准入' : '已离开'}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-3 pt-3 border-t border-gray-50 flex justify-end gap-2">
                                        {record.status === 'ENTERED' ? (
                                            <button 
                                                onClick={() => handleLeave(record.id)}
                                                className="text-xs bg-gray-900 text-white px-4 py-1.5 rounded-lg font-medium active:scale-95 transition-transform"
                                            >
                                                登记离开
                                            </button>
                                        ) : (
                                            <button 
                                                onClick={() => handleRegisterAgain(record)}
                                                className="text-xs bg-brand-50 text-brand-600 border border-brand-100 px-4 py-1.5 rounded-lg font-medium active:scale-95 transition-transform flex items-center gap-1"
                                            >
                                                <Plus size={12} /> 再次登记
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="bg-white p-8 rounded-xl text-center border border-dashed border-gray-200">
                                <p className="text-gray-400 text-xs">今日暂无访客登记</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

// --- COMPONENT: Staff - Remote Open ---
const StaffRemoteOpenView: React.FC<{user: User, onChangeView: (v: ViewState) => void}> = ({ user, onChangeView }) => {
    const [openingId, setOpeningId] = useState<string | null>(null);
    const [selectedDoor, setSelectedDoor] = useState<any | null>(null);
    const [roomNumber, setRoomNumber] = useState('');
    const [openReason, setOpenReason] = useState('访客');
    const [showSuccessToast, setShowSuccessToast] = useState(false);
    const [showLogs, setShowLogs] = useState(false);
    const [logTab, setLogTab] = useState<'MY' | 'ALL'>('MY');
    
    const [myLogs, setMyLogs] = useState([
        { id: '1', door: '北门人行通道门', room: '3-1201', time: '2026-02-26 10:15:22', reason: '访客', result: '成功', operator: user.name },
        { id: '2', door: '北门车辆道闸入口', room: '1-502', time: '2026-02-26 09:45:10', reason: '外卖/快递', result: '成功', operator: user.name },
    ]);

    const [allLogs] = useState([
        { id: 'a1', door: '北门人行通道门', room: '3-1201', time: '2026-02-26 10:15:22', reason: '访客', result: '成功', operator: '张保安' },
        { id: 'a2', door: '北门车辆道闸入口', room: '1-502', time: '2026-02-26 09:45:10', reason: '外卖/快递', result: '成功', operator: '李保安' },
        { id: 'a3', door: '南门岗亭主出入口', room: '2-101', time: '2026-02-26 08:20:05', reason: '其他', result: '成功', operator: '王物业' },
    ]);

    const handleOpen = () => {
        if (!selectedDoor || !roomNumber) return;
        
        const id = selectedDoor.id;
        const doorName = selectedDoor.name;
        const currentRoom = roomNumber;
        const currentReason = openReason;
        
        setSelectedDoor(null);
        setOpeningId(id);
        
        // Simulate API call
        setTimeout(() => {
            setOpeningId(null);
            setShowSuccessToast(true);
            
            // Add to my logs
            const now = new Date();
            const timeStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
            
            setMyLogs(prev => [{
                id: Date.now().toString(),
                door: doorName,
                room: currentRoom,
                time: timeStr,
                reason: currentReason,
                result: '成功'
            }, ...prev]);

            setRoomNumber('');
            setOpenReason('访客');
            
            setTimeout(() => setShowSuccessToast(false), 3000);
        }, 1500);
    }

    const DOORS = [
        { id: 'd1', name: '北门车辆道闸入口', type: 'CAR', status: 'ONLINE', location: '小区北侧' },
        { id: 'd2', name: '北门人行通道门', type: 'PERSON', status: 'ONLINE', location: '小区北侧' },
        { id: 'd3', name: '南门岗亭主出入口', type: 'MIXED', status: 'ONLINE', location: '小区南侧' },
        { id: 'd4', name: '3栋大堂单元门', type: 'PERSON', status: 'OFFLINE', location: '3栋1层' },
    ];

    return (
        <div className="min-h-full bg-gray-50 flex flex-col">
             <div className="bg-white text-gray-900 p-4 flex items-center border-b border-gray-100 sticky top-0 z-10">
                <button onClick={() => onChangeView(ViewState.PROFILE)} className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors">
                    <ChevronLeft />
                </button>
                <span className="ml-2 font-bold text-lg">远程控门台</span>
                <div className="ml-auto flex items-center gap-2">
                    <button 
                        onClick={() => setShowLogs(true)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                    >
                        <History size={16} />
                        <span className="text-xs font-bold">我的记录</span>
                    </button>
                </div>
            </div>

            <div className="p-4 space-y-4">
                 {!selectedDoor ? (
                    <>
                        <div className="bg-brand-50 border border-brand-100 rounded-2xl p-4 text-xs text-brand-800 flex items-start gap-3 shadow-sm">
                            <div className="w-8 h-8 bg-brand-100 rounded-lg flex items-center justify-center shrink-0">
                                <Shield size={18} className="text-brand-600" />
                            </div>
                            <div>
                                <p className="font-bold mb-1">安全操作说明</p>
                                <p className="opacity-80 leading-relaxed">请先选择需要开启的门禁设备。所有操作将实时记录并关联您的物业账号。</p>
                            </div>
                        </div>

                        <div className="grid gap-3">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">选择门禁设备</p>
                            {DOORS.map(door => (
                                <button 
                                    key={door.id} 
                                    disabled={door.status === 'OFFLINE' || openingId === door.id}
                                    onClick={() => setSelectedDoor(door)}
                                    className={`bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between transition-all text-left ${
                                        door.status === 'OFFLINE' ? 'opacity-60 grayscale' : 'hover:border-brand-300 hover:shadow-md active:scale-[0.98]'
                                    }`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${door.status === 'ONLINE' ? 'bg-gray-50 text-gray-600' : 'bg-red-50 text-red-400'}`}>
                                            {door.type === 'CAR' ? <Car size={24}/> : <Unlock size={24}/>}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-base text-gray-900">{door.name}</h4>
                                            <div className="flex items-center gap-3 mt-1">
                                                <span className={`text-[10px] flex items-center gap-1 font-bold ${door.status === 'ONLINE' ? 'text-green-500' : 'text-red-400'}`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${door.status === 'ONLINE' ? 'bg-green-500' : 'bg-red-400'}`}></span>
                                                    {door.status === 'ONLINE' ? '在线' : '离线'}
                                                </span>
                                                <span className="text-[10px] text-gray-400 flex items-center gap-1">
                                                    <MapPin size={10} /> {door.location}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <ChevronRight size={20} className="text-gray-300" />
                                </button>
                            ))}
                        </div>
                    </>
                 ) : (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-100">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-14 h-14 bg-brand-50 text-brand-600 rounded-2xl flex items-center justify-center">
                                    {selectedDoor.type === 'CAR' ? <Car size={28}/> : <Unlock size={28}/>}
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">{selectedDoor.name}</h3>
                                    <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                                        <MapPin size={12} /> {selectedDoor.location}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 ml-1">房号信息 (必填)</label>
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                            <Home size={18} />
                                        </div>
                                        <input 
                                            type="text"
                                            placeholder="请输入房号，如：1-1201"
                                            className="w-full bg-gray-50 border-2 border-transparent focus:border-brand-500 focus:bg-white p-4 pl-12 rounded-2xl text-sm outline-none transition-all"
                                            value={roomNumber}
                                            onChange={e => setRoomNumber(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 ml-1">开门原因</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {['访客', '外卖/快递', '其他'].map(r => (
                                            <button 
                                                key={r}
                                                onClick={() => setOpenReason(r)}
                                                className={`py-3 rounded-xl text-xs font-bold transition-all border-2 ${
                                                    openReason === r 
                                                    ? 'bg-brand-500 border-brand-500 text-white shadow-md shadow-brand-500/20' 
                                                    : 'bg-white border-gray-100 text-gray-500 hover:border-brand-200'
                                                }`}
                                            >
                                                {r}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3 mt-10">
                                <button 
                                    onClick={() => setSelectedDoor(null)}
                                    className="flex-1 py-4 rounded-2xl font-bold text-gray-500 bg-gray-100 hover:bg-gray-200 transition-colors"
                                >
                                    返回重选
                                </button>
                                <button 
                                    disabled={!roomNumber || openingId === selectedDoor.id}
                                    onClick={handleOpen}
                                    className={`flex-[2] py-4 rounded-2xl font-bold text-white shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2 ${
                                        !roomNumber 
                                        ? 'bg-gray-300 shadow-none cursor-not-allowed' 
                                        : 'bg-brand-500 hover:bg-brand-600 shadow-brand-500/30'
                                    }`}
                                >
                                    {openingId === selectedDoor.id ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    ) : (
                                        <Power size={20} />
                                    )}
                                    {openingId === selectedDoor.id ? '正在开启...' : '一键开门'}
                                </button>
                            </div>
                        </div>
                    </div>
                 )}
            </div>

            {/* My Logs Modal */}
            {showLogs && (
                <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
                    <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setShowLogs(false)}></div>
                    <div className="relative bg-white w-full max-w-md h-[85vh] sm:h-auto sm:max-h-[80vh] rounded-t-[40px] sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom duration-300">
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between shrink-0">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">开门操作记录</h3>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Operation History</p>
                            </div>
                            <button 
                                onClick={() => setShowLogs(false)}
                                className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {user.role === UserRole.SUPER_ADMIN && (
                            <div className="px-6 py-2 border-b border-gray-50 flex gap-4 shrink-0">
                                <button 
                                    onClick={() => setLogTab('MY')}
                                    className={`text-sm font-bold pb-2 transition-all border-b-2 ${logTab === 'MY' ? 'text-brand-500 border-brand-500' : 'text-gray-400 border-transparent'}`}
                                >
                                    我的记录
                                </button>
                                <button 
                                    onClick={() => setLogTab('ALL')}
                                    className={`text-sm font-bold pb-2 transition-all border-b-2 ${logTab === 'ALL' ? 'text-brand-500 border-brand-500' : 'text-gray-400 border-transparent'}`}
                                >
                                    全部记录
                                </button>
                            </div>
                        )}
                        
                        <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar">
                            {(logTab === 'MY' ? myLogs : allLogs).length > 0 ? (
                                (logTab === 'MY' ? myLogs : allLogs).map(log => (
                                    <div key={log.id} className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-brand-600">
                                                    <Unlock size={20} />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-gray-900">{log.door}</p>
                                                    <p className="text-[10px] text-gray-400 font-medium">{log.time}</p>
                                                </div>
                                            </div>
                                            <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                                                log.result === '成功' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                                            }`}>
                                                {log.result}
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 mt-3 pt-3 border-t border-gray-200/50">
                                            <div className="flex items-center gap-2">
                                                <Home size={12} className="text-gray-400" />
                                                <span className="text-xs text-gray-600">房号: <span className="font-bold text-gray-900">{log.room}</span></span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Info size={12} className="text-gray-400" />
                                                <span className="text-xs text-gray-600">原因: <span className="font-bold text-gray-900">{log.reason}</span></span>
                                            </div>
                                        </div>
                                        {logTab === 'ALL' && (
                                            <div className="mt-2 text-[10px] text-gray-400 flex items-center gap-1">
                                                <UserPlus size={10} /> 操作人: {log.operator}
                                            </div>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <div className="py-20 text-center">
                                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <History size={32} className="text-gray-200" />
                                    </div>
                                    <p className="text-gray-400 text-sm">暂无操作记录</p>
                                </div>
                            )}
                        </div>
                        
                        <div className="p-6 bg-gray-50 border-t border-gray-100 shrink-0">
                            <button 
                                onClick={() => setShowLogs(false)}
                                className="w-full py-4 bg-white border border-gray-200 text-gray-600 rounded-2xl font-bold text-sm hover:bg-gray-100 transition-colors shadow-sm"
                            >
                                关闭
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Success Toast */}
            {showSuccessToast && (
                <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <div className="bg-gray-900 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/10">
                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                            <Check size={14} className="text-white" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-bold">指令已发送</span>
                            <span className="text-[10px] text-gray-400">门锁已成功开启并同步至记录</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

// --- COMPONENT: Staff - Smart Lighting ---
const StaffSmartLightingView = ({ onChangeView }: { onChangeView: (v: ViewState) => void }) => {
    // Local state to handle updates for demonstration
    const [zones, setZones] = useState(MOCK_LIGHTING_ZONES);
    const [isBatchMode, setIsBatchMode] = useState(false);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [showTimeModal, setShowTimeModal] = useState(false);
    const [timeRange, setTimeRange] = useState({ start: '18:00', end: '06:00' });
    
    // Settings Modal State
    const [showSettingsModal, setShowSettingsModal] = useState(false);
    const [editingZone, setEditingZone] = useState<LightingZone | null>(null);

    const toggleSelection = (id: string) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(sid => sid !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    };

    const handleSelectAll = () => {
        if (selectedIds.length === zones.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(zones.map(z => z.id));
        }
    };

    const applySchedule = () => {
        const newScheduleStr = `${timeRange.start} - ${timeRange.end}`;
        setZones(prev => prev.map(z => 
            selectedIds.includes(z.id) ? { ...z, schedule: newScheduleStr, mode: 'SCHEDULE' } : z
        ));
        setShowTimeModal(false);
        setIsBatchMode(false);
        setSelectedIds([]);
        alert('批量设置工作时间成功！');
    };

    const handleToggleZone = (id: string) => {
        setZones(prev => prev.map(z => 
            z.id === id ? { ...z, isOn: !z.isOn, brightness: !z.isOn ? 80 : 0 } : z
        ));
    };

    const openSettings = (zone: LightingZone) => {
        setEditingZone({ ...zone });
        setShowSettingsModal(true);
    };

    const saveSettings = () => {
        if (!editingZone) return;
        setZones(prev => prev.map(z => z.id === editingZone.id ? editingZone : z));
        setShowSettingsModal(false);
        setEditingZone(null);
        alert('设置已保存');
    };

    return (
        <div className="min-h-full bg-gray-50 flex flex-col relative">
            <div className="bg-white p-4 flex items-center border-b sticky top-0 z-20">
                <button onClick={() => onChangeView(ViewState.PROFILE)}><ChevronLeft /></button>
                <span className="ml-4 font-bold text-lg">智慧照明</span>
                <button 
                    onClick={() => {
                        setIsBatchMode(!isBatchMode);
                        setSelectedIds([]);
                    }} 
                    className={`ml-auto text-sm font-bold ${isBatchMode ? 'text-brand-500' : 'text-gray-500'}`}
                >
                    {isBatchMode ? '取消管理' : '批量管理'}
                </button>
            </div>
            
            <div className="p-4 space-y-4 pb-24">
                {!isBatchMode && (
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl p-4 text-white shadow-lg">
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-white/80 text-xs">总能耗 (kWh)</span>
                                <Zap className="text-white/80" size={16} />
                            </div>
                            <span className="text-2xl font-bold">128.5</span>
                        </div>
                        <div className="bg-gradient-to-br from-blue-400 to-blue-500 rounded-xl p-4 text-white shadow-lg">
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-white/80 text-xs">在线设备</span>
                                <Lightbulb className="text-white/80" size={16} />
                            </div>
                            <span className="text-2xl font-bold">42/45</span>
                        </div>
                    </div>
                )}

                 {zones.map(zone => {
                     const isSelected = selectedIds.includes(zone.id);
                     return (
                         <div 
                            key={zone.id} 
                            onClick={() => isBatchMode && toggleSelection(zone.id)}
                            className={`bg-white p-4 rounded-xl shadow-sm relative transition-all ${isBatchMode ? 'cursor-pointer active:scale-[0.98]' : ''} ${isSelected ? 'ring-2 ring-brand-500 bg-brand-50/20' : ''}`}
                        >
                             <div className="flex justify-between items-center mb-3">
                                 <div className="flex items-center gap-3">
                                     {isBatchMode && (
                                         <div className={isSelected ? 'text-brand-500' : 'text-gray-300'}>
                                             {isSelected ? <CheckSquare size={20} /> : <Square size={20} />}
                                         </div>
                                     )}
                                     <div className={`w-8 h-8 rounded-full flex items-center justify-center ${zone.isOn ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100 text-gray-400'}`}>
                                         <Lightbulb size={18} />
                                     </div>
                                     <div onClick={() => !isBatchMode && openSettings(zone)} className={!isBatchMode ? "cursor-pointer" : ""}>
                                        <span className="font-bold text-gray-800">{zone.name}</span>
                                        {!isBatchMode && <p className="text-[10px] text-brand-500 font-medium">点击设置</p>}
                                     </div>
                                 </div>
                                 {!isBatchMode && (
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); handleToggleZone(zone.id); }}
                                        className={zone.isOn ? "text-green-500" : "text-gray-300"}
                                    >
                                        {zone.isOn ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
                                    </button>
                                 )}
                             </div>
                             <div className="grid grid-cols-2 gap-2 text-center text-xs text-gray-500 bg-gray-50 rounded-lg p-2">
                                 <div>
                                     <p className="text-gray-400 mb-1">亮度</p>
                                     <p className="font-bold text-gray-800">{zone.brightness}%</p>
                                 </div>
                                 <div className="border-l border-gray-200">
                                     <p className="text-gray-400 mb-1">运行模式</p>
                                     <p className="font-bold text-gray-800 truncate px-1">
                                         {zone.mode === 'AUTO' ? '感应自动' : zone.mode === 'SCHEDULE' ? zone.schedule : '手动控制'}
                                     </p>
                                 </div>
                             </div>
                         </div>
                     );
                 })}
            </div>

            {/* Individual Settings Modal */}
            {showSettingsModal && editingZone && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[100] animate-in fade-in">
                    <div className="bg-white w-full max-w-sm rounded-2xl p-6 space-y-6 animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center">
                            <h3 className="font-bold text-lg">{editingZone.name} 设置</h3>
                            <button onClick={() => setShowSettingsModal(false)} className="text-gray-400"><X size={20}/></button>
                        </div>

                        <div className="space-y-6">
                            {/* Switch */}
                            <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${editingZone.isOn ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-200 text-gray-400'}`}>
                                        <Lightbulb size={20} />
                                    </div>
                                    <span className="font-bold text-gray-700">灯光开关</span>
                                </div>
                                <button 
                                    onClick={() => setEditingZone({ ...editingZone, isOn: !editingZone.isOn, brightness: !editingZone.isOn ? 80 : 0 })}
                                    className={editingZone.isOn ? "text-brand-500" : "text-gray-300"}
                                >
                                    {editingZone.isOn ? <ToggleRight size={40} /> : <ToggleLeft size={40} />}
                                </button>
                            </div>

                            {/* Brightness */}
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-bold text-gray-700">亮度设置</span>
                                    <span className="text-brand-500 font-bold">{editingZone.brightness}%</span>
                                </div>
                                <input 
                                    type="range" 
                                    min="0" 
                                    max="100" 
                                    value={editingZone.brightness}
                                    onChange={(e) => setEditingZone({ ...editingZone, brightness: parseInt(e.target.value), isOn: parseInt(e.target.value) > 0 })}
                                    className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-brand-500"
                                />
                                <div className="flex justify-between text-[10px] text-gray-400">
                                    <span>0%</span>
                                    <span>50%</span>
                                    <span>100%</span>
                                </div>
                            </div>

                            {/* Mode */}
                            <div className="space-y-3">
                                <span className="text-sm font-bold text-gray-700">运行模式</span>
                                <div className="grid grid-cols-3 gap-2">
                                    {[
                                        { id: 'AUTO', name: '感应自动', desc: '感应触发' },
                                        { id: 'MANUAL', name: '手动控制', desc: '常亮/常灭' },
                                        { id: 'SCHEDULE', name: '定时开关', desc: '按时段运行' }
                                    ].map(m => (
                                        <button 
                                            key={m.id}
                                            onClick={() => setEditingZone({ ...editingZone, mode: m.id as any })}
                                            className={`p-2 rounded-xl border-2 transition-all flex flex-col items-center gap-1 ${editingZone.mode === m.id ? 'border-brand-500 bg-brand-50 text-brand-600' : 'border-gray-100 text-gray-400'}`}
                                        >
                                            <span className="text-xs font-bold">{m.name}</span>
                                            <span className="text-[8px] opacity-70 truncate w-full text-center">{m.desc}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Time Range Selection for SCHEDULE mode */}
                            {editingZone.mode === 'SCHEDULE' && (
                                <div className="space-y-3 animate-in slide-in-from-top duration-200">
                                    <span className="text-sm font-bold text-gray-700">开启时段 (24小时制)</span>
                                    <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
                                        <div className="flex-1">
                                            <p className="text-[10px] text-gray-400 mb-1 ml-1">开启时间</p>
                                            <input 
                                                type="time" 
                                                value={editingZone.schedule.split(' - ')[0] || '18:00'}
                                                onChange={(e) => {
                                                    const parts = editingZone.schedule.split(' - ');
                                                    const end = parts[1] || '06:00';
                                                    setEditingZone({ ...editingZone, schedule: `${e.target.value} - ${end}` });
                                                }}
                                                className="w-full bg-white border border-gray-200 rounded-lg p-2 text-sm font-mono outline-none focus:border-brand-500"
                                            />
                                        </div>
                                        <div className="text-gray-300 mt-4">至</div>
                                        <div className="flex-1">
                                            <p className="text-[10px] text-gray-400 mb-1 ml-1">关闭时间</p>
                                            <input 
                                                type="time" 
                                                value={editingZone.schedule.split(' - ')[1] || '06:00'}
                                                onChange={(e) => {
                                                    const parts = editingZone.schedule.split(' - ');
                                                    const start = parts[0] || '18:00';
                                                    setEditingZone({ ...editingZone, schedule: `${start} - ${e.target.value}` });
                                                }}
                                                className="w-full bg-white border border-gray-200 rounded-lg p-2 text-sm font-mono outline-none focus:border-brand-500"
                                            />
                                        </div>
                                    </div>
                                    <p className="text-[10px] text-gray-400 text-center">当前设置: {editingZone.schedule}</p>
                                </div>
                            )}
                        </div>

                        <button 
                            onClick={saveSettings}
                            className="w-full bg-brand-500 text-white py-3 rounded-xl font-bold shadow-lg shadow-brand-500/30 active:scale-95 transition-transform"
                        >
                            保存设置
                        </button>
                    </div>
                </div>
            )}

            {/* Batch Action Bar */}
            {isBatchMode && (
                <div className="fixed bottom-0 left-0 w-full max-w-md mx-auto bg-white border-t border-gray-200 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-20 flex justify-between items-center animate-in slide-in-from-bottom duration-300">
                    <button 
                        onClick={handleSelectAll}
                        className="flex items-center gap-2 text-sm text-gray-600 font-medium"
                    >
                        {selectedIds.length === zones.length ? <CheckSquare size={18} className="text-brand-500"/> : <Square size={18}/>}
                        全选
                    </button>
                    
                    <button 
                        onClick={() => setShowTimeModal(true)}
                        disabled={selectedIds.length === 0}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-bold text-sm transition-colors ${
                            selectedIds.length > 0 
                            ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/30' 
                            : 'bg-gray-100 text-gray-400'
                        }`}
                    >
                        <CalendarClock size={16} />
                        设置工作时间 ({selectedIds.length})
                    </button>
                </div>
            )}

            {/* Time Setting Modal */}
            {showTimeModal && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-6 animate-in fade-in">
                    <div className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-xl space-y-4 relative">
                         <div className="flex justify-between items-center mb-2">
                             <h3 className="font-bold text-lg text-gray-800">设置照明工作时间</h3>
                             <button onClick={() => setShowTimeModal(false)}><X size={20} className="text-gray-400" /></button>
                         </div>
                         <p className="text-xs text-gray-500">将为选中的 {selectedIds.length} 个区域应用以下时间表</p>

                         <div className="flex items-center gap-3">
                             <div className="flex-1">
                                 <label className="text-xs font-bold text-gray-600 block mb-1">开启时间</label>
                                 <input 
                                    type="time" 
                                    value={timeRange.start} 
                                    onChange={(e) => setTimeRange({...timeRange, start: e.target.value})}
                                    className="w-full bg-gray-50 p-3 rounded-lg border border-gray-200 font-mono text-center outline-none focus:border-brand-500"
                                 />
                             </div>
                             <span className="text-gray-300 mt-5">-</span>
                             <div className="flex-1">
                                 <label className="text-xs font-bold text-gray-600 block mb-1">关闭时间</label>
                                 <input 
                                    type="time" 
                                    value={timeRange.end}
                                    onChange={(e) => setTimeRange({...timeRange, end: e.target.value})}
                                    className="w-full bg-gray-50 p-3 rounded-lg border border-gray-200 font-mono text-center outline-none focus:border-brand-500"
                                 />
                             </div>
                         </div>

                         <div className="pt-4 flex gap-3">
                             <button 
                                onClick={() => setShowTimeModal(false)}
                                className="flex-1 py-3 text-sm font-bold text-gray-600 bg-gray-100 rounded-xl"
                             >
                                 取消
                             </button>
                             <button 
                                onClick={applySchedule}
                                className="flex-1 py-3 text-sm font-bold text-white bg-brand-500 rounded-xl shadow-lg shadow-brand-500/20"
                             >
                                 确认应用
                             </button>
                         </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export const Profile: React.FC<ProfileProps> = ({ user, onLogout, onUpdateUser, currentView, onChangeView, messages = [] }) => {
    const avatarInputRef = useRef<HTMLInputElement>(null);

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>, autoSave = false) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (event) => {
                if (event.target?.result) {
                    const newAvatar = event.target.result as string;
                    if (autoSave && onUpdateUser) {
                        onUpdateUser({
                            ...user,
                            avatar: newAvatar
                        });
                    }
                }
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };
  const [members, setMembers] = useState(MOCK_HOUSE_MEMBERS);
  const [workOrders, setWorkOrders] = useState(MOCK_WORK_ORDERS);
  const [selectedWorkOrderId, setSelectedWorkOrderId] = useState<string | null>(null);
  const [activeWorkOrderTab, setActiveWorkOrderTab] = useState('全部');
  const [workOrderSort, setWorkOrderSort] = useState<'TIME_ASC' | 'TIME_DESC' | 'URGENCY'>('TIME_ASC');
  const [myArticles] = useState(MOCK_NEWS.slice(0, 3)); 
  const [isAddingMember, setIsAddingMember] = useState(false);
  
  // Work Order Detail State
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState<'REJECT' | 'PROGRESS' | 'SUBMIT' | 'CHECKIN' | 'ACCEPT' | null>(null);
  const [actionFeedback, setActionFeedback] = useState('');
  const [actionImages, setActionImages] = useState<string[]>([]);

  // --- SUB-VIEW: HOUSE MEMBERS ---
  if (currentView === ViewState.PROFILE_HOUSE) {
      return <MyHouseView onChangeView={onChangeView!} />;
  }

  // --- SUB-VIEW: MY PARKING ---
  if (currentView === ViewState.PROFILE_MY_PARKING) {
      return <MyParkingView onChangeView={onChangeView!} />;
  }

  // --- SUB-VIEW: WORK ORDERS (STAFF ONLY) ---
  if (currentView === ViewState.PROFILE_WORK_ORDERS) {
      // Filter out WAIT_DISPATCH as they are only visible on Web Admin
      const visibleWorkOrders = workOrders.filter(wo => wo.status !== 'WAIT_DISPATCH');
      const tabs = ['全部', '待接单', '处理中', '待验收', '已驳回', '已完成', '已取消'];
      
      const getCount = (tab: string) => {
          if (tab === '全部') return visibleWorkOrders.length;
          if (tab === '待接单') return visibleWorkOrders.filter(wo => wo.status === 'WAIT_ACCEPT').length;
          if (tab === '处理中') return visibleWorkOrders.filter(wo => wo.status === 'PROCESSING').length;
          if (tab === '待验收') return visibleWorkOrders.filter(wo => wo.status === 'WAIT_VERIFY').length;
          if (tab === '已驳回') return visibleWorkOrders.filter(wo => wo.status === 'REJECTED').length;
          if (tab === '已完成') return visibleWorkOrders.filter(wo => wo.status === 'COMPLETED').length;
          if (tab === '已取消') return visibleWorkOrders.filter(wo => wo.status === 'CANCELLED').length;
          return 0;
      };

      const filteredOrders = visibleWorkOrders.filter(wo => {
          if (activeWorkOrderTab === '全部') return true;
          if (activeWorkOrderTab === '待接单') return wo.status === 'WAIT_ACCEPT';
          if (activeWorkOrderTab === '处理中') return wo.status === 'PROCESSING';
          if (activeWorkOrderTab === '待验收') return wo.status === 'WAIT_VERIFY';
          if (activeWorkOrderTab === '已驳回') return wo.status === 'REJECTED';
          if (activeWorkOrderTab === '已完成') return wo.status === 'COMPLETED';
          if (activeWorkOrderTab === '已取消') return wo.status === 'CANCELLED';
          return true;
      });

      const urgencyPriority: Record<string, number> = {
          'CRITICAL': 3,
          'URGENT': 2,
          'NORMAL': 1
      };

      const sortedOrders = [...filteredOrders].sort((a, b) => {
          if (workOrderSort === 'URGENCY') {
              const priorityA = urgencyPriority[a.urgency] || 0;
              const priorityB = urgencyPriority[b.urgency] || 0;
              if (priorityA !== priorityB) return priorityB - priorityA;
              // If urgency is same, fallback to time (earliest first)
              return new Date(a.time).getTime() - new Date(b.time).getTime();
          }
          if (workOrderSort === 'TIME_DESC') {
              return new Date(b.time).getTime() - new Date(a.time).getTime();
          }
          // Default: TIME_ASC (earliest first)
          return new Date(a.time).getTime() - new Date(b.time).getTime();
      });

      const STATUS_COLORS: Record<string, string> = {
          'WAIT_ACCEPT': 'bg-red-100 text-red-600',
          'WAIT_DISPATCH': 'bg-orange-100 text-orange-600',
          'PROCESSING': 'bg-blue-100 text-blue-600',
          'WAIT_VERIFY': 'bg-purple-100 text-purple-600',
          'COMPLETED': 'bg-green-100 text-green-600',
          'CANCELLED': 'bg-gray-100 text-gray-500',
          'REJECTED': 'bg-pink-100 text-pink-600'
      };

      const STATUS_LABELS: Record<string, string> = {
          'WAIT_ACCEPT': '待接单',
          'WAIT_DISPATCH': '待派单',
          'PROCESSING': '处理中',
          'WAIT_VERIFY': '待验收',
          'COMPLETED': '已完成',
          'CANCELLED': '已取消',
          'REJECTED': '已驳回'
      };

      return (
          <div className="min-h-full bg-gray-50 flex flex-col">
              <div className="bg-white p-4 flex items-center border-b sticky top-0 z-10">
                  <button onClick={() => onChangeView?.(ViewState.PROFILE)}><ChevronLeft /></button>
                  <span className="ml-4 font-bold text-lg">我的工单</span>
              </div>
              
               <div className="bg-white flex gap-6 px-4 overflow-x-auto no-scrollbar border-b sticky top-[61px] z-10">
                    {tabs.map(tab => (
                        <button 
                            key={tab} 
                            onClick={() => setActiveWorkOrderTab(tab)}
                            className={`py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors flex items-center gap-1.5 ${activeWorkOrderTab === tab ? 'text-brand-500 border-brand-500' : 'text-gray-500 border-transparent'}`}
                        >
                            {tab}
                            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${activeWorkOrderTab === tab ? 'bg-brand-100 text-brand-600' : 'bg-gray-100 text-gray-400'}`}>
                                {getCount(tab)}
                            </span>
                        </button>
                    ))}
               </div>

               <div className="bg-white px-4 py-2 flex justify-between items-center border-b text-[10px] text-gray-500 sticky top-[106px] z-10">
                    <span>共 {filteredOrders.length} 个工单</span>
                    <button 
                        onClick={() => {
                            if (workOrderSort === 'TIME_ASC') setWorkOrderSort('TIME_DESC');
                            else if (workOrderSort === 'TIME_DESC') setWorkOrderSort('URGENCY');
                            else setWorkOrderSort('TIME_ASC');
                        }}
                        className="flex items-center gap-1 text-brand-500 font-bold"
                    >
                        <ArrowUpDown size={12} />
                        排序: {
                            workOrderSort === 'TIME_ASC' ? '时间正序' : 
                            workOrderSort === 'TIME_DESC' ? '时间倒序' : '按紧急程度'
                        }
                    </button>
               </div>

               <div className="p-4 space-y-4 flex-1 overflow-y-auto">
                   {sortedOrders.length > 0 ? sortedOrders.map(wo => (
                       <div 
                        key={wo.id} 
                        className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 active:scale-[0.98] transition-transform" 
                        onClick={() => {
                            setSelectedWorkOrderId(wo.id);
                            onChangeView?.(ViewState.PROFILE_WORK_ORDER_DETAIL);
                        }}
                       >
                           <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center gap-2">
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                                        wo.urgency === 'CRITICAL' ? 'bg-red-500 text-white' :
                                        wo.urgency === 'URGENT' ? 'bg-orange-500 text-white' :
                                        'bg-blue-500 text-white'
                                    }`}>
                                        {wo.urgency === 'CRITICAL' ? '特急' : wo.urgency === 'URGENT' ? '紧急' : '一般'}
                                    </span>
                                    <h4 className="font-bold text-gray-800 text-sm">{wo.category}</h4>
                                </div>
                                <span className={`text-[10px] px-2 py-1 rounded font-medium ${STATUS_COLORS[wo.status]}`}>
                                    {STATUS_LABELS[wo.status]}
                                </span>
                           </div>
                           
                           <div className="space-y-2 mb-4">
                               <div className="flex items-start gap-2">
                                   <MapPin size={14} className="text-gray-400 mt-0.5 shrink-0" />
                                   <p className="text-xs text-gray-600 leading-relaxed">{wo.address}</p>
                               </div>
                               <div className="flex items-start gap-2">
                                   <AlertCircle size={14} className="text-gray-400 mt-0.5 shrink-0" />
                                   <p className="text-xs text-gray-500 line-clamp-2">{wo.description}</p>
                               </div>
                           </div>

                           <div className="flex justify-between items-center pt-3 border-t border-gray-50">
                               <div className="flex items-center gap-2">
                                   <div className="w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center text-[10px] text-gray-500 font-bold">
                                       {wo.reporter.slice(0, 1)}
                                   </div>
                                   <span className="text-[10px] text-gray-500">{wo.reporter}</span>
                               </div>
                               <div className="flex items-center gap-1 text-[10px] text-gray-400">
                                   <Clock size={12} />
                                   {wo.time}
                               </div>
                           </div>
                       </div>
                   )) : (
                       <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                           <ClipboardList size={48} className="opacity-20 mb-4" />
                           <p className="text-sm">暂无{activeWorkOrderTab}工单</p>
                       </div>
                   )}
               </div>
          </div>
      )
  }

  // --- SUB-VIEW: WORK ORDER DETAIL (Redesigned) ---
  if (currentView === ViewState.PROFILE_WORK_ORDER_DETAIL) {
      const wo = workOrders.find(w => w.id === selectedWorkOrderId) || workOrders[0];
      const isOps = user.role === UserRole.OPS_STAFF || user.role === UserRole.SUPER_ADMIN;
      
      const STATUS_LABELS: Record<string, string> = {
          'WAIT_DISPATCH': '待派单',
          'WAIT_ACCEPT': '待接单',
          'PROCESSING': '处理中',
          'WAIT_VERIFY': '待验收',
          'COMPLETED': '已完成',
          'CANCELLED': '已取消',
          'REJECTED': '已驳回'
      };

      const STATUS_COLORS: Record<string, string> = {
          'WAIT_DISPATCH': 'from-orange-400 to-orange-500',
          'WAIT_ACCEPT': 'from-red-400 to-red-500',
          'PROCESSING': 'from-blue-400 to-blue-500',
          'WAIT_VERIFY': 'from-purple-400 to-purple-500',
          'COMPLETED': 'from-green-400 to-green-500',
          'CANCELLED': 'from-gray-400 to-gray-500',
          'REJECTED': 'from-pink-400 to-pink-500'
      };

      const handleAction = (type: 'REJECT' | 'PROGRESS' | 'SUBMIT' | 'CHECKIN' | 'ACCEPT') => {
          if (type === 'ACCEPT') {
              const isReprocessing = wo.status === 'REJECTED';
              const newLog: WorkOrderLog = {
                  status: 'PROCESSING',
                  time: '刚刚',
                  action: isReprocessing ? '重新处理' : '接单处理',
                  operator: user.name,
                  content: isReprocessing ? '工单被驳回，重新开始处理。' : '已接单，准备前往现场。'
              };
              const updatedWo = { ...wo, status: 'PROCESSING' as const, logs: [...(wo.logs || []), newLog] };
              setWorkOrders(prev => prev.map(w => w.id === wo.id ? updatedWo : w));
              return;
          }
          
          if (type === 'CHECKIN') {
              const newLog: WorkOrderLog = {
                  status: 'PROCESSING',
                  time: '刚刚',
                  action: '现场签到',
                  operator: user.name,
                  location: wo.address,
                  content: '已到达现场。'
              };
              const updatedWo = { ...wo, logs: [...(wo.logs || []), newLog] };
              setWorkOrders(prev => prev.map(w => w.id === wo.id ? updatedWo : w));
              alert('签到成功！');
              return;
          }

          setActionType(type);
          setShowActionModal(true);
      };

      const handleConfirmAction = () => {
          if (!actionFeedback && actionType !== 'SUBMIT') {
              alert('请输入反馈内容');
              return;
          }
          if (actionType === 'SUBMIT' && actionImages.length < 1) {
              alert('请上传完工验收图');
              return;
          }

          let newStatus = wo.status;
          let actionLabel = '';

          if (actionType === 'REJECT') {
              newStatus = 'WAIT_DISPATCH';
              actionLabel = '无法处理';
          } else if (actionType === 'PROGRESS') {
              actionLabel = '进度更新';
          } else if (actionType === 'SUBMIT') {
              newStatus = 'WAIT_VERIFY';
              actionLabel = '提交验收';
          }

          const newLog: WorkOrderLog = {
              status: newStatus,
              time: '刚刚',
              action: actionLabel,
              operator: user.name,
              content: actionFeedback,
              images: actionImages
          };

          const updatedWo = {
              ...wo,
              status: newStatus,
              logs: [...(wo.logs || []), newLog]
          };

          setWorkOrders(prev => prev.map(w => w.id === wo.id ? updatedWo : w));
          setShowActionModal(false);
          setActionFeedback('');
          setActionImages([]);
          setActionType(null);
      };

      const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                if (reader.result) setActionImages([...actionImages, reader.result as string]);
            };
            reader.readAsDataURL(file);
        }
      };

      return (
          <div className="min-h-full bg-gray-50 flex flex-col relative">
              {/* Header */}
              <div className="bg-white p-4 flex items-center border-b sticky top-0 z-20">
                  <button onClick={() => onChangeView?.(ViewState.PROFILE_WORK_ORDERS)}><ChevronLeft /></button>
                  <span className="ml-4 font-bold text-lg">工单详情</span>
              </div>
              
              <div className="flex-1 overflow-y-auto pb-24">
                  {/* 1. Status Card */}
                  <div className={`m-4 p-5 rounded-xl text-white shadow-lg bg-gradient-to-r ${STATUS_COLORS[wo.status]}`}>
                      <div className="flex justify-between items-start">
                          <div>
                              <p className="text-white/80 text-xs mb-1">当前状态</p>
                              <h2 className="text-2xl font-bold">{STATUS_LABELS[wo.status]}</h2>
                          </div>
                          <ClipboardList size={32} className="text-white/30" />
                      </div>
                      <div className="mt-4 pt-3 border-t border-white/20 text-xs font-mono opacity-90">
                          单号: {wo.id.toUpperCase()}
                      </div>
                  </div>

                  {/* 2. Reporter Info */}
                  <div className="bg-white m-4 rounded-xl shadow-sm p-4 space-y-3">
                      <div className="flex justify-between items-center border-b border-gray-50 pb-2 mb-2">
                          <h3 className="font-bold text-gray-800 text-sm">报修信息</h3>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                                wo.urgency === 'CRITICAL' ? 'bg-red-500 text-white' :
                                wo.urgency === 'URGENT' ? 'bg-orange-500 text-white' :
                                'bg-blue-500 text-white'
                            }`}>
                                {wo.urgency === 'CRITICAL' ? '特急' : wo.urgency === 'URGENT' ? '紧急' : '一般'}
                            </span>
                      </div>
                      <div className="flex items-start gap-3">
                          <MapPin size={16} className="text-gray-400 mt-0.5" />
                          <span className="text-sm text-gray-700">{wo.address}</span>
                      </div>
                      <div className="flex items-center gap-3">
                          <UserPlus size={16} className="text-gray-400" />
                          <span className="text-sm text-gray-700">{wo.reporter}</span>
                          <span className="text-xs text-gray-400">({wo.phone})</span>
                          <a href={`tel:${wo.phone}`} className="ml-auto bg-brand-50 text-brand-500 p-1.5 rounded-full">
                              <Phone size={14} />
                          </a>
                      </div>
                      <div className="flex items-center gap-3">
                          <Clock size={16} className="text-gray-400" />
                          <span className="text-sm text-gray-700">{wo.time}</span>
                      </div>
                  </div>

                  {/* 3. Description & Evidence */}
                  <div className="bg-white m-4 rounded-xl shadow-sm p-4">
                      <h3 className="font-bold text-gray-800 text-sm mb-3 border-b border-gray-50 pb-2">故障描述</h3>
                      <p className="text-sm text-gray-600 mb-3">{wo.description}</p>
                      {wo.images && wo.images.length > 0 && (
                           <div className="grid grid-cols-4 gap-2">
                               {wo.images.map((img, i) => (
                                   <img key={i} src={img} className="rounded-lg w-full h-20 object-cover bg-gray-100 border border-gray-100" />
                               ))}
                           </div>
                       )}
                  </div>

                  {/* 4. Processing Timeline (Logs) */}
                  <div className="bg-white m-4 rounded-xl shadow-sm p-4">
                      <h3 className="font-bold text-gray-800 text-sm mb-4 border-b border-gray-50 pb-2">处理日志</h3>
                      <div className="relative pl-4 space-y-8 before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-[2px] before:bg-gray-100">
                          {wo.logs?.slice().reverse().map((log, index) => (
                              <div key={index} className="relative pl-6">
                                  {/* Dot */}
                                  <div className={`absolute left-0 top-1 w-2.5 h-2.5 rounded-full border-2 border-white shadow-sm z-10 ${
                                      log.status === 'COMPLETED' ? 'bg-green-500' :
                                      log.status === 'PROCESSING' ? 'bg-blue-500' : 
                                      log.status === 'WAIT_VERIFY' ? 'bg-purple-500' :
                                      log.status === 'REJECTED' ? 'bg-pink-500' : 'bg-orange-500'
                                  }`}></div>
                                  
                                  {/* Header */}
                                  <div className="flex justify-between items-start mb-1">
                                      <div>
                                          <span className="text-sm font-bold text-gray-800 mr-2">{log.action}</span>
                                          <span className="text-xs text-gray-500">{log.operator}</span>
                                      </div>
                                      <span className="text-[10px] text-gray-400 font-mono">{log.time}</span>
                                  </div>
                                  
                                  {/* Feedback Content */}
                                  {(log.content || log.location) && (
                                      <div className="bg-gray-50 rounded-lg p-3 mt-2 text-sm text-gray-600 leading-relaxed border border-gray-100">
                                          {log.location && <div className="flex items-center gap-1 text-[10px] text-brand-500 mb-1"><MapPin size={10} /> {log.location}</div>}
                                          {log.content}
                                      </div>
                                  )}

                                  {/* Feedback Images */}
                                  {log.images && log.images.length > 0 && (
                                      <div className="flex gap-2 mt-2">
                                          {log.images.map((img, imgIdx) => (
                                              <img key={imgIdx} src={img} className="w-16 h-16 rounded-lg object-cover border border-gray-200" />
                                          ))}
                                      </div>
                                  )}
                              </div>
                          ))}
                      </div>
                  </div>
              </div>

              {/* Action Bar (Ops Staff Only) */}
              {isOps && (
                  <div className="p-4 bg-white border-t border-gray-200 sticky bottom-0 z-30 flex gap-3">
                      {wo.status === 'WAIT_ACCEPT' && (
                          <>
                              <button 
                                  onClick={() => handleAction('REJECT')}
                                  className="flex-1 bg-white text-gray-600 py-3 rounded-xl font-bold border border-gray-200"
                              >
                                  无法处理
                              </button>
                              <button 
                                  onClick={() => handleAction('ACCEPT')}
                                  className="flex-[2] bg-brand-500 text-white py-3 rounded-xl font-bold shadow-lg shadow-brand-500/30"
                              >
                                  立即接单
                              </button>
                          </>
                      )}
                      
                      {wo.status === 'PROCESSING' && (
                          <>
                              <button 
                                  onClick={() => handleAction('CHECKIN')}
                                  className="flex-1 bg-white text-brand-500 py-3 rounded-xl font-bold border border-brand-100 flex items-center justify-center gap-1"
                              >
                                  <MapPin size={16} /> 签到
                              </button>
                              <button 
                                  onClick={() => handleAction('PROGRESS')}
                                  className="flex-1 bg-white text-gray-600 py-3 rounded-xl font-bold border border-gray-200"
                              >
                                  进度更新
                              </button>
                              <button 
                                  onClick={() => handleAction('SUBMIT')}
                                  className="flex-1 bg-brand-50 text-brand-600 py-3 rounded-xl font-bold border border-brand-100"
                              >
                                  提交验收
                              </button>
                          </>
                      )}

                      {wo.status === 'REJECTED' && (
                          <button 
                              onClick={() => handleAction('ACCEPT')}
                              className="w-full bg-brand-500 text-white py-3 rounded-xl font-bold shadow-lg shadow-brand-500/30"
                          >
                              重新处理
                          </button>
                      )}
                  </div>
              )}

              {/* Action Modal */}
              {showActionModal && (
                  <div className="fixed inset-0 z-50 bg-black/50 flex items-end justify-center animate-in fade-in duration-200">
                      <div className="bg-white w-full rounded-t-2xl p-4 animate-in slide-in-from-bottom duration-300">
                          <div className="flex justify-between items-center mb-4">
                              <h3 className="font-bold text-gray-800">
                                  {actionType === 'REJECT' ? '无法处理原因' : actionType === 'PROGRESS' ? '进度更新' : '提交验收'}
                              </h3>
                              <button onClick={() => { setShowActionModal(false); setActionType(null); }}><X size={20} className="text-gray-400" /></button>
                          </div>
                          
                          <textarea 
                              className="w-full bg-gray-50 p-3 rounded-xl h-32 outline-none text-sm resize-none mb-4"
                              placeholder={actionType === 'REJECT' ? '请输入无法处理的原因 (必填)...' : '请输入处理情况反馈...'}
                              value={actionFeedback}
                              onChange={e => setActionFeedback(e.target.value)}
                          />

                          <div className="mb-6">
                              <div className="flex justify-between items-center mb-2">
                                  <span className="text-xs font-bold text-gray-500">上传凭证 {actionType === 'SUBMIT' && <span className="text-red-500">(必传)</span>}</span>
                                  <span className="text-[10px] text-gray-400">{actionImages.length}/4</span>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                  {actionImages.map((img, i) => (
                                      <div key={i} className="relative w-20 h-20">
                                          <img src={img} className="w-full h-full rounded-xl object-cover border border-gray-100" />
                                          <button 
                                              onClick={() => setActionImages(prev => prev.filter((_, idx) => idx !== i))}
                                              className="absolute -top-1 -right-1 bg-black/50 text-white rounded-full p-0.5"
                                          >
                                              <X size={12} />
                                          </button>
                                      </div>
                                  ))}
                                  {actionImages.length < 4 && (
                                      <label className="w-20 h-20 rounded-xl border-2 border-dashed border-gray-100 flex flex-col items-center justify-center text-gray-400 hover:bg-gray-50 cursor-pointer">
                                          <Camera size={20} />
                                          <span className="text-[10px] mt-1">拍照/上传</span>
                                          <input type="file" accept="image/*" className="hidden" onChange={handleImageSelect} />
                                      </label>
                                  )}
                              </div>
                          </div>

                          <button 
                              onClick={handleConfirmAction}
                              className="w-full bg-brand-500 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-brand-500/30 active:scale-[0.98] transition-transform"
                          >
                              确认提交
                          </button>
                      </div>
                  </div>
              )}
          </div>
      )
  }

  // --- SUB-VIEW: KEY INSPECTION (STAFF ONLY) ---
  if (currentView === ViewState.PROFILE_KEY_INSPECTION) {
      return <KeyInspectionView onChangeView={onChangeView!} />;
  }

  // --- SUB-VIEWS: NEW STAFF MODULES ---
  if (currentView === ViewState.PROFILE_STAFF_REPORT) return <StaffReportView onChangeView={onChangeView!} />;
  if (currentView === ViewState.PROFILE_STAFF_VISITOR) return <StaffVisitorView onChangeView={onChangeView!} />;
  if (currentView === ViewState.PROFILE_STAFF_OPEN) return <StaffRemoteOpenView user={user} onChangeView={onChangeView!} />;
  if (currentView === ViewState.PROFILE_SMART_LIGHTING) return <StaffSmartLightingView onChangeView={onChangeView!} />;


  // --- SUB-VIEW: MY ARTICLES (Deprecated in favor of My Dynamics in video, but kept for compatibility) ---
  if (currentView === ViewState.PROFILE_MY_ARTICLES) {
      // For now redirect to My Dynamics or show simple list
      return <MyDynamicsView onChangeView={onChangeView!} />;
  }

  // --- SUB-VIEW: PERSONAL INFO ---
  if (currentView === ViewState.PROFILE_PERSONAL_INFO) {
      return <PersonalInfoView user={user} onUpdateUser={onUpdateUser!} onChangeView={onChangeView!} />;
  }

  // --- SUB-VIEW: SECURITY (RESET PASSWORD) ---
  if (currentView === ViewState.PROFILE_SECURITY) {
      return (
          <div className="min-h-full bg-white flex flex-col">
              <div className="bg-white p-4 flex items-center border-b sticky top-0">
                  <button onClick={() => onChangeView?.(ViewState.PROFILE_SETTINGS)}><ChevronLeft /></button>
                  <span className="ml-4 font-bold text-lg">重置密码</span>
              </div>
              <div className="p-8 flex-1">
                  <div className="flex flex-col items-center mb-8">
                      <div className="w-16 h-16 bg-brand-50 rounded-full flex items-center justify-center mb-4">
                          <Lock className="text-brand-500 w-8 h-8" />
                      </div>
                      <h2 className="text-lg font-bold text-gray-800">望山云居</h2>
                      <p className="text-xs text-gray-400">让社区生活更智慧!</p>
                  </div>
                  <div className="space-y-4">
                      <div className="relative">
                          <Smartphone className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                          <input type="text" placeholder="请输入手机号" className="w-full bg-gray-50 rounded-lg py-3 pl-10 pr-4 outline-none border border-transparent focus:border-brand-500 transition" />
                      </div>
                      <div className="flex gap-2">
                          <input type="text" placeholder="短信验证码" className="w-full bg-gray-50 rounded-lg py-3 pl-4 pr-4 outline-none border border-transparent focus:border-brand-500 transition" />
                          <button className="bg-brand-50 text-brand-500 px-4 rounded-lg text-sm font-medium whitespace-nowrap">发送验证码</button>
                      </div>
                      <div className="relative">
                          <Lock className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                          <input type="password" placeholder="请输入新密码" className="w-full bg-gray-50 rounded-lg py-3 pl-10 pr-4 outline-none border border-transparent focus:border-brand-500 transition" />
                      </div>
                      <div className="relative">
                          <Lock className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                          <input type="password" placeholder="请再次输入新密码" className="w-full bg-gray-50 rounded-lg py-3 pl-10 pr-4 outline-none border border-transparent focus:border-brand-500 transition" />
                      </div>
                  </div>
                  <button onClick={() => {alert('密码重置成功'); onChangeView?.(ViewState.PROFILE_SETTINGS)}} className="w-full bg-brand-500 text-white py-3 rounded-lg font-bold shadow-lg shadow-brand-500/30 mt-8">确认</button>
              </div>
          </div>
      )
  }

  // --- SUB-VIEW: FEEDBACK ---
  if (currentView === ViewState.PROFILE_FEEDBACK) {
      return (
          <div className="min-h-full bg-white flex flex-col">
              <div className="bg-white p-4 flex items-center border-b sticky top-0 relative">
                  <button onClick={() => onChangeView?.(ViewState.PROFILE_SETTINGS)}><ChevronLeft /></button>
                  <span className="ml-4 font-bold text-lg">意见反馈</span>
                  <button onClick={() => onChangeView?.(ViewState.PROFILE_FEEDBACK_HISTORY)} className="absolute right-4 text-xs text-gray-500">反馈记录</button>
              </div>
              <div className="p-4 space-y-6">
                  <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">标题</label>
                      <input className="w-full bg-gray-50 p-3 rounded-lg border-transparent focus:border-brand-500 border outline-none" placeholder="请输入标题" />
                  </div>
                  <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">内容</label>
                      <textarea className="w-full bg-gray-50 p-3 rounded-lg border-transparent focus:border-brand-500 border outline-none h-32" placeholder="输入您想要说的内容"></textarea>
                  </div>
                  <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">图片</label>
                      <div className="border-2 border-dashed border-gray-200 rounded-lg h-24 flex flex-col items-center justify-center text-gray-400">
                          <Camera size={24} />
                          <span className="text-xs mt-1">最多9张</span>
                      </div>
                  </div>
                  <button onClick={() => {alert('反馈已收到'); onChangeView?.(ViewState.PROFILE_SETTINGS)}} className="w-full bg-brand-500 text-white py-3 rounded-lg font-bold shadow-lg shadow-brand-500/30 mt-4">提交</button>
              </div>
          </div>
      )
  }

  // --- SUB-VIEW: FEEDBACK HISTORY ---
  if (currentView === ViewState.PROFILE_FEEDBACK_HISTORY) {
      return (
          <div className="min-h-full bg-gray-50 flex flex-col">
              <div className="bg-white p-4 flex items-center border-b sticky top-0">
                  <button onClick={() => onChangeView?.(ViewState.PROFILE_FEEDBACK)}><ChevronLeft /></button>
                  <span className="ml-4 font-bold text-lg">已反馈记录</span>
              </div>
              <div className="p-4 space-y-4">
                  {MOCK_FEEDBACKS.map(item => (
                      <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm">
                          <div className="flex justify-between items-start mb-2">
                              <h4 className="font-bold text-gray-800 text-sm flex-1">{item.title}</h4>
                              <span className={`text-[10px] px-2 py-1 rounded ml-2 whitespace-nowrap ${item.status === 'PROCESSED' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                                  {item.status === 'PROCESSED' ? '已处理' : '待处理'}
                              </span>
                          </div>
                          <p className="text-xs text-gray-500 mb-2">{item.content}</p>
                          <div className="text-[10px] text-gray-400">{item.time}</div>
                          {item.reply && (
                              <div className="mt-3 bg-gray-50 p-2 rounded text-xs text-gray-600">
                                  <span className="font-bold">回复：</span>{item.reply}
                              </div>
                          )}
                      </div>
                  ))}
              </div>
          </div>
      )
  }

  // --- SUB-VIEW: ABOUT ---
  if (currentView === ViewState.PROFILE_ABOUT) {
      return (
          <div className="min-h-full bg-white flex flex-col">
              <div className="bg-white p-4 flex items-center border-b sticky top-0">
                  <button onClick={() => onChangeView?.(ViewState.PROFILE_SETTINGS)}><ChevronLeft /></button>
                  <span className="ml-4 font-bold text-lg">关于</span>
              </div>
              <div className="p-8 flex flex-col items-center flex-1">
                  <div className="w-20 h-20 bg-brand-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-brand-500/20">
                      <Home className="text-white w-10 h-10" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">望山云居 APP</h2>
                  <p className="text-sm text-gray-500 mt-1 mb-8">V1.0.0 2025010</p>
                  
                  <div className="w-full space-y-4">
                      <div className="flex justify-between items-center py-3 border-b border-gray-50">
                          <span className="text-gray-600">客服电话</span>
                          <span className="text-blue-500">13775061756</span>
                      </div>
                      <div className="flex justify-between items-center py-3 border-b border-gray-50">
                          <span className="text-gray-600">版权信息</span>
                          <span className="text-gray-400 text-xs">©2025 XX公司 保留所有权利</span>
                      </div>
                  </div>

                  <button onClick={() => onChangeView?.(ViewState.PROFILE_SETTINGS)} className="mt-auto w-full bg-gray-100 text-gray-600 py-3 rounded-lg font-medium">关闭</button>
              </div>
          </div>
      )
  }

  // --- SUB-VIEW: SETTINGS ---
  if (currentView === ViewState.PROFILE_SETTINGS) {
      return (
          <div className="min-h-full bg-gray-50 flex flex-col">
              <div className="bg-white p-4 flex items-center border-b sticky top-0">
                  <button onClick={() => onChangeView?.(ViewState.PROFILE)}><ChevronLeft /></button>
                  <span className="ml-4 font-bold text-lg">设置</span>
              </div>
              <div className="p-4 space-y-4">
                   <div className="bg-white rounded-xl overflow-hidden shadow-sm">
                        <button onClick={() => onChangeView?.(ViewState.PROFILE_PERSONAL_INFO)} className="w-full p-4 flex items-center justify-between border-b border-gray-50 active:bg-gray-50">
                            <span className="text-sm text-gray-700">个人信息</span>
                            <ChevronRight size={16} className="text-gray-300" />
                        </button>
                        <button onClick={() => onChangeView?.(ViewState.PROFILE_SECURITY)} className="w-full p-4 flex items-center justify-between border-b border-gray-50 active:bg-gray-50">
                            <span className="text-sm text-gray-700">重置密码</span>
                            <ChevronRight size={16} className="text-gray-300" />
                        </button>
                   </div>

                   <div className="bg-white rounded-xl overflow-hidden shadow-sm">
                        <button onClick={() => onChangeView?.(ViewState.PROFILE_FEEDBACK)} className="w-full p-4 flex items-center justify-between border-b border-gray-50 active:bg-gray-50">
                            <span className="text-sm text-gray-700">意见反馈</span>
                            <ChevronRight size={16} className="text-gray-300" />
                        </button>
                        <button onClick={() => onChangeView?.(ViewState.PROFILE_ABOUT)} className="w-full p-4 flex items-center justify-between border-b border-gray-50 active:bg-gray-50">
                            <span className="text-sm text-gray-700">关于我们</span>
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-400">v1.0.0</span>
                                <ChevronRight size={16} className="text-gray-300" />
                            </div>
                        </button>
                   </div>

                   <button onClick={onLogout} className="w-full bg-white text-red-500 py-3 rounded-xl font-medium shadow-sm mt-4">
                       退出登录
                   </button>
              </div>
          </div>
      )
  }

  // --- SUB-VIEW: MY DYNAMICS (as part of PROFILE_MY_DYNAMICS view) ---
  if (currentView === ViewState.PROFILE_MY_DYNAMICS) {
      return <MyDynamicsView onChangeView={onChangeView!} />;
  }


  // --- MAIN VIEW ---
  return (
    <div className="min-h-full bg-gray-50 pb-20">
      <input 
        type="file" 
        ref={avatarInputRef} 
        className="hidden" 
        accept="image/*" 
        onChange={(e) => handleAvatarChange(e, currentView === ViewState.PROFILE)} 
      />
      {/* Header Card - Compact */}
      <div className="bg-gradient-to-br from-brand-500 to-brand-600 pt-10 pb-16 px-5 rounded-b-[2rem] text-white relative shadow-lg">
        <div className="absolute top-6 right-5 flex gap-2">
            <button 
                onClick={() => onChangeView?.(ViewState.MESSAGE_CENTER)} 
                className="relative p-2 bg-white/10 rounded-full backdrop-blur-sm active:bg-white/20 transition-colors"
            >
                <Bell size={18} className="text-white" />
                {messages.some(m => !m.read) && (
                    <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 border border-white rounded-full"></div>
                )}
            </button>
            <button onClick={() => onChangeView?.(ViewState.PROFILE_SETTINGS)} className="p-2 bg-white/10 rounded-full backdrop-blur-sm active:bg-white/20 transition-colors">
                <Settings size={18} className="text-white" />
            </button>
        </div>
        <div className="flex items-center gap-4">
            <div 
                className="relative cursor-pointer active:scale-95 transition-transform group"
                onClick={() => avatarInputRef.current?.click()}
            >
                <img src={user.avatar} alt="Avatar" className="w-16 h-16 rounded-full border-2 border-white shadow-md object-cover" />
                <div className="absolute bottom-0 right-0 bg-yellow-400 border border-white w-4 h-4 rounded-full"></div>
                <div className="absolute inset-0 bg-black/20 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <Camera size={16} className="text-white" />
                </div>
            </div>
            <div>
                <h2 className="text-xl font-bold tracking-wide">{user.name}</h2>
                <div className="flex items-center gap-2 mt-1.5">
                    <span className="bg-black/20 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-medium border border-white/10">{ROLE_MAP[user.role]}</span>
                    <span className="text-xs text-white/90 font-medium">{user.communityName}</span>
                </div>
            </div>
        </div>
      </div>

      {/* Stats Card - Removed */}


      {/* Content Area */}
      <div className="px-4 space-y-3">
        
        {/* Owner Services Workbench (Replaced List with Grid) */}
        <div className="bg-white rounded-xl overflow-hidden shadow-sm p-4">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-gray-800">我的服务</h3>
                <span className="text-[10px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">专属服务</span>
            </div>
            
            <div className="grid grid-cols-4 gap-4">
                <button onClick={() => onChangeView?.(ViewState.PROFILE_MY_DYNAMICS)} className="flex flex-col items-center gap-2 group">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center group-active:scale-90 transition-transform shadow-sm shadow-blue-100">
                        <FileText size={22} />
                    </div>
                    <span className="text-xs font-medium text-gray-600">我的动态</span>
                </button>

                <button onClick={() => onChangeView?.(ViewState.PROFILE_HOUSE)} className="flex flex-col items-center gap-2 group">
                    <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-500 flex items-center justify-center group-active:scale-90 transition-transform shadow-sm shadow-purple-100">
                        <Home size={22} />
                    </div>
                    <span className="text-xs font-medium text-gray-600">我的房屋</span>
                </button>

                <button onClick={() => onChangeView?.(ViewState.PROFILE_MY_PARKING)} className="flex flex-col items-center gap-2 group">
                    <div className="w-12 h-12 rounded-2xl bg-green-50 text-green-500 flex items-center justify-center group-active:scale-90 transition-transform shadow-sm shadow-green-100">
                        <Car size={22} />
                    </div>
                    <span className="text-xs font-medium text-gray-600">我的车位</span>
                </button>
            </div>
        </div>

        {/* Property Staff Workbench */}
        {(user.role === UserRole.PROPERTY_STAFF || user.role === UserRole.SUPER_ADMIN) && (
             <div className="bg-white rounded-xl overflow-hidden shadow-sm p-4">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-gray-800">物业工作台</h3>
                    <span className="text-[10px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">综合管理</span>
                </div>
                
                <div className="grid grid-cols-4 gap-4">
                    {/* Property Reporting */}
                    <button onClick={() => onChangeView?.(ViewState.PROFILE_STAFF_REPORT)} className="flex flex-col items-center gap-2 group">
                        <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-500 flex items-center justify-center group-active:scale-90 transition-transform shadow-sm shadow-purple-100">
                            <FilePlus size={22} />
                        </div>
                        <span className="text-xs font-medium text-gray-600">物业报事</span>
                    </button>

                    {/* Visitor */}
                    <button onClick={() => onChangeView?.(ViewState.PROFILE_STAFF_VISITOR)} className="flex flex-col items-center gap-2 group">
                        <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center group-active:scale-90 transition-transform shadow-sm shadow-blue-100">
                            <UserPlus size={22} />
                        </div>
                        <span className="text-xs font-medium text-gray-600">访客登记</span>
                    </button>

                    {/* Remote Open */}
                    <button onClick={() => onChangeView?.(ViewState.PROFILE_STAFF_OPEN)} className="flex flex-col items-center gap-2 group">
                        <div className="w-12 h-12 rounded-2xl bg-green-50 text-green-500 flex items-center justify-center group-active:scale-90 transition-transform shadow-sm shadow-green-100">
                            <Unlock size={22} />
                        </div>
                        <span className="text-xs font-medium text-gray-600">远程开门</span>
                    </button>

                     {/* Smart Lighting */}
                    <button onClick={() => onChangeView?.(ViewState.PROFILE_SMART_LIGHTING)} className="flex flex-col items-center gap-2 group">
                        <div className="w-12 h-12 rounded-2xl bg-yellow-50 text-yellow-500 flex items-center justify-center group-active:scale-90 transition-transform shadow-sm shadow-yellow-100">
                            <Lightbulb size={22} />
                        </div>
                        <span className="text-xs font-medium text-gray-600">智慧照明</span>
                    </button>

                    {/* Key Inspection */}
                    <button onClick={() => onChangeView?.(ViewState.PROFILE_KEY_INSPECTION)} className="flex flex-col items-center gap-2 group">
                        <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center group-active:scale-90 transition-transform shadow-sm shadow-red-100">
                            <Shield size={22} />
                        </div>
                        <span className="text-xs font-medium text-gray-600">重点稽查</span>
                    </button>
                </div>
             </div>
        )}

        {/* Ops Staff Workbench */}
        {(user.role === UserRole.OPS_STAFF || user.role === UserRole.SUPER_ADMIN) && (
             <div className="bg-white rounded-xl overflow-hidden shadow-sm p-4">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-gray-800">运维工作台</h3>
                    <span className="text-[10px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">工程/运维专享</span>
                </div>
                
                <div className="grid grid-cols-4 gap-4">
                     {/* Work Orders */}
                    <button onClick={() => onChangeView?.(ViewState.PROFILE_WORK_ORDERS)} className="flex flex-col items-center gap-2 group relative">
                        <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center group-active:scale-90 transition-transform shadow-sm shadow-orange-100">
                            <ClipboardList size={22} />
                        </div>
                        <span className="text-xs font-medium text-gray-600">工单处理</span>
                        <span className="absolute -top-1 right-2 w-4 h-4 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full border-2 border-white shadow-sm">3</span>
                    </button>
                </div>
             </div>
        )}
        
        <div className="text-center pt-2 pb-8">
            <p className="text-[10px] text-gray-300 transform scale-90">望山云居 v1.0.0</p>
        </div>
      </div>
    </div>
  );
};
