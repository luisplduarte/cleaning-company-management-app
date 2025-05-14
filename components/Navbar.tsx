"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Jobs", href: "/jobs" },
  { name: "Clients", href: "/clients" },
  { name: "Workers", href: "/workers" },
]

export function Navbar() {
  const pathname = usePathname()

  return (
    <nav className="bg-blue-700 sticky top-0 z-50 shadow-lg">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex">
            <div className="flex flex-shrink-0 items-center">
              <Link href="/" className="text-2xl font-black text-white hover:scale-105 transition-all duration-200">
                CleanCo
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
              className={cn(
                pathname === item.href
                  ? "bg-white text-blue-700 font-semibold"
                  : "bg-blue-600 text-white hover:bg-white hover:text-blue-700",
                "inline-flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:scale-105"
              )}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center">
            <button
              onClick={() => signOut({ callbackUrl: "/auth/signin" })}
              className="bg-red-600 text-white px-6 py-2 rounded-md font-medium hover:bg-red-700 transform hover:-translate-y-0.5 transition-all duration-200 hover:shadow-md"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="sm:hidden">
        <div className="flex space-x-2 px-3 pb-3 pt-2">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                pathname === item.href
                  ? "bg-white text-blue-700 font-semibold"
                  : "bg-blue-600 text-white hover:bg-white hover:text-blue-700",
                "px-4 py-2 rounded-md text-base font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              )}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}
