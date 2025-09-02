import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import MapView from './components/MapView';
import CarMetrics from './components/CarMetrics';
import ChargingStations from './components/ChargingStations';
import RoutePlanner from './components/RoutePlanner';
import Navigation from './components/Navigation';
import { CarDataProvider } from './contexts/CarDataContext';
import { GlobalStyles } from './styles/GlobalStyles';
import { Menu, X, Map, BarChart3, Zap, Navigation as NavIcon } from 'lucide-react';

const AppContainer = styled.div`
  background: #000;
  color: #fff;
  min-height: 100vh;
  font-family: 'Gotham', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  overflow: hidden;
`;

const MainContent = styled.div`
  display: flex;
  height: 100vh;
  position: relative;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const SidePanel = styled(motion.div)`
  width: 400px;
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(20px);
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  overflow-y: auto;
  z-index: 10;

  @media (max-width: 768px) {
    width: 100%;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1000;
    border-right: none;
  }
`;

const MapContainer = styled.div`
  flex: 1;
  position: relative;

  @media (max-width: 768px) {
    height: 100vh;
  }
`;

const StatusBar = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: linear-gradient(180deg, rgba(0,0,0,0.8) 0%, transparent 100%);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  z-index: 5;

  @media (max-width: 768px) {
    height: 70px;
    padding: 0 15px;
  }
`;

const StatusItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);

  @media (max-width: 768px) {
    font-size: 12px;
    gap: 6px;
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: rgba(0, 0, 0, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  color: #fff;
  padding: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(20px);
  position: absolute;
  top: 15px;
  left: 15px;
  z-index: 1001;

  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &:hover {
    background: rgba(0, 0, 0, 0.9);
    border-color: rgba(255, 255, 255, 0.3);
  }
`;

const MobileCloseButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.3s ease;
  position: absolute;
  top: 15px;
  right: 15px;
  z-index: 1001;

  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &:hover {
    color: #fff;
    background: rgba(255, 255, 255, 0.1);
  }
`;

const MobileBottomNav = styled.div`
  display: none;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.95);
  backdrop-filter: blur(20px);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding: 10px 20px;
  z-index: 1000;

  @media (max-width: 768px) {
    display: flex;
    justify-content: space-around;
    align-items: center;
  }
`;

const MobileNavItem = styled.button`
  background: none;
  border: none;
  color: ${props => props.active ? '#3e6ae1' : 'rgba(255, 255, 255, 0.6)'};
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  font-size: 10px;

  &:hover {
    color: ${props => props.active ? '#4a7cff' : '#fff'};
    background: rgba(255, 255, 255, 0.1);
  }
`;

const MobileNavIcon = styled.div`
  font-size: 20px;
`;

function App() {
  const [activeView, setActiveView] = useState('map');
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth <= 768) {
        setIsSidePanelOpen(false);
      } else {
        setIsSidePanelOpen(true);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const views = {
    map: <MapView />,
    metrics: <CarMetrics />,
    charging: <ChargingStations />,
    route: <RoutePlanner />
  };

  const mobileNavItems = [
    { id: 'map', icon: <Map size={20} />, label: 'Map' },
    { id: 'route', icon: <NavIcon size={20} />, label: 'Route' },
    { id: 'charging', icon: <Zap size={20} />, label: 'Charging' },
    { id: 'metrics', icon: <BarChart3 size={20} />, label: 'Metrics' }
  ];

  const handleMobileNavClick = (viewId) => {
    setActiveView(viewId);
    if (isMobile) {
      setIsSidePanelOpen(true);
    }
  };

  const toggleSidePanel = () => {
    setIsSidePanelOpen(!isSidePanelOpen);
  };

  return (
    <CarDataProvider>
      <AppContainer>
        <GlobalStyles />
        <MainContent>
          {/* Mobile Menu Button */}
          {isMobile && (
            <MobileMenuButton onClick={toggleSidePanel}>
              <Menu size={20} />
            </MobileMenuButton>
          )}

          {/* Side Panel */}
          <AnimatePresence>
            {isSidePanelOpen && (
              <SidePanel
                initial={{ x: isMobile ? -400 : -400, y: isMobile ? 0 : 0 }}
                animate={{ x: 0, y: 0 }}
                exit={{ x: isMobile ? -400 : -400, y: isMobile ? 0 : 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                {/* Mobile Close Button */}
                {isMobile && (
                  <MobileCloseButton onClick={toggleSidePanel}>
                    <X size={20} />
                  </MobileCloseButton>
                )}

                <Navigation 
                  activeView={activeView} 
                  onViewChange={setActiveView}
                  onTogglePanel={() => setIsSidePanelOpen(false)}
                  isMobile={isMobile}
                />
                {views[activeView]}
              </SidePanel>
            )}
          </AnimatePresence>
          
          <MapContainer>
            <StatusBar>
              <StatusItem>
                <span>MG4</span>
                <span>•</span>
                <span>Connected</span>
              </StatusItem>
              <StatusItem>
                <span>85%</span>
                <span>•</span>
                <span>245 km</span>
              </StatusItem>
            </StatusBar>
            <MapView />
          </MapContainer>
        </MainContent>

        {/* Mobile Bottom Navigation */}
        {isMobile && (
          <MobileBottomNav>
            {mobileNavItems.map((item) => (
              <MobileNavItem
                key={item.id}
                active={activeView === item.id}
                onClick={() => handleMobileNavClick(item.id)}
              >
                <MobileNavIcon>{item.icon}</MobileNavIcon>
                <span>{item.label}</span>
              </MobileNavItem>
            ))}
          </MobileBottomNav>
        )}
      </AppContainer>
    </CarDataProvider>
  );
}

export default App; 