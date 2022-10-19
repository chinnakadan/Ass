
import React from 'react';
import {
	View
} from "react-native";
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';

import { StyleSheet } from 'react-native';
import CustomSidebarMenu from './Components/CustomSidebarMenu';
import DashboardScreen from './DrawerScreens/DashboardScreen';
import Icon from 'react-native-elements/dist/icons/Icon';
import PendingListIcon from 'react-native-vector-icons/Ionicons';
import NavigationDrawerHeader from './Components/NavigationDrawerHeader';
import MNotification from './DrawerScreens/Maintenance/MNotification';
const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
const DashboardScreenStack = ({ navigation }) => {
	const myPendingList = <Icon name="notifications" size={30} color="#ffff" onPress={() => navigation.navigate(MNotification != '' ? 'MNotification' : console.log('data'))} />;
	return (
		<Stack.Navigator
			initialRouteName="DashboardScreen"
			screenOptions={{
				headerLeft: () => (
					<NavigationDrawerHeader navigationProps={navigation} />
				),
				headerStyle: {
					backgroundColor: '#040485',
				},
				headerTintColor: '#fff',
				headerTitleStyle: {
					fontWeight: 'bold',
				},
			}}>
			<Stack.Screen
				name="DashboardScreen"
				component={DashboardScreen}
				options={{
					title: 'Dashboard',
					headerRight: () => (
						<View style={{ margin: '2%' }}>
							{
								myPendingList
							}
						</View>
					),
				}} />

		</Stack.Navigator>
	);
};
const DrawerNavigatorRoutes = (props) => {
	return (
		<Drawer.Navigator
			drawerContentOptions={{
				activeTintColor: '#cee1f2',
				color: '#cee1f2',
				itemStyle: { marginVertical: 5, color: 'white' },
				labelStyle: {
					color: '#d8d8d8',
				},
			}}
			screenOptions={{ headerShown: false }}
			drawerContent={CustomSidebarMenu}>
			<Drawer.Screen
				name="DashboardScreenStack"
				options={{ drawerLabel: 'Dashboard Screen' }}
				component={DashboardScreenStack}
			/>
			{/* <Drawer.Screen
				name="settingScreenStack"
				options={{ drawerLabel: 'Setting Screen' }}
				component={settingScreenStack}
			/> */}
			{/* <Drawer.Screen
				name="account"
				options={{ drawerLabel: 'dashboard Screen' }}
				component={AccountPayablestack}
			/> */}
		</Drawer.Navigator>
	);
};

export default DrawerNavigatorRoutes;

const styles = StyleSheet.create({
	icons: {
		flexDirection: 'row',
		paddingTop: 7,
		paddingLeft: 5,
		size: 50,
	},
})