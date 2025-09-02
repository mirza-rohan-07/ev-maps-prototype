import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useCarData } from '../contexts/CarDataContext';
import { Zap, MapPin, Clock, DollarSign, Filter, Star, Navigation } from 'lucide-react';

const ChargingContainer = styled.div`
  padding: 20px;
  height: 100%;
  overflow-y: auto;
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
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  flex-wrap: wrap;
`;

const FilterButton = styled.button`
  background: ${props => props.active ? 'rgba(62, 106, 225, 0.2)' : 'rgba(255, 255, 255, 0.1)'};
  border: 1px solid ${props => props.active ? 'rgba(62, 106, 225, 0.3)' : 'rgba(255, 255, 255, 0.2)'};
  border-radius: 8px;
  color: ${props => props.active ? '#fff' : 'rgba(255, 255, 255, 0.7)'};
  padding: 8px 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
  font-weight: 500;
  
  &:hover {
    background: ${props => props.active ? 'rgba(62, 106, 225, 0.3)' : 'rgba(255, 255, 255, 0.2)'};
    border-color: ${props => props.active ? 'rgba(62, 106, 225, 0.4)' : 'rgba(255, 255, 255, 0.3)'};
    color: #fff;
  }
`;

const StationCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 16px;
  backdrop-filter: blur(20px);
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
  }
`;

const StationHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 12px;
`;

const StationInfo = styled.div`
  flex: 1;
`;

const StationName = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #fff;
  margin: 0 0 4px 0;
`;

const StationLocation = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
`;

const StationStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 500;
  padding: 4px 8px;
  border-radius: 6px;
  background: ${props => props.available ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)'};
  color: ${props => props.available ? '#4ade80' : '#ef4444'};
  border: 1px solid ${props => props.available ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)'};
`;

const StationDetails = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 16px;
`;

const DetailItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
`;

const DetailValue = styled.span`
  color: #fff;
  font-weight: 600;
`;

const StationActions = styled.div`
  display: flex;
  gap: 12px;
`;

const ActionButton = styled.button`
  background: ${props => props.primary ? 'linear-gradient(135deg, #3e6ae1 0%, #3451b2 100%)' : 'rgba(255, 255, 255, 0.1)'};
  border: 1px solid ${props => props.primary ? 'rgba(62, 106, 225, 0.3)' : 'rgba(255, 255, 255, 0.2)'};
  border-radius: 8px;
  color: #fff;
  padding: 10px 16px;
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
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: rgba(255, 255, 255, 0.6);
`;

const EmptyIcon = styled.div`
  width: 64px;
  height: 64px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
  color: rgba(255, 255, 255, 0.4);
