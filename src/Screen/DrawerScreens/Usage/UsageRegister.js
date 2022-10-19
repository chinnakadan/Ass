import { useState, useEffect, useCallback } from 'react';
import React from 'react';
import { Text, View, StyleSheet, FlatList,Platform, TouchableOpacity, Pressable, BackHandler, Switch, ScrollView } from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';;
import { Searchbar } from 'react-native-paper';
import Icon2 from "react-native-vector-icons/MaterialCommunityIcons";
import { Picker } from '@react-native-picker/picker';
import Moment from 'moment';
import { Usage } from '../../../service/api/apiservice';
import MonthPicker from 'react-native-month-year-picker';
import Loader from '../../Components/Loader';
import SPickList from '../../Components/sPickList';
import { COLORS, FONTCOLORS } from '../../theme/theme';
import RNPickerSelect from 'react-native-picker-select';

const UsageRegister = (props) => {
    const [ClientId, setClientId] = useState('0');
    const [UserId, setUserId] = useState('0');
    const [entryType, setentryType] = useState('1');

    const [listItems, setlistItems] = useState([]);
    const [Data, setData] = useState([]);

    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);

    const [show, setShow] = useState(false);
    const showPicker = useCallback((value) => setShow(value), []);
    const [refDate, setRefDate] = useState(new Date());

    const [ccListItems, setCCListItems] = useState([]);
    const [ccData, setCCData] = useState([]);
    const [ccSearch, setCCSearch] = useState('');
    const [ccId, setCCId] = useState(0);
    const [ccName, setCCName] = useState('');
    const [ccModalVisible, setCCModalVisible] = useState(false);
    const [switchValue, setSwitchValue] = useState(true);
    const [redit, setrEdit] = useState(0);
    const [rview, setrView] = useState(0);
    useEffect(() => {
        if (Data.length == 0) retrieveData();
        BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
        return () => {
            BackHandler.removeEventListener('hardwareBackPress', handleBackButtonClick);
        };
    }, [ClientId, UserId]);
    function handleBackButtonClick() {
        props.navigation.goBack();
        return true;
    }
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
                type: "getRegisterCCList",
            };
            const response = await Usage(data)
            const datas = await response.json();
            setCCData(datas.ccList);
            setCCListItems(datas.ccList);
            setrEdit(datas.edit);
            setrView(datas.view);
            setCCId(0);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.log(error)
        }
    }
    function ccHandleChange() {
        setCCModalVisible(false)
    }
    const onChangeSearch = (query) => {
        try {
            if (query) {
                const newData = listItems.filter(
                    function (item) {
                        const itemData = item.RefNo
                            ? item.RefNo.toUpperCase()
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
    const loadData = async (argccId, argMonth, argYear, argType) => {
        setLoading(true);
        let data = {
            ClientId: ClientId,
            UserId: UserId,
            CostCentreId: argccId,
            Month: argMonth,
            Year: argYear,
            EntryType: argType,
            type: 'getRegister'

        };
        const response = await Usage(data)
        var datas = await response.json();
        setData(datas);
        setlistItems(datas);
        setLoading(false);
    }
    const onValueChange = useCallback(
        (event, newDate) => {
            const selectedDate = newDate || refDate;
            showPicker(false);
            setRefDate(selectedDate);
            let iMonth = selectedDate.getMonth() + 1
            let iYear = selectedDate.getFullYear();
            loadData(ccId, iMonth, iYear, entryType);
        },
    );
    function changeentryType(argValue) {
        setentryType(argValue);
        let iMonth = refDate.getMonth() + 1
        let iYear = refDate.getFullYear();
        loadData(ccId, iMonth, iYear, argValue);
    }
    function actionOnRowCC(item) {
        setCCName(item.Name);
        setCCModalVisible(false);
        setCCId(item.Id);
        let iMonth = refDate.getMonth() + 1
        let iYear = refDate.getFullYear();
        loadData(item.Id, iMonth, iYear, entryType);
        setLoading(false);
    }
    function editEntry(item) {
        props.navigation.push('UsageEntry', { RegisterId: item.RegisterId });
    }
    function shareEntry(item) {
        props.navigation.push('UsageTemplate', { RegisterId: item.RegisterId });
    }
    return (
        <>
            <Loader loading={loading} />
            <View style={styles.container}>
                <View style={[styles.Flatlistview1, style = { height: 25, }]}>
                    <View style={styles.col60}>
                    </View>
                    <View style={[styles.col15, style = {}]}>
                        <Text style={{ textAlign: 'right', color: FONTCOLORS.primary, fontWeight: 'bold', marginTop: 4, }}>
                            {switchValue ? 'Filter on' : 'Filter off'}
                        </Text>
                    </View>
                    <View style={[styles.col20, style = { marginRight: 15 }]}>
                        <Switch
                            style={{ marginTop: 0 }}
                            onValueChange={(itemValue) => setSwitchValue(itemValue)}
                            value={switchValue}
                        />
                    </View>
                </View>
                <View>
                    <View style={switchValue == true ? '' : styles.hide}>
                        <View style={styles.row1}>
                            <View style={[styles.Flatlistview2, style = { height: 70, marginTop: -20, }]}>
                                <View style={styles.pickerhead}>
                                    <Text style={{ color: FONTCOLORS.primary, fontWeight: 'bold', paddingLeft: 5, }}>CostCentre</Text>
                                    <View style={styles.centeredView} >
                                        <SPickList visible={ccModalVisible} data={ccData} onChange={ccHandleChange} onChangeSearch={onChangeSearchCC} search={ccSearch} actionOnCancel={setCCModalVisible} actionOnRow={actionOnRowCC} />
                                        <Pressable
                                            style={styles.button}
                                            onPress={() => setCCModalVisible(true)}
                                        >
                                            <Text style={styles.textStylecostcenter}>{ccName ? ccName : 'Select CostCentre'}</Text>
                                        </Pressable>
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View style={[styles.row1, { width: '100%', }]}>
                            <Text style={[ { width:'100%',color: FONTCOLORS.primary, textAlign: 'left', fontWeight: 'bold', paddingLeft: 5, }]}>Type</Text>
                            <View style={[styles.Flatlistview1, { height: 50, marginTop: 0 }]}>
                                    <View style={{ width: '100%', marginTop: 5, }}>
                                        <View style={styles.pickerView}>
                                            <View style={{ borderWidth: 1, borderColor: COLORS.brdleftblue, width: "100%", height: 50, paddingBottom: 5,paddingTop:15, paddingLeft:15 }} >
                                                { Platform.OS =='android' ?
                                                <Picker
                                                    selectedValue={entryType}
                                                    style={{}}
                                                    onValueChange={(itemValue, itemIndex) => changeentryType(itemValue)}
                                                >
                                                    <Picker.Item label="Own" value="1" />
                                                    <Picker.Item label="Hire" value="2" />
                                                </Picker>
                                                : 
                                                    <RNPickerSelect
                                                        selectedValue={entryType}
                                                        style={{ height: 50, width: '100%' }}
                                                        placeholderTextColor="#ccc"
                                                        items={[
                                                            { label: 'Own', value: '1' },
                                                            { label: 'Hire', value: '2' },
                                                        ]}
                                                        onValueChange={(itemValue, itemIndex) => changeentryType(itemValue)}>

                                                    </RNPickerSelect>
                                         }
                                            </View>
                                        </View>
                                </View>
                                {/* <View style={styles.col20}>
                                    <Text style={styles.textStyle}>Month</Text>
                                </View> */}
                            </View>
                            <View style={{width:'100%', marginTop:15}}>
                                <Text style={[styles.col32, { color: FONTCOLORS.primary, textAlign: 'left', fontWeight: 'bold', paddingLeft: 5, }]}>Month</Text>

                                    <TouchableOpacity onPress={() => showPicker(true)}>
                                        <Text style={styles.textInput} > {Moment(refDate).format('MMMM YYYY')}</Text>
                                    </TouchableOpacity>
                                    {show && (
                                        <MonthPicker
                                            onChange={onValueChange}
                                            changeDate
                                            value={refDate}
                                            // minimumDate={new Date()}
                                            // maximumDate={new Date(2025, 5)}
                                            locale="en"
                                        />
                                    )}
                                </View>
                        </View>
                    </View>
                    <View style={styles.MainContainer}>
                        {/* <ScrollView> */}
                        <View style={styles.searchview}>
                           
                             
                                        <Searchbar style={styles.modalView}
                                            placeholder="Search by RefNo"
                                            onChangeText={onChangeSearch}
                                            value={search}
                                        />
                                        </View>
                                     <FlatList style={{ width: '100%', marginBottom: 250 }}
                                            data={Data}
                                            keyExtractor={item => item.RegisterId}
                                            renderItem={({ item, index }) => {
                                                return <View  ><TouchableOpacity style={styles.touch}>
                                                    <View style={styles.Flatlistview} >
                                                        <View style={styles.col6}>
                                                            <Text style={styles.itemTitledate} >{item.RefNo}</Text>
                                                        </View>
                                                        <View style={styles.col4}>
                                                            <Text style={styles.itemTitlehead} >{item.RefDate}</Text>
                                                        </View>
                                                    </View>
                                                    <View style={styles.Flatlistview} >
                                                        <View style={styles.col3}>
                                                            <Text style={styles.itemtittle} >CostCentre Name</Text>
                                                        </View>
                                                        <Text style={styles.colon}>: </Text>
                                                        <View style={styles.col7}>
                                                            <Text style={styles.assetname} >
                                                                {item.CostCentreName.slice(0, 15)}</Text>
                                                        </View>
                                                    </View>
                                                    <View style={styles.Flatlistview}>
                                                        <View style={styles.col3}>
                                                            <Text style={styles.itemtittle}>{entryType == 2 ? 'Vendor Name' : 'Asset Name'}</Text>
                                                        </View>
                                                        <Text style={styles.colon}>: </Text>
                                                        <View style={styles.col7}>
                                                            <Text style={styles.assetname} >
                                                                {item.AssetName.slice(0, 15)}</Text>
                                                        </View>
                                                    </View>
                                                    <View style={styles.Flatlistview} >
                                                        <View style={styles.col3}>
                                                            <Text style={styles.itemtittle} >Approve</Text>
                                                        </View>
                                                        <Text style={styles.colon}>: </Text>
                                                        <View style={styles.col50}>
                                                            <Text style={styles.responsedby} > {item.Approve.slice(0, 15)}</Text>
                                                        </View>
                                                        <View style={styles.col10}>
                                                            <View style={redit == 0 ? styles.hide : ''}>
                                                                <TouchableOpacity onPress={() => editEntry(item)}>
                                                                    <View style={{ flexDirection: 'row', paddingHorizontal: 4, paddingVertical: 5, borderRadius: 5, }}>
                                                                        <View>
                                                                            <Icon2 name="lead-pencil" type="ionicon" size={20} style={{ color: FONTCOLORS.primary }} />
                                                                        </View>
                                                                    </View>
                                                                </TouchableOpacity>
                                                            </View>
                                                        </View>
                                                        <View style={styles.col10}>
                                                            <View style={rview == 0 ? styles.hide : ''}>
                                                                <TouchableOpacity onPress={() => shareEntry(item)}>
                                                                    <View style={{ flexDirection: 'row', paddingHorizontal: 4, paddingVertical: 5, borderRadius: 5, }}>
                                                                        <View>
                                                                            <Icon2 name="eye" type="ionicon" size={20} style={{ color: FONTCOLORS.primary }} />
                                                                        </View>
                                                                    </View>
                                                                </TouchableOpacity>
                                                            </View>
                                                        </View>
                                                    </View>
                                                </TouchableOpacity>
                                                </View>
                                            }}
                                        />
                                
                                </View>
                                <View style={styles.centeredView}>
                                <View style={styles.container}>
                                <View>
                                    <Text style={styles.filteEmpty}>{Data.length == 0 ? 'No Data Found' : null}</Text>
                                </View>
                            </View>
                        {/* </ScrollView> */}
                    </View>
                    {/* <TouchableOpacity
                        style={{
                            borderWidth: 1,
                            borderColor: 'rgba(0,0,0,0.2)',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 50,
                            position: 'absolute',
                            bottom: 50,
                            right: 10,
                            height: 50,
                            backgroundColor: '#040485',
                            borderRadius: 100,
                        }

                        }
                        onPress={() => { props.navigation.navigate('MaintenanceTicket') }}
                    >
                        <Icon name='add' size={35} color='#ffff' />
                    </TouchableOpacity> */}
                </View>
            </View>
        </>
    );
}
export default UsageRegister;
const styles = StyleSheet.create({
    modalView: {
        backgroundColor: "white",
        borderRadius: 2,
        width: '90%',
        alignItems: "center",
        shadowColor: "#000",
        justifyContent: "center",
        alignItems: "center",
        marginLeft: '5%',
        marginBottom: 3,
        height: 40,
    },
    hide: {
        display: 'none'
    },
    row1: {
        marginTop: 10,
        flexDirection: "row",
        flexWrap: "wrap",
        backgroundColor: COLORS.white,
        PaddingBottom: 5,
    },
    button: {
        backgroundColor: 'transparent',
        height: 50,
        fontSize: 18,
        borderColor: COLORS.brdleftblue,
        borderWidth: 1,
        margin: 5,
        paddingVertical: 2,
        paddingTop: 7,
        color: 'black',
    },
    searchview: {
        flex: 0,
        marginTop: 5,
    },
    touch: {
        flexDirection: 'column',
        backgroundColor: 'white',
        marginTop: 5,
        marginBottom: 5,
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
    flatlist: {
        fontSize: 20,
        paddingVertical: 5,
        paddingHorizontal: 20,
        fontWeight: 'bold',
        color: 'blue',
        marginBottom: 250,
        height: '100%',
        overflow: 'scroll'
    },
    Flatlistview: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        height: 30,
    },
    Flatlistview1: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '97%',
        marginLeft: '2%'
    },
    Flatlistview2: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',

    },
    previewtxt: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 15,
        paddingHorizontal: 2,
    },
    btnContainer: {
        flexDirection: 'row',
        backgroundColor: COLORS.primary,
        paddingHorizontal: 4,
        paddingVertical: 5,
        borderRadius: 5,
        width: '70%',
        marginLeft: '15%'
    },
    filteEmpty: {
        color: 'red',
        textAlign: 'center',
        padding: 10,
        fontSize: 20,
        marginBottom:20,
        paddingBottom:30,
    },
    MainContainer: {
        flex: 0,
        alignItems: 'center',
        padding: 2,
        width: '100%',
        marginTop: 15,
    },
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    itemTitlehead: {
        color: '#ED0054',
        textAlign: 'center',
        fontSize: 12
    },
    itemTitledate: {
        color: '#0875d4',
        textAlign: 'center',
        fontSize: 15,
        fontWeight: 'bold',

    },
    assetname: {
        color: '#003885',
        textAlign: 'left',
        fontSize: 15,
        paddingLeft: 5,
        paddingTop: 10,
    },
    type: {
        color: '#003885',
        textAlign: 'left',
        fontSize: 15,
        paddingLeft: 6,
        paddingTop: 10,

    },
    responsedby: {
        flex: 0,
        color: '#ED0054',
        paddingRight: 3,
        paddingTop: 10,
    },
    col4: {
        width: '40%',
    },
    col3: {
        width: '30%',
    },
    col32: {
        width: '34%',
    },
    col31: {
        width: '29%',
        marginRight: 2,

    },
    col66: {
        width: '66%',
    },
    col7: {
        width: '82%',
    },
    col50: {
        width: '50%',
    },
    col60: {
        width: '70%',
    },
    col2: {
        width: '18%',
    },
    col20: {
        width: '13%',
    },
    col3nextdate: {
        width: '30%',
        marginRight: 25,
    },
    col15: {
        width: '15%',
    },
    colon: {
        paddingTop: 10,
        width: '1%',
    },
    itemtittle: {
        paddingTop: 10,
        color: '#5c6773',
        fontWeight: 'normal',
    },
    pickerView: {
        width: "98%",
    },
    pickerhead: {
        width: "98%",
        marginLeft: '1%',
        marginRight: '1%',
    },
    textStyle: {
        color: FONTCOLORS.primary,
        marginTop: 20,
        textAlign: 'left',
        fontWeight: 'bold',
        marginLeft: 5,
    },
    textInput: {
        height: 50,
        fontSize: 16,
        borderColor: COLORS.brdleftblue,
        borderWidth: 1,
        margin: 5,
        paddingVertical: 5,
        paddingTop: 15,
        color: 'black',
    },
    textStylecostcenter: {
        color: 'black',
        paddingTop: 8,
        paddingLeft: 10,
    },
    col10: {
        width: '10%',
    },
})