import React from "react";
import { View, StyleSheet, Image } from "react-native";

const Header = () => {
  //////////STYLES
  const styles = StyleSheet.create({
    container: {
      position: 'absolute',
      top: 0,
      left: 0,
    },
    imagemStyle: {
      position: 'absolute',

      width: 500,
      height: 70,
      resizeMode: 'cover',
      opacity: 1,
    },
  });

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/background.png')}
        style={styles.imagemStyle}
      />
    </View>
  );
};

export default Header;