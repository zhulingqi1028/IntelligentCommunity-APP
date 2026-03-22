import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Lock, CheckCircle, X } from 'lucide-react';
import { User, ViewState } from '../../types';

interface PersonalInfoViewProps {
    user: User;
    onUpdateUser: (user: User) => void;
    onChangeView: (view: ViewState) => void;
}

export const PersonalInfoView: React.FC<PersonalInfoViewProps> = ({ user, onUpdateUser, onChangeView }) => {
    const [editName, setEditName] = useState(user.name);
    const [editAvatar, setEditAvatar] = useState(user.avatar);
    const [editGender, setEditGender] = useState(user.gender || '保密');
    const [editBirthday, setEditBirthday] = useState(user.birthday || '选择生日');
    const [editPhone, setEditPhone] = useState(user.phone || '');
    const [isEditingName, setIsEditingName] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const avatarInputRef = useRef<HTMLInputElement>(null);

    // Phone modification state
    const [isModifyingPhone, setIsModifyingPhone] = useState(false);
    const [phoneModifyStep, setPhoneModifyStep] = useState<'VERIFY_OLD' | 'ENTER_NEW'>('VERIFY_OLD');
    const [oldPhoneCode, setOldPhoneCode] = useState('');
    const [newPhone, setNewPhone] = useState('');
    const [newPhoneCode, setNewPhoneCode] = useState('');
    const [countdown, setCountdown] = useState(0);

    useEffect(() => {
        setEditName(user.name);
        setEditAvatar(user.avatar);
        setEditGender(user.gender || '保密');
        setEditBirthday(user.birthday || '选择生日');
        setEditPhone(user.phone || '');
    }, [user]);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (countdown > 0) {
            timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        }
        return () => clearTimeout(timer);
    }, [countdown]);

    const handleSaveProfile = () => {
        onUpdateUser({
            ...user,
            name: editName,
            avatar: editAvatar,
            gender: editGender,
            birthday: editBirthday,
            phone: editPhone
        });
        
        setShowToast(true);
        setTimeout(() => {
            setShowToast(false);
            onChangeView(ViewState.PROFILE_SETTINGS);
        }, 1500);
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (event) => {
                if (event.target?.result) {
                    setEditAvatar(event.target.result as string);
                }
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const handleSendCode = () => {
        if (phoneModifyStep === 'ENTER_NEW' && !newPhone) {
            alert('请输入新手机号');
            return;
        }
        setCountdown(60);
        // Simulate sending code
        alert('验证码已发送，请注意查收 (模拟验证码: 123456)');
    };

    const handleVerifyOldPhone = () => {
        if (!oldPhoneCode) {
            alert('请输入验证码');
            return;
        }
        if (oldPhoneCode !== '123456') {
            alert('验证码错误，请重新输入');
            return;
        }
        setPhoneModifyStep('ENTER_NEW');
        setCountdown(0);
        setOldPhoneCode('');
    };

    const handleBindNewPhone = () => {
        if (!newPhone) {
            alert('请输入新手机号');
            return;
        }
        if (!newPhoneCode) {
            alert('请输入验证码');
            return;
        }
        if (newPhoneCode !== '123456') {
            alert('验证码错误，请重新输入');
            return;
        }
        setEditPhone(newPhone);
        setIsModifyingPhone(false);
        setPhoneModifyStep('VERIFY_OLD');
        setNewPhone('');
        setNewPhoneCode('');
        setCountdown(0);
        alert('手机号修改成功');
    };

    const openPhoneModifyModal = () => {
        setIsModifyingPhone(true);
        setPhoneModifyStep('VERIFY_OLD');
        setOldPhoneCode('');
        setNewPhone('');
        setNewPhoneCode('');
        setCountdown(0);
    };

    return (
        <div className="min-h-full bg-white flex flex-col">
            <div className="bg-white p-4 flex items-center border-b sticky top-0 z-10">
                <button onClick={() => onChangeView(ViewState.PROFILE_SETTINGS)}><ChevronLeft /></button>
                <span className="ml-4 font-bold text-lg">个人信息</span>
            </div>
            <div className="p-4">
                <input 
                  type="file" 
                  ref={avatarInputRef} 
                  className="hidden" 
                  accept="image/*" 
                  onChange={handleAvatarChange} 
                />
                <div 
                  className="flex items-center justify-between py-4 border-b border-gray-50 cursor-pointer active:bg-gray-50 transition-colors"
                  onClick={() => avatarInputRef.current?.click()}
                >
                    <span className="text-gray-600">头像</span>
                    <div className="flex items-center gap-2">
                        <img src={editAvatar} className="w-10 h-10 rounded-full object-cover border border-gray-100" />
                        <ChevronRight size={16} className="text-gray-300" />
                    </div>
                </div>
                <div className="flex items-center justify-between py-4 border-b border-gray-50">
                    <span className="text-gray-600">昵称</span>
                    <div className="flex items-center gap-2 flex-1 justify-end ml-4">
                        {isEditingName ? (
                            <input 
                                autoFocus
                                className="text-right text-gray-800 font-medium outline-none border-b border-brand-500 w-full"
                                value={editName}
                                onChange={e => setEditName(e.target.value)}
                                onBlur={() => setIsEditingName(false)}
                            />
                        ) : (
                            <button onClick={() => setIsEditingName(true)} className="flex items-center gap-2">
                                <span className="text-gray-800 font-medium">{editName}</span>
                                <ChevronRight size={16} className="text-gray-300" />
                            </button>
                        )}
                    </div>
                </div>
                <div 
                    className="flex items-center justify-between py-4 border-b border-gray-50 cursor-pointer active:bg-gray-50 transition-colors"
                    onClick={openPhoneModifyModal}
                >
                    <span className="text-gray-600">手机号</span>
                    <div className="flex items-center gap-2">
                        <span className="text-gray-800 font-medium">{editPhone}</span>
                        <ChevronRight size={16} className="text-gray-300" />
                    </div>
                </div>
                <div className="flex items-center justify-between py-4 border-b border-gray-50">
                    <span className="text-gray-600">性别</span>
                    <select 
                      className="bg-transparent text-gray-800 outline-none appearance-none text-right pr-6"
                      value={editGender}
                      onChange={e => setEditGender(e.target.value)}
                      style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 \'%3E%3Cpath stroke=\'%23D1D5DB\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'m9 5 7 7-7 7\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right center', backgroundSize: '16px' }}
                    >
                        <option value="男">男</option>
                        <option value="女">女</option>
                        <option value="保密">保密</option>
                    </select>
                </div>
                <div className="flex items-center justify-between py-4 border-b border-gray-50">
                    <span className="text-gray-600">出生日期</span>
                    <div className="flex items-center gap-2">
                        <input 
                          type="date"
                          className="text-gray-800 text-sm outline-none bg-transparent text-right"
                          value={editBirthday === '选择生日' ? '' : editBirthday}
                          onChange={e => setEditBirthday(e.target.value)}
                        />
                        <ChevronRight size={16} className="text-gray-300" />
                    </div>
                </div>
                <button 
                  onClick={handleSaveProfile}
                  className="w-full bg-brand-500 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-brand-500/30 mt-10 active:scale-[0.98] transition-transform"
                >
                  保存修改
                </button>
            </div>

            {/* Phone Modification Modal */}
            {isModifyingPhone && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-in fade-in">
                    <div className="bg-white rounded-2xl w-full max-w-sm p-6 relative animate-in zoom-in-95 duration-200">
                        <button onClick={() => setIsModifyingPhone(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors">
                            <X size={20} />
                        </button>
                        <h3 className="text-lg font-bold mb-6 text-center text-gray-800">
                            {phoneModifyStep === 'VERIFY_OLD' ? '验证原手机号' : '绑定新手机号'}
                        </h3>
                        
                        {phoneModifyStep === 'VERIFY_OLD' ? (
                            <div className="space-y-4">
                                <p className="text-sm text-gray-500 text-center mb-4">
                                    为保障您的账号安全，请先验证原手机号<br/>
                                    <span className="font-bold text-gray-800 text-base mt-1 block">{editPhone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')}</span>
                                </p>
                                <div className="flex gap-2">
                                    <input 
                                        type="text" 
                                        placeholder="请输入验证码" 
                                        className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-500 transition-colors"
                                        value={oldPhoneCode}
                                        onChange={e => setOldPhoneCode(e.target.value)}
                                        maxLength={6}
                                    />
                                    <button 
                                        onClick={handleSendCode}
                                        disabled={countdown > 0}
                                        className="bg-brand-50 text-brand-600 px-4 rounded-xl text-sm font-medium whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition-all"
                                    >
                                        {countdown > 0 ? `${countdown}s后重发` : '获取验证码'}
                                    </button>
                                </div>
                                <button 
                                    onClick={handleVerifyOldPhone}
                                    className="w-full bg-brand-500 text-white py-3.5 rounded-xl font-bold mt-4 shadow-lg shadow-brand-500/30 active:scale-[0.98] transition-transform"
                                >
                                    下一步
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <input 
                                    type="tel" 
                                    placeholder="请输入新手机号" 
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-500 transition-colors"
                                    value={newPhone}
                                    onChange={e => setNewPhone(e.target.value)}
                                    maxLength={11}
                                />
                                <div className="flex gap-2">
                                    <input 
                                        type="text" 
                                        placeholder="请输入验证码" 
                                        className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-500 transition-colors"
                                        value={newPhoneCode}
                                        onChange={e => setNewPhoneCode(e.target.value)}
                                        maxLength={6}
                                    />
                                    <button 
                                        onClick={handleSendCode}
                                        disabled={countdown > 0 || newPhone.length !== 11}
                                        className="bg-brand-50 text-brand-600 px-4 rounded-xl text-sm font-medium whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition-all"
                                    >
                                        {countdown > 0 ? `${countdown}s后重发` : '获取验证码'}
                                    </button>
                                </div>
                                <button 
                                    onClick={handleBindNewPhone}
                                    className="w-full bg-brand-500 text-white py-3.5 rounded-xl font-bold mt-4 shadow-lg shadow-brand-500/30 active:scale-[0.98] transition-transform"
                                >
                                    确认绑定
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Success Toast */}
            {showToast && (
                <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/80 text-white px-6 py-4 rounded-2xl flex flex-col items-center gap-2 z-50 animate-in fade-in zoom-in duration-300">
                    <CheckCircle className="text-brand-400 w-10 h-10" />
                    <span className="font-medium">保存成功</span>
                </div>
            )}
        </div>
    );
};

