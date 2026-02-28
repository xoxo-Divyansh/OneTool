"use client";

import { createContext } from "react";

const AppContext = createContext({
  state: {
    user: null,
    isAuthenticated: false,
    toolsHistory: [],
    theme: "dark",
  },
  dispatch: () => null,
});

export default AppContext;