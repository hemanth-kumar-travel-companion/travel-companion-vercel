"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/hooks/use-auth"
import { useTrip } from "@/contexts/trip-context"
import { supabase } from "@/lib/supabase"
import { Plane, MapPin, Calendar, LogOut, Luggage, Star, CloudRain, Sun, Snowflake } from "lucide-react"

const destinations = [
  {
    id: "bengaluru",
    name: "Bengaluru",
    description: "Silicon Valley of India",
    image: "/placeholder.svg?height=200&width=300&text=Bengaluru+Skyline",
    highlights: ["Lalbagh Garden", "Bangalore Palace", "UB City Mall"],
    rating: 4.5,
    avgCost: "₹15,000",
  },
  {
    id: "chennai",
    name: "Chennai",
    description: "Gateway to South India",
    image: "/placeholder.svg?height=200&width=300&text=Chennai+Marina+Beach",
    highlights: ["Marina Beach", "Kapaleeshwarar Temple", "Fort St. George"],
    rating: 4.3,
    avgCost: "₹12,000",
  },
  {
    id: "hyderabad",
    name: "Hyderabad",
    description: "City of Pearls",
    image: "/placeholder.svg?height=200&width=300&text=Hyderabad+Charminar",
    highlights: ["Charminar", "Golconda Fort", "Ramoji Film City"],
    rating: 4.6,
    avgCost: "₹13,500",
  },
  {
    id: "mumbai",
    name: "Mumbai",
    description: "City of Dreams",
    image: "/placeholder.svg?height=200&width=300&text=Mumbai+Gateway+of+India",
    highlights: ["Gateway of India", "Marine Drive", "Bollywood Studios"],
    rating: 4.4,
    avgCost: "₹18,000",
  },
]

const seasonalTrips = [
  {
    id: "monsoon-kerala",
    season: "Monsoon",
    destination: "Kerala",
    title: "Monsoon Magic in Kerala",
    description: "Experience the lush green beauty of God's Own Country during monsoon",
    image: "/placeholder.svg?height=200&width=300&text=Kerala+Monsoon",
    duration: "3-6 days",
    bestTime: "June - September",
    highlights: ["Backwaters", "Tea Plantations", "Waterfalls", "Spice Gardens"],
    icon: CloudRain,
    color: "from-green-400 to-blue-500",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
  },
  {
    id: "summer-rajasthan",
    season: "Summer",
    destination: "Rajasthan",
    title: "Royal Summer in Rajasthan",
    description: "Explore majestic palaces and desert landscapes",
    image: "/placeholder.svg?height=200&width=300&text=Rajasthan+Summer",
    duration: "4-7 days",
    bestTime: "March - May",
    highlights: ["Desert Safari", "Royal Palaces", "Camel Rides", "Cultural Shows"],
    icon: Sun,
    color: "from-orange-400 to-red-500",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
  },
  {
    id: "winter-himachal",
    season: "Winter",
    destination: "Himachal Pradesh",
    title: "Winter Wonderland in Himachal",
    description: "Snow-capped mountains and cozy hill stations",
    image: "/placeholder.svg?height=200&width=300&text=Himachal+Winter",
    duration: "5-8 days",
    bestTime: "December - February",
    highlights: ["Snow Activities", "Mountain Views", "Adventure Sports", "Local Culture"],
    icon: Snowflake,
    color: "from-blue-400 to-purple-500",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
  },
]

