import { useEffect, useState } from 'react';

/**
 * Reads the browser's current position once on mount.
 *
 * `denied` covers every way we can fail to get a fix — permission refused,
 * timeout, or no geolocation API at all — because the UI treats them the same:
 * ask the user to enable location and reload.
 *
 * @returns {{ coords: { lat: number, lng: number } | null, denied: boolean }}
 */
export function useGeolocation() {
  const [coords, setCoords] = useState(null);
  const [denied, setDenied] = useState(false);

  useEffect(() => {
    if (!navigator.geolocation) {
      setDenied(true);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({ lat: position.coords.latitude, lng: position.coords.longitude });
        setDenied(false);
      },
      () => setDenied(true),
    );
  }, []);

  return { coords, denied };
}

export default useGeolocation;
