import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import ReportModal from '../components/ReportModal'

export default function WorkDetail() {
  const { id } = useParams()
  const [work, setWork] = useState(null)
  const [loading, setLoading] = useState(true)
  const [comments, setComments] = useState([])
  const [comment, setComment] = useState('')
  const [authorName, setAuthorName] = useState('')
  const [liked, setLiked] = useState(() => {
    const saved = localStorage.getItem('likedWorks') || '[]'
    return JSON.parse(saved).includes(id)
  })
  const [showReport, setShowReport] = useState(false)

  useEffect(() => {
    fetchWork()
    fetchComments()
  }, [id])

  const handleLike = async () => {
    const { data: workData } = await supabase.from('works').select('likes').eq('id', id).single()
    const currentLikes = workData?.likes || 0
    
    const newLiked = !liked
    setLiked(newLiked)
    
    const saved = JSON.parse(localStorage.getItem('likedWorks') || '[]')
    const newSaved = newLiked 
      ? [...saved, id] 
      : saved.filter(wid => wid !== id)
    localStorage.setItem('likedWorks', JSON.stringify(newSaved))
    
    await supabase.from('works').update({ 
      likes: newLiked ? currentLikes + 1 : Math.max(0, currentLikes - 1) 
    }).eq('id', id)
    fetchWork()
  }

  const fetchWork = async () => {
    const { data } = await supabase
      .from('works')
      .select('*')
      .eq('id', id)
      .single()
    
    if (data) setWork(data)
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

  const handleComment = async (e) => {
    e.preventDefault()
    if (!comment.trim() || !authorName.trim()) return

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
    <div className="max-w-7xl mx-auto animate-fadeIn px-4">
      {/* 返回按钮 */}
      <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-primary mb-6 transition-colors">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        返回
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 左侧：演示 */}
        <div className="lg:col-span-2">
          {/* 作品信息 */}
          <div className="mb-4">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              {work.title}
            </h1>
            <div className="flex items-center gap-3">
              <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                {work.tech_stack || '未分类'}
              </span>
              <button 
                onClick={handleLike}
                className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium transition-all ${
                  liked 
                    ? 'bg-red-500 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-red-500 hover:text-white'
                }`}
              >
                <svg className="w-4 h-4" fill={liked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {work.likes || 0}
              </button>
              <Link 
                to={`/profile/${work.author_name}`}
                className="text-sm text-gray-400 hover:text-primary"
              >
                by {work.author_name}
              </Link>
              <button 
                onClick={() => setShowReport(true)}
                className="text-sm text-gray-400 hover:text-red-500 ml-auto"
                title="举报"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* 演示 */}
          {work.demo_url && (
            <div className="bg-gray-100 rounded-2xl overflow-hidden border border-gray-200">
              <iframe 
                src={work.demo_url}
                title={work.title}
                className="w-full"
                style={{ height: '600px' }}
              />
            </div>
          )}

          {/* 描述 */}
          <p className="text-gray-600 mt-4">
            {work.description || '暂无描述'}
          </p>

          {/* 链接按钮 */}
          <div className="flex gap-3 mt-4">
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
                新窗口打开
              </a>
            )}
            {work.code_url && (
              <a 
                href={work.code_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg text-gray-700 hover:bg-primary hover:text-white transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                查看源码
              </a>
            )}
          </div>
        </div>

        {/* 右侧：评论 */}
        <div className="lg:col-span-1">
          <div className="sticky top-20">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              评论 ({comments.length})
            </h3>

            {/* 评论列表 */}
            <div className="space-y-3 mb-4 max-h-96 overflow-y-auto">
              {comments.length === 0 && (
                <p className="text-gray-400 text-sm text-center py-4">暂无评论</p>
              )}
              {comments.map((c) => (
                <div key={c.id} className="bg-gray-50 rounded-xl p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-gray-800 text-sm">{c.author_name}</span>
                    <span className="text-xs text-gray-400">
                      {new Date(c.created_at).toLocaleDateString('zh-CN')}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm">{c.content}</p>
                </div>
              ))}
            </div>

            {/* 发表评论 */}
            <form onSubmit={handleComment} className="space-y-2">
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="昵称"
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm"
              />
              <div className="flex gap-2">
                <input
                  type="text"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="说点什么..."
                  className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm"
                />
                <button 
                  type="submit"
                  className="btn btn-primary px-4 py-2 text-sm"
                >
                  发
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* 举报弹窗 */}
      {showReport && work && (
        <ReportModal 
          work={work} 
          onClose={() => setShowReport(false)} 
          onSuccess={(msg) => alert(msg)} 
        />
      )}
    </div>
  )
}
