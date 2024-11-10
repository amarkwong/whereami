// app/page.tsx
import React from 'react';
import DynamicStreetView from './components/DynamicStreetView';

const HomePage = () => {
  const latitude = 37.7749; // Example coordinates
  const longitude = -122.4194;

  return (
    <div>
      <h1>Welcome to WhereAmI!</h1>
      <DynamicStreetView lat={latitude} lng={longitude} />
    </div>
  );
};

export default HomePage;