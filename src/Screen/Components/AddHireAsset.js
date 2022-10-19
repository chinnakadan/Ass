import React, { useEffect, useState } from "react";
import { Alert, Modal, StyleSheet, Text, View, FlatList, TouchableOpacity, TextInput, Platform } from "react-native";
import ActionSheet, { SheetManager } from "react-native-actions-sheet";
import { Searchbar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import { Inward } from "../../service/api/apiservice";
import AsyncStorage from "@react-native-community/async-storage";
import { Picker } from "@react-native-picker/picker";
import { COLORS } from "../theme/theme";
import RNPickerSelect from 'react-native-picker-select';



const AddHireAsset = (props) => {
    //  console.log(props.assetgroupData, '<<<<chinna>>>>')
    const myIcon1 = <Icon name="checkbox" size={30} />;
    const myIcon2 = <Icon name="square-outline" size={30} />;
    const [selectedList, setselectedList] = useState([]);
    const [massetName, setmAssetName] = useState('');
    const [munitId, setmUnitId] = useState(0);
    const [mresId, setmResId] = useState(0);
    const [mfuelId, setmFuelId] = useState(0);
    useEffect(() => {
        setselectedList([]);
    }, [props.data]);
    function actionsheet() {
        SheetManager.show("helloworld_sheet");
    }
    function actionsheethide() {
        SheetManager.hide("helloworld_sheet");
    }
    const AddNewAsset = async (item) => {
        let iClientId = await AsyncStorage.getItem('clientId');
        let iUserId = await AsyncStorage.getItem('userId');
        let mvendorId = props.mvendorId;
        if (mresId == 0) {
            alert("Select Asset Group");
            return;
        }
        if (munitId == 0) {
            alert("Select Unit");
            return;
        }
        // if (mfuelId==0) {
        //     alert("Select Fuel");
        //     return;
        // }
        let data = {
            ClientId: iClientId,
            UserId: iUserId,
            vendorId: mvendorId,
            resId: mresId,
            unitId: munitId,
            fuelId: mfuelId,
            assetName: massetName,
            type: 'addHireAsset'
        };
        const response = await Inward(data)
        var datas = await response.json();
        if (datas.found == 1) {
            alert("Asset Name Already Found");
        } else {
            let arroperator = datas.assetlist;
            let tempTrans = [...props.listitem];
            tempTrans.push(arroperator);
            props.setlistitem(tempTrans);
            props.setdata(tempTrans);
            // props.search('');
            SheetManager.hide("helloworld_sheet");
        }
    }
    const selectedWorker = (item) => {
        if (!selectedList.includes(item.Id)) {
            let data = []
            data.push(item.Id);
            setselectedList([...data, ...selectedList])

        } else {
            let indexof = selectedList.indexOf(item.Id)
            let array = [...selectedList]
            if (indexof > -1) {
                array.splice(indexof, 1);
                setselectedList(array)
            }
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
                    props.onChange()
                }}
            >
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
                            return <TouchableOpacity
                                onPress={() => selectedWorker(item)} >
                                <View style={{
                                    flexDirection: 'row', flexDirection: 'row',
                                    flex: 1,
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    width: '100%',
                                    borderBottomColor: 'lightgrey',
                                    borderBottomWidth: 1,
                                    // marginHorizontal: '1%'
                                }}>
                                    <Text style={styles.itemTitle}>{item.Name}</Text>
                                    {
                                        selectedList.indexOf(item.Id) > -1 ?
                                            myIcon1 :
                                            myIcon2
                                    }
                                </View>

                            </TouchableOpacity>

                        }}
                    />
                    <View style={styles.Flatlistview}>
                        <View style={styles.col40}>
                            <TouchableOpacity style={{
                                width: '70%',
                                height: 40,
                                backgroundColor: 'red',
                                position: 'absolute',
                                bottom: 0,
                                right: 60,
                            }}
                                onPress={() => {
                                    props.actionOnCancel(false);
                                }}
                            >
                                <Text style={styles.submitTextStyle}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.col20}>
                            <TouchableOpacity style={{
                                width: '60%',
                                height: 40,
                                backgroundColor: 'green',
                                position: 'absolute',
                                bottom: 0,
                                right: -20,
                                borderRadius: 50,
                            }}
                                onPress={() => actionsheet()}
                            >
                                <Icon name='add' size={30} color='#ffff' style={{ marginTop: 3, marginLeft: 7 }} />
                                {/* <Text style={styles.submitTextStyle}>Add</Text> */}
                            </TouchableOpacity>
                        </View>
                        <View style={styles.col40}>
                            <TouchableOpacity style={{
                                width: '70%',
                                height: 40,
                                backgroundColor: COLORS.primary,
                                position: 'absolute',
                                bottom: 0,
                                left: 70,
                            }}
                                onPress={() => {
                                    props.actionOnRow( );
                                }}
                            >
                                <Text style={styles.submitTextStyle}>Submit</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <ActionSheet id="helloworld_sheet" >
                        <View style={styles.flatlist1}>
                            <Text style={styles.labeltxt}>Asset Name</Text>
                            <TextInput
                                style={styles.input}
                                onChangeText={setmAssetName}
                                value={massetName}
                            />
                        </View>
                        <View style={styles.flatlist1}>
                            <Text style={styles.labeltxt}>Asset Group</Text>
                            <View style={{ borderWidth: 1, borderColor: COLORS.brdleftblue, width: "100%", height: 50, paddingBottom: 5, paddingTop:15, paddingLeft:10 }} >
                                {Platform.OS == 'android' ?
                                    <Picker
                                        style={{ height: 50, width: '100%', borderWidth: 1, }}
                                        mode="dropdown"
                                        selectedValue={mresId}
                                        onValueChange={(itemValue, itemIndex) => setmResId(itemValue)}
                                    >
                                        {props.assetgroupData.map((key) => {
                                            return (<Picker.Item label={key.Name} value={key.Id} key={key.Id} />)
                                        })}
                                    </Picker>
                                    : <RNPickerSelect
                                        selectedValue={mresId}
                                        onValueChange={(itemValue, itemIndex) => setmResId(itemValue)}
                                        items={props.assetgroupData.map((item) => {
                                            return ({ label: item.Name, value: item.Id, key: item.Id })
                                        })}></RNPickerSelect>
                                }
                            </View>
                        </View>
                        <View style={styles.flatlist1}>
                            <Text style={styles.labeltxt}>Reading Unit</Text>
                            <View style={{ borderWidth: 1, borderColor: COLORS.brdleftblue, width: "100%",  height: 50, paddingBottom: 5, paddingTop:15, paddingLeft:10  }} >
                                {Platform.OS == 'android' ?
                                    <Picker
                                        style={{ height: 50, width: '100%', borderWidth: 1, }}
                                        mode="dropdown"
                                        selectedValue={munitId}
                                        onValueChange={(itemValue, itemIndex) => setmUnitId(itemValue)}
                                    >
                                        {props.readunitData.map((key) => {
                                            return (<Picker.Item label={key.Name} value={key.Id} key={key.Id} />)
                                        })}
                                    </Picker>
                                    :
                                    <RNPickerSelect
                                        selectedValue={munitId}
                                        onValueChange={(itemValue, itemIndex) => setmUnitId(itemValue)}
                                        items={props.readunitData.map((item) => {
                                            return ({ label: item.Name, value: item.Id, key: item.Id })
                                        })}></RNPickerSelect>
                                }
                            </View>
                        </View>
                        <View style={styles.flatlist2}>
                            <Text style={styles.labeltxt}>Fuel</Text>
                            <View style={{ borderWidth: 1, borderColor: COLORS.brdleftblue, width: "100%", height: 50, paddingBottom: 5, paddingTop:15, paddingLeft:10  }} >
                                {Platform.OS == 'android' ?
                                    <Picker
                                        style={{ height: 50, width: '100%', borderWidth: 1, }}
                                        mode="dropdown"
                                        selectedValue={mfuelId}
                                        onValueChange={(itemValue, itemIndex) => setmFuelId(itemValue)}
                                    >
                                        {props.fuelData.map((key) => {
                                            return (<Picker.Item label={key.Name} value={key.Id} key={key.Id} />)
                                        })}
                                    </Picker>
                                    :
                                    <RNPickerSelect
                                        selectedValue={mfuelId}
                                        onValueChange={(itemValue, itemIndex) => setmFuelId(itemValue)}
                                        items={props.fuelData.map((item) => {
                                            return ({ label: item.Name, value: item.Id, key: item.Id })
                                        })}></RNPickerSelect>
                                }
                            </View>
                        </View>
                        <View style={styles.Flatlistview}>
                            <View style={styles.col5}>
                                <TouchableOpacity style={{
                                    width: '60%',
                                    height: 40,
                                    backgroundColor: 'red',
                                    position: 'absolute',
                                    bottom: 0,
                                    right: 45,
                                }}
                                    // props.actionOnCancel(false);
                                    onPress={() => actionsheethide()}
                                >
                                    <Text style={styles.submitTextStyle}>Cancel</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.col5}>
                                <TouchableOpacity style={{
                                    width: '60%',
                                    height: 40,
                                    backgroundColor: COLORS.primary,
                                    position: 'absolute',
                                    bottom: 0,
                                    left: 265,
                                }}
                                    onPress={() => AddNewAsset()}
                                >
                                    <Text style={styles.submitTextStyle}>Submit</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ActionSheet>
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
    modalView: {
        margin: 10,
        backgroundColor: "white",
        borderRadius: 2,
        paddingHorizontal: 10,
        paddingVertical: 5,
        width: '90%',
        height: '95%',
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
        // backgroundColor: '#EAEDED',
    },
    itemTitle:
    {
        color: 'black',
        fontSize: 15,
        paddingHorizontal: 5,
        paddingVertical: 5,

    },
    col5: {
        width: '45%',
    },
    col40: {
        width: '40%',
    },
    col20: {
        width: '20%',
    },
    submitTextStyle:
    {
        color: 'white',
        fontSize: 15,
        paddingHorizontal: 10,
        paddingVertical: 7,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    flatlist1: {
        // fontSize: 20,
        // paddingHorizontal: 5,
        // paddingVertical: 5,
        // fontWeight: 'bold',
        width: '92%',
        marginBottom: 30,
        height: 50,
        marginTop: 10,
        marginLeft: '4%',
        marginRight: '4%',
    },
    flatlist2: {
        // fontSize: 20,
        // paddingHorizontal: 5,
        // paddingVertical: 5,
        // fontWeight: 'bold',
        width: '92%',
        marginBottom: 70,
        height: 50,
        marginTop: 10,
        marginLeft: '4%',
        marginRight: '4%',
    },
    input: {
        height: 50,
        borderWidth: 1,
        padding: 10,
        width: '100%',
        // marginRight: '55%',
        borderWidth: 1,
        borderColor: COLORS.brdleftblue,
        textAlign: 'left'
    },

});
export default AddHireAsset;