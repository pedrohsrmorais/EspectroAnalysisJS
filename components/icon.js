import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Octicons';

const ClickableIcon = ({ iconName, label, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={{ alignItems: 'center' }}>
      <Icon name={iconName} size={70} color="#1e0ac8" />
      <Text>{label}</Text>
    </TouchableOpacity>
  );
};

export default ClickableIcon;