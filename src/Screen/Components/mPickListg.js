import React, { useEffect, useState } from "react";
import { Alert, Modal, StyleSheet, Text, View, FlatList, TouchableOpacity, Switch, Pressable, Platform } from "react-native";
import { Searchbar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import SPickList from "./sPickList";
const MPickListG = (props) => {
    const myIcon1 = <Icon name="checkbox" size={30} />;
    const myIcon2 = <Icon name="square-outline" size={30} />;
    const [selectedList, setselectedList] = useState([]);
    const [mswitchValue, setmSwitchValue] = useState(true);
    const [gModalVisible, setgModalVisible] = useState(false);
    const [gdata, setgdata] = useState([]);
    const [gListItems, setgListItems] = useState([]);
    const [gId, setgId] = useState(0);
    const [gName, setgName] = useState('All');
    const [gSearch, setgSearch] = useState('');
    useEffect(() => {
        setselectedList([]);
    }, [props.data]);
    useEffect(() => {
        setgdata(props.gdata);
        setgListItems(props.gdata);

    }, [props.gdata]);
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
    function actionOnRowg(argitem) {
        setgModalVisible(false);
        setgId(argitem.Id);
        setgName(argitem.Name);
        if (argitem.Id != 0) {
            const newData = props.listdata.filter(
                (item) => item.ResourceId == argitem.Id
            );
            props.data = [...newData];
        } else {
            props.data = [...props.listdata];
        }
    }
    function gHandleChange() {
        setgModalVisible(false)
    }
    const onChangeSearchg = (query) => {
        try {
            if (query) {
                const gnewData = gListItems.filter(
                    function (item) {
                        const itemData = item.Name
                            ? item.Name.toUpperCase()
                            : ''.toUpperCase();
                        const textData = query.toUpperCase();
                        return itemData.indexOf(textData) > -1;
                    }
                );
                setgdata(gnewData);
                setgSearch(query);
            } else {
                setgdata(gListItems);
                setgSearch(query);
            }
        } catch (error) {
            console.log(error);
        }
    };
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
            ><View style={styles.modalView}>
                    {/* <View style={styles.container}> */}
                    <View style={[styles.Flatlistview1, { height: 25 }]}>
                        <View style={styles.col60}>
                        </View>
                        <View style={[styles.col15]}>
                            <Text style={{ textAlign: 'right', color: '#022969', fontWeight: 'bold', marginTop: 4, }}>
                                {mswitchValue ? 'Filter on' : 'Filter off'}
                            </Text>
                        </View>
                        <View style={[styles.col20, { marginRight: 15 }]}>
                            <Switch
                                style={{ marginTop: 0 }}
                                onValueChange={(itemValue) => setmSwitchValue(itemValue)}
                                value={mswitchValue}
                            />
                        </View>
                    </View>
                    <View style={mswitchValue == true ? '' : styles.hide}>
                        <View style={styles.row1}>
                            <View style={[styles.Flatlistview2,Platform.OS=="android" ? { height: 40, marginTop: -20, width: '98%', }:{ height: 40, marginTop: 0, width: '98%', }]}>
                                <View style={styles.pickerhead}>
                                    <Text style={{ color: '#022969', fontWeight: 'bold', paddingLeft: 5, }}>Group</Text>
                                    <View style={styles.centeredView}>
                                        <SPickList visible={gModalVisible} data={gdata} onChange={gHandleChange} onChangeSearch={onChangeSearchg} search={gSearch} actionOnCancel={setgModalVisible} actionOnRow={actionOnRowg} />
                                        <Pressable
                                            style={styles.button}
                                            onPress={() => setgModalVisible(true)}
                                        >
                                            <Text style={styles.textStylecostcenter}>{gName ? gName : 'Select Group'}</Text>
                                        </Pressable>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                    {/* </View> */}
                    <View style={styles.row1}>
                    </View>
                    <View style={{ backgroundColor: 'transparent', width: '96%', marginTop: 20, }}>
                        <Searchbar
                            placeholder="Search"
                            onChangeText={(value) => props.onChangeSearch(value)}
                            value={props.search}
                        />
                    </View>
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
                        <View style={styles.col5}>
                            <TouchableOpacity style={{
                                width: '70%',
                                height: 40,
                                backgroundColor: 'red',
                                position: 'absolute',
                                bottom: 0,
                                right: 40,
                            }}
                                onPress={() => {
                                    props.actionOnCancel(false);
                                }}
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
                                bottom: 0,
                                left: 50,
                            }}
                                onPress={() => {
                                    props.actionOnRow(selectedList);
                                }}
                            >
                                <Text style={styles.submitTextStyle}>Submit</Text>
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
        width: '100%',
      
    },
    modalView: {
        // margin: 10,
  backgroundColor:"#fff",
        //borderRadius: 20,
        paddingHorizontal: 10,
        paddingVertical: 5,
        width: '90%',
        height: '92%',
        marginTop:43,
        // marginLeft: '5%',
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
    // container: {
    //     flex: 1,
    //     // backgroundColor: '#EAEDED',
    // },
    container: {
        flex: 1,
        
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
        width: '45%',
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
    col15: {
        width: '15%',
    },
    Flatlistview1: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        height: 40,
        marginTop: 0,
    },
    Flatlistview2: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    hide: {
        display: 'none'
    },
    row1: {
        marginTop: 10,
        flexDirection: "row",
        flexWrap: "wrap",

         backgroundColor: 'transparent',
        PaddingBottom: 5,
    },
    Flatlistview: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        height: 30,
    },
    textStylecostcenter: {
        color: 'black',
        paddingTop: 8,
        paddingLeft: 10,
    }, button: {
        backgroundColor: 'transparent',

        height: 50,
        fontSize: 18,
        //borderColor: '#040485',
        borderColor: '#b1c4c7',
        borderWidth: 1,
        margin: 5,
        paddingVertical: 2,
        paddingTop: 7,
        color: 'black',
        width: '100%'
    },
    pickerhead: {
        width: "100%",

    },
});
export default MPickListG;