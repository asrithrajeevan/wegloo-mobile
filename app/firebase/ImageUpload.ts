import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';

export const uploadProfilePicture = (image: any) => {
  const uid = auth()?.currentUser?.uid;

  let profilePic = storage()
    .ref()
    .child('profilePictures/' + new Date() + '.jpg');

  var metadata = {
    cacheControl: 'max-age=31536000',
  };
  console.log('profilePic', profilePic);
  return new Promise(resolve => {
    profilePic
      .putFile(image, metadata)
      .then((snapshot: any) => {
        profilePic.getDownloadURL().then(resolve);
      })
      .catch((error: any) => {
        console.log('utils uploadProfilePicture error ', error);
      });
  });
};
