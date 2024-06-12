import auth from '@react-native-firebase/auth';

export const signInWithEmail = async (username: string, password: string) => {
  return auth()
    .signInWithEmailAndPassword(username, password)
    .then(res => {
      console.log('responseeee', res);
      console.log('User account created & signed in!');
      return res;
    })
    .catch(error => {
      if (error.code === 'auth/email-already-in-use') {
        console.log('That email address is already in use!');
      }

      if (error.code === 'auth/invalid-email') {
        console.log('That email address is invalid!');
      }
      return error;
      console.error(error);
    });
};
export const signInWithPhoneNumber = async (phoneNumber: string) => {
  return await auth().signInWithPhoneNumber(phoneNumber);
};
