"use client"

import type React from "react"
import { useParams, useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useTrip } from "@/contexts/trip-context"
import { useAuth } from "@/hooks/use-auth"
import { ArrowLeft, Plane, Bus, Hotel, MapPin, UtensilsCrossed, ShoppingBag, Receipt } from "lucide-react"
import { useEffect } from "react"

const navigationItems = [
  { key: "transport", label: "Transport", icon: Bus, path: "transport" },
  { key: "stay", label: "Stay", icon: Hotel, path: "stay" },
  { key: "places", label: "Places", icon: MapPin, path: "places" },
  { key: "food", label: "Food", icon: UtensilsCrossed, path: "food" },
  { key: "shopping", label: "Shopping", icon: ShoppingBag, path: "shopping" },
  { key: "summary", label: "Summary", icon: Receipt, path: "summary" },
]

export default function DestinationLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const params = useParams()
  const router = useRouter()
  const pathname = usePathname()
  const { user, loading } = useAuth()
  const { state, dispatch } = useTrip()
  const city = params.city as string

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace("/auth")
        return
      }
    }
  }, [user, loading, router])

  useEffect(() => {
    if (city && city !== state.destination) {
      dispatch({ type: "SET_DESTINATION", payload: city })
    }
  }, [city, state.destination, dispatch])

  useEffect(() => {
    dispatch({ type: "CALCULATE_TOTAL" })
  }, [
    state.transport.cost,
    state.accommodation.cost,
    state.attractions.cost,
    state.food.cost,
    state.shopping.budget,
    dispatch,
  ])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => router.push("/")} className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Button>
              <div className="flex items-center gap-2">
                <Plane className="h-6 w-6 text-blue-600" />
                <h1 className="text-xl font-bold text-gray-900 capitalize">{city} Trip Planner</h1>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="text-lg px-3 py-1">
                Total: ₹{state.totalCost.toLocaleString()}
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto">
            {navigationItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname.includes(item.path)

              return (
                <Link
                  key={item.key}
                  href={`/destination/${city}/${item.path}`}
                  className={`flex items-center gap-2 py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                    isActive
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              )
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</main>
    </div>
  )
}
