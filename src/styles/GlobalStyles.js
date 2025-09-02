import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Gotham', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background: #000;
    color: #fff;
    overflow: hidden;
  }

  code {
    font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace;
  }

  /* Custom scrollbar */
  ::-webkit-scrollbar {
    width: 6px;
  }

  ::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
  }

  ::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 3px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.5);
  }

  /* Loading spinner animation */
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  /* Pulse animation for notifications */
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
  }

  /* Slide in animation */
  @keyframes slideInRight {
    from { transform: translateX(100%); }
    to { transform: translateX(0); }
  }

  /* Leaflet map customizations */
  .leaflet-container {
    background: #1a1a1a;
  }

  .leaflet-control-attribution {
    background: rgba(0, 0, 0, 0.8) !important;
    color: rgba(255, 255, 255, 0.7) !important;
  }

  .leaflet-popup-content-wrapper {
    background: rgba(0, 0, 0, 0.9);
    color: #fff;
    border-radius: 12px;
    backdrop-filter: blur(20px);
  }

  .leaflet-popup-tip {
    background: rgba(0, 0, 0, 0.9);
  }

  /* Tesla-like button styles */
  .tesla-button {
    background: linear-gradient(135deg, #3e6ae1 0%, #3451b2 100%);
    border: none;
    border-radius: 8px;
    color: white;
    padding: 12px 24px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .tesla-button:hover {
    background: linear-gradient(135deg, #4a7cff 0%, #3e6ae1 100%);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(62, 106, 225, 0.3);
  }

  .tesla-button:active {
    transform: translateY(0);
  }

  /* Tesla-like card styles */
  .tesla-card {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    backdrop-filter: blur(20px);
    padding: 20px;
    margin: 10px 0;
  }

  /* Tesla-like input styles */
  .tesla-input {
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 8px;
    color: #fff;
    padding: 12px 16px;
    font-size: 14px;
    transition: all 0.3s ease;
  }

  .tesla-input:focus {
    outline: none;
    border-color: #3e6ae1;
    box-shadow: 0 0 0 2px rgba(62, 106, 225, 0.2);
  }

  .tesla-input::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }

  /* Navigation active state */
  .navigation-active {
    animation: pulse 2s infinite;
  }

  /* Smooth transitions for all interactive elements */
  button, input, select, textarea {
    transition: all 0.3s ease;
  }

  /* Focus states for accessibility */
  button:focus, input:focus, select:focus, textarea:focus {
    outline: 2px solid #3e6ae1;
    outline-offset: 2px;
  }
`; 