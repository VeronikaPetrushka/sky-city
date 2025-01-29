import React from 'react';
import { Image, StyleSheet } from 'react-native';

const Icons = ({ type, active, selected }) => {

  let imageSource;
  let iconStyle = [styles.icon];

  switch (type) {
    case '1':
      imageSource = require('../assets/panel/1.png');
      active && iconStyle.push(styles.active);
      break;
    case '2':
      imageSource = require('../assets/panel/2.png');
      active && iconStyle.push(styles.active);
      break;
    case '3':
      imageSource = require('../assets/panel/3.png');
      active && iconStyle.push(styles.active);
      break;
    case '4':
      imageSource = require('../assets/panel/4.png');
      active && iconStyle.push(styles.active);
      break;
    case 'back':
      imageSource = require('../assets/icons/back.png');
      break;
    case 'cross':
      imageSource = require('../assets/icons/cross.png');
      break;
    case 'yes':
      imageSource = require('../assets/icons/yes.png');
      break;
    case 'date':
      imageSource = require('../assets/icons/date.png');
      break;
    case 'time':
      imageSource = require('../assets/icons/time.png');
      break;
    case 'size-s':
      imageSource = require('../assets/icons/size-s.png');
      selected && iconStyle.push(styles.selected);
      break;
    case 'size-m':
      imageSource = require('../assets/icons/size-m.png');
      selected && iconStyle.push(styles.selected);
      break;
    case 'size-l':
      imageSource = require('../assets/icons/size-l.png');
      selected && iconStyle.push(styles.selected);
      break;
    case 'type':
      imageSource = require('../assets/icons/type.png');
      break;
    case 'dots':
      imageSource = require('../assets/icons/dots.png');
      break;
    case 'norm':
      imageSource = require('../assets/icons/norm.png');
      break;
    case 'bottle':
      imageSource = require('../assets/icons/bottle.png');
      break;
    case 'arrow':
      imageSource = require('../assets/icons/arrow.png');
      break;
  }

  return (
    <Image 
      source={imageSource} 
      style={iconStyle} 
    />
  );
};

const styles = StyleSheet.create({
  icon: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  active: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    tintColor: '#B58C32',
  },
  selected: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    tintColor: '#222be6',
  }
});

export default Icons;
