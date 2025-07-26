"use client"

import { useState, useEffect } from "react"
import { useParams, useSearchParams } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTrip } from "@/contexts/trip-context"
import { useAuth } from "@/hooks/use-auth"
import { supabase } from "@/lib/supabase"
import { Hotel, Star, MapPin, Wifi, Car, UtensilsCrossed, Waves, Calendar, CheckCircle } from "lucide-react"

const hotels = {
  bengaluru: [
    {
      id: 1,
      name: "The Leela Palace Bengaluru",
      image: "/placeholder.svg?height=200&width=300&text=Leela+Palace+Bengaluru",
      rating: 4.8,
      pricePerNight: 8000,
      location: "HAL Airport Road",
      amenities: ["Free WiFi", "Pool", "Spa", "Restaurant", "Parking"],
      description: "Luxury hotel with world-class amenities",
    },
    {
      id: 2,
      name: "ITC Gardenia",
      image: "/placeholder.svg?height=200&width=300&text=ITC+Gardenia",
      rating: 4.6,
      pricePerNight: 6500,
      location: "Residency Road",
      amenities: ["Free WiFi", "Pool", "Gym", "Restaurant", "Spa"],
      description: "Premium business hotel in the heart of the city",
    },
    {
      id: 3,
      name: "Lemon Tree Premier",
      image: "/placeholder.svg?height=200&width=300&text=Lemon+Tree+Premier",
      rating: 4.2,
      pricePerNight: 3500,
      location: "Ulsoor Lake",
      amenities: ["Free WiFi", "Restaurant", "Gym", "Parking"],
      description: "Contemporary hotel with modern amenities",
    },
    {
      id: 4,
      name: "Treebo Trend Bliss",
      image: "/placeholder.svg?height=200&width=300&text=Treebo+Trend+Bliss",
      rating: 4.0,
      pricePerNight: 2200,
      location: "Koramangala",
      amenities: ["Free WiFi", "Restaurant", "Parking"],
      description: "Budget-friendly hotel with good service",
    },
    {
      id: 5,
      name: "OYO Premium MG Road",
      image: "/placeholder.svg?height=200&width=300&text=OYO+Premium+MG+Road",
      rating: 3.8,
      pricePerNight: 1800,
      location: "MG Road",
      amenities: ["Free WiFi", "AC", "Parking"],
      description: "Affordable stay in prime location",
    },
  ],
  chennai: [
    {
      id: 1,
      name: "The Leela Palace Chennai",
      image: "/placeholder.svg?height=200&width=300&text=Leela+Palace+Chennai",
      rating: 4.7,
      pricePerNight: 7500,
      location: "Adyar",
      amenities: ["Free WiFi", "Pool", "Spa", "Restaurant", "Beach Access"],
      description: "Beachfront luxury with stunning views",
    },
    {
      id: 2,
      name: "ITC Grand Chola",
      image: "/placeholder.svg?height=200&width=300&text=ITC+Grand+Chola",
      rating: 4.6,
      pricePerNight: 6000,
      location: "Guindy",
      amenities: ["Free WiFi", "Pool", "Spa", "Multiple Restaurants"],
      description: "Grand hotel inspired by Chola architecture",
    },
    {
      id: 3,
      name: "Radisson Blu Hotel",
      image: "/placeholder.svg?height=200&width=300&text=Radisson+Blu+Chennai",
      rating: 4.3,
      pricePerNight: 4200,
      location: "Egmore",
      amenities: ["Free WiFi", "Pool", "Gym", "Restaurant"],
      description: "Modern hotel near railway station",
    },
    {
      id: 4,
      name: "Hotel Savera",
      image: "/placeholder.svg?height=200&width=300&text=Hotel+Savera",
      rating: 4.1,
      pricePerNight: 2800,
      location: "Dr. Radhakrishnan Salai",
      amenities: ["Free WiFi", "Restaurant", "Parking"],
      description: "Heritage hotel with traditional charm",
    },
    {
      id: 5,
      name: "Treebo Trend Amber",
      image: "/placeholder.svg?height=200&width=300&text=Treebo+Trend+Amber",
      rating: 3.9,
      pricePerNight: 2000,
      location: "T. Nagar",
      amenities: ["Free WiFi", "AC", "Restaurant"],
      description: "Budget hotel in shopping district",
    },
  ],
  hyderabad: [
    {
      id: 1,
      name: "Taj Falaknuma Palace",
      image: "/placeholder.svg?height=200&width=300&text=Taj+Falaknuma+Palace",
      rating: 4.9,
      pricePerNight: 12000,
      location: "Falaknuma",
      amenities: ["Free WiFi", "Pool", "Spa", "Palace Tours", "Fine Dining"],
      description: "Historic palace hotel with royal experience",
    },
    {
      id: 2,
      name: "ITC Kohenur",
      image: "/placeholder.svg?height=200&width=300&text=ITC+Kohenur",
      rating: 4.7,
      pricePerNight: 7000,
      location: "HITEC City",
      amenities: ["Free WiFi", "Pool", "Spa", "Multiple Restaurants"],
      description: "Luxury hotel in IT corridor",
    },
    {
      id: 3,
      name: "Marriott Hotel Hyderabad",
      image: "/placeholder.svg?height=200&width=300&text=Marriott+Hyderabad",
      rating: 4.5,
      pricePerNight: 5500,
      location: "Tank Bund Road",
      amenities: ["Free WiFi", "Pool", "Gym", "Restaurant"],
      description: "Premium hotel overlooking Hussain Sagar",
    },
    {
      id: 4,
      name: "Lemon Tree Hotel",
      image: "/placeholder.svg?height=200&width=300&text=Lemon+Tree+Hyderabad",
      rating: 4.2,
      pricePerNight: 3200,
      location: "Hitec City",
      amenities: ["Free WiFi", "Restaurant", "Gym"],
      description: "Modern hotel in business district",
    },
    {
      id: 5,
      name: "FabHotel Prime",
      image: "/placeholder.svg?height=200&width=300&text=FabHotel+Prime",
      rating: 4.0,
      pricePerNight: 2400,
      location: "Banjara Hills",
      amenities: ["Free WiFi", "AC", "Restaurant"],
      description: "Comfortable stay in upscale area",
    },
  ],
  mumbai: [
    {
      id: 1,
      name: "The Taj Mahal Palace",
      image: "/placeholder.svg?height=200&width=300&text=Taj+Mahal+Palace+Mumbai",
      rating: 4.8,
      pricePerNight: 15000,
      location: "Colaba",
      amenities: ["Free WiFi", "Pool", "Spa", "Heritage Tours", "Fine Dining"],
      description: "Iconic heritage hotel overlooking Gateway of India",
    },
    {
      id: 2,
      name: "The Oberoi Mumbai",
      image: "/placeholder.svg?height=200&width=300&text=Oberoi+Mumbai",
      rating: 4.7,
      pricePerNight: 12000,
      location: "Nariman Point",
      amenities: ["Free WiFi", "Pool", "Spa", "Ocean Views"],
      description: "Luxury hotel with stunning sea views",
    },
    {
      id: 3,
      name: "JW Marriott Mumbai",
      image: "/placeholder.svg?height=200&width=300&text=JW+Marriott+Mumbai",
      rating: 4.6,
      pricePerNight: 8500,
      location: "Juhu",
      amenities: ["Free WiFi", "Pool", "Beach Access", "Spa"],
      description: "Beachfront luxury in Juhu",
    },
    {
      id: 4,
      name: "Hotel Marine Plaza",
      image: "/placeholder.svg?height=200&width=300&text=Marine+Plaza+Mumbai",
      rating: 4.3,
      pricePerNight: 4500,
      location: "Marine Drive",
      amenities: ["Free WiFi", "Restaurant", "Sea Views"],
      description: "Classic hotel on Marine Drive",
    },
    {
      id: 5,
      name: "Treebo Trend Arma",
      image: "/placeholder.svg?height=200&width=300&text=Treebo+Arma+Mumbai",
      rating: 4.0,
      pricePerNight: 3200,
      location: "Andheri",
      amenities: ["Free WiFi", "Restaurant", "Airport Shuttle"],
      description: "Convenient hotel near airport",
    },
  ],
}

