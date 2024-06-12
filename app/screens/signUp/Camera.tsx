import {useNavigation} from '@react-navigation/native';
import React, {useRef, useState} from 'react';
import {StyleSheet, TouchableOpacity, View, ViewProps} from 'react-native';
import {RNCamera} from 'react-native-camera';
import ImagePicker from 'react-native-image-crop-picker';
import {StackNavigationProp} from 'react-navigation/native-stack';
import ICCapture from '~app/assets/images/captureButton.svg';
import ICGallary from '~app/assets/images/chooseLibrary.svg';
import ICClose from '~app/assets/images/closeBlack.svg';
import ICFlash from '~app/assets/images/flash.svg';
import ICFlashOn from '~app/assets/images/flashOn.svg';
import ICFlipCamera from '~app/assets/images/flipCamera.svg';
import {COLORS} from '~app/constants/styles';
import {InitialStackParamsList} from '~app/navigation/InitialNavigation';
import {appStateSelectors, useAppState} from '~app/state/AppState';

interface ICameraProps extends ViewProps {
  selectImage?: any;
  closeCamera: any;
  closeCameraFull: any;
}
const Camera: React.FC<ICameraProps> = ({
  selectImage,
  closeCamera,
  closeCameraFull,
}) => {
  const camera = useRef(null);
  const [cameraType, setCameraType] = useState(false);
  const [flash, setFlash] = useState(false);
  const setProfileImage = useAppState(appStateSelectors.setProfileImage!);

  const navigation =
    useNavigation<StackNavigationProp<InitialStackParamsList>>();
  const takePicture = async () => {
    if (camera) {
      const options = {quality: 0.5, base64: false, width: 1500, height: 1500};
      const data = await camera.current.takePictureAsync(options);
      setProfileImage(data.uri);

      closeCamera();

      // // onChangeImage(data.uri);
      // navigation.navigate(SCREENS.FILTER, {images: data.uri});
    }
  };
  const openLibrary = () => {
    // closeModal();
    ImagePicker.openPicker({
      multiple: false,
      cropping: false,
      includeBase64: false,
      maxFiles: 10,

      cropperCircleOverlay: true,
    }).then(async images => {
      console.log('imaage', images);
      setProfileImage(images.path);

      closeCamera();
    });
  };
  return (
    <>
      <View style={styles.container}>
        <RNCamera
          ref={camera}
          style={styles.preview}
          type={
            cameraType
              ? RNCamera.Constants.Type.front
              : RNCamera.Constants.Type.back
          }
          flashMode={
            flash
              ? RNCamera.Constants.FlashMode.on
              : RNCamera.Constants.FlashMode.off
          }
          androidCameraPermissionOptions={{
            title: 'Permission to use camera',
            message: 'We need your permission to use your camera',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
          androidRecordAudioPermissionOptions={{
            title: 'Permission to use audio recording',
            message: 'We need your permission to use your audio',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
          onGoogleVisionBarcodesDetected={({barcodes}) => {
            console.log(barcodes);
          }}
        />
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            position: 'absolute',
            bottom: 50,

            width: '100%',
          }}>
          <TouchableOpacity
            onPress={() => takePicture()}
            style={styles.capture}>
            <ICCapture />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={() => {
            closeCameraFull();
          }}
          style={[styles.round, {top: 50, left: 20}]}>
          <ICClose />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setCameraType(!cameraType);
          }}
          style={styles.round}>
          <ICFlipCamera />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setFlash(!flash);
          }}
          style={[styles.round, {top: 110}]}>
          {flash ? <ICFlashOn /> : <ICFlash />}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            openLibrary();
          }}
          style={[styles.round, {top: 170}]}>
          <ICGallary />
        </TouchableOpacity>
      </View>
    </>
  );
};

export default Camera;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
  },
  round: {
    position: 'absolute',
    right: 25,
    top: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.WHITE_60,

    height: 35,
    width: 35,
    borderRadius: 35 / 2,
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  capture: {
    flex: 0,

    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20,
  },
});
