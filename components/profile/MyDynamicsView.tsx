
import React, { useState } from 'react';
import { ChevronLeft, Heart, MessageSquare } from 'lucide-react';
import { ViewState } from '../../types';
import { MOCK_POSTS, MOCK_COMMENTS } from '../../constants';
import { PostDetailView } from './PostDetailView';

interface MyDynamicsViewProps {
    onChangeView: (v: ViewState) => void;
}

export const MyDynamicsView = ({ onChangeView }: MyDynamicsViewProps) => {
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
