import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Map, Battery, Zap, Navigation as NavigationIcon, X } from 'lucide-react';

const NavContainer = styled.div`
  padding: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const NavHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const Logo = styled.div`
  font-size: 24px;
  font-weight: 700;
  background: linear-gradient(135deg, #3e6ae1 0%, #3451b2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  padding: 8px;
  border-radius: 6px;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #fff;
  }
`;

const NavItems = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const NavItem = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: ${props => props.active ? 'rgba(62, 106, 225, 0.2)' : 'transparent'};
  border: 1px solid ${props => props.active ? 'rgba(62, 106, 225, 0.3)' : 'rgba(255, 255, 255, 0.1)'};
  border-radius: 12px;
  color: ${props => props.active ? '#fff' : 'rgba(255, 255, 255, 0.7)'};
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
  font-size: 16px;
  font-weight: 500;
  
  &:hover {
    background: ${props => props.active ? 'rgba(62, 106, 225, 0.3)' : 'rgba(255, 255, 255, 0.1)'};
    border-color: ${props => props.active ? 'rgba(62, 106, 225, 0.4)' : 'rgba(255, 255, 255, 0.2)'};
    color: #fff;
  }
`;

const NavIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
`;

const navItems = [
  { id: 'map', label: 'Map', icon: Map },
  { id: 'metrics', label: 'Car Metrics', icon: Battery },
  { id: 'charging', label: 'Charging', icon: Zap },
  { id: 'route', label: 'Route Planner', icon: NavigationIcon }
];

const Navigation = ({ activeView, onViewChange, onTogglePanel }) => {
  return (
    <NavContainer>
      <NavHeader>
        <Logo>EV Maps</Logo>
        <CloseButton onClick={onTogglePanel}>
          <X size={20} />
        </CloseButton>
      </NavHeader>
      
      <NavItems>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavItem
              key={item.id}
              active={activeView === item.id}
              onClick={() => onViewChange(item.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <NavIcon>
                <Icon size={20} />
              </NavIcon>
              {item.label}
            </NavItem>
          );
        })}
      </NavItems>
    </NavContainer>
  );
};

export default Navigation; 