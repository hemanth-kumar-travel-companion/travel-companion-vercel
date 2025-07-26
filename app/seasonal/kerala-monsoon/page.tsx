"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTrip } from "@/contexts/trip-context"
import { useAuth } from "@/hooks/use-auth"
import { CloudRain, Calendar, MapPin, Star, CheckCircle } from "lucide-react"

const keralaMonsoonPlaces = [
  {
    id: 1,
    name: "Munnar",
    image: "/placeholder.svg?height=200&width=300&text=Munnar+Tea+Gardens",
    rating: 4.8,
    whyGo: "Tea plantations, misty hills, romantic weather",
    description: "Rolling hills covered with tea gardens create a magical monsoon experience",
    highlights: ["Tea Museum", "Eravikulam National Park", "Mattupetty Dam"],
  },
  {
    id: 2,
    name: "Wayanad",
    image: "/placeholder.svg?height=200&width=300&text=Wayanad+Waterfalls",
    rating: 4.7,
    whyGo: "Rain-soaked forests, waterfalls, and paddy fields",
    description: "Lush green forests and cascading waterfalls at their best during monsoon",
    highlights: ["Soochipara Falls", "Banasura Sagar Dam", "Edakkal Caves"],
  },
  {
    id: 3,
    name: "Thekkady",
    image: "/placeholder.svg?height=200&width=300&text=Thekkady+Wildlife",
    rating: 4.6,
    whyGo: "Lush Periyar wildlife sanctuary, spice plantations",
    description: "Wildlife sanctuary comes alive during monsoon with rich biodiversity",
    highlights: ["Periyar Wildlife Sanctuary", "Spice Plantations", "Bamboo Rafting"],
  },
  {
    id: 4,
    name: "Athirappilly",
    image: "/placeholder.svg?height=200&width=300&text=Athirappilly+Falls",
    rating: 4.9,
    whyGo: 'The "Niagara of India"',
    description: "Spectacular waterfalls at their thunderous best during monsoon season",
    highlights: ["Athirappilly Falls", "Vazhachal Falls", "Sholayar Dam"],
  },
  {
    id: 5,
    name: "Alappuzha (Alleppey)",
    image: "/placeholder.svg?height=200&width=300&text=Alleppey+Backwaters",
    rating: 4.5,
    whyGo: "Serene backwaters with a unique monsoon charm",
    description: "Experience the backwaters in a different light with monsoon rains",
    highlights: ["Houseboat Cruise", "Vembanad Lake", "Kumarakom Bird Sanctuary"],
  },
  {
    id: 6,
    name: "Vagamon",
    image: "/placeholder.svg?height=200&width=300&text=Vagamon+Hills",
    rating: 4.4,
    whyGo: "Misty meadows, rolling hills",
    description: "Hidden gem with rolling meadows and pine forests perfect for monsoon",
    highlights: ["Pine Forest", "Vagamon Meadows", "Thangal Hill"],
  },
  {
    id: 7,
    name: "Kovalam",
    image: "/placeholder.svg?height=200&width=300&text=Kovalam+Beach",
    rating: 4.3,
    whyGo: "Less crowded beaches during monsoon",
    description: "Enjoy the dramatic monsoon waves and peaceful beach atmosphere",
    highlights: ["Lighthouse Beach", "Hawah Beach", "Samudra Beach"],
  },
]

