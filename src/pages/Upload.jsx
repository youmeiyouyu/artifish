import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Upload() {
  const navigate = useNavigate()
  const [uploading, setUploading] = useState(false)
  const [form, setForm] = useState({
    title: '',
    description: '',
    techStack: '',
    demoUrl: '',
    codeUrl: '',
    authorName: '',
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setUploading(true)

    // 模拟图片上传（实际需要 Storage）
    const imageUrl = `https://picsum.photos/seed/${Date.now()}/400/300`

    const { error } = await supabase.from('works').insert({
      title: form.title,
      description: form.description,
      tech_stack: form.techStack,
      demo_url: form.demoUrl,
      code_url: form.codeUrl,
      author_name: form.authorName,
      image_url: imageUrl,
    })

    if (error) {
      alert('上传失败: ' + error.message)
    } else {
      alert('作品上传成功！')
      navigate('/')
    }
    setUploading(false)
  }

  return (
    <div className="max-w-2xl mx-auto animate-fadeIn">
      <h1 className="text-2xl font-bold text-gray-800 mb-8">上传作品</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 作品截图 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            作品截图 *
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-primary transition-colors cursor-pointer">
            <svg className="w-12 h-12 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828l0 0 8 8a2 2 0 001.414.586l4 4m0 0l8-8m-8 8l8-8" />
            </svg>
            <p className="text-gray-500 mb-1">点击或拖拽上传图片</p>
            <p className="text-xs text-gray-400">（演示模式：自动生成随机图片）</p>
          </div>
        </div>

        {/* 作品标题 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            作品标题 *
          </label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({...form, title: e.target.value})}
            placeholder="例如：CRM 客户管理系统"
            className="w-full px-4 py-3 rounded-lg border border-gray-200 input-focus"
            required
          />
        </div>

        {/* 作品描述 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            作品描述
          </label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({...form, description: e.target.value})}
            placeholder="介绍一下你的作品..."
            rows={3}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 input-focus resize-none"
          />
        </div>

        {/* 技术栈 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            技术栈 *
          </label>
          <input
            type="text"
            value={form.techStack}
            onChange={(e) => setForm({...form, techStack: e.target.value})}
            placeholder="例如：React + Ant Design"
            className="w-full px-4 py-3 rounded-lg border border-gray-200 input-focus"
            required
          />
        </div>

        {/* 演示链接 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            演示地址
          </label>
          <input
            type="url"
            value={form.demoUrl}
            onChange={(e) => setForm({...form, demoUrl: e.target.value})}
            placeholder="https://"
            className="w-full px-4 py-3 rounded-lg border border-gray-200 input-focus"
          />
        </div>

        {/* 代码链接 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            代码仓库
          </label>
          <input
            type="url"
            value={form.codeUrl}
            onChange={(e) => setForm({...form, codeUrl: e.target.value})}
            placeholder="https://github.com/xxx"
            className="w-full px-4 py-3 rounded-lg border border-gray-200 input-focus"
          />
        </div>

        {/* 作者名称 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            作者名称 *
          </label>
          <input
            type="text"
            value={form.authorName}
            onChange={(e) => setForm({...form, authorName: e.target.value})}
            placeholder="给自己起个名字"
            className="w-full px-4 py-3 rounded-lg border border-gray-200 input-focus"
            required
          />
        </div>

        {/* 提交按钮 */}
        <button
          type="submit"
          disabled={uploading}
          className="w-full btn btn-primary py-3 text-lg font-medium disabled:opacity-50"
        >
          {uploading ? '上传中...' : '发布作品'}
        </button>
      </form>
    </div>
  )
}
