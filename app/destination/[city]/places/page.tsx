"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useTrip } from "@/contexts/trip-context"
import { useAuth } from "@/hooks/use-auth"
import { supabase } from "@/lib/supabase"
import { MapPin, Star, Clock, Calendar, TreePine, Building, Palette, ShoppingBag, Gamepad2 } from "lucide-react"

const attractions = {
  bengaluru: {
    nature: [
      {
        id: 1,
        name: "Lalbagh Botanical Garden",
        image: "/placeholder.svg?height=200&width=300&text=Lalbagh+Garden",
        rating: 4.5,
        duration: "2-3 hours",
        entry: 30,
        description: "240-acre garden with exotic plants and glasshouse modeled after London's Crystal Palace",
      },
      {
        id: 2,
        name: "Cubbon Park",
        image: "/placeholder.svg?height=200&width=300&text=Cubbon+Park",
        rating: 4.3,
        duration: "1-2 hours",
        entry: 0,
        description: "Green escape in city center, perfect for walks and picnics",
      },
      {
        id: 3,
        name: "Bannerghatta Biological Park",
        image: "/placeholder.svg?height=200&width=300&text=Bannerghatta+Park",
        rating: 4.2,
        duration: "4-5 hours",
        entry: 100,
        description: "Safari park with lions, tigers, and butterfly park",
      },
      {
        id: 4,
        name: "JP Park (Jayaprakash Narayan Biodiversity Park)",
        image: "/placeholder.svg?height=200&width=300&text=JP+Park",
        rating: 4.1,
        duration: "1-2 hours",
        entry: 0,
        description: "Peaceful park with lake, walking paths, and musical fountain",
      },
      {
        id: 5,
        name: "Hebbal Lake",
        image: "/placeholder.svg?height=200&width=300&text=Hebbal+Lake",
        rating: 4.0,
        duration: "1-2 hours",
        entry: 0,
        description: "Scenic lake with great birdwatching opportunities",
      },
    ],
    heritage: [
      {
        id: 6,
        name: "Bangalore Palace",
        image: "/placeholder.svg?height=200&width=300&text=Bangalore+Palace",
        rating: 4.4,
        duration: "2-3 hours",
        entry: 230,
        description: "Tudor-style architecture inspired by Windsor Castle",
      },
      {
        id: 7,
        name: "Tipu Sultan's Summer Palace",
        image: "/placeholder.svg?height=200&width=300&text=Tipu+Palace",
        rating: 4.2,
        duration: "1-2 hours",
        entry: 15,
        description: "18th-century Indo-Islamic architecture with rich history",
      },
      {
        id: 8,
        name: "Vidhana Soudha",
        image: "/placeholder.svg?height=200&width=300&text=Vidhana+Soudha",
        rating: 4.3,
        duration: "1 hour",
        entry: 0,
        description: "Iconic government building with majestic Neo-Dravidian architecture",
      },
      {
        id: 9,
        name: "ISKCON Temple Bangalore",
        image: "/placeholder.svg?height=200&width=300&text=ISKCON+Temple",
        rating: 4.5,
        duration: "1-2 hours",
        entry: 0,
        description: "Beautiful Krishna temple on hilltop with spiritual vibes",
      },
      {
        id: 10,
        name: "Bull Temple (Dodda Basavana Gudi)",
        image: "/placeholder.svg?height=200&width=300&text=Bull+Temple",
        rating: 4.1,
        duration: "30 min",
        entry: 0,
        description: "Temple dedicated to Nandi, the sacred bull",
      },
    ],
    museums: [
      {
        id: 11,
        name: "Visvesvaraya Industrial and Technological Museum",
        image: "/placeholder.svg?height=200&width=300&text=Science+Museum",
        rating: 4.3,
        duration: "2-3 hours",
        entry: 40,
        description: "Fun, educational museum for science lovers with interactive exhibits",
      },
      {
        id: 12,
        name: "National Gallery of Modern Art (NGMA)",
        image: "/placeholder.svg?height=200&width=300&text=Art+Gallery",
        rating: 4.2,
        duration: "1-2 hours",
        entry: 20,
        description: "Exhibits of Indian contemporary and modern art",
      },
      {
        id: 13,
        name: "Government Museum",
        image: "/placeholder.svg?height=200&width=300&text=Government+Museum",
        rating: 4.0,
        duration: "1-2 hours",
        entry: 10,
        description: "One of India's oldest museums with archaeological artifacts",
      },
      {
        id: 14,
        name: "HAL Aerospace Museum",
        image: "/placeholder.svg?height=200&width=300&text=Aerospace+Museum",
        rating: 4.4,
        duration: "2-3 hours",
        entry: 50,
        description: "Aviation exhibits including aircrafts and flight simulators",
      },
    ],
    shopping: [
      {
        id: 15,
        name: "Commercial Street",
        image: "/placeholder.svg?height=200&width=300&text=Commercial+Street",
        rating: 4.2,
        duration: "2-4 hours",
        entry: 0,
        description: "Popular for clothing, accessories, and street shopping",
      },
      {
        id: 16,
        name: "UB City Mall",
        image: "/placeholder.svg?height=200&width=300&text=UB+City+Mall",
        rating: 4.4,
        duration: "3-5 hours",
        entry: 0,
        description: "Luxury shopping, fine dining, and nightlife",
      },
      {
        id: 17,
        name: "MG Road & Brigade Road",
        image: "/placeholder.svg?height=200&width=300&text=Brigade+Road",
        rating: 4.1,
        duration: "2-3 hours",
        entry: 0,
        description: "Trendy shops, cafes, and bookstores",
      },
      {
        id: 18,
        name: "Church Street",
        image: "/placeholder.svg?height=200&width=300&text=Church+Street",
        rating: 4.3,
        duration: "2-3 hours",
        entry: 0,
        description: "Vibrant hub of cafés, pubs, bookstores, and street art",
      },
    ],
    entertainment: [
      {
        id: 19,
        name: "Wonderla Amusement Park",
        image: "/placeholder.svg?height=200&width=300&text=Wonderla",
        rating: 4.5,
        duration: "6-8 hours",
        entry: 999,
        description: "Thrilling rides and water slides; perfect for families and friends",
      },
      {
        id: 20,
        name: "Nandi Hills",
        image: "/placeholder.svg?height=200&width=300&text=Nandi+Hills",
        rating: 4.6,
        duration: "4-6 hours",
        entry: 30,
        description: "60 km from Bangalore; great for sunrise views and quick getaways",
      },
    ],
  },
  chennai: {
    nature: [
      {
        id: 1,
        name: "Marina Beach",
        image: "/placeholder.svg?height=200&width=300&text=Marina+Beach",
        rating: 4.3,
        duration: "2-3 hours",
        entry: 0,
        description: "Longest urban beach in India",
      },
      {
        id: 2,
        name: "Besant Nagar (Bessie) Beach",
        image: "/placeholder.svg?height=200&width=300&text=Besant+Nagar+Beach",
        rating: 4.2,
        duration: "1-2 hours",
        entry: 0,
        description: "Chill hangout with cafes nearby",
      },
      {
        id: 3,
        name: "Elliot's Beach",
        image: "/placeholder.svg?height=200&width=300&text=Elliots+Beach",
        rating: 4.1,
        duration: "1-2 hours",
        entry: 0,
        description: "Quieter, scenic alternative to Marina",
      },
      {
        id: 4,
        name: "Guindy National Park",
        image: "/placeholder.svg?height=200&width=300&text=Guindy+Park",
        rating: 4.0,
        duration: "2-3 hours",
        entry: 15,
        description: "Small but rich wildlife reserve inside the city",
      },
      {
        id: 5,
        name: "Semmozhi Poonga",
        image: "/placeholder.svg?height=200&width=300&text=Semmozhi+Poonga",
        rating: 3.9,
        duration: "1-2 hours",
        entry: 15,
        description: "Botanical garden in the heart of the city",
      },
    ],
    heritage: [
      {
        id: 6,
        name: "Kapaleeshwarar Temple",
        image: "/placeholder.svg?height=200&width=300&text=Kapaleeshwarar+Temple",
        rating: 4.5,
        duration: "1-2 hours",
        entry: 0,
        description: "Iconic Dravidian architecture in Mylapore",
      },
      {
        id: 7,
        name: "Parthasarathy Temple",
        image: "/placeholder.svg?height=200&width=300&text=Parthasarathy+Temple",
        rating: 4.3,
        duration: "1 hour",
        entry: 0,
        description: "One of the oldest temples in Chennai",
      },
      {
        id: 8,
        name: "Santhome Basilica",
        image: "/placeholder.svg?height=200&width=300&text=Santhome+Basilica",
        rating: 4.2,
        duration: "1 hour",
        entry: 0,
        description: "Historic church built over Apostle St. Thomas' tomb",
      },
      {
        id: 9,
        name: "Fort St. George",
        image: "/placeholder.svg?height=200&width=300&text=Fort+St+George",
        rating: 4.1,
        duration: "2-3 hours",
        entry: 15,
        description: "Old British fortress, now museum and Secretariat",
      },
      {
        id: 10,
        name: "Vivekananda House",
        image: "/placeholder.svg?height=200&width=300&text=Vivekananda+House",
        rating: 4.0,
        duration: "1 hour",
        entry: 10,
        description: "Museum with Swami Vivekananda's legacy",
      },
    ],
    museums: [
      {
        id: 11,
        name: "Government Museum & Egmore Museum Complex",
        image: "/placeholder.svg?height=200&width=300&text=Chennai+Museum",
        rating: 4.2,
        duration: "2-3 hours",
        entry: 15,
        description: "Ancient art, fossils, bronze statues",
      },
      {
        id: 12,
        name: "Birla Planetarium",
        image: "/placeholder.svg?height=200&width=300&text=Birla+Planetarium",
        rating: 4.1,
        duration: "1-2 hours",
        entry: 50,
        description: "Great for kids and astronomy lovers",
      },
      {
        id: 13,
        name: "Cholamandal Artists' Village",
        image: "/placeholder.svg?height=200&width=300&text=Artists+Village",
        rating: 4.0,
        duration: "1-2 hours",
        entry: 20,
        description: "South India's largest artists' commune",
      },
      {
        id: 14,
        name: "DakshinaChitra",
        image: "/placeholder.svg?height=200&width=300&text=DakshinaChitra",
        rating: 4.3,
        duration: "2-3 hours",
        entry: 120,
        description: "Open-air museum showcasing South Indian culture",
      },
    ],
    shopping: [
      {
        id: 15,
        name: "T Nagar (Pondy Bazaar)",
        image: "/placeholder.svg?height=200&width=300&text=T+Nagar",
        rating: 4.2,
        duration: "3-5 hours",
        entry: 0,
        description: "Heaven for sarees and jewelry",
      },
      {
        id: 16,
        name: "Express Avenue Mall",
        image: "/placeholder.svg?height=200&width=300&text=Express+Avenue",
        rating: 4.3,
        duration: "3-4 hours",
        entry: 0,
        description: "Shopping + multiplex + food court",
      },
      {
        id: 17,
        name: "Phoenix MarketCity",
        image: "/placeholder.svg?height=200&width=300&text=Phoenix+MarketCity",
        rating: 4.4,
        duration: "4-6 hours",
        entry: 0,
        description: "Huge mall with events and entertainment",
      },
      {
        id: 18,
        name: "George Town Market",
        image: "/placeholder.svg?height=200&width=300&text=George+Town",
        rating: 3.9,
        duration: "2-3 hours",
        entry: 0,
        description: "Traditional wholesale market experience",
      },
    ],
    entertainment: [
      {
        id: 19,
        name: "Madras Crocodile Bank",
        image: "/placeholder.svg?height=200&width=300&text=Crocodile+Bank",
        rating: 4.1,
        duration: "2-3 hours",
        entry: 50,
        description: "Croc conservation park 40 km from city",
      },
      {
        id: 20,
        name: "Mahabalipuram",
        image: "/placeholder.svg?height=200&width=300&text=Mahabalipuram",
        rating: 4.6,
        duration: "6-8 hours",
        entry: 40,
        description: "Ancient rock-cut temples and beachside beauty (1.5 hrs away)",
      },
    ],
  },
  hyderabad: {
    heritage: [
      {
        id: 1,
        name: "Charminar",
        image: "/placeholder.svg?height=200&width=300&text=Charminar",
        rating: 4.4,
        duration: "1-2 hours",
        entry: 25,
        description: "16th-century icon of Hyderabad",
      },
      {
        id: 2,
        name: "Golconda Fort",
        image: "/placeholder.svg?height=200&width=300&text=Golconda+Fort",
        rating: 4.5,
        duration: "3-4 hours",
        entry: 25,
        description: "Huge fort with light & sound show",
      },
      {
        id: 3,
        name: "Qutb Shahi Tombs",
        image: "/placeholder.svg?height=200&width=300&text=Qutb+Shahi+Tombs",
        rating: 4.2,
        duration: "2-3 hours",
        entry: 25,
        description: "Royal tombs in Persian style",
      },
      {
        id: 4,
        name: "Chowmahalla Palace",
        image: "/placeholder.svg?height=200&width=300&text=Chowmahalla+Palace",
        rating: 4.3,
        duration: "2-3 hours",
        entry: 80,
        description: "Beautiful palace of the Nizams",
      },
      {
        id: 5,
        name: "Mecca Masjid",
        image: "/placeholder.svg?height=200&width=300&text=Mecca+Masjid",
        rating: 4.1,
        duration: "1 hour",
        entry: 0,
        description: "One of the largest mosques in India",
      },
    ],
    nature: [
      {
        id: 6,
        name: "Hussain Sagar Lake",
        image: "/placeholder.svg?height=200&width=300&text=Hussain+Sagar",
        rating: 4.2,
        duration: "2-3 hours",
        entry: 0,
        description: "Buddha statue on an island + boating",
      },
      {
        id: 7,
        name: "Lumbini Park",
        image: "/placeholder.svg?height=200&width=300&text=Lumbini+Park",
        rating: 4.0,
        duration: "1-2 hours",
        entry: 30,
        description: "Laser shows + lakeside fun",
      },
      {
        id: 8,
        name: "Nehru Zoological Park",
        image: "/placeholder.svg?height=200&width=300&text=Nehru+Zoo",
        rating: 4.1,
        duration: "3-4 hours",
        entry: 50,
        description: "One of India's best zoos",
      },
      {
        id: 9,
        name: "KBR National Park",
        image: "/placeholder.svg?height=200&width=300&text=KBR+Park",
        rating: 4.3,
        duration: "2-3 hours",
        entry: 30,
        description: "Nature walks and birdwatching",
      },
      {
        id: 10,
        name: "Durgam Cheruvu",
        image: "/placeholder.svg?height=200&width=300&text=Durgam+Cheruvu",
        rating: 4.0,
        duration: "1-2 hours",
        entry: 0,
        description: "Lake with cable bridge and entertainment zone",
      },
    ],
    museums: [
      {
        id: 11,
        name: "Salar Jung Museum",
        image: "/placeholder.svg?height=200&width=300&text=Salar+Jung+Museum",
        rating: 4.4,
        duration: "2-3 hours",
        entry: 20,
        description: "World-class art and artifact collection",
      },
      {
        id: 12,
        name: "Birla Science Museum & Planetarium",
        image: "/placeholder.svg?height=200&width=300&text=Birla+Science+Museum",
        rating: 4.2,
        duration: "2-3 hours",
        entry: 50,
        description: "Interactive exhibits for kids & adults",
      },
      {
        id: 13,
        name: "Shilparamam",
        image: "/placeholder.svg?height=200&width=300&text=Shilparamam",
        rating: 4.1,
        duration: "2-3 hours",
        entry: 25,
        description: "Cultural village and craft fairground",
      },
      {
        id: 14,
        name: "Sudha Car Museum",
        image: "/placeholder.svg?height=200&width=300&text=Sudha+Car+Museum",
        rating: 4.0,
        duration: "1-2 hours",
        entry: 50,
        description: "Quirky cars shaped like things (shoes, burgers etc)",
      },
    ],
    shopping: [
      {
        id: 15,
        name: "Laad Bazaar (Choodi Bazaar)",
        image: "/placeholder.svg?height=200&width=300&text=Laad+Bazaar",
        rating: 4.2,
        duration: "2-3 hours",
        entry: 0,
        description: "Bangles, pearls, traditional shopping",
      },
      {
        id: 16,
        name: "IKEA Hyderabad",
        image: "/placeholder.svg?height=200&width=300&text=IKEA+Hyderabad",
        rating: 4.3,
        duration: "3-4 hours",
        entry: 0,
        description: "Huge IKEA with café and showroom",
      },
      {
        id: 17,
        name: "Banjara Hills / Jubilee Hills",
        image: "/placeholder.svg?height=200&width=300&text=Banjara+Hills",
        rating: 4.2,
        duration: "2-4 hours",
        entry: 0,
        description: "Upscale area with cafés, bars",
      },
      {
        id: 18,
        name: "Inorbit Mall",
        image: "/placeholder.svg?height=200&width=300&text=Inorbit+Mall",
        rating: 4.1,
        duration: "3-4 hours",
        entry: 0,
        description: "Shopping, food, and entertainment",
      },
    ],
    entertainment: [
      {
        id: 19,
        name: "Ramoji Film City",
        image: "/placeholder.svg?height=200&width=300&text=Ramoji+Film+City",
        rating: 4.5,
        duration: "8-10 hours",
        entry: 1200,
        description: "Massive film studio with guided tours & shows",
      },
      {
        id: 20,
        name: "Snow World",
        image: "/placeholder.svg?height=200&width=300&text=Snow+World",
        rating: 4.0,
        duration: "2-3 hours",
        entry: 650,
        description: "Indoor snow-themed amusement park",
      },
    ],
  },
  mumbai: {
    heritage: [
      {
        id: 1,
        name: "Gateway of India",
        image: "/placeholder.svg?height=200&width=300&text=Gateway+of+India",
        rating: 4.3,
        duration: "1-2 hours",
        entry: 0,
        description: "Mumbai's iconic waterfront arch",
      },
      {
        id: 2,
        name: "Chhatrapati Shivaji Terminus (CST)",
        image: "/placeholder.svg?height=200&width=300&text=CST+Station",
        rating: 4.2,
        duration: "1 hour",
        entry: 0,
        description: "Gothic-style train station & UNESCO World Heritage site",
      },
      {
        id: 3,
        name: "Elephanta Caves",
        image: "/placeholder.svg?height=200&width=300&text=Elephanta+Caves",
        rating: 4.4,
        duration: "4-5 hours",
        entry: 40,
        description: "Rock-cut Hindu & Buddhist caves (ferry from Gateway)",
      },
      {
        id: 4,
        name: "Haji Ali Dargah",
        image: "/placeholder.svg?height=200&width=300&text=Haji+Ali",
        rating: 4.1,
        duration: "1-2 hours",
        entry: 0,
        description: "Mosque on an islet, accessible via walkway",
      },
      {
        id: 5,
        name: "Siddhivinayak Temple",
        image: "/placeholder.svg?height=200&width=300&text=Siddhivinayak",
        rating: 4.2,
        duration: "1 hour",
        entry: 0,
        description: "Famous Ganesh temple in Dadar",
      },
    ],
    nature: [
      {
        id: 6,
        name: "Marine Drive",
        image: "/placeholder.svg?height=200&width=300&text=Marine+Drive",
        rating: 4.4,
        duration: "1-2 hours",
        entry: 0,
        description: "Queen's Necklace view at night",
      },
      {
        id: 7,
        name: "Girgaon Chowpatty Beach",
        image: "/placeholder.svg?height=200&width=300&text=Chowpatty+Beach",
        rating: 4.0,
        duration: "1-2 hours",
        entry: 0,
        description: "Sunset and street snacks",
      },
      {
        id: 8,
        name: "Juhu Beach",
        image: "/placeholder.svg?height=200&width=300&text=Juhu+Beach",
        rating: 4.1,
        duration: "2-3 hours",
        entry: 0,
        description: "Popular, Bollywood celeb hangout",
      },
      {
        id: 9,
        name: "Sanjay Gandhi National Park",
        image: "/placeholder.svg?height=200&width=300&text=Sanjay+Gandhi+Park",
        rating: 4.3,
        duration: "4-6 hours",
        entry: 46,
        description: "Forest, hiking, and Kanheri Caves",
      },
      {
        id: 10,
        name: "Hanging Gardens & Kamala Nehru Park",
        image: "/placeholder.svg?height=200&width=300&text=Hanging+Gardens",
        rating: 3.9,
        duration: "1 hour",
        entry: 0,
        description: "Overlooking Marine Drive",
      },
    ],
    museums: [
      {
        id: 11,
        name: "Chhatrapati Shivaji Maharaj Vastu Sangrahalaya",
        image: "/placeholder.svg?height=200&width=300&text=Shivaji+Museum",
        rating: 4.3,
        duration: "2-3 hours",
        entry: 70,
        description: "Top art & history museum",
      },
      {
        id: 12,
        name: "Nehru Science Centre",
        image: "/placeholder.svg?height=200&width=300&text=Science+Centre",
        rating: 4.1,
        duration: "2-3 hours",
        entry: 58,
        description: "Great for interactive learning",
      },
      {
        id: 13,
        name: "Dr. Bhau Daji Lad Museum",
        image: "/placeholder.svg?height=200&width=300&text=Bhau+Daji+Museum",
        rating: 4.0,
        duration: "1-2 hours",
        entry: 10,
        description: "Beautiful interiors and Mumbai history",
      },
      {
        id: 14,
        name: "Jehangir Art Gallery",
        image: "/placeholder.svg?height=200&width=300&text=Jehangir+Gallery",
        rating: 4.2,
        duration: "1 hour",
        entry: 0,
        description: "Contemporary Indian art near Kala Ghoda",
      },
    ],
    shopping: [
      {
        id: 15,
        name: "Colaba Causeway",
        image: "/placeholder.svg?height=200&width=300&text=Colaba+Causeway",
        rating: 4.1,
        duration: "2-3 hours",
        entry: 0,
        description: "Souvenirs, clothing, and cafes",
      },
      {
        id: 16,
        name: "Crawford Market",
        image: "/placeholder.svg?height=200&width=300&text=Crawford+Market",
        rating: 4.0,
        duration: "1-2 hours",
        entry: 0,
        description: "Historic, colorful local market",
      },
      {
        id: 17,
        name: "Phoenix MarketCity (Kurla)",
        image: "/placeholder.svg?height=200&width=300&text=Phoenix+Kurla",
        rating: 4.3,
        duration: "4-6 hours",
        entry: 0,
        description: "One of the biggest malls in India",
      },
      {
        id: 18,
        name: "Linking Road / Bandra",
        image: "/placeholder.svg?height=200&width=300&text=Linking+Road",
        rating: 4.2,
        duration: "2-3 hours",
        entry: 0,
        description: "Trendy fashion and street shopping",
      },
    ],
    entertainment: [
      {
        id: 19,
        name: "Film City (Goregaon)",
        image: "/placeholder.svg?height=200&width=300&text=Film+City",
        rating: 4.2,
        duration: "4-6 hours",
        entry: 500,
        description: "Bollywood set tours (pre-booking needed)",
      },
      {
        id: 20,
        name: "EsselWorld / Water Kingdom",
        image: "/placeholder.svg?height=200&width=300&text=EsselWorld",
        rating: 4.0,
        duration: "6-8 hours",
        entry: 999,
        description: "Classic amusement park by the sea",
      },
    ],
  },
}

