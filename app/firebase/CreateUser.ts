import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
export const createUser = async (data: any) => {
  const uid = auth()?.currentUser?.uid;
  console.log('userrifff', uid);
  data.createdAt = new Date();
  console.log('dataa createddddd', data);
  firestore()
    .collection('users')
    .doc(uid)
    .set(data)
    .then(() => {
      console.log('api createUser successful');

      // setOnboarding(false)
    })
    .catch(e => {
      console.log('api createUser error', e);
    });
};
