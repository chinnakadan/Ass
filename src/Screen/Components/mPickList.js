import React, { useEffect, useState } from "react";
import { Alert, Modal, StyleSheet, Text, View, FlatList, TouchableOpacity, Platform } from "react-native";
import { Searchbar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
const MPickList = (props) => {
    const myIcon1 = <Icon name="checkbox" size={25} />;
    const myIcon2 = <Icon name="square-outline" size={25} />;
    const [selectedList, setselectedList] = useState([]);
    useEffect(() => {
        setselectedList([]);
    }, [props.data]);
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
                        {/* <View style={styles.col20}>
                            <TouchableOpacity style={{
                                width: '60%',
                                height: 40,
                                backgroundColor: 'green',
                                position: 'absolute',
                                bottom: 0,
                                right: -20,
                                borderRadius: 50,
                            }}
                                onPress={() => {
                                    props.actionOnCancel(false);
                                }}
                            >
                                <Icon name='add' size={30} color='#ffff' style={{ marginTop: 3, marginLeft: 7 }} />
                            </TouchableOpacity>
                        </View> */}
                        <View style={styles.col40}>
                            <TouchableOpacity style={{
                                width: '70%',
                                height: 40,
                                backgroundColor: '#040485',
                                position: 'absolute',
                                bottom: 0,
                                left: 70,
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
        width: '100%'
    },
    modalView: {
        margin: 10,
        backgroundColor: "white",
        borderRadius: 2,
        paddingHorizontal: 10,
        paddingVertical: 5,
        width: '90%',
        height: '94%',
        marginLeft: '5%',
        alignItems: "center",
        marginTop: Platform.OS =='android'? 0 : 38,
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
        paddingVertical: 10,
        textAlign: 'center',
        fontWeight: 'bold',
    }

});
export default MPickList;