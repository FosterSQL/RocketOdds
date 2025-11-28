import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Register() {
  const [form, setForm] = useState({ username: '', email: '', password: '' })
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  async function submit(e) {
    e.preventDefault()
    setError(null)
    try {
      const res = await fetch('/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      const data = await res.json()
      if (!data.ok) return setError(data.error || 'Registration failed')
      // store token and user
      if (data.token) localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      navigate('/')
    } catch (err) {
      setError('Network error')
    }
  }

  return (
    <div className="register">
      <h2>Register</h2>
      <form onSubmit={submit}>
        <input placeholder="username" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} />
        <input placeholder="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
        <input placeholder="password" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
        <button type="submit">Register</button>
      </form>
      {error && <div style={{ color: 'salmon' }}>{error}</div>}
    </div>
  )
}
