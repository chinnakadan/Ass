
import React, { useState, createRef, useEffect } from 'react';
import {
	StyleSheet,
	TextInput,
	View,
	Text,
	ScrollView,
	Keyboard,
	TouchableOpacity,
	KeyboardAvoidingView,
	ToastAndroid,
	Image,
} from 'react-native';
import Icon from 'react-native-elements/dist/icons/Icon';
import AsyncStorage from '@react-native-community/async-storage';
import InternetBar from '../../Components/internetConnector';
import { LoginRequest } from '../../../service/api/apiservice';
import StatusBarComponent from '../../Components/statusbarcomponent';

const LoginScreen = props => {

	const [UserName, setUserName] = useState('');
	const [Password, setUserPassword] = useState('');
	const [loading, setLoading] = useState(false);
	const [errortext, setErrortext] = useState('');
	const passwordInputRef = createRef();
	const [data, setData] = useState([]);


	useEffect(() => {
		retrieveData();
		// const backAction = () => {
		// 	Alert.alert("Exit App!", "Are you sure you want to exit app?", [
		// 		{
		// 			text: "NO",
		// 			onPress: () => null,
		// 			style: "cancel"
		// 		},
		// 		{ text: 'YES', onPress: () => BackHandler.exitApp() },
		// 	]);
		// 	return true;
		// };
		// const backHandler = BackHandler.addEventListener(
		// 	'hardwareBackPress',
		// 	backAction
		// );
		// return () => backHandler.remove();

	}, [data]);

	const retrieveData = async () => {
		try {
			const iClientId = await AsyncStorage.getItem('clientId');
			const value = JSON.parse(iClientId);
			setData(value);
		} catch (error) {
			console.log(error);
		}
	};


	const handleSubmitButton = async ({ navigation }) => {
		setErrortext('');
		if (!UserName) {
			alert('Please fill Username');
			return;
		}
		if (!Password) {
			alert('Please fill Password');
			return;
		}
		setLoading(true);
		let ClientId = await AsyncStorage.getItem('clientId');
		let UserId = await AsyncStorage.getItem('userId');

		let dataToSend = {
			Username: UserName,
			Password: Password,
			ClientId: ClientId,			// ClientId: '1009',
			ModuleId: '5',
		};
		try {
			
			
			let response = await LoginRequest(dataToSend);			
			const data = await response.json();
			// console.log("value===>", data)
			if (data.Status === 'valid') {
				let dataToSend = {
					UserId: UserId,
					ClientId: ClientId,
				};
				
				// ToastAndroid.show('Login sucessfully!', ToastAndroid.SHORT);
				props.navigation.navigate('DrawerNavigationRoutes');
				// props.navigation.navigate('Directory');								
				AsyncStorage.setItem('userId', data.userId.toString());
				AsyncStorage.setItem('userName', UserName.toString());

			} else if (data.Status === 'invalid') {
				alert('invalid data!')
				// ToastAndroid.show('invalid data!', ToastAndroid.SHORT);
			}
		} catch (error) {
			// ToastAndroid.show(error, ToastAndroid.SHORT);
			console.log('Error happened here!');
			console.log(error);
		}

	};


	return (

		<View style={[styles.container, {
			// Try setting `flexDirection` to `"row"`.
			flexDirection: "column"
		}]}>
			{/* <ScrollView> */}
			<StatusBarComponent/>
			<InternetBar />
			<View style={{ flex: 1, backgroundColor: "#02026e", borderBottomRightRadius: 50, borderBottomLeftRadius: 50 }} >
				<View style={styles.viewlogo}>
					<Image
						source={require('../../../assets/loginicon.png')}
						style={styles.logo}
					/>
				</View>
				<Text style={styles.logoText}>Bsf Asset</Text>
			</View>
			<View style={styles.mainBody}>

				{/* <ScrollView
					keyboardShouldPersistTaps="handled"
					// eslint-disable-next-line react-native/no-inline-styles
					contentContainerStyle={{
						justifyContent: 'center',
						alignContent: 'center',
					}}> */}
					<View style={{ alignItems: 'center', marginTop: '1%', }}>
						<Text style={styles.text}>Login</Text>
					</View>
					<View>
					
						<KeyboardAvoidingView enabled>
							<View style={{ alignItems: 'center' }}></View>
							<View style={styles.SectionStyle}>
								<Icon name="md-person" type="ionicon" color="#02026e" size={20} style={styles.btnIcon} />
								<TextInput
									style={styles.inputStyle}
									onChangeText={UserName => setUserName(UserName)}
									placeholder="Enter UserName"
									placeholderTextColor="#02026e"
									autoCapitalize="none"
									keyboardType="default"
									returnKeyType="next"
									onSubmitEditing={() =>
										passwordInputRef.current && passwordInputRef.current.focus()
									}
									underlineColorAndroid="#f000"
									blurOnSubmit={false}
								/>
							</View>
							<View style={styles.SectionStyle}>
								<Icon name="lock-closed" type="ionicon" color="#02026e" size={20} style={styles.btnIcon} />
								<TextInput
									style={styles.inputStyle}
									onChangeText={Password => setUserPassword(Password)}
									placeholder="Enter Password" //12345
									placeholderTextColor="#02026e"
									keyboardType="default"
									ref={passwordInputRef}
									onSubmitEditing={Keyboard.dismiss}
									blurOnSubmit={false}
									secureTextEntry={true}
									underlineColorAndroid="#f000"
									returnKeyType="done"
								/>
							</View>
							{errortext != '' ? (
								<Text style={styles.errorTextStyle}>{errortext}</Text>
							) : null}
							<TouchableOpacity
								style={styles.buttonStyle}
								activeOpacity={0.5}
								onPress={handleSubmitButton}>
								<Text style={styles.buttonTextStyle}>LOGIN</Text>
							</TouchableOpacity>
						</KeyboardAvoidingView>
					
					</View>
				
			</View>
			{/* </ScrollView> */}
		</View>
	);
};
export default LoginScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#ffffff',
	},
	mainBody: {
		flex: 2,
		justifyContent: 'center',
		backgroundColor: '#ffff',
		alignContent: 'center',
	},
	logo: {
        width: 100,
		height: 100,
		marginTop: '2%',
		marginBottom: '6%',
    },
    viewlogo: {
        justifyContent: 'center',
		alignItems: 'center',
		 margin: 'auto',
		//backgroundColor: '#fff',
		//borderRadius: 100,
		//width: '30%',
	 // marginLeft: '35%',
		//PaddingHorizontal: '25%',
		marginTop: '5%',
    },
	logoText: {
		color: '#FFFFFF',
		fontSize: 25,
		textAlign: 'center',
	},
	text: {
		color: '#02026e',
		paddingVertical: 10,
		fontSize: 30,
		marginTop: '1%',

	},
	SectionStyle: {
		flexDirection: 'row',
		height: 50,
		marginTop: 20,
		marginLeft: 35,
		marginRight: 35,
		// margin: 10,
		borderBottomWidth: 3,
		// borderRadius: 25,
		fontSize: 18,
		borderColor: '#dadae8',
	},
	buttonStyle: {
		// backgroundColor: '#002b80',
		backgroundColor: '#d6471c',
		borderWidth: 0,
		color: '#FFFFFF',
		borderColor: '#7DE24E',
		height: 50,
		alignItems: 'center',
		// borderRadius: 30,
		marginLeft: 35,
		marginRight: 35,
		marginTop: '10%',
		marginBottom: 20,
	},
	buttonTextStyle: {
		color: '#FFFFFF',
		paddingVertical: 10,
		fontSize: 20,
	},
	inputStyle: {
		flex: 1,
		color: '#02026e',
		paddingLeft: 15,
		paddingRight: 15,
		// borderBottomWidth: 3,
		// borderRadius: 25,
		fontSize: 18,
		// borderColor: '#dadae8',
	},
	registerTextStyle: {
		color: '#FFFFFF',
		textAlign: 'center',
		fontWeight: 'bold',
		fontSize: 14,
		alignSelf: 'center',
		padding: 10,
	},
	errorTextStyle: {
		color: 'red',
		textAlign: 'center',
		fontSize: 14,
	},
	btnIcon: {
		marginTop: 15, height: 20, marginLeft: 10,
	},
});
