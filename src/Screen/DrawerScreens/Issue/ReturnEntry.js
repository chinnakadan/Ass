import { useState, useEffect, useRef } from 'react';
import React from 'react';
import { Text, View, StyleSheet, Pressable, FlatList, TouchableOpacity, Alert, Platform, Modal, Button, TextInput, BackHandler, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-community/async-storage';;
import { Searchbar } from 'react-native-paper';
import Icon from 'react-native-elements/dist/icons/Icon';
import { ToastAndroid } from 'react-native';
import { Issue } from '../../../service/api/apiservice';
import Loader from '../../Components/Loader';
import Wizard from "react-native-wizard"
import SPickList from '../../Components/sPickList';
import MPickList from '../../Components/mPickList';
import Geolocation from '@react-native-community/geolocation';
import Geocoder from 'react-native-geocoding';
import CommonFun from '../../Components/CommonFun';
import { COLORS, FONTCOLORS } from '../../theme/theme';
import RNPickerSelect from 'react-native-picker-select';

const ReturnEntry = (props) => {
    const { RegisterId } = props.route.params;

    const wizard = useRef()
    const [isFirstStep, setIsFirstStep] = useState(true)
    const [isLastStep, setIsLastStep] = useState(false)
    const [currentStep, setCurrentStep] = useState(0)

    const [ClientId, setClientId] = useState('');
    const [UserId, setUserId] = useState('');

    const [ccListItems, setCCListItems] = useState([]);
    const [ccData, setCCData] = useState([]);
    const [ccSearch, setCCSearch] = useState('');
    const [selectedAsset, setselectedAsset] = useState([]);
    const [approve, setApprove] = useState('N');

    const [empListItems, setEmpListItems] = useState([]);
    const [empData, setEmpData] = useState([]);
    const [empSearch, setEmpSearch] = useState('');

    const [vendorListItems, setVendorListItems] = useState([]);
    const [vendorData, setVendorData] = useState([]);
    const [vendorSearch, setVendorSearch] = useState('');

    const [assetListItems, setAssetListItems] = useState([]);
    const [assetData, setAssetData] = useState([]);
    const [massetData, setMAssetData] = useState([]);
    const [assetSearch, setAssetSearch] = useState('');

    const [ccId, setCCId] = useState(0);
    const [ccName, setCCName] = useState('');

    const [empId, setEmpId] = useState(0);
    const [empName, setEmpName] = useState('');

    const [vendorId, setVendorId] = useState(0);
    const [vendorName, setVendorName] = useState('');

    const [ccModalVisible, setCCModalVisible] = useState(false);
    const [empModalVisible, setEmpModalVisible] = useState(false);
    const [vendorModalVisible, setVendorModalVisible] = useState(false);
    const [assetModalVisible, setAssetModalVisible] = useState(false);
    const [assetAddModalVisible, setAssetAddModalVisible] = useState(false);

    const [issueType, setIssueType] = useState(1);
    const [issueTrans, setIssueTrans] = useState([]);
    const [seldisabled, setseldisabled] = useState('auto');

    const [loading, setLoading] = useState(false);
    const [remarks, setRemarks] = React.useState("");
    const [submitClick, setsubmitClick] = useState(false);
    const [wizardShow, setwizardShow] = useState(false);
    const [gLatitude, setgLatitude] = useState(0);
    const [gLongitude, setgLongitude] = useState(0);
    const [gLocation, setgLocation] = useState('');
    useEffect(() => {
        if (ccData.length == 0) retrieveData();
    }, [ClientId, UserId]);
    useEffect(() => {
        if (ccId != 0) setwizardShow(true);
        else setwizardShow(false);
    }, [ccId]);
    useEffect(() => {
        removeAssetData();
        if (issueTrans.length > 0) setseldisabled('none');
        else setseldisabled('auto');
    }, [issueTrans]);
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
            if (RegisterId != 0) {
                let data = {
                    ClientId: iClientId,
                    UserId: iUserId,
                    RegisterId: RegisterId,
                    type: 'geteditreturndata'
                };
                const response = await Issue(data);
                const datas = await response.json();
                const RegData = datas.regList;
                setCCId(RegData.CostCentreId);
                setCCName(RegData.CostCentreName);
                setVendorId(RegData.VendorId);
                setVendorName(RegData.VendorName);
                setEmpId(RegData.EmployeeId);
                setEmpName(RegData.EmpName);
                if (RegData.ReturnType == 'C') setIssueType('2');
                else setIssueType('1');
                setApprove(RegData.Approve);
                setRemarks(RegData.Narration);
                setAssetData(datas.assetList);
                setAssetListItems(datas.assetList);
                setMAssetData(datas.assetList);
                setIssueTrans(datas.transList);
            } else {
                let data = {
                    ClientId: iClientId,
                    UserId: iUserId,
                    type: "getReturnentryData",
                };
                const response = await Issue(data)
                const datas = await response.json();
                setCCData(datas);
                setCCListItems(datas);
                getCurrentLocation();
            }
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.log(error)
        }
    }
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
    const onChangeSearchCC = (query) => {
        try {
            if (query) {
                const newData = ccListItems.filter(
                    function (item) {
                        const itemData = item.Name
                            ? item.Name.toUpperCase()
                            : ''.toUpperCase();
                        const textData = query.toUpperCase();
                        return itemData.indexOf(textData) > -1;
                    }
                );
                setCCData(newData);
                setCCSearch(query);
            } else {
                setCCData(ccListItems);
                setCCSearch(query);
            }
        } catch (error) {
            console.log(error);
        }
    };
    const onChangeSearchEmp = (query) => {
        try {
            if (query) {
                const newData = empListItems.filter(
                    function (item) {
                        const itemData = item.Name
                            ? item.Name.toUpperCase()
                            : ''.toUpperCase();
                        const textData = query.toUpperCase();
                        return itemData.indexOf(textData) > -1;
                    }
                );
                setEmpData(newData);
                setEmpSearch(query);
            } else {
                setEmpData(empListItems);
                setEmpSearch(query);
            }
        } catch (error) {
            console.log(error);
        }
    };
    const onChangeSearchVendor = (query) => {
        try {
            if (query) {
                const newData = vendorListItems.filter(
                    function (item) {
                        const itemData = item.Name
                            ? item.Name.toUpperCase()
                            : ''.toUpperCase();
                        const textData = query.toUpperCase();
                        return itemData.indexOf(textData) > -1;
                    }
                );
                setVendorData(newData);
                setVendorSearch(query);
            } else {
                setVendorData(vendorListItems);
                setVendorSearch(query);
            }
        } catch (error) {
            console.log(error);
        }
    };
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
    const actionOnRowCC = async (item) => {
        setCCName(item.Name);
        setCCModalVisible(false);
        var iCostcentreId = item.Id;
        setCCId(iCostcentreId);
        let data = {
            ClientId: ClientId,
            UserId: UserId,
            CostCentreId: iCostcentreId,
            type: 'getVendorEmpData'

        };
        const response = await Issue(data)
        var datas = await response.json();
        setVendorData(datas.vendorList);
        setVendorListItems(datas.vendorList);
        setEmpData(datas.empList);
        setEmpListItems(datas.empList);
    }
    const actionOnRowEmp = async (item) => {
        setEmpName(item.Name);
        setEmpModalVisible(false);
        var iEmpId = item.Id;
        setEmpId(iEmpId);
        let data = {
            ClientId: ClientId,
            UserId: UserId,
            CostCentreId: ccId,
            VendorId: 0,
            IssueType: issueType,
            empId: iEmpId,
            type: 'getIssueList'
        };
        const response = await Issue(data)
        var datas = await response.json();
        setAssetData(datas);
        setAssetListItems(datas);
        setMAssetData(datas);
    }
    const actionOnRowVendor = async (item) => {
        setVendorName(item.Name);
        setVendorModalVisible(false);
        var iVendorId = item.Id;
        setVendorId(iVendorId);
        let data = {
            ClientId: ClientId,
            UserId: UserId,
            CostCentreId: ccId,
            VendorId: iVendorId,
            IssueType: issueType,
            empId: 0,
            type: 'getIssueList'
        };
        const response = await Issue(data)
        var datas = await response.json();
        setAssetData(datas);
        setAssetListItems(datas)
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
    function removeAssetData() {
        if (issueTrans.length > 0) {
            let tmptrans = [...assetListItems];
            issueTrans.map((userData) => {
                let iAssetId = userData.IssueTransId;
                let index = tmptrans.findIndex(el => el.Id === iAssetId);
                if (index !== -1) tmptrans.splice(index, 1);
            });
            setAssetData(tmptrans);
            setAssetListItems(tmptrans);
        };
    }
    function ccHandleChange() {
        setCCModalVisible(false)
    }
    function empHandleChange() {
        setEmpModalVisible(false)
    }
    function vendorhandleChange() {
        setVendorModalVisible(false)
    }
    function assethandleChange() {
        setAssetModalVisible(false)
    }
    function AssetAddhandleChange() {
        setAssetAddModalVisible(false)
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
        if (ccId == 0) {
            setsubmitClick(false);
            alert("Select Costcentre");
            return;
        }
        if (issueTrans.length == 0) {
            setsubmitClick(false);
            alert("Select Asset");
            return;
        }
        let bQtyFound = false;
        for (var trans of issueTrans) {
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
        Alert.alert('Delete Confirmation!', 'Are you sure you want to delete?',
            [{ text: 'Cancel', onPress: () => console.log('cancel') },
            { text: 'OK', onPress: () => deleteAssetRow(argId) },],
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
        let tmptrans = [...issueTrans];
        let index = tmptrans.findIndex(el => el.IssueTransId === argId);
        if (index !== -1) {
            tmptrans.splice(index, 1);
            setIssueTrans(tmptrans);
        }
    }
    function showAssetList() {
        if (issueTrans.length > 0 || RegisterId != 0) {
            wizard.current.next();
        } else {
            if (ccId == 0) {
                alert("Select CostCentre");
                return;
            }
            // if (issueType == 1) {
            //     if (empId == 0) {
            //         alert("Select Employee");
            //         return;
            //     }
            // } else {
            //     if (vendorId == 0) {
            //         alert("Select Vendor");
            //         return;
            //     }
            // }
            setAssetModalVisible(true);
        }
    }
    const updateData = async () => {
        try {
            let data = {
                ClientId: ClientId,
                UserId: UserId,
                RegisterId: RegisterId,
                CostcentreId: ccId,
                issueType: issueType,
                vendorId: vendorId,
                empId: empId,
                trans: issueTrans,
                remarks: remarks,
                gLocation: gLocation,
                gLatitude: gLatitude,
                gLongitude: gLongitude,
                type: "updateReturn",
            };
            const response = await Issue(data);
            const datas = await response.json();
            if (datas.Status === "Success") {
                // alert("Updated Sucessfully");
                props.navigation.navigate('IssueMenu');
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
    const getAsset = async (sAssetIds) => {
        try {
            if (sAssetIds == '') return;
            let data = {
                ClientId: ClientId,
                UserId: UserId,
                issueTransIds: sAssetIds,
                type: "getIsseData",
            };
            const response = await Issue(data);
            const datas = await response.json();
            let tempTrans = [...issueTrans];
            tempTrans.push(...datas);
            setIssueTrans(tempTrans);
        } catch (error) {
            console.log(error)
        }
    }
    function goNext() {
        if (currentStep == 0) {
            showAssetList();
        } else {
            wizard.current.next();
        }
    }
    function checkQty(argValue, argId) {
        let dQty = argValue;
        let tmptrans = [...issueTrans];
        let index = tmptrans.findIndex(el => el.IssueTransId === argId);
        let dAQty = CommonFun.FloatVal(tmptrans[index]['AvailQty']);
        if (CommonFun.FloatVal(dQty) > dAQty) {
            alert("Qty greater than available Qty");
            dQty = 0;
        }
        tmptrans[index] = { ...tmptrans[index], Qty: dQty };
        setIssueTrans(tmptrans);
        return dQty;
    }
    const stepList = [{
        content: <View style={{ minwidth: '100%', height: '95%' }}>
            <View style={styles.mtxttop}>
                <Text style={styles.labeltxt}>CostCentre Name</Text>
                <View style={styles.centeredView} pointerEvents={seldisabled}>
                    <SPickList visible={ccModalVisible} data={ccData} onChange={ccHandleChange} onChangeSearch={onChangeSearchCC} search={ccSearch} actionOnCancel={setCCModalVisible} actionOnRow={actionOnRowCC} />
                    <Pressable
                        style={[styles.button, styles.buttonOpen]}
                        onPress={() => setCCModalVisible(true)}
                    >
                        <Text style={styles.textStyle}>{ccName ? ccName : 'Select CostCentre'}</Text>
                    </Pressable>
                </View>
            </View>
            <View style={styles.row1.mtxttop}>
                {/* <View style={styles.Flatlistview}> */}
                <View style={{ width: '97%', marginLeft: '2.5%', marginRight: '0%', }}>
                    <View style={styles.pickerView}>
                        <Text style={styles.labeltxt}>Issue Type</Text>
                        <View style={{ borderWidth: 1, borderColor: COLORS.brdleftblue, width: "100%", height:50, paddingLeft:10, paddingTop:15 }} pointerEvents={seldisabled}>
                            {Platform.OS == 'android' ?
                                <Picker
                                    selectedValue={issueType}
                                    style={{ height: 50, width: '100%', borderWidth: 1, padding: 0 }}
                                    onValueChange={(itemValue, itemIndex) => setIssueType(itemValue)}
                                >
                                    <Picker.Item label="Employee" value="1" />
                                    <Picker.Item label="Vendor" value="2" />
                                </Picker>
                                :
                                <RNPickerSelect
                                    selectedValue={issueType}
                                    style={{ height: 50, width: '100%', borderWidth: 1, padding: 0 }}
                                    items={[
                                        { label: 'Employee', value: '1' },
                                        { label: 'Vendor', value: '2' }
                                    ]}
                                    onValueChange={(itemValue, itemIndex) => setIssueType(itemValue)}>
                                </RNPickerSelect>
                            }
                        </View>
                    </View>
                </View>
                {/* </View> */}
            </View>
            <View style={issueType == 1 ? styles.mtxttop : styles.hide}>
                <Text style={styles.labeltxt}>Employee Name</Text>
                <View style={styles.centeredView} pointerEvents={seldisabled}>
                    <SPickList visible={empModalVisible} data={empData} onChange={empHandleChange} onChangeSearch={onChangeSearchEmp} search={empSearch} actionOnCancel={setEmpModalVisible} actionOnRow={actionOnRowEmp} />
                    <Pressable
                        style={[styles.button, styles.buttonOpen]}
                        onPress={() => setEmpModalVisible(true)}
                    >
                        <Text style={styles.textStyle}>{empName ? empName : 'Select Employee Name'}</Text>
                    </Pressable>
                </View>
            </View>
            <View style={issueType == 2 ? styles.mtxttop : styles.hide}>
                <Text style={styles.labeltxt}>Vendor Name</Text>
                <View style={styles.centeredView} pointerEvents={seldisabled}>
                    <SPickList visible={vendorModalVisible} data={vendorData} onChange={vendorhandleChange} onChangeSearch={onChangeSearchVendor} search={vendorSearch} actionOnCancel={setVendorModalVisible} actionOnRow={actionOnRowVendor} />
                    <Pressable
                        style={[styles.button, styles.buttonOpen]}
                        onPress={() => setVendorModalVisible(true)}
                    >
                        <Text style={styles.textStyle}>{vendorName ? vendorName : 'Select Vendor Name'}</Text>
                    </Pressable>
                </View>
            </View>
            <MPickList visible={assetModalVisible} data={assetData} onChange={assethandleChange} onChangeSearch={onChangeSearchAsset} search={assetSearch} actionOnCancel={setAssetModalVisible} actionOnRow={actionOnRowAsset} />
        </View>
    }, {
        content: <View style={{ minwidth: '100%', height: '95%' }} >
            <View style={approve == 'Y' ? styles.hide : styles.inputContainer2}>
                <TouchableOpacity onPress={() => setAssetAddModalVisible(true)}>
                    <MPickList visible={assetAddModalVisible} data={assetData} onChange={AssetAddhandleChange} onChangeSearch={onChangeSearchAsset} search={assetSearch} actionOnCancel={setAssetAddModalVisible} actionOnRow={actionOnRowAssetAdd} />
                    <View style={styles.btnContainernewbtn}>
                        <Icon name='add' size={20} color='#ffff' />
                        <Text style={{ color: '#ffff' }}>Add Asset</Text>
                    </View>
                </TouchableOpacity>
            </View>
            {/* <ScrollView> */}
            <View style={{ marginBottom: 50 }}>
                <FlatList style={[styles.flatlist, { marginTop: 10 }]}
                    data={issueTrans}
                    keyExtractor={item => item.IssueTransId}
                    renderItem={({ item, index }) => {
                        return <View  ><TouchableOpacity style={styles.touch}>
                            <View style={styles.Flatlistview}>
                                <View style={styles.col7}>
                                    <Text style={styles.itemTitle2}> {item.IssueNo.slice(0, 15)}   <Text style={styles.unit}>({item.IssueDate})</Text> </Text>
                                </View>
                                <View style={approve == 'Y' ? styles.hide : styles.deleteicon} >
                                    <TouchableOpacity onPress={() => deleteRow(item.IssueTransId)}>
                                        {/* <Text style={styles.deletetext}>Delete</Text> */}
                                        <Icon name='delete' size={25} color='red' />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={styles.marg5}></View>
                            <View style={styles.Flatlistview}>
                                <View style={styles.col3}>
                                    <Text style={styles.itemtittle} >Asset Name</Text>
                                </View>
                                <Text style={styles.colon}>: </Text>
                                <View style={styles.col7}>
                                    <Text style={styles.assetname}>  {item.AssetName.slice(0, 15)}</Text>
                                </View>
                            </View>
                            <View style={styles.Flatlistview}>
                                <View style={styles.col3}>
                                    <Text style={styles.itemtittle} >Return Type</Text>
                                </View>
                                <Text style={styles.colon}>: </Text>
                                <View style={styles.col7}>
                                    <Text style={styles.assetname}>  {item.IssueType.slice(0, 15)}</Text>
                                </View>
                            </View>
                            <View style={styles.Flatlistview}>
                                <View style={styles.col3}>
                                    <Text style={styles.itemtittle} >Return From</Text>
                                </View>
                                <Text style={styles.colon}>: </Text>
                                <View style={styles.col7}>
                                    <Text style={styles.assetname}>  {item.IssueTo.slice(0, 15)}</Text>
                                </View>
                            </View>
                            <View style={styles.Flatlistview}>
                                <View style={styles.col3}>
                                    <Text style={styles.availableQty} >Avail .Qty :</Text>
                                </View>
                                <View style={styles.colw25}>
                                    <Text style={styles.itemtittle}> {CommonFun.numberDigit(parseFloat(item.AvailQty), 3)}</Text>
                                </View>
                                <View style={styles.col2}>
                                    <Text style={styles.enterQty}>Qty:</Text>
                                </View>
                                <View style={styles.col3}>
                                    <TextInput
                                        style={styles.input}
                                        value={item.Qty ? item.Qty.toString() : ''}
                                        keyboardType="numeric"
                                        maxLength={10}
                                        onChangeText={text => checkQty(text, item.IssueTransId)}
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
                    borderBottomColor: "#dedede", borderBottomWidth: 1, marginTop: 2, marginBottom: 2
                }]}>
                <Button disabled={isFirstStep} title="Prev" color={COLORS.primary} onPress={() => wizard.current.prev()} />
                <Text>Step {currentStep + 1}. of 3</Text>
                <Button disabled={isLastStep} title="Next" color={COLORS.primary} onPress={() => goNext()} />
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
export default ReturnEntry;
const styles = StyleSheet.create({
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
    input: {
        height: 35,
        borderWidth: 1,
        padding: 10,
        width: '30%',
        marginRight: '55%',
        borderWidth: 1,
        borderColor: COLORS.brdleftblue,
        textAlign: 'right'
    },
    inputremarks: {
        borderWidth: 1,
        width: '100%',
        backgroundColor: 'transparent',
        borderColor: COLORS.brdleftblue,
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
        borderColor: COLORS.brdleftblue,
    },
    touch: {
        flexDirection: 'column',
        backgroundColor: 'white',
        marginTop: 1,
        marginBottom: 1,
        padding: 5,
        justifyContent: 'flex-start',
        borderLeftWidth: 4,
        borderLeftColor: COLORS.brdleftblue,
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
    Flatlistview:
    {
        margin: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 5,
    },
    Flatlistview1:
    {
        margin: 0,
        flexDirection: 'row',
        width: '100%',
        alignContent: 'space-between',
        padding: 0,

    },
    previewtxt:
    {
        color: '#fff',
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'bold',
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
    Containerremarks:
    {
        Width: '100%',
    },
    btnIcon: {
        marginTop: 0, height: 20, width: 20,
    },
    itemtittle:
    {
        paddingTop: 10,
        color: '#5c6773',
    },
    row1: {
        marginTop: 2,
        flexDirection: "row",
        flexWrap: "wrap",
        // shadowColor: "#000",
        // shadowOpacity: 0.8,
        // shadowRadius: 2,
        PaddingBottom: 10,
    },
    Flatlistview1:
    {
        margin: 0,
        flexDirection: 'row',
        width: '100%',
        alignContent: 'space-between',
        padding: 0,
    },
    inputContainer2: {
        paddingTop: 1,
        width: "49%",
        margin: 1,
        padding: 1,
    },
    nextContainer:
    {
        marginTop: 15,
        width: "35%",
        marginLeft: '60%',
        marginVertical: 1,
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
    row:
    {
        marginTop: 2,
        flexDirection: "row",
        flexWrap: "wrap",
        shadowColor: "#000",
        shadowOpacity: 0.8,
        shadowRadius: 2,
        backgroundColor: COLORS.white,
        PaddingBottom: 10,
    },
    btnContainer: {
        flexDirection: 'row',
        backgroundColor: COLORS.primary,
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 5,
        borderRadius: 5,
        maxWidth: '80%',
        marginLeft: '20%',
        alignItems: "center",
        justifyContent: "center",
    },
    btnContainerprenxt: {
        flexDirection: 'row',
        backgroundColor: COLORS.primary,
        padding: 5,
        borderRadius: 5,
        maxWidth: '25%',
        marginLeft: '15%',
        alignItems: "center",
        justifyContent: "center",
    },
    btnContainernewbtn: {
        flexDirection: 'row',
        //backgroundColor: '#040485',
        backgroundColor: 'green',
        padding: 5,
        borderRadius: 5,
        // marginLeft: '65%',
        maxWidth: '50%',
        alignItems: "center",
        justifyContent: "center",
    },
    col3: {
        width: '29%',
    },
    col7: {
        width: '82%',

    },
    col2: {
        width: '18%',

    },
    col3: {
        width: '28%',
    },
    colw25: {
        width: '20%',
    },
    colon:
    {
        paddingTop: 10,
    },
    itemtittle:
    {
        paddingTop: 10,
        color: '#5c6773',
    },
    input: {
        height: 40,
        paddingHorizontal: 5,
        paddingVertical: 10,
        width: '100%',
        borderWidth: 1,
        borderColor: COLORS.brdleftblue,
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

    availableQty:
    {
        paddingTop: 10,
        color: '#02691a',
        fontWeight: 'bold',
    },
    enterQty:
    {
        paddingTop: 10,
        color: '#067a96',
        fontWeight: 'bold',
    },
    deletetext:
    {
        color: '#fff',
        textAlign: 'center',
    },
    deleteicon:
    {
        backgroundColor: '#fff',
        paddingHorizontal: 1,
        paddingVertical: 2,
        borderRadius: 5,
        width: '18%',
    },
    marg5:
    {
        margin: 2,
    }
    ,
    nexttxt:
    {
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 13,
    },
    assetname:
    {
        color: '#003885',
        textAlign: 'left',
        fontSize: 15,
        paddingLeft: 5,
        paddingTop: 10,
    },
    textStyle:
    {
        color: 'black',
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
    col50: {
        width: '50%',
    },
})