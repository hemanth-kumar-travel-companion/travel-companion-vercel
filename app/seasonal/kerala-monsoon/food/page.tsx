"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useTrip } from "@/contexts/trip-context"
import { UtensilsCrossed, Star, CheckCircle } from "lucide-react"

const keralaSpecialties = [
  {
    name: "Appam with Stew",
    image: "/placeholder.svg?height=150&width=200&text=Appam+Stew",
    description: "Fermented rice pancakes with coconut milk stew",
  },
  {
    name: "Fish Curry",
    image: "/placeholder.svg?height=150&width=200&text=Fish+Curry",
    description: "Traditional Kerala fish curry with coconut",
  },
  {
    name: "Puttu & Kadala",
    image: "/placeholder.svg?height=150&width=200&text=Puttu+Kadala",
    description: "Steamed rice cake with black chickpea curry",
  },
  {
    name: "Sadya",
    image: "/placeholder.svg?height=150&width=200&text=Kerala+Sadya",
    description: "Traditional feast served on banana leaf",
  },
  {
    name: "Payasam",
    image: "/placeholder.svg?height=150&width=200&text=Payasam",
    description: "Sweet dessert made with rice, milk and jaggery",
  },
  {
    name: "Karimeen Fry",
    image: "/placeholder.svg?height=150&width=200&text=Karimeen+Fry",
    description: "Pearl spot fish marinated and fried",
  },
]

const mealPlans = [
  {
    id: "traditional",
    name: "Traditional Kerala",
    price: 800,
    description: "Authentic Kerala cuisine experience",
    features: ["Traditional meals", "Local specialties", "Coconut-based dishes", "Spice-rich flavors"],
    icon: "🥥",
  },
  {
    id: "seafood",
    name: "Coastal Seafood",
    price: 1200,
    description: "Fresh seafood and coastal delicacies",
    features: ["Fresh fish curry", "Prawns & crab", "Coastal specialties", "Backwater dining"],
    icon: "🐟",
  },
  {
    id: "premium",
    name: "Premium Dining",
    price: 1800,
    description: "Fine dining with traditional and modern fusion",
    features: ["Resort dining", "Multi-cuisine", "Premium ingredients", "Special experiences"],
    icon: "🍽️",
  },
]

export default function KeralaFoodPage() {
  const { state, dispatch } = useTrip()
  const router = useRouter()
  const [selectedPlan, setSelectedPlan] = useState("")

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

  const handleProceed = () => {
    router.push("/seasonal/kerala-monsoon/shopping")
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Taste of Kerala</h2>
        <p className="text-gray-600">Experience authentic flavors of God's Own Country</p>
      </div>

      {/* Kerala Specialties Showcase */}
      <div className="space-y-4">
        <h3 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
          <UtensilsCrossed className="h-6 w-6" />
          Must-Try Kerala Dishes
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {keralaSpecialties.map((dish, index) => (
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
        <h3 className="text-2xl font-semibold text-gray-900">Choose Your Meal Plan</h3>

        <RadioGroup value={selectedPlan} onValueChange={handlePlanSelect}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mealPlans.map((plan) => (
              <div key={plan.id} className="relative">
                <RadioGroupItem value={plan.id} id={plan.id} className="peer sr-only" />
                <Label
                  htmlFor={plan.id}
                  className={`cursor-pointer block p-6 rounded-lg border-2 transition-all hover:shadow-lg ${
                    selectedPlan === plan.id
                      ? "border-green-500 bg-green-50 shadow-lg"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <Card className="border-0 shadow-none bg-transparent">
                    <CardHeader className="text-center pb-4">
                      <div className="text-4xl mb-2">{plan.icon}</div>
                      <CardTitle className="text-xl">{plan.name}</CardTitle>
                      <div className="text-3xl font-bold text-green-600">₹{plan.price.toLocaleString()}</div>
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
      </div>

      {/* Selected Plan Summary */}
      {selectedPlan && (
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 shadow-lg">
          <CardHeader>
            <CardTitle className="text-green-800 flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Selected Food Plan
            </CardTitle>
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

                  <div className="border-t pt-4 bg-white/50 rounded-lg p-4">
                    <div className="flex items-center justify-between text-lg font-semibold">
                      <span>Food Budget: ₹{plan.price.toLocaleString()}</span>
                      <Button onClick={handleProceed} className="bg-green-600 hover:bg-green-700 gap-2">
                        Proceed to Shopping
                      </Button>
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
            Kerala Food Tips
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-yellow-700">
          <p>• Try fresh coconut water - perfect for monsoon hydration</p>
          <p>• Don't miss the traditional Sadya served on banana leaf</p>
          <p>• Seafood is freshest near coastal areas like Kovalam</p>
          <p>• Spice levels can be high - ask for mild if you prefer</p>
          <p>• Ayurvedic herbs are often used in traditional cooking</p>
          <p>• Hot tea and snacks are perfect for rainy weather</p>
        </CardContent>
      </Card>
    </div>
  )
}
