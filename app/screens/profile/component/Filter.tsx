import React, {useEffect, useRef, useState} from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewProps,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import Button from '~app/components/Button';
import Header from '~app/components/Header';
import Label from '~app/components/Label';
import {FILTERS} from '~app/constants/filters';
import {COLORS, COMPONENT_SIZE, hp, wp} from '~app/constants/styles';
import {appStateSelectors, useAppState} from '~app/state/AppState';

interface IFilterProps extends ViewProps {
  closeFliter: any;
  openCamera: any;
  retakeCamera: any;
  closeFilterModal: any;
  showFilter: boolean;
  from?: string;
}
const FilterScreen: React.FC<IFilterProps> = ({
  closeFliter,
  openCamera,
  retakeCamera,
  closeFilterModal,
  showFilter,
  from,
}) => {
  //   const {images} = route.params;
  // const flatlistRef = useRef(null);
  const flatlistRef = React.useRef<any>(null);
  const profileImage = useAppState(appStateSelectors.profileImage!);
  const canvasPhotos = useAppState(
    from === ''
      ? appStateSelectors.canvasPhotos!
      : appStateSelectors.experimentPhotos!,
  );
  const [crop, setCrop] = useState(false);

  const [useImage, setUserImage] = useState(false);
  const [usePhoto, setUsePhoto] = useState(false);
  const [filter, setFilter] = useState(true);
  const [adjust, setAdust] = useState(false);
  const [fieldIndex, setFieldIndex] = useState(0);
  const [filteredImage, setFilteredImage] = useState(canvasPhotos.slice(0));

  const darkMode = useAppState(appStateSelectors.displayMode!);

  let imageFilter = canvasPhotos.slice(0);
  const extractedUri = useRef(
    'https://www.hyundai.com/content/hyundai/ww/data/news/data/2021/0000016609/image/newsroom-0112-photo-1-2021elantranline-1120x745.jpg',
  );
  const styles = style(darkMode);
  useEffect(() => {}, [filteredImage]);
  const [selectedFilterIndex, setIndex] = useState(0);
  const onExtractImage = ({nativeEvent}) => {
    console.log('calling', nativeEvent.uri);
    extractedUri.current = nativeEvent.uri;
    const data = {
      path: nativeEvent.uri,
    };
    // canvasPhotos.splice(fieldIndex, 1, data);
    filteredImage.splice(fieldIndex, 1, data);
    filteredImage.splice(fieldIndex, 1, data);
    console.log('check', filteredImage);
    setFilteredImage(filteredImage);
    // setCrop(!crop);
    // console.log('extraedddddddd', nativeEvent.uri);
  };
  const onSelectFilter = (selectedIndex: React.SetStateAction<number>) => {
    setIndex(selectedIndex);
  };

  useEffect(() => {
    console.log('scrollToIndexhhhh', fieldIndex);

    flatlistRef !== null &&
      flatlistRef?.current?.scrollToIndex({
        index: fieldIndex,
        animated: false,
      });
  }, [usePhoto]);
  const renderFilterComponent = ({item, index}) => {
    const FilterComponent = item.filterComponent;
    const image = (
      <Image
        style={styles.filterSelector}
        source={{uri: canvasPhotos?.[fieldIndex]?.path}}
        resizeMode={'cover'}
        blurRadius={10}
      />
    );
    return (
      <TouchableOpacity onPress={() => onSelectFilter(index)}>
        <FilterComponent image={image} />
        <Text style={styles.filterTitle}>{item.title}</Text>
      </TouchableOpacity>
    );
  };
  const renderImage = ({item, index}) => {
    return (
      <Image
        style={[styles.image, {marginTop: !usePhoto ? hp(50) : hp(5)}]}
        source={{uri: filteredImage?.[index]?.path}}
        resizeMode={'contain'}
      />
    );
  };
  const renderImageComponent = () => {
    return selectedFilterIndex === 0 ? (
      // <SelectedFilterComponent
      //   onExtractImage={onExtractImage}
      //   extractImageEnabled={true}
      //   image={
      //     <Image
      //       style={[
      //         styles.image,
      //         {
      //           height: !usePhoto
      //             ? COMPONENT_SIZE.SCREEN_HEIGHT * 0.76
      //             : COMPONENT_SIZE.SCREEN_HEIGHT * 0.61,
      //           marginTop: !usePhoto ? hp(50) : hp(5),
      //         },
      //       ]}
      //       source={{uri: canvasPhotos?.[fieldIndex]?.path}}
      //       resizeMode={'cover'}
      //     />
      //   }
      // />
      <Image
        style={[styles.image, {marginTop: !usePhoto ? hp(50) : hp(5)}]}
        source={{uri: canvasPhotos?.[fieldIndex]?.path}}
        resizeMode={'contain'}
      />
    ) : (
      <SelectedFilterComponent
        onExtractImage={onExtractImage}
        extractImageEnabled={true}
        image={
          <Image
            style={[
              styles.image,
              {
                height: !usePhoto
                  ? COMPONENT_SIZE.SCREEN_HEIGHT * 0.76
                  : COMPONENT_SIZE.SCREEN_HEIGHT * 0.61,
                marginTop: !usePhoto ? hp(50) : hp(5),
              },
            ]}
            source={{uri: canvasPhotos?.[fieldIndex]?.path}}
            resizeMode={'contain'}
          />
        }
      />
    );
  };
  const changeScroll = (e: any) => {
    let contentOffset = e.nativeEvent.contentOffset;
    let index = Math.floor(contentOffset.x / 300);
    setFieldIndex(index);
  };
  const openCropper = (image: any) => {
    ImagePicker.openCropper({
      path: image,
      width: 400,
      height: 400,
      cropperToolbarTitle: 'Edit',
      compressImageQuality: 0.8,
      freeStyleCropEnabled: true,
      cropping: true,
      mediaType: 'photo',
      cropperCircleOverlay: true,
      hideBottomControls: false,
      includeBase64: false,
    })
      .then(image => {
        console.log('imagesssscrop', image);
        const userSourceImg = {
          uri: image.path,
          type: 'image/*',
        };
        const data = {
          path: image.path,
          // base64: image.data,
        };
        filteredImage.splice(fieldIndex, 1, data);
        canvasPhotos.splice(fieldIndex, 1, data);
        console.log('afterrrr', filteredImage);
        setFilteredImage(filteredImage);

        setCrop(!crop);
        // closeFliter(image);
        //   ImagePicCallBack(userSourceImg);
      })
      .catch(err => {
        console.info(err);
      });
  };

  const SelectedFilterComponent = FILTERS[selectedFilterIndex].filterComponent;
  return (
    <>
      {/* <SafeAreaView /> */}
      <View style={styles.container}>
        {
          <Header
            title={usePhoto ? 'Edit' : ''}
            rightTitle={usePhoto ? 'Save' : 'Done'}
            goBack={() => {
              retakeCamera();
              setUsePhoto(false);
            }}
            onPressNext={() => {
              if (usePhoto) {
                setTimeout(() => {
                  setUsePhoto(false);
                  setIndex(0);
                }, 1000);
              } else {
                setTimeout(() => {
                  console.log('dkdkkdkdkdk', filteredImage);
                  closeFliter(filteredImage);
                }, 1000);
              }

              // closeFilterModal();
              // setTimeout(() => {
              //   closeFliter(filteredImage !== '' ? filteredImage : imageFilter);
              // }, 1000);
            }}
          />
        }
        {!usePhoto ? (
          <FlatList
            ref={flatlistRef}
            style={{marginTop: hp(15)}}
            data={filteredImage}
            extraData={showFilter}
            keyExtractor={item => item.title}
            horizontal={true}
            renderItem={renderImage}
            onScrollToIndexFailed={error => {
              flatlistRef.current.scrollToOffset({
                offset: error.averageItemLength * error.index,
                animated: true,
              });
              setTimeout(() => {
                if (filteredImage.length !== 0 && filteredImage !== null) {
                  flatlistRef.current.scrollToIndex({
                    index: fieldIndex,
                    animated: true,
                  });
                }
              }, 100);
            }}
            onScroll={e => changeScroll(e)}
          />
        ) : (
          renderImageComponent()
          // <FlatList
          //   style={{marginTop: hp(15)}}
          //   data={filteredImage}
          //   extraData={filteredImage}
          //   keyExtractor={item => item.title}
          //   horizontal={true}
          //   renderItem={renderImageComponent}
          //   onScroll={e => changeScroll(e)}
          // />
        )}

        {usePhoto ? (
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={() => {
                setFilter(true);
              }}>
              <Label style={styles.buttonText}>{'Filter'} </Label>
              {filter && <View style={styles.line} />}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                openCropper(filteredImage[fieldIndex].path);
                setFilter(false);
                setAdust(true);
              }}>
              <Label style={styles.buttonText}>{'Adjust'} </Label>
              {!filter && <View style={styles.line} />}
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.buttonContainer}>
            <Button
              // disabled={check}
              style={styles.editButton}
              onPress={() => {
                // closeFliter();
                retakeCamera();
              }}
              labelStyle={styles.buttonText}
              label="Retake"></Button>
            <Button
              // disabled={check}
              style={[styles.editButton, {paddingHorizontal: wp(10)}]}
              onPress={() => {
                setUsePhoto(true);
              }}
              labelStyle={styles.buttonText}
              label="Use photo"></Button>
          </View>
        )}
        {usePhoto && (
          <FlatList
            style={{marginTop: hp(15)}}
            data={FILTERS}
            keyExtractor={item => item.title}
            horizontal={true}
            renderItem={renderFilterComponent}
          />
        )}
      </View>
    </>
  );
};
export default FilterScreen;
const style = (darkMode: boolean) =>
  StyleSheet.create({
    image: {
      width: COMPONENT_SIZE.SCREEN_WIDTH,
      height: COMPONENT_SIZE.SCREEN_HEIGHT * 0.61,
      // marginVertical: hp(10),
      // alignSelf: 'center',
    },

    line: {
      height: 2,
      width: wp(25),
      backgroundColor: COLORS.NAVY_BLUE,
    },
    filterSelector: {
      width: hp(80),
      height: hp(80),
      margin: 5,
      // resizeMode: 'contain',
    },
    buttonContainer: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      marginTop: hp(20),
      width: '100%',
      paddingHorizontal: hp(20),
    },
    editButton: {
      backgroundColor: 'transparent',
      // width: COMPONENT_SIZE.SCREEN_WIDTH - 20,
      height: hp(30),
      paddingHorizontal: wp(15),
      borderRadius: 5,
      borderColor: COLORS.NAVY_BLUE,
      borderWidth: 2,
      // paddingVertical: hp(5),
    },
    filterButton: {
      backgroundColor: 'transparent',

      height: hp(20),
      borderRadius: 0,

      // paddingVertical: hp(5),
    },
    editSelectedButton: {
      backgroundColor: COLORS.THEME_BLUE,
      // width: COMPONENT_SIZE.SCREEN_WIDTH - 20,
      height: hp(30),
      paddingHorizontal: wp(10),
      borderRadius: 5,
      borderColor: COLORS.NAVY_BLUE,
      borderWidth: 2,
      // paddingVertical: hp(5),
    },
    buttonText: {
      color: darkMode ? COLORS.WHITE : COLORS.BLACK,
      textAlign: 'center',
      fontSize: hp(13.5),
      fontFamily: 'Poppins-Medium',
      fontWeight: '400',
    },
    buttonSelectedText: {
      color: COLORS.WHITE,
      textAlign: 'center',
      fontSize: hp(11),
      fontFamily: 'Poppins-Regular',
      fontWeight: '400',
    },
    filterTitle: {
      fontSize: 12,
      textAlign: 'center',
      color: darkMode ? COLORS.WHITE : COLORS.BLACK,
    },
    container: {
      flex: 1,
      flexDirection: 'column',
      backgroundColor: darkMode ? COLORS.BLACK : COLORS.WHITE,
      position: 'absolute',
      top: 0,
      bottom: 0,
      right: 0,
      left: 0,
      marginTop: hp(30),
    },
  });
