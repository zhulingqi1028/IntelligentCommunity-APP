
import React, { useState } from 'react';
import { ViewState } from '../../types';
import { MOCK_BILLS, MOCK_USER } from '../../constants';
import { ChevronLeft, Home, Receipt, CheckCircle, Circle, ChevronDown, FileText, X, MessageCircle, CreditCard, Loader2, Info, Phone } from 'lucide-react';

interface House {
    id: string;
    communityName: string;
    unit: string;
    ownerName: string;
    role: string;
}

const MOCK_HOUSES_FEES: House[] = [
    {
        id: 'h1',
        communityName: '幸福小区',
        unit: '1栋 1单元 101',
        ownerName: '张三',
        role: '业主'
    },
    {
        id: 'h2',
        communityName: '阳光花园',
        unit: '3栋 2单元 606',
        ownerName: '张三',
        role: '业主'
    },
    {
        id: 'h3',
        communityName: '翡翠城',
        unit: '5栋 1单元 802',
        ownerName: '张三',
        role: '业主'
    },
    {
        id: 'h4',
        communityName: '滨江一号',
        unit: '2栋 3单元 1201',
        ownerName: '张三',
        role: '租户'
    },
    {
        id: 'h5',
        communityName: '中央公园',
        unit: '8栋 2单元 303',
        ownerName: '张三',
        role: '业主'
    }
];

// Extend MOCK_BILLS to include houseId
const MOCK_BILLS_WITH_HOUSE = [
    ...MOCK_BILLS.map(b => ({ ...b, houseId: 'h1' })),
    {
        id: 'b_1001',
        title: '2024年1月物业费',
        amount: 280.00,
        month: '2024-01',
        status: 'UNPAID',
        date: '2024-01-31',
        houseId: 'h2',
        items: [
            { name: '物业服务费', amount: 200.00 },
            { name: '公摊水电费', amount: 50.00 },
            { name: '垃圾处理费', amount: 30.00 }
        ]
    },
    {
        id: 'b_1002',
        title: '2023年12月物业费',
        amount: 280.00,
        month: '2023-12',
        status: 'PAID',
        date: '2023-12-31',
        houseId: 'h2',
        items: [
            { name: '物业服务费', amount: 200.00 },
            { name: '公摊水电费', amount: 50.00 },
            { name: '垃圾处理费', amount: 30.00 }
        ]
    },
    {
        id: 'b_1003',
        title: '2024年2月物业费',
        amount: 320.00,
        month: '2024-02',
        status: 'UNPAID',
        date: '2024-02-28',
        houseId: 'h3',
        items: [
            { name: '物业服务费', amount: 240.00 },
            { name: '公摊水电费', amount: 50.00 },
            { name: '垃圾处理费', amount: 30.00 }
        ]
    },
    {
        id: 'b_1004',
        title: '2024年1月物业费',
        amount: 150.00,
        month: '2024-01',
        status: 'UNPAID',
        date: '2024-01-31',
        houseId: 'h4',
        items: [
            { name: '物业服务费', amount: 100.00 },
            { name: '公摊水电费', amount: 30.00 },
            { name: '垃圾处理费', amount: 20.00 }
        ]
    },
    {
        id: 'b_1005',
        title: '2024年3月物业费',
        amount: 400.00,
        month: '2024-03',
        status: 'UNPAID',
        date: '2024-03-31',
        houseId: 'h5',
        items: [
            { name: '物业服务费', amount: 300.00 },
            { name: '公摊水电费', amount: 70.00 },
            { name: '垃圾处理费', amount: 30.00 }
        ]
    }
];

