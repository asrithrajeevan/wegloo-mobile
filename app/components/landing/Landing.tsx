import React from 'react';
import Logo from '~app/assets/images/logo_light.svg'
import LogoDark from '~app/assets/images/logo_dark.svg'
import { View,Image,Text } from 'react-native';
import Label from '../Label';
import {appStateSelectors, useAppState} from '~app/state/AppState';

const LandingHeader: React.FC = () => {
  const darkMode = useAppState(appStateSelectors.displayMode!);
  return <View>
  { darkMode?<LogoDark/>:  <Logo/>}
    
  </View>
 

  
};

export default LandingHeader;