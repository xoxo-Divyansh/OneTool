"use client";

import { useReducer, useMemo } from "react";
import AppContext from "./app.context";

const initialState = {
  user: null,
  isAuthenticated: false,
  toolsHistory: [],
  theme: "dark",
};

function reducer(state, action) {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
      };

    case "LOGOUT":
      return initialState;

    case "ADD_TOOL_HISTORY":
      return {
        ...state,
        toolsHistory: [action.payload, ...state.toolsHistory],
      };

    case "SET_THEME":
      return {
        ...state,
        theme: action.payload,
      };

    default:
      return state;
  }
}

export default function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // 🔥 Memoize context value for performance
  const value = useMemo(() => ({ state, dispatch }), [state]);

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}