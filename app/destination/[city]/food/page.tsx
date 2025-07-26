"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useTrip } from "@/contexts/trip-context"
import { useAuth } from "@/hooks/use-auth"
import { supabase } from "@/lib/supabase"
import { UtensilsCrossed, Star, DollarSign } from "lucide-react"

const localDishes = {
  bengaluru: [
    {
      name: "Masala Dosa",
      image: "/placeholder.svg?height=150&width=200&text=Masala+Dosa",
      description: "Crispy rice crepe with spiced potato filling",
    },
    {
      name: "Bisi Bele Bath",
      image: "/placeholder.svg?height=150&width=200&text=Bisi+Bele+Bath",
      description: "Spicy rice dish with lentils and vegetables",
    },
    {
      name: "Mysore Pak",
      image: "/placeholder.svg?height=150&width=200&text=Mysore+Pak",
      description: "Traditional sweet made with ghee and gram flour",
    },
    {
      name: "Filter Coffee",
      image: "/placeholder.svg?height=150&width=200&text=Filter+Coffee",
      description: "Authentic South Indian coffee",
    },
    {
      name: "Rava Idli",
      image: "/placeholder.svg?height=150&width=200&text=Rava+Idli",
      description: "Steamed semolina cakes with spices",
    },
    {
      name: "Pongal",
      image: "/placeholder.svg?height=150&width=200&text=Pongal",
      description: "Comfort food made with rice and lentils",
    },
  ],
  chennai: [
    {
      name: "Chettinad Chicken",
      image: "/placeholder.svg?height=150&width=200&text=Chettinad+Chicken",
      description: "Spicy chicken curry with aromatic spices",
    },
    {
      name: "Idli Sambar",
      image: "/placeholder.svg?height=150&width=200&text=Idli+Sambar",
      description: "Steamed rice cakes with lentil curry",
    },
    {
      name: "Fish Curry",
      image: "/placeholder.svg?height=150&width=200&text=Fish+Curry",
      description: "Traditional Tamil fish curry with coconut",
    },
    {
      name: "Payasam",
      image: "/placeholder.svg?height=150&width=200&text=Payasam",
      description: "Sweet dessert made with milk and rice",
    },
    {
      name: "Kothu Parotta",
      image: "/placeholder.svg?height=150&width=200&text=Kothu+Parotta",
      description: "Shredded parotta with curry and spices",
    },
    {
      name: "Rasam",
      image: "/placeholder.svg?height=150&width=200&text=Rasam",
      description: "Tangy soup with tamarind and spices",
    },
  ],
  hyderabad: [
    {
      name: "Hyderabadi Biryani",
      image: "/placeholder.svg?height=150&width=200&text=Hyderabadi+Biryani",
      description: "Aromatic rice dish with tender meat",
    },
    {
      name: "Haleem",
      image: "/placeholder.svg?height=150&width=200&text=Haleem",
      description: "Rich stew of meat, lentils, and wheat",
    },
    {
      name: "Nihari",
      image: "/placeholder.svg?height=150&width=200&text=Nihari",
      description: "Slow-cooked meat curry",
    },
    {
      name: "Double Ka Meetha",
      image: "/placeholder.svg?height=150&width=200&text=Double+Ka+Meetha",
      description: "Bread pudding with nuts and cream",
    },
    {
      name: "Lukhmi",
      image: "/placeholder.svg?height=150&width=200&text=Lukhmi",
      description: "Square-shaped meat pastry",
    },
    {
      name: "Irani Chai",
      image: "/placeholder.svg?height=150&width=200&text=Irani+Chai",
      description: "Traditional tea with biscuits",
    },
  ],
  mumbai: [
    {
      name: "Vada Pav",
      image: "/placeholder.svg?height=150&width=200&text=Vada+Pav",
      description: "Mumbai's iconic street food burger",
    },
    {
      name: "Pav Bhaji",
      image: "/placeholder.svg?height=150&width=200&text=Pav+Bhaji",
      description: "Spicy vegetable curry with bread",
    },
    {
      name: "Bhel Puri",
      image: "/placeholder.svg?height=150&width=200&text=Bhel+Puri",
      description: "Crunchy snack mix with chutneys",
    },
    {
      name: "Bombay Duck Curry",
      image: "/placeholder.svg?height=150&width=200&text=Bombay+Duck",
      description: "Local fish curry specialty",
    },
    {
      name: "Solkadhi",
      image: "/placeholder.svg?height=150&width=200&text=Solkadhi",
      description: "Refreshing coconut and kokum drink",
    },
    {
      name: "Modak",
      image: "/placeholder.svg?height=150&width=200&text=Modak",
      description: "Sweet dumplings filled with jaggery",
    },
  ],
}

