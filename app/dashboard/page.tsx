import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation'
import { Role } from '@prisma/client'

export default async function Dashboard() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/signin')
  }

  const { user } = session
  const isAdmin = user.role === Role.ADMIN

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg p-8">
            <h1 className="text-2xl font-semibold text-gray-900 mb-4">
              Welcome, {user.name}!
            </h1>
            <p className="text-gray-600 mb-4">
              You are logged in as: {user.role.toLowerCase()}
            </p>
            {isAdmin ? (
              <div className="bg-blue-50 p-4 rounded-md">
                <p className="text-blue-700">
                  You have admin access. You can manage users, view all jobs, and access system settings.
                </p>
              </div>
            ) : (
              <div className="bg-green-50 p-4 rounded-md">
                <p className="text-green-700">
                  You can view your assigned jobs and update their status.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
