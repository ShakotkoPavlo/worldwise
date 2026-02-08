import { createContext, useContext, useEffect, useReducer } from "react";

const CitiesContext = createContext();

const initialState = {
  cities: [],
  loading: false,
  currentCity: {},
  error: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return { ...state, loading: action.payload };
    case "cities/loaded":
      return { ...state, loading: false, cities: action.payload };
    case "cities/created":
      return {
        ...state,
        loading: false,
        cities: [...state.cities, action.payload],
        currentCity: action.payload,
      };
    case "cities/deleted":
      return {
        ...state,
        loading: false,
        cities: state.cities.filter((city) => city.id !== action.payload),
        currentCity: {},
      };
    case "cities/loadedOne":
      return { ...state, loading: false, currentCity: action.payload };
    case "error":
      return { ...state, loading: false, error: action.payload };
    default:
      throw new Error(`Unknown action type: ${action.type}`);
  }
}

function CitiesProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    async function fetchCities() {
      dispatch({ type: "loading", payload: true });
      try {
        const response = await fetch("http://localhost:8000/cities");
        const data = await response.json();

        dispatch({ type: "cities/loaded", payload: data });
      } catch (error) {
        dispatch({ type: "error", payload: error.message });
      } finally {
        dispatch({ type: "loading", payload: false });
      }
    }

    fetchCities();
  }, []);

  async function getCityById(id) {
    if (Number(id) === state.currentCity.id) {
      return;
    }

    dispatch({ type: "loading", payload: true });

    try {
      const response = await fetch(`http://localhost:8000/cities/${id}`);
      const data = await response.json();

      dispatch({ type: "cities/loadedOne", payload: data });
    } catch (error) {
      dispatch({ type: "error", payload: error.message });
    }
  }

  async function createCity(newCity) {
    dispatch({ type: "loading", payload: true });

    try {
      dispatch({ type: "loading", payload: true });

      const res = await fetch("http://localhost:8000/cities", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCity),
      });

      const data = await res.json();

      dispatch({ type: "cities/created", payload: data });
    } catch (error) {
      dispatch({ type: "error", payload: error.message });
    }
  }

  async function deleteCity(id) {
    dispatch({ type: "loading", payload: true });

    try {
      const res = await fetch(`http://localhost:8000/cities/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete city");
      }

      dispatch({ type: "cities/deleted", payload: id });
    } catch (error) {
      dispatch({ type: "error", payload: error.message });
    }
  }

  return (
    <CitiesContext.Provider
      value={{
        cities: state.cities,
        loading: state.loading,
        currentCity: state.currentCity,
        getCityById,
        createCity,
        deleteCity,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

function useCities() {
  const context = useContext(CitiesContext);

  if (context === undefined) {
    throw new Error("useCities must be used within a CitiesProvider");
  }

  return context;
}

export { CitiesProvider, useCities };
