import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const categories = ['全部', 'React', 'Vue', 'UniApp', 'Taro', 'React Native', '其他']

export default function Home() {
  const [works, setWorks] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('全部')

  useEffect(() => {
    fetchWorks()
  }, [])

  const fetchWorks = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('works')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (data) setWorks(data)
    setLoading(false)
  }

  // 过滤分类
  const filteredWorks = activeCategory === '全部' 
    ? works 
    : works.filter(w => w.tech_stack?.includes(activeCategory))

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    )
  }

  return (
    <div className="animate-fadeIn">
      {/* 分类标签 */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
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

      {/* 空状态 */}
      {filteredWorks.length === 0 && (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🦐</div>
          <p className="text-gray-500 mb-2">还没有作品</p>
          <Link to="/upload" className="text-primary hover:underline">
            上传第一个作品
          </Link>
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
              <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-primary/20 to-primary/5">
                {work.image_url && !work.image_url.includes('picsum.photos') ? (
                  <img 
                    src={work.image_url} 
                    alt={work.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-3 bg-primary/20 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </div>
                      <p className="text-sm text-primary font-medium">点击查看演示</p>
                    </div>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                  <span className="opacity-0 group-hover:opacity-100 text-white font-medium bg-black/30 px-4 py-2 rounded-lg backdrop-blur-sm transition-opacity">
                    查看详情
                  </span>
                </div>
              </div>
              
              {/* 信息 */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 mb-1 group-hover:text-primary transition-colors">
                  {work.title}
                </h3>
                <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                  {work.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
                    {work.tech_stack || '未分类'}
                  </span>
                  <span className="text-xs text-gray-400">
                    by {work.author_name}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* 加载更多 */}
      {filteredWorks.length > 0 && (
        <div className="text-center mt-12">
          <button className="btn btn-outline">
            加载更多
          </button>
        </div>
      )}
    </div>
  )
}
