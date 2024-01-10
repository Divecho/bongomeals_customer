import React from 'react';
import Spinner from 'react-native-loading-spinner-overlay';
import * as colors from '../assets/css/Colors';

export function Loader(props){
	return <Spinner
      visible={props.visible}
      color={colors.theme_fg}
      size="large"
      animation="fade"
    />
}