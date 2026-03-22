
import React, { useState, useEffect, useRef } from 'react';
import { Search, Bell, MapPin, ChevronLeft, Share2, MessageSquare, ThumbsUp, Info, X, AlertTriangle, ChevronDown, Image as ImageIcon, ClipboardList } from 'lucide-react';
import { HOME_BANNER_DATA, MOCK_NEWS, MOCK_COMMENTS, MOCK_ACTIVITIES, MOCK_VOTES } from '../constants';
import { ViewState, Message, ActivityStatus, VoteStatus, VoteType } from '../types';

interface HomeProps {
    onChangeView: (view: ViewState) => void;
    messages: Message[];
    showGuide: boolean;
    onCloseGuide: () => void;
    onSelectActivity?: (id: string) => void;
    onSelectVote?: (id: string) => void;
}

export const Home: React.FC<HomeProps> = ({ onChangeView, messages, showGuide, onCloseGuide, onSelectActivity, onSelectVote }) => {
  const [activeTab, setActiveTab] = useState('全部');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNewsId, setSelectedNewsId] = useState<number | null>(null);
  
  // Carousel State
  const [currentBanner, setCurrentBanner] = useState(0);
  const timerRef = useRef<number | null>(null);

  // Comment & Share State
  const [comments, setComments] = useState(MOCK_COMMENTS);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState<{ id: string, author: string } | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [commentImage, setCommentImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Track expanded replies count for each comment: { commentId: visibleCount }
  const [expandedComments, setExpandedComments] = useState<Record<string, number>>({});

  const handleExpandReplies = (commentId: string) => {
      setExpandedComments(prev => ({
          ...prev,
          [commentId]: 6
      }));
  };

  const handleExpandMoreReplies = (commentId: string) => {
      setExpandedComments(prev => ({
          ...prev,
          [commentId]: (prev[commentId] || 0) + 6
      }));
  };

  const handleLikeComment = (commentId: string) => {
      const updateLike = (list: typeof MOCK_COMMENTS): typeof MOCK_COMMENTS => {
          return list.map(c => {
              if (c.id === commentId) {
                  return {
                      ...c,
                      likes: c.isLiked ? c.likes - 1 : c.likes + 1,
                      isLiked: !c.isLiked
                  };
              }
              if (c.replies) {
                  return {
                      ...c,
                      replies: updateLike(c.replies)
                  };
              }
              return c;
          });
      };
      setComments(updateLike(comments));
  };

  const [showShareModal, setShowShareModal] = useState(false);

  const handleShare = () => {
      setShowShareModal(true);
  };

  const handleWeChatShare = () => {
      // Simulate WeChat sharing
      setShowShareModal(false);
      alert('已分享到微信');
  };

  const handleCopyLink = () => {
      const article = MOCK_NEWS.find(n => n.id === selectedNewsId);
      if (article) {
          navigator.clipboard.writeText(`${article.title} - ${window.location.href}`);
          alert('链接已复制');
      }
      setShowShareModal(false);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
              setCommentImage(reader.result as string);
          };
          reader.readAsDataURL(file);
      }
  };

  const handleCommentSubmit = () => {
      if (!newComment.trim() && !commentImage) return;
      
      const newCommentObj = {
          id: `c_${Date.now()}`,
          author: '我', // In real app, use current user
          content: newComment,
          time: '刚刚',
          likes: 0,
          image: commentImage || undefined,
          replies: []
      };
      
      setComments([newCommentObj, ...comments]);
      setNewComment('');
      setCommentImage(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleReplySubmit = () => {
      if (!replyContent.trim() || !replyTo) return;

      const updatedComments = comments.map(comment => {
          if (comment.id === replyTo.id) {
              return {
                  ...comment,
                  replies: [
                      ...(comment.replies || []),
                      {
                          id: `r_${Date.now()}`,
                          author: '我',
                          content: replyContent,
                          time: '刚刚',
                          likes: 0
                      }
                  ]
              };
          }
          return comment;
      });

      setComments(updatedComments);
      setReplyContent('');
      setReplyTo(null);
  };

  useEffect(() => {
      startTimer();
      return () => stopTimer();
  }, []);

  const startTimer = () => {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = window.setInterval(() => {
          setCurrentBanner(prev => (prev + 1) % HOME_BANNER_DATA.length);
      }, 4000);
  };

  const stopTimer = () => {
      if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
      }
  };

  const handleBannerClick = (banner: typeof HOME_BANNER_DATA[0]) => {
      if (banner.type === 'NOTICE') {
          setSelectedNewsId(Number(banner.targetId));
      } else if (banner.type === 'ACTIVITY') {
          if (banner.targetId && onSelectActivity) {
              onSelectActivity(banner.targetId as string);
          } else {
              onChangeView(ViewState.SERVICE_ACTIVITY);
          }
      } else if (banner.type === 'VOTE') {
          if (banner.targetId && onSelectVote) {
              onSelectVote(banner.targetId as string);
          } else {
              onChangeView(ViewState.SERVICE_VOTING);
          }
      }
  };
  
  // Filter news based on activeTab and searchQuery
  const filteredNews = MOCK_NEWS.filter(item => {
      const matchesTab = activeTab === '全部' || item.tag === activeTab;
      const matchesSearch = !searchQuery || 
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
          item.author.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTab && matchesSearch;
  });

  // Filter news based on activeTab and searchQuery
  if (selectedNewsId) {
    const article = MOCK_NEWS.find(n => n.id === selectedNewsId);
    if (!article) return null;

    return (
      <div className="min-h-full bg-white flex flex-col pb-20 animate-in slide-in-from-right duration-300">
        {/* Detail Header */}
        <div className="sticky top-0 bg-white z-10 border-b p-4 flex justify-between items-center">
          <button onClick={() => setSelectedNewsId(null)} className="p-1 -ml-2">
            <ChevronLeft className="text-gray-700" />
          </button>
          <div className="flex gap-4">
             <button onClick={handleShare}><Share2 size={20} className="text-gray-600" /></button>
          </div>
        </div>

        {/* Article Content */}
        <div className="flex-1 overflow-y-auto">
           <div className="p-5">
              <h1 className="text-xl font-bold text-gray-900 leading-normal mb-4">{article.title}</h1>
              
              <div className="flex items-center justify-between text-xs text-gray-400 mb-6">
                  <div className="flex items-center gap-2">
                    <span className="bg-gray-100 px-2 py-1 rounded text-gray-600 font-medium">{article.author}</span>
                    <span>2023-12-25</span>
                  </div>
                  <span>{article.views} 阅读</span>
              </div>

              {/* Content Body */}
              <div className="space-y-4 text-gray-700 leading-relaxed text-sm mb-8">
                  {article.image && (
                    <img src={article.image} className="w-full rounded-xl mb-4" alt="Cover" />
                  )}
                  <p>这里是新闻的详细内容。{article.title}的具体细节将在这里展开。</p>
                  <p>为了建设更美好的社区环境，我们需要大家的共同努力。请各位居民注意相关事项，积极配合工作。</p>
                  <p className="p-4 bg-gray-50 rounded-lg border-l-4 border-brand-500 text-gray-600 italic">
                    “智享生活，从连接开始。” —— 社区寄语
                  </p>
                  <p>如有疑问，请联系物业管理处或直接在APP内留言。</p>
              </div>
           </div>

           {/* Comments Section */}
           <div className="border-t border-gray-100 p-5">
              <h3 className="font-bold text-gray-800 mb-4">评论 ({comments.length})</h3>
              <div className="space-y-6">
                  {comments.map(comment => (
                      <div key={comment.id} className="flex gap-3">
                          <img src={`https://ui-avatars.com/api/?name=${comment.author}&background=random`} className="w-8 h-8 rounded-full" />
                          <div className="flex-1">
                              <div className="flex justify-between items-center">
                                  <span className="text-sm font-bold text-gray-700">{comment.author}</span>
                                  <button 
                                      onClick={() => handleLikeComment(comment.id)}
                                      className={`flex items-center gap-1 text-xs ${comment.isLiked ? 'text-brand-500' : 'text-gray-400'}`}
                                  >
                                      <ThumbsUp size={12} fill={comment.isLiked ? "currentColor" : "none"} /> {comment.likes}
                                  </button>
                              </div>
                              <p className="text-sm text-gray-800 mt-1">{comment.content}</p>
                              {comment.image && (
                                  <img src={comment.image} alt="Comment" className="mt-2 rounded-lg max-w-[200px] max-h-[200px] object-cover" />
                              )}
                              <div className="mt-2 flex items-center gap-4 text-xs text-gray-400">
                                  <span>{comment.time}</span>
                                  <button 
                                    onClick={() => setReplyTo({ id: comment.id, author: comment.author })}
                                    className="text-gray-500 font-medium"
                                  >
                                    回复
                                  </button>
                              </div>
                              
                              {/* Replies */}
                              {comment.replies && comment.replies.length > 0 && (
                                  <div className="mt-2">
                                      {(expandedComments[comment.id] || 0) === 0 ? (
                                          <button 
                                              onClick={() => handleExpandReplies(comment.id)}
                                              className="text-xs text-brand-500 font-medium flex items-center gap-1 mt-1"
                                          >
                                              —— 展开{comment.replies.length}条回复 <ChevronDown size={12} />
                                          </button>
                                      ) : (
                                          <div className="bg-gray-50 p-3 rounded-lg space-y-2 mt-2 animate-in fade-in slide-in-from-top-2 duration-200">
                                              {comment.replies.slice(0, expandedComments[comment.id]).map(reply => (
                                                  <div key={reply.id} className="flex justify-between items-start">
                                                      <div>
                                                          <span className="font-bold text-xs text-gray-700">{reply.author}: </span>
                                                          <span className="text-xs text-gray-600">{reply.content}</span>
                                                      </div>
                                                      <button 
                                                          onClick={() => handleLikeComment(reply.id)}
                                                          className={`flex items-center gap-1 text-[10px] ${reply.isLiked ? 'text-brand-500' : 'text-gray-400'}`}
                                                      >
                                                          <ThumbsUp size={10} fill={reply.isLiked ? "currentColor" : "none"} /> {reply.likes}
                                                      </button>
                                                  </div>
                                              ))}
                                              
                                              {(expandedComments[comment.id] || 0) < comment.replies.length && (
                                                  <button 
                                                      onClick={() => handleExpandMoreReplies(comment.id)}
                                                      className="text-xs text-brand-500 font-medium mt-2 flex items-center gap-1"
                                                  >
                                                      展开更多回复 <ChevronDown size={12} />
                                                  </button>
                                              )}
                                          </div>
                                      )}
                                  </div>
                              )}
                          </div>
                      </div>
                  ))}
              </div>
           </div>
        </div>

        {/* Share Modal */}
        {showShareModal && (
            <div className="fixed inset-0 z-50 bg-black/50 flex flex-col justify-end animate-in fade-in" onClick={() => setShowShareModal(false)}>
                <div className="bg-white rounded-t-2xl p-6 animate-in slide-in-from-bottom duration-300" onClick={e => e.stopPropagation()}>
                    <h3 className="text-center font-bold text-gray-800 mb-6">分享至</h3>
                    <div className="flex justify-around mb-8">
                        <button onClick={handleWeChatShare} className="flex flex-col items-center gap-2">
                            <div className="w-12 h-12 bg-[#07C160] rounded-full flex items-center justify-center text-white">
                                <MessageSquare size={24} fill="currentColor" />
                            </div>
                            <span className="text-xs text-gray-600">微信好友</span>
                        </button>
                        <button onClick={handleWeChatShare} className="flex flex-col items-center gap-2">
                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-800">
                                <div className="w-6 h-6 border-2 border-gray-800 rounded-full flex items-center justify-center">
                                    <div className="w-4 h-4 border-2 border-gray-800 rounded-full"></div>
                                </div>
                            </div>
                            <span className="text-xs text-gray-600">朋友圈</span>
                        </button>
                        <button onClick={handleCopyLink} className="flex flex-col items-center gap-2">
                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-600">
                                <Share2 size={24} />
                            </div>
                            <span className="text-xs text-gray-600">复制链接</span>
                        </button>
                    </div>
                    <button 
                        onClick={() => setShowShareModal(false)}
                        className="w-full py-3 bg-gray-100 rounded-xl text-gray-600 font-medium"
                    >
                        取消
                    </button>
                </div>
            </div>
        )}

        {/* Comment Input */}
        <div className="sticky bottom-0 bg-white border-t p-3">
            {commentImage && (
                <div className="mb-2 relative inline-block">
                    <img src={commentImage} alt="Preview" className="h-16 w-16 object-cover rounded-lg border border-gray-200" />
                    <button 
                        onClick={() => {
                            setCommentImage(null);
                            if (fileInputRef.current) fileInputRef.current.value = '';
                        }}
                        className="absolute -top-1 -right-1 bg-gray-800 text-white rounded-full p-0.5"
                    >
                        <X size={12} />
                    </button>
                </div>
            )}
            
            {replyTo ? (
                <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center text-xs text-gray-500 px-1">
                        <span>回复 @{replyTo.author}</span>
                        <button onClick={() => setReplyTo(null)}><X size={14}/></button>
                    </div>
                    <div className="flex gap-2 items-center">
                        <input 
                            type="text" 
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            placeholder={`回复 ${replyTo.author}...`} 
                            className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm outline-none" 
                        />
                        <button onClick={handleReplySubmit} className="text-brand-500 font-bold text-sm px-2">回复</button>
                    </div>
                </div>
            ) : (
                <div className="flex gap-2 items-center">
                    <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        ref={fileInputRef}
                        onChange={handleImageSelect}
                    />
                    <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="text-gray-500 p-1"
                    >
                        <ImageIcon size={24} />
                    </button>
                    <input 
                        type="text" 
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="文明发言，友好你我他！" 
                        className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm outline-none" 
                    />
                    <button onClick={handleCommentSubmit} className="text-brand-500 font-bold text-sm px-2">发布</button>
                </div>
            )}
        </div>
      </div>
    );
  }

  // --- List View ---
  return (
    <div className="min-h-full bg-gray-50 pb-20 relative">
      {/* Onboarding Guide Overlay */}
      {showGuide && (
          <div className="fixed inset-0 z-[100] max-w-md mx-auto bg-black/80 flex flex-col justify-center items-center text-white p-8 animate-in fade-in">
              <div className="mb-8 text-center">
                  <h2 className="text-2xl font-bold mb-2">欢迎来到望山云居</h2>
                  <p className="text-sm opacity-80">点击下方按钮开始您的智慧生活</p>
              </div>
              <div className="space-y-4 w-full max-w-xs">
                  <div className="border border-white/30 rounded-lg p-4 bg-white/10 backdrop-blur-sm">
                      <h3 className="font-bold mb-1">📢 社区公告</h3>
                      <p className="text-xs opacity-70">第一时间获取社区最新动态</p>
                  </div>
                  <div className="border border-white/30 rounded-lg p-4 bg-white/10 backdrop-blur-sm">
                      <h3 className="font-bold mb-1">🛠 便民服务</h3>
                      <p className="text-xs opacity-70">报修、缴费、访客一键搞定</p>
                  </div>
              </div>
              <button 
                onClick={onCloseGuide}
                className="mt-12 bg-brand-500 text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-brand-500/40 flex items-center gap-2"
              >
                  开启体验 <ChevronLeft className="rotate-180" />
              </button>
          </div>
      )}

      {/* Header */}
      <div className="bg-brand-500 p-4 pb-12 rounded-b-[2rem] text-white relative">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-1">
            <MapPin size={16} />
            <span className="font-medium text-sm">四季花园</span>
          </div>
          <button onClick={() => onChangeView(ViewState.MESSAGE_CENTER)} className="relative">
             <Bell size={20} />
             {messages.some(m => !m.read) && <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 border-2 border-brand-500 rounded-full"></div>}
          </button>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索公告、邻居..." 
            className="w-full bg-white text-gray-800 rounded-full py-2 pl-9 pr-4 text-sm outline-none"
          />
        </div>
      </div>

      {/* Banner Carousel */}
      <div className="px-4 -mt-8 mb-6 relative z-0">
        <div className="w-full h-40 rounded-xl overflow-hidden shadow-lg bg-gray-200 relative group">
          <div 
             className="w-full h-full flex transition-transform duration-500 ease-out"
             style={{ transform: `translateX(-${currentBanner * 100}%)` }}
          >
             {HOME_BANNER_DATA.map((banner) => (
                 <div 
                    key={banner.id} 
                    className="w-full h-full flex-shrink-0 relative cursor-pointer"
                    onClick={() => handleBannerClick(banner)}
                 >
                     <img src={banner.image} alt={banner.title} className="w-full h-full object-cover" />
                     <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/70 to-transparent text-white">
                         <div className="flex items-center gap-2 mb-1">
                             <span className="text-[10px] bg-brand-500 px-1.5 py-0.5 rounded font-bold">{banner.type === 'VOTE' ? '投票' : banner.type === 'ACTIVITY' ? '活动' : '公告'}</span>
                             <h3 className="font-bold text-sm truncate">{banner.title}</h3>
                         </div>
                     </div>
                 </div>
             ))}
          </div>

          {/* Dots */}
          <div className="absolute bottom-2 right-2 flex gap-1">
              {HOME_BANNER_DATA.map((_, idx) => (
                  <div 
                    key={idx} 
                    className={`h-1.5 rounded-full transition-all ${currentBanner === idx ? 'w-4 bg-brand-500' : 'w-1.5 bg-white/50'}`}
                  />
              ))}
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <div className="px-4 mb-4">
        <div className="flex gap-6 border-b border-gray-200 overflow-x-auto no-scrollbar">
          {['全部', '公告', '活动', '新闻', '政策', '投票问卷'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 whitespace-nowrap text-sm font-medium transition-colors ${
                activeTab === tab ? 'text-brand-500 border-b-2 border-brand-500' : 'text-gray-400'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* News List */}
      <div className="px-4 space-y-4">
        {filteredNews.length > 0 ? (
          filteredNews.map((item) => {
            const activity = item.tag === '活动' ? MOCK_ACTIVITIES.find(a => a.id === item.targetId) : null;
            const vote = item.tag === '投票问卷' ? MOCK_VOTES.find(v => v.id === item.targetId) : null;
            
            const getStatusLabel = (status: ActivityStatus) => {
                switch(status) {
                    case ActivityStatus.WARMING_UP: return { text: '预热中', color: 'bg-blue-500' };
                    case ActivityStatus.REGISTERING: return { text: '报名中', color: 'bg-green-500' };
                    case ActivityStatus.FULL: return { text: '名额已满', color: 'bg-orange-500' };
                    case ActivityStatus.REGISTRATION_CLOSED: return { text: '报名截止', color: 'bg-gray-500' };
                    case ActivityStatus.IN_PROGRESS: return { text: '进行中', color: 'bg-brand-500' };
                    case ActivityStatus.ENDED: return { text: '已结束', color: 'bg-gray-400' };
                    default: return { text: '未知', color: 'bg-gray-300' };
                }
            };

            return (
              <div 
                key={item.id} 
                onClick={() => {
                    if (item.tag === '活动' && item.targetId && onSelectActivity) {
                        onSelectActivity(item.targetId as string);
                    } else if (item.tag === '投票问卷' && item.targetId && onSelectVote) {
                        onSelectVote(item.targetId as string);
                    } else if (item.tag === '投票问卷') {
                        onChangeView(ViewState.SERVICE_VOTING);
                    } else {
                        setSelectedNewsId(item.id);
                    }
                }}
                className="bg-white p-3 rounded-xl shadow-sm flex gap-3 active:scale-[0.98] transition-transform cursor-pointer relative overflow-hidden"
              >
                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex flex-col gap-1">
                    <h3 className="font-medium text-gray-800 leading-snug line-clamp-2 pr-12">{item.title}</h3>
                    {activity && (
                        <div className="flex items-center gap-2 mt-1">
                            <span className={`text-[10px] text-white px-1.5 py-0.5 rounded font-bold ${getStatusLabel(activity.status).color}`}>
                                {getStatusLabel(activity.status).text}
                            </span>
                            <span className="text-[10px] text-gray-400">
                                {activity.currentParticipants}/{activity.maxParticipants} 人已报
                            </span>
                        </div>
                    )}
                    {vote && (
                        <>
                            <div className="flex items-center gap-2 mt-1">
                                <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                                  vote.myVote || vote.myRating ? 'bg-green-100 text-green-600' : 'bg-brand-100 text-brand-600'
                                }`}>
                                    {vote.myVote || vote.myRating ? '已参与' : '未参与'}
                                </span>
                                <span className="text-[10px] font-bold text-gray-400 bg-gray-50 px-2 py-0.5 rounded">
                                    {vote.type === VoteType.SINGLE_CHOICE ? '单选投票' : '满意度调查'}
                                </span>
                                <span className="text-[10px] text-gray-400">
                                    {vote.participantCount} 人已参与
                                </span>
                            </div>
                            {/* Stamp Style Status */}
                            <div className={`absolute top-2 right-2 border-2 rounded-md px-1.5 py-0.5 text-[10px] font-black tracking-widest -rotate-12 opacity-40 pointer-events-none select-none ${
                                vote.status === VoteStatus.IN_PROGRESS 
                                    ? 'border-green-500 text-green-500' 
                                    : 'border-red-500 text-red-500'
                            }`}>
                                {vote.status === VoteStatus.IN_PROGRESS ? '进行中' : '已截止'}
                            </div>
                        </>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                      item.tag === '公告' ? 'bg-orange-100 text-orange-600' : 
                      item.tag === '活动' ? 'bg-green-100 text-green-600' : 
                      item.tag === '政策' ? 'bg-red-100 text-red-600' : 
                      item.tag === '投票问卷' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'
                    }`}>
                      {item.tag}
                    </span>
                    <span className="text-xs text-gray-400">{item.author}</span>
                    <span className="text-xs text-gray-300 ml-auto flex items-center gap-1">
                       {item.views} 浏览
                    </span>
                  </div>
                </div>
                {item.image && (
                  <img src={item.image} alt="" className="w-24 h-20 object-cover rounded-lg bg-gray-100" />
                )}
              </div>
            );
          })
        ) : (
          <div className="text-center text-gray-400 py-10 text-sm">
            暂无相关内容
          </div>
        )}
      </div>
    </div>
  );
};
