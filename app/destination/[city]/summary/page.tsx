"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useTrip } from "@/contexts/trip-context"
import { useAuth } from "@/hooks/use-auth"
import { supabase } from "@/lib/supabase"
import {
  Receipt,
  Save,
  Download,
  Copy,
  Car,
  Hotel,
  MapPin,
  UtensilsCrossed,
  ShoppingBag,
  CheckCircle,
  Info,
} from "lucide-react"

export default function SummaryPage() {
  const params = useParams()
  const router = useRouter()
  const city = params.city as string
  const [tripId, setTripId] = useState<string | null>(null)
  const { state, dispatch } = useTrip()
  const { user } = useAuth()
  const [saving, setSaving] = useState(false)
  const [confirming, setConfirming] = useState(false)
  const [isConfirmed, setIsConfirmed] = useState(false)
  const [message, setMessage] = useState("")
  const [existingTripId, setExistingTripId] = useState<string | null>(null)

  useEffect(() => {
    // Get tripId from URL search params on client side
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search)
      const urlTripId = urlParams.get('tripId')
      setTripId(urlTripId)
      setExistingTripId(urlTripId)
    }
  }, [])

  const saveTrip = async () => {
    if (!user) return

    setSaving(true)
    setMessage("")

    const tripData = {
      user_id: user.id,
      destination: city,
      transport_cost: state.transport.cost,
      accommodation_cost: state.accommodation.cost,
      attractions_cost: state.attractions.cost,
      food_cost: state.food.cost,
      shopping_cost: state.shopping.budget,
      total_cost: state.totalCost,
      transport_details: state.transport,
      accommodation_details: state.accommodation,
      attractions_details: state.attractions,
      food_details: state.food,
      shopping_details: state.shopping,
      updated_at: new Date().toISOString(),
    }

    try {
      let error
      if (existingTripId) {
        // Update existing trip
        const { error: updateError } = await supabase
          .from("trips")
          .update(tripData)
          .eq("id", existingTripId)
          .eq("user_id", user.id)
        error = updateError
      } else {
        // Create new trip
        const { error: insertError } = await supabase.from("trips").insert([tripData])
        error = insertError
      }

      if (error) {
        setMessage("Error saving trip: " + error.message)
      } else {
        setMessage(existingTripId ? "Trip updated successfully!" : "Trip saved successfully!")
        setTimeout(() => setMessage(""), 3000)
      }
    } catch (error) {
      setMessage("Error saving trip: " + (error as Error).message)
    }

    setSaving(false)
  }

  const confirmTrip = async () => {
    if (!user) return

    setConfirming(true)
    setMessage("")

    const tripData = {
      user_id: user.id,
      destination: city,
      trip_status: 'booked',
      transport_cost: state.transport.cost,
      accommodation_cost: state.accommodation.cost,
      attractions_cost: state.attractions.cost,
      food_cost: state.food.cost,
      shopping_cost: state.shopping.budget,
      total_cost: state.totalCost,
      transport_details: state.transport,
      accommodation_details: state.accommodation,
      attractions_details: state.attractions,
      food_details: state.food,
      shopping_details: state.shopping,
      updated_at: new Date().toISOString(),
    }

    try {
      let error
      if (existingTripId) {
        // Update existing trip and mark as booked
        const { error: updateError } = await supabase
          .from("trips")
          .update(tripData)
          .eq("id", existingTripId)
          .eq("user_id", user.id)
        error = updateError
      } else {
        // Create new trip as booked
        const { error: insertError } = await supabase.from("trips").insert([tripData])
        error = insertError
      }

      if (error) {
        setMessage("Error confirming trip: " + error.message)
      } else {
        setIsConfirmed(true)
        setMessage("🎉 Trip confirmed successfully! Get ready for an amazing adventure!")
        setTimeout(() => setMessage(""), 5000)
      }
    } catch (error) {
      setMessage("Error confirming trip: " + (error as Error).message)
    }

    setConfirming(false)
  }

  const downloadPDF = () => {
    const content = `
${city.toUpperCase()} TRIP SUMMARY

Transportation: ₹${state.transport.cost.toLocaleString()}
${state.transport.option ? `- ${state.transport.option.name}` : ""}

Accommodation: ₹${state.accommodation.cost.toLocaleString()}
${state.accommodation.hotel ? `- ${state.accommodation.hotel.name}` : ""}

Attractions: ₹${state.attractions.cost.toLocaleString()}
${state.attractions.places.length > 0 ? `- ${state.attractions.places.length} places selected` : ""}

Food: ₹${state.food.cost.toLocaleString()}
${state.food.plan ? `- ${state.food.plan} plan` : ""}

Shopping: ₹${state.shopping.budget.toLocaleString()}

TOTAL COST: ₹${state.totalCost.toLocaleString()}
    `

    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${city}-trip-summary.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const summaryItems = [
    {
      icon: Car,
      label: "Transportation",
      cost: state.transport.cost,
      details: state.transport.option ? state.transport.option.name : "Not selected",
      description: state.transport.option
        ? `${state.transport.mode} for ${state.transport.seats} passengers`
        : "Choose transport",
      color: "text-blue-600",
    },
    {
      icon: Hotel,
      label: "Accommodation",
      cost: state.accommodation.cost,
      details: state.accommodation.hotel ? state.accommodation.hotel.name : "Not selected",
      description: state.accommodation.hotel ? `${state.accommodation.days} nights stay` : "Find accommodation",
      color: "text-purple-600",
    },
    {
      icon: MapPin,
      label: "Attractions",
      cost: state.attractions.cost,
      details: `${state.attractions.places.length} places selected`,
      description: `Local travel for ${state.attractions.days} days`,
      color: "text-green-600",
    },
    {
      icon: UtensilsCrossed,
      label: "Food",
      cost: state.food.cost,
      details: state.food.plan || "Not selected",
      description: state.food.plan ? `${state.food.plan} meal plan` : "Choose meal plan",
      color: "text-orange-600",
    },
    {
      icon: ShoppingBag,
      label: "Shopping",
      cost: state.shopping.budget,
      details: state.shopping.budget > 0 ? "Budget allocated" : "No shopping planned",
      description: state.shopping.budget > 0 ? "Local specialties and souvenirs" : "Set shopping budget",
      color: "text-pink-600",
    },
  ]

  const completedSections = summaryItems.filter((item) => item.cost > 0 || item.details !== "Not selected").length

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2 capitalize">Your {city} Trip Summary</h2>
        <p className="text-gray-600">Review your complete trip plan and budget</p>
        <div className="mt-4 flex items-center justify-center gap-4">
          {tripId && (
            <Badge variant="outline">Editing existing trip</Badge>
          )}
          <Badge variant={completedSections === summaryItems.length ? "default" : "secondary"}>
            {completedSections}/{summaryItems.length} sections completed
          </Badge>
        </div>
      </div>

      {/* Trip Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {summaryItems.map((item, index) => {
            const Icon = item.icon
            const isCompleted = item.cost > 0 || item.details !== "Not selected"

            return (
              <Card
                key={index}
                className={`${isCompleted ? "bg-white" : "bg-gray-50"} hover:shadow-md transition-shadow`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className={`p-3 rounded-lg ${isCompleted ? "bg-gray-100" : "bg-gray-200"}`}>
                        <Icon className={`h-6 w-6 ${isCompleted ? item.color : "text-gray-400"}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-1">{item.label}</h3>
                        <p className={`text-sm mb-2 ${isCompleted ? "text-gray-600" : "text-gray-400"}`}>
                          {item.details}
                        </p>
                        <div className="flex items-start gap-2">
                          <Info className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-gray-600">{item.description}</p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <div className={`text-2xl font-bold ${isCompleted ? item.color : "text-gray-400"}`}>
                        ₹{item.cost.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Summary Card */}
        <div className="space-y-4">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-800 flex items-center gap-2">
                <Receipt className="h-5 w-5" />
                Cost Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {summaryItems.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <span className="text-gray-700">{item.label}</span>
                  <span className="font-medium">₹{item.cost.toLocaleString()}</span>
                </div>
              ))}
              <Separator />
              <div className="flex items-center justify-between text-lg font-bold">
                <span className="text-blue-800">Total</span>
                <span className="text-blue-600">₹{state.totalCost.toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="space-y-3">
            {!isConfirmed && (
              <Button
                onClick={confirmTrip}
                disabled={confirming || completedSections < summaryItems.length}
                className="w-full gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                size="lg"
              >
                {confirming ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Confirming Trip...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    Confirm Trip
                  </>
                )}
              </Button>
            )}
            
            {isConfirmed && (
              <div className="w-full p-4 bg-green-100 border border-green-300 rounded-lg text-center">
                <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="text-green-800 font-semibold">Trip Confirmed!</p>
                <p className="text-green-700 text-sm">Your adventure is now booked!</p>
              </div>
            )}

            <Button
              onClick={saveTrip}
              disabled={saving}
              className="w-full gap-2 bg-blue-600 hover:bg-blue-700"
              size="lg"
            >
              <Save className="h-4 w-4" />
              {saving ? "Saving..." : existingTripId ? "Update Trip" : "Save Trip"}
            </Button>

            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" onClick={downloadPDF} className="gap-2 bg-transparent">
                <Download className="h-4 w-4" />
                Download
              </Button>
              <Button variant="outline" onClick={() => router.push("/my-trips")} className="gap-2 bg-transparent">
                <Copy className="h-4 w-4" />
                My Trips
              </Button>
            </div>
          </div>

          {message && (
            <div
              className={`p-3 rounded-md text-sm ${
                message.includes("Error") || message.includes("error")
                  ? "bg-red-50 text-red-700 border border-red-200"
                  : message.includes("🎉")
                    ? "bg-green-50 text-green-700 border border-green-200 text-center font-medium"
                    : "bg-green-50 text-green-700 border border-green-200"
              }`}
            >
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}