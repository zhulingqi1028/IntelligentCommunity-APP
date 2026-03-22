
import React, { useState, useEffect, useRef } from 'react';
import { ViewState, UserRole } from '../types';
import { ShieldCheck, User, Lock, Smartphone, ChevronLeft, Eye, EyeOff, X, FileText, Clock, Info } from 'lucide-react';

interface AuthProps {
  onLogin: (phone?: string, password?: string) => void;
  onChangeView: (view: ViewState) => void;
  currentView: ViewState;
}

const PrivacyModal = ({ onClose, onAgree }: { onClose: () => void, onAgree: () => void }) => {
    const [timeLeft, setTimeLeft] = useState(3);
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-md rounded-2xl flex flex-col max-h-[80vh] shadow-2xl animate-in zoom-in-95 duration-200">
                <div className="p-4 border-b flex justify-between items-center">
                    <h3 className="font-bold text-lg text-gray-800">用户协议与隐私政策</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X size={20} />
                    </button>
                </div>
                
                <div className="p-6 overflow-y-auto flex-1 text-sm text-gray-600 leading-relaxed" ref={contentRef}>
                    {/* User Agreement */}
                    <h3 className="font-bold text-lg text-gray-900 mb-4 text-center">望山云居APP用户协议</h3>
                    
                    <h4 className="font-bold text-gray-800 mb-2">一、服务条款</h4>
                    <p className="mb-4">欢迎使用望山云居APP（以下简称“本APP”）。在使用本服务前，请您务必仔细阅读并充分理解本《用户协议》及《隐私政策》。您注册、登录、使用本APP服务，即视为您已阅读、理解并同意接受本协议全部内容。若您不同意本协议条款，应立即停止使用本APP服务。</p>

                    <h4 className="font-bold text-gray-800 mb-2">二、隐私保护</h4>
                    <p className="mb-4">为向您提供门禁通行、物业缴费、在线报修、社区公告等服务，我们需要收集您的手机号、房屋信息等必要个人信息。我们将按照法律法规及《隐私政策》要求，采取严格安全措施保护您的个人信息安全，<strong>不会在未经您明确授权的情况下向第三方出售、非法提供或披露您的个人信息</strong>。</p>

                    <h4 className="font-bold text-gray-800 mb-2">三、用户行为规范</h4>
                    <ul className="list-decimal pl-5 mb-4 space-y-1">
                        <li>您在使用本APP时，应遵守中华人民共和国法律法规、公序良俗及所在小区物业管理规定。</li>
                        <li>不得利用本APP发布、传播违法违规、色情暴力、虚假谣言、侵权及其他不当信息。</li>
                        <li>不得干扰、破坏本APP正常运行，不得攻击、入侵本APP系统或擅自获取、篡改他人信息。</li>
                        <li>不得从事其他损害社区秩序、公共利益及他人合法权益的行为。</li>
                    </ul>

                    <h4 className="font-bold text-gray-800 mb-2">四、免责声明</h4>
                    <ul className="list-decimal pl-5 mb-4 space-y-1">
                        <li>因不可抗力、网络故障、第三方服务故障、政府行为等不可归责于我方的原因，导致服务中断、延迟或数据丢失的，我方将尽力修复，但不承担因此造成的损失。</li>
                        <li>您应妥善保管账号、密码及手机设备，因您自身保管不当、授权他人使用或其他个人原因导致账号被盗、信息泄露、财产损失的，我方不承担责任。</li>
                        <li>我方不对用户发布内容的真实性、合法性、安全性负责，用户自行承担相应法律责任。</li>
                    </ul>

                    <h4 className="font-bold text-gray-800 mb-2">五、其他</h4>
                    <ul className="list-decimal pl-5 mb-4 space-y-1">
                        <li>我方有权根据业务发展、政策调整等情况，更新本协议内容，更新后将通过APP内公告等方式公示，公示后生效。</li>
                        <li>本协议的成立、生效、履行、解释及纠纷解决，均适用中华人民共和国法律。</li>
                        <li>若您对本协议有任何疑问，可通过APP内客服渠道联系我们。</li>
                    </ul>

                    <p className="text-xs text-gray-400 mb-8">请您耐心阅读以上条款，阅读完毕后方可继续使用。</p>

                    <hr className="my-6 border-gray-200" />

                    {/* Privacy Policy */}
                    <h3 className="font-bold text-lg text-gray-900 mb-2 text-center">望山云居APP隐私政策</h3>
                    <p className="text-xs text-gray-400 text-center mb-4">更新日期：2023年10月27日</p>
                    <p className="mb-4">欢迎您使用望山云居APP。我们非常重视您的隐私与个人信息保护。本隐私政策旨在向您清晰说明我们如何收集、使用、存储、共享您的个人信息，以及您对个人信息享有的权利。请您仔细阅读并理解。</p>

                    <h4 className="font-bold text-gray-800 mb-2">一、我们收集的信息类型</h4>
                    <ul className="list-decimal pl-5 mb-4 space-y-1">
                        <li><strong>身份信息</strong>：姓名、手机号码、身份证号（用于实名认证、门禁授权、业主身份核验）。</li>
                        <li><strong>房屋信息</strong>：您居住的小区名称、楼栋号、单元号、房号。</li>
                        <li><strong>设备信息</strong>：设备型号、操作系统版本、唯一设备标识符、网络状态信息（用于账号安全、服务稳定、消息推送）。</li>
                        <li><strong>多媒体与权限信息</strong>：当您使用在线报修、邻里圈、天使之眼等功能时，我们可能请求访问相机、麦克风、相册权限，并获取相关图片、视频、音频数据。</li>
                    </ul>

                    <h4 className="font-bold text-gray-800 mb-2">二、信息的使用用途</h4>
                    <p className="mb-2">我们收集您的个人信息仅用于以下目的：</p>
                    <ul className="list-decimal pl-5 mb-4 space-y-1">
                        <li>提供门禁开锁、访客授权、车辆通行等智慧安防服务。</li>
                        <li>处理物业缴费、报修工单、投诉建议等物业服务。</li>
                        <li>开展社区安全管理、安防监控联动、天使之眼看护。</li>
                        <li>向您推送社区公告、活动通知、物业通知。</li>
                        <li>保障账号安全、优化APP功能与用户体验。</li>
                    </ul>

                    <h4 className="font-bold text-gray-800 mb-2">三、信息的存储与保护</h4>
                    <ul className="list-decimal pl-5 mb-4 space-y-1">
                        <li>您的个人信息将<strong>加密存储于中华人民共和国境内服务器</strong>，不向境外传输。</li>
                        <li>我们采取符合业界标准的安全防护措施保护个人信息，防止数据遭到未经授权访问、泄露、篡改或损毁。</li>
                        <li>除非法律法规另有规定，我们仅在提供服务所必需的最短期限内保留您的个人信息，到期后将进行删除或匿名化处理。</li>
                    </ul>

                    <h4 className="font-bold text-gray-800 mb-2">四、信息的共享</h4>
                    <p className="mb-2">我们<strong>不会向第三方出售您的个人信息</strong>。仅在以下情形下，共享必要范围内的信息：</p>
                    <ul className="list-decimal pl-5 mb-4 space-y-1">
                        <li>与物业管理公司共享必要住户信息，以提供基础物业服务。</li>
                        <li>与维修、保洁等服务人员共享您的联系方式与地址，以便上门处理报修、服务工单。</li>
                        <li>根据法律法规、行政或司法机关的强制性要求进行披露。</li>
                        <li>为维护公共安全、处理投诉纠纷等合法且必要的场景。</li>
                    </ul>

                    <h4 className="font-bold text-gray-800 mb-2">五、您的权利</h4>
                    <p className="mb-2">您对本人个人信息依法享有以下权利：</p>
                    <ul className="list-decimal pl-5 mb-4 space-y-1">
                        <li><strong>访问与更正</strong>：您可通过APP“我的—个人信息”页面，查看、更正您的身份信息、房屋信息。</li>
                        <li><strong>删除与注销</strong>：您可联系客服申请注销账号，我们将在验证身份后按规定注销账号并删除相关信息（法律法规要求保留的除外）。</li>
                        <li><strong>撤回授权</strong>：您可在手机系统设置中，关闭相机、麦克风、定位、相册等权限，撤回相关授权。</li>
                        <li><strong>投诉与咨询</strong>：您可就个人信息相关事宜向我们提出咨询、投诉或建议。</li>
                    </ul>

                    <h4 className="font-bold text-gray-800 mb-2">六、联系我们</h4>
                    <p className="mb-4">如您对本隐私政策有任何疑问、意见或建议，或需行使个人信息相关权利，请联系隐私保护专员：<br/>邮箱：privacy@smartcommunity.com</p>
                </div>

                <div className="p-4 border-t bg-gray-50 rounded-b-2xl">
                    <button 
                        onClick={onAgree}
                        disabled={timeLeft > 0}
                        className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                            timeLeft > 0 
                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                                : 'bg-brand-500 text-white shadow-lg shadow-brand-500/30 hover:bg-brand-600'
                        }`}
                    >
                        {timeLeft > 0 ? (
                            <>
                                <Clock size={18} />
                                请阅读 ({timeLeft}s)
                            </>
                        ) : (
                            '我已阅读并同意'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export const Auth: React.FC<AuthProps> = ({ onLogin, onChangeView, currentView }) => {
  const [isPasswordLogin, setIsPasswordLogin] = useState(true);
  const [agreed, setAgreed] = useState(false);
  const [hasReadPrivacy, setHasReadPrivacy] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  
  // Input States
  const [phone, setPhone] = useState('123');
  const [password, setPassword] = useState('123');
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
      let timer: NodeJS.Timeout;
      if (countdown > 0) {
          timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      }
      return () => clearTimeout(timer);
  }, [countdown]);

  const handleCheckboxChange = () => {
      if (agreed) {
          setAgreed(false);
      } else {
          if (hasReadPrivacy) {
              setAgreed(true);
          } else {
              setShowPrivacyModal(true);
          }
      }
  };

  const handlePrivacyAgree = () => {
      setHasReadPrivacy(true);
      setAgreed(true);
      setShowPrivacyModal(false);
  };

  const handleSendCode = () => {
      if (!phone) {
          alert('请输入手机号');
          return;
      }
      setCountdown(60);
      alert('验证码已发送，请注意查收 (模拟验证码: 123456)');
  };

  // --- SUB-VIEW: FORGOT PASSWORD ---
  if (currentView === ViewState.FORGOT_PASSWORD) {
      // ... (keep existing forgot password code)
      return (
        <div className="h-full bg-white p-8 flex flex-col overflow-y-auto">
            <button onClick={() => onChangeView(ViewState.LOGIN)} className="mb-6 -ml-2 p-2">
                <ChevronLeft size={24} className="text-gray-600" />
            </button>
            <div className="mb-8">
                <div className="w-16 h-16 bg-brand-50 rounded-full flex items-center justify-center mb-4">
                     <Lock className="text-brand-500 w-8 h-8" />
                </div>
                <h1 className="text-2xl font-bold text-gray-800">重置密码</h1>
            </div>

            <div className="space-y-4">
                <div className="relative">
                    <Smartphone className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                    <input 
                        type="text" 
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="请输入手机号" 
                        className="w-full bg-gray-50 rounded-lg py-3 pl-10 pr-4 outline-none border border-transparent focus:border-brand-500 transition" 
                    />
                </div>
                 <div className="flex gap-2">
                     <input type="text" placeholder="短信验证码" className="w-full bg-gray-50 rounded-lg py-3 pl-4 pr-4 outline-none border border-transparent focus:border-brand-500 transition" />
                     <button 
                        onClick={handleSendCode}
                        disabled={countdown > 0}
                        className="bg-brand-50 text-brand-500 px-4 rounded-lg text-sm font-medium whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                     >
                        {countdown > 0 ? `${countdown}s后重发` : '发送验证码'}
                     </button>
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

            <button
              onClick={() => {
                  alert('密码重置成功！');
                  onChangeView(ViewState.LOGIN);
              }}
              className="w-full bg-brand-500 text-white py-3 rounded-lg font-bold shadow-lg shadow-brand-500/30 hover:bg-brand-600 transition-colors mt-8"
            >
              确认
            </button>
        </div>
      );
  }

  // --- MAIN: LOGIN ---
  return (
    <div className="h-full bg-white p-6 flex flex-col justify-center animate-in fade-in duration-500 relative overflow-hidden">
      {showPrivacyModal && <PrivacyModal onClose={() => setShowPrivacyModal(false)} onAgree={handlePrivacyAgree} />}
      
      <div className="flex flex-col items-center mb-6">
        <div className="w-20 h-20 mb-3 relative flex items-center justify-center">
          <img 
            src="./images/APPlogo.png" 
            alt="APP Logo" 
            className="w-full h-full object-contain drop-shadow-sm"
          />
        </div>
        <h1 className="text-2xl font-bold text-brand-500">望山云居</h1>
        <p className="text-gray-400 text-sm mt-1">让社区生活更智慧！</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b mb-6">
        <button
          className={`flex-1 pb-2 text-sm font-medium transition-colors ${isPasswordLogin ? 'text-brand-500 border-b-2 border-brand-500' : 'text-gray-400'}`}
          onClick={() => setIsPasswordLogin(true)}
        >
          账号密码登录
        </button>
        <button
          className={`flex-1 pb-2 text-sm font-medium transition-colors ${!isPasswordLogin ? 'text-brand-500 border-b-2 border-brand-500' : 'text-gray-400'}`}
          onClick={() => setIsPasswordLogin(false)}
        >
          手机验证码登录
        </button>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <User className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="请输入手机号"
            className="w-full bg-gray-50 border border-gray-100 rounded-lg py-3 pl-10 pr-4 outline-none focus:border-brand-500 transition-colors"
          />
        </div>

        {isPasswordLogin ? (
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="请输入密码"
              className="w-full bg-gray-50 border border-gray-100 rounded-lg py-3 pl-10 pr-4 outline-none focus:border-brand-500 transition-colors"
            />
          </div>
        ) : (
          <div className="flex gap-2">
             <div className="relative flex-1">
                <ShieldCheck className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="请输入验证码"
                  className="w-full bg-gray-50 border border-gray-100 rounded-lg py-3 pl-10 pr-4 outline-none focus:border-brand-500 transition-colors"
                />
            </div>
            <button 
                onClick={handleSendCode}
                disabled={countdown > 0}
                className="bg-brand-50 text-brand-500 px-4 rounded-lg text-sm font-medium whitespace-nowrap active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {countdown > 0 ? `${countdown}s后重发` : '发送验证码'}
            </button>
          </div>
        )}

        <div className="flex items-center gap-2 mt-4">
            <input 
                type="checkbox" 
                checked={agreed} 
                onChange={handleCheckboxChange}
                className="accent-brand-500 w-4 h-4 cursor-pointer" 
            />
            <span className="text-xs text-gray-500 leading-tight">
                我已阅读并同意 
                <span className="text-brand-500 cursor-pointer" onClick={() => setShowPrivacyModal(true)}>《隐私政策》</span> 
                和 
                <span className="text-brand-500 cursor-pointer" onClick={() => setShowPrivacyModal(true)}>《用户协议》</span>
            </span>
        </div>

        <button
          onClick={() => {
              if(!agreed) { 
                  // If not agreed, show modal instead of just alerting
                  if (!hasReadPrivacy) {
                      setShowPrivacyModal(true);
                  } else {
                      alert('请先勾选同意用户协议'); 
                  }
                  return; 
              }
              if(!phone) { alert('请输入手机号'); return; }
              if(isPasswordLogin && !password) { alert('请输入密码'); return; }
              onLogin(phone, password);
          }}
          className={`w-full text-white py-3 rounded-lg font-bold shadow-lg transition-all mt-4 ${agreed ? 'bg-brand-500 shadow-brand-500/30 hover:bg-brand-600' : 'bg-gray-300 shadow-none'}`}
        >
          登录
        </button>

        <div className="flex justify-end mt-3 text-sm">
            <button onClick={() => onChangeView(ViewState.FORGOT_PASSWORD)} className="text-gray-400">忘记密码</button>
        </div>

        <div className="mt-6 bg-brand-50/50 rounded-xl p-4 flex items-start gap-3 border border-brand-100/50">
            <Info className="text-brand-500 w-4 h-4 shrink-0 mt-0.5" />
            <div className="text-xs text-gray-500 leading-relaxed">
                <p>账号由物业管理员统一录入。</p>
                <p>如无法登录或遗忘账号，请联系小区物业。</p>
            </div>
        </div>
      </div>
    </div>
  );
};
