import React from 'react';
import {
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewProps,
} from 'react-native';
import ICCheckTick from '~app/assets/images/colorTick.svg';
import ICCheck from '~app/assets/images/fillBox.svg';
import Label from '~app/components/Label';
import {COLORS, hp, wp} from '~app/constants/styles';
import {appStateSelectors, useAppState} from '~app/state/AppState';
import {commonStyles} from '~app/styles/styleContants';

interface IGenderProps extends ViewProps {
  selected: boolean;
  text: string;
  changeGender: Function;
}

const GenderSelectionField: React.FC<IGenderProps> = ({
  selected,
  text,
  changeGender,
}) => {
  const darkMode = useAppState(appStateSelectors.displayMode!);

  const style = styles(darkMode);
  return (
    <>
      <View style={style.subContainer}>
        <Label style={style.locationText}>{text}</Label>
        <TouchableOpacity onPress={() => changeGender(text)}>
          {!selected ? (
            <ICCheck color={darkMode ? '#2F333C' : '#B5B5B5'} />
          ) : (
            <ICCheckTick />
          )}
        </TouchableOpacity>
      </View>
    </>
  );
};

export default GenderSelectionField;
const styles = (darkMode: boolean) =>
  StyleSheet.create({
    subContainer: {
      ...commonStyles.flexRow,
      ...commonStyles.justifyContentBetween,
      alignItems: 'center',
      marginLeft: wp(35),
      width: '70%',
      marginTop: hp(10),
    },
    locationText: {
      fontSize: hp(15),
      fontFamily: 'Poppins-Regular',
      fontWeight: '400',
      color: darkMode ? COLORS.THIN_GREY : COLORS.THIN_GREY,
      marginLeft: wp(10),
      marginTop: Platform.OS === 'ios' ? hp(0) : hp(10),
    },
  });
