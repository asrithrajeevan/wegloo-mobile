import {Dimensions} from 'react-native';
import {
  heightPercentageToDP as hp2dp,
  widthPercentageToDP as wp2dp,
} from 'react-native-responsive-screen';

/**
 * Width-Percentage
 * Converts width dimension to percentage
 * 414, 896 - design were made using this scale
 * @param dimension directly taken from design wireframes
 * @returns percentage string e.g. '25%'
 */
export const wp = (dimension: number) => {
  return wp2dp((dimension / 414) * 100 + '%');
};

/**
 * Height-Percentage
 * Converts width dimension to percentage
 * 414, 896 - design were made using this scale
 * @param dimension directly taken from design wireframes
 * @returns percentage string e.g. '25%'
 */
export const hp = (dimension: number) => {
  return hp2dp((dimension / 896) * 100 + '%');
};

export enum COMPONENT_SIZE {
  DEFAULT_PADDING = 24,
  SCREEN_WIDTH = Dimensions.get('screen').width,
  SCREEN_HEIGHT = Dimensions.get('screen').height,
}

/**
 * Define colors used in app here
 */
export enum COLORS {
  WHITE = '#ffffff',
  WHITE_40 = '#ffffff40',
  WHITE_20 = '#ffffff70',
  WHITE_60 = '#ffffff99',
  BLACK = '#282B33',
  BLACK_70 = '#00000070', // ~ rgba(0, 0, 0, 70)
  WINE = '#3e173a',
  THEME_BLUE = '#5538FE',
  INPUT_TEXT = '#808080',
  DISABLED_TEXT = '#8e94ac70',
  STARS = '#d675ac',
  TEXT = '#313137',
  BRAND2_ADMIN = '#9d9daa',
  LIGHT_PURPLE = '#927b88',
  LIGHT_GRAY = '#EEEEFE',
  PLACEHOLDER_TEXT = '#8086a2',
  READ = '#FF5655',
  BRIGHT_GREY = '#F3F4F6',
  CERULEAN = '#039DDF',
  LIGHT_WHITE = '#F9F9FA',
  PINK = '#FD355A',
  GRADIENT1 = '#18191F',
  GRADIENT2 = '#1b154a',
  GREY = '#b5b5b533',
  FLURECENT_GREEN = '#00FF47',
  THIN_GREY = '#636472',
  BLUE = '#3366BB',
  THEME_DARK_BLUE = '#18191FB3',
  NAVY_BLUE = '#7B61FF',
  BLACK_LIGHT = '#282B33',
  WHITE_LIGHT = '#FFFFFF80',
  DARK_GREY = '#5D636D',
}
