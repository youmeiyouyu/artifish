import { useState } from 'react'
import Input from '../components/Input'
import Button from '../components/Button'
import Select from '../components/Select'
import Checkbox from '../components/Checkbox'
import Radio from '../components/Radio'
import Switch from '../components/Switch'
import Upload from '../components/Upload'
import Alert from '../components/Alert'
import Tag from '../components/Tag'
import Tabs from '../components/Tabs'

const OPTIONS = [
  { value: 'frontend', label: '前端开发' },
  { value: 'backend', label: '后端开发' },
  { value: 'designer', label: '设计师' },
  { value: 'product', label: '产品经理' },
]

const SKILLS = [
  { value: 'react', label: 'React' },
  { value: 'vue', label: 'Vue' },
  { value: 'node', label: 'Node.js' },
  { value: 'python', label: 'Python' },
  { value: 'figma', label: 'Figma' },
  { value: 'sketch', label: 'Sketch' },
]

export default function FormDemo() {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    phone: '',
    age: '',
    website: '',
    github: '',
    company: '',
    position: '',
    city: '',
    bio: '',
    role: 'frontend',
    skills: [],
    gender: 'male',
    subscribe: false,
    notifications: true,
    theme: 'light',
    level: 'intermediate',
    experience: '3',
    salary: '',
  })

  const [errors, setErrors] = useState({})
  const [success, setSuccess] = useState(false)

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleCheckboxGroup = (field, value, checked) => {
    setForm(prev => ({
      ...prev,
      [field]: checked 
        ? [...prev[field], value]
        : prev[field].filter(v => v !== value)
    }))
  }

  const validate = () => {
    const newErrors = {}
    if (!form.username) newErrors.username = '用户名不能为空'
    if (!form.email) newErrors.email = '邮箱不能为空'
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = '邮箱格式不正确'
    if (!form.password) newErrors.password = '密码不能为空'
    else if (form.password.length < 6) newErrors.password = '密码至少6位'
    if (!form.phone) newErrors.phone = '手机号不能为空'
    else if (!/^1[3-9]\d{9}$/.test(form.phone)) newErrors.phone = '手机号格式不正确'
    return newErrors
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const newErrors = validate()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    setSuccess(true)
    setTimeout(() => setSuccess(false), 3000)
  }

  const handleReset = () => {
    setForm({
      username: '',
      email: '',
      password: '',
      phone: '',
      age: '',
      website: '',
      github: '',
      company: '',
      position: '',
      city: '',
      bio: '',
      role: 'frontend',
      skills: [],
      gender: 'male',
      subscribe: false,
      notifications: true,
      theme: 'light',
      level: 'intermediate',
      experience: '3',
      salary: '',
    })
    setErrors({})
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* 标题 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">ArtFish 组件库表单演示</h1>
          <p className="text-gray-500">基于组件库搭建的多列响应式表单</p>
        </div>

        {success && (
          <Alert type="success" message="提交成功！信息已保存。" className="mb-6" />
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm p-8">
          {/* 基本信息 */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-primary rounded-full"></span>
              基本信息
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Input
                label="用户名"
                value={form.username}
                onChange={(e) => handleChange('username', e.target.value)}
                error={errors.username}
                placeholder="请输入用户名"
              />
              <Input
                label="邮箱"
                type="email"
                value={form.email}
                onChange={(e) => handleChange('email', e.target.value)}
                error={errors.email}
                placeholder="example@email.com"
              />
              <Input
                label="密码"
                type="password"
                value={form.password}
                onChange={(e) => handleChange('password', e.target.value)}
                error={errors.password}
                placeholder="至少6位"
              />
              <Input
                label="手机号"
                value={form.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                error={errors.phone}
                placeholder="1开头11位"
              />
              <Input
                label="年龄"
                type="number"
                value={form.age}
                onChange={(e) => handleChange('age', e.target.value)}
                placeholder="18-100"
              />
              <Input
                label="个人网站"
                value={form.website}
                onChange={(e) => handleChange('website', e.target.value)}
                placeholder="https://"
              />
              <Input
                label="GitHub"
                value={form.github}
                onChange={(e) => handleChange('github', e.target.value)}
                placeholder="username"
              />
              <Input
                label="城市"
                value={form.city}
                onChange={(e) => handleChange('city', e.target.value)}
                placeholder="北京"
              />
            </div>
          </div>

          {/* 职业信息 */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-primary rounded-full"></span>
              职业信息
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Input
                label="公司/组织"
                value={form.company}
                onChange={(e) => handleChange('company', e.target.value)}
                placeholder="公司名称"
              />
              <Input
                label="职位"
                value={form.position}
                onChange={(e) => handleChange('position', e.target.value)}
                placeholder="前端工程师"
              />
              <Select
                label="角色"
                value={form.role}
                onChange={(e) => handleChange('role', e.target.value)}
                options={OPTIONS}
              />
              <Input
                label="工作年限"
                type="number"
                value={form.experience}
                onChange={(e) => handleChange('experience', e.target.value)}
                placeholder="年"
              />
            </div>
          </div>

          {/* 技能选择 */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-primary rounded-full"></span>
              技能 & 特长
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {SKILLS.map(skill => (
                <Checkbox
                  key={skill.value}
                  label={skill.label}
                  checked={form.skills.includes(skill.value)}
                  onChange={(checked) => handleCheckboxGroup('skills', skill.value, checked)}
                />
              ))}
            </div>
          </div>

          {/* 性别 & 等级 */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-primary rounded-full"></span>
              偏好设置
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">性别</label>
                <div className="flex gap-4">
                  <Radio
                    label="男"
                    name="gender"
                    value="male"
                    checked={form.gender === 'male'}
                    onChange={(e) => handleChange('gender', e.target.value)}
                  />
                  <Radio
                    label="女"
                    name="gender"
                    value="female"
                    checked={form.gender === 'female'}
                    onChange={(e) => handleChange('gender', e.target.value)}
                  />
                  <Radio
                    label="保密"
                    name="gender"
                    value="secret"
                    checked={form.gender === 'secret'}
                    onChange={(e) => handleChange('gender', e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">等级</label>
                <div className="flex gap-4">
                  <Radio
                    label="初级"
                    name="level"
                    value="beginner"
                    checked={form.level === 'beginner'}
                    onChange={(e) => handleChange('level', e.target.value)}
                  />
                  <Radio
                    label="中级"
                    name="level"
                    value="intermediate"
                    checked={form.level === 'intermediate'}
                    onChange={(e) => handleChange('level', e.target.value)}
                  />
                  <Radio
                    label="高级"
                    name="level"
                    value="advanced"
                    checked={form.level === 'advanced'}
                    onChange={(e) => handleChange('level', e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">期望薪资</label>
                <Input
                  type="number"
                  value={form.salary}
                  onChange={(e) => handleChange('salary', e.target.value)}
                  placeholder="k RMB/月"
                />
              </div>
            </div>
          </div>

          {/* 开关设置 */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-primary rounded-full"></span>
              通知 & 订阅
            </h2>
            <div className="flex flex-wrap gap-6">
              <Switch
                label="订阅邮件通知"
                checked={form.subscribe}
                onChange={(checked) => handleChange('subscribe', checked)}
              />
              <Switch
                label="开启推送通知"
                checked={form.notifications}
                onChange={(checked) => handleChange('notifications', checked)}
              />
            </div>
          </div>

          {/* 简介 */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-primary rounded-full"></span>
              个人简介
            </h2>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">简介</label>
                <textarea
                  value={form.bio}
                  onChange={(e) => handleChange('bio', e.target.value)}
                  placeholder="介绍一下你自己..."
                  rows={4}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                />
              </div>
            </div>
          </div>

          {/* 文件上传 */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-primary rounded-full"></span>
              附件上传
            </h2>
            <Upload
              accept="image/*"
              maxSize={5 * 1024 * 1024}
              onSuccess={(file) => console.log('上传成功:', file.name)}
              onError={(err) => console.error('上传失败:', err)}
            />
          </div>

          {/* 标签展示 */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-primary rounded-full"></span>
              动态标签
            </h2>
            <div className="flex flex-wrap gap-2">
              {form.skills.map(skill => (
                <Tag
                  key={skill}
                  closable
                  onClose={() => handleCheckboxGroup('skills', skill, false)}
                >
                  {SKILLS.find(s => s.value === skill)?.label}
                </Tag>
              ))}
              {form.role && (
                <Tag color="primary">
                  {OPTIONS.find(o => o.value === form.role)?.label}
                </Tag>
              )}
              {form.level && (
                <Tag color="success">
                  {form.level === 'beginner' ? '初级' : form.level === 'intermediate' ? '中级' : '高级'}
                </Tag>
              )}
            </div>
          </div>

          {/* 提交按钮 */}
          <div className="flex gap-4 pt-4 border-t">
            <Button type="submit" variant="primary">提交表单</Button>
            <Button type="button" variant="outline" onClick={handleReset}>重置</Button>
          </div>
        </form>

        {/* 底部信息 */}
        <div className="text-center mt-8 text-gray-400 text-sm">
          ArtFish Design Component Library · React + TailwindCSS
        </div>
      </div>
    </div>
  )
}
