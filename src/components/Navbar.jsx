import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-gray-100 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md group-hover:shadow-lg transition-shadow">
              A
            </div>
            <span className="text-xl font-bold text-gray-800 group-hover:text-primary transition-colors">
              Artifish
            </span>
          </Link>

          {/* 导航链接 */}
          <div className="flex items-center gap-6">
            <Link 
              to="/" 
              className="text-gray-600 hover:text-primary transition-colors font-medium"
            >
              发现
            </Link>
            <a 
              href="/button-preview.html"
              target="_blank"
              rel="noopener"
              className="text-gray-600 hover:text-primary transition-colors font-medium"
            >
              组件
            </a>
            <Link 
              to="/upload" 
              className="btn btn-primary flex items-center gap-2"
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
