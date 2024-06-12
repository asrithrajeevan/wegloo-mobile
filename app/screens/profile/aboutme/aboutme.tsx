import React from 'react';
import {Text, View} from 'react-native';

const AboutMe: React.FC = () => {
  return (
    <>
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          flex: 1,
        }}>
        <Text style={{color: 'black'}}>{'AboutMe'}</Text>
      </View>
    </>
  );
};

export default AboutMe;
