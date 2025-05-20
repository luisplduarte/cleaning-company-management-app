"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import { cn } from "@/lib/utils"
import { Dropdown } from "@/components/ui/Dropdown"

type NavItem = {
  name: string;
  href?: string;
  type?: 'dropdown';
  items?: Array<{ name: string; href: string }>;
}

const navigation: NavItem[] = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Jobs", href: "/jobs" },
  { name: "Rates", href: "/rates" },
  {
    name: "Clients",
    type: "dropdown",
    items: [
      { name: "Clients List", href: "/clients" },
      { name: "Client Payments", href: "/client-payments" }
    ]
  },
  {
    name: "Workers",
    type: "dropdown",
    items: [
      { name: "Workers List", href: "/workers" },
      { name: "Worker Payments", href: "/worker-payments" }
    ]
  },
]

export function Navbar() {
  const pathname = usePathname()

  return (
    <nav className="bg-blue-700 sticky top-0 z-50 shadow-lg">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex flex-1">
            <div className="flex flex-shrink-0 items-center">
              <Link href="/" className="text-2xl font-black text-white hover:scale-105 transition-all duration-200">
                CleanCo
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-4 py-3 sm:justify-center flex-grow">
              {navigation.map((item) => (
                item.type === 'dropdown' ? (
                  <Dropdown
                    key={item.name}
                    label={item.name}
                    items={item.items || []}
                    buttonClassName={cn(
                      "bg-blue-600 text-white hover:bg-white hover:text-blue-700",
                      "px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:scale-105 h-[38px]"
                    )}
                    menuClassName="bg-blue-600 py-1 min-w-[160px] z-50"
                    itemClassName="px-4 py-2 text-sm transition-colors duration-200"
                  />
                ) : (
                  <Link
                    key={item.name}
                    href={item.href!}
                    className={cn(
                      pathname === item.href
                        ? "bg-white text-blue-700 font-semibold"
                        : "bg-blue-600 text-white hover:bg-white hover:text-blue-700",
                      "inline-flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:scale-105 h-[38px]"
                    )}
                  >
                    {item.name}
                  </Link>
                )
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
            item.type === 'dropdown' ? (
              <Dropdown
                key={item.name}
                label={item.name}
                items={item.items || []}
                buttonClassName={cn(
                  "bg-blue-600 text-white hover:bg-white hover:text-blue-700",
                  "px-4 py-2 rounded-md text-base font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] h-[42px]"
                )}
                menuClassName="bg-blue-600 py-1 min-w-[160px] z-50"
                itemClassName="px-4 py-2 text-base transition-colors duration-200"
              />
            ) : (
              <Link
                key={item.name}
                href={item.href!}
                className={cn(
                  pathname === item.href
                    ? "bg-white text-blue-700 font-semibold"
                    : "bg-blue-600 text-white hover:bg-white hover:text-blue-700",
                  "px-4 py-2 rounded-md text-base font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] h-[42px]"
                )}
              >
                {item.name}
              </Link>
            )
          ))}
        </div>
      </div>
    </nav>
  )
}
