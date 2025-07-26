"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useTrip } from "@/contexts/trip-context"
import { useAuth } from "@/hooks/use-auth"
import { supabase } from "@/lib/supabase"
import { Bus, Train, Plane, Clock, MapPin, Users, CheckCircle } from "lucide-react"

const transportOptions = {
  bus: [
    {
      id: 1,
      name: "Volvo AC Sleeper",
      departure: "10:30 PM",
      arrival: "6:00 AM",
      duration: "7h 30m",
      price: 1200,
      rating: 4.2,
      amenities: ["AC", "Sleeper", "Charging Point", "Water Bottle"],
    },
    {
      id: 2,
      name: "Mercedes Multi-Axle",
      departure: "11:00 PM",
      arrival: "6:30 AM",
      duration: "7h 30m",
      price: 1000,
      rating: 4.0,
      amenities: ["AC", "Semi-Sleeper", "Blanket", "Water"],
    },
    {
      id: 3,
      name: "Scania AC Seater",
      departure: "9:00 PM",
      arrival: "5:30 AM",
      duration: "8h 30m",
      price: 800,
      rating: 3.8,
      amenities: ["AC", "Pushback Seats", "Reading Light"],
    },
    {
      id: 4,
      name: "Ashok Leyland AC",
      departure: "10:00 PM",
      arrival: "6:15 AM",
      duration: "8h 15m",
      price: 900,
      rating: 3.9,
      amenities: ["AC", "Comfortable Seats", "Music System"],
    },
    {
      id: 5,
      name: "Tata Marcopolo",
      departure: "11:30 PM",
      arrival: "7:00 AM",
      duration: "7h 30m",
      price: 1100,
      rating: 4.1,
      amenities: ["AC", "Sleeper", "GPS Tracking", "CCTV"],
    },
  ],
  train: [
    {
      id: 1,
      name: "Rajdhani Express",
      departure: "8:00 PM",
      arrival: "6:00 AM",
      duration: "10h",
      price: 2500,
      rating: 4.5,
      class: "2AC",
      amenities: ["AC", "Meals Included", "Bedding", "Charging Point"],
    },
    {
      id: 2,
      name: "Shatabdi Express",
      departure: "6:00 AM",
      arrival: "2:00 PM",
      duration: "8h",
      price: 1800,
      rating: 4.3,
      class: "CC",
      amenities: ["AC", "Meals", "Comfortable Seats", "Pantry Car"],
    },
    {
      id: 3,
      name: "Duronto Express",
      departure: "9:30 PM",
      arrival: "7:30 AM",
      duration: "10h",
      price: 2200,
      rating: 4.2,
      class: "3AC",
      amenities: ["AC", "Bedding", "Meals", "Reading Light"],
    },
    {
      id: 4,
      name: "Jan Shatabdi",
      departure: "5:30 AM",
      arrival: "1:30 PM",
      duration: "8h",
      price: 1200,
      rating: 4.0,
      class: "CC",
      amenities: ["AC", "Snacks", "Comfortable Seats"],
    },
    {
      id: 5,
      name: "Superfast Express",
      departure: "10:15 PM",
      arrival: "8:15 AM",
      duration: "10h",
      price: 1500,
      rating: 3.9,
      class: "SL",
      amenities: ["Fan", "Bedding", "Charging Point"],
    },
  ],
  flight: [
    {
      id: 1,
      name: "IndiGo 6E-123",
      departure: "6:00 AM",
      arrival: "8:30 AM",
      duration: "2h 30m",
      price: 4500,
      rating: 4.1,
      airline: "IndiGo",
      amenities: ["Cabin Baggage", "Snacks", "On-time Performance"],
    },
    {
      id: 2,
      name: "SpiceJet SG-456",
      departure: "9:15 AM",
      arrival: "11:45 AM",
      duration: "2h 30m",
      price: 4200,
      rating: 3.9,
      airline: "SpiceJet",
      amenities: ["Cabin Baggage", "Meals", "Entertainment"],
    },
    {
      id: 3,
      name: "Air India AI-789",
      departure: "2:30 PM",
      arrival: "5:00 PM",
      duration: "2h 30m",
      price: 5200,
      rating: 4.0,
      airline: "Air India",
      amenities: ["Cabin Baggage", "Meals", "Checked Baggage"],
    },
    {
      id: 4,
      name: "Vistara UK-321",
      departure: "7:45 PM",
      arrival: "10:15 PM",
      duration: "2h 30m",
      price: 5800,
      rating: 4.4,
      airline: "Vistara",
      amenities: ["Premium Service", "Meals", "Entertainment"],
    },
    {
      id: 5,
      name: "GoAir G8-654",
      departure: "12:30 PM",
      arrival: "3:00 PM",
      duration: "2h 30m",
      price: 3800,
      rating: 3.7,
      airline: "GoAir",
      amenities: ["Cabin Baggage", "Snacks", "Budget Friendly"],
    },
  ],
}