export default function PlacesPage() {
  const params = useParams()
  const city = params.city as string
  const [tripId, setTripId] = useState<string | null>(null)
  const { user } = useAuth()
  const { state, dispatch } = useTrip()
  const [days, setDays] = useState(state.attractions.days.toString())
  const [selectedPlaces, setSelectedPlaces] = useState<any[]>(state.attractions.places)
  const [activeCategory, setActiveCategory] = useState("nature")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Get tripId from URL search params on client side
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search)
      setTripId(urlParams.get('tripId'))
    }
  }, [])

  const cityAttractions = attractions[city as keyof typeof attractions] || {}
  const maxPlacesPerDay = 3
  const maxPlaces = Number.parseInt(days) * maxPlacesPerDay
  const localTravelCostPerDay = 800

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
        const attractionsDetails = data.attractions_details || {}
        if (attractionsDetails.places) {
          setSelectedPlaces(attractionsDetails.places)
          setDays(attractionsDetails.days?.toString() || "1")
        }
      }
    } catch (error) {
      console.error("Error loading trip data:", error)
    }
    setLoading(false)
  }

  const categories = [
    { key: "nature", label: "Nature & Parks", icon: TreePine },
    { key: "heritage", label: "Heritage", icon: Building },
    { key: "museums", label: "Museums", icon: Palette },
    { key: "shopping", label: "Shopping", icon: ShoppingBag },
    { key: "entertainment", label: "Fun & Entertainment", icon: Gamepad2 },
  ]

  const handlePlaceToggle = (place: any) => {
    const isSelected = selectedPlaces.some((p) => p.id === place.id)
    let newSelectedPlaces

    if (isSelected) {
      newSelectedPlaces = selectedPlaces.filter((p) => p.id !== place.id)
    } else {
      if (selectedPlaces.length >= maxPlaces) {
        return // Don't add if max limit reached
      }
      newSelectedPlaces = [...selectedPlaces, place]
    }

    setSelectedPlaces(newSelectedPlaces)
    const totalCost = localTravelCostPerDay * Number.parseInt(days)
    dispatch({
      type: "SET_ATTRACTIONS",
      payload: {
        places: newSelectedPlaces,
        days: Number.parseInt(days),
        cost: totalCost,
      },
    })
  }

  const handleDaysChange = (newDays: string) => {
    setDays(newDays)
    const newMaxPlaces = Number.parseInt(newDays) * maxPlacesPerDay
    let newSelectedPlaces = selectedPlaces

    // If reducing days, trim selected places if needed
    if (selectedPlaces.length > newMaxPlaces) {
      newSelectedPlaces = selectedPlaces.slice(0, newMaxPlaces)
      setSelectedPlaces(newSelectedPlaces)
    }

    const totalCost = localTravelCostPerDay * Number.parseInt(newDays)
    dispatch({
      type: "SET_ATTRACTIONS",
      payload: {
        places: newSelectedPlaces,
        days: Number.parseInt(newDays),
        cost: totalCost,
      },
    })
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
        <h2 className="text-3xl font-bold text-gray-900 mb-2 capitalize">Local Attractions in {city}</h2>
        <p className="text-gray-600">Discover the best places to visit</p>
        {tripId && (
          <div className="mt-2">
            <Badge variant="outline">Editing existing trip</Badge>
          </div>
        )}
      </div>

      {/* Days Selection */}
      <div className="flex items-center justify-center gap-4 bg-white p-4 rounded-lg shadow-sm">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
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
        <div className="text-sm text-gray-600">(Max {maxPlaces} places - 3 per day)</div>
      </div>

      {/* Category Tabs */}
      <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          {categories.map((category) => {
            const Icon = category.icon
            const categoryPlaces = cityAttractions[category.key as keyof typeof cityAttractions] || []
            return (
              <TabsTrigger key={category.key} value={category.key} className="gap-2 text-xs">
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{category.label}</span>
                <span className="sm:hidden">{category.key}</span>
                <Badge variant="secondary" className="ml-1">
                  {categoryPlaces.length}
                </Badge>
              </TabsTrigger>
            )
          })}
        </TabsList>

        {categories.map((category) => {
          const categoryPlaces = cityAttractions[category.key as keyof typeof cityAttractions] || []
          return (
            <TabsContent key={category.key} value={category.key} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoryPlaces.map((place: any) => {
                  const isSelected = selectedPlaces.some((p) => p.id === place.id)
                  const canSelect = selectedPlaces.length < maxPlaces || isSelected

                  return (
                    <Card
                      key={place.id}
                      className={`cursor-pointer transition-all hover:shadow-lg ${
                        isSelected ? "ring-2 ring-blue-500 bg-blue-50" : ""
                      } ${!canSelect ? "opacity-50" : ""}`}
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
                            <Badge className="bg-blue-600 text-white">Selected</Badge>
                          </div>
                        )}
                      </div>

                      <CardHeader>
                        <CardTitle className="text-lg">{place.name}</CardTitle>
                        <CardDescription className="flex items-center gap-4 text-sm">
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {place.duration}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />₹{place.entry} entry
                          </span>
                        </CardDescription>
                      </CardHeader>

                      <CardContent>
                        <p className="text-sm text-gray-600 mb-4">{place.description}</p>
                        <Button
                          variant={isSelected ? "default" : "outline"}
                          size="sm"
                          className="w-full"
                          disabled={!canSelect}
                        >
                          {isSelected ? "Selected" : canSelect ? "Select" : "Limit Reached"}
                        </Button>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </TabsContent>
          )
        })}
      </Tabs>

      {/* Selected Places Summary */}
      {selectedPlaces.length > 0 && (
        <Card className="bg-green-50 border-green-200">
          <CardHeader>
            <CardTitle className="text-green-800">Selected Places</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {selectedPlaces.map((place, index) => (
                <div key={place.id} className="flex items-center gap-2 text-sm">
                  <Badge variant="outline">{index + 1}</Badge>
                  <span>{place.name}</span>
                </div>
              ))}
            </div>

            <div className="border-t pt-4">
              <div className="flex items-center justify-between text-lg font-semibold">
                <span>Places Selected: {selectedPlaces.length}</span>
              </div>
              <div className="flex items-center justify-between text-lg font-semibold">
                <span>
                  Local Travel Cost: ₹{localTravelCostPerDay.toLocaleString()}/day × {days}
                </span>
                <span className="text-green-600">
                  Total: ₹{(localTravelCostPerDay * Number.parseInt(days)).toLocaleString()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
