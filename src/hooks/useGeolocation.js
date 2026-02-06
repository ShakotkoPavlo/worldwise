import { useState } from "react";

export function useGeolocation(defaultPosition = null) {
  const [position, setPosition] = useState(defaultPosition);
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);

  function getPosition() {
    if (!navigator.geolocation) {
      return setError("Geolocation is not supported by your browser");
    }

    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setPosition({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLoading(false);
      },
      (error) => {
        setError(error.message);
        setLoading(false);
      },
    );
  }

  return { position, error, loading, getPosition };
}
