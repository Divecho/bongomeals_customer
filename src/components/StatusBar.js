import React from 'react';
import { StatusBar as Sb } from 'react-native';
import * as colors from '../assets/css/Colors';

export function StatusBar(props){
	return <Sb
	    barStyle = "light-content"
	    hidden = {false}
	    backgroundColor = {colors.theme_bg}
	    translucent = {false}
	    networkActivityIndicatorVisible = {true}
	 />
}
