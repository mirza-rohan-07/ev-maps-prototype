import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useCarData } from '../contexts/CarDataContext';
import { MapPin, Navigation, Zap, Settings, Play, X, Target, Clock, Battery } from 'lucide-react';

const RouteContainer = styled.div`
  padding: 20px;
  height: 100%;
  overflow-y: auto;

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
`;

const HeaderTitle = styled.h2`
  font-size: 24px;
  font-weight: 600;
  margin: 0;
  background: linear-gradient(135deg, #3e6ae1 0%, #3451b2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  @media (max-width: 768px) {
    font-size: 20px;
  }
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
`;

const InputGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Input = styled.input`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: #fff;
  padding: 12px 16px;
  font-size: 14px;
  flex: 1;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #3e6ae1;
    box-shadow: 0 0 0 2px rgba(62, 106, 225, 0.2);
  }
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }

  @media (max-width: 768px) {
    padding: 16px;
    font-size: 16px;
    border-radius: 12px;
  }
`;

const InputIcon = styled.div`
  width: 40px;
  height: 40px;
  background: rgba(62, 106, 225, 0.2);
  border: 1px solid rgba(62, 106, 225, 0.3);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #3e6ae1;

  @media (max-width: 768px) {
    width: 48px;
    height: 48px;
    border-radius: 12px;
  }
`;

const PlanButton = styled.button`
  background: linear-gradient(135deg, #3e6ae1 0%, #3451b2 100%);
  border: none;
  border-radius: 8px;
  color: #fff;
  padding: 16px 24px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
  &:hover {
    background: linear-gradient(135deg, #4a7cff 0%, #3e6ae1 100%);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(62, 106, 225, 0.3);
  }
  
  &:disabled {
    background: rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.5);
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }

  @media (max-width: 768px) {
    padding: 20px 24px;
    font-size: 18px;
    border-radius: 12px;
  }
`;

// Add missing styled components
const RouteCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 20px;
  margin-top: 20px;
  backdrop-filter: blur(20px);

  @media (max-width: 768px) {
    padding: 16px;
    margin-top: 16px;
  }
`;

const RouteHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const RouteTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  color: #fff;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const RouteStats = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
`;

const StatItem = styled.div`
  text-align: center;
  padding: 16px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);

  @media (max-width: 768px) {
    padding: 12px;
  }
`;

const StatValue = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: #3e6ae1;
  margin-bottom: 4px;

  @media (max-width: 768px) {
    font-size: 20px;
  }
`;

const StatLabel = styled.div`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const ChargingStops = styled.div`
  margin-bottom: 20px;
`;

const StopItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  margin-bottom: 8px;

  @media (max-width: 768px) {
    padding: 16px;
    border-radius: 12px;
  }
`;

const StopIcon = styled.div`
  width: 32px;
  height: 32px;
  background: ${props => props.type === 'charging' ? 'rgba(62, 106, 225, 0.2)' : 'rgba(76, 222, 128, 0.2)'};
  border: 1px solid ${props => props.type === 'charging' ? 'rgba(62, 106, 225, 0.3)' : 'rgba(76, 222, 128, 0.3)'};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.type === 'charging' ? '#3e6ae1' : '#4ade80'};
`;

const StopInfo = styled.div`
  flex: 1;
`;

const StopName = styled.div`
  font-weight: 600;
  color: #fff;
  margin-bottom: 2px;
`;

const StopDetails = styled.div`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
`;

const RouteActions = styled.div`
  display: flex;
  gap: 12px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 8px;
  }
`;

const ActionButton = styled.button`
  background: ${props => props.primary ? 'linear-gradient(135deg, #3e6ae1 0%, #3451b2 100%)' : 'rgba(255, 255, 255, 0.1)'};
  border: 1px solid ${props => props.primary ? 'rgba(62, 106, 225, 0.3)' : 'rgba(255, 255, 255, 0.2)'};
  border-radius: 8px;
  color: #fff;
  padding: 12px 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;
  flex: 1;
  justify-content: center;
  
  &:hover {
    background: ${props => props.primary ? 'linear-gradient(135deg, #4a7cff 0%, #3e6ae1 100%)' : 'rgba(255, 255, 255, 0.2)'};
    transform: translateY(-1px);
  }

  @media (max-width: 768px) {
    padding: 16px 20px;
    font-size: 16px;
    border-radius: 12px;
  }
`;

const OptimizationSettings = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  backdrop-filter: blur(20px);

  @media (max-width: 768px) {
    padding: 16px;
    margin-bottom: 16px;
  }
`;

const SettingsHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  color: #fff;
  font-weight: 600;
`;

const SettingsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
`;

const SettingItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const SettingLabel = styled.label`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const SettingInput = styled.input`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  color: #fff;
  padding: 8px 12px;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: #3e6ae1;
  }

  @media (max-width: 768px) {
    padding: 12px;
    font-size: 16px;
    border-radius: 8px;
  }
