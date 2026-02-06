import { createContext, useContext, useEffect, useState } from "react";

const CitiesContext = createContext();

function CitiesProvider({ children }) {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentCity, setCurrentCity] = useState({});

  useEffect(() => {
    async function fetchCities() {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:8000/cities");
        const data = await response.json();

        setCities(data);
      } catch (error) {
        console.error("Error fetching cities:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCities();
  }, []);

  async function getCityById(id) {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8000/cities/${id}`);
      const data = await response.json();

      setCurrentCity(data);
    } catch (error) {
      console.error("Error fetching cities:", error);
    } finally {
      setLoading(false);
    }
  }

  async function createCity(newCity) {
    setLoading(true);
    try {
      setLoading(true);

      const res = await fetch("http://localhost:8000/cities", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCity),
      });

      const data = await res.json();

      setCities((cities) => [...cities, data]);
    } catch (error) {
      console.error("Error creating city:", error);
    } finally {
      setLoading(false);
    }
  }

  function deleteCity(id) {
    setCities((cities) => cities.filter((city) => city.id !== id));
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        loading,
        currentCity,
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
