import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import React from 'react';
import {Image, Platform, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import IcUser from '~app/assets/images/userCircle.svg';
import {SCREENS} from '~app/constants/navigation';
import {COLORS, hp} from '~app/constants/styles';
import Feeds from '~app/screens/feeds/Feeds';
import Home from '~app/screens/home/Home';
import Notifications from '~app/screens/notification/Notifications';
import {appStateSelectors, useAppState} from '~app/state/AppState';
import ConnectionTab from './connectionTab';
import ProfileTab from './profileTab';

const BottomTabsNavigation: React.FC = () => {
  const darkMode = useAppState(appStateSelectors.displayMode!);
  const currentUser = useAppState(appStateSelectors.currentUser!);

  // const styles = style(darkMode);
  const TabNavigator = createBottomTabNavigator();
  const tabBarListeners = ({navigation, route}) => ({
    tabPress: () => {
      navigation.navigate(route.name);
    },
  });
  return (
    <TabNavigator.Navigator
      screenOptions={{
        headerShown: false,

        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: darkMode ? COLORS.BLACK : COLORS.WHITE,
          elevation: 0, // for Android
          shadowOffset: {
            width: 0,
            height: 0, // for iOS
          },
          display: 'flex',
        },
      }}>
      <TabNavigator.Screen
        name={SCREENS.FEEDS}
        component={Feeds}
        options={{
          tabBarIcon: focused => (
            <Image
              source={require('~app/assets/images/home.png')}
              style={{width: hp(25), height: hp(25), resizeMode: 'contain'}}
            />
          ),
        }}
      />
      <TabNavigator.Screen
        name={SCREENS.SEARCH}
        component={Home}
        options={{
          tabBarIcon: () => (
            <Image
              source={require('~app/assets/images/search.png')}
              style={{width: hp(25), height: hp(25), resizeMode: 'contain'}}
            />
          ),
        }}
      />
      <TabNavigator.Screen
        name={SCREENS.CONNECTIONS}
        component={ConnectionTab}
        listeners={tabBarListeners}
        options={{
          tabBarIcon: ({focused}) => (
            <Image
              source={
                focused
                  ? require('~app/assets/images/colorDiscover.png')
                  : require('~app/assets/images/discover.png')
              }
              style={{
                width: focused ? hp(34) : hp(30),
                height: focused ? hp(34) : hp(30),
                resizeMode: 'contain',
              }}
            />
          ),
        }}
      />
      <TabNavigator.Screen
        name={SCREENS.NOTIFICATIONS}
        component={Notifications}
        options={{
          tabBarIcon: () => (
            <Image
              source={require('~app/assets/images/bell.png')}
              style={{width: hp(25), height: hp(25), resizeMode: 'contain'}}
            />
          ),
        }}
      />
      <TabNavigator.Screen
        name={SCREENS.PROFILE_TAB}
        component={ProfileTab}
        options={{
          tabBarIcon: () =>
            currentUser?.profileImage ? (
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderColor: COLORS.NAVY_BLUE,
                  borderWidth: 2,
                  width: hp(36),
                  height: hp(36),
                  borderRadius: hp(17),
                }}>
                <FastImage
                  source={{
                    uri: currentUser?.profileImage,
                    priority: FastImage.priority.high,
                  }}
                  style={{
                    width: hp(32),
                    height: hp(32),

                    borderRadius: Platform.OS === 'ios' ? hp(32) : hp(16),
                  }}
                  resizeMode={FastImage.resizeMode.cover}
                />
                {/* <Image
                  source={{uri: currentUser?.profileImage}}
                  resizeMode="cover"
                  style={{
                    width: hp(32),
                    height: hp(32),

                    borderRadius: Platform.OS === 'ios' ? hp(32) : hp(16),
                  }}
                /> */}
              </View>
            ) : (
              <IcUser height={hp(32)} width={hp(32)} />
            ),
        }}
      />
    </TabNavigator.Navigator>
  );
};

export default BottomTabsNavigation;
