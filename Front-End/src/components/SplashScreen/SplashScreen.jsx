import React, { useEffect, useState } from 'react';
import { SplashScreen } from '@capacitor/splash-screen';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Capacitor } from '@capacitor/core';
import './SplashScreen.css';

const CustomSplashScreen = ({ children, isLoading }) => {
  const [showSplash, setShowSplash] = useState(true);
  const isMobile = Capacitor.isNativePlatform();

  useEffect(() => {
    const initializeApp = async () => {
      if (isMobile) {
        // Configure status bar
        await StatusBar.setStyle({ style: Style.Dark });
      }

      // Show splash for minimum time
      const minSplashTime = 2000;
      const startTime = Date.now();

      // Wait for app to be ready
      const checkReady = () => {
        const elapsedTime = Date.now() - startTime;
        
        if (!isLoading && elapsedTime >= minSplashTime) {
          setShowSplash(false);
          if (isMobile) {
            SplashScreen.hide();
          }
        } else {
          const remainingTime = Math.max(0, minSplashTime - elapsedTime);
          setTimeout(checkReady, remainingTime);
        }
      };

      checkReady();
    };

    initializeApp();
  }, [isLoading, isMobile]);

  if (showSplash) {
    return (
      <div className="splash-screen">
        <div className="splash-content">
          <div className="logo-container">
            <h1 className="app-title">GAINSLOG</h1>
            <div className="logo-subtitle">Track • Train • Transform</div>
          </div>
          <div className="loading-indicator">
            <div className="spinner"></div>
            <p className="loading-text">Loading your fitness journey...</p>
          </div>
        </div>
      </div>
    );
  }

  return children;
};

export default CustomSplashScreen;
