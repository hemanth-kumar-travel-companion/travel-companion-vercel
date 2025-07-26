"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useTrip } from "@/contexts/trip-context"
import { ShoppingBag, Store, Clock, Star, DollarSign } from "lucide-react"

const shoppingPlaces = {
  bengaluru: {
    markets: [
      {
        name: "Commercial Street",
        image: "/placeholder.svg?height=150&width=200&text=Commercial+Street",
        description: "Popular for clothing, accessories, and street shopping",
        timings: "10 AM - 9 PM",
        specialty: "Fashion & Accessories",
      },
      {
        name: "Chickpet Market",
        image: "/placeholder.svg?height=150&width=200&text=Chickpet+Market",
        description: "Traditional market for silk sarees and jewelry",
        timings: "10 AM - 8 PM",
        specialty: "Silk & Jewelry",
      },
      {
        name: "Brigade Road",
        image: "/placeholder.svg?height=150&width=200&text=Brigade+Road",
        description: "Trendy shops, cafes, and bookstores",
        timings: "10 AM - 10 PM",
        specialty: "Books & Cafes",
      },
      {
        name: "Gandhi Bazaar",
        image: "/placeholder.svg?height=150&width=200&text=Gandhi+Bazaar",
        description: "Local market for spices, flowers, and traditional items",
        timings: "6 AM - 9 PM",
        specialty: "Spices & Flowers",
      },
    ],
    malls: [
      {
        name: "UB City Mall",
        image: "/placeholder.svg?height=150&width=200&text=UB+City+Mall",
        description: "Luxury shopping, fine dining, and nightlife",
        timings: "10 AM - 11 PM",
        specialty: "Luxury Brands",
      },
      {
        name: "Forum Mall",
        image: "/placeholder.svg?height=150&width=200&text=Forum+Mall",
        description: "Popular mall with international and local brands",
        timings: "10 AM - 10 PM",
        specialty: "International Brands",
      },
      {
        name: "Phoenix MarketCity",
        image: "/placeholder.svg?height=150&width=200&text=Phoenix+MarketCity",
        description: "Large mall with entertainment and shopping",
        timings: "10 AM - 10 PM",
        specialty: "Entertainment & Shopping",
      },
      {
        name: "Mantri Square",
        image: "/placeholder.svg?height=150&width=200&text=Mantri+Square",
        description: "Multi-level shopping with food court",
        timings: "10 AM - 10 PM",
        specialty: "Food & Fashion",
      },
    ],
  },
  chennai: {
    markets: [
      {
        name: "T Nagar (Pondy Bazaar)",
        image: "/placeholder.svg?height=150&width=200&text=T+Nagar",
        description: "Heaven for sarees, jewelry, and traditional wear",
        timings: "10 AM - 9 PM",
        specialty: "Sarees & Jewelry",
      },
      {
        name: "George Town Market",
        image: "/placeholder.svg?height=150&width=200&text=George+Town",
        description: "Wholesale market for various goods",
        timings: "9 AM - 8 PM",
        specialty: "Wholesale Goods",
      },
      {
        name: "Sowcarpet",
        image: "/placeholder.svg?height=150&width=200&text=Sowcarpet",
        description: "Traditional market for jewelry and textiles",
        timings: "10 AM - 8 PM",
        specialty: "Gold & Textiles",
      },
      {
        name: "Parry's Corner",
        image: "/placeholder.svg?height=150&width=200&text=Parrys+Corner",
        description: "Electronics and mobile accessories hub",
        timings: "10 AM - 9 PM",
        specialty: "Electronics",
      },
    ],
    malls: [
      {
        name: "Express Avenue",
        image: "/placeholder.svg?height=150&width=200&text=Express+Avenue",
        description: "Shopping, multiplex, and food court",
        timings: "10 AM - 10 PM",
        specialty: "Entertainment",
      },
      {
        name: "Phoenix MarketCity",
        image: "/placeholder.svg?height=150&width=200&text=Phoenix+Chennai",
        description: "Huge mall with events and entertainment",
        timings: "10 AM - 10 PM",
        specialty: "Events & Shopping",
      },
      {
        name: "Forum Vijaya Mall",
        image: "/placeholder.svg?height=150&width=200&text=Forum+Vijaya",
        description: "Premium shopping destination",
        timings: "10 AM - 10 PM",
        specialty: "Premium Brands",
      },
      {
        name: "VR Chennai",
        image: "/placeholder.svg?height=150&width=200&text=VR+Chennai",
        description: "Luxury shopping and dining experience",
        timings: "10 AM - 11 PM",
        specialty: "Luxury Experience",
      },
    ],
  },
  hyderabad: {
    markets: [
      {
        name: "Laad Bazaar (Choodi Bazaar)",
        image: "/placeholder.svg?height=150&width=200&text=Laad+Bazaar",
        description: "Famous for bangles, pearls, and traditional items",
        timings: "10 AM - 9 PM",
        specialty: "Bangles & Pearls",
      },
      {
        name: "Begum Bazaar",
        image: "/placeholder.svg?height=150&width=200&text=Begum+Bazaar",
        description: "Wholesale market for various goods",
        timings: "9 AM - 8 PM",
        specialty: "Wholesale",
      },
      {
        name: "Sultan Bazaar",
        image: "/placeholder.svg?height=150&width=200&text=Sultan+Bazaar",
        description: "Electronics and mobile market",
        timings: "10 AM - 9 PM",
        specialty: "Electronics",
      },
      {
        name: "Moazzam Jahi Market",
        image: "/placeholder.svg?height=150&width=200&text=Moazzam+Jahi",
        description: "Fresh produce and spices market",
        timings: "6 AM - 8 PM",
        specialty: "Spices & Produce",
      },
    ],
    malls: [
      {
        name: "IKEA Hyderabad",
        image: "/placeholder.svg?height=150&width=200&text=IKEA+Hyderabad",
        description: "Huge IKEA store with café and showroom",
        timings: "10 AM - 10 PM",
        specialty: "Home Furnishing",
      },
      {
        name: "Inorbit Mall",
        image: "/placeholder.svg?height=150&width=200&text=Inorbit+Mall",
        description: "Shopping, food, and entertainment",
        timings: "10 AM - 10 PM",
        specialty: "Family Entertainment",
      },
      {
        name: "Forum Sujana Mall",
        image: "/placeholder.svg?height=150&width=200&text=Forum+Sujana",
        description: "Premium shopping destination",
        timings: "10 AM - 10 PM",
        specialty: "Premium Shopping",
      },
      {
        name: "GVK One Mall",
        image: "/placeholder.svg?height=150&width=200&text=GVK+One",
        description: "Upscale mall in Banjara Hills",
        timings: "10 AM - 10 PM",
        specialty: "Upscale Brands",
      },
    ],
  },
  mumbai: {
    markets: [
      {
        name: "Colaba Causeway",
        image: "/placeholder.svg?height=150&width=200&text=Colaba+Causeway",
        description: "Souvenirs, clothing, and street shopping",
        timings: "10 AM - 10 PM",
        specialty: "Souvenirs",
      },
      {
        name: "Crawford Market",
        image: "/placeholder.svg?height=150&width=200&text=Crawford+Market",
        description: "Historic, colorful local market",
        timings: "9 AM - 8 PM",
        specialty: "Fresh Produce",
      },
      {
        name: "Linking Road, Bandra",
        image: "/placeholder.svg?height=150&width=200&text=Linking+Road",
        description: "Trendy fashion and street shopping",
        timings: "10 AM - 10 PM",
        specialty: "Fashion",
      },
      {
        name: "Chor Bazaar",
        image: "/placeholder.svg?height=150&width=200&text=Chor+Bazaar",
        description: "Antiques and vintage items market",
        timings: "11 AM - 7 PM",
        specialty: "Antiques",
      },
    ],
    malls: [
      {
        name: "Phoenix MarketCity Kurla",
        image: "/placeholder.svg?height=150&width=200&text=Phoenix+Kurla",
        description: "One of the biggest malls in India",
        timings: "10 AM - 10 PM",
        specialty: "Mega Shopping",
      },
      {
        name: "Palladium Mall",
        image: "/placeholder.svg?height=150&width=200&text=Palladium+Mall",
        description: "Luxury shopping in Lower Parel",
        timings: "10 AM - 10 PM",
        specialty: "Luxury Brands",
      },
      {
        name: "Infiniti Mall",
        image: "/placeholder.svg?height=150&width=200&text=Infiniti+Mall",
        description: "Popular mall with good food court",
        timings: "10 AM - 10 PM",
        specialty: "Food & Shopping",
      },
      {
        name: "R City Mall",
        image: "/placeholder.svg?height=150&width=200&text=R+City+Mall",
        description: "Entertainment and shopping destination",
        timings: "10 AM - 10 PM",
        specialty: "Entertainment",
      },
    ],
  },
}

