import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ipohnmmfgqpaosomfscn.supabase.co'
const supabaseKey = 'sb_publishable_AMvm24uVkmYTZ8vEgG6cLQ_UGrqahjv'

export const supabase = createClient(supabaseUrl, supabaseKey)

// 安全配置
export const securityConfig = {
  // 允许的图片类型
  allowedImageTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  // 最大文件大小 (5MB)
  maxFileSize: 5 * 1024 * 1024,
  // 最大标题长度
  maxTitleLength: 100,
  // 最大描述长度
  maxDescLength: 500,
  // 最大昵称长度
  maxNicknameLength: 50,
}

// 安全过滤函数
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return ''
  return input
    .replace(/[<>]/g, '') // 移除 < > 防止 XSS
    .trim()
}

// 验证图片
export const validateImage = (file) => {
  if (!file) return { valid: false, error: '请选择文件' }
  if (!securityConfig.allowedImageTypes.includes(file.type)) {
    return { valid: false, error: '只支持 JPG、PNG、GIF、WebP 格式' }
  }
  if (file.size > securityConfig.maxFileSize) {
    return { valid: false, error: '文件大小不能超过 5MB' }
  }
  return { valid: true }
}