export default function StayPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const city = params.city as string
  const tripId = searchParams.get("tripId")
  const { user } = useAuth()
  const { state, dispatch } = useTrip()
  const [days, setDays] = useState(state.accommodation.days.toString())
  const [selectedHotel, setSelectedHotel] = useState(state.accommodation.hotel)
  const [priceFilter, setPriceFilter] = useState("all")
  const [loading, setLoading] = useState(false)

  const cityHotels = hotels[city as keyof typeof hotels] || []

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

      if (!error && data && data.accommodation_details) {
        const accommodationDetails = data.accommodation_details
        if (accommodationDetails.hotel) {
          setSelectedHotel(accommodationDetails.hotel)
          setDays(accommodationDetails.days?.toString() || "1")

          // Update context with loaded data
          dispatch({
            type: "SET_ACCOMMODATION",
            payload: {
              hotel: accommodationDetails.hotel,
              days: accommodationDetails.days || 1,
              cost: accommodationDetails.cost || 0,
            },
          })
        }
      }
    } catch (error) {
      console.error("Error loading trip data:", error)
    }
    setLoading(false)
  }

  const filteredHotels = cityHotels.filter((hotel) => {
    if (priceFilter === "all") return true
    if (priceFilter === "budget") return hotel.pricePerNight <= 3000
    if (priceFilter === "mid") return hotel.pricePerNight > 3000 && hotel.pricePerNight <= 7000
    if (priceFilter === "luxury") return hotel.pricePerNight > 7000
    return true
  })

  const handleHotelSelect = (hotel: any) => {
    setSelectedHotel(hotel)
    const totalCost = hotel.pricePerNight * Number.parseInt(days)
    dispatch({
      type: "SET_ACCOMMODATION",
      payload: {
        hotel,
        days: Number.parseInt(days),
        cost: totalCost,
      },
    })
  }

  const handleDaysChange = (newDays: string) => {
    setDays(newDays)
    if (selectedHotel) {
      const totalCost = selectedHotel.pricePerNight * Number.parseInt(newDays)
      dispatch({
        type: "SET_ACCOMMODATION",
        payload: {
          days: Number.parseInt(newDays),
          cost: totalCost,
        },
      })
    }
  }

  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case "free wifi":
        return <Wifi className="h-4 w-4" />
      case "pool":
        return <Waves className="h-4 w-4" />
      case "parking":
        return <Car className="h-4 w-4" />
      case "restaurant":
        return <UtensilsCrossed className="h-4 w-4" />
      default:
        return <Hotel className="h-4 w-4" />
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
        <h2 className="text-3xl font-bold text-gray-900 mb-2 capitalize">Accommodation in {city}</h2>
        <p className="text-gray-600">Find the perfect place to stay</p>
        {tripId && (
          <div className="mt-2">
            <Badge variant="outline">Editing existing trip</Badge>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center justify-between bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium">Number of days:</span>
          </div>
          <Select value={days} onValueChange={handleDaysChange}>
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                <SelectItem key={num} value={num.toString()}>
                  {num}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Price Range:</span>
          <Select value={priceFilter} onValueChange={setPriceFilter}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Hotels</SelectItem>
              <SelectItem value="budget">Budget (&#8804;₹3,000)</SelectItem>
              <SelectItem value="mid">Mid-range (₹3,000-7,000)</SelectItem>
              <SelectItem value="luxury">Luxury (&#62;₹7,000)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Hotels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredHotels.map((hotel) => {
          const isSelected = selectedHotel?.id === hotel.id
          return (
            <Card
              key={hotel.id}
              className={`cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 transform ${
                isSelected
                  ? "ring-2 ring-blue-500 bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg"
                  : "hover:shadow-lg hover:bg-gray-50"
              }`}
            >
              <div className="relative h-48 overflow-hidden rounded-t-lg">
                <Image src={hotel.image || "/placeholder.svg"} alt={hotel.name} fill className="object-cover" />
                <div className="absolute top-4 right-4">
                  <Badge className="bg-white/90 text-gray-900">
                    <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                    {hotel.rating}
                  </Badge>
                </div>
                {isSelected && (
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-green-600 text-white">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Selected
                    </Badge>
                  </div>
                )}
              </div>

              <CardHeader>
                <CardTitle className={`text-lg ${isSelected ? "text-blue-700" : ""}`}>{hotel.name}</CardTitle>
                <CardDescription className={`flex items-center gap-1 ${isSelected ? "text-blue-600" : ""}`}>
                  <MapPin className="h-4 w-4" />
                  {hotel.location}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">{hotel.description}</p>

                <div className="flex flex-wrap gap-1">
                  {hotel.amenities.slice(0, 4).map((amenity, index) => (
                    <Badge key={index} variant="secondary" className="text-xs gap-1">
                      {getAmenityIcon(amenity)}
                      {amenity}
                    </Badge>
                  ))}
                  {hotel.amenities.length > 4 && (
                    <Badge variant="outline" className="text-xs">
                      +{hotel.amenities.length - 4} more
                    </Badge>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className={`text-2xl font-bold ${isSelected ? "text-blue-600" : "text-gray-900"}`}>
                      ₹{hotel.pricePerNight.toLocaleString()}
                    </span>
                    <span className="text-sm text-gray-500">/night</span>
                  </div>
                  <Button
                    variant={isSelected ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleHotelSelect(hotel)}
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

      {/* Selected Hotel Summary */}
      {selectedHotel && (
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 shadow-lg">
          <CardHeader>
            <CardTitle className="text-green-800 flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Selected Hotel
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-lg">{selectedHotel.name}</p>
                <p className="text-sm text-gray-600 flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {selectedHotel.location}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-green-600">₹{selectedHotel.pricePerNight.toLocaleString()}</p>
                <p className="text-sm text-gray-600">per night</p>
              </div>
            </div>

            <div className="border-t pt-4 bg-white/50 rounded-lg p-4">
              <div className="flex items-center justify-between text-lg font-semibold mb-2">
                <span>Hotel: {selectedHotel.name}</span>
              </div>
              <div className="flex items-center justify-between text-lg font-semibold mb-2">
                <span>Days: {days}</span>
              </div>
              <div className="flex items-center justify-between text-lg font-semibold">
                <span>₹{selectedHotel.pricePerNight.toLocaleString()}/day</span>
                <span className="text-green-600">
                  Total: ₹{(selectedHotel.pricePerNight * Number.parseInt(days)).toLocaleString()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
