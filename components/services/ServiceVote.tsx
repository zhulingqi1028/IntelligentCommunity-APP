
import React, { useState } from 'react';
import { ChevronLeft, BarChart3, Clock, CheckCircle2, ChevronRight, Star, ClipboardList } from 'lucide-react';
import { ViewState, Vote, VoteType, VoteStatus } from '../../types';
import { MOCK_VOTES } from '../../constants';

interface ServiceVoteProps {
  onChangeView: (view: ViewState) => void;
  selectedVoteId?: string | null;
  onSelectVote?: (id: string | null) => void;
}

export const ServiceVoteView: React.FC<ServiceVoteProps> = ({ onChangeView, selectedVoteId, onSelectVote }) => {
  const [selectedVote, setSelectedVote] = useState<Vote | null>(null);
  const [viewMode, setViewMode] = useState<'PARTICIPATE' | 'RESULT'>('PARTICIPATE');
  const [showMyVotes, setShowMyVotes] = useState(false);

  // Sync prop with internal state
  React.useEffect(() => {
    if (selectedVoteId) {
      const vote = MOCK_VOTES.find(v => v.id === selectedVoteId);
      if (vote) {
        setSelectedVote(vote);
        // If already voted or closed, default to result mode
        if (vote.myVote || vote.myRating || vote.status === VoteStatus.CLOSED) {
          setViewMode('RESULT');
        } else {
          setViewMode('PARTICIPATE');
        }
      }
    } else {
      setSelectedVote(null);
    }
  }, [selectedVoteId]);

  const handleBack = () => {
    if (onSelectVote) {
      onSelectVote(null);
    }
    setSelectedVote(null);
    onChangeView(ViewState.SERVICES);
  };

  const getStatusInfo = (status: VoteStatus) => {
    switch (status) {
      case VoteStatus.IN_PROGRESS:
        return { text: '进行中', color: 'text-emerald-600', bgColor: 'bg-emerald-50', borderColor: 'border-emerald-100' };
      case VoteStatus.CLOSED:
        return { text: '已截止', color: 'text-rose-600', bgColor: 'bg-rose-50', borderColor: 'border-rose-100' };
      default:
        return { text: '未知', color: 'text-gray-500', bgColor: 'bg-gray-50', borderColor: 'border-gray-100' };
    }
  };

  if (selectedVote) {
    return (
      <VoteDetailView 
        vote={selectedVote} 
        mode={viewMode}
        onBack={() => {
          if (onSelectVote) onSelectVote(null);
          setSelectedVote(null);
          onChangeView(ViewState.SERVICE_VOTING);
        }} 
      />
    );
  }

  return (
    <div className="min-h-full bg-gray-50 pb-20 animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="bg-white sticky top-0 z-10 border-b px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={handleBack} className="p-1 -ml-1">
            <ChevronLeft className="text-gray-700" />
          </button>
          <h2 className="text-lg font-bold text-gray-800">{showMyVotes ? '我的参与' : '投票问卷'}</h2>
        </div>
        <button 
          onClick={() => setShowMyVotes(!showMyVotes)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
            showMyVotes 
              ? 'bg-brand-500 text-white shadow-md shadow-brand-500/20' 
              : 'bg-gray-100 text-gray-600 active:bg-gray-200'
          }`}
        >
          <ClipboardList size={14} />
          {showMyVotes ? '全部' : '我的'}
        </button>
      </div>

      {/* List */}
      <div className="p-4 space-y-4">
        {MOCK_VOTES.filter(v => !showMyVotes || !!v.myVote || !!v.myRatings).map((vote) => {
          const status = getStatusInfo(vote.status);
          const hasParticipated = !!vote.myVote || !!vote.myRatings;
          
          return (
            <div
              key={vote.id}
              onClick={() => {
                if (onSelectVote) onSelectVote(vote.id);
                setSelectedVote(vote);
                setViewMode('PARTICIPATE');
              }}
              className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 active:scale-[0.98] transition-all cursor-pointer relative overflow-hidden group"
            >
              {/* Circular Seal Style Status */}
              <div className={`absolute top-2 right-8 w-20 h-20 border-4 rounded-full flex items-center justify-center text-xs font-black tracking-widest -rotate-12 opacity-40 pointer-events-none select-none border-double ${
                  vote.status === VoteStatus.IN_PROGRESS ? 'border-emerald-500 text-emerald-500' : 'border-rose-500 text-rose-500'
              }`}>
                  <div className="border-2 border-dashed rounded-full w-16 h-16 flex flex-col items-center justify-center">
                    <span className="scale-150 mb-1">★</span>
                    {status.text}
                  </div>
              </div>

              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    hasParticipated ? 'bg-emerald-500 text-white' : 'bg-amber-50 text-amber-600 border border-amber-100'
                  }`}>
                      {hasParticipated ? '已参与' : '未参与'}
                  </span>
                </div>
                <span className="text-[10px] font-bold text-gray-400 bg-gray-50 px-2.5 py-1 rounded-lg uppercase tracking-wider">
                  {vote.type === VoteType.SINGLE_CHOICE ? '单选投票' : '满意度调查'}
                </span>
              </div>
              
              <h3 className="font-bold text-gray-900 mb-3 text-base leading-snug group-hover:text-brand-500 transition-colors">{vote.title}</h3>
              
              <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-50">
                <div className="flex items-center gap-5">
                  <div className="flex items-center gap-1.5 text-xs text-gray-400">
                    <Clock size={14} />
                    <span>截止: {vote.deadline}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-400">
                    <BarChart3 size={14} />
                    <span>{vote.participantCount} 人参与</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                    { (vote.status === VoteStatus.CLOSED || hasParticipated) && (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onSelectVote) onSelectVote(vote.id);
                          setSelectedVote(vote);
                          setViewMode('RESULT');
                        }}
                        className="text-[10px] font-bold text-brand-500 bg-brand-50 px-3 py-1.5 rounded-full hover:bg-brand-500 hover:text-white active:scale-95 transition-all"
                      >
                        查看结果
                      </button>
                    )}
                  <ChevronRight size={18} className="text-gray-300 group-hover:text-brand-500 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

