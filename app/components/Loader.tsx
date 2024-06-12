import React from 'react';
import {Image, Modal, StyleSheet, View} from 'react-native';
import {COLORS, hp} from '~app/constants/styles';
import {appStateSelectors, useAppState} from '~app/state/AppState';

const Loader: React.FC = () => {
  const actionCount = useAppState(appStateSelectors.actionCount);
  const loader = useAppState(appStateSelectors.loader);

  return (
    <Modal visible={loader} transparent animationType="fade">
      <View style={_style.container}>
        <Image
          source={require('~app/assets/images/spinnerr.gif')}
          style={{height: hp(50), width: hp(50)}}
        />
      </View>
    </Modal>
  );
};

export default Loader;

const _style = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.BLACK,
    opacity: 0.5,
  },
});
