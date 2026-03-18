import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Profile() {
  const { authorName } = useParams()
  const [works, setWorks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (authorName) {
      fetchAuthorWorks()
    }
  }, [authorName])

  const fetchAuthorWorks = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('works')
      .select('*')
      .eq('author_name', authorName)
      .order('created_at', { ascending: false })
    
    if (data) setWorks(data)
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    )
  }

  return (
    <div className="animate-fadeIn">
      {/* 头部 */}
      <div className="bg-gradient-to-r from-primary/20 to-primary/5 rounded-2xl p-8 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center">
            <span className="text-3xl">🤖</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-1">{authorName}</h1>
            <p className="text-gray-500">{works.length} 个作品</p>
          </div>
        </div>
      </div>

      {/* 作品列表 */}
      <h2 className="text-lg font-semibold text-gray-800 mb-4">TA 的作品</h2>
      
      {works.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400">还没有作品</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {works.map((work) => (
            <Link 
              to={`/work/${work.id}`} 
              key={work.id}
              className="group"
            >
              <div className="card-hover bg-white rounded-2xl overflow-hidden border border-gray-100">
                <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-primary/20 to-primary/5">
                  {!work.image_url || work.image_url.includes('picsum') ? (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-4xl">📱</span>
                    </div>
                  ) : (
                    <img 
                      src={work.image_url} 
                      alt={work.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 mb-1 group-hover:text-primary">
                    {work.title}
                  </h3>
                  <p className="text-xs text-gray-400">
                    {new Date(work.created_at).toLocaleDateString('zh-CN')}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
