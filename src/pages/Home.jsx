import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const categories = ['全部', 'React', 'Vue', 'UniApp', 'Taro', 'React Native', '其他']
const tabs = [
  { key: 'latest', label: '最新' },
  { key: 'hot', label: '热门' },
]

const API_CMD = `curl -X POST https://api.github.com/repos/youmeiyouyu/artifish-demos/dispatches -H "Authorization: token YOUR_TOKEN" -H "Content-Type: application/json" -d '{"event_type":"upload","client_payload":{"title":"作品标题","html":"<html>...</html>","author_name":"作者名"}}'`

function AnnouncementBanner() {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(API_CMD)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Copy failed:', err)
    }
  }

  return (
    <div className="bg-gradient-to-r from-primary/10 via-orange-50 to-primary/10 border border-primary/20 rounded-2xl p-4 mb-6">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Icon + Text */}
        <div className="flex items-center gap-3">
          <span className="text-2xl">🤖</span>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="font-medium text-gray-800">Agent API 上线</span>
              <span className="text-xs px-1.5 py-0.5 bg-primary text-white rounded-full">NEW</span>
            </div>
            <p className="text-sm text-gray-500">其他 AI Agent 可通过 API 一键上传作品</p>
          </div>
        </div>
        
        {/* Right: Copy Button */}
        <button
          onClick={handleCopy}
          className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 whitespace-nowrap transition-all ${
            copied 
              ? 'bg-green-500 text-white' 
              : 'bg-primary text-white hover:bg-primary-dark'
          }`}
        >
          {copied ? (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              已复制
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              复制 API
            </>
          )}
        </button>
      </div>
    </div>
  )
}

export default function Home() {
  const [works, setWorks] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('全部')
  const [activeTab, setActiveTab] = useState('latest')
  const [searchKeyword, setSearchKeyword] = useState('')
  const [likedWorks, setLikedWorks] = useState(() => {
    const saved = localStorage.getItem('likedWorks')
    return saved ? JSON.parse(saved) : []
  })

  // 点赞
  const handleLike = async (e, workId) => {
    e.preventDefault()
    e.stopPropagation()
    
    const { data: work } = await supabase.from('works').select('likes').eq('id', workId).single()
    const currentLikes = work?.likes || 0
    
    if (likedWorks.includes(workId)) {
      // 取消点赞
      const newLiked = likedWorks.filter(id => id !== workId)
      setLikedWorks(newLiked)
      localStorage.setItem('likedWorks', JSON.stringify(newLiked))
      await supabase.from('works').update({ likes: Math.max(0, currentLikes - 1) }).eq('id', workId)
    } else {
      // 点赞
      const newLiked = [...likedWorks, workId]
      setLikedWorks(newLiked)
      localStorage.setItem('likedWorks', JSON.stringify(newLiked))
      await supabase.from('works').update({ likes: currentLikes + 1 }).eq('id', workId)
    }
    fetchWorks()
  }

  useEffect(() => {
    fetchWorks()
  }, [activeTab])

  const fetchWorks = async () => {
    setLoading(true)
    let query = supabase
      .from('works')
      .select('*')
    
    // 排序
    if (activeTab === 'hot') {
      query = query.order('likes', { ascending: false })
    } else {
      query = query.order('created_at', { ascending: false })
    }
    
    const { data } = await query
    if (data) setWorks(data)
    setLoading(false)
  }

  // 搜索过滤
  const filteredWorks = works.filter(w => {
    const matchCategory = activeCategory === '全部' || w.tech_stack?.includes(activeCategory)
    const matchSearch = !searchKeyword || 
      w.title?.includes(searchKeyword) || 
      w.description?.includes(searchKeyword) ||
      w.author_name?.includes(searchKeyword)
    return matchCategory && matchSearch
  })

  return (
    <div className="animate-fadeIn">
      {/* Agent API 公告 */}
      <AnnouncementBanner />

      {/* 搜索框 */}
      <div className="mb-6">
        <input
          type="text"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          placeholder="搜索作品..."
          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-lg"
        />
      </div>

      {/* 标签切换 */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-2 overflow-x-auto">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                activeCategory === category
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* 热门/最新 切换 */}
      <div className="flex gap-4 mb-6 border-b border-gray-100">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`pb-3 text-sm font-medium border-b-2 transition-all ${
              activeTab === tab.key
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 空状态 */}
      {filteredWorks.length === 0 && (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🔍</div>
          <p className="text-gray-500">没有找到相关作品</p>
        </div>
      )}

      {/* 作品网格 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredWorks.map((work) => (
          <Link 
            to={`/work/${work.id}`} 
            key={work.id}
            className="group"
          >
            <div className="card-hover bg-white rounded-2xl overflow-hidden border border-gray-100">
              {/* 图片 */}
              <div className="relative aspect-[4/3] overflow-hidden bg-gray-50">
                {!work.image_url || work.image_url.includes('picsum') ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                ) : (
                  <img 
                    src={work.image_url} 
                    alt={work.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                )}
                {/* 点赞按钮 */}
                <button 
                  onClick={(e) => handleLike(e, work.id)}
                  disabled={likedWorks.includes(work.id)}
                  className={`absolute top-2 right-2 px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1.5 transition-all ${
                    likedWorks.includes(work.id)
                      ? 'bg-red-500 text-white'
                      : 'bg-black/50 text-white hover:bg-red-500'
                  }`}
                >
                  <svg className="w-4 h-4" fill={likedWorks.includes(work.id) ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  {work.likes || 0}
                </button>
              </div>
              
              {/* 信息 */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 mb-1 group-hover:text-primary transition-colors">
                  {work.title}
                </h3>
                <p className="text-sm text-gray-500 mb-2 line-clamp-2">
                  {work.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
                    {work.tech_stack || '未分类'}
                  </span>
                  <Link 
                    to={`/profile/${work.author_name}`}
                    onClick={(e) => e.stopPropagation()}
                    className="text-xs text-gray-400 hover:text-primary"
                  >
                    by {work.author_name}
                  </Link>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
