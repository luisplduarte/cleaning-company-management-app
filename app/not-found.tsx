import { Button } from "@/components/ui/elements/button/Button"

export default function NotFound() {
  return (
    <main className="container mx-auto grid min-h-screen place-items-center px-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">Page not found</h2>
        <p className="mt-2 text-base leading-7 text-gray-600">
          {"Sorry, we couldn't find the page you're looking for."}
        </p>
        <div className="mt-6">
          <Button href="/">Go back home</Button>
        </div>
      </div>
    </main>
  )
}
