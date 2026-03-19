import { useState } from 'react'
import { supabase, sanitizeInput } from '../lib/supabase'

const REPORT_REASONS = [
  { value: 'spam', label: '🚫 垃圾广告', desc: '发广告、刷屏等' },
  { value: 'copyright', label: '📵 侵权内容', desc: '抄袭、盗用他人作品' },
  { value: 'inappropriate', label: '🔞 不适当内容', desc: '色情、暴力、违法等' },
  { value: 'fake', label: '🤥 虚假信息', desc: '欺诈、诈骗等内容' },
  { value: 'other', label: '❓ 其他', desc: '其他问题' },
]

export default function ReportModal({ work, onClose, onSuccess }) {
  const [reason, setReason] = useState('')
  const [description, setDescription] = useState('')
  const [reporterName, setReporterName] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [alreadyReported, setAlreadyReported] = useState(() => {
    const saved = localStorage.getItem('reportedWorks') || '[]'
    return JSON.parse(saved).includes(work.id)
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!reason) {
      setError('请选择举报原因')
      return
    }
    if (!reporterName.trim()) {
      setError('请填写昵称')
      return
    }

    setSubmitting(true)
    setError('')

    try {
      const { error: insertError } = await supabase.from('reports').insert({
        work_id: work.id,
        reporter_name: sanitizeInput(reporterName),
        reason: reason,
        description: sanitizeInput(description),
        status: 'pending',
      })

      if (insertError) throw insertError

      // 标记已举报
      const saved = JSON.parse(localStorage.getItem('reportedWorks') || '[]')
      localStorage.setItem('reportedWorks', JSON.stringify([...saved, work.id]))
      setAlreadyReported(true)

      onSuccess?.('举报成功，我们会尽快处理')
      onClose()
    } catch (err) {
      console.error('举报失败:', err)
      setError('提交失败，请重试')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md animate-fadeIn">
        {/* 头部 */}
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-800">举报作品</h3>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {alreadyReported ? (
          <div className="p-6 text-center">
            <div className="text-4xl mb-3">✅</div>
            <p className="text-gray-600">您已举报过该作品</p>
            <button 
              onClick={onClose}
              className="mt-4 px-6 py-2 bg-gray-100 rounded-lg text-gray-600 hover:bg-gray-200 transition-colors"
            >
              关闭
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-4 space-y-4">
            {/* 作品信息 */}
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="font-medium text-gray-800">{work.title}</p>
              <p className="text-sm text-gray-400">by {work.author_name}</p>
            </div>

            {/* 举报原因 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                举报原因 *
              </label>
              <div className="space-y-2">
                {REPORT_REASONS.map((r) => (
                  <label 
                    key={r.value}
                    className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${
                      reason === r.value 
                        ? 'bg-red-50 border-2 border-red-400' 
                        : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
                    }`}
                  >
                    <input
                      type="radio"
                      name="reason"
                      value={r.value}
                      checked={reason === r.value}
                      onChange={(e) => setReason(e.value)}
                      className="sr-only"
                    />
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      reason === r.value ? 'border-red-500' : 'border-gray-300'
                    }`}>
                      {reason === r.value && (
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                      )}
                    </div>
                    <div>
                      <span className="font-medium text-gray-800">{r.label}</span>
                      <span className="text-xs text-gray-400 ml-2">{r.desc}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* 补充说明 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                补充说明（可选）
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="提供更多细节有助于快速处理..."
                rows={3}
                maxLength={200}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-transparent"
              />
              <p className="text-xs text-gray-400 text-right mt-1">
                {description.length}/200
              </p>
            </div>

            {/* 昵称 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                您的昵称 *
              </label>
              <input
                type="text"
                value={reporterName}
                onChange={(e) => setReporterName(e.target.value)}
                placeholder="用于接收处理结果通知"
                maxLength={50}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-transparent"
              />
            </div>

            {/* 错误提示 */}
            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}

            {/* 提交 */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2.5 bg-gray-100 rounded-xl text-gray-600 hover:bg-gray-200 transition-colors font-medium"
              >
                取消
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 px-4 py-2.5 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? '提交中...' : '提交举报'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
