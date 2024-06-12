import React from 'react';
import {Text, View} from 'react-native';

const Experiences: React.FC = () => {
  return (
    <>
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          flex: 1,
        }}>
        <Text style={{color: 'black'}}>{'experiences'}</Text>
      </View>
    </>
  );
};

export default Experiences;
