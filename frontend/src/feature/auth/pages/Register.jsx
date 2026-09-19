import React, { useState } from 'react'
import { Link } from 'react-router'

const Register = () => {
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()

    const formData = {
      email,
      username,
      password,
    }

    console.log(formData)
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-blue-950 to-cyan-950 px-4 text-white">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-2xl border border-cyan-400/20 bg-slate-950/70 p-8 shadow-2xl shadow-cyan-950/50 backdrop-blur"
      >
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold">Register</h1>
          <p className="mt-2 text-sm text-cyan-100/70">Create your new account</p>
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

        <div className="mb-5">
          <label htmlFor="username" className="mb-2 block text-sm font-medium text-cyan-100">
            Username
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username"
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

        <button
          type="submit"
          className="w-full rounded-xl bg-gradient-to-r from-blue-500 to-cyan-400 py-3 font-semibold text-slate-950 transition hover:from-blue-400 hover:to-cyan-300"
        >
          Register
        </button>

        <p className="mt-6 text-center text-sm text-cyan-100/70">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-cyan-300 hover:text-cyan-200">
            Login
          </Link>
        </p>
      </form>
    </main>
  )
}

export default Register