const mealPlans = [
  {
    id: "basic",
    name: "Basic",
    price: 500,
    description: "Street food and local eateries",
    features: ["Street food", "Local restaurants", "Basic meals", "2 meals/day"],
    icon: "🍛",
  },
  {
    id: "standard",
    name: "Standard",
    price: 1000,
    description: "Mix of local and restaurant dining",
    features: ["Popular restaurants", "Local specialties", "Variety of cuisines", "3 meals/day"],
    icon: "🍽️",
  },
  {
    id: "premium",
    name: "Premium",
    price: 1500,
    description: "Fine dining and premium experiences",
    features: ["Fine dining", "Premium restaurants", "Chef specials", "3 meals + snacks"],
    icon: "🥂",
  },
]

export default function FoodPage() {
  const params = useParams()
  const city = params.city as string
  const [tripId, setTripId] = useState<string | null>(null)
  const { user } = useAuth()
  const { state, dispatch } = useTrip()
  const [selectedPlan, setSelectedPlan] = useState(state.food.plan || "")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Get tripId from URL search params on client side
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search)
      setTripId(urlParams.get('tripId'))
    }
  }, [])

  const cityDishes = localDishes[city as keyof typeof localDishes] || []

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

      if (!error && data) {
        const foodDetails = data.food_details || {}
        if (foodDetails.plan) {
          setSelectedPlan(foodDetails.plan)
        }
      }
    } catch (error) {
      console.error("Error loading trip data:", error)
    }
    setLoading(false)
  }

  const handlePlanSelect = (planId: string) => {
    const plan = mealPlans.find((p) => p.id === planId)
    if (plan) {
      setSelectedPlan(planId)
      dispatch({
        type: "SET_FOOD",
        payload: {
          plan: plan.name,
          cost: plan.price,
        },
      })
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
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2 capitalize">Try Local Food in {city}</h2>
        <p className="text-gray-600">Discover authentic flavors and local specialties</p>
        {tripId && (
          <div className="mt-2">
            <Badge variant="outline">Editing existing trip</Badge>
          </div>
        )}
      </div>

      {/* Local Dishes Showcase */}
      <div className="space-y-4">
        <h3 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
          <UtensilsCrossed className="h-6 w-6" />
          Must-Try Local Dishes
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cityDishes.map((dish, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-32 overflow-hidden">
                <Image src={dish.image || "/placeholder.svg"} alt={dish.name} fill className="object-cover" />
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{dish.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">{dish.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Meal Plans */}
      <div className="space-y-6">
        <h3 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
          <DollarSign className="h-6 w-6" />
          Choose Your Meal Plan
        </h3>

        <RadioGroup value={selectedPlan} onValueChange={handlePlanSelect}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mealPlans.map((plan) => (
              <div key={plan.id} className="relative">
                <RadioGroupItem value={plan.id} id={plan.id} className="peer sr-only" />
                <Label
                  htmlFor={plan.id}
                  className={`cursor-pointer block p-6 rounded-lg border-2 transition-all hover:shadow-lg ${
                    selectedPlan === plan.id
                      ? "border-blue-500 bg-blue-50 shadow-lg"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <Card className="border-0 shadow-none bg-transparent">
                    <CardHeader className="text-center pb-4">
                      <div className="text-4xl mb-2">{plan.icon}</div>
                      <CardTitle className="text-xl">{plan.name}</CardTitle>
                      <div className="text-3xl font-bold text-blue-600">₹{plan.price.toLocaleString()}</div>
                      <CardDescription>{plan.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {plan.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span>{feature}</span>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </Label>
                {selectedPlan === plan.id && (
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-blue-600 text-white">Selected</Badge>
                  </div>
                )}
              </div>
            ))}
          </div>
        </RadioGroup>
      </div>

      {/* Selected Plan Summary */}
      {selectedPlan && (
        <Card className="bg-green-50 border-green-200">
          <CardHeader>
            <CardTitle className="text-green-800">Selected Food Plan</CardTitle>
          </CardHeader>
          <CardContent>
            {(() => {
              const plan = mealPlans.find((p) => p.id === selectedPlan)
              return plan ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-lg">{plan.name} Plan</p>
                      <p className="text-sm text-gray-600">{plan.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-600">₹{plan.price.toLocaleString()}</p>
                      <p className="text-sm text-gray-600">per day</p>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between text-lg font-semibold">
                      <span>Plan: {plan.name}</span>
                      <span className="text-green-600">Food Budget: ₹{plan.price.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ) : null
            })()}
          </CardContent>
        </Card>
      )}

      {/* Food Tips */}
      <Card className="bg-yellow-50 border-yellow-200">
        <CardHeader>
          <CardTitle className="text-yellow-800 flex items-center gap-2">
            <Star className="h-5 w-5" />
            Local Food Tips
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-yellow-700">
          <p>• Try street food from popular vendors for authentic flavors</p>
          <p>• Ask locals for restaurant recommendations</p>
          <p>• Don't miss the signature dishes of {city}</p>
          <p>• Consider food allergies and dietary restrictions</p>
          <p>• Carry water and basic medicines for street food adventures</p>
        </CardContent>
      </Card>
    </div>
  )
}
