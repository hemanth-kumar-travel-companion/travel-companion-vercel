"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useTrip } from "@/contexts/trip-context"
import { ShoppingBag, Star, DollarSign, CheckCircle, Receipt } from "lucide-react"

const keralaShopping = [
  {
    name: "Spices",
    image: "/placeholder.svg?height=150&width=200&text=Kerala+Spices",
    description: "Cardamom, pepper, cinnamon from spice gardens",
  },
  {
    name: "Tea",
    image: "/placeholder.svg?height=150&width=200&text=Kerala+Tea",
    description: "Fresh tea leaves from Munnar plantations",
  },
  {
    name: "Coir Products",
    image: "/placeholder.svg?height=150&width=200&text=Coir+Products",
    description: "Mats, ropes, and handicrafts from coconut fiber",
  },
  {
    name: "Kathakali Masks",
    image: "/placeholder.svg?height=150&width=200&text=Kathakali+Masks",
    description: "Traditional dance masks and costumes",
  },
  {
    name: "Ayurvedic Products",
    image: "/placeholder.svg?height=150&width=200&text=Ayurvedic+Products",
    description: "Natural oils, medicines, and beauty products",
  },
  {
    name: "Handloom Textiles",
    image: "/placeholder.svg?height=150&width=200&text=Kerala+Textiles",
    description: "Kasavu sarees and traditional fabrics",
  },
]

const budgetOptions = [
  { id: "none", label: "No Shopping", amount: 0, description: "Skip shopping activities" },
  { id: "low", label: "Souvenir Shopping", amount: 1500, description: "Basic spices and small souvenirs" },
  { id: "medium", label: "Moderate Shopping", amount: 3000, description: "Spices, tea, and handicrafts" },
  { id: "high", label: "Shopping Spree", amount: 5000, description: "Extensive shopping for all specialties" },
  { id: "custom", label: "Custom Budget", amount: 0, description: "Set your own budget" },
]

export default function KeralaShoppingPage() {
  const { state, dispatch } = useTrip()
  const router = useRouter()
  const [wantToShop, setWantToShop] = useState(state.shopping.budget > 0 ? "yes" : "")
  const [selectedBudget, setSelectedBudget] = useState("")
  const [customBudget, setCustomBudget] = useState("")

  const handleShoppingChoice = (choice: string) => {
    setWantToShop(choice)
    if (choice === "no") {
      dispatch({ type: "SET_SHOPPING", payload: { budget: 0 } })
      setSelectedBudget("")
    }
  }

  const handleBudgetSelect = (budgetId: string) => {
    setSelectedBudget(budgetId)
    const budget = budgetOptions.find((b) => b.id === budgetId)
    if (budget && budgetId !== "custom") {
      dispatch({ type: "SET_SHOPPING", payload: { budget: budget.amount } })
    }
  }

  const handleCustomBudgetChange = (value: string) => {
    setCustomBudget(value)
    const amount = Number.parseInt(value) || 0
    dispatch({ type: "SET_SHOPPING", payload: { budget: amount } })
  }

  const handleProceed = () => {
    // Calculate total and navigate to summary
    dispatch({ type: "CALCULATE_TOTAL" })
    router.push("/seasonal/kerala-monsoon/summary")
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Shopping in Kerala</h2>
        <p className="text-gray-600">Take home authentic Kerala specialties and souvenirs</p>
      </div>

      {/* Kerala Shopping Showcase */}
      <div className="space-y-4">
        <h3 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
          <ShoppingBag className="h-6 w-6" />
          Kerala Specialties to Buy
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {keralaShopping.map((item, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-32 overflow-hidden">
                <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{item.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Shopping Preference */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-800 flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Shopping Preference
          </CardTitle>
          <CardDescription>Do you want to include shopping in your Kerala trip?</CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup value={wantToShop} onValueChange={handleShoppingChoice}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="shop-yes" />
              <Label htmlFor="shop-yes">Yes, I want to shop</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="shop-no" />
              <Label htmlFor="shop-no">No, skip shopping</Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Budget Selection */}
      {wantToShop === "yes" && (
        <div className="space-y-6">
          <h3 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
            <DollarSign className="h-6 w-6" />
            Set Your Shopping Budget
          </h3>

          <RadioGroup value={selectedBudget} onValueChange={handleBudgetSelect}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {budgetOptions
                .filter((option) => option.id !== "none")
                .map((option) => (
                  <div key={option.id} className="relative">
                    <RadioGroupItem value={option.id} id={option.id} className="peer sr-only" />
                    <Label
                      htmlFor={option.id}
                      className={`cursor-pointer block p-4 rounded-lg border-2 transition-all hover:shadow-lg ${
                        selectedBudget === option.id
                          ? "border-green-500 bg-green-50 shadow-lg"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="text-center space-y-2">
                        <h4 className="font-semibold">{option.label}</h4>
                        {option.id !== "custom" && (
                          <div className="text-2xl font-bold text-green-600">₹{option.amount.toLocaleString()}</div>
                        )}
                        <p className="text-sm text-gray-600">{option.description}</p>
                      </div>
                    </Label>
                    {selectedBudget === option.id && (
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-green-600 text-white">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Selected
                        </Badge>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </RadioGroup>

          {/* Custom Budget Input */}
          {selectedBudget === "custom" && (
            <Card className="bg-gray-50">
              <CardHeader>
                <CardTitle className="text-lg">Custom Shopping Budget</CardTitle>
                <CardDescription>Enter your preferred shopping budget</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <span className="text-lg">₹</span>
                  <Input
                    type="number"
                    placeholder="Enter amount"
                    value={customBudget}
                    onChange={(e) => handleCustomBudgetChange(e.target.value)}
                    className="max-w-xs"
                  />
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Selected Budget Summary */}
      {state.shopping.budget > 0 && (
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 shadow-lg">
          <CardHeader>
            <CardTitle className="text-green-800 flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Shopping Budget Set
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">Shopping Budget</p>
                <p className="text-sm text-gray-600">
                  {selectedBudget === "custom"
                    ? "Custom amount"
                    : budgetOptions.find((b) => b.amount === state.shopping.budget)?.label || "Selected budget"}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-green-600">₹{state.shopping.budget.toLocaleString()}</p>
                <p className="text-sm text-gray-600">total budget</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Proceed Button */}
      <div className="flex justify-center">
        <Button onClick={handleProceed} size="lg" className="bg-green-600 hover:bg-green-700 gap-2">
          <Receipt className="h-5 w-5" />
          View Trip Summary
        </Button>
      </div>

      {/* Shopping Tips */}
      <Card className="bg-yellow-50 border-yellow-200">
        <CardHeader>
          <CardTitle className="text-yellow-800 flex items-center gap-2">
            <Star className="h-5 w-5" />
            Kerala Shopping Tips
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-yellow-700">
          <p>• Buy spices directly from plantations for best quality and prices</p>
          <p>• Bargain at local markets but not in government emporiums</p>
          <p>• Check for authenticity certificates for Ayurvedic products</p>
          <p>• Pack spices and tea in airtight containers for travel</p>
          <p>• Visit government handicraft stores for genuine products</p>
          <p>• Ask for GST bills for warranty and returns</p>
        </CardContent>
      </Card>
    </div>
  )
}
