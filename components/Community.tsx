import React, { useState, useRef } from 'react';
import { MessageSquare, Heart, Share2, Plus, Users, X, Image as ImageIcon, ChevronLeft, ThumbsUp, Video as VideoIcon, PlayCircle, Trash2, Send, MapPin, ChevronDown, Bell } from 'lucide-react';
import { MOCK_POSTS, MOCK_COMMENTS, MOCK_USER } from '../constants';
import { Post, Comment, ViewState, Message } from '../types';

interface CommunityProps {
    onChangeView?: (view: ViewState) => void;
    messages?: Message[];
}

export const Community: React.FC<CommunityProps> = ({ onChangeView, messages = [] }) => {
  const [posts, setPosts] = useState(MOCK_POSTS);
  const [isPosting, setIsPosting] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostImages, setNewPostImages] = useState<string[]>([]);
  const [newPostVideo, setNewPostVideo] = useState<string | null>(null);
  
  // Comments State: Map postId -> Comment[]
  const [comments, setComments] = useState<Record<string, Comment[]>>({
    'p1': MOCK_COMMENTS, // Link mock comments to first post for demo
  });
  const [commentText, setCommentText] = useState('');
  
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  
  // Navigation State for Community Module
  const [selectedCircle, setSelectedCircle] = useState<string | null>(null);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

  const handleLike = (id: string) => {
    setPosts(prev => prev.map(post => {
      if (post.id === id) {
        return {
          ...post,
          isLiked: !post.isLiked,
          likes: post.isLiked ? post.likes - 1 : post.likes + 1
        };
      }
      return post;
    }));
  };

  const handleSendComment = () => {
      if (!selectedPostId || !commentText.trim()) return;

      const newComment: Comment = {
          id: `c_${Date.now()}`,
          author: MOCK_USER.name, 
          avatar: MOCK_USER.avatar,
          content: commentText,
          time: '刚刚',
          likes: 0,
          replies: []
      };

      // Add to local comments state
      setComments(prev => ({
          ...prev,
          [selectedPostId]: [newComment, ...(prev[selectedPostId] || [])]
      }));

      // Update post comment count
      setPosts(prev => prev.map(p => 
          p.id === selectedPostId 
              ? { ...p, comments: p.comments + 1 }
              : p
      ));

      setCommentText('');
  };

  const handleCreatePost = () => {
    if (!newPostContent.trim() && newPostImages.length === 0 && !newPostVideo) return;
    
    const newPost: Post = {
      id: `new_${Date.now()}`,
      author: MOCK_USER.name,
      avatar: MOCK_USER.avatar, 
      time: '刚刚',
      content: newPostContent,
      likes: 0,
      comments: 0,
      isLiked: false,
      tag: selectedCircle ? `#${selectedCircle}` : '#日常',
      circle: selectedCircle || '日常',
      images: newPostImages.length > 0 ? newPostImages : undefined,
      video: newPostVideo || undefined
    };
    
    setPosts([newPost, ...posts]);
    // Reset form
    setNewPostContent('');
    setNewPostImages([]);
    setNewPostVideo(null);
    setIsPosting(false);
  };

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
          const files = Array.from(e.target.files) as File[];
          
          // Read all files asynchronously
          const promises = files.map(file => {
              return new Promise<string>((resolve) => {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                      if (reader.result) resolve(reader.result as string);
                  };
                  reader.readAsDataURL(file);
              });
          });

          const results = await Promise.all(promises);
          setNewPostImages(prev => [...prev, ...results]);
      }
      // Reset input to allow selecting same file again
      if (e.target) e.target.value = '';
  };

  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
          const file = e.target.files[0];
          if (file.size > 50 * 1024 * 1024) { 
              alert('视频大小不能超过50MB');
              return;
          }
          const reader = new FileReader();
          reader.onloadend = () => {
              if (reader.result) {
                  setNewPostVideo(reader.result as string);
                  // Intentionally NOT clearing images to allow mixed media
              }
          };
          reader.readAsDataURL(file);
      }
      if (e.target) e.target.value = '';
  };

  const removeImage = (index: number) => {
      setNewPostImages(prev => prev.filter((_, i) => i !== index));
  };

  // --- VIEW: POST DETAIL ---
  if (selectedPostId) {
      const post = posts.find(p => p.id === selectedPostId);
      if(!post) return null;

      const currentComments = comments[selectedPostId] || [];

      return (
        <div className="min-h-full bg-white flex flex-col pb-20 animate-in slide-in-from-right duration-300">
            <div className="sticky top-0 bg-white z-10 border-b p-4 flex justify-between items-center">
                <button onClick={() => setSelectedPostId(null)} className="p-1 -ml-2">
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

                    {/* Action Bar for Detail View */}
                    <div className="flex justify-between items-center py-3 border-t border-b border-gray-50 mb-4">
                        <button 
                            onClick={() => handleLike(post.id)}
                            className={`flex-1 flex items-center justify-center gap-2 text-sm ${post.isLiked ? 'text-red-500' : 'text-gray-500'}`}
                        >
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

                 {/* Comments */}
                 <div className="p-4 pt-0">
                    <h3 className="font-bold text-sm text-gray-700 mb-4">全部评论 ({currentComments.length})</h3>
                     <div className="space-y-6">
                        {currentComments.length > 0 ? currentComments.map(comment => (
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
                                    {comment.replies && comment.replies.length > 0 && (
                                        <div className="mt-3 bg-gray-50 p-3 rounded-lg space-y-2">
                                            {comment.replies.map(reply => (
                                                <div key={reply.id}>
                                                    <span className="font-bold text-xs text-gray-700">{reply.author}: </span>
                                                    <span className="text-xs text-gray-600">{reply.content}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )) : (
                            <div className="text-center text-gray-400 py-4 text-xs">
                                暂无评论，快来抢沙发~
                            </div>
                        )}
                    </div>
                 </div>
            </div>

            <div className="sticky bottom-0 bg-white border-t p-3 flex gap-2 items-center">
                <input 
                    type="text" 
                    placeholder="说点什么..." 
                    className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm outline-none transition-all focus:bg-white focus:ring-1 focus:ring-brand-500"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendComment()}
                />
                <button 
                    onClick={handleSendComment}
                    disabled={!commentText.trim()}
                    className={`p-2 rounded-full transition-colors ${commentText.trim() ? 'text-brand-500 bg-brand-50' : 'text-gray-300'}`}
                >
                    <Send size={20} />
                </button>
            </div>
        </div>
      )
  }

  // --- VIEW: CIRCLE LIST ---
  // Filter posts if a circle is selected
  const displayedPosts = selectedCircle ? posts.filter(p => p.circle === selectedCircle) : posts;

  return (
    <div className="min-h-full bg-gray-50 pb-20 relative">
      {/* Header */}
      <div className="bg-white sticky top-0 z-10 shadow-sm">
        <div className="p-4 pb-2 flex justify-between items-center">
            {selectedCircle ? (
                <div className="flex items-center gap-2">
                    <button onClick={() => setSelectedCircle(null)}><ChevronLeft /></button>
                    <h2 className="text-lg font-bold">{selectedCircle}</h2>
                </div>
            ) : (
                <h2 className="text-lg font-bold">发现</h2>
            )}
            <button 
                onClick={() => onChangeView?.(ViewState.MESSAGE_CENTER)} 
                className="relative p-1"
            >
                <Bell size={20} className="text-gray-600" />
                {messages.some(m => !m.read) && (
                    <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></div>
                )}
            </button>
        </div>
        
        {/* Circles (Only show on main discovery page) */}
        {!selectedCircle && (
            <div className="flex gap-4 overflow-x-auto no-scrollbar px-4 pb-4">
                {['失物招领', '钓鱼', '萌宠', '美食', '运动', '二手交易', '拼车', '亲子', '摄影', '数码'].map((circle, idx) => (
                    <div key={idx} className="flex flex-col items-center flex-shrink-0 w-16 cursor-pointer" onClick={() => setSelectedCircle(circle)}>
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-100 to-orange-200 flex items-center justify-center mb-1 text-brand-600">
                            <Users size={20} />
                        </div>
                        <span className="text-[10px] text-gray-600 text-center truncate w-full">{circle}</span>
                    </div>
                ))}
            </div>
        )}
      </div>

      {/* Feed */}
      <div className="p-4 space-y-4">
        {selectedCircle && (
            <div className="bg-orange-50 p-3 rounded-lg text-sm text-brand-600 mb-4">
                👋 欢迎来到{selectedCircle}圈子！请文明交流。
            </div>
        )}

        {displayedPosts.map((post) => (
          <div key={post.id} onClick={() => setSelectedPostId(post.id)} className="bg-white rounded-xl p-4 shadow-sm animate-in slide-in-from-bottom-2 duration-300 cursor-pointer">
            <div className="flex gap-3 mb-3">
              <img src={post.avatar} alt="" className="w-10 h-10 rounded-full bg-gray-200" />
              <div>
                <h4 className="font-bold text-sm text-gray-800">{post.author}</h4>
                <p className="text-xs text-gray-400">{post.time}</p>
              </div>
            </div>
            
            <p className="text-sm text-gray-700 mb-3 whitespace-pre-wrap">{post.content} <span className="text-brand-500">{post.tag}</span></p>
            
            {post.video && (
                <div className="mb-3 rounded-lg overflow-hidden relative bg-black h-48 flex items-center justify-center group">
                    <video src={post.video} className="w-full h-full object-cover opacity-80" />
                    <PlayCircle className="absolute text-white w-12 h-12 opacity-80 group-hover:opacity-100 transition-opacity" />
                </div>
            )}

            {/* Render images even if video exists (Mixed Media) */}
            {post.images && (
              <div className={`grid gap-2 mb-3 ${post.images.length === 1 ? 'grid-cols-1' : post.images.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
                 {post.images.slice(0, 3).map((img, idx) => (
                    <img key={idx} src={img} className="rounded-lg w-full aspect-square object-cover bg-gray-100" />
                 ))}
                 {post.images.length > 3 && (
                     <div className="flex items-center justify-center bg-gray-100 rounded-lg text-gray-500 text-xs aspect-square">
                         +{post.images.length - 3}
                     </div>
                 )}
              </div>
            )}
            
            <div className="flex justify-between items-center pt-3 border-t border-gray-50">
              <div className="flex gap-4">
                <button 
                  onClick={(e) => { e.stopPropagation(); handleLike(post.id); }}
                  className={`flex items-center gap-1 text-xs transition-colors ${post.isLiked ? 'text-red-500' : 'text-gray-500'}`}
                >
                    <Heart size={16} className={`transition-transform active:scale-125 ${post.isLiked ? "fill-red-500" : ""}`} />
                    {post.likes}
                </button>
                <button className="flex items-center gap-1 text-gray-500 text-xs">
                    <MessageSquare size={16} />
                    {post.comments}
                </button>
              </div>
              <Share2 size={16} className="text-gray-400" />
            </div>
          </div>
        ))}
        {displayedPosts.length === 0 && (
            <div className="text-center py-10 text-gray-400 text-sm">暂无内容，快来发布第一条吧！</div>
        )}
      </div>
      
      {/* Floating Action Button */}
      <button 
        onClick={() => setIsPosting(true)}
        className="fixed bottom-20 right-4 w-12 h-12 bg-brand-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-brand-500/40 active:scale-95 transition-transform z-20"
      >
        <Plus size={24} />
      </button>

      {/* Post Modal - Optimized */}
      {isPosting && (
        <div className="fixed inset-0 z-50 bg-white sm:bg-black/50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-md h-full sm:h-auto sm:max-h-[85vh] sm:rounded-2xl flex flex-col shadow-2xl animate-in slide-in-from-bottom duration-300 overflow-hidden relative">
                
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-gray-50 bg-white/80 backdrop-blur-md z-10">
                    <button 
                        onClick={() => setIsPosting(false)} 
                        className="text-gray-500 hover:text-gray-800 p-2 -ml-2 rounded-full hover:bg-gray-100 transition"
                    >
                        <X size={24} />
                    </button>
                    <span className="font-bold text-lg text-gray-800">发布动态</span>
                    <button 
                        onClick={handleCreatePost}
                        disabled={!newPostContent.trim() && !newPostVideo && newPostImages.length === 0}
                        className={`px-5 py-1.5 rounded-full text-sm font-bold transition-all transform active:scale-95 ${
                            newPostContent.trim() || newPostVideo || newPostImages.length > 0
                            ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/30' 
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                    >
                        发布
                    </button>
                </div>

                {/* Scrollable Content Area */}
                <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                    
                    {/* User Info & Circle Selector */}
                    <div className="flex items-center gap-3 mb-6">
                        <img src={MOCK_USER.avatar} className="w-10 h-10 rounded-full border border-gray-100" />
                        <div>
                            <div className="font-bold text-sm text-gray-800 mb-0.5">{MOCK_USER.name}</div>
                            <div className="flex items-center text-xs text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full w-fit relative group">
                                <span className="opacity-60 mr-1">发布到:</span>
                                <select 
                                    className="bg-transparent font-bold outline-none appearance-none pr-4 relative z-10 cursor-pointer"
                                    value={selectedCircle || '日常'}
                                    onChange={(e) => setSelectedCircle(e.target.value === '日常' ? null : e.target.value)}
                                >
                                    <option value="日常">日常</option>
                                    <option value="失物招领">失物招领</option>
                                    <option value="钓鱼">钓鱼</option>
                                    <option value="萌宠">萌宠</option>
                                    <option value="美食">美食</option>
                                    <option value="运动">运动</option>
                                </select>
                                <ChevronDown className="w-3 h-3 text-brand-500 absolute right-1 pointer-events-none" />
                            </div>
                        </div>
                    </div>

                    {/* Text Area */}
                    <textarea 
                        className="w-full resize-none outline-none text-base placeholder:text-gray-300 min-h-[150px] mb-4"
                        placeholder="分享此刻的新鲜事..."
                        value={newPostContent}
                        onChange={(e) => setNewPostContent(e.target.value)}
                        autoFocus
                    />

                    {/* Media Grid */}
                    <div className="grid grid-cols-3 gap-2 animate-in fade-in duration-500">
                        {newPostImages.map((img, i) => (
                            <div key={i} className="relative aspect-square rounded-xl overflow-hidden group shadow-sm">
                                <img src={img} className="w-full h-full object-cover" />
                                <button 
                                    onClick={() => removeImage(i)} 
                                    className="absolute top-1 right-1 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
                                >
                                    <X size={12} />
                                </button>
                            </div>
                        ))}
                        
                        {newPostVideo && (
                            <div className="relative aspect-[3/4] col-span-2 rounded-xl overflow-hidden bg-black shadow-sm group">
                                 <video src={newPostVideo} className="w-full h-full object-cover" controls={false} />
                                 <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                     <PlayCircle size={40} className="text-white/80" />
                                 </div>
                                 <button 
                                    onClick={() => setNewPostVideo(null)} 
                                    className="absolute top-2 right-2 bg-black/50 text-white p-1.5 rounded-full hover:bg-black/70 backdrop-blur-sm z-10"
                                >
                                     <X size={16} />
                                 </button>
                            </div>
                        )}
                        
                        {/* Add Button Placeholder - if fewer than 9 images and no video */}
                        {!newPostVideo && newPostImages.length < 9 && (
                            <div 
                                onClick={() => imageInputRef.current?.click()}
                                className="aspect-square rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-300 hover:border-brand-300 hover:text-brand-300 hover:bg-brand-50/30 transition-all cursor-pointer"
                            >
                                <Plus size={24} />
                                <span className="text-xs mt-1">添加图片</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Bottom Toolbar */}
                <div className="p-4 border-t border-gray-50 bg-gray-50/50">
                     <div className="flex gap-6 mb-4">
                         <button onClick={() => imageInputRef.current?.click()} className="flex flex-col items-center gap-1 text-gray-500 hover:text-brand-500 transition-colors">
                            <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-brand-500">
                                <ImageIcon size={20} />
                            </div>
                            <span className="text-[10px]">照片</span>
                         </button>
                         <button onClick={() => videoInputRef.current?.click()} className="flex flex-col items-center gap-1 text-gray-500 hover:text-brand-500 transition-colors">
                            <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-blue-500">
                                <VideoIcon size={20} />
                            </div>
                            <span className="text-[10px]">视频</span>
                         </button>
                         <button className="flex flex-col items-center gap-1 text-gray-500 hover:text-brand-500 transition-colors">
                            <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-green-500">
                                <MapPin size={20} />
                            </div>
                            <span className="text-[10px]">定位</span>
                         </button>
                     </div>
                     
                     <div className="flex items-center gap-2 p-3 bg-brand-50/50 rounded-lg border border-brand-100/50">
                         <input type="checkbox" className="accent-brand-500 w-4 h-4" defaultChecked />
                         <span className="text-xs text-gray-500">我已阅读并同意 <span className="text-brand-500 font-medium cursor-pointer">《社区文明公约》</span></span>
                     </div>
                </div>

                {/* Hidden Inputs */}
                <input type="file" ref={imageInputRef} accept="image/*" multiple className="hidden" onChange={handleImageSelect} />
                <input type="file" ref={videoInputRef} accept="video/*" className="hidden" onChange={handleVideoSelect} />
            </div>
        </div>
      )}
    </div>
  );
};