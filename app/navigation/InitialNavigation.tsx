import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {SCREENS} from '~app/constants/navigation';
import Experience from '~app/screens/experience/Experience';
import Home from '~app/screens/home/Home';
import Landing from '~app/screens/landing/Landing';
import Login from '~app/screens/login/Login';
import ModeSelection from '~app/screens/modeselection/ModeSelection';
import Bio from '~app/screens/signUp/Bio';
import Birthday from '~app/screens/signUp/Birthday';
import ConfirmCode from '~app/screens/signUp/ConfirmPhone';
import FilterScreen from '~app/screens/signUp/FilterScreen';
import LocationEnableScreen from '~app/screens/signUp/LocationEnable';
import PhoneNumber from '~app/screens/signUp/PhoneNumber';
import PhoneNumberSuccess from '~app/screens/signUp/PhoneNumberSuccess';
import PrivacyPolicy from '~app/screens/signUp/PrivacyPolicy';
import ProfilePicture from '~app/screens/signUp/profilePicture';
import SignUp from '~app/screens/signUp/SignUp';
import SocialMediaDetails from '~app/screens/signUp/SocialMediaDetails';
import TermsConditions from '~app/screens/signUp/TermsConditions';
import TutorialFour from '~app/screens/signUp/TutorialFour';
import TutorialOne from '~app/screens/signUp/TutorialOne';
import TutorialThree from '~app/screens/signUp/TutorialThree';
import TutorialTwo from '~app/screens/signUp/TutorialTwo';
import UserName from '~app/screens/signUp/Username';
export type InitialStackParamsList = {
  [SCREENS.LANDING]: undefined;
  [SCREENS.SIGNUP]: undefined;
  [SCREENS.HOME]: undefined;
  [SCREENS.MODE_SELECTION]: undefined;
  [SCREENS.USERNAME]: undefined;
  [SCREENS.TERMS_CONDITIONS]: undefined;
  [SCREENS.PRIVACY_POLICY]: undefined;
  [SCREENS.PHONE_NUMBER]: undefined;
  [SCREENS.CONFIRM_PHONE]: undefined;
  [SCREENS.PHONE_NUMBER_SUCCESS]: undefined;
  [SCREENS.BIRTHDAY]: undefined;
  [SCREENS.PROFILE_PICTURE]: undefined;
  [SCREENS.BIO]: undefined;
  [SCREENS.SOCIAL_MEDIA]: undefined;
  [SCREENS.LOCATION_ENABLE]: undefined;
  [SCREENS.TUTORIAL_ONE]: undefined;
  [SCREENS.TUTORIAL_TWO]: undefined;
  [SCREENS.TUTORIAL_THREE]: undefined;
  [SCREENS.TUTORIAL_FOUR]: undefined;
  [SCREENS.SIGN_IN]: undefined;
  // [SCREENS.CAMERA]: undefined;
  [SCREENS.FILTER]: undefined;
  [SCREENS.EXPERIENCE]: undefined;
  [SCREENS.EDIT_TITLE]: undefined;
  [SCREENS.EDIT_LOCATION]: undefined;
};

const Stack = createNativeStackNavigator<InitialStackParamsList>();

const InitialNavigation: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name={SCREENS.LANDING} component={Landing} />
      <Stack.Screen name={SCREENS.PROFILE_PICTURE} component={ProfilePicture} />

      <Stack.Screen name={SCREENS.EXPERIENCE} component={Experience} />

      <Stack.Screen
        name={SCREENS.SOCIAL_MEDIA}
        component={SocialMediaDetails}
      />

      <Stack.Screen name={SCREENS.BIO} component={Bio} />

      <Stack.Screen name={SCREENS.USERNAME} component={UserName} />
      <Stack.Screen name={SCREENS.PHONE_NUMBER} component={PhoneNumber} />

      {/* <Stack.Screen name={SCREENS.CAMERA} component={Camera} /> */}
      <Stack.Screen name={SCREENS.FILTER} component={FilterScreen} />

      <Stack.Screen name={SCREENS.TUTORIAL_ONE} component={TutorialOne} />

      <Stack.Screen
        name={SCREENS.LOCATION_ENABLE}
        component={LocationEnableScreen}
      />

      <Stack.Screen name={SCREENS.MODE_SELECTION} component={ModeSelection} />
      <Stack.Screen name={SCREENS.TUTORIAL_THREE} component={TutorialThree} />
      <Stack.Screen name={SCREENS.TUTORIAL_FOUR} component={TutorialFour} />

      <Stack.Screen name={SCREENS.SIGN_IN} component={Login} />

      <Stack.Screen name={SCREENS.BIRTHDAY} component={Birthday} />

      <Stack.Screen name={SCREENS.TUTORIAL_TWO} component={TutorialTwo} />

      <Stack.Screen
        name={SCREENS.PHONE_NUMBER_SUCCESS}
        component={PhoneNumberSuccess}
      />

      <Stack.Screen name={SCREENS.CONFIRM_PHONE} component={ConfirmCode} />

      <Stack.Screen name={SCREENS.SIGNUP} component={SignUp} />
      <Stack.Screen name={SCREENS.HOME} component={Home} />

      <Stack.Screen name={SCREENS.PRIVACY_POLICY} component={PrivacyPolicy} />
      <Stack.Screen
        name={SCREENS.TERMS_CONDITIONS}
        component={TermsConditions}
      />
    </Stack.Navigator>
  );
};

export default InitialNavigation;