export default function HomePage() {
  const { user, signOut, loading } = useAuth()
  const { dispatch } = useTrip()
  const router = useRouter()
  const [savedTrips, setSavedTrips] = useState<any[]>([])
  const [loadingTrips, setLoadingTrips] = useState(false)

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace("/auth")
        return
      }
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user) {
      fetchSavedTrips()
    }
  }, [user])

  const fetchSavedTrips = async () => {
    if (!user) return

    setLoadingTrips(true)
    try {
      const { data, error } = await supabase
        .from("trips")
        .select("*")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false })

      if (!error && data) {
        setSavedTrips(data)
      }
    } catch (error) {
      console.error("Error fetching trips:", error)
    }
    setLoadingTrips(false)
  }

  const handleDestinationSelect = (destinationId: string) => {
    // Reset trip state
    dispatch({ type: "RESET_TRIP" })
    dispatch({ type: "SET_DESTINATION", payload: destinationId })

    // Navigate to transport page as the first step
    router.push(`/destination/${destinationId}/transport`)
  }

  const handleSeasonalTripSelect = (tripId: string) => {
    if (tripId === "monsoon-kerala") {
      router.push("/seasonal/kerala-monsoon")
    }
    // Add other seasonal trips later
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      setSavedTrips([])
      router.replace("/auth")
    } catch (error) {
      console.error("Sign out error:", error)
    }
  }

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
            <div className="flex items-center gap-2">
              <Plane className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Travel Companion</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Welcome, {user.email}</span>
              <Button variant="outline" size="sm" onClick={() => router.push("/my-trips")} className="gap-2">
                <Luggage className="h-4 w-4" />
                My Favourites
              </Button>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Plan Your Perfect Trip</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose your destination and let us help you create an amazing travel experience with budget tracking
          </p>
        </div>

        {/* My Future Trips Preview */}
        {savedTrips.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-semibold text-gray-900">Your Favourite Trips</h3>
              <Button variant="outline" onClick={() => router.push("/my-trips")} className="gap-2">
                <Calendar className="h-4 w-4" />
                View All Favourites
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedTrips.slice(0, 3).map((trip) => (
                <Card key={trip.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="capitalize">{trip.destination}</CardTitle>
                      <Badge variant="secondary">₹{trip.total_cost.toLocaleString()}</Badge>
                    </div>
                    <CardDescription>Last updated: {new Date(trip.updated_at).toLocaleDateString()}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      variant="outline"
                      className="w-full bg-transparent"
                      onClick={() => router.push(`/destination/${trip.destination}/summary?tripId=${trip.id}`)}
                    >
                      View Trip
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Destinations Grid */}
        <div className="mb-12">
          <h3 className="text-2xl font-semibold text-gray-900 mb-6">Choose Your Destination</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {destinations.map((destination) => (
              <Card
                key={destination.id}
                className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group"
                onClick={() => handleDestinationSelect(destination.id)}
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={destination.image || "/placeholder.svg"}
                    alt={destination.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-white/90 text-gray-900">
                      <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                      {destination.rating}
                    </Badge>
                  </div>
                </div>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">{destination.name}</CardTitle>
                    <Badge variant="outline">{destination.avgCost}</Badge>
                  </div>
                  <CardDescription>{destination.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">Top Attractions:</p>
                    <div className="flex flex-wrap gap-1">
                      {destination.highlights.map((highlight, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {highlight}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Button className="w-full mt-4 group-hover:bg-blue-700 transition-colors">
                    <MapPin className="h-4 w-4 mr-2" />
                    Plan Trip
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Seasonal Trips Section */}
        <div className="mb-12">
          <h3 className="text-2xl font-semibold text-gray-900 mb-6">Seasonal Trips</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {seasonalTrips.map((trip) => {
              const Icon = trip.icon
              return (
                <Card
                  key={trip.id}
                  className={`overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group ${trip.bgColor} ${trip.borderColor} border-2`}
                >
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={trip.image || "/placeholder.svg"}
                      alt={trip.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t ${trip.color} opacity-20`}></div>
                    <div className="absolute top-4 left-4">
                      <Badge className={`bg-white/90 text-gray-900 gap-1`}>
                        <Icon className="h-3 w-3" />
                        {trip.season}
                      </Badge>
                    </div>
                    <div className="absolute top-4 right-4">
                      <Badge variant="outline" className="bg-white/90 text-gray-900">
                        {trip.duration}
                      </Badge>
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-xl">{trip.title}</CardTitle>
                    <CardDescription>{trip.description}</CardDescription>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>Best Time: {trip.bestTime}</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">Highlights:</p>
                        <div className="flex flex-wrap gap-1">
                          {trip.highlights.map((highlight, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {highlight}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <Button
                        className="w-full group-hover:bg-blue-700 transition-colors"
                        onClick={() => handleSeasonalTripSelect(trip.id)}
                      >
                        <MapPin className="h-4 w-4 mr-2" />
                        View More
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-white rounded-lg p-8 shadow-sm">
          <h3 className="text-2xl font-semibold text-gray-900 mb-6 text-center">Why Choose Travel Companion?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <MapPin className="h-8 w-8 text-blue-600" />
              </div>
              <h4 className="text-lg font-semibold mb-2">Smart Planning</h4>
              <p className="text-gray-600">
                Comprehensive trip planning with transport, stay, attractions, food, and shopping
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Calendar className="h-8 w-8 text-green-600" />
              </div>
              <h4 className="text-lg font-semibold mb-2">Budget Tracking</h4>
              <p className="text-gray-600">
                Real-time budget calculation and cost breakdown for every aspect of your trip
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Luggage className="h-8 w-8 text-purple-600" />
              </div>
              <h4 className="text-lg font-semibold mb-2">Save & Manage</h4>
              <p className="text-gray-600">Save multiple trip plans and manage them easily from your dashboard</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
