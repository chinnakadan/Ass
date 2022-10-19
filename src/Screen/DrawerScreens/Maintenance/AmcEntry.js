import { useState, useEffect } from 'react';
import React from 'react';
import { Text, View, StyleSheet, Pressable, FlatList, TouchableOpacity, Alert, Modal, Button, TextInput, BackHandler, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Label, { Orientation } from "react-native-label";
import AsyncStorage from '@react-native-community/async-storage';;
import { Searchbar } from 'react-native-paper';
import Icon from 'react-native-elements/dist/icons/Icon';
import { ToastAndroid } from 'react-native';
import { Maintentance } from '../../../service/api/apiservice';
import Loader from '../../Components/Loader';
import SPickList from '../../Components/sPickList';
import DatePicker from 'react-native-datepicker';
import Moment from 'moment';
import Geolocation from '@react-native-community/geolocation';
import Geocoder from 'react-native-geocoding';
import CommonFun from '../../Components/CommonFun';
const AmcEntry = (props) => {
    const { RegisterId, RenewalType } = props.route.params;
    const [ClientId, setClientId] = useState('');
    const [UserId, setUserId] = useState('');
    const [listItems, setlistItems] = useState([]);
    const [data, setData] = useState([]);
    const [search, setSearch] = useState('');

    const [modalVisible, setModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [remarks, setRemarks] = React.useState("");

    const [refNo, setRefNo] = useState('');
    const [refDate, setRefDate] = useState(new Date());
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [contactNo, setContactNo] = useState('');
    const [idvValue, setIdvValue] = useState('0');
    const [premium, setPremium] = useState('0');

    const [VendorName, setVendorName] = useState('');
    const [AssetName, setAssetName] = useState('');

    const [VendorId, setVendorId] = useState('0');
    const [AssetId, setAssetId] = useState('0');
    const [submitClick, setsubmitClick] = useState(false);
    const [gLatitude, setgLatitude] = useState(0);
    const [gLongitude, setgLongitude] = useState(0);
    const [gLocation, setgLocation] = useState('');
    useEffect(() => {
        if (data.length == 0) retrieveData();
        let sTitle = "AMC Renewal";
        if (RenewalType == 2) sTitle = "Insurance Renewal";
        else if (RenewalType == 2) sTitle = "Warranty Extend";
        props.navigation.setOptions({
            title: sTitle,
        });
        const backAction = () => {
            Alert.alert("Exit!", "Are you sure to exit from this screen?", [
                {
                    text: "NO",
                    onPress: () => null,
                    style: "cancel"
                },
                { text: 'YES', onPress: () => props.navigation.goBack() },
            ]);
            return true;
        };
        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            backAction
        );
        return () => backHandler.remove();
    }, [ClientId, UserId]);
    const retrieveData = async () => {
        try {
            setLoading(true);
            let iClientId = await AsyncStorage.getItem('clientId');
            let iUserId = await AsyncStorage.getItem('userId');
            setClientId(iClientId);
            setUserId(iUserId);
            let data = {
                ClientId: iClientId,
                UserId: iUserId,
                RegisterId: RegisterId,
                RenewalType: RenewalType,
                type: "getamcdata",
            };
            const response = await Maintentance(data)
            const datas = await response.json();
            const RegData = datas.regList;
            setAssetId(RegData.AssetId);
            setAssetName(RegData.AssetName);
            setVendorId(RegData.VendorId);
            setVendorName(RegData.VendorName);
            setRefNo(RegData.RefNo);
            setStartDate(RegData.FDate);
            setEndDate(RegData.TDate);
            setData(datas.vendorList);
            setlistItems(datas.vendorList);
            getCurrentLocation();
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
    const actionOnRow = async (item) => {
        setVendorName(item.Name);
        setModalVisible(false);
        var iVendorId = item.Id;
        setVendorId(iVendorId);
    }
    function handleChange() {
        setModalVisible(false)
    }
    function submitform() {
        if (submitClick == true) return;
        setsubmitClick(true);
        if (VendorId == 0) {
            setsubmitClick(false);
            alert("Select Vendor");
            return;
        }
        if (AssetId == 0) {
            setsubmitClick(false);
            alert("Select Asset");
            return;
        }
        setLoading(true);
        updateData();
    }
    const updateData = async () => {
        try {
            let mrefDate = Moment(refDate, 'DD-MM-YYYY')
            let drefDate = Moment(mrefDate).format('YYYY-MMM-DD');

            let mstartDate = Moment(startDate, 'DD-MM-YYYY')
            let dstartDate = Moment(mstartDate).format('YYYY-MMM-DD');

            let mendDate = Moment(endDate, 'DD-MM-YYYY')
            let dendDate = Moment(mendDate).format('YYYY-MMM-DD')

            let data = {
                ClientId: ClientId,
                UserId: UserId,
                RegisterId: RegisterId,
                RenewalType: RenewalType,
                VendorId: VendorId,
                VendorName: VendorName,
                AssetId: AssetId,
                Remarks: remarks,
                refNo: refNo,
                refDate: drefDate,
                startDate: dstartDate,
                endDate: dendDate,
                contactNo: contactNo,
                premium: premium,
                idvValue: idvValue,
                gLocation: gLocation,
                gLatitude: gLatitude,
                gLongitude: gLongitude,
                type: "updateAmc",
            };
            const response = await Maintentance(data);
            const datas = await response.json();
            if (datas.Status === "Success") {
                // alert("Updated Sucessfully");
                props.navigation.push('Amc');
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
    return (
        <>
            <Loader loading={loading} />
            {/* <ScrollView> */}
                <View style={styles.mtop}>

                    <View style={styles.flatlist} pointerEvents='none'>
                        <Text style={styles.labeltxt}>Asset Name</Text>
                        <TextInput
                            label="AssetName"
                            style={styles.input}
                            value={AssetName}
                        />
                    </View>
                    <View style={styles.flatlist}>
                        <Text style={styles.labeltxt}>Agency Name</Text>
                        <View style={styles.centeredView}>
                            <SPickList visible={modalVisible} data={data} onChange={handleChange} onChangeSearch={onChangeSearch} search={search} actionOnCancel={setModalVisible} actionOnRow={actionOnRow} />
                            <Pressable
                                style={[styles.button, styles.buttonOpen]}
                                onPress={() => setModalVisible(true)}
                            >
                                <Text style={styles.textStyle}>{VendorName ? VendorName : 'Select Agency'}</Text>
                            </Pressable>
                        </View>
                    </View>
                    <View style={styles.Flatlistview}>
                        <View style={styles.col50}>
                            <Text style={styles.labeltxt}>Ref No</Text>
                            <TextInput
                                label="RefNo"
                                style={styles.input}
                                onChangeText={setRefNo}
                                value={refNo}
                            />
                        </View>
                        <View style={styles.col50}>
                            <View style={styles.inputContainer.pickerView}>
                                <Text style={styles.labeltxt}>Ref Date</Text>
                                <DatePicker
                                    date={refDate} // Initial date from state
                                    style={styles.datePickerStyle}

                                    mode="date" // The enum of date, datetime and time
                                    placeholder="select date"
                                    format="DD-MM-YYYY"

                                    confirmBtnText="Confirm"
                                    cancelBtnText="Cancel"
                                    customStyles={{
                                        dateIcon: {
                                            position: 'absolute',
                                            right: 0,
                                            top: 8,
                                            marginLeft: 0,
                                        },
                                        dateInput: {
                                            marginLeft: 0,
                                            borderWidth: 1,
                                            borderColor: '#a7b7d9',
                                            justifyContent: 'flex-start',
                                            height: 50,
                                            alignItems: 'flex-start',
                                            paddingTop: 15,
                                            paddingLeft: 10,
                                            marginTop: 8,


                                        },
                                    }}
                                    onDateChange={(date) => {
                                        setRefDate(date);
                                    }}
                                />
                            </View>
                        </View>
                    </View>

                    <View style={styles.Flatlistview}>
                        <View style={styles.col50}>
                            <View style={styles.inputContainer.pickerView}>
                                <Text style={styles.labeltxt}>Cover From</Text>
                                <DatePicker
                                    date={startDate} // Initial date from state
                                    style={styles.datePickerStyle}

                                    mode="date" // The enum of date, datetime and time
                                    placeholder="select date"
                                    format="DD-MM-YYYY"

                                    confirmBtnText="Confirm"
                                    cancelBtnText="Cancel"
                                    customStyles={{
                                        dateIcon: {

                                            position: 'absolute',
                                            right: 0,
                                            top: 8,
                                            marginLeft: 0,
                                        },
                                        dateInput: {
                                            marginLeft: 0,
                                            borderWidth: 1,
                                            borderColor: '#a7b7d9',
                                            justifyContent: 'flex-start',
                                            height: 50,
                                            alignItems: 'flex-start',
                                            paddingTop: 15,
                                            paddingLeft: 10,
                                            marginTop: 8,
                                        },
                                    }}
                                    onDateChange={(date) => {
                                        setStartDate(date);
                                    }}
                                />
                            </View>
                        </View>
                        <View style={styles.col50}>
                            <View style={styles.inputContainer}>
                                <View style={styles.inputContainer.pickerView}>
                                    <Text style={styles.labeltxt}>Cover To</Text>
                                    <DatePicker
                                        date={endDate} // Initial date from state
                                        style={styles.datePickerStyle}

                                        mode="date" // The enum of date, datetime and time
                                        placeholder="select date"
                                        format="DD-MM-YYYY"

                                        confirmBtnText="Confirm"
                                        cancelBtnText="Cancel"
                                        customStyles={{
                                            dateIcon: {

                                                position: 'absolute',
                                                right: 0,
                                                top: 8,
                                                marginLeft: 0,
                                            },
                                            dateInput: {
                                                marginLeft: 0,
                                                borderWidth: 1,
                                                borderColor: '#a7b7d9',
                                                justifyContent: 'flex-start',
                                                height: 50,
                                                alignItems: 'flex-start',
                                                paddingTop: 15,
                                                paddingLeft: 10,
                                                marginTop: 8,
                                            },
                                        }}
                                        onDateChange={(date) => {
                                            setEndDate(date);
                                        }}
                                    />
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={styles.Flatlistview}>
                        <View style={styles.col50}>
                            <View style={{ marginTop: 10 }}>
                                <Text style={styles.labeltxt}>IDV Value</Text>
                                <TextInput
                                    label="Idv Value"
                                    style={styles.inputn}
                                    onChangeText={setIdvValue}
                                    keyboardType="numeric"
                                    maxLength={10}
                                    value={idvValue ? idvValue.toString() : ''}
                                />
                            </View>
                        </View>
                        <View style={styles.col50}>
                            <View style={{ marginTop: 10 }}>
                                <Text style={styles.labeltxt}>Premium Value</Text>
                                <TextInput
                                    label="Premium"
                                    style={styles.inputn}
                                    onChangeText={setPremium}
                                    keyboardType="numeric"
                                    maxLength={10}
                                    value={premium ? premium.toString() : ''}
                                />
                            </View>
                        </View>
                    </View>
                    <View style={styles.flatlist}>
                        <Text style={styles.labeltxt}>Contact No</Text>
                        <TextInput
                            label="RefNo"
                            style={styles.input}
                            onChangeText={setContactNo}
                            value={contactNo}
                        />
                    </View>
                    <View style={styles.flatlist}>
                        <Text style={styles.labeltxt}>Remarks</Text>
                        <TextInput
                            multiline={true}
                            numberOfLines={10}
                            label="Remarks"
                            style={styles.inputr}
                            onChangeText={setRemarks}
                            value={remarks}
                        />
                    </View>
                </View>
                <View>
                    <TouchableOpacity style={styles.btnContainer} onPress={() => submitform()}>
                        <Text style={styles.previewtxt}>Submit</Text>
                    </TouchableOpacity>
                </View>
            {/* </ScrollView> */}
        </>
    );
}
export default AmcEntry;
const styles = StyleSheet.create({
    mtop: {
        marginTop: 30,
    },
    mtxttop: {
        marginTop: 10,
    },
    labeltxt: {
        color: '#022969',
        fontWeight: 'bold'
    },
    input: {
        height: 50,
        borderWidth: 1,
        padding: 10,
        borderWidth: 1,
        borderColor: '#a7b7d9'
    },
    inputn: {
        height: 50,
        borderWidth: 1,
        padding: 10,
        borderWidth: 1,
        borderColor: '#a7b7d9',
        textAlign: 'right'
    },
    inputr: {
        borderWidth: 1,
        width: '100%',
        backgroundColor: 'transparent',
        borderColor: '#a7b7d9',
        textAlign: 'left',
        height: 70,
        justifyContent: "flex-start",
        paddingLeft: 15,
    },
    button: {
        padding: 15,
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#a7b7d9'
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
    Flatlistview:
    {
        margin: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '98%',
        marginRight: '1%',
        marginLeft: '1%',
        paddingHorizontal: 4,
    },

    previewtxt:
    {
        color: '#fff',
        textAlign: 'center',
        paddingLeft: 5,
        paddingRight: 5,
        fontSize: 16,
        fontWeight: 'bold',
    },
    btnContainer: {
        flexDirection: 'row',
        backgroundColor: '#040485',
        marginRight: 0,
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 5,
        borderRadius: 5,
        maxWidth: '30%',
        marginTop: '5%',
        marginLeft: '35%',
        alignItems: "center",
        justifyContent: "center",
    },
    Containerremarks:
    {
        Width: '100%',
    },
    filteEmpty: {
        color: 'red',
        textAlign: 'center',
        padding: 10,
        fontSize: 20
    },

    row1: {
        marginTop: 2,
        flexDirection: "row",
        flexWrap: "wrap",
        shadowColor: "#000",
        shadowOpacity: 0.8,
        shadowRadius: 2,
        PaddingBottom: 10,
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
        marginLeft: '0%',
    },
    pickerView: {
        // width: "98%",
        marginLeft: '0%',
    },
    textStyle:
    {
        color: 'black',
    },
    col50: {
        width: "45%",
    },
    datePickerStyle: {
        width: '100%',
    }
})