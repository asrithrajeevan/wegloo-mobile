import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {SCREENS} from '~app/constants/navigation';
import AddGallary from '~app/screens/experience/AddGallary';
import AddUsers from '~app/screens/experience/AddUsers';
import EditLocation from '~app/screens/experience/EditLocation';
import EditTitleScreen from '~app/screens/experience/EditTitleScreen';
import Experience from '~app/screens/experience/Experience';
import CanvasView from '~app/screens/profile/canvas/Canvas';
import Profile from '~app/screens/profile/Profile';

export type ProfileStackParamList = {
  [SCREENS.PROFILE]: undefined;
  [SCREENS.CANVAS]: undefined;
  [SCREENS.EXPERIENCE]: undefined;
  [SCREENS.EDIT_LOCATION]: undefined;
  [SCREENS.EDIT_TITLE]: undefined;
  [SCREENS.ADD_USERS]: undefined;
  [SCREENS.ADD_GALLARY]: undefined;
  [SCREENS.ADD_ABOUT]: undefined;
};

const Stack = createNativeStackNavigator<ProfileStackParamList>();
function ProfileTab() {
  return (
    <Stack.Navigator initialRouteName={SCREENS.PROFILE}>
      <Stack.Screen
        name={SCREENS.ADD_GALLARY}
        component={AddGallary}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={SCREENS.ADD_USERS}
        component={AddUsers}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={SCREENS.PROFILE}
        component={Profile}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={SCREENS.CANVAS}
        component={CanvasView}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={SCREENS.EXPERIENCE}
        component={Experience}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={SCREENS.EDIT_LOCATION}
        component={EditLocation}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name={SCREENS.EDIT_TITLE}
        component={EditTitleScreen}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}
export default ProfileTab;
