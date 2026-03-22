
import React from 'react';
import { ChevronLeft, Heart, MessageSquare, Share2, ThumbsUp } from 'lucide-react';
import { MOCK_POSTS, MOCK_COMMENTS } from '../../constants';

interface PostDetailViewProps {
    postId: string;
    onBack: () => void;
}

export const PostDetailView = ({ postId, onBack }: PostDetailViewProps) => {
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
