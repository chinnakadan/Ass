import { useState, useEffect, useCallback } from 'react';
import React from 'react';
import { Text, View, StyleSheet, FlatList, TouchableOpacity, Alert, Modal, Button, BackHandler, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';;
import { Searchbar } from 'react-native-paper';
import Icon from 'react-native-elements/dist/icons/Icon';
import { ToastAndroid } from 'react-native';
import Moment from 'moment';
import MonthPicker from 'react-native-month-year-picker';
import { Maintentance } from '../../../service/api/apiservice';
import Loader from '../../Components/Loader';
import { COLORS, FONTCOLORS } from '../../theme/theme';
const MaintenanceNotification = (props) => {
    const [ClientId, setClientId] = useState('0');
    const [UserId, setUserId] = useState('0');
    const [listItems, setlistItems] = useState([]);
    const [Data, setData] = useState([]);
    const [search, setSearch] = useState('');
    const [searchQuery, setSearchQuery] = React.useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [Preview, setPreview] = useState([]);
    const [loading, setLoading] = useState(false);
    const [show, setShow] = useState(false);
    const showPicker = useCallback((value) => setShow(value), []);
    const [refDate, setRefDate] = useState(new Date());
    const [radd, setrAdd] = useState(0);
    useEffect(() => {
        if (Data.length == 0) {
            let iMonth = refDate.getMonth() + 1
            let iYear = refDate.getFullYear();
            retrieveData(iMonth, iYear);
        }
        BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
        return () => {
            BackHandler.removeEventListener('hardwareBackPress', handleBackButtonClick);
        };
    }, [ClientId, UserId]);
    function handleBackButtonClick() {
        props.navigation.navigate('MaintenanceDashboard');
        return true;
    }
    useEffect(() => {
    }, [refDate, Data]);
    const onValueChange = useCallback(
        (event, newDate) => {
            const selectedDate = newDate || refDate;
            showPicker(false);
            setRefDate(selectedDate);
            let iMonth = selectedDate.getMonth() + 1
            let iYear = selectedDate.getFullYear();
            // loadData(ccId, iMonth, iYear, entryType);
            setData([]);
            setlistItems([]);
            retrieveData(iMonth, iYear);
        },
    );
    const retrieveData = async (argMonth, argYear) => {
        try {
            setLoading(true);
            let iClientId = await AsyncStorage.getItem('clientId');
            let iUserId = await AsyncStorage.getItem('userId');
            setClientId(iClientId);
            setUserId(iUserId);
            let data = {
                ClientId: iClientId,
                UserId: iUserId,
                Month: argMonth,
                Year: argYear,
                type: 'getMaintenanceSchedule'
            };
            const response = await Maintentance(data)
            const datas = await response.json();
            setData(datas.regList);
            setlistItems(datas.regList);
            setrAdd(datas.add);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.log(error)
        }
    }
    function showFollowup(item) {
        props.navigation.push('PMFollowup', { RegisterId: item.ShTransId });
    }
    const onChangeSearch = (query) => {
        try {
            if (query) {
                const newData = listItems.filter(
                    function (item) {
                        const itemData = item.AssetName
                            ? item.AssetName.toUpperCase()
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
    return (
        <>
            <Loader loading={loading} />
            <View style={[styles.row1, style = { width: '98%', marginLeft: '1%', marginTop:20 }]}>
                <View >
                    <Text style={{ color: FONTCOLORS.primary, textAlign: 'left', fontWeight: 'bold', paddingLeft: 5, }}>Month</Text>
                    <View style={[styles.Flatlistview2, { height: 70, marginTop: show == false ? 5 : 150 }]}>
                        <View style={styles.pickerView}>
                            <TouchableOpacity onPress={() => showPicker(true)}>
                                <Text style={styles.textInput} > {Moment(refDate).format('MMMM YYYY')}</Text>
                            </TouchableOpacity>
                            {show && (
                                <MonthPicker
                                    onChange={onValueChange}
                                    changeDate
                                    value={refDate}
                                    locale="en"
                                />
                            )}
                        </View>
                    </View>
                </View>

            </View>
            {/* <ScrollView> */}
                <View style={styles.MainContainer}>
                    <View style={styles.centeredView}>
                        <View style={styles.searchview}>
                            <Searchbar style={styles.modalView}
                                placeholder="Search"
                                onChangeText={onChangeSearch}
                                value={search}
                            />
                            <FlatList style={styles.flatlist}
                                data={Data}
                                keyExtractor={item => item.ShTransId}
                                renderItem={({ item, index }) => {
                                    return <View  ><TouchableOpacity style={styles.touch}>
                                        <View style={styles.Flatlistview}>
                                            <View style={styles.col3}>
                                                <Text style={styles.itemtittle} >Asset Name</Text>
                                            </View>
                                            <Text style={styles.colon}>: </Text>
                                            <View style={styles.col7}>
                                                <Text style={styles.assetname}>  {item.AssetName}</Text>
                                            </View>
                                        </View>
                                        <View style={styles.Flatlistview} >
                                            <View style={styles.col3}>
                                                <Text style={styles.itemtittle} >Type</Text>
                                            </View>
                                            <Text style={styles.colon}>: </Text>
                                            <View style={styles.col7}>
                                                <Text style={styles.Type} > {item.TaskName}</Text>
                                            </View>
                                        </View>
                                        <View style={styles.Flatlistview} >
                                            <View style={styles.col3}>
                                                <Text style={styles.itemtittle} >Due Date</Text>
                                            </View>
                                            <Text style={styles.colon}>: </Text>
                                            <View style={styles.col41}>
                                                <Text style={styles.duedate} >  {item.NextDate}</Text>
                                            </View>
                                            <View style={radd == 0 ? styles.hide : styles.col41}>
                                                <TouchableOpacity onPress={() => showFollowup(item)}>
                                                    <View style={styles.btnContainer}>
                                                        <Icon name="md-eye" type="ionicon" color="#fff" size={15} style={styles.btnIcon} />
                                                        <Text style={styles.previewtxt}>Proceed</Text>
                                                    </View>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                    </View>
                                }}
                            />
                        </View>
                    </View>
                    <View>
                        <Text style={styles.filteEmpty}>{Data.length == 0 ? 'No Data Found' : null}</Text>
                    </View>
                </View>
            {/* </ScrollView> */}
        </>
    );
}
export default MaintenanceNotification;
const styles = StyleSheet.create({
    Flatlistview2: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
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
    pickerView: {
        width: "98%",
    },
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
    searchview: {
        flex: 0,
        marginTop: 10,
    },
    touch: {
        borderRadius: 5,
        flexDirection: 'column',
        backgroundColor: 'white',
        marginTop: 4,
        marginBottom: 4,
        padding: 5,
        justifyContent: 'flex-start',
        borderLeftWidth: 3,
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
        elevation: 2,
    },
    flatlist: {
        fontSize: 20,
        paddingHorizontal: 15,
        fontWeight: 'bold',
        color: 'blue',
    },

    nextdate: {
        color: 'black',
        textAlign: 'left',
        paddingTop: 11,
        paddingRight: 10,
    },
    Flatlistview: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        height: 35,
    },
    previewtxt: {
        color: '#fff',
        textAlign: 'center',
        paddingLeft: 5,
        paddingRight: 5,
        fontSize: 13,
        paddingTop: 3,
        fontWeight: 'bold',
    },
    btnContainer: {
        flexDirection: 'row',
        backgroundColor: COLORS.primary,
        marginRight: 0,
        paddingTop: 4,
        paddingBottom: 4,
        paddingLeft: 2,
        borderRadius: 5,
        marginTop: 1,
        width: '60%',
    },
    MainContainer: {
        flex: 0,
        alignItems: 'center',
        padding: 2,
        width: '100%',
        // marginTop:30,
    },
    btnIcon: {
        marginTop: 4, height: 20, width: 20,
    },
    filteEmpty: {
        color: 'red',
        textAlign: 'center',
        padding: 10,
        fontSize: 20
    },
    assetname: {
        color: '#003885',
        textAlign: 'left',
        fontSize: 13,
        paddingLeft: 5,
        paddingTop: 10,
    },
    Type: {
        color: '#ED0054',
        textAlign: 'left',
        fontSize: 13,
        paddingLeft: 6,
        paddingTop: 10,
    },
    duedate: {
        flex: 0,
        color: '#088548',
        paddingRight: 3,
        paddingTop: 10,
        fontSize: 13,
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
    col3nextdate: {
        width: '20%',
        marginRight: 25,
    },
    col45: {
        width: '45%',

    },
    colon: {
        paddingTop: 10,
        width: '1%',
    },
    col41: {
        width: '41%',
    },
    itemtittle: {
        paddingTop: 10,
        color: '#5c6773',
        fontSize: 13,
    },
    Flatlistview1: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        height: 40,
        marginTop: 0,
        marginBottom: 10,
    },
    textStyle: {
        color: FONTCOLORS.primary,
        marginTop: 20,
        textAlign: 'right',
        fontWeight: 'bold',
        marginLeft: 5,
    },
})