import React, { createContext, useContext, useState, useEffect } from 'react';

const CarDataContext = createContext();

export const useCarData = () => {
  const context = useContext(CarDataContext);
  if (!context) {
    throw new Error('useCarData must be used within a CarDataProvider');
  }
  return context;
};

export const CarDataProvider = ({ children }) => {
  const [carData, setCarData] = useState({
    currentBattery: 85,
    currentRange: 245,
    efficiency: 4.2,
    isConnected: true,
    location: {
      lat: 51.5074,
      lng: -0.1278,
      heading: 0,
      speed: 0
    },
    tirePressure: {
      frontLeft: 2.4,
      frontRight: 2.4,
      rearLeft: 2.3,
      rearRight: 2.3
    },
    temperature: {
      cabin: 22,
      battery: 18,
      motor: 45
    }
  });

  // Add route and navigation state
  const [currentRoute, setCurrentRoute] = useState(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const [navigationRoute, setNavigationRoute] = useState(null);

  // Simulate real-time car data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setCarData(prevData => ({
        ...prevData,
        currentBattery: Math.max(10, prevData.currentBattery - Math.random() * 0.1),
        currentRange: Math.max(50, prevData.currentRange - Math.random() * 0.5),
        efficiency: 4.2 + (Math.random() - 0.5) * 0.2,
        location: {
          ...prevData.location,
          heading: (prevData.location.heading + Math.random() * 2) % 360,
          speed: Math.max(0, prevData.location.speed + (Math.random() - 0.5) * 2)
        }
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const updateRoute = (route) => {
    setCurrentRoute(route);
  };

  const startNavigation = (route) => {
    setNavigationRoute(route);
    setIsNavigating(true);
  };

  const stopNavigation = () => {
    setIsNavigating(false);
    setNavigationRoute(null);
  };

  const value = {
    carData,
    setCarData,
    currentRoute,
    updateRoute,
    isNavigating,
    startNavigation,
    stopNavigation,
    navigationRoute
  };

  return (
    <CarDataContext.Provider value={value}>
      {children}
    </CarDataContext.Provider>
  );
}; 