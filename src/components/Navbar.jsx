import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav className="sticky top-0 bg-white/90 backdrop-blur-lg border-b border-gray-100 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 bg-gradient-to-br from-primary to-orange-500 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
              A
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-orange-500 group-hover:bg-clip-text group-hover:text-transparent transition-all">
              Artifish
            </span>
          </Link>

          {/* 导航链接 */}
          <div className="flex items-center gap-3">
            <Link 
              to="/upload" 
              className="px-5 py-2.5 bg-gradient-to-r from-primary to-orange-500 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-primary/25 hover:scale-105 transition-all duration-200 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              上传作品
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