`;

// Add navigation state and notification
const NavigationNotification = styled(motion.div)`
  position: fixed;
  top: 20px;
  right: 20px;
  background: linear-gradient(135deg, #3e6ae1 0%, #3451b2 100%);
  color: #fff;
  padding: 16px 24px;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(62, 106, 225, 0.3);
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 600;

  @media (max-width: 768px) {
    top: 15px;
    left: 15px;
    right: 15px;
    padding: 20px;
    border-radius: 16px;
  }
`;

// Mock route data
const mockRoute = {
  id: 1,
  name: "London to Manchester",
  distance: 320,
  duration: 195,
  efficiency: 4.2,
  chargingStops: [
    {
      id: 1,
      name: "BP Pulse - Birmingham",
      type: "charging",
      distance: 180,
      duration: 25,
      power: 50,
      cost: "£12.50"
    },
    {
      id: 2,
      name: "Ionity - Manchester",
      type: "destination",
      distance: 320,
      duration: 0,
      power: 0,
      cost: "£0.00"
    }
  ],
  totalCost: "£12.50",
  carbonSaved: 45.2
};

const RoutePlanner = () => {
  const { carData, startNavigation, updateRoute } = useCarData();
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [isPlanning, setIsPlanning] = useState(false);
  const [route, setRoute] = useState(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const [showNavigationNotification, setShowNavigationNotification] = useState(false);
  const [settings, setSettings] = useState({
    minBattery: 20,
    maxChargingTime: 30,
    preferFastCharging: true,
    avoidTolls: false
  });

  const handlePlanRoute = async () => {
    if (!origin || !destination) return;
    
    setIsPlanning(true);
    
    // Simulate AI route planning
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setRoute(mockRoute);
    updateRoute(mockRoute);
    setIsPlanning(false);
  };

  const handleStartNavigation = () => {
    console.log('Starting navigation...');
    setIsNavigating(true);
    setShowNavigationNotification(true);
    
    // Start navigation in the context
    startNavigation(route);
    
    // Show navigation notification
    setTimeout(() => {
      setShowNavigationNotification(false);
    }, 5000);
    
    // Here you would typically:
    // 1. Switch to navigation view
    // 2. Start turn-by-turn directions
    // 3. Begin real-time route tracking
    // 4. Show navigation overlay on map
  };

  const handleSaveRoute = () => {
    console.log('Saving route...');
    // Add route saving functionality here
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <RouteContainer>
      <Header>
        <HeaderTitle>Route Planner</HeaderTitle>
      </Header>

      <InputContainer>
        <InputGroup>
          <InputIcon>
            <MapPin size={20} />
          </InputIcon>
          <Input
            type="text"
            placeholder="Enter origin"
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
          />
        </InputGroup>
        
        <InputGroup>
          <InputIcon>
            <Navigation size={20} />
          </InputIcon>
          <Input
            type="text"
            placeholder="Enter destination"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
          />
        </InputGroup>
      </InputContainer>

      <OptimizationSettings>
        <SettingsHeader>
          <Settings size={16} />
          AI Optimization Settings
        </SettingsHeader>
        <SettingsGrid>
          <SettingItem>
            <SettingLabel>Minimum Battery %</SettingLabel>
            <SettingInput
              type="number"
              min="10"
              max="50"
              value={settings.minBattery}
              onChange={(e) => setSettings({...settings, minBattery: parseInt(e.target.value)})}
            />
          </SettingItem>
          <SettingItem>
            <SettingLabel>Max Charging Time (min)</SettingLabel>
            <SettingInput
              type="number"
              min="10"
              max="60"
              value={settings.maxChargingTime}
              onChange={(e) => setSettings({...settings, maxChargingTime: parseInt(e.target.value)})}
            />
          </SettingItem>
        </SettingsGrid>
      </OptimizationSettings>

      <PlanButton 
        onClick={handlePlanRoute}
        disabled={!origin || !destination || isPlanning}
      >
        {isPlanning ? (
          <>
            <div style={{width: '16px', height: '16px', border: '2px solid transparent', borderTop: '2px solid #fff', borderRadius: '50%', animation: 'spin 1s linear infinite'}} />
            Planning Route...
          </>
        ) : (
          <>
            <Navigation size={16} />
            Plan Route
          </>
        )}
      </PlanButton>

      <AnimatePresence>
        {route && (
          <RouteCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <RouteHeader>
              <RouteTitle>
                <Navigation size={20} />
                {route.name}
              </RouteTitle>
            </RouteHeader>

            <RouteStats>
              <StatItem>
                <StatValue>{route.distance}</StatValue>
                <StatLabel>km</StatLabel>
              </StatItem>
              <StatItem>
                <StatValue>{formatDuration(route.duration)}</StatValue>
                <StatLabel>Duration</StatLabel>
              </StatItem>
              <StatItem>
                <StatValue>{route.efficiency}</StatValue>
                <StatLabel>km/kWh</StatLabel>
              </StatItem>
            </RouteStats>

            <ChargingStops>
              <h4 style={{ color: '#fff', marginBottom: '12px', fontSize: '14px' }}>
                Charging Stops
              </h4>
              {route.chargingStops.map((stop, index) => (
                <StopItem key={stop.id}>
                  <StopIcon type={stop.type}>
                    {stop.type === 'charging' ? <Zap size={16} /> : <MapPin size={16} />}
                  </StopIcon>
                  <StopInfo>
                    <StopName>{stop.name}</StopName>
                    <StopDetails>
                      {stop.distance} km • {stop.duration > 0 ? `${stop.duration} min` : 'Destination'} • {stop.cost}
                    </StopDetails>
                  </StopInfo>
                </StopItem>
              ))}
            </ChargingStops>

            <RouteActions>
              <ActionButton onClick={handleSaveRoute}>
                <Settings size={16} />
                Save Route
              </ActionButton>
              <ActionButton primary onClick={handleStartNavigation}>
                <Play size={16} />
                {isNavigating ? 'Navigation Active' : 'Start Navigation'}
              </ActionButton>
            </RouteActions>
          </RouteCard>
        )}
      </AnimatePresence>

      {/* Navigation Notification */}
      <AnimatePresence>
        {showNavigationNotification && (
          <NavigationNotification
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            transition={{ duration: 0.3 }}
          >
            <Navigation size={20} />
            Navigation Started! Route to {destination || 'destination'} active.
          </NavigationNotification>
        )}
      </AnimatePresence>
    </RouteContainer>
  );
};

export default RoutePlanner; 