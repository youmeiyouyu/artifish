import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function WorkDetail() {
  const { id } = useParams()
  const [work, setWork] = useState(null)
  const [comments, setComments] = useState([])
  const [liked, setLiked] = useState(false)
  const [comment, setComment] = useState('')
  const [authorName, setAuthorName] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchWork()
    fetchComments()
  }, [id])

  const fetchWork = async () => {
    const { data } = await supabase
      .from('works')
      .select('*')
      .eq('id', id)
      .single()
    
    if (data) {
      setWork(data)
      // 增加浏览量
      await supabase
        .from('works')
        .update({ views: (data.views || 0) + 1 })
        .eq('id', id)
    }
    setLoading(false)
  }

  const fetchComments = async () => {
    const { data } = await supabase
      .from('comments')
      .select('*')
      .eq('work_id', id)
      .order('created_at', { ascending: false })
    
    if (data) setComments(data)
  }

  const handleLike = async () => {
    if (!work) return
    
    const newLikes = liked ? work.likes - 1 : work.likes + 1
    await supabase
      .from('works')
      .update({ likes: newLikes })
      .eq('id', id)
    
    setWork({ ...work, likes: newLikes })
    setLiked(!liked)
  }

  const handleComment = async (e) => {
    e.preventDefault()
    if (!comment.trim() || !authorName.trim()) {
      alert('请填写昵称和评论内容')
      return
    }

    const { error } = await supabase.from('comments').insert({
      work_id: id,
      author_name: authorName,
      content: comment,
    })

    if (!error) {
      setComment('')
      fetchComments()
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    )
  }

  if (!work) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 mb-4">作品不存在</p>
        <Link to="/" className="text-primary hover:underline">返回首页</Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto animate-fadeIn">
      {/* 返回按钮 */}
      <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-primary mb-6 transition-colors">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        返回
      </Link>

      {/* 作品大图 */}
      <div className="bg-gray-100 rounded-2xl overflow-hidden mb-6">
        <img 
          src={work.image_url} 
          alt={work.title}
          className="w-full"
        />
      </div>

      {/* 作品信息 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-3">
          {work.title}
        </h1>
        
        <div className="flex items-center gap-4 mb-4">
          <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
            {work.tech_stack || '未分类'}
          </span>
          <span className="text-gray-400 text-sm">
            by {work.author_name}
          </span>
        </div>

        <p className="text-gray-600 leading-relaxed mb-6">
          {work.description || '暂无描述'}
        </p>

        {/* 链接 */}
        <div className="flex flex-wrap gap-3 mb-6">
          {work.demo_url && (
            <a 
              href={work.demo_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg text-gray-700 hover:bg-primary hover:text-white transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6h6" />
              </svg>
              查看演示
            </a>
          )}
          {work.code_url && (
            <a 
              href={work.code_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg text-gray-700 hover:bg-gray-200 transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.891 9.984 5.73 12 9.891 9.984 3.891 14.27 5.73 12 12 0 6.627-5.373 12-12 12zm0 2c5.514 0 10 4.486 10 10 0 4.469-2.938 8.296-7.078 9.744-1.294.449-2.137.797-2.922.797-.784 0-1.628-.348-2.922-.797-4.14-1.448-7.078-5.275-7.078-9.744 0-5.514 4.486-10 10-10z"/>
              </svg>
              查看代码
            </a>
          )}
        </div>

        {/* 点赞区域 */}
        <div className="flex items-center gap-4 py-4 border-t border-b border-gray-100">
          <button 
            onClick={handleLike}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
              liked 
                ? 'bg-primary text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-primary hover:text-white'
            }`}
          >
            <svg className="w-5 h-5" fill={liked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            {work.likes || 0}
          </button>
          <span className="text-gray-400 text-sm">
            {work.views || 0} 次浏览
          </span>
        </div>
      </div>

      {/* 评论区域 */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          评论 ({comments.length})
        </h3>

        {/* 评论列表 */}
        <div className="space-y-4 mb-6">
          {comments.length === 0 && (
            <p className="text-gray-400 text-center py-4">暂无评论，快来抢沙发</p>
          )}
          {comments.map((c) => (
            <div key={c.id} className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-800">{c.author_name}</span>
                <span className="text-xs text-gray-400">
                  {new Date(c.created_at).toLocaleDateString('zh-CN')}
                </span>
              </div>
              <p className="text-gray-600">{c.content}</p>
            </div>
          ))}
        </div>

        {/* 发表评论 */}
        <form onSubmit={handleComment} className="space-y-3">
          <input
            type="text"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            placeholder="你的昵称"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 input-focus"
          />
          <div className="flex gap-3">
            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="说点什么..."
              className="flex-1 px-4 py-3 rounded-xl border border-gray-200 input-focus"
            />
            <button 
              type="submit"
              className="btn btn-primary px-6"
            >
              发送
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
