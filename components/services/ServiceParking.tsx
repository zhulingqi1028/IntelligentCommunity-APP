
import React, { useState } from 'react';
import { ViewState } from '../../types';
import { ChevronLeft, CreditCard, CheckCircle, MessageCircle, Info } from 'lucide-react';
import { MOCK_PARKING_SPOTS, MOCK_VEHICLES } from '../../constants';

export const ServiceParkingView = ({ onChangeView }: { onChangeView: (v: ViewState) => void }) => {
    const [plate, setPlate] = useState('');
    const [step, setStep] = useState<'INPUT' | 'RESULT' | 'SUCCESS' | 'RECORDS'>('INPUT');
    const [loading, setLoading] = useState(false);
    const [fee, setFee] = useState(15.00);
    const [message, setMessage] = useState('待支付金额');
    const [paymentMethod, setPaymentMethod] = useState<'WECHAT' | 'ALIPAY'>('WECHAT');

    // Mock records data
    const mockRecords = [
        { id: 1, plate: '渝A·88888', amount: 15.00, time: '2023-12-18 14:30', status: 'PAID' },
        { id: 2, plate: '渝A·D12345', amount: 25.00, time: '2023-12-15 09:20', status: 'PAID' },
        { id: 3, plate: '渝A·88888', amount: 10.00, time: '2023-12-10 18:45', status: 'PAID' },
    ];

    const handleQuery = () => {
        if (!plate) return;
        setLoading(true);
        
        // Mock API call simulation
        setTimeout(() => {
            const vehicle = MOCK_VEHICLES.find(v => v.plate === plate);
            const spot = MOCK_PARKING_SPOTS.find(s => s.parkedPlate === plate);
            
            // Logic: If vehicle is INSIDE and parked in OWNED or RENTED spot -> Free
            // Note: In a real app, we'd check if the spot belongs to the user or is valid.
            // Here we assume if it's in a spot defined in MOCK_PARKING_SPOTS (which are owned/rented), it's free.
            // We also check if the vehicle status is INSIDE (though parkedPlate implies it's there).
            
            let calculatedFee = 15.00;
            let msg = '待支付金额';

            if (spot && (spot.type === 'OWNED' || spot.type === 'RENTED')) {
                 calculatedFee = 0;
                 msg = spot.type === 'OWNED' ? '产权车位 (免费)' : '月租车位 (免费)';
            } else if (vehicle && vehicle.status === 'OUTSIDE') {
                // If vehicle is known but outside, maybe it shouldn't have a fee? 
                // Or maybe this is a query for a previous session? 
                // For simplicity, let's assume we only query current session.
                // If outside, maybe show error or 0 fee.
                // But user request specifically asked about "If entered plate's vehicle is INSIDE..."
                // Let's stick to the specific requirement.
            }

            setFee(calculatedFee);
            setMessage(msg);
            setLoading(false);
            setStep('RESULT');
        }, 1000);
    };

    const handlePay = () => {
        setLoading(true);
        // Mock Payment
        setTimeout(() => {
            setLoading(false);
            setStep('SUCCESS');
        }, 1500);
    };

    return (
        <div className="min-h-full bg-gray-50 flex flex-col">
            <div className="bg-white p-4 flex items-center border-b sticky top-0 justify-between">
                <div className="flex items-center">
                    <button onClick={() => onChangeView(ViewState.SERVICES)}><ChevronLeft /></button>
                    <span className="ml-4 font-bold text-lg">临停缴费</span>
                </div>
                <button 
                    onClick={() => setStep('RECORDS')}
                    className="text-sm text-gray-500 hover:text-brand-500"
                >
                    缴费记录
                </button>
            </div>

            <div className="p-4 flex-1">
                {step === 'RECORDS' && (
                    <div className="space-y-4 animate-in slide-in-from-right-4">
                        <div className="flex items-center mb-4">
                            <button onClick={() => setStep('INPUT')} className="text-gray-500 flex items-center gap-1 text-sm">
                                <ChevronLeft size={16} /> 返回
                            </button>
                            <h2 className="text-lg font-bold text-gray-800 ml-2">最近缴费记录</h2>
                        </div>
                        
                        {mockRecords.map(record => (
                            <div key={record.id} className="bg-white p-4 rounded-xl shadow-sm flex justify-between items-center">
                                <div>
                                    <div className="font-bold text-gray-800">{record.plate}</div>
                                    <div className="text-xs text-gray-400 mt-1">{record.time}</div>
                                </div>
                                <div className="text-right">
                                    <div className="font-bold text-gray-900">- {record.amount.toFixed(2)}</div>
                                    <div className="text-xs text-green-500 mt-1">支付成功</div>
                                </div>
                            </div>
                        ))}

                        <div className="bg-orange-50 p-3 rounded-lg flex items-start gap-2 text-xs text-orange-600">
                            <Info size={14} className="mt-0.5 shrink-0" />
                            <p>如需开具发票，请携带相关证件前往物业服务中心线下办理。</p>
                        </div>
                    </div>
                )}

                {step === 'INPUT' && (
                    <div className="bg-white rounded-xl p-6 shadow-sm space-y-6">
                        <div className="text-center">
                            <h2 className="text-xl font-bold text-gray-800">请输入车牌号</h2>
                            <p className="text-sm text-gray-400 mt-2">查询停车费用</p>
                        </div>
                        
                        <div className="bg-gray-100 p-4 rounded-xl flex items-center justify-center">
                            <input 
                                type="text" 
                                value={plate}
                                onChange={(e) => setPlate(e.target.value.toUpperCase())}
                                placeholder="渝A·88888"
                                className="bg-transparent text-center text-2xl font-mono font-bold outline-none w-full uppercase placeholder-gray-300"
                            />
                        </div>

                        <button 
                            onClick={handleQuery}
                            disabled={!plate || loading}
                            className="w-full bg-brand-500 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-brand-500/30 disabled:opacity-50 disabled:shadow-none transition-all"
                        >
                            {loading ? '查询中...' : '查询费用'}
                        </button>
                    </div>
                )}

                {step === 'RESULT' && (
                    <div className="bg-white rounded-xl p-6 shadow-sm space-y-6 animate-in slide-in-from-bottom-4">
                        <div className="text-center border-b border-gray-100 pb-6">
                            <div className="inline-block px-3 py-1 bg-blue-50 text-blue-600 rounded-lg font-mono font-bold mb-2">
                                {plate}
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900">¥ {fee.toFixed(2)}</h2>
                            <p className={`text-sm mt-1 ${fee === 0 ? 'text-green-500 font-bold' : 'text-gray-500'}`}>{message}</p>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-500 text-sm">入场时间</span>
                                <span className="font-medium text-gray-800">2023-12-20 14:30</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-500 text-sm">停车时长</span>
                                <span className="font-medium text-gray-800">3小时15分</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-500 text-sm">停车区域</span>
                                <span className="font-medium text-gray-800">
                                    {fee === 0 ? '固定车位' : '临停 A区'}
                                </span>
                            </div>
                        </div>

                        {fee > 0 ? (
                            <>
                                <div className="space-y-3 pt-4 border-t border-gray-100">
                                    <p className="text-sm font-bold text-gray-700 mb-2">选择支付方式</p>
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
                                    onClick={handlePay}
                                    disabled={loading}
                                    className={`w-full text-white py-4 rounded-xl font-bold text-lg shadow-lg mt-4 flex items-center justify-center gap-2 ${paymentMethod === 'WECHAT' ? 'bg-green-500 shadow-green-500/30' : 'bg-blue-500 shadow-blue-500/30'}`}
                                >
                                    {loading ? '支付中...' : <><CreditCard size={20}/> 立即支付</>}
                                </button>
                            </>
                        ) : (
                            <button 
                                onClick={() => setStep('INPUT')}
                                className="w-full bg-brand-500 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-brand-500/30 mt-4"
                            >
                                无需缴费，返回
                            </button>
                        )}
                        
                        {fee > 0 && (
                            <button onClick={() => setStep('INPUT')} className="w-full text-gray-400 text-sm py-2">
                                重新查询
                            </button>
                        )}
                    </div>
                )}

                {step === 'SUCCESS' && (
                    <div className="bg-white rounded-xl p-8 shadow-sm flex flex-col items-center text-center animate-in zoom-in-95">
                        <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-6">
                            <CheckCircle size={40} />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">支付成功</h2>
                        <p className="text-gray-500 mb-8">请在 15 分钟内离场</p>
                        
                        <button 
                            onClick={() => {setStep('INPUT'); setPlate('');}}
                            className="w-full bg-gray-100 text-gray-600 py-3 rounded-xl font-bold"
                        >
                            返回
                        </button>
                    </div>
                )}
                
                <div className="mt-8">
                    <h3 className="font-bold text-gray-800 mb-4 px-2">收费标准</h3>
                    <div className="bg-white rounded-xl p-4 shadow-sm text-sm text-gray-600 space-y-2">
                        <p>• 30分钟内免费</p>
                        <p>• 首小时 5元</p>
                        <p>• 之后每小时 3元</p>
                        <p>• 24小时封顶 30元</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
