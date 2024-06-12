declare module '*.svg' {
  import React from 'react';
  import {SvgProps} from 'react-native-svg';
  const content: React.FC<SvgProps>;
  export default content;
}
declare module '*.png';
declare module '*.jpg';

declare module 'react-native-pixel-perfect' {
  export const create = (dimensions: {width: number; height: number}) => {
    return (size: number): number => {};
  };
}
