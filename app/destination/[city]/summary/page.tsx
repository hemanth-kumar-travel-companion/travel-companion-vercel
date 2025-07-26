"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useTrip } from "@/contexts/trip-context"
import { useAuth } from "@/hooks/use-auth"
import { supabase } from "@/lib/supabase"
import {
  Receipt,
  Save,
  Edit,
  Download,
  Copy,
  Trash2,
  Bus,
  Hotel,
  MapPin,
  UtensilsCrossed,
  ShoppingBag,
  CheckCircle,
  AlertCircle,
  Info,
} from "lucide-react"

export default function SummaryPage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const city = params.city as string
  const tripId = searchParams.get("tripId")
  const { state, dispatch } = useTrip()
  const { user } = useAuth()
  const [saving, setSaving] = useState(false)
  const [confirming, setConfirming] = useState(false)
  const [isConfirmed, setIsConfirmed] = useState(false)
  const [confirming, setConfirming] = useState(false)
  const [isConfirmed, setIsConfirmed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  useEffect(() => {
    if (tripId) {
      loadTrip()
    }
  }, [tripId])

  const loadTrip = async () => {
    if (!tripId || !user) return

    setLoading(true)
    const { data, error } = await supabase.from("trips").select("*").eq("id", tripId).eq("user_id", user.id).single()

    if (!error && data) {
      const tripState = {
        destination: data.destination,
        transport: data.transport_details || { mode: "bus", option: null, seats: 1, cost: 0 },
        accommodation: data.accommodation_details || { hotel: null, days: 1, cost: 0 },
        attractions: data.attractions_details || { places: [], days: 1, cost: 0 },
        food: data.food_details || { plan: "", cost: 0 },
        shopping: { budget: data.shopping_cost || 0 },
        totalCost: data.total_cost,
      }
      dispatch({ type: "LOAD_TRIP", payload: tripState })
    }
    setLoading(false)
  }

  const saveTrip = async () => {
    if (!user) return

    setSaving(true)
    setMessage("")

    const tripData = {
      user_id: user.id,
      destination: state.destination,
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

    let result
    if (tripId) {
      // Update existing trip
      result = await supabase.from("trips").update(tripData).eq("id", tripId).eq("user_id", user.id)
    } else {
      // Create new trip
      result = await supabase.from("trips").insert([tripData])
    }

    if (result.error) {
      setMessage("Error saving trip: " + result.error.message)
    } else {
      setMessage("Trip saved successfully!")
      setTimeout(() => setMessage(""), 3000)
    }

    setSaving(false)
  }

  const confirmTrip = async () => {
    if (!user) return

    setConfirming(true)
    setMessage("")

    const tripData = {
      user_id: user.id,
      destination: state.destination,
      trip_status: 'booked', // Change status to booked when confirmed
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

    let result
    if (tripId) {
      // Update existing trip with confirmed status
      result = await supabase.from("trips").update(tripData).eq("id", tripId).eq("user_id", user.id)
    } else {
      // Create new trip with confirmed status
      result = await supabase.from("trips").insert([tripData])
    }

    if (result.error) {
      setMessage("Error confirming trip: " + result.error.message)
    } else {
      setIsConfirmed(true)
      setMessage("🎉 Trip confirmed successfully! Your adventure awaits!")
      setTimeout(() => setMessage(""), 5000)
    }

    setConfirming(false)
  }

  const confirmTrip = async () => {
    if (!user) return

    setConfirming(true)
    setMessage("")

    const tripData = {
      user_id: user.id,
      destination: state.destination,
      trip_status: 'booked', // Change status to booked when confirmed
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

    let result
    if (tripId) {
      // Update existing trip with confirmed status
      result = await supabase.from("trips").update(tripData).eq("id", tripId).eq("user_id", user.id)
    } else {
      // Create new trip with confirmed status
      result = await supabase.from("trips").insert([tripData])
    }

    if (result.error) {
      setMessage("Error confirming trip: " + result.error.message)
    } else {
      setIsConfirmed(true)
      setMessage("🎉 Trip confirmed successfully! Your adventure awaits!")
      setTimeout(() => setMessage(""), 5000)
    }

    setConfirming(false)
  }

  const duplicateTrip = () => {
    // Remove tripId from URL to create a new trip
    router.push(`/destination/${city}/summary`)
  }

  const deleteTrip = async () => {
    if (!tripId || !user) return

    const confirmed = confirm("Are you sure you want to delete this trip?")
    if (!confirmed) return

    const { error } = await supabase.from("trips").delete().eq("id", tripId).eq("user_id", user.id)

    if (!error) {
      router.push("/my-trips")
    }
  }

  const downloadPDF = () => {
    // Simple implementation - in a real app, you'd use a PDF library
    const content = `
Trip Summary - ${state.destination.toUpperCase()}

Transportation: ₹${state.transport.cost.toLocaleString()}
${state.transport.option ? `- ${state.transport.option.name}` : "- Not selected"}
${state.transport.seats ? `- ${state.transport.seats} passengers` : ""}

Accommodation: ₹${state.accommodation.cost.toLocaleString()}
${state.accommodation.hotel ? `- ${state.accommodation.hotel.name}` : "- Not selected"}
${state.accommodation.days ? `- ${state.accommodation.days} days` : ""}

Attractions: ₹${state.attractions.cost.toLocaleString()}
${state.attractions.places.length > 0 ? `- ${state.attractions.places.length} places selected` : "- No places selected"}
${state.attractions.places.map((place: any) => `  • ${place.name}`).join("\n")}

Food: ₹${state.food.cost.toLocaleString()}
${state.food.plan ? `- ${state.food.plan} plan` : "- No plan selected"}

Shopping: ₹${state.shopping.budget.toLocaleString()}
${state.shopping.budget > 0 ? "- Budget allocated" : "- No shopping planned"}

TOTAL COST: ₹${state.totalCost.toLocaleString()}
    `

    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${state.destination}-trip-summary.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const summaryItems = [
    {
      icon: Bus,
      label: "Transportation",
      cost: state.transport.cost,
      details: state.transport.option
        ? `${state.transport.option.name} - ${state.transport.seats} passengers`
        : "Not selected",
      description: state.transport.option
        ? `Selected ${state.transport.mode} for ${state.transport.seats} passengers`
        : "Choose your preferred mode of transport",
      color: "text-blue-600",
    },
    {
      icon: Hotel,
      label: "Accommodation",
      cost: state.accommodation.cost,
      details: state.accommodation.hotel
        ? `${state.accommodation.hotel.name} - ${state.accommodation.days} days`
        : "Not selected",
      description: state.accommodation.hotel
        ? `${state.accommodation.days} nights at ${state.accommodation.hotel.name}`
        : "Find the perfect place to stay",
      color: "text-green-600",
    },
    {
      icon: MapPin,
      label: "Attractions",
      cost: state.attractions.cost,
      details: `${state.attractions.places.length} places selected`,
      description:
        state.attractions.places.length > 0
          ? `Visit ${state.attractions.places.length} amazing places over ${state.attractions.days} days`
          : "Discover local attractions and experiences",
      color: "text-purple-600",
    },
    {
      icon: UtensilsCrossed,
      label: "Food",
      cost: state.food.cost,
      details: state.food.plan || "Not selected",
      description: state.food.plan
        ? `${state.food.plan} meal plan for authentic local cuisine`
        : "Explore local food and dining options",
      color: "text-orange-600",
    },
    {
      icon: ShoppingBag,
      label: "Shopping",
      cost: state.shopping.budget,
      details: state.shopping.budget > 0 ? "Budget allocated" : "No shopping planned",
      description:
        state.shopping.budget > 0
          ? `₹${state.shopping.budget.toLocaleString()} budget for shopping and souvenirs`
          : "Set aside budget for shopping and souvenirs",
      color: "text-pink-600",
    },
  ]

  const completedSections = summaryItems.filter((item) => item.cost > 0 || item.details !== "Not selected").length
  const totalSections = summaryItems.length

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2 capitalize">Trip Summary - {state.destination}</h2>
        <p className="text-gray-600">Review your trip details and budget breakdown</p>
        <div className="mt-4">
          <Badge variant={completedSections === totalSections ? "default" : "secondary"} className="text-sm">
            {completedSections === totalSections ? (
              <CheckCircle className="h-4 w-4 mr-1" />
            ) : (
              <AlertCircle className="h-4 w-4 mr-1" />
            )}
            {completedSections}/{totalSections} sections completed
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
                      {!isCompleted && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-2 bg-transparent"
                          onClick={() =>
                            router.push(
                              `/destination/${city}/${
                                item.label.toLowerCase() === "transportation"
                                  ? "transport"
                                  : item.label.toLowerCase() === "accommodation"
                                    ? "stay"
                                    : item.label.toLowerCase() === "attractions"
                                      ? "places"
                                      : item.label.toLowerCase()
                              }`,
                            )
                          }
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Add
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Summary Card */}
        <div className="space-y-4">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200">
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
                disabled={confirming || completedSections < totalSections}
                className="w-full gap-2 bg-green-600 hover:bg-green-700 text-white"
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
                <p className="text-green-700 text-sm">Your trip is now booked and ready to go!</p>
              </div>
            )}

            {!isConfirmed && (
              <Button
                onClick={confirmTrip}
                disabled={confirming || completedSections < totalSections}
                className="w-full gap-2 bg-green-600 hover:bg-green-700 text-white"
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
                <p className="text-green-700 text-sm">Your trip is now booked and ready to go!</p>
              </div>
            )}

            <Button onClick={saveTrip} disabled={saving} className="w-full gap-2" size="lg">
              <Save className="h-4 w-4" />
              {saving ? "Saving..." : tripId ? "Update Trip" : "Save This Trip"}
            </Button>

            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" onClick={duplicateTrip} className="gap-2 bg-transparent">
                <Copy className="h-4 w-4" />
                Duplicate
              </Button>
              <Button variant="outline" onClick={downloadPDF} className="gap-2 bg-transparent">
                <Download className="h-4 w-4" />
                Download
              </Button>
            </div>

            {tripId && (
              <Button variant="destructive" onClick={deleteTrip} className="w-full gap-2">
                <Trash2 className="h-4 w-4" />
                Delete Trip
              </Button>
            )}
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

      {/* Quick Edit Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Quick Actions
            {isConfirmed && (
              <Badge className="bg-green-100 text-green-800">
                <CheckCircle className="h-3 w-3 mr-1" />
                Confirmed
              </Badge>
            )}
            {isConfirmed && (
              <Badge className="bg-green-100 text-green-800">
                <CheckCircle className="h-3 w-3 mr-1" />
                Confirmed
              </Badge>
            )}
          </CardTitle>
          <CardDescription>
            {isConfirmed 
              ? "Your trip is confirmed! You can still make changes if needed."
              : "Make changes to your trip plan"
            }
              ? "Your trip is confirmed! You can still make changes if needed."
              : "Make changes to your trip plan"
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {[
              { label: "Transport", path: "transport", icon: Bus },
              { label: "Stay", path: "stay", icon: Hotel },
              { label: "Places", path: "places", icon: MapPin },
              { label: "Food", path: "food", icon: UtensilsCrossed },
              { label: "Shopping", path: "shopping", icon: ShoppingBag },
            ].map((action) => {
              const Icon = action.icon
              return (
                <Button
                  key={action.path}
                  variant="outline"
                  className={`h-20 flex-col gap-2 bg-transparent ${
                    isConfirmed ? "border-green-200 hover:bg-green-50" : ""
                  }`}
                    isConfirmed ? "border-green-200 hover:bg-green-50" : ""
                  }`}
                  onClick={() => router.push(`/destination/${city}/${action.path}`)}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-xs">Edit {action.label}</span>
                </Button>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
