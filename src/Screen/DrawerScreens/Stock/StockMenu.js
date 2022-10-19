import { useEffect } from 'react';
import React from 'react';
import { ListItem } from 'react-native-elements';
import {
    View, StyleSheet, ImageBackground, BackHandler
} from "react-native";
import InternetBar from '../../Components/internetConnector';
const StockMenu = (props) => {
    useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
        return () => {
            BackHandler.removeEventListener('hardwareBackPress', handleBackButtonClick);
        };
    }, []);
    function handleBackButtonClick() {
        props.navigation.goBack();
        return true;
    }
    return (<View style={styles.flatlist}>
        <View style={styles.row}>
            <InternetBar />
            <ListItem style={styles.listItem1} onPress={() => { props.navigation.navigate('AssetStock') }}>
                <ImageBackground style={styles.listimg} imageStyle={{ borderRadius: 20 }} source={require('../../../assets/list4.jpg')}>
                    <ListItem.Title style={styles.list}>Asset wise Stock</ListItem.Title>
                </ImageBackground>
            </ListItem>
            <ListItem style={styles.listItem2} onPress={() => { props.navigation.navigate('AssetCCStock') }}>
                <ImageBackground style={styles.listimg} imageStyle={{ borderRadius: 20 }} source={require('../../../assets/list4.jpg')}>
                    <ListItem.Title style={styles.list}>CostCentre wise Stock</ListItem.Title>
                </ImageBackground>
            </ListItem>
            <ListItem style={styles.listItem2} onPress={() => { props.navigation.navigate('AssetGroupStock') }}>
                <ImageBackground style={styles.listimg} imageStyle={{ borderRadius: 20 }} source={require('../../../assets/list4.jpg')}>
                    <ListItem.Title style={styles.list}>Asset Category wise Stock</ListItem.Title>
                </ImageBackground>
            </ListItem>
        </View>
    </View>
    );
}
export default StockMenu;
const styles = StyleSheet.create({
    row: {
        marginTop: 5,
        flexDirection: "row",
        flexWrap: "wrap",
    },
    listimg: {
        width: '100%',
        height: 70,
        resizeMode: 'contain',
    },
    list: {
        flex: 0,
        fontSize: 20,
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold',
        paddingTop: '5%',
    },
    flatlist: {
        fontSize: 20,
        padding: 8,
        fontWeight: 'bold',
        color: 'blue',
    },
    listItem1: {
        marginTop: '0%',
        marginLeft: '0%',
        width: '100%',
    },
    listItem2: {
        marginTop: '0%',
        width: '100%',
        marginLeft: '0%',
    },
})