interface VoteDetailProps {
  vote: Vote;
  mode: 'PARTICIPATE' | 'RESULT';
  onBack: () => void;
}

const VoteDetailView: React.FC<VoteDetailProps> = ({ vote, mode, onBack }) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(vote.myVote || null);
  const [ratings, setRatings] = useState<Record<string, number>>(vote.myRatings || {});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentMode, setCurrentMode] = useState<'PARTICIPATE' | 'RESULT'>(
    (vote.status === VoteStatus.CLOSED || !!vote.myVote) ? 'RESULT' : mode
  );

  const handleSubmit = () => {
    if (vote.type === VoteType.SINGLE_CHOICE && !selectedOption) {
      alert('请选择一个选项');
      return;
    }
    if (vote.type === VoteType.SATISFACTION && Object.keys(ratings).length < vote.options.length) {
      alert('请完成所有维度的打分');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setCurrentMode('RESULT');
    }, 1500);
  };

  const isResultMode = currentMode === 'RESULT';

  return (
    <div className="min-h-full bg-gray-50 pb-32 animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="bg-white sticky top-0 z-10 border-b px-4 py-4 flex items-center justify-between">
        <button onClick={onBack} className="p-1 -ml-1">
          <ChevronLeft className="text-gray-700" />
        </button>
        <h2 className="text-lg font-bold text-gray-800">问卷详情</h2>
        <div className="w-8"></div>
      </div>

      <div className="p-5 space-y-6">
        {/* Info Card */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-3">
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold text-white ${vote.status === VoteStatus.IN_PROGRESS ? 'bg-green-500' : 'bg-orange-500'}`}>
              {vote.status === VoteStatus.IN_PROGRESS ? '进行中' : '已截止'}
            </span>
            <span className="text-[10px] font-bold text-gray-400 bg-gray-50 px-2 py-0.5 rounded uppercase tracking-wider">
              {vote.type === VoteType.SINGLE_CHOICE ? '单选投票' : '满意度调查'}
            </span>
          </div>
          <h1 className="text-xl font-bold text-gray-900 leading-tight mb-4">{vote.title}</h1>
          <p className="text-sm text-gray-500 leading-relaxed mb-6">{vote.description}</p>
          
          <div className="flex items-center gap-6 py-4 border-t border-gray-50">
            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">截止日期</p>
              <p className="text-sm font-bold text-gray-800">{vote.deadline}</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">参与人数</p>
              <p className="text-sm font-bold text-gray-800">{vote.participantCount} 人</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
            <BarChart3 size={18} className="text-brand-500" />
            {isResultMode ? '实时统计结果' : (vote.type === VoteType.SINGLE_CHOICE ? '请选择您的选项' : '请为以下维度打分')}
          </h3>

          {vote.type === VoteType.SINGLE_CHOICE ? (
            <div className="space-y-4">
              {vote.options.map((opt) => {
                const isSelected = selectedOption === opt.id;
                const total = vote.participantCount || 1;
                const percent = Math.round((opt.count / total) * 100);
                
                return (
                  <div key={opt.id} className="space-y-2">
                    <button
                      disabled={isResultMode}
                      onClick={() => setSelectedOption(opt.id)}
                      className={`w-full text-left p-4 rounded-2xl border-2 transition-all relative overflow-hidden ${
                        isSelected ? 'border-brand-500 bg-brand-50/30' : 'border-gray-50 bg-gray-50/50'
                      }`}
                    >
                      <div className="relative flex justify-between items-center z-10">
                        <span className={`text-sm font-bold ${isSelected ? 'text-brand-600' : 'text-gray-700'}`}>{opt.label}</span>
                        {isResultMode && (
                          <span className="text-xs font-bold text-brand-500">{opt.count} 票</span>
                        )}
                      </div>
                    </button>
                    
                    {isResultMode && (
                      <div className="px-1">
                        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-brand-500 rounded-full transition-all duration-1000 ease-out"
                            style={{ width: `${percent}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between mt-1">
                          <span className="text-[10px] text-gray-400 font-medium">占比</span>
                          <span className="text-[10px] text-brand-500 font-bold">{percent}%</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="space-y-8">
              {vote.options.map((opt) => {
                const avgRating = isResultMode ? (Math.random() * 1.5 + 3.5).toFixed(1) : null; // Mock avg rating
                return (
                  <div key={opt.id}>
                    <div className="flex justify-between items-center mb-3 ml-1">
                      <p className="text-sm font-bold text-gray-700">{opt.label}</p>
                      {isResultMode && (
                        <div className="flex items-center gap-1">
                          <span className="text-xs font-bold text-brand-500">{avgRating}</span>
                          <span className="text-[10px] text-gray-400">平均分</span>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-4">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          disabled={isResultMode}
                          onClick={() => setRatings(prev => ({ ...prev, [opt.id]: star }))}
                          className={`transition-all ${
                            (isResultMode ? (ratings[opt.id] || Number(avgRating)) >= star : ratings[opt.id] >= star) 
                              ? 'text-yellow-400 scale-110' 
                              : 'text-gray-200'
                          }`}
                        >
                          <Star size={32} fill={(isResultMode ? (ratings[opt.id] || Number(avgRating)) >= star : ratings[opt.id] >= star) ? 'currentColor' : 'none'} />
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Action Bar */}
      {!isResultMode && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 z-40 max-w-md mx-auto">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full py-4 bg-brand-500 text-white rounded-2xl font-bold shadow-lg shadow-brand-500/30 flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-50"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              '提交问卷'
            )}
          </button>
        </div>
      )}
      
      {isResultMode && vote.status === VoteStatus.IN_PROGRESS && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 z-40 max-w-md mx-auto">
          <div className="w-full py-4 bg-green-50 text-green-600 rounded-2xl font-bold flex items-center justify-center gap-2">
            <CheckCircle2 size={18} />
            问卷已提交，感谢参与
          </div>
        </div>
      )}
    </div>
  );
};
