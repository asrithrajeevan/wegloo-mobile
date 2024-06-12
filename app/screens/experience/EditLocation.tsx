import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {FlatList, StyleSheet, TouchableOpacity, View} from 'react-native';
import {StackNavigationProp} from 'react-navigation/native-stack';
import IcClose from '~app/assets/images/closeIcon.svg';
import IcLocation from '~app/assets/images/location.svg';
import Button from '~app/components/Button';
import Header from '~app/components/Header';
import Label from '~app/components/Label';
import MainCard from '~app/components/MainDarkCard';
import {COLORS, COMPONENT_SIZE, hp, wp} from '~app/constants/styles';
import {InitialStackParamsList} from '~app/navigation/InitialNavigation';
import {appStateSelectors, useAppState} from '~app/state/AppState';

const EditLocation: React.FC = () => {
  const navigation =
    useNavigation<StackNavigationProp<InitialStackParamsList>>();
  const darkMode = useAppState(appStateSelectors.displayMode!);
  const currentLocation = useAppState(appStateSelectors.currentLocation!);
  const currentLatitude = useAppState(appStateSelectors.currentLatitude!);
  const currentLongitude = useAppState(appStateSelectors.currentLongitude!);
  const setExperiences = useAppState(appStateSelectors.setExperiences!);
  const experiences = useAppState(appStateSelectors.experiences!);
  var places: readonly any[] | null | undefined = []; // This Array WIll contain locations received from google

  console.log('currenttt', currentLocation);
  // const [genderSelected, setGenderSelected] = useState(false);

  const [latitude, setLatitude] = useState(currentLatitude);
  const [placeList, setPlaceList] = useState([]);
  const [locations, setLocations] = useState([]);

  const [longitude, setLongitude] = useState(currentLongitude);
  const [googleText, setGoogleText] = useState('');
  const [location, setLocation] = useState('');

  const [modalVisible, setModalVisible] = useState(false);
  const [optional, setOptional] = useState(false);

  const [selectedLocation, setSelectedLocation] = useState(currentLocation);

  const refInput = React.useRef(null);

  const styles = style(darkMode);
  useEffect(() => {
    fetchNearestPlacesFromGoogle();
  }, []);

  const fetchNearestPlacesFromGoogle = () => {
    const latitude = currentLatitude; // you can update it with user's latitude & Longitude
    const longitude = currentLongitude;
    let radMetter = 2 * 1000; // Search withing 2 KM radius

    const url =
      'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=' +
      latitude +
      ',' +
      longitude +
      '&radius=' +
      radMetter +
      '&key=' +
      'AIzaSyBUgvzW8qDS5TQWLnxd3TmRbPAq5g0j7AE';

    fetch(url)
      .then(res => {
        return res.json();
      })
      .then(res => {
        // console.log('locationsss', res.results);
        for (let googlePlace of res.results) {
          var place = {};
          var lat = googlePlace.geometry.location.lat;
          var lng = googlePlace.geometry.location.lng;
          var coordinate = {
            latitude: lat,
            longitude: lng,
          };

          place['placeTypes'] = googlePlace.types;
          place['coordinate'] = coordinate;
          place['placeId'] = googlePlace.place_id;
          place['placeName'] = googlePlace.name;
          places.push(place);
        }
        setPlaceList(places);
        setLocations(places);

        // Do your work here with places Array
      })
      .catch(error => {
        console.log(error);
      });
  };
  const renderItem = ({item, index}: {item: any; index: number}) => (
    <TouchableOpacity
      style={{flexDirection: 'row', paddingVertical: hp(10)}}
      onPress={() => {
        setOptional(true);
        setLatitude(item.coordinate.latitude);
        setLongitude(item.coordinate.longitude);

        setSelectedLocation(item.placeName);
        const filteredList = locations.filter(data => {
          return data.placeName !== item.placeName;
        });

        setPlaceList(filteredList);
      }}>
      <IcLocation />
      <Label style={styles.locationText}>{item.placeName}</Label>
    </TouchableOpacity>
  );
  console.log('placessvalue', places);
  return (
    <>
      <MainCard>
        <Header
          iconStyle={{marginLeft: wp(15)}}
          goBack={() => {
            navigation.goBack();
          }}
          onPressNext={() => {}}
          rightTitle={''}
          title="Location"></Header>
        <View style={{paddingHorizontal: wp(30)}}>
          <Label style={styles.heading}>Location</Label>
          {optional && (
            <Label style={styles.subHeading}>{currentLocation}</Label>
          )}

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <Label style={[styles.heading, {fontSize: hp(16)}]}>
              {selectedLocation}
            </Label>
            <TouchableOpacity
              style={{marginTop: hp(30)}}
              onPress={() => {
                setOptional(false);
                setPlaceList(locations);
                setSelectedLocation(currentLocation);
              }}>
              <IcClose />
            </TouchableOpacity>
          </View>
          <View
            style={{
              backgroundColor: COLORS.BLACK,
              height: 1,
              width: '100%',
              marginTop: hp(10),
            }}
          />
          <Label style={styles.heading}>Select the location near at you</Label>
          <Label style={styles.optional}>
            {'Adding a secondary location is optional'}
          </Label>
          <FlatList
            style={{
              height: COMPONENT_SIZE.SCREEN_HEIGHT * 0.47,
              marginBottom: hp(10),
            }}
            data={placeList}
            renderItem={renderItem}
            keyExtractor={item => item.id}
          />
          <View style={{paddingBottom: hp(30)}}>
            <Button
              label="Next"
              style={{borderRadius: 5, width: '100%'}}
              onPress={() => {
                setExperiences({
                  ...experiences,
                  location: selectedLocation,
                  latitude: latitude,
                  longitude,
                });
                navigation.goBack();
              }}
            />
          </View>
        </View>
      </MainCard>
    </>
  );
};

export default EditLocation;
// export default EditLocationScreen;
const style = (darkMode: boolean) =>
  StyleSheet.create({
    topBar: {
      alignItems: 'center',
      flexDirection: 'row',
      width: '100%',
      paddingLeft: hp(20),
      marginTop: hp(20),
    },
    locationText: {
      color: COLORS.BLACK,
      marginLeft: wp(20),
      fontSize: hp(16),
      fontFamily: 'Poppins-Medium',
    },
    privacy: {
      textDecorationLine: 'underline',
      fontSize: hp(16),
      color: COLORS.BLACK,
      fontFamily: 'Poppins-Regular',
    },
    privacyView: {
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
      flexDirection: 'row',
      paddingHorizontal: wp(30),
      marginTop: hp(30),
    },
    people: {
      paddingHorizontal: wp(30),
      marginTop: hp(30),
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
    },
    heading: {
      fontSize: hp(18),
      fontFamily: 'Poppins-Medium',
      color: COLORS.BLACK,
      marginTop: hp(30),
    },
    subHeading: {
      fontSize: hp(13),
      fontFamily: 'Poppins-Regular',
      color: COLORS.THIN_GREY,
    },
    optional: {
      fontSize: hp(10),
      fontFamily: 'Poppins-Medium',
      color: COLORS.THIN_GREY,
      marginTop: hp(5),
    },
    input: {
      fontSize: hp(16),
      fontFamily: 'Poppins-Medium',
      fontWeight: '400',
      width: '100%',
      marginTop: hp(20),
    },
  });
