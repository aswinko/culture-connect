'use client';
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';
import { useEffect, useState } from 'react';

const containerStyle = {
  width: '100%',
  height: '400px',
};

// ✅ Define props type
type MapPinProps = {
  onLocationSelect?: (location: { lat: number; lng: number }) => void;
};

export default function MapPin({ onLocationSelect }: MapPinProps) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY!,
  });

  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const loc = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setLocation(loc);
          onLocationSelect?.(loc); // Call callback on initial location too
        },
        (err) => {
          console.error('Geolocation error:', err);
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  }, []);

  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const loc = {
        lat: e.latLng.lat(),
        lng: e.latLng.lng(),
      };
      setLocation(loc);
      onLocationSelect?.(loc);
    }
  };

  if (!isLoaded) return <p>Loading map...</p>;
  if (!location) return <p>Fetching your location...</p>;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={location}
      zoom={15}
      onClick={handleMapClick}
    >
      <Marker
        position={location}
        draggable
        onDragEnd={(e) => {
          const newLoc = {
            lat: e.latLng?.lat() || location.lat,
            lng: e.latLng?.lng() || location.lng,
          };
          setLocation(newLoc);
          onLocationSelect?.(newLoc);
        }}
      />
    </GoogleMap>
  );
}