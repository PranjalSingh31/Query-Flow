import React, { useState } from 'react'
import { Link,useNavigate } from 'react-router'
import { useAuth } from '../hook/useAuth'
import {useSelector} from "react-redux"
import {Navigate} from "react-router-dom"

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const user = useSelector((state) => state.auth.user)
  const loading = useSelector((state) => state.auth.loading)
  const error = useSelector((state) => state.auth.error)

  const {handleLogin} = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    const formData = {
      email,
      password,
    }

    const loggedIn = await handleLogin(formData)
    if (loggedIn) {
      navigate("/")
    }

  }

  if(!loading && user)
  {
    return <Navigate to="/" />
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-blue-950 to-cyan-950 px-4 text-white">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-2xl border border-cyan-400/20 bg-slate-950/70 p-8 shadow-2xl shadow-cyan-950/50 backdrop-blur"
      >
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold">Login</h1>
          <p className="mt-2 text-sm text-cyan-100/70">Welcome back to your account</p>
        </div>

        <div className="mb-5">
          <label htmlFor="email" className="mb-2 block text-sm font-medium text-cyan-100">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
            className="w-full rounded-xl border border-cyan-400/20 bg-slate-900 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-300 focus:ring-4 focus:ring-cyan-400/10"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="password" className="mb-2 block text-sm font-medium text-cyan-100">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            className="w-full rounded-xl border border-cyan-400/20 bg-slate-900 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-300 focus:ring-4 focus:ring-cyan-400/10"
          />
        </div>

        {error && <p className="mb-4 text-sm text-red-300">{error}</p>}

        <button
          type="submit"
          className="w-full rounded-xl bg-gradient-to-r from-blue-500 to-cyan-400 py-3 font-semibold text-slate-950 transition hover:from-blue-400 hover:to-cyan-300"
        >
          Login
        </button>

        <p className="mt-6 text-center text-sm text-cyan-100/70">
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold text-cyan-300 hover:text-cyan-200">
            Register
          </Link>
        </p>
      </form>
    </main>
  )
}

export default Login
