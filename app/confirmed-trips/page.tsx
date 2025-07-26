"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/hooks/use-auth"
import { supabase } from "@/lib/supabase"
import {
  CheckCircle,
  Search,
  Calendar,
  MapPin,
  Eye,
  Edit,
  Trash2,
  Plus,
  ArrowLeft,
  Filter,
  Bus,
  Hotel,
  UtensilsCrossed,
  ShoppingBag,
} from "lucide-react"

export default function ConfirmedTripsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [trips, setTrips] = useState<any[]>([])
  const [filteredTrips, setFilteredTrips] = useState<any[]>([])
  const [loadingTrips, setLoadingTrips] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("updated_at")
  const [filterBy, setFilterBy] = useState("all")

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
      fetchConfirmedTrips()
    }
  }, [user])

  useEffect(() => {
    filterAndSortTrips()
  }, [trips, searchTerm, sortBy, filterBy])

  const fetchConfirmedTrips = async () => {
    if (!user) return

    setLoadingTrips(true)
    try {
      const { data, error } = await supabase
        .from("trips")
        .select("*")
        .eq("user_id", user.id)
        .eq("trip_status", "booked") // Only fetch confirmed trips
        .order("updated_at", { ascending: false })

      if (!error && data) {
        setTrips(data)
      }
    } catch (error) {
      console.error("Error fetching confirmed trips:", error)
    }
    setLoadingTrips(false)
  }

  const filterAndSortTrips = () => {
    let filtered = [...trips]

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter((trip) => trip.destination.toLowerCase().includes(searchTerm.toLowerCase()))
    }

    // Apply destination filter
    if (filterBy !== "all") {
      filtered = filtered.filter((trip) => trip.destination === filterBy)
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "destination":
          return a.destination.localeCompare(b.destination)
        case "total_cost":
          return b.total_cost - a.total_cost
        case "created_at":
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        case "updated_at":
        default:
          return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      }
    })

    setFilteredTrips(filtered)
  }

  const deleteTrip = async (tripId: string) => {
    const confirmed = confirm("Are you sure you want to delete this confirmed trip?")
    if (!confirmed) return

    try {
      const { error } = await supabase.from("trips").delete().eq("id", tripId).eq("user_id", user?.id)

      if (!error) {
        setTrips(trips.filter((trip) => trip.id !== tripId))
      }
    } catch (error) {
      console.error("Error deleting trip:", error)
    }
  }

  const getUniqueDestinations = () => {
    const destinations = [...new Set(trips.map((trip) => trip.destination))]
    return destinations.sort()
  }

  const getTripDetails = (trip: any) => {
    const details = []

    if (trip.transport_details?.option) {
      details.push({
        icon: Bus,
        label: "Transport",
        value: trip.transport_details.option.name || "Selected",
        cost: trip.transport_cost,
      })
    }

    if (trip.accommodation_details?.hotel) {
      details.push({
        icon: Hotel,
        label: "Stay",
        value: trip.accommodation_details.hotel.name || "Selected",
        cost: trip.accommodation_cost,
      })
    }

    if (trip.attractions_details?.places?.length > 0) {
      details.push({
        icon: MapPin,
        label: "Places",
        value: `${trip.attractions_details.places.length} places`,
        cost: trip.attractions_cost,
      })
    }

    if (trip.food_details?.plan) {
      details.push({
        icon: UtensilsCrossed,
        label: "Food",
        value: trip.food_details.plan,
        cost: trip.food_cost,
      })
    }

    if (trip.shopping_cost > 0) {
      details.push({
        icon: ShoppingBag,
        label: "Shopping",
        value: "Budget set",
        cost: trip.shopping_cost,
      })
    }

    return details
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
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => router.push("/")} className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Button>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-6 w-6 text-green-600" />
                <h1 className="text-xl font-bold text-gray-900">My Confirmed Trips</h1>
              </div>
            </div>
            <Button onClick={() => router.push("/")} className="gap-2">
              <Plus className="h-4 w-4" />
              Plan New Trip
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters and Search */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search confirmed trips by destination..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterBy} onValueChange={setFilterBy}>
                <SelectTrigger className="w-40">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Destinations</SelectItem>
                  {getUniqueDestinations().map((destination) => (
                    <SelectItem key={destination} value={destination} className="capitalize">
                      {destination}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="updated_at">Last Updated</SelectItem>
                <SelectItem value="created_at">Date Created</SelectItem>
                <SelectItem value="destination">Destination</SelectItem>
                <SelectItem value="total_cost">Total Cost</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span>Total Confirmed Trips: {trips.length}</span>
            {searchTerm || filterBy !== "all" ? <span>Showing: {filteredTrips.length}</span> : null}
          </div>
        </div>

        {/* Trips Grid */}
        {loadingTrips ? (
          <div className="flex items-center justify-center min-h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600"></div>
          </div>
        ) : filteredTrips.length === 0 ? (
          <div className="text-center py-16">
            <CheckCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {trips.length === 0 ? "No confirmed trips yet" : "No trips match your search"}
            </h3>
            <p className="text-gray-600 mb-6">
              {trips.length === 0 ? "Confirm your first trip to see it here!" : "Try adjusting your search or filters"}
            </p>
            <Button onClick={() => router.push("/")} className="gap-2">
              <Plus className="h-4 w-4" />
              Plan Your First Trip
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTrips.map((trip) => {
              const tripDetails = getTripDetails(trip)
              return (
                <Card key={trip.id} className="hover:shadow-xl transition-all duration-300 hover:scale-105 transform border-green-200">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="capitalize flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-green-600" />
                        {trip.destination}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Confirmed
                        </Badge>
                        <Badge
                          variant="outline"
                          className="text-lg font-semibold bg-gradient-to-r from-green-50 to-green-100"
                        >
                          ₹{trip.total_cost.toLocaleString()}
                        </Badge>
                      </div>
                    </div>
                    <CardDescription className="space-y-1">
                      <div className="flex items-center gap-1 text-xs">
                        <Calendar className="h-3 w-3" />
                        Confirmed: {new Date(trip.updated_at).toLocaleDateString()}
                      </div>
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Trip Details */}
                    {tripDetails.length > 0 ? (
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-gray-700">Trip Details:</h4>
                        <div className="grid grid-cols-1 gap-2">
                          {tripDetails.map((detail, index) => {
                            const Icon = detail.icon
                            return (
                              <div
                                key={index}
                                className="flex items-center justify-between text-xs bg-green-50 p-2 rounded"
                              >
                                <div className="flex items-center gap-2">
                                  <Icon className="h-3 w-3 text-green-600" />
                                  <span className="font-medium">{detail.label}:</span>
                                  <span className="text-gray-600">{detail.value}</span>
                                </div>
                                <span className="font-medium text-green-600">₹{detail.cost.toLocaleString()}</span>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-4 text-gray-500 text-sm">
                        <p>Trip confirmed but details not available</p>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 gap-1 bg-transparent hover:bg-green-50 hover:text-green-600 hover:border-green-300 transition-all"
                        onClick={() => router.push(`/destination/${trip.destination}/summary?tripId=${trip.id}`)}
                      >
                        <Eye className="h-3 w-3" />
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 gap-1 bg-transparent hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 transition-all"
                        onClick={() => router.push(`/destination/${trip.destination}/transport?tripId=${trip.id}`)}
                      >
                        <Edit className="h-3 w-3" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1 text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-300 bg-transparent transition-all"
                        onClick={() => deleteTrip(trip.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}