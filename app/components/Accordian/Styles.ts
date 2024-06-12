import {Platform, StyleSheet} from 'react-native';
import {hp, wp} from '~app/constants/styles';

const Styles = StyleSheet.create({
  itemContainer: {
    marginVertical: hp(0.8),
    marginHorizontal: wp(5),
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: hp(100),
    paddingHorizontal: wp(25),
    alignItems: 'center',
  },
  rowOpen: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: hp(150),
    paddingHorizontal: wp(5),
    alignItems: 'center',
  },

  shadowStyle: {
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(0,0,0,0.15)',
        shadowOffset: {width: 2, height: 3},
        shadowOpacity: 0.2,
      },
      android: {
        elevation: 2,
      },
    }),
  },

  radius1: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },

  radius0: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },

  title: {
    fontSize: hp(16),
    fontFamily: 'Poppins-SemiBold',
    fontWeight: '600',
    color: 'black',
  },

  iconStyle: {resizeMode: 'contain', height: 15, width: 15},

  child: {
    paddingHorizontal: wp(20),
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    paddingBottom: hp(15),
  },

  bgColorWhite: {
    backgroundColor: 'white',
  },

  bgColorGray: {
    backgroundColor: 'white',
  },

  description: {
    fontSize: 18,
    color: 'red',
    textAlign: 'left',
    lineHeight: 18,
  },
});

export default Styles;
