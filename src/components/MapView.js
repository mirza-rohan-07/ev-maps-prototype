import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { MapContainer, TileLayer, Marker, Popup, Circle, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { useCarData } from '../contexts/CarDataContext';
import { Zap, MapPin, Car, Navigation, X, Menu, Target } from 'lucide-react';

const MapWrapper = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`;

const MapControls = styled.div`
  position: absolute;
  top: 80px;
  right: 20px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 10px;

  @media (max-width: 768px) {
    top: 70px;
    right: 15px;
    gap: 8px;
  }
`;

const ControlButton = styled.button`
  background: rgba(0, 0, 0, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: #fff;
  padding: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  
  &:hover {
    background: rgba(0, 0, 0, 0.9);
    border-color: rgba(255, 255, 255, 0.3);
  }

  @media (max-width: 768px) {
    padding: 16px;
    border-radius: 12px;
    min-width: 48px;
    min-height: 48px;
  }
`;

const MobileMapControls = styled.div`
  position: absolute;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
  display: none;
  flex-direction: column;
  gap: 12px;

  @media (max-width: 768px) {
    display: flex;
  }
`;

const MobileControlButton = styled.button`
  background: rgba(0, 0, 0, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  color: #fff;
  width: 56px;
  height: 56px;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(20px);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  
  &:hover {
    background: rgba(0, 0, 0, 0.95);
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const CarInfoPanel = styled.div`
  position: absolute;
  bottom: 20px;
  left: 20px;
  background: rgba(0, 0, 0, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 20px;
  backdrop-filter: blur(20px);
  z-index: 1000;
  min-width: 300px;

  @media (max-width: 768px) {
    bottom: 15px;
    left: 15px;
    right: 15px;
    min-width: auto;
    padding: 16px;
  }
`;

const CarInfoHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
`;

const CarIcon = styled.div`
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #3e6ae1 0%, #3451b2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
`;

const CarDetails = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 8px;
  }
`;

const DetailItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const DetailLabel = styled.span`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const DetailValue = styled.span`
  font-size: 16px;
  font-weight: 600;
  color: #fff;
`;

const BatteryIndicator = styled.div`
  width: 100%;
  height: 6px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
  overflow: hidden;
  margin-top: 4px;
`;

const BatteryLevel = styled.div`
  height: 100%;
  background: linear-gradient(90deg, #ef4444 0%, #fbbf24 50%, #4ade80 100%);
  width: ${props => props.level}%;
  transition: width 0.3s ease;
`;

const NavigationPanel = styled.div`
  position: absolute;
  top: 80px;
  left: 20px;
  background: rgba(0, 0, 0, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 20px;
  backdrop-filter: blur(20px);
  z-index: 1000;
  max-width: 350px;
  display: ${props => props.show ? 'block' : 'none'};

  @media (max-width: 768px) {
    top: 70px;
    left: 15px;
    right: 15px;
    max-width: none;
    padding: 16px;
  }
`;

const NavigationHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`;

const NavigationTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  color: #fff;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.3s ease;

  &:hover {
    color: #fff;
    background: rgba(255, 255, 255, 0.1);
  }
`;

const NavigationInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const InfoLabel = styled.span`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
`;

const InfoValue = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: #fff;
`;

const StopNavigationButton = styled.button`
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  border: none;
  border-radius: 8px;
  color: #fff;
  padding: 12px 20px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  margin-top: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:hover {
    background: linear-gradient(135deg, #f87171 0%, #ef4444 100%);
    transform: translateY(-1px);
  }

  @media (max-width: 768px) {
    padding: 16px 20px;
    font-size: 16px;
  }
`;

// Custom car icon
const carIcon = L.divIcon({
  html: `
    <div style="
      width: 24px;
      height: 24px;
      background: linear-gradient(135deg, #3e6ae1 0%, #3451b2 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 12px;
      border: 2px solid white;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    ">
      🚗
    </div>
  `,
  className: 'custom-car-icon',
  iconSize: [24, 24],
  iconAnchor: [12, 12]
});

// Custom charging station icon
const chargingIcon = L.divIcon({
  html: `
    <div style="
      width: 20px;
      height: 20px;
      background: #fbbf24;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 10px;
      border: 2px solid white;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    ">
      ⚡
    </div>
  `,
  className: 'custom-charging-icon',
  iconSize: [20, 20],
  iconAnchor: [10, 10]
});

// Mock charging stations data
const mockChargingStations = [
  {
    id: 1,
    name: "Tesla Supercharger",
    lat: 51.5074,
    lng: -0.1278,
    type: "ultra-fast",
    power: 250,
    available: true,
    price: "£0.35/kWh"
  },
  {
    id: 2,
    name: "BP Pulse",
    lat: 51.5080,
    lng: -0.1280,
    type: "fast",
    power: 50,
    available: true,
    price: "£0.45/kWh"
  },
  {
    id: 3,
    name: "Ionity",
    lat: 51.5068,
    lng: -0.1275,
    type: "ultra-fast",
    power: 350,
    available: true,
    price: "£0.45/kWh"
  }
];

// Mock route data for demonstration
const mockRoute = [
  [51.5074, -0.1278], // Start
  [51.5080, -0.1280], // Waypoint 1
  [51.5068, -0.1275], // Waypoint 2
  [51.5090, -0.1290]  // Destination
];

const MapView = () => {
  const { carData, isNavigating, navigationRoute, stopNavigation } = useCarData();
  const mapRef = useRef();
  const [showChargingStations, setShowChargingStations] = useState(true);
  const [selectedStation, setSelectedStation] = useState(null);
  const [showNavigationPanel, setShowNavigationPanel] = useState(false);

  useEffect(() => {
    if (mapRef.current && carData.location) {
      mapRef.current.setView([carData.location.lat, carData.location.lng], 13);
    }
  }, [carData.location]);

  useEffect(() => {
    if (isNavigating && navigationRoute) {
      setShowNavigationPanel(true);
    } else {
      setShowNavigationPanel(false);
    }
  }, [isNavigating, navigationRoute]);

  const handleStationClick = (station) => {
    setSelectedStation(station);
  };

  const getStationColor = (type) => {
    switch (type) {
      case 'ultra-fast': return '#ef4444';
      case 'fast': return '#fbbf24';
      case 'standard': return '#4ade80';
      default: return '#6b7280';
    }
  };

  const handleStopNavigation = () => {
    stopNavigation();
    setShowNavigationPanel(false);
  };

  const centerOnCar = () => {
    if (mapRef.current && carData.location) {
      mapRef.current.setView([carData.location.lat, carData.location.lng], 15);
    }
  };

  return (
    <MapWrapper>
      <MapContainer
        ref={mapRef}
        center={[carData.location.lat, carData.location.lng]}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
        doubleClickZoom={false}
        scrollWheelZoom={true}
        dragging={true}
        touchZoom={true}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        
        {/* Car location marker */}
        <Marker
          position={[carData.location.lat, carData.location.lng]}
          icon={carIcon}
          rotationAngle={carData.location.heading}
        >
          <Popup>
            <div style={{ color: '#000' }}>
              <strong>MG4</strong><br />
              Battery: {carData.currentBattery.toFixed(1)}%<br />
              Range: {carData.currentRange.toFixed(0)} km<br />
              Speed: {carData.location.speed.toFixed(0)} km/h
            </div>
          </Popup>
        </Marker>

        {/* Navigation route */}
        {isNavigating && navigationRoute && (
          <Polyline
            positions={mockRoute}
            pathOptions={{
              color: '#3e6ae1',
              weight: 6,
              opacity: 0.8
            }}
          />
        )}

        {/* Charging stations */}
        {showChargingStations && mockChargingStations.map((station) => (
          <Marker
            key={station.id}
            position={[station.lat, station.lng]}
            icon={chargingIcon}
            eventHandlers={{
              click: () => handleStationClick(station)
            }}
          >
            <Popup>
              <div style={{ color: '#000' }}>
                <strong>{station.name}</strong><br />
                Power: {station.power} kW<br />
                Status: {station.available ? 'Available' : 'Occupied'}<br />
                Price: {station.price}
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Range circle */}
        <Circle
          center={[carData.location.lat, carData.location.lng]}
          radius={carData.currentRange * 1000} // Convert km to meters
          pathOptions={{
            color: carData.currentBattery > 20 ? '#4ade80' : '#ef4444',
            fillColor: carData.currentBattery > 20 ? '#4ade80' : '#ef4444',
            fillOpacity: 0.1,
            weight: 2
          }}
        />
      </MapContainer>

      {/* Desktop controls */}
      <MapControls>
        <ControlButton onClick={() => setShowChargingStations(!showChargingStations)}>
          <Zap size={16} />
        </ControlButton>
      </MapControls>

      {/* Mobile controls */}
      <MobileMapControls>
        <MobileControlButton onClick={centerOnCar}>
          <Target size={20} />
        </MobileControlButton>
        <MobileControlButton onClick={() => setShowChargingStations(!showChargingStations)}>
          <Zap size={20} />
        </MobileControlButton>
      </MobileMapControls>

      {/* Navigation Panel */}
      {showNavigationPanel && (
        <NavigationPanel show={showNavigationPanel}>
          <NavigationHeader>
            <NavigationTitle>
              <Navigation size={20} />
              Active Navigation
            </NavigationTitle>
            <CloseButton onClick={() => setShowNavigationPanel(false)}>
              <X size={20} />
            </CloseButton>
          </NavigationHeader>
          
          <NavigationInfo>
            <InfoRow>
              <InfoLabel>Destination</InfoLabel>
              <InfoValue>Manchester</InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>Distance</InfoLabel>
              <InfoValue>320 km</InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>ETA</InfoLabel>
              <InfoValue>3h 15m</InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>Next Turn</InfoLabel>
              <InfoValue>Right in 200m</InfoValue>
            </InfoRow>
          </NavigationInfo>
          
          <StopNavigationButton onClick={handleStopNavigation}>
            <X size={16} />
            Stop Navigation
          </StopNavigationButton>
        </NavigationPanel>
      )}

      <CarInfoPanel>
        <CarInfoHeader>
          <CarIcon>
            <Car size={20} />
          </CarIcon>
          <div>
            <h3 style={{ margin: 0, fontSize: '18px' }}>MG4</h3>
            <p style={{ margin: 0, fontSize: '14px', color: 'rgba(255,255,255,0.6)' }}>
              {carData.isConnected ? 'Connected' : 'Disconnected'}
            </p>
          </div>
        </CarInfoHeader>
        
        <CarDetails>
          <DetailItem>
            <DetailLabel>Battery</DetailLabel>
            <DetailValue>{carData.currentBattery.toFixed(1)}%</DetailValue>
            <BatteryIndicator>
              <BatteryLevel level={carData.currentBattery} />
            </BatteryIndicator>
          </DetailItem>
          
          <DetailItem>
            <DetailLabel>Range</DetailLabel>
            <DetailValue>{carData.currentRange.toFixed(0)} km</DetailValue>
          </DetailItem>
          
          <DetailItem>
            <DetailLabel>Efficiency</DetailLabel>
            <DetailValue>{carData.efficiency.toFixed(1)} km/kWh</DetailValue>
          </DetailItem>
          
          <DetailItem>
            <DetailLabel>Speed</DetailLabel>
            <DetailValue>{carData.location.speed.toFixed(0)} km/h</DetailValue>
          </DetailItem>
        </CarDetails>
      </CarInfoPanel>
    </MapWrapper>
  );
};

export default MapView; 