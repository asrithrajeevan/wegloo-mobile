import {commonStyles} from '~app/styles/styleContants';
import React from 'react';
import {ScrollView, StyleProp, View, ViewStyle} from 'react-native';
import If from './If';

interface ILayoutProps {
  containerStyle?: StyleProp<ViewStyle>;
  fixed?: boolean;
}

const Layout: React.FC<ILayoutProps> = ({children, containerStyle, fixed}) => {
  return (
    <>
      <If condition={fixed}>
        <View
          style={[commonStyles.flex_1, commonStyles.container, containerStyle]}>
          {children}
        </View>
      </If>
      <If condition={!fixed}>
        <ScrollView
          style={[commonStyles.flex_1, commonStyles.container, containerStyle]}>
          {children}
        </ScrollView>
      </If>
    </>
  );
};

export default Layout;
