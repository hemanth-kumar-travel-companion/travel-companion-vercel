"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTrip } from "@/contexts/trip-context"
import { Star, MapPin, Calendar, CheckCircle } from "lucide-react"

const keralaHotels = [
  {
    id: 1,
    name: "Tea Valley Resort, Munnar",
    image: "/placeholder.svg?height=200&width=300&text=Tea+Valley+Resort",
    rating: 4.8,
    pricePerNight: 4500,
    location: "Munnar",
    amenities: ["Free WiFi", "Mountain View", "Tea Garden", "Restaurant", "Spa"],
    description: "Luxury resort amidst tea plantations with stunning valley views",
  },
  {
    id: 2,
    name: "Backwater Retreat, Alleppey",
    image: "/placeholder.svg?height=200&width=300&text=Backwater+Retreat",
    rating: 4.6,
    pricePerNight: 3500,
    location: "Alleppey",
    amenities: ["Houseboat", "Backwater View", "Traditional Meals", "Fishing"],
    description: "Traditional houseboat experience in serene backwaters",
  },
  {
    id: 3,
    name: "Spice Garden Resort, Thekkady",
    image: "/placeholder.svg?height=200&width=300&text=Spice+Garden+Resort",
    rating: 4.5,
    pricePerNight: 3200,
    location: "Thekkady",
    amenities: ["Spice Garden", "Wildlife View", "Ayurveda", "Nature Walks"],
    description: "Eco-friendly resort surrounded by spice plantations",
  },
  {
    id: 4,
    name: "Waterfall View Lodge, Athirappilly",
    image: "/placeholder.svg?height=200&width=300&text=Waterfall+Lodge",
    rating: 4.4,
    pricePerNight: 2800,
    location: "Athirappilly",
    amenities: ["Waterfall View", "Nature Trails", "Restaurant", "Parking"],
    description: "Perfect location to enjoy the majestic Athirappilly Falls",
  },
  {
    id: 5,
    name: "Hill Station Resort, Wayanad",
    image: "/placeholder.svg?height=200&width=300&text=Hill+Station+Resort",
    rating: 4.3,
    pricePerNight: 2500,
    location: "Wayanad",
    amenities: ["Forest View", "Adventure Sports", "Campfire", "Trekking"],
    description: "Adventure resort in the heart of Western Ghats",
  },
  {
    id: 6,
    name: "Beach Resort, Kovalam",
    image: "/placeholder.svg?height=200&width=300&text=Beach+Resort+Kovalam",
    rating: 4.2,
    pricePerNight: 3800,
    location: "Kovalam",
    amenities: ["Beach Access", "Sea View", "Ayurveda", "Water Sports"],
    description: "Beachfront resort with traditional Kerala architecture",
  },
]

export default function KeralaAccommodationPage() {
  const { state, dispatch } = useTrip()
  const router = useRouter()
  const [days, setDays] = useState(state.attractions.days.toString())
  const [selectedHotel, setSelectedHotel] = useState<any>(null)

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

  const handleProceed = () => {
    router.push("/seasonal/kerala-monsoon/food")
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Choose Your Stay</h2>
        <p className="text-gray-600">Find the perfect accommodation for your Kerala monsoon experience</p>
      </div>

      {/* Days Selection */}
      <div className="flex items-center justify-center gap-4 bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-green-600" />
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

      {/* Hotels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {keralaHotels.map((hotel) => {
          const isSelected = selectedHotel?.id === hotel.id
          return (
            <Card
              key={hotel.id}
              className={`cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 transform ${
                isSelected
                  ? "ring-2 ring-green-500 bg-gradient-to-br from-green-50 to-emerald-50 shadow-lg"
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
                <CardTitle className={`text-lg ${isSelected ? "text-green-700" : ""}`}>{hotel.name}</CardTitle>
                <CardDescription className={`flex items-center gap-1 ${isSelected ? "text-green-600" : ""}`}>
                  <MapPin className="h-4 w-4" />
                  {hotel.location}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">{hotel.description}</p>

                <div className="flex flex-wrap gap-1">
                  {hotel.amenities.slice(0, 4).map((amenity, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
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
                    <span className={`text-2xl font-bold ${isSelected ? "text-green-600" : "text-gray-900"}`}>
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
                        ? "bg-green-600 hover:bg-green-700"
                        : "hover:bg-green-50 hover:text-green-600 hover:border-green-300"
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
              Selected Accommodation
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
                <span>Days: {days}</span>
              </div>
              <div className="flex items-center justify-between text-lg font-semibold">
                <span>Total Accommodation Cost:</span>
                <span className="text-green-600">
                  ₹{(selectedHotel.pricePerNight * Number.parseInt(days)).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="flex justify-end">
              <Button onClick={handleProceed} className="bg-green-600 hover:bg-green-700 gap-2">
                Proceed to Food
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
