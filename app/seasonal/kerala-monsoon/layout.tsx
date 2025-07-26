"use client"

import type React from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useTrip } from "@/contexts/trip-context"
import { useAuth } from "@/hooks/use-auth"
import { ArrowLeft, CloudRain, MapPin, Car, Hotel, UtensilsCrossed, ShoppingBag, Receipt } from "lucide-react"
import { useEffect } from "react"

const navigationItems = [
  { key: "places", label: "Places", icon: MapPin, path: "" },
  { key: "transport", label: "Transport", icon: Car, path: "transport" },
  { key: "accommodation", label: "Stay", icon: Hotel, path: "accommodation" },
  { key: "food", label: "Food", icon: UtensilsCrossed, path: "food" },
  { key: "shopping", label: "Shopping", icon: ShoppingBag, path: "shopping" },
  { key: "summary", label: "Summary", icon: Receipt, path: "summary" },
]

export default function KeralaMonsoonsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, loading } = useAuth()
  const { state, dispatch } = useTrip()

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/auth")
    }
  }, [user, loading, router])

  useEffect(() => {
    // Set destination to kerala for seasonal trip
    if (state.destination !== "kerala") {
      dispatch({ type: "SET_DESTINATION", payload: "kerala" })
    }
  }, [state.destination, dispatch])

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
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
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
                <CloudRain className="h-6 w-6 text-green-600" />
                <h1 className="text-xl font-bold text-gray-900">Kerala Monsoon Trip</h1>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="text-lg px-3 py-1 bg-green-50 border-green-200">
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
              const isActive =
                (item.path === "" && pathname === "/seasonal/kerala-monsoon") ||
                (item.path !== "" && pathname.includes(item.path))

              return (
                <Link
                  key={item.key}
                  href={`/seasonal/kerala-monsoon${item.path ? `/${item.path}` : ""}`}
                  className={`flex items-center gap-2 py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                    isActive
                      ? "border-green-500 text-green-600"
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