`;

// Mock charging stations data
const mockStations = [
  {
    id: 1,
    name: "Tesla Supercharger - London Bridge",
    location: "London Bridge, SE1",
    distance: 0.8,
    type: "ultra-fast",
    power: 150,
    available: true,
    price: "£0.35/kWh",
    rating: 4.8,
    connectors: ["CCS", "CHAdeMO"],
    estimatedWait: 0,
    amenities: ["Coffee", "Restrooms", "WiFi"]
  },
  {
    id: 2,
    name: "BP Pulse - Canary Wharf",
    location: "Canary Wharf, E14",
    distance: 2.3,
    type: "fast",
    power: 50,
    available: true,
    price: "£0.40/kWh",
    rating: 4.2,
    connectors: ["CCS", "Type 2"],
    estimatedWait: 5,
    amenities: ["Coffee", "Restrooms"]
  },
  {
    id: 3,
    name: "Shell Recharge - Westminster",
    location: "Westminster, SW1",
    distance: 1.5,
    type: "standard",
    power: 22,
    available: false,
    price: "£0.30/kWh",
    rating: 3.9,
    connectors: ["Type 2"],
    estimatedWait: 15,
    amenities: ["Coffee"]
  },
  {
    id: 4,
    name: "Ionity - Stratford",
    location: "Stratford, E20",
    distance: 5.2,
    type: "ultra-fast",
    power: 350,
    available: true,
    price: "£0.45/kWh",
    rating: 4.6,
    connectors: ["CCS"],
    estimatedWait: 0,
    amenities: ["Coffee", "Restrooms", "WiFi", "Food"]
  },
  {
    id: 5,
    name: "Pod Point - Camden",
    location: "Camden, NW1",
    distance: 3.1,
    type: "standard",
    power: 7,
    available: true,
    price: "£0.25/kWh",
    rating: 4.0,
    connectors: ["Type 2"],
    estimatedWait: 0,
    amenities: []
  }
];

const ChargingStations = () => {
  const { carData } = useCarData();
  const [stations, setStations] = useState(mockStations);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('distance');

  const filters = [
    { id: 'all', label: 'All' },
    { id: 'available', label: 'Available' },
    { id: 'ultra-fast', label: 'Ultra Fast' },
    { id: 'fast', label: 'Fast' },
    { id: 'standard', label: 'Standard' }
  ];

  const sortOptions = [
    { id: 'distance', label: 'Distance' },
    { id: 'power', label: 'Power' },
    { id: 'price', label: 'Price' },
    { id: 'rating', label: 'Rating' }
  ];

  const filteredStations = stations.filter(station => {
    if (filter === 'all') return true;
    if (filter === 'available') return station.available;
    return station.type === filter;
  });

  const sortedStations = [...filteredStations].sort((a, b) => {
    switch (sortBy) {
      case 'distance':
        return a.distance - b.distance;
      case 'power':
        return b.power - a.power;
      case 'price':
        return parseFloat(a.price.replace('£', '')) - parseFloat(b.price.replace('£', ''));
      case 'rating':
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

  const getTypeColor = (type) => {
    switch (type) {
      case 'ultra-fast': return '#ef4444';
      case 'fast': return '#fbbf24';
      case 'standard': return '#4ade80';
      default: return '#6b7280';
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'ultra-fast': return 'Ultra Fast';
      case 'fast': return 'Fast';
      case 'standard': return 'Standard';
      default: return 'Unknown';
    }
  };

  const handleNavigate = (station) => {
    // This would integrate with navigation system
    console.log('Navigate to:', station.name);
  };

  const handleStartCharging = (station) => {
    // This would integrate with charging system
    console.log('Start charging at:', station.name);
  };

  return (
    <ChargingContainer>
      <Header>
        <HeaderTitle>Charging Stations</HeaderTitle>
      </Header>

      <FilterContainer>
        {filters.map((filterOption) => (
          <FilterButton
            key={filterOption.id}
            active={filter === filterOption.id}
            onClick={() => setFilter(filterOption.id)}
          >
            {filterOption.label}
          </FilterButton>
        ))}
      </FilterContainer>

      <FilterContainer>
        <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', marginRight: '8px' }}>
          Sort by:
        </span>
        {sortOptions.map((option) => (
          <FilterButton
            key={option.id}
            active={sortBy === option.id}
            onClick={() => setSortBy(option.id)}
          >
            {option.label}
          </FilterButton>
        ))}
      </FilterContainer>

      <AnimatePresence>
        {sortedStations.length > 0 ? (
          sortedStations.map((station, index) => (
            <StationCard
              key={station.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <StationHeader>
                <StationInfo>
                  <StationName>{station.name}</StationName>
                  <StationLocation>
                    <MapPin size={14} />
                    {station.location} • {station.distance} km away
                  </StationLocation>
                </StationInfo>
                <StationStatus available={station.available}>
                  {station.available ? 'Available' : 'Occupied'}
                </StationStatus>
              </StationHeader>

              <StationDetails>
                <DetailItem>
                  <Zap size={16} />
                  <span>Power:</span>
                  <DetailValue>{station.power} kW</DetailValue>
                </DetailItem>
                <DetailItem>
                  <DollarSign size={16} />
                  <span>Price:</span>
                  <DetailValue>{station.price}</DetailValue>
                </DetailItem>
                <DetailItem>
                  <Star size={16} />
                  <span>Rating:</span>
                  <DetailValue>{station.rating}/5</DetailValue>
                </DetailItem>
                <DetailItem>
                  <Clock size={16} />
                  <span>Wait:</span>
                  <DetailValue>{station.estimatedWait} min</DetailValue>
                </DetailItem>
              </StationDetails>

              <StationActions>
                <ActionButton onClick={() => handleNavigate(station)}>
                  <Navigation size={16} />
                  Navigate
                </ActionButton>
                <ActionButton 
                  primary 
                  onClick={() => handleStartCharging(station)}
                  disabled={!station.available}
                >
                  <Zap size={16} />
                  Start Charging
                </ActionButton>
              </StationActions>
            </StationCard>
          ))
        ) : (
          <EmptyState>
            <EmptyIcon>
              <Zap size={32} />
            </EmptyIcon>
            <h3>No charging stations found</h3>
            <p>Try adjusting your filters or search in a different area.</p>
          </EmptyState>
        )}
      </AnimatePresence>
    </ChargingContainer>
  );
};

export default ChargingStations; 