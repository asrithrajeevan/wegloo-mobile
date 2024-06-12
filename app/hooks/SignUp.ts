import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';
import {useNavigation} from '@react-navigation/native';
import {useRef} from 'react';
import {Alert, TextInput} from 'react-native';
import {StackNavigationProp} from 'react-navigation/native-stack';
import {IError} from '~app/constants/common';
import {SCREENS} from '~app/constants/navigation';
import {IEmail, ISignup} from '~app/models/user';
import {InitialStackParamsList} from '~app/navigation/InitialNavigation';
import {appStateSelectors, useAppState} from '~app/state/AppState';

const initialValues: ISignup = {
  email: '',
  password: '',
  confirmPassword: '',
};

const useSignUp = () => {
  const usernameRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const confirmPasswordRef = useRef<TextInput>(null);
  const showLoader = useAppState(appStateSelectors.showLoader);
  const hideLoader = useAppState(appStateSelectors.hideLoader);
  const setAllUsers = useAppState(state => state.setAllUsers);
  const user = useAppState(state => state.user);
  //const setUser = useAppState(appStateSelectors.setUser);

  const navigation =
    useNavigation<StackNavigationProp<InitialStackParamsList>>();

  const onSignUp = async ({email}: IEmail) => {
    showLoader();
    try {
      //   const {uid} = await signUpWithEmail(email, password);
      //   const user = {email};
      //  await addUser(uid, user);
      //  setUser(uid, user);
      // navigation.navigate(SCREENS.REGISTER_SUCCESS);
    } catch (error) {
      const {type, message} = error as unknown as IError;

      Alert.alert('Error', message);
    } finally {
      hideLoader();
    }
  };
  const fetchUsers = async (username: string) => {
    firestore()
      .collection('users')
      .get()
      .then(querySnapshot => {
        console.log('Total users: ', querySnapshot.size);
        const users: FirebaseFirestoreTypes.DocumentData[] = [];
        querySnapshot.forEach(documentSnapshot => {
          console.log('User ID: ', documentSnapshot.data());
          users.push(documentSnapshot.data());
        });
        setAllUsers(users);
      });
  };
  const onSubmitPhone = () => {
    navigation.navigate(SCREENS.CONFIRM_PHONE);
  };
  const handleSignin = () => {
    navigation.navigate(SCREENS.CONFIRM_PHONE);
    // navigation.navigate(SCREENS.SIGNIN);
  };
  const handlePrivacy = () => {
    // navigation.navigate(SCREENS.PRIVACY_POLICY);
  };
  return {
    usernameRef,
    passwordRef,
    confirmPasswordRef,
    initialValues,
    handleSignin,
    onSignUp,
    handlePrivacy,
    onSubmitPhone,
    fetchUsers,
  };
};

export default useSignUp;