const budgetOptions = [
  { id: "none", label: "No Shopping", amount: 0, description: "Skip shopping activities" },
  { id: "low", label: "Window Shopping", amount: 1000, description: "Light shopping for souvenirs" },
  { id: "medium", label: "Moderate Shopping", amount: 2000, description: "Some clothes and local items" },
  { id: "high", label: "Shopping Spree", amount: 3000, description: "Extensive shopping experience" },
  { id: "custom", label: "Custom Budget", amount: 0, description: "Set your own budget" },
]

export default function ShoppingPage() {
  const params = useParams()
  const city = params.city as string
  const { state, dispatch } = useTrip()
  const [wantToShop, setWantToShop] = useState(state.shopping.budget > 0 ? "yes" : "")
  const [selectedBudget, setSelectedBudget] = useState("")
  const [customBudget, setCustomBudget] = useState("")

  const cityShops = shoppingPlaces[city as keyof typeof shoppingPlaces] || { markets: [], malls: [] }

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

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2 capitalize">Shopping in {city}</h2>
        <p className="text-gray-600">Discover local markets and modern malls</p>
      </div>

      {/* Shopping Places Showcase */}
      <div className="space-y-6">
        <h3 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
          <ShoppingBag className="h-6 w-6" />
          Popular Shopping Destinations
        </h3>

        {/* Markets */}
        <div className="space-y-4">
          <h4 className="text-lg font-medium text-gray-800 flex items-center gap-2">
            <Store className="h-5 w-5" />
            Local Markets
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {cityShops.markets.map((market, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-32 overflow-hidden">
                  <Image src={market.image || "/placeholder.svg"} alt={market.name} fill className="object-cover" />
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">{market.name}</CardTitle>
                  <Badge variant="secondary" className="text-xs w-fit">
                    {market.specialty}
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-xs text-gray-600">{market.description}</p>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock className="h-3 w-3" />
                    {market.timings}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Malls */}
        <div className="space-y-4">
          <h4 className="text-lg font-medium text-gray-800 flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Shopping Malls
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {cityShops.malls.map((mall, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-32 overflow-hidden">
                  <Image src={mall.image || "/placeholder.svg"} alt={mall.name} fill className="object-cover" />
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">{mall.name}</CardTitle>
                  <Badge variant="secondary" className="text-xs w-fit">
                    {mall.specialty}
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-xs text-gray-600">{mall.description}</p>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock className="h-3 w-3" />
                    {mall.timings}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Shopping Preference */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-800 flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Shopping Preference
          </CardTitle>
          <CardDescription>Do you want to include shopping in your trip?</CardDescription>
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
                          ? "border-blue-500 bg-blue-50 shadow-lg"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="text-center space-y-2">
                        <h4 className="font-semibold">{option.label}</h4>
                        {option.id !== "custom" && (
                          <div className="text-2xl font-bold text-blue-600">₹{option.amount.toLocaleString()}</div>
                        )}
                        <p className="text-sm text-gray-600">{option.description}</p>
                      </div>
                    </Label>
                    {selectedBudget === option.id && (
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-blue-600 text-white">Selected</Badge>
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
        <Card className="bg-green-50 border-green-200">
          <CardHeader>
            <CardTitle className="text-green-800">Shopping Budget Set</CardTitle>
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

      {/* Shopping Tips */}
      <Card className="bg-yellow-50 border-yellow-200">
        <CardHeader>
          <CardTitle className="text-yellow-800 flex items-center gap-2">
            <Star className="h-5 w-5" />
            Shopping Tips for {city}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-yellow-700">
          <p>• Bargain at local markets but not in malls</p>
          <p>• Check for authenticity when buying branded items</p>
          <p>• Carry cash for street markets and small shops</p>
          <p>• Ask for GST bills for warranty and returns</p>
          <p>• Compare prices before making expensive purchases</p>
          <p>• Keep your shopping receipts for customs if traveling internationally</p>
        </CardContent>
      </Card>
    </div>
  )
}
