import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {FormikHelpers} from 'formik';
import {useRef, useState} from 'react';
import {Alert, TextInput} from 'react-native';
import {IError} from '~app/constants/common';
import {SCREENS} from '~app/constants/navigation';
import {IUserName} from '~app/models/user';
import {InitialStackParamsList} from '~app/navigation/InitialNavigation';
import {appStateSelectors, useAppState} from '~app/state/AppState';

const initialValues: IUserName = {
  firstName: '',
  lastName: '',
  userName: '',
};

const useUsername = () => {
  const firstNameRef = useRef<TextInput>(null);
  const lastNameRef = useRef<TextInput>(null);
  const userNameRef = useRef<TextInput>(null);
  const showLoader = useAppState(appStateSelectors.showLoader);
  const hideLoader = useAppState(appStateSelectors.hideLoader);
  const setCurrentUser = useAppState(appStateSelectors.setCurrentUser);
  const [showLatname, setShowlastname] = useState(false);
  const [showError, setShowError] = useState(true);
  const navigation =
    useNavigation<StackNavigationProp<InitialStackParamsList>>();

  const onUser = async (
    {firstName, lastName, userName}: IUserName,
    helper: FormikHelpers<IUserName>,
  ) => {
    showLoader();
    try {
      navigation.navigate(SCREENS.TERMS_CONDITIONS);
    } catch (error) {
      const {type, message} = error as unknown as IError;
      helper.setErrors({[type]: message});
      Alert.alert('Error', message);
    } finally {
      hideLoader();
    }
  };
  const userById = () => {
    const uid = auth()?.currentUser?.uid;
    firestore()
      .collection('users')
      .doc(uid)
      .onSnapshot(documentSnapshot => {
        // console.log('User exists: ', documentSnapshot.exists);

        if (documentSnapshot?.exists) {
          setCurrentUser(documentSnapshot?.data());
        }
      });
  };

  const onBack = () => {
    navigation.navigate(SCREENS.SIGNUP);
  };
  return {
    firstNameRef,
    lastNameRef,
    userNameRef,
    initialValues,
    showLatname,
    setShowlastname,
    onUser,
    onBack,
    showError,
    userById,
  };
};

export default useUsername;
