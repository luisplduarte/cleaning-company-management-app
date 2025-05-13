export default function TestTailwind() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-blue-700">
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-white p-8 rounded-lg shadow-xl">
          <h1 className="text-3xl font-bold text-blue-600 mb-4">
            Testing Tailwind
          </h1>
          <p className="text-gray-600">
            If you can see this styled, Tailwind is working!
          </p>
        </div>
      </div>
    </div>
  )
}
