import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';
import {useAppState} from '~app/state/AppState';

export const fetchUsers = async (username: string) => {
  const setAllUsers = useAppState(state => state.setAllUsers);
  return firestore()
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
