import AsyncStorage from '@react-native-async-storage/async-storage';
import {BottomTabBarProps} from '@react-navigation/bottom-tabs';
import React from 'react';
import {Platform, StyleSheet, TouchableOpacity, View} from 'react-native';
import IcConnection from '~app/assets/images/connection.svg';
import IcHome from '~app/assets/images/home.svg';
import IcNotification from '~app/assets/images/notifications.svg';
import IcProfile from '~app/assets/images/profile.svg';
import IcSearch from '~app/assets/images/search.svg';
import {SCREENS} from '~app/constants/navigation';
import {COLORS, hp} from '~app/constants/styles';

// import {appStateSelectors, useAppState} from '~app/state/AppState';

const BottomTabs: React.FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  // const darkMode = useAppState(appStateSelectors.displayMode!);
  const getIcon = (routeName: string, color?: string) => {
    switch (routeName) {
      case SCREENS.HOME:
        return <IcHome />;
      case SCREENS.SEARCH:
        return <IcSearch />;
      case SCREENS.CONNECTIONS:
        return <IcConnection />;
      case SCREENS.NOTIFICATIONS:
        return <IcNotification />;
      case SCREENS.PROFILE:
        return <IcProfile />;
    }
  };
  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem('@profileImage');
      if (value !== null) {
        // value previously stored
      }
    } catch (e) {
      // error reading value
    }
  };
  console.log('profileee', getData());
  return (
    <View style={[style.container]}>
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            key={route.name}
            accessibilityRole="button"
            onPress={onPress}
            onLongPress={onLongPress}
            style={[style.button]}>
            {getIcon(route.name)}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default BottomTabs;

const style = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: Platform.OS === 'ios' ? hp(70) : hp(50),

    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeDot: {
    height: hp(8),
    width: hp(8),
    borderRadius: hp(16),
  },
  dotActiveColor: {backgroundColor: COLORS.WINE},
});
