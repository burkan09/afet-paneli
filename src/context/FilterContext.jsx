import { createContext, useContext, useReducer } from "react";

const initialState = {
  range: "day",
  minMag: 0,
  search: "",
  autoRefresh: true,
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_RANGE":
      return { ...state, range: action.value };
    case "SET_MIN_MAG":
      return { ...state, minMag: action.value };
    case "SET_SEARCH":
      return { ...state, search: action.value };
    case "TOGGLE_AUTO_REFRESH":
      return { ...state, autoRefresh: !state.autoRefresh };
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