// app/components/DynamicStreetView.tsx
'use client';

import dynamic from 'next/dynamic';
import React from 'react';

interface StreetViewProps {
  lat: number;
  lng: number;
}

const StreetView = dynamic(() => import('../game/[gameId]/components/StreetView'), {
  ssr: false,
});

const DynamicStreetView: React.FC<StreetViewProps> = ({ lat, lng }) => {
  return <StreetView location={{ lat, lng }} />;
};

export default DynamicStreetView;