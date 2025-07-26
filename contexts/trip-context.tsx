"use client"

import type React from "react"
import { createContext, useContext, useReducer, type ReactNode } from "react"

interface TripState {
  destination: string
  transport: {
    mode: "bus" | "train" | "flight"
    option: any
    seats: number
    cost: number
  }
  accommodation: {
    hotel: any
    days: number
    cost: number
  }
  attractions: {
    places: any[]
    days: number
    cost: number
  }
  food: {
    plan: string
    cost: number
  }
  shopping: {
    budget: number
  }
  totalCost: number
}

type TripAction =
  | { type: "SET_DESTINATION"; payload: string }
  | { type: "SET_TRANSPORT"; payload: Partial<TripState["transport"]> }
  | { type: "SET_ACCOMMODATION"; payload: Partial<TripState["accommodation"]> }
  | { type: "SET_ATTRACTIONS"; payload: Partial<TripState["attractions"]> }
  | { type: "SET_FOOD"; payload: Partial<TripState["food"]> }
  | { type: "SET_SHOPPING"; payload: Partial<TripState["shopping"]> }
  | { type: "CALCULATE_TOTAL" }
  | { type: "RESET_TRIP" }
  | { type: "LOAD_TRIP"; payload: TripState }

const initialState: TripState = {
  destination: "",
  transport: { mode: "bus", option: null, seats: 1, cost: 0 },
  accommodation: { hotel: null, days: 1, cost: 0 },
  attractions: { places: [], days: 1, cost: 0 },
  food: { plan: "", cost: 0 },
  shopping: { budget: 0 },
  totalCost: 0,
}

function tripReducer(state: TripState, action: TripAction): TripState {
  switch (action.type) {
    case "SET_DESTINATION":
      return { ...state, destination: action.payload }
    case "SET_TRANSPORT":
      return { ...state, transport: { ...state.transport, ...action.payload } }
    case "SET_ACCOMMODATION":
      return { ...state, accommodation: { ...state.accommodation, ...action.payload } }
    case "SET_ATTRACTIONS":
      return { ...state, attractions: { ...state.attractions, ...action.payload } }
    case "SET_FOOD":
      return { ...state, food: { ...state.food, ...action.payload } }
    case "SET_SHOPPING":
      return { ...state, shopping: { ...state.shopping, ...action.payload } }
    case "CALCULATE_TOTAL":
      return {
        ...state,
        totalCost:
          state.transport.cost +
          state.accommodation.cost +
          state.attractions.cost +
          state.food.cost +
          state.shopping.budget,
      }
    case "RESET_TRIP":
      return initialState
    case "LOAD_TRIP":
      return action.payload
    default:
      return state
  }
}

const TripContext = createContext<{
  state: TripState
  dispatch: React.Dispatch<TripAction>
} | null>(null)

export function TripProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(tripReducer, initialState)

  return <TripContext.Provider value={{ state, dispatch }}>{children}</TripContext.Provider>
}

export function useTrip() {
  const context = useContext(TripContext)
  if (!context) {
    throw new Error("useTrip must be used within a TripProvider")
  }
  return context
}
