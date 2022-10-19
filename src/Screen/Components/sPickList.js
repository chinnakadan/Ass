import React, { useState } from "react";
import { Alert, Modal, StyleSheet, Text, View, FlatList, TouchableOpacity } from "react-native";
import { Searchbar } from 'react-native-paper';
const SPickList = (props) => {
    return (
        <View style={styles.container}>
            <Modal
                style={styles.centeredView}
                animationType="slide"
                transparent={true}
                visible={props.visible}
                onRequestClose={() => {
                    // Alert.alert("Modal has been closed.");
                    props.onChange()
                }}
            >
                <View>
                    <View style={styles.modalView}>
                        <Searchbar
                            placeholder="Search"
                            onChangeText={(value) => props.onChangeSearch(value)}
                            value={props.search}
                        />
                        <FlatList style={styles.flatlist}
                            data={props.data}
                            keyExtractor={item => item.Id}
                            renderItem={({ item }) => {
                                return <TouchableOpacity onPress={() => props.actionOnRow(item)}>
                                    <Text style={styles.itemTitle}>{item.Name}</Text>
                                </TouchableOpacity>
                            }}
                        />
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
const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22,
        width: '100%'
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

    modalView: {
        margin: 10,
        backgroundColor: "#fff",
        borderRadius: 2,
        paddingHorizontal: 10,
        paddingVertical: 5,
        // width: '90%',
        // height: '96%',
        marginLeft: '5%',
        width: '90%',
        height: '92%',
        marginTop:43,

        alignItems: "center",
        // shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    flatlist: {
        fontSize: 20,
        paddingHorizontal: 5,
        paddingVertical: 5,
        fontWeight: 'bold',
        width: '98%',
        marginBottom: 50,
    },
    container: {
        flex: 1,
        // backgroundColor: '#EAEDED',
    },
    itemTitle:
    {
        color: 'black',
        fontSize: 15,
        paddingHorizontal: 5,
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#c6c9cf',
    },
    col5: {
        width: '50%',
    },

});
export default SPickList;