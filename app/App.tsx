import auth from '@react-native-firebase/auth';
import {NavigationContainer} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {Appearance} from 'react-native';
import RNBootSplash from 'react-native-bootsplash';
import {useAppState} from '~app/state/AppState';
import Loader from './components/Loader';
import BottomTabsNavigation from './navigation/bottomTabNavigation';
import InitialNavigation from './navigation/InitialNavigation';

const App: React.FC = () => {
  const setDisplayMode = useAppState(state => state.setDisplayMode);
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();
  const isAuthenticated = useAppState(state => state.authenticated);
  const defalut = useAppState(state => state.defalut);

  useEffect(() => {
    // let theme = Appearance.getColorScheme();
    // setDisplayMode(theme === 'light' ? false : true);
    if (defalut) {
      const subscription = Appearance.addChangeListener(({colorScheme}) => {
        // let theme = Appearance.getColorScheme();
        setDisplayMode(colorScheme === 'light' ? false : true);
      });
      return () => subscription && subscription.remove();
    }
  }, []);

  // Handle user state changes
  function onAuthStateChanged(user: any) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing) return null;

  setTimeout(() => {
    RNBootSplash.hide({fade: true});
  }, 500);
  if (!isAuthenticated)
    return (
      <>
        <NavigationContainer>
          <InitialNavigation />
        </NavigationContainer>
        <Loader />
      </>
    );
  else {
    return (
      <NavigationContainer>
        <BottomTabsNavigation />
      </NavigationContainer>
    );
  }
};

export default App;
