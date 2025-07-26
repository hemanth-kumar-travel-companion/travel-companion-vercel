"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useTrip } from "@/contexts/trip-context"
import { Car, Bus, Users, CheckCircle, Clock } from "lucide-react"

const transportOptions = {
  car: [
    {
      id: 1,
      name: "Sedan (AC)",
      type: "Private Car",
      capacity: "4 passengers",
      price: 2500,
      duration: "Full day",
      description: "Comfortable sedan with AC for Kerala roads",
      features: ["AC", "Professional Driver", "Fuel Included", "Toll Charges"],
    },
    {
      id: 2,
      name: "SUV (AC)",
      type: "Private SUV",
      capacity: "6-7 passengers",
      price: 3500,
      duration: "Full day",
      description: "Spacious SUV perfect for hill stations",
      features: ["AC", "Professional Driver", "Fuel Included", "Hill Station Specialist"],
    },
    {
      id: 3,
      name: "Tempo Traveller",
      type: "Mini Bus",
      capacity: "12 passengers",
      price: 4500,
      duration: "Full day",
      description: "Ideal for larger groups",
      features: ["AC", "Professional Driver", "Fuel Included", "Group Travel"],
    },
  ],
  bus: [
    {
      id: 4,
      name: "KSRTC Volvo",
      type: "Government Bus",
      capacity: "45 passengers",
      price: 800,
      duration: "Point to point",
      description: "Comfortable government bus service",
      features: ["AC", "Reserved Seating", "Reliable", "Budget Friendly"],
    },
    {
      id: 5,
      name: "Private Volvo",
      type: "Private Bus",
      capacity: "40 passengers",
      price: 1200,
      duration: "Point to point",
      description: "Premium private bus service",
      features: ["AC", "Comfortable Seats", "Entertainment", "Snacks"],
    },
    {
      id: 6,
      name: "Local Bus",
      type: "State Transport",
      capacity: "50 passengers",
      price: 400,
      duration: "Point to point",
      description: "Budget-friendly local transport",
      features: ["Non-AC", "Frequent Service", "Very Budget Friendly", "Local Experience"],
    },
  ],
}

export default function KeralaTransportPage() {
  const { state, dispatch } = useTrip()
  const router = useRouter()
  const [selectedMode, setSelectedMode] = useState<"car" | "bus">("car")
  const [selectedOption, setSelectedOption] = useState<any>(null)
  const [passengers, setPassengers] = useState("4")

  const handleModeChange = (mode: "car" | "bus") => {
    setSelectedMode(mode)
    setSelectedOption(null)
  }

  const handleOptionSelect = (option: any) => {
    setSelectedOption(option)
    const totalCost = option.price * Number.parseInt(state.attractions.days.toString())
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

  const handleProceed = () => {
    router.push("/seasonal/kerala-monsoon/accommodation")
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Choose Your Transport</h2>
        <p className="text-gray-600">Select the best way to explore Kerala during monsoon</p>
      </div>

      {/* Passenger Selection */}
      <div className="flex items-center justify-center gap-4 bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-green-600" />
          <span className="text-sm font-medium">Number of passengers:</span>
        </div>
        <Select value={passengers} onValueChange={setPassengers}>
          <SelectTrigger className="w-24">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12].map((num) => (
              <SelectItem key={num} value={num.toString()}>
                {num}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Tabs value={selectedMode} onValueChange={handleModeChange} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="car" className="gap-2">
            <Car className="h-4 w-4" />
            Private Car/Taxi
          </TabsTrigger>
          <TabsTrigger value="bus" className="gap-2">
            <Bus className="h-4 w-4" />
            Bus
          </TabsTrigger>
        </TabsList>

        {(["car", "bus"] as const).map((mode) => (
          <TabsContent key={mode} value={mode} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {transportOptions[mode].map((option) => {
                const isSelected = selectedOption?.id === option.id
                return (
                  <Card
                    key={option.id}
                    className={`cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 transform ${
                      isSelected
                        ? "ring-2 ring-green-500 bg-gradient-to-br from-green-50 to-emerald-50 shadow-lg"
                        : "hover:shadow-lg hover:bg-gray-50"
                    }`}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className={`text-lg flex items-center gap-2 ${isSelected ? "text-green-700" : ""}`}>
                          {mode === "car" ? <Car className="h-5 w-5" /> : <Bus className="h-5 w-5" />}
                          {option.name}
                          {isSelected && <CheckCircle className="h-5 w-5 text-green-600" />}
                        </CardTitle>
                      </div>
                      <CardDescription className={isSelected ? "text-green-600" : ""}>
                        {option.type} • {option.capacity}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-gray-600">{option.description}</p>

                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span>{option.duration}</span>
                        </div>
                      </div>

                      {/* Features */}
                      <div className="flex flex-wrap gap-1">
                        {option.features.map((feature, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <span className={`text-2xl font-bold ${isSelected ? "text-green-600" : "text-gray-900"}`}>
                            ₹{option.price.toLocaleString()}
                          </span>
                          <span className="text-sm text-gray-500 ml-1">per day</span>
                        </div>
                        <Button
                          onClick={() => handleOptionSelect(option)}
                          variant={isSelected ? "default" : "outline"}
                          size="sm"
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
          </TabsContent>
        ))}
      </Tabs>

      {/* Selected Transport Summary */}
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
                <p className="text-sm text-gray-600">{selectedOption.description}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-green-600">₹{selectedOption.price.toLocaleString()}</p>
                <p className="text-sm text-gray-600">per day</p>
              </div>
            </div>

            <div className="border-t pt-4 bg-white/50 rounded-lg p-4">
              <div className="flex items-center justify-between text-lg font-semibold mb-2">
                <span>Duration: {state.attractions.days} days</span>
              </div>
              <div className="flex items-center justify-between text-lg font-semibold">
                <span>Total Transport Cost:</span>
                <span className="text-green-600">
                  ₹{(selectedOption.price * state.attractions.days).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="flex justify-end">
              <Button onClick={handleProceed} className="bg-green-600 hover:bg-green-700 gap-2">
                Proceed to Accommodation
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
