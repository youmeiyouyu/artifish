import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav className="sticky top-0 bg-white/95 backdrop-blur-lg border-b border-gray-100 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <img src="/logo.svg" alt="Artifish" className="w-8 h-8" />
            <span className="text-lg font-semibold text-gray-800">
              ArtFish <span className="text-primary">Design</span>
            </span>
          </Link>

          {/* 导航链接 */}
          <div className="flex items-center gap-3">
            <Link 
              to="/form-demo" 
              className="px-3 py-1.5 text-sm text-gray-600 hover:text-primary transition-colors"
            >
              组件库
            </Link>
            <Link 
              to="/upload" 
              className="px-4 py-2 bg-gradient-to-r from-primary to-orange-500 text-white text-sm font-medium rounded-lg hover:shadow-md hover:shadow-primary/20 transition-all flex items-center gap-1.5"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              上传
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
