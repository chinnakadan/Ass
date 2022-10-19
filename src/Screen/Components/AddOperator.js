import React, { useState } from "react";
import { Alert, Modal, StyleSheet, Text, View, FlatList, TouchableOpacity, Pressable, TextInput } from "react-native";
import { Searchbar } from 'react-native-paper';
import Icon from 'react-native-elements/dist/icons/Icon';
import ActionSheet, { SheetManager } from "react-native-actions-sheet";
import { Transfer } from "../../service/api/apiservice";
import AsyncStorage from "@react-native-community/async-storage";
const AddOperator = (props) => {
    const [moperatorName, setmOperatorName] = useState('');
    function actionsheet() {
        SheetManager.show("helloworld_sheet");
    }
    function actionsheethide() {
        SheetManager.hide("helloworld_sheet");
    }
    const AddNewOperator = async (item) => {
        let iClientId = await AsyncStorage.getItem('clientId');
        let iUserId = await AsyncStorage.getItem('userId');
        let data = {
            ClientId: iClientId,
            UserId: iUserId,
            OperatorName: moperatorName,
            type: 'addOperator'
        };
        const response = await Transfer(data)
        var datas = await response.json();
        if (datas.found == 1) {
            alert("Operator Name Already Found");
        } else {
            let arroperator = datas.operatorList;
            let tempTrans = [...props.listitem];
            tempTrans.push(arroperator);
            props.setlistitem(tempTrans);
            props.setdata(tempTrans);
            // props.search('');
            SheetManager.hide("helloworld_sheet");
        }
    }
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
                        <View style={styles.Flatlistview2}>
                            <View style={styles.col5}>
                                <TouchableOpacity style={{
                                    width: '25%',
                                    height: 40,
                                    backgroundColor: 'green',
                                    position: 'absolute',
                                    bottom: 0,
                                    right: 100,
                                    borderRadius: 50,
                                }}
                                    onPress={() => actionsheet()}
                                >
                                    <Icon name='add' size={30} color='#ffff' style={{ marginTop: 5, }} />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.col5}>
                                <TouchableOpacity style={{
                                    width: '50%',
                                    height: 40,
                                    backgroundColor: '#040485',
                                    position: 'absolute',
                                    bottom: 0,
                                    left: 70,
                                }}
                                    onPress={() => {
                                        props.actionOnCancel(false);
                                    }}
                                >
                                    <Text style={styles.submitTextStyle}>Close</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <ActionSheet id="helloworld_sheet">
                            <View style={styles.flatlist1}>
                                <Text style={styles.labeltxt}>Operator Name</Text>
                                <TextInput
                                    style={styles.input}
                                    onChangeText={setmOperatorName}
                                    value={moperatorName}
                                />
                            </View>
                            <View style={styles.Flatlistview}>
                                <View style={styles.col5}>
                                    <TouchableOpacity style={{
                                        width: '70%',
                                        height: 40,
                                        backgroundColor: 'red',
                                        position: 'absolute',
                                        bottom: 20,
                                        right: 40,
                                    }}
                                        // props.actionOnCancel(false);
                                        onPress={() => actionsheethide()}
                                    >
                                        <Text style={styles.submitTextStyle}>Cancel</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.col5}>
                                    <TouchableOpacity style={{
                                        width: '70%',
                                        height: 40,
                                        backgroundColor: '#040485',
                                        position: 'absolute',
                                        bottom: 20,
                                     left: 240,
                                      
                                    }}
                                        onPress={() => AddNewOperator()}
                                    >
                                        <Text style={styles.submitTextStyle}>Submit</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </ActionSheet>
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
    flatlist: {
        fontSize: 20,
        paddingHorizontal: 5,
        paddingVertical: 5,
        fontWeight: 'bold',
        width: '98%',
        marginBottom: 50,
    },
    modalView: {
        margin: 10,
        backgroundColor: "white",
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
    flatlist1: {
        // fontSize: 20,
        // paddingHorizontal: 5,
        // paddingVertical: 5,
        // fontWeight: 'bold',
        width: '92%',
        marginBottom: 30,
        height: 120,
        marginTop: 10,
        marginLeft: '4%',
        marginRight: '4%',
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
        width:'90%',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#c6c9cf'

    },
    col5: {
        width: '50%',
    },
    modalView1: {
        // margin: "50%",
        backgroundColor: "#787882",
        borderRadius: 2,
        paddingHorizontal: 10,
        paddingVertical: 5,
        width: '90%',
        height: '45%',
        marginLeft: '5%',
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
    input: {
        height: 45,
        borderWidth: 1,
        padding: 10,
        width: '100%',
        marginRight: '55%',
        borderWidth: 1,
        borderColor: '#a7b7d9',
        textAlign: 'left'
    },
    labeltxt: {
        color: '#022969',
        fontWeight: 'bold'
    },
    Flatlistview2: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },

});
export default AddOperator;