export default function TransportPage() {
  const params = useParams()
  const router = useRouter()
  const city = params.city as string
  const [tripId, setTripId] = useState<string | null>(null)
  const { user } = useAuth()
  const { state, dispatch } = useTrip()
  const [selectedMode, setSelectedMode] = useState<"bus" | "train" | "flight">(state.transport.mode)
  const [selectedOption, setSelectedOption] = useState(state.transport.option)
  const [passengers, setPassengers] = useState(state.transport.seats.toString())
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Get tripId from URL search params on client side
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search)
      setTripId(urlParams.get('tripId'))
    }
  }, [])

  useEffect(() => {
    if (tripId && user) {
      loadTripData()
    }
  }, [tripId, user])

  const loadTripData = async () => {
    if (!tripId || !user) return

    setLoading(true)
    try {
      const { data, error } = await supabase.from("trips").select("*").eq("id", tripId).eq("user_id", user.id).single()

      if (!error && data && data.transport_details) {
        const transportDetails = data.transport_details
        if (transportDetails.mode) {
          setSelectedMode(transportDetails.mode)
          setSelectedOption(transportDetails.option)
          setPassengers(transportDetails.seats?.toString() || "1")

          // Update context with loaded data
          dispatch({
            type: "SET_TRANSPORT",
            payload: {
              mode: transportDetails.mode,
              option: transportDetails.option,
              seats: transportDetails.seats || 1,
              cost: transportDetails.cost || 0,
            },
          })
        }
      }
    } catch (error) {
      console.error("Error loading trip data:", error)
    }
    setLoading(false)
  }

  const handleModeChange = (mode: "bus" | "train" | "flight") => {
    setSelectedMode(mode)
    setSelectedOption(null)
    dispatch({ type: "SET_TRANSPORT", payload: { mode, option: null, cost: 0 } })
  }

  const handleOptionSelect = (option: any) => {
    setSelectedOption(option)
    const totalCost = option.price * Number.parseInt(passengers)
    dispatch({
      type: "SET_TRANSPORT",
      payload: {
        mode: selectedMode,
        option,
        seats: Number.parseInt(passengers),
        cost: totalCost,
      },
    })
  }

  const handlePassengersChange = (newPassengers: string) => {
    setPassengers(newPassengers)
    if (selectedOption) {
      const totalCost = selectedOption.price * Number.parseInt(newPassengers)
      dispatch({
        type: "SET_TRANSPORT",
        payload: {
          seats: Number.parseInt(newPassengers),
          cost: totalCost,
        },
      })
    }
  }

  const getModeIcon = (mode: string) => {
    switch (mode) {
      case "bus":
        return <Bus className="h-5 w-5" />
      case "train":
        return <Train className="h-5 w-5" />
      case "flight":
        return <Plane className="h-5 w-5" />
      default:
        return <Bus className="h-5 w-5" />
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2 capitalize">Transportation to {city}</h2>
        <p className="text-gray-600">Choose your preferred mode of transport</p>
        {tripId && (
          <div className="mt-2">
            <Badge variant="outline">Editing existing trip</Badge>
          </div>
        )}
      </div>

      {/* Passenger Selection */}
      <div className="flex items-center justify-center gap-4 bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-blue-600" />
          <span className="text-sm font-medium">Number of passengers:</span>
        </div>
        <Select value={passengers} onValueChange={handlePassengersChange}>
          <SelectTrigger className="w-24">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
              <SelectItem key={num} value={num.toString()}>
                {num}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Tabs value={selectedMode} onValueChange={handleModeChange} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="bus" className="gap-2 transition-all hover:bg-blue-50">
            <Bus className="h-4 w-4" />
            Bus
          </TabsTrigger>
          <TabsTrigger value="train" className="gap-2 transition-all hover:bg-green-50">
            <Train className="h-4 w-4" />
            Train
          </TabsTrigger>
          <TabsTrigger value="flight" className="gap-2 transition-all hover:bg-purple-50">
            <Plane className="h-4 w-4" />
            Flight
          </TabsTrigger>
        </TabsList>

        {(["bus", "train", "flight"] as const).map((mode) => (
          <TabsContent key={mode} value={mode} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {transportOptions[mode].map((option) => {
                const isSelected = selectedOption?.id === option.id
                return (
                  <Card
                    key={option.id}
                    className={`cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 transform ${
                      isSelected
                        ? "ring-2 ring-blue-500 bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg"
                        : "hover:shadow-lg hover:bg-gray-50"
                    }`}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className={`text-lg flex items-center gap-2 ${isSelected ? "text-blue-700" : ""}`}>
                          {getModeIcon(mode)}
                          {option.name}
                          {isSelected && <CheckCircle className="h-5 w-5 text-green-600" />}
                        </CardTitle>
                        <Badge variant={isSelected ? "default" : "secondary"} className="transition-colors">
                          ★ {option.rating}
                        </Badge>
                      </div>
                      {"airline" in option && (
                        <CardDescription className={isSelected ? "text-blue-600" : ""}>
                          {option.airline}
                        </CardDescription>
                      )}
                      {"class" in option && (
                        <CardDescription className={isSelected ? "text-blue-600" : ""}>
                          Class: {option.class}
                        </CardDescription>
                      )}
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4 text-gray-500" />
                          <span className="font-medium">{option.departure}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span className="text-orange-600 font-medium">{option.duration}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4 text-gray-500" />
                          <span className="font-medium">{option.arrival}</span>
                        </div>
                      </div>

                      {/* Amenities */}
                      <div className="flex flex-wrap gap-1">
                        {option.amenities.slice(0, 3).map((amenity, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {amenity}
                          </Badge>
                        ))}
                        {option.amenities.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{option.amenities.length - 3} more
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <span className={`text-2xl font-bold ${isSelected ? "text-blue-600" : "text-gray-900"}`}>
                            ₹{option.price.toLocaleString()}
                          </span>
                          <span className="text-sm text-gray-500 ml-1">per person</span>
                        </div>
                        <Button
                          onClick={() => handleOptionSelect(option)}
                          variant={isSelected ? "default" : "outline"}
                          size="sm"
                          className={`transition-all duration-200 ${
                            isSelected
                              ? "bg-blue-600 hover:bg-blue-700"
                              : "hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300"
                          }`}
                        >
                          {isSelected ? "Selected" : "Select"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Selected Transportation Summary */}
      {selectedOption && (
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 shadow-lg">
          <CardHeader>
            <CardTitle className="text-green-800 flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Selected Transportation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-lg">{selectedOption.name}</p>
                <p className="text-sm text-gray-600 flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {selectedOption.departure} → {selectedOption.arrival} ({selectedOption.duration})
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-green-600">₹{selectedOption.price.toLocaleString()}</p>
                <p className="text-sm text-gray-600">per person</p>
              </div>
            </div>

            <div className="border-t pt-4 bg-white/50 rounded-lg p-4">
              <div className="flex items-center justify-between text-lg font-semibold">
                <span className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Passengers: {passengers}
                </span>
                <span className="text-green-600">
                  Total: ₹{(selectedOption.price * Number.parseInt(passengers)).toLocaleString()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
