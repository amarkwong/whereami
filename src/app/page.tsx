// app/page.tsx
import dynamic from 'next/dynamic';
import React from 'react';

const StreetView = dynamic(() => import('./components/StreetView'), {
  ssr: false,
});

const HomePage = () => {
  const latitude = 37.7749; // Example coordinates
  const longitude = -122.4194;

  return (
    <div>
      <StreetView lat={latitude} lng={longitude} />
    </div>
  );
};

export default HomePage;