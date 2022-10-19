import React, { useEffect, useRef, useState } from "react";
import { Alert, Modal, StyleSheet, Text, View, FlatList, TouchableOpacity, ScrollView } from "react-native";
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
const GeoPickList = (props) => {
    const ref = useRef();
    const [address, setAddress] = useState('Chennai');
    // useEffect(() => {
    //     // ref.current?.setAddressText('Chennai');
    //     autoCompleteRef.setAddressText('Chennai')
    //     autoCompleteRef.focus()
    // }, []);
    return (
        <View style={styles.container}>
            <Modal
                style={styles.centeredView}
                animationType="slide"
                transparent={true}
                visible={props.visible}
            >
                <View style={styles.modalView}>
                    {/* <ScrollView> */}
                        <GooglePlacesAutocomplete
                            // ref={ref}
                            // ref={comp => (autoCompleteRef = comp)}
                            placeholder='Search Location'
                            currentLocation={true}
                            currentLocationLabel='Current location'
                            setAddressText={address}
                            keepResultsAfterBlur={true}
                            // value = {address}
                            onPress={(data, details) => {
                                console.log(data);
                                props.actionOnRow(data.description);
                            }}
                            query={{
                                key: 'AIzaSyDaNPyxJ7NKmZ4rC8awB-BlBh6ieH1Q9os',
                                language: 'en',
                            }}
                        />
                    {/* </ScrollView> */}
                    <View style={styles.Flatlistview}>
                        <View style={styles.col5}>
                            <TouchableOpacity style={{
                                width: '60%',
                                height: 40,
                                backgroundColor: '#040485',
                                position: 'absolute',
                                bottom: 0,
                                marginHorizontal: 30,
                            }}
                                onPress={() => {
                                    props.actionOnCancel(false);
                                }}
                            >
                                <Text style={styles.submitTextStyle}>Close</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};
export default GeoPickList;
const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 40,
        width: '100%'
    },
    modalView: {
        marginTop: '10%',
        backgroundColor: "grey",
        // borderRadius: 20,
        // paddingHorizontal: 10,
        // paddingVertical: 5,
        width: '90%',
        height: '70%',
        marginLeft: '5%',
        // alignItems: "center",
        // // shadowColor: "#000",
        // shadowOffset: {
        //     width: 0,
        //     height: 2
        // },
        // shadowOpacity: 0.25,
        // shadowRadius: 4,
        // elevation: 5
    },
    flatlist: {
        marginTop: 10,
        fontSize: 20,
        paddingHorizontal: 5,
        paddingVertical: 5,
        fontWeight: 'bold',
        width: '98%',
        marginBottom: 50,
    },
    container: {
        flex: 1,
        padding: 10,
    backgroundColor: 'transparent',
    },

    itemTitle:
    {
        color: 'black',
        fontSize: 15,
        paddingHorizontal: 5,
        paddingVertical: 5,

    },

    submitTextStyle:
    {
        color: 'white',
        fontSize: 15,
        paddingHorizontal: 10,
        paddingVertical: 10,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    col5: {
        width: '50%',
        marginLeft: '25%'
    },
});