export default function KeralaMonsoonsPage() {
  const { user, loading } = useAuth()
  const { state, dispatch } = useTrip()
  const router = useRouter()
  const [days, setDays] = useState("3")
  const [selectedPlaces, setSelectedPlaces] = useState<any[]>([])

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/auth")
    }
  }, [user, loading, router])

  const getMaxPlaces = (days: string) => {
    const dayNum = Number.parseInt(days)
    if (dayNum === 3) return 2
    if (dayNum === 4) return 3
    if (dayNum === 5) return 4
    if (dayNum === 6) return 5
    return 2
  }

  const maxPlaces = getMaxPlaces(days)

  const handleDaysChange = (newDays: string) => {
    setDays(newDays)
    const newMaxPlaces = getMaxPlaces(newDays)
    if (selectedPlaces.length > newMaxPlaces) {
      setSelectedPlaces(selectedPlaces.slice(0, newMaxPlaces))
    }
  }

  const handlePlaceToggle = (place: any) => {
    const isSelected = selectedPlaces.some((p) => p.id === place.id)
    if (isSelected) {
      setSelectedPlaces(selectedPlaces.filter((p) => p.id !== place.id))
    } else {
      if (selectedPlaces.length < maxPlaces) {
        setSelectedPlaces([...selectedPlaces, place])
      }
    }
  }

  const handleProceed = () => {
    // Set up the trip context for Kerala
    dispatch({ type: "RESET_TRIP" })
    dispatch({ type: "SET_DESTINATION", payload: "kerala" })
    dispatch({
      type: "SET_ATTRACTIONS",
      payload: {
        places: selectedPlaces,
        days: Number.parseInt(days),
        cost: 1000 * Number.parseInt(days), // Base cost for local travel
      },
    })

    // Navigate to transport selection
    router.push("/seasonal/kerala-monsoon/transport")
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">Monsoon Magic in Kerala</h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Experience God's Own Country in its most beautiful form during the monsoon season. Lush greenery, cascading
          waterfalls, and misty hills await you.
        </p>
        <div className="mt-4 flex items-center justify-center gap-4">
          <Badge className="bg-green-100 text-green-800 gap-1">
            <CloudRain className="h-4 w-4" />
            Best Season: June - September
          </Badge>
          <Badge variant="outline">Perfect for Nature Lovers</Badge>
        </div>
      </div>

      {/* Days Selection */}
      <div className="flex items-center justify-center gap-4 bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-green-600" />
          <span className="text-lg font-medium">Number of days:</span>
        </div>
        <Select value={days} onValueChange={handleDaysChange}>
          <SelectTrigger className="w-24">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="3">3 days</SelectItem>
            <SelectItem value="4">4 days</SelectItem>
            <SelectItem value="5">5 days</SelectItem>
            <SelectItem value="6">6 days</SelectItem>
          </SelectContent>
        </Select>
        <div className="text-sm text-gray-600">
          (Select up to {maxPlaces} places for {days} days)
        </div>
      </div>

      {/* Places Grid */}
      <div>
        <h3 className="text-2xl font-semibold text-gray-900 mb-6">Choose Your Destinations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {keralaMonsoonPlaces.map((place) => {
            const isSelected = selectedPlaces.some((p) => p.id === place.id)
            const canSelect = selectedPlaces.length < maxPlaces || isSelected

            return (
              <Card
                key={place.id}
                className={`cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 transform ${
                  isSelected
                    ? "ring-2 ring-green-500 bg-gradient-to-br from-green-50 to-emerald-50 shadow-lg"
                    : canSelect
                      ? "hover:shadow-lg hover:bg-gray-50"
                      : "opacity-50 cursor-not-allowed"
                }`}
                onClick={() => canSelect && handlePlaceToggle(place)}
              >
                <div className="relative h-48 overflow-hidden rounded-t-lg">
                  <Image src={place.image || "/placeholder.svg"} alt={place.name} fill className="object-cover" />
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-white/90 text-gray-900">
                      <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                      {place.rating}
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
                  <CardTitle className={`text-lg ${isSelected ? "text-green-700" : ""}`}>{place.name}</CardTitle>
                  <CardDescription className={`text-sm font-medium ${isSelected ? "text-green-600" : "text-blue-600"}`}>
                    Why Go: {place.whyGo}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-3">
                  <p className="text-sm text-gray-600">{place.description}</p>

                  <div className="space-y-2">
                    <p className="text-xs font-medium text-gray-700">Highlights:</p>
                    <div className="flex flex-wrap gap-1">
                      {place.highlights.map((highlight, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {highlight}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Button
                    variant={isSelected ? "default" : "outline"}
                    size="sm"
                    className={`w-full transition-all duration-200 ${
                      isSelected
                        ? "bg-green-600 hover:bg-green-700"
                        : canSelect
                          ? "hover:bg-green-50 hover:text-green-600 hover:border-green-300"
                          : ""
                    }`}
                    disabled={!canSelect}
                  >
                    {isSelected ? "Selected" : canSelect ? "Select" : "Limit Reached"}
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Selected Places Summary */}
      {selectedPlaces.length > 0 && (
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 shadow-lg">
          <CardHeader>
            <CardTitle className="text-green-800 flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Selected Destinations ({selectedPlaces.length}/{maxPlaces})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {selectedPlaces.map((place, index) => (
                <div key={place.id} className="flex items-center gap-3 bg-white/50 p-3 rounded-lg">
                  <Badge variant="outline" className="bg-green-100 text-green-800">
                    Day {index + 1}
                  </Badge>
                  <div>
                    <p className="font-medium">{place.name}</p>
                    <p className="text-xs text-gray-600">{place.whyGo}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-4">
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold">Trip Duration: {days} days</span>
                <Button
                  onClick={handleProceed}
                  className="bg-green-600 hover:bg-green-700 gap-2"
                  disabled={selectedPlaces.length === 0}
                >
                  <MapPin className="h-4 w-4" />
                  Proceed to Transport
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Monsoon Tips */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-800 flex items-center gap-2">
            <CloudRain className="h-5 w-5" />
            Monsoon Travel Tips for Kerala
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-blue-700">
          <p>• Pack waterproof clothing and umbrellas</p>
          <p>• Book accommodations in advance as it's peak season</p>
          <p>• Carry mosquito repellent and basic medicines</p>
          <p>• Check weather conditions before outdoor activities</p>
          <p>• Experience Ayurvedic treatments - perfect during monsoon</p>
          <p>• Try local monsoon delicacies like hot tea and pakoras</p>
        </CardContent>
      </Card>
    </div>
  )
}
