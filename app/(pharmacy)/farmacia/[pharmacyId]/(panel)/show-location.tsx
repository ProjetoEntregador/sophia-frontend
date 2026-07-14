"use client";

import dynamic from "next/dynamic";

const LocationPicker = dynamic(
  () => import("@/components/LocationPicker").then((res) => res.LocationPicker),
  {
    ssr: false,
  },
);

type ShowLocationProps = {
  latitude: number;
  longitude: number;
};

export function ShowLocation({ latitude, longitude }: ShowLocationProps) {
  return <LocationPicker lat={latitude} lng={longitude} onChange={() => {}} />;
}
