
import React, { useState } from 'react';
import { ChevronLeft, History, Trash2, Car, Zap, Plus, X, AlertTriangle, MessageCircle, CreditCard, CheckCircle, Info } from 'lucide-react';
import { ViewState, ParkingSpot } from '../../types';
import { MOCK_VEHICLES, MOCK_PARKING_SPOTS } from '../../constants';

interface MyParkingViewProps {
    onChangeView: (v: ViewState) => void;
}

export const MyParkingView: React.FC<MyParkingViewProps> = ({ onChangeView }) => {
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

        const currentExpiry = new Date(renewingSpot.expiryDate);
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
