'use client'

import { signOut } from 'next-auth/react'

export default function Navbar() {
  const handleLogout = async () => {
    await signOut({ 
      callbackUrl: '/auth/signin'
    })
  }

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            {/* Logo/Brand - to be added later */}
          </div>
          <div className="flex items-center">
            <button 
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors duration-200"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
