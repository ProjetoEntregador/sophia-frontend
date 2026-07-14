"use client";

import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";

type LocationPickerProps = {
  lat: number;
  lng: number;
  onChange: (lat: number, lng: number) => void;
};

export function LocationPicker({ lat, lng, onChange }: LocationPickerProps) {
  return (
    <MapContainer
      center={[lat, lng]}
      zoom={20}
      style={{ height: "400px", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <LocationMarker lat={lat} lng={lng} onChange={onChange} />
    </MapContainer>
  );
}

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

type LocationMarkerProps = {
  lat: number;
  lng: number;
  onChange: (lat: number, lng: number) => void;
};

function LocationMarker({ lat, lng, onChange }: LocationMarkerProps) {
  useMapEvents({
    click(e) {
      onChange(e.latlng.lat, e.latlng.lng);
    },
  });

  return (
    <Marker
      position={[lat, lng]}
      icon={markerIcon}
      draggable
      eventHandlers={{
        dragend: (e) => {
          const marker = e.target;
          const pos = marker.getLatLng();
          onChange(pos.lat, pos.lng);
        },
      }}
    />
  );
}
