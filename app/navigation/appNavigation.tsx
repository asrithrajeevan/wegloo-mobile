import {NavigationContainer} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {Appearance} from 'react-native';
import {useAppState} from '~app/state/AppState';
import BottomTabsNavigation from './bottomTabNavigation';
import InitialNavigation from './InitialNavigation';

/**
 * Primary Navigation component.
 * @returns AppNavigation Component
 */
const AppNavigation: React.FC = () => {
  const setDisplayMode = useAppState(state => state.setDisplayMode);
  useEffect(() => {
    let theme = Appearance.getColorScheme();

    setDisplayMode(theme === 'light' ? false : true);
    const subscription = Appearance.addChangeListener(({colorScheme}) => {
      theme = Appearance.getColorScheme();
      setDisplayMode(colorScheme === 'light' ? false : true);
    });
    return () => subscription && subscription.remove();
  }, []);

  const isAuthenticated = useAppState(state => state.authenticated);
  if (isAuthenticated) {
    return (
      <NavigationContainer>
        <BottomTabsNavigation />
      </NavigationContainer>
    );
  } else {
    return (
      <NavigationContainer>
        <InitialNavigation />
      </NavigationContainer>
    );
  }
};

export default AppNavigation;