export const ServiceFeesView = ({ onChangeView }: { onChangeView: (v: ViewState) => void }) => {
    const [activeTab, setActiveTab] = useState<'UNPAID' | 'PAID'>('UNPAID');
    const [selectedHouseId, setSelectedHouseId] = useState<string>(MOCK_HOUSES_FEES[0].id);
    // Use local state for bills to simulate payment updates
    const [bills, setBills] = useState(MOCK_BILLS_WITH_HOUSE);
    const [selectedBillIds, setSelectedBillIds] = useState<string[]>([]);
    const [expandedBillId, setExpandedBillId] = useState<string | null>(null);
    
    // Payment State
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<'WECHAT' | 'ALIPAY'>('WECHAT');
    const [isPaying, setIsPaying] = useState(false);

    const currentHouse = MOCK_HOUSES_FEES.find(h => h.id === selectedHouseId) || MOCK_HOUSES_FEES[0];

    const unpaidBills = bills.filter(b => b.status === 'UNPAID' && b.houseId === selectedHouseId);
    const paidBills = bills.filter(b => b.status === 'PAID' && b.houseId === selectedHouseId);
    const displayBills = activeTab === 'UNPAID' ? unpaidBills : paidBills;

    const toggleSelection = (id: string) => {
        if (selectedBillIds.includes(id)) {
            setSelectedBillIds(selectedBillIds.filter(sid => sid !== id));
        } else {
            setSelectedBillIds([...selectedBillIds, id]);
        }
    };

    const toggleAll = () => {
        if (selectedBillIds.length === unpaidBills.length) {
            setSelectedBillIds([]);
        } else {
            setSelectedBillIds(unpaidBills.map(b => b.id));
        }
    };

    const totalAmount = unpaidBills
        .filter(b => selectedBillIds.includes(b.id))
        .reduce((sum, b) => sum + b.amount, 0);

    const handlePayClick = () => {
        if (selectedBillIds.length === 0) return;
        setShowPaymentModal(true);
    };

    const handleConfirmPayment = () => {
        setIsPaying(true);
        // Simulate API call
        setTimeout(() => {
            // Update bills status
            const now = new Date();
            const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
            
            setBills(prev => prev.map(bill => 
                selectedBillIds.includes(bill.id) 
                    ? { ...bill, status: 'PAID', date: dateStr } 
                    : bill
            ));
            
            setIsPaying(false);
            setShowPaymentModal(false);
            setSelectedBillIds([]);
            setActiveTab('PAID'); // Switch to history view
            alert('缴费成功！');
        }, 1500);
    };

    return (
        <div className="min-h-full bg-gray-50 flex flex-col relative">
            {/* Header */}
            <div className="bg-white p-4 flex items-center border-b sticky top-0 z-20">
                <button onClick={() => onChangeView(ViewState.SERVICES)}><ChevronLeft /></button>
                <span className="ml-4 font-bold text-lg">物业缴费</span>
            </div>
            
            <div className="p-4 pb-24">
                {/* House Selection */}
                <div className="mb-6">
                    <h3 className="text-sm font-bold text-gray-500 mb-3 px-1">选择房屋</h3>
                    <div className="flex gap-3 overflow-x-auto pb-4 snap-x">
                        {MOCK_HOUSES_FEES.map(house => {
                            const isSelected = selectedHouseId === house.id;
                            return (
                                <button
                                    key={house.id}
                                    onClick={() => { setSelectedHouseId(house.id); setSelectedBillIds([]); }}
                                    className={`flex-shrink-0 w-40 p-3 rounded-xl border-2 text-left transition-all snap-start ${
                                        isSelected 
                                            ? 'border-brand-500 bg-brand-50 ring-2 ring-brand-200 ring-offset-1' 
                                            : 'border-gray-100 bg-white hover:border-brand-200'
                                    }`}
                                >
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${isSelected ? 'bg-brand-500 text-white' : 'bg-gray-100 text-gray-400'}`}>
                                            <Home size={12} />
                                        </div>
                                        <span className={`text-xs px-1.5 py-0.5 rounded ${isSelected ? 'bg-brand-200 text-brand-700' : 'bg-gray-100 text-gray-500'}`}>
                                            {house.role}
                                        </span>
                                    </div>
                                    <div className={`font-bold text-sm truncate ${isSelected ? 'text-brand-900' : 'text-gray-700'}`}>
                                        {house.communityName}
                                    </div>
                                    <div className={`text-xs truncate mt-0.5 ${isSelected ? 'text-brand-600' : 'text-gray-400'}`}>
                                        {house.unit}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* House Info Card */}
                <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-5 text-white shadow-lg mb-6 relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-4 opacity-90">
                            <Home size={18} />
                            <span className="text-sm font-medium">{currentHouse.communityName}</span>
                        </div>
                        <h2 className="text-2xl font-bold mb-1">{currentHouse.unit}</h2>
                        <p className="text-sm opacity-80">{currentHouse.ownerName} ({currentHouse.role})</p>
                    </div>
                    <Receipt className="absolute -bottom-4 -right-4 w-32 h-32 opacity-10 text-white" />
                </div>

                {/* Tabs */}
                <div className="flex bg-white rounded-lg p-1 mb-4 shadow-sm">
                    <button 
                        onClick={() => setActiveTab('UNPAID')}
                        className={`flex-1 py-2 text-sm font-bold rounded-md transition-colors ${activeTab === 'UNPAID' ? 'bg-orange-50 text-orange-600' : 'text-gray-500'}`}
                    >
                        待缴费 ({unpaidBills.length})
                    </button>
                    <button 
                        onClick={() => setActiveTab('PAID')}
                        className={`flex-1 py-2 text-sm font-bold rounded-md transition-colors ${activeTab === 'PAID' ? 'bg-orange-50 text-orange-600' : 'text-gray-500'}`}
                    >
                        缴费记录
                    </button>
                </div>

                {/* Invoice Notice for Paid Records */}
                {activeTab === 'PAID' && (
                    <div className="bg-orange-50 border border-orange-100 rounded-lg p-3 mb-4 flex gap-3 items-start animate-in fade-in slide-in-from-top-2">
                        <Info size={16} className="text-orange-500 shrink-0 mt-0.5" />
                        <div className="text-xs text-orange-800">
                            <p className="font-bold mb-1">发票/收据开具说明</p>
                            <p className="opacity-90 leading-relaxed mb-2">
                                目前APP暂不支持在线开具电子票据。如需报销凭证或发票，请您在工作时间前往物业服务中心前台办理。
                            </p>
                            <div className="flex items-center gap-1 font-bold text-orange-600 bg-white/60 w-fit px-2 py-1 rounded border border-orange-100">
                                <Phone size={12} />
                                <a href="tel:023-66668888">财务室电话: 023-66668888</a>
                            </div>
                        </div>
                    </div>
                )}

                {/* Bill List */}
                <div className="space-y-4">
                    {displayBills.map(bill => {
                         const isSelected = selectedBillIds.includes(bill.id);
                         const isExpanded = expandedBillId === bill.id;
                         
                         return (
                            <div key={bill.id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                                <div 
                                    className="p-4 flex items-center gap-3"
                                    onClick={() => activeTab === 'UNPAID' && toggleSelection(bill.id)}
                                >
                                    {activeTab === 'UNPAID' && (
                                        <div className={isSelected ? 'text-brand-500' : 'text-gray-300'}>
                                            {isSelected ? <CheckCircle size={22} fill="currentColor" className="text-white bg-brand-500 rounded-full" /> : <Circle size={22} />}
                                        </div>
                                    )}
                                    
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start mb-1">
                                            <h4 className="font-bold text-gray-800">{bill.title}</h4>
                                            <span className="font-bold text-lg">¥{bill.amount.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-xs text-gray-500">
                                            <span>账单月份: {bill.month}</span>
                                            <span>{activeTab === 'UNPAID' ? '截止日期' : '支付日期'}: {bill.date}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Detailed Breakdown Toggle */}
                                <div 
                                    className="px-4 py-2 bg-gray-50 text-xs text-gray-500 flex justify-between items-center cursor-pointer border-t border-gray-100"
                                    onClick={(e) => { e.stopPropagation(); setExpandedBillId(isExpanded ? null : bill.id); }}
                                >
                                    <span>费用明细</span>
                                    <ChevronDown size={14} className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                                </div>

                                {isExpanded && bill.items && (
                                    <div className="bg-gray-50 px-4 pb-4 space-y-2">
                                        {bill.items.map((item, idx) => (
                                            <div key={idx} className="flex justify-between text-sm text-gray-600">
                                                <span>{item.name}</span>
                                                <span className="font-medium">¥{item.amount.toFixed(2)}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                         );
                    })}

                    {displayBills.length === 0 && (
                        <div className="text-center py-12 text-gray-400">
                            <FileText size={48} className="mx-auto mb-4 opacity-20" />
                            <p>暂无{activeTab === 'UNPAID' ? '待缴' : '历史'}账单</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Bottom Payment Bar */}
            {activeTab === 'UNPAID' && (
                <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-20 flex justify-between items-center animate-in slide-in-from-bottom duration-300">
                    <button 
                        onClick={toggleAll}
                        className="flex items-center gap-2 text-sm text-gray-600 font-medium pl-2"
                    >
                        <div className={selectedBillIds.length === unpaidBills.length && unpaidBills.length > 0 ? 'text-brand-500' : 'text-gray-300'}>
                             {selectedBillIds.length === unpaidBills.length && unpaidBills.length > 0 ? <CheckCircle size={20} fill="currentColor" className="text-white bg-brand-500 rounded-full"/> : <Circle size={20} />}
                        </div>
                        全选
                    </button>
                    
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <span className="text-xs text-gray-500">合计:</span>
                            <span className="text-xl font-bold text-brand-500 ml-1">¥{totalAmount.toFixed(2)}</span>
                        </div>
                        <button 
                            onClick={handlePayClick}
                            disabled={selectedBillIds.length === 0}
                            className={`px-8 py-3 rounded-full font-bold text-sm transition-all ${
                                selectedBillIds.length > 0 
                                ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/30' 
                                : 'bg-gray-100 text-gray-400'
                            }`}
                        >
                            立即缴费
                        </button>
                    </div>
                </div>
            )}

            {/* Payment Method Modal (Cashier) */}
            {showPaymentModal && (
                <div className="fixed inset-0 z-50 bg-black/60 flex items-end justify-center animate-in fade-in duration-200">
                    <div className="bg-white w-full rounded-t-2xl p-6 shadow-2xl animate-in slide-in-from-bottom duration-300 relative">
                        {/* Header */}
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-gray-800">确认付款</h3>
                            <button onClick={() => setShowPaymentModal(false)} className="p-1 bg-gray-100 rounded-full text-gray-500">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Amount */}
                        <div className="text-center mb-8">
                            <p className="text-xs text-gray-400 mb-1">支付金额</p>
                            <h2 className="text-4xl font-bold font-mono text-gray-900">¥{totalAmount.toFixed(2)}</h2>
                        </div>

                        {/* Payment Methods */}
                        <div className="space-y-4 mb-8">
                            <div 
                                onClick={() => setPaymentMethod('WECHAT')}
                                className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'WECHAT' ? 'border-green-500 bg-green-50' : 'border-gray-100'}`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                        <MessageCircle size={24} fill="currentColor" className="text-green-600" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-800">微信支付</p>
                                        <p className="text-xs text-gray-400">推荐使用微信支付</p>
                                    </div>
                                </div>
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'WECHAT' ? 'border-green-500 bg-green-500' : 'border-gray-300'}`}>
                                    {paymentMethod === 'WECHAT' && <div className="w-2 h-2 bg-white rounded-full"></div>}
                                </div>
                            </div>

                            <div 
                                onClick={() => setPaymentMethod('ALIPAY')}
                                className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'ALIPAY' ? 'border-blue-500 bg-blue-50' : 'border-gray-100'}`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                        <CreditCard size={24} fill="currentColor" className="text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-800">支付宝</p>
                                        <p className="text-xs text-gray-400">数亿用户的选择</p>
                                    </div>
                                </div>
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'ALIPAY' ? 'border-blue-500 bg-blue-500' : 'border-gray-300'}`}>
                                    {paymentMethod === 'ALIPAY' && <div className="w-2 h-2 bg-white rounded-full"></div>}
                                </div>
                            </div>
                        </div>

                        {/* Pay Button */}
                        <button 
                            onClick={handleConfirmPayment}
                            disabled={isPaying}
                            className={`w-full py-4 rounded-xl font-bold text-white shadow-lg flex items-center justify-center gap-2 ${
                                paymentMethod === 'WECHAT' ? 'bg-[#07C160] shadow-green-500/20' : 'bg-[#1677FF] shadow-blue-500/20'
                            }`}
                        >
                            {isPaying ? (
                                <>
                                    <Loader2 size={20} className="animate-spin" />
                                    支付中...
                                </>
                            ) : (
                                `立即支付 ¥${totalAmount.toFixed(2)}`
                            )}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
