import React, { useState, useEffect } from 'react';
import {
	Text,
	View,
	StyleSheet, ImageBackground, SafeAreaView, Image,
} from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';
import DeviceInfo from 'react-native-device-info';
import StatusBarComponent from '../../Components/statusbarcomponent';


const SplashScreen = ({ navigation }) => {
	const [animating, setAnimating] = useState(true);
	var deviceJSON = {};
	deviceJSON.uniqueId = DeviceInfo.getUniqueId();
	deviceJSON.model = DeviceInfo.getModel();
	AsyncStorage.setItem('deviceDetails', JSON.stringify(deviceJSON));
	// console.log(deviceJSON, 'deviceset');

	useEffect(() => {
		// console.log('login')
		setTimeout(() => {
			setAnimating(false);
			AsyncStorage.getItem('user_id').then((value) =>
				navigation.replace(
					//value === null ? 'Auth' : 'DrawerNavigationRoutes'
					value === null ? 'Auth' : 'LoginScreen'
					//value === null ? 'DrawerNavigationRoutes' : 'DrawerNavigationRoutes'
					// value === null ? 'Auth' : 'Directory'
				),

			);
		}, 5000);
	}, []);

	return (
		<View>
			<StatusBarComponent />
			<ImageBackground
				style={{ width: '100%', height: '100%',resizeMode: 'cover' }}
			source={require('../../../assets/spalshscreen1280x2320.gif')}
			// source={require('../../../assets/list4.png' ) }
			>
			</ImageBackground>
			<View>
			</View>
		</View>
	);
};

export default SplashScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#307ecc',
	},
	activityIndicator: {
		alignItems: 'center',
		height: 80,
	},
});








