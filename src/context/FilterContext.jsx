import { createContext, useContext, useReducer } from "react";
import { FILTERABLE_TYPES } from "../lib/eventTypes";

const initialState = {
  range: "day",
  minMag: 0,
  showPlates: false,
  minImpact: 0,
  search: "",
  types: [...FILTERABLE_TYPES],
  autoRefresh: true,
  showHistory: true,
  theme: "day",
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_RANGE":
      return { ...state, range: action.value };
    case "SET_MIN_MAG":
      return { ...state, minMag: action.value };
    case "SET_MIN_IMPACT":
      return { ...state, minImpact: action.value };
    case "SET_SEARCH":
      return { ...state, search: action.value };
    case "TOGGLE_TYPE": {
      const has = state.types.includes(action.value);
      return {
        ...state,
        types: has
          ? state.types.filter((t) => t !== action.value)
          : [...state.types, action.value],
      };
    }
    case "SET_ALL_TYPES":
      return { ...state, types: action.value ? [...FILTERABLE_TYPES] : [] };
    case "TOGGLE_AUTO_REFRESH":
      return { ...state, autoRefresh: !state.autoRefresh };
    case "TOGGLE_HISTORY":
      return { ...state, showHistory: !state.showHistory };
    case "SET_THEME":
      return { ...state, theme: action.value };
    case "TOGGLE_PLATES":
      return { ...state, showPlates: !state.showPlates };
    case "RESET":
      return initialState;
    default:
      throw new Error(`Bilinmeyen eylem: ${action.type}`);
  }
}

const FilterContext = createContext(null);

export function FilterProvider({ children }) {
  const [filters, dispatch] = useReducer(reducer, initialState);

  return (
    <FilterContext.Provider value={{ filters, dispatch }}>
      {children}
    </FilterContext.Provider>
  );
}

export function useFilters() {
  const ctx = useContext(FilterContext);
  if (!ctx) throw new Error("useFilters, FilterProvider içinde kullanılmalı");
  return ctx;
}