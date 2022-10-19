import { useState, useEffect, useRef } from 'react';
import React from 'react';
import { Text, View, StyleSheet, Pressable, FlatList, TouchableOpacity, Alert, Modal, Button, TextInput, BackHandler, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Label, { Orientation } from "react-native-label";
import AsyncStorage from '@react-native-community/async-storage';;
import { Searchbar } from 'react-native-paper';
import Icon from 'react-native-elements/dist/icons/Icon';
import { ToastAndroid } from 'react-native';
import { Idle } from '../../../service/api/apiservice';
import Loader from '../../Components/Loader';
import Wizard from "react-native-wizard"
import SPickList from '../../Components/sPickList';
import Icon2 from "react-native-elements/dist/icons/Icon";
import MPickListG from '../../Components/mPickListg';
import Geolocation from '@react-native-community/geolocation';
import Geocoder from 'react-native-geocoding';
import GetGeoLocation from '../../Components/GetGeoLocation';
import CommonFun from '../../Components/CommonFun';
import { COLORS, FONTCOLORS } from '../../theme/theme';
import RNPickerSelect  from 'react-native-picker-select';
  
const IdleEntry = (props) => {
    const { RegisterId } = props.route.params;

    const wizard = useRef()
    const [isFirstStep, setIsFirstStep] = useState(true)
    const [isLastStep, setIsLastStep] = useState(false)
    const [currentStep, setCurrentStep] = useState(0)

    const [ClientId, setClientId] = useState('');
    const [UserId, setUserId] = useState('');
    const [listItems, setlistItems] = useState([]);
    const [data, setData] = useState([]);
    const [search, setSearch] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [modalVisibleVendor, setmodalVisibleVendor] = useState(false);
    const [vendordata, setvendordata] = useState([]);
    const [listItemsvendor, setlistItemsvendor] = useState([]);
    const [searchvendor, setSearchvendor] = useState('');
    const [orderdata, setorderdata] = useState([]);
    const [approve, setApprove] = useState('N');

    const [assetType, setassetType] = useState(1);
    const [entryType, setentryType] = useState(1);
    const [vendorId, setvendorId] = useState(0);
    const [VendorName, setVendorName] = useState('');
    const [orderId, setorderId] = useState(0);
    const [idletrans, setidletrans] = useState([]);
    const [seldisabled, setseldisabled] = useState('auto');
    const [assetListItems, setAssetListItems] = useState([]);
    const [assetData, setAssetData] = useState([]);
    const [massetData, setMAssetData] = useState([]);
    const [assetSearch, setAssetSearch] = useState('');
    const [assetgroupData, setAssetGroupData] = useState([]);
    const [assetModalVisible, setAssetModalVisible] = useState(false);
    const [assetAddModalVisible, setAssetAddModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [remarks, setRemarks] = React.useState("");
    const [CCName, setCCName] = useState('');
    const [CostcentreId, setCostcentreId] = useState(0);
    const [submitClick, setsubmitClick] = useState(false);
    const [wizardShow, setwizardShow] = useState(false);

    const [gLatitude, setgLatitude] = useState(0);
    const [gLongitude, setgLongitude] = useState(0);
    const [gLocation, setgLocation] = useState('');

    useEffect(() => {
        if (data.length == 0) retrieveData();
    }, [ClientId, UserId]);
    useEffect(() => {
        if (CostcentreId != 0) setwizardShow(true);
        else setwizardShow(false);
    }, [CostcentreId]);
    useEffect(() => {
        removeAssetData();
        if (idletrans.length > 0) setseldisabled('none');
        else setseldisabled('auto');
    }, [idletrans]);
    useEffect(() => {
        // props.navigation.setOptions({ headerShown: screenshow == 0 ? true : false });
        const backAction = () => {
            if (currentStep == 0) {
                Alert.alert("Exit!", "Are you sure to exit from this screen?", [
                    {
                        text: "NO",
                        onPress: () => null,
                        style: "cancel"
                    },
                    { text: 'YES', onPress: () => props.navigation.goBack() },
                ]);
            } else {
                wizard.current.prev();
            }
            return true;
        };
        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            backAction
        );
        return () => backHandler.remove();
    }, [currentStep]);
    const retrieveData = async () => {
        try {
            setLoading(true);
            let iClientId = await AsyncStorage.getItem('clientId');
            let iUserId = await AsyncStorage.getItem('userId');
            setClientId(iClientId);
            setUserId(iUserId);
            console.log(RegisterId , 'List');
            if (RegisterId != 0) {
                let data = {
                    ClientId: iClientId,
                    UserId: iUserId,
                    RegisterId: RegisterId,
                    type: 'geteditdata'
                };
                const response = await Idle(data);
                const datas = await response.json();
                const RegData = datas.regList;
                setCostcentreId(RegData.CostCentreId);
                setCCName(RegData.CostCentreName);
                if (RegData.IdleType == 'R') setentryType('2');
                else setentryType('1');
                setApprove(RegData.Approve);
                setRemarks(RegData.Narration);
  
                setAssetData(datas.assetList);
                setAssetListItems(datas.assetList);
                setMAssetData(datas.assetList);
                setAssetGroupData(datas.resList);
                setidletrans(datas.transList);
            } else {
                let data = {
                    ClientId: iClientId,
                    UserId: iUserId,
                    type: 'getentrydata'
                };
                const response = await Idle(data);
                const datas = await response.json();
                console.log(datas, 'List');
                setlistItems(datas.CostCentreList);
                setData(datas.CostCentreList);
                getCurrentLocation();
            }
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.log(error)
        }
    }
    // const getCurrentLocation = async () => {
    //    let arrObj =  await GetGeoLocation.GetLocation();
    //    console.log(arrObj,'test');
    // }
    const getCurrentLocation = async () => {
        Geocoder.init('AIzaSyDaNPyxJ7NKmZ4rC8awB-BlBh6ieH1Q9os');
        Geolocation.getCurrentPosition(position =>
            Geocoder.from(position.coords.latitude, position.coords.longitude).then(json => {
                setgLocation(json.results[0].formatted_address);
                setgLatitude(position.coords.latitude);
                setgLongitude(position.coords.longitude);
            })
        )
    }
    function open() {
        pickerRef.current.focus();
    }
    function close() {
        pickerRef.current.blur();
    }
    const onChangeSearch = (query) => {
        try {
            if (query) {
                const newData = listItems.filter(
                    function (item) {
                        const itemData = item.Name
                            ? item.Name.toUpperCase()
                            : ''.toUpperCase();
                        const textData = query.toUpperCase();
                        return itemData.indexOf(textData) > -1;
                    }
                );
                setData(newData);
                setSearch(query);
            } else {
                setData(listItems);
                setSearch(query);
            }
        } catch (error) {
            console.log(error);
        }
    };
    // const onChangeSearchVendor = (query) => {
    //     try {
    //         if (query) {
    //             const newData = listItemsvendor.filter(
    //                 function (item) {
    //                     const itemData = item.VendorName
    //                         ? item.VendorName.toUpperCase()
    //                         : ''.toUpperCase();
    //                     const textData = query.toUpperCase();
    //                     return itemData.indexOf(textData) > -1;
    //                 }
    //             );
    //             setvendordata(newData);
    //             setSearchvendor(query);
    //         } else {
    //             setvendordata(listItemsvendor);
    //             setSearchvendor(query);
    //         }
    //     } catch (error) {
    //         console.log(error);
    //     }
    // };
    const actionOnRow = async (item) => {
        setCCName(item.Name);
        setModalVisible(false);
        var iCostcentreId = item.Id;
        setCostcentreId(iCostcentreId);
        if (entryType == 2) slistType = 'InUse';
        else slistType = 'Idle';
        let data = {
            ClientId: ClientId,
            UserId: UserId,
            CostCentreId: iCostcentreId,
            listType: slistType,
            type: 'getAssetList'

        };
        const response = await Idle(data)
        var datas = await response.json();
        setAssetData(datas.assetList);
        setAssetListItems(datas.assetList);
        setMAssetData(datas.assetList);
        setAssetGroupData(datas.resList);
    }
    const actionOnRowAsset = async (item) => {
        if (item.length > 0) {
            let sAssetIds = '';
            item.map((userData) => {
                sAssetIds = sAssetIds + userData.toString() + ','
            });
            getAsset(sAssetIds);
            setAssetModalVisible(false);
            wizard.current.next();
        } else {
            alert('Select Asset');
            setAssetModalVisible(true);
        }
    }
    const actionOnRowAssetAdd = async (item) => {
        if (item.length > 0) {
            let sAssetIds = '';
            item.map((userData) => {
                sAssetIds = sAssetIds + userData.toString() + ','
            });
            getAsset(sAssetIds);
            setAssetAddModalVisible(false);
        } else {
            alert('Select Asset');
            setAssetAddModalVisible(true);
        }
    }
    const onChangeSearchAsset = (query) => {
        try {
            if (query) {
                const newData = assetListItems.filter(
                    function (item) {
                        const itemData = item.Name
                            ? item.Name.toUpperCase()
                            : ''.toUpperCase();
                        const textData = query.toUpperCase();
                        return itemData.indexOf(textData) > -1;
                    }
                );
                setAssetData(newData);
                setAssetSearch(query);
            } else {
                setAssetData(assetListItems);
                setAssetSearch(query);
            }
        } catch (error) {
            console.log(error);
        }
    };
    // const actionOnRowVendor = async (item) => {
    //     setVendorName(item.VendorName);
    //     setmodalVisibleVendor(false);
    //     let ivendorId = item.VendorId;
    //     setvendorId(ivendorId);
    //     console.log(item, item.VendorId, ivendorId, 'vendor');
    //     let data = {
    //         ClientId: ClientId,
    //         UserId: UserId,
    //         CostCentreId: CostcentreId,
    //         VendorId: ivendorId,
    //         type: 'getOrder'
    //     };
    //     console.log(data);
    //     const response = await Idledata(data)
    //     var dataa = await response.json();
    //     setorderdata(dataa);
    //     console.log(orderdata, 'test');
    //     // if (item.TrackType == 'B') setBulkAsset(1);
    //     // else setBulkAsset(0);
    //     // setStock(item.Qty);
    // }
    function handleChange() {
        // Here, we invoke the callback with the new value
        setModalVisible(false)
    }
    // function handleChangeVendor() {
    //     // Here, we invoke the callback with the new value
    //     setmodalVisibleVendor(false)
    // }

    function showAssetList() {
        if (idletrans.length > 0 || RegisterId != 0) {
            wizard.current.next();
        } else {
            if (CostcentreId == 0) {
                alert("Select CostCentre");
                return;
            }
            setAssetModalVisible(true);
        }
    }
    function removeAssetData() {
        if (idletrans.length > 0) {
            let tmptrans = [...assetListItems];
            idletrans.map((userData) => {
                let iAssetId = userData.AssetId;
                let index = tmptrans.findIndex(el => el.Id === iAssetId);
                if (index !== -1) tmptrans.splice(index, 1);
            });
            setAssetData(tmptrans);
            setAssetListItems(tmptrans);
        };
    }
    function closeform() {
        if (RegisterId == 0) {
            Alert.alert("Exit!", "Are you sure to exit from this screen?", [
                {
                    text: "NO",
                    onPress: () => null,
                    style: "cancel"
                },
                { text: 'YES', onPress: () => props.navigation.goBack() },
            ]);
        } else {
            props.navigation.goBack();
        }
    }
    function submitform() {
        if (submitClick == true) return;
        setsubmitClick(true);
        if (CostcentreId == 0) {
            setsubmitClick(false);
            alert("Select Costcentre");
            return;
        }
        if (idletrans.length == 0) {
            setsubmitClick(false);
            alert("Select Asset");
            return;
        }
        let bQtyFound = false;
        for (var trans of idletrans) {
            if (CommonFun.FloatVal(trans['Qty']) != 0) {
                bQtyFound = true;
                break;
            }
        }
        if (bQtyFound == false) {
            setsubmitClick(false);
            alert("No Qty Entered")
            return;
        }
        setLoading(true);
        updateData();
    }
    function deleteRow(argId) {
        Alert.alert(
            'Delete Confirmation!',
            'Are you sure you want to delete?',
            [
                { text: 'Cancel', onPress: () => console.log('cancel') },
                { text: 'OK', onPress: () => deleteAssetRow(argId) },
            ],
            { cancelable: false }
        );
    }
    function deleteAssetRow(argId) {
        let mindex = massetData.findIndex(el => el.Id === argId);
        if (mindex !== -1) {
            let tempTrans = [...assetListItems];
            tempTrans.push(massetData[mindex]);
            setAssetData(tempTrans);
            setAssetListItems(tempTrans);
        }

        let tmptrans = [...idletrans];
        let index = tmptrans.findIndex(el => el.AssetId === argId);
        if (index !== -1) {
            tmptrans.splice(index, 1);
            setidletrans(tmptrans);
        }
    }
    const updateData = async () => {
        try {
            let data = {
                ClientId: ClientId,
                UserId: UserId,
                RegisterId: RegisterId,
                CostcentreId: CostcentreId,
                assetType: assetType,
                entryType: entryType,
                vendorId: vendorId,
                orderId: orderId,
                trans: idletrans,
                remarks: remarks,
                gLocation: gLocation,
                gLatitude: gLatitude,
                gLongitude: gLongitude,
                type: "update",
            };
            const response = await Idle(data);
            const datas = await response.json();
            if (datas.Status === "Success") {
                // alert("Updated Sucessfully");
                props.navigation.navigate('IdleMenu');
            } else {
                alert(datas.Status);
                setLoading(false);
                setsubmitClick(false);
            }
        } catch (error) {
            console.log(error);
            setLoading(false);
            setsubmitClick(false);
        }
    }
    function assethandleChange() {
        setAssetModalVisible(false)
    }
    function AssetAddhandleChange() {
        setAssetAddModalVisible(false)
    }
    const getAsset = async (sAssetIds) => {
        try {
            let data = {
                ClientId: ClientId,
                UserId: UserId,
                CostCentreId: CostcentreId,
                assetIds: sAssetIds,
                entryType: entryType,
                type: "getAssetData",
            };
            const response = await Idle(data);
            const datas = await response.json();
            let tempTrans = [...idletrans];
            tempTrans.push(...datas);
            setidletrans(tempTrans);
        } catch (error) {
            console.log(error)
        }
    }
    function checkQty(argValue, argId) {
        let dQty = argValue;
        let tmptrans = [...idletrans];
        let index = tmptrans.findIndex(el => el.AssetId === argId);
        let dAQty = CommonFun.FloatVal(tmptrans[index]['AvailQty']);
        if (CommonFun.FloatVal(dQty) > dAQty) {
            alert("Qty greater than available Qty");
            dQty = 0;
        }
        tmptrans[index] = { ...tmptrans[index], Qty: dQty };
        setidletrans(tmptrans);
        return dQty;
    }
    function goNext() {
        if (currentStep == 0) {
            showAssetList();
        } else {
            wizard.current.next();
        }
    }
    const stepList = [{
        content: <View style={{ minwidth: '100%', height: '95%' }}>
            <View style={styles.row1.mtxttop}>
                <View style={{ width: '97%', marginLeft: '2.5%', marginRight: '0%', }}>
                    <View style={styles.pickerView}>
                        <Text style={[styles.labeltxt, {marginTop:20}]}>Entry Type</Text>
                        <View style={{ borderWidth: 1, borderColor: '#a7b7d9', width: "100%" ,height:45, padding:15}} pointerEvents={seldisabled}>
                            {
                                Platform.OS == 'android' ?
                                    <Picker
                                        selectedValue={entryType}
                                        style={{ height: 50, width: '100%', borderWidth: 1, padding: 0 }}
                                        themeVariant="light"
                                        onValueChange={(itemValue, itemIndex) => setentryType(itemValue)}
                                    >
                                        <Picker.Item label="Idle" value="1" />
                                        <Picker.Item label="In use" value="2" />
                                    </Picker> :
                                    <RNPickerSelect
                                        selectedValue={entryType}
                                        style={{ height: 50, width: '100%' }}
                                        placeholderTextColor="#ccc"
                                        items={[
                                            { label: 'Idle', value: '1' },
                                            { label: 'In use', value: '2' },
                                        ]}
                                        onValueChange={(itemValue, itemIndex) => setentryType(itemValue)}>
                                    </RNPickerSelect>


                            }
                        </View>
                    </View>
                </View>
            </View>
            <View style={styles.mtxttop}>
                <Text style={styles.labeltxt}>CostCentre Name</Text>
                <View style={styles.centeredView} pointerEvents={seldisabled}>
                    <SPickList visible={modalVisible} data={data} onChange={handleChange} onChangeSearch={onChangeSearch} search={search} actionOnCancel={setModalVisible} actionOnRow={actionOnRow} />
                    <Pressable
                        style={[styles.button, styles.buttonOpen]}
                        onPress={() => setModalVisible(true)}
                    >
                        <Text style={styles.textStyle}>{CCName ? CCName : 'Select CostCentre'}</Text>
                    </Pressable>
                </View>
            </View>
            <MPickListG visible={assetModalVisible} data={assetData} listdata={assetListItems} gdata={assetgroupData} onChange={assethandleChange} onChangeSearch={onChangeSearchAsset} search={assetSearch} actionOnCancel={setAssetModalVisible} actionOnRow={actionOnRowAsset} />
        </View>
    }, {
        content: <View style={{ minwidth: '100%', height: '95%' }} >
            <View style={approve == 'Y' ? styles.hide : styles.inputContainer2}>
                <TouchableOpacity onPress={() => setAssetAddModalVisible(true)}>
                    <MPickListG visible={assetAddModalVisible} data={assetData} listdata={assetListItems} gdata={assetgroupData} onChange={AssetAddhandleChange} onChangeSearch={onChangeSearchAsset} search={assetSearch} actionOnCancel={setAssetAddModalVisible} actionOnRow={actionOnRowAssetAdd} />
                    <View style={styles.btnContainernewbtn}>
                        <Icon name='add' size={20} color='#ffff' />
                        <Text style={{ color: '#ffff' }}>Add Asset</Text>
                    </View>
                </TouchableOpacity>
            </View>
            
            {/* <ScrollView> */}
                <View style={{ marginBottom: 50 }}>
                    <FlatList style={[styles.flatlist, { marginTop: 10 }]}
                        data={idletrans}
                        keyExtractor={item => item.AssetId}
                        renderItem={({ item, index }) => {
                            return <View  ><TouchableOpacity style={styles.touch}>
                                <View style={styles.Flatlistview}>
                                    <View style={styles.col7}>
                                        <Text style={styles.itemTitle2}> {item.AssetName}   <Text style={styles.unit}>({item.UnitName})</Text> </Text>
                                    </View>
                                    <View style={approve == 'Y' ? styles.hide : styles.deleteicon} >
                                        <TouchableOpacity onPress={() => deleteRow(item.AssetId)}>
                                            <Icon name='delete' size={25} color='red' />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <View style={styles.marg5}></View>
                                <View style={styles.Flatlistview}>
                                    <View style={styles.col3}>
                                        <Text style={styles.availableQty} >Avail .Qty :</Text>
                                    </View>
                                    {/* <Text style={styles.colon}>: </Text> */}
                                    <View style={styles.colw25}>
                                        <Text style={styles.itemtittle}> {CommonFun.numberDigit(parseFloat(item.AvailQty), 3)}</Text>
                                    </View>
                                    <View style={styles.col2}>
                                        <Text style={styles.enterQty}>Qty:</Text>
                                    </View>
                                    <View style={styles.col3}>
                                        <TextInput
                                            style={styles.input}
                                            keyboardType="numeric"
                                            maxLength={10}
                                            onChangeText={text => checkQty(text, item.AssetId)}
                                            value={item.Qty ? item.Qty.toString():''}
                                            editable={approve == 'Y' ? false : true}
                                        />
                                    </View>
                                </View>
                            </TouchableOpacity>
                            </View>
                        }}
                    />
                </View>
            {/* </ScrollView> */}
        </View>
    }, {
        content: <View style={{ minwidth: '100%', height: '95%' }} >
            <View style={styles.flatlist}>
                <Text style={styles.labeltxt}>Remarks</Text>
                <TextInput
                    multiline={true}
                    numberOfLines={10}
                    label="Remarks"
                    style={styles.inputremarks}
                    onChangeText={setRemarks}
                    value={remarks}
                    editable={approve == 'Y' ? false : true}
                />
            </View>
            <View style={styles.row1}>
                <View style={[styles.Flatlistview1, { marginTop: 10 }]}>
                    <View style={styles.col50}>
                        <View>
                            <TouchableOpacity style={styles.submitbtnContainer1} onPress={() => closeform()}>
                                <Text style={styles.previewtxt}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.col50}>
                        <View style={approve == 'Y' ? styles.hide : ''}>
                            <TouchableOpacity style={styles.submitbtnContainer} onPress={() => submitform()}>
                                <Text style={styles.previewtxt}>Submit</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    }]
    return (
        <>
            <Loader loading={loading} />
            <View
                style={[wizardShow == false ? styles.hide : '', {
                    justifyContent: "space-between", flexDirection: "row", backgroundColor: "#ffff",
                    borderBottomColor: "#dedede", borderBottomWidth: 1,marginTop: 2, marginBottom: 2
                }]}>
                <Button disabled={isFirstStep} title="Prev" color={COLORS.primary}  onPress={() => wizard.current.prev()} />
                <Text>Step {currentStep + 1}. of 3</Text>
                <Button disabled={isLastStep} title="Next" color={COLORS.primary}  onPress={() => goNext()} />
            </View>
            <View style={{ width: '100%' }}>
                <Wizard style={{ backgroundColor: 'yellow' }}
                    ref={wizard}
                    steps={stepList}
                    isFirstStep={val => setIsFirstStep(val)}
                    isLastStep={val => setIsLastStep(val)}
                    currentStep={({ currentStep, isLastStep, isFirstStep }) => {
                        setCurrentStep(currentStep)
                    }}
                />
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                    {stepList.map((val, index) => (
                        <View
                            key={"step-indicator-" + index}
                            style={{
                                width: 10, marginHorizontal: 6, height: 10, borderRadius: 5,
                                backgroundColor: index === currentStep ? "#141c12" : "#9ea69c",
                            }}
                        />
                    ))}
                </View>
            </View>
        </>
    );
}
export default IdleEntry;
const styles = StyleSheet.create({
    btnContainernewbtn: {
        flexDirection: 'row',
        backgroundColor: COLORS.green,
        padding: 5,
        borderRadius: 5,
        // marginLeft: '65%',
        maxWidth: '50%',
        alignItems: "center",
        justifyContent: "center",
    },
    mtop: {
        marginTop: 30,
    },
    mtxttop: {
        margin: 10,
    },
    labeltxt: {
        color: FONTCOLORS.primary,
        fontWeight: 'bold'
    },
    hide: {
        display: 'none'
    },
    // show: {
    //     display:'block'
    // },
    input: {
        height: 35,
        borderWidth: 1,
        padding: 10,
        width: '30%',
        marginRight: '55%',
        borderWidth: 1,
        borderColor: '#a7b7d9',
        textAlign: 'right'
    },
    inputremarks: {
        borderWidth: 1,
        width: '100%',
        backgroundColor: 'transparent',
        borderColor: '#a7b7d9',
        textAlign: 'left',
        height: 70,
        justifyContent: "flex-start",
        paddingLeft: 15,
        paddingRight: 10,
    },
    button: {
        // borderRadius: 20,
        padding: 15,
        // elevation: 2,
        backgroundColor: 'transparent',
        borderWidth: 1,
        // bordercolor:'black'

        borderColor: '#a7b7d9'
    },
    touch: {
        flexDirection: 'column',
        backgroundColor: 'white',
        marginTop: 1,
        marginBottom: 1,
        padding: 5,
        justifyContent: 'flex-start',
        borderLeftWidth: 4,
        borderLeftColor: "#040485",
        borderRightWidth: 2,
        borderTopWidth: 2,
        borderBottomWidth: 2,
        borderTopColor: '#cad4e8',
        borderRightColor: '#cad4e8',
        borderBottomColor: '#cad4e8',
        fontSize: 24,
        fontWeight: 'bold',
        shadowColor: "#000",
        shadowOpacity: 0.8,
        shadowRadius: 2,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.29,
        shadowRadius: 4.65,
        elevation: 7,
    },
    itemTitle: {
        color: 'black',
        paddingBottom: 10,
        fontWeight: 'bold',
    },
    flatlist: {
        fontSize: 20,
        paddingHorizontal: 5,
        paddingVertical: 5,
        fontWeight: 'bold',
        width: '98%',
        marginRight: '1%',
        marginLeft: '1%',
    },
    itemTitle1: {
        flex: 0,
        color: 'black',
        fontWeight: 'bold',
        textAlign: 'right',
        paddingTop: 10,
        paddingHorizontal: 15,
        paddingVertical: 10,
    },
    unit: {
        flex: 0,
        color: 'black',
        // fontWeight: 'bold',
        textAlign: 'right',
        paddingTop: 10,
        paddingRight: 10,
        fontSize: 13,
    },
    Flatlistview: {
        margin: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 5,
    },
    Flatlistview1: {
        margin: 0,
        flexDirection: 'row',
        width: '100%',
        alignContent: 'space-between',
        padding: 0,

    },
    previewtxt: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'bold',
    },
    btnContainer: {
        flexDirection: 'row',
        backgroundColor: COLORS.primary,
        padding: 5,
        borderRadius: 5,
        maxWidth: '40%',
        // marginTop: '5%',
        marginLeft: '5%',
        alignItems: "center",
        justifyContent: "center",
    },
    submitbtnContainer: {
        flexDirection: 'row',
        backgroundColor: COLORS.primary,
        marginRight: 0,
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 5,
        borderRadius: 5,
        maxWidth: '40%',
        marginLeft: '35%',
        alignItems: "center",
        justifyContent: "center",
    },
    submitbtnContainer1: {
        flexDirection: 'row',
        backgroundColor: '#99a1ad',
        marginRight: 0,
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 5,
        borderRadius: 5,
        maxWidth: '40%',
        marginLeft: '35%',
        alignItems: "center",
        justifyContent: "center",
    },
    Containerremarks: {
        Width: '100%',
    },
    btnIcon: {
        marginTop: 4, height: 20, width: 20,
    },
    itemtittle: {
        color: '#646569',
        textAlign: 'left',
        padding: 2,
        // minWidth: 100,
        fontSize: 14
    },
    row1: {
        marginTop: 2,
        flexDirection: "row",
        flexWrap: "wrap",

        PaddingBottom: 10,
    },
    Flatlistview1: {
        margin: 0,
        flexDirection: 'row',
        width: '100%',
        alignContent: 'space-between',
        padding: 0,
        alignItems: "center",
        justifyContent: "center",
    },
    inputContainer2: {
        paddingTop: 1,
        width: "49%",
        margin: 1,
        padding: 1,
    },
    inputContainerhide2: {
        paddingTop: 1,
        width: "49%",
        margin: 1,
        padding: 1,
        display: 'none'
    },
    inputContainer: {
        width: "98%",
        marginLeft: '0%',
    },
    pickerView: {
        width: "98%",
        marginLeft: '0%',
        // backgroundC0olor: 'red',
    },
    row: {
        marginTop: 2,
        flexDirection: "row",
        flexWrap: "wrap",
        shadowColor: "#000",
        shadowOpacity: 0.8,
        shadowRadius: 2,
        backgroundColor: '#fff',
        PaddingBottom: 10,
    },
    btnContainerprenxt: {
        flexDirection: 'row',
        backgroundColor: COLORS.primary,
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 5,
        borderRadius: 5,
        maxWidth: '100%',
        marginLeft: '10%',
        alignItems: "center",
        justifyContent: "center",
    },
    col7: {
        width: '82%',
    },
    col2: {
        width: '18%',
    },
    col3: {
        width: '29%',
    },
    colw25: {
        width: '20%',
    },
    colon: {
        paddingTop: 10,
    },
    itemtittle: {
        paddingTop: 10,
        color: '#5c6773',
    },
    input: {
        height: 40,
        paddingHorizontal: 5,
        paddingVertical: 10,
        width: '100%',
        borderWidth: 1,
        borderColor: '#a7b7d9',
        textAlign: 'right',
        color: 'black',
        fontWeight: 'bold',
        fontSize: 13,
    },
    itemTitle2: {
        textAlign: 'center', // <-- the magic
        fontSize: 16,
        marginTop: 0,
        width: '100%',
        color: '#022969'
    },
    availableQty: {
        paddingTop: 10,
        color: '#02691a',
        fontWeight: 'bold',
    },
    enterQty: {
        paddingTop: 10,
        color: '#067a96',
        fontWeight: 'bold',
    },
    deletetext: {
        color: '#fff',
        textAlign: 'center',
    },
    deleteicon: {
        backgroundColor: '#fff',
        paddingHorizontal: 1,
        paddingVertical: 2,
        borderRadius: 5,
        width: '18%',
    },
    marg5: {
        margin: 2,
    },
    nextContainer: {
        marginTop: 15,
        width: "35%",
        marginLeft: '60%',
        marginVertical: 1,
        padding: 1,
    },
    textStyle: {
        color: 'black',
    },
    btnIcon: {
        marginTop: 0, height: 20, marginRight: 10,
    },
    col50: {
        width: '50%',
    },
})