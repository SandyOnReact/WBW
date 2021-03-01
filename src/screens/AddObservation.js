import React, { useState, useEffect } from 'react'
import { View, ScrollView, Text, ActivityIndicator, TouchableOpacity } from 'react-native'
import { Input, Header, Button } from 'react-native-elements'
import { useNavigation } from "@react-navigation/native"
import { getStatusBarHeight } from 'react-native-status-bar-height'
import { useFormik } from "formik"
import { string, object } from 'yup'
import RNPickerSelect from 'react-native-picker-select';
import { CustomDropdown } from '../components/core/custom-dropdown'
import { CustomDateTimePicker } from '../components/datetimepicker'
import moment from 'moment';
import RadioForm from 'react-native-simple-radio-button';
import Autocomplete from 'react-native-autocomplete-input';
import { StyleSheet } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../utils/api'
import { isEmpty } from 'lodash'

let date = new Date()
let topicList = []
const radioButtons = [
    { label: 'Yes', value: 0 },
    { label: 'No', value: 1 }
]

const autoCompleteArray = [{
    Name: "Demo",
    Id: 1
}, {
    Name: "Demo -> Corporate Office",
    Id: 2
}, {
    Name: "Demo -> Corporate Office -> Human Resources",
    Id: 3
}, {
    Name: "Demo -> Corporate Office -> Quality",
    Id: 4
}, {
    Name: "Demo -> Corporate Office -> H.S.E",
    Id: 5
}, {
    Name: "Demo -> Region 1 -> Location 1",
    Id: 6
}, {
    Name: "Demo -> Region 1 -> Location 1 -> Location 1 - Area 1",
    Id: 11
}, {
    Name: "Demo -> Region 1 -> Location 1 -> Location 1 - Area 2",
    Id: 88
}, {
    Name: "Demo -> Demo -> Region 1 -> Location 1 -> Location 1 - Area 3",
    Id: 76
}, {
    Name: "Demo -> Region 1 -> Location 1 -> Location 1 - Area 3",
    Id: 98
}, {
    Name: "Demo -> Region 1 -> Regional office",
    Id: 23
}];

export const AddObservationScreen = () => {

    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);
    const [dateValue, setDateValue] = useState('');
    const [timeValue, setTimeValue] = useState('');
    const [radioValue, setRadioValue] = useState('');
    const [observationOccur, setObservationOccur] = useState('');
    const [actValue, setActValue] = useState('');
    const [hazardValue, setHazardValue] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState([]);
    const [actList, setActList] = useState([]);
    const [hazardList, setHazardList] = useState([]);
    const [sectionList, setSectionList] = useState([]);
    const [sectionValue, setSectionValue] = useState('');
    const [topicValue, setTopicValue] = useState('');
    const [selectedValue, setSelectedValue] = useState({});
    const [filteredData, setFilteredData] = useState([]);
    const inputContainerStyle = { borderWidth: 1, borderColor: '#1e5873', borderRadius: 6 }
    const STATUS_BAR_HEIGHT = getStatusBarHeight()
    const navigation = useNavigation()
    const navigatetoBackScreen = () => {
        navigation.goBack()
    }

    const {
        touched,
        handleBlur,
        handleChange,
        handleSubmit,
        errors,
        isValid,
        isValidating,
        isSubmitting,
        resetForm,
    } = useFormik({
        initialValues: {
            whereDidObservationOccur: "",
            whereDidObservationHappened: "",
            Observation: "",
        },
        validationSchema: object({
            whereDidObservationOccur: string()
                .required('This field is required'),
            whereDidObservationHappened: string()
                .required('This field is required'),
            observation: string()
                .required('This field is required')
        }),
        async onSubmit({ whereDidObservationOccur, whereDidObservationHappened, observation }) {
            //
        }
    })

    const fetchUserInfoFromStorage = async () => {
        const userInfo = await AsyncStorage.getItem('USER_INFO');
        return userInfo != null ? JSON.parse(userInfo) : null;
    }

    useEffect(() => {
        getAllData()
    }, [])

    const getAllData = async () => {
        const user = await fetchUserInfoFromStorage()
        const token = await AsyncStorage.getItem('Token')
        const result = await api.post({
            url: `api/Common/GetAllFilters`,
            body: {
                UserID: user.UserID,
                AccessToken: token,
                CompanyID: user.CompanyID,
                ObservationSettingID: 'aa7309ab-5bd8-4f2d-9b29-5f19d27495a8'
            }
        })
        if (result === "Invalid User Token") {
            Toast.showWithGravity('Invalid User Token', Toast.LONG, Toast.CENTER);
            return null;
        }
        if (!result.ActOrConditions) {
            return null
        }

        if (!result.Sections) {
            return null
        }

        if (!result.ObservationTime) {
            return null
        }
        setData(result)
        const actData = result.ActOrConditions.map(item => {
            const act = { label: item.Value, value: item.Value }
            return act;
        }, [])
        const hazardData = result.Hazards.map(item => {
            const hazard = { label: item.Value, value: item.Value }
            return hazard;
        }, [])

        const sectionData = result.Sections.map((item, index) => {
            const section = { label: item.Value, value: item.Value }
            // item.Topics.map( obj => {
            //     const topic = { label: obj.Value, value: obj.Value }
            //     topicData.push( topic )
            //     return topic
            // } )
            return section;
        })
        setSectionList(sectionData)
        // setTopicList( topicData )
        setActList(actData)
        setHazardList(hazardData)
        setIsLoading(false)
        return result;
    }

    if (isLoading) {
        return (
            <ActivityIndicator color="red" />
        )
    }

    const onChange = (event, selectedDate) => {
        if (event.type === "dismissed") return null
        const currentDate = selectedDate || date;
        setShow(false);
        if (mode === 'date') {
            const pickedDate = moment(currentDate).format("DD/MM/YYYY")
            setDateValue(pickedDate)
            date = currentDate
        } else {
            const pickedTime = moment(currentDate).format("hh:mm a")
            setTimeValue(pickedTime)
            date = currentDate
        }
    };

    const showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);
    };

    const showDatepicker = () => {
        showMode('date');
    };

    const showTimepicker = () => {
        showMode('time');
    };

    const onSectionValueChange = (value) => {
        if (isEmpty(value) || value === null) {
            topicList = []
            setSectionValue('')
            return null
        }
        const topicsBasedOnSections = data.Sections.find(item => {
            if (item.Value === value) return item
        })
        topicList = topicsBasedOnSections.Topics.map(item => {
            const topic = { label: item.Value, value: item.Value }
            return topic
        })
        setSectionValue(value)
    }

    const findSearchedObservation = (query) => {
        // Method called every time when we change the value of the input
        console.log( query )
        if (query) {
            const regex = new RegExp(`${query.trim()}`, 'i');
            // Setting the filtered film array according the query
            console.log( query )
            setFilteredData(
                autoCompleteArray.filter((item) => item.Name.search(regex) >= 0)
            );
            setSelectedValue( query )
        } else {
            // If the query is null then return blank
            setFilteredData([]);
        }
    }

    const renderTextInput = () => {
        return (
            <Input
                label="Where Did Observation Occur"
                labelStyle={{ marginBottom: 5 }}
                placeholder="Type Something"
                placeholderTextColor="gray"
                multiline={true}
                numberOfLines={1}
                value={selectedValue.Name}
                inputContainerStyle={inputContainerStyle}
                onChangeText={(text) => findSearchedObservation(text)}
                errorMessage={errors.whereDidObservationOccur}
            />
        )
    }

    const renderItem = ({ item }) => {
        return (
            <TouchableOpacity
                onPress={() => {
                    setSelectedValue(item);
                    setFilteredData([]);
                }}>
                <Text style={styles.itemText}>
                    {item.Name}
                </Text>
            </TouchableOpacity>
        )
    }

    return (
        <View style={{ flex: 1 }}>
            <View>
                <Header
                    containerStyle={{ height: 56 + STATUS_BAR_HEIGHT }}
                    statusBarProps={{ barStyle: "light-content", translucent: true, backgroundColor: "transparent" }}
                    containerStyle={{ backgroundColor: '#1e5873' }}
                    leftComponent={{ icon: 'arrow-back', type: 'ionicons', color: 'white', onPress: navigatetoBackScreen }}
                    centerComponent={{ text: 'Add Observation', style: { color: '#fff', fontSize: 16 } }}
                />
            </View>
            <View style={{ flex: 1, marginHorizontal: '5%' }}>
                <ScrollView style={{ flex: 1 }}>
                    <View style={{ marginTop: '3%' }}>
                        <View>
                            {/* <Input
                            label="Where Did Observation Occur"
                            labelStyle={{ marginBottom: 5 }}
                            placeholder="Type Something"
                            placeholderTextColor="gray"
                            inputContainerStyle={inputContainerStyle}
                            onChangeText={handleChange("whereDidObservationOccur")}
                            onBlur={handleBlur("whereDidObservationOccur")}
                            errorMessage={errors.whereDidObservationOccur}
                        /> */}
                            <Autocomplete
                                autoCapitalize="none"
                                autoCorrect={false}
                                renderTextInput={renderTextInput}
                                containerStyle={styles.autocompleteContainer}
                                data={filteredData}
                                keyExtractor={item=>item.Id}
                                defaultValue={
                                    JSON.stringify(selectedValue) === '{}' ?
                                        '' :
                                        selectedValue.Name
                                }
                                onChangeText={(text) => findSearchedObservation(text)}
                                renderItem={renderItem}
                            />
                        </View>
                    </View>
                    <View>
                        <Input
                            label="Describe Where the Observation Happened"
                            labelStyle={{ marginBottom: 5 }}
                            numberOfLines={3}
                            multiline={true}
                            textAlignVertical="top"
                            placeholder="Type Something"
                            placeholderTextColor="gray"
                            inputContainerStyle={inputContainerStyle}
                            onChangeText={handleChange("whereDidObservationHappened")}
                            onBlur={handleBlur("whereDidObservationHappened")}
                            errorMessage={errors.whereDidObservationHappened}
                        />
                    </View>
                    <View>
                        <CustomDateTimePicker
                            label="What was the Date of Observation"
                            onRightIconPress={showDatepicker}
                            show={show}
                            inputValue={dateValue}
                            mode={mode}
                            display="spinner"
                            value={date}
                            onChange={onChange}
                        />
                    </View>
                    <View>
                        <CustomDateTimePicker
                            label="What was the Time of Observation"
                            onRightIconPress={showTimepicker}
                            show={show}
                            display="spinner"
                            inputValue={timeValue}
                            mode={mode}
                            value={date}
                            onChange={onChange}
                        />
                    </View>
                    <View>
                        <View style={{ marginBottom: 10, }}>
                            <Text style={{
                                color: '#86939e',
                                fontWeight: 'bold', fontSize: 16, paddingLeft: '3%', marginBottom: '1%'
                            }}> Follow Up Needed: </Text>
                            <RadioForm style={{ marginLeft: 100 }}
                                radio_props={radioButtons}
                                initial={0}
                                formHorizontal={true}
                                labelHorizontal={true}
                                radioStyle={{ paddingRight: 50 }}
                                buttonColor={'#86939e'}
                                selectedButtonColor={'#1e5873'}
                                animation={true}
                                style={{ paddingHorizontal: 15 }}
                                onPress={(value) => setRadioValue(value)}
                            />
                        </View>
                    </View>
                    <View>
                        <CustomDropdown
                            title="Section"
                            items={sectionList}
                            value={sectionValue}
                            onValueChange={onSectionValueChange}
                        />
                        <CustomDropdown
                            title="Topic"
                            items={topicList}
                            value={topicValue}
                            onValueChange={(value) => setTopicValue(value)}
                        />
                        <CustomDropdown
                            title="Act or Condition"
                            value={actValue}
                            onValueChange={(value) => setActValue(value)}
                            items={actList}
                        />
                        <CustomDropdown
                            title={actValue && actValue.startsWith("Unsafe") ? "Hazard" : "Preventive Hazard"}
                            items={hazardList}
                            value={hazardValue}
                            onValueChange={(value) => setHazardValue(value)}
                        />
                    </View>
                    <View style={{ marginTop: '2.5%' }}>
                        <Input
                            label="Observation"
                            labelStyle={{ marginBottom: 5 }}
                            numberOfLines={3}
                            multiline={true}
                            textAlignVertical="top"
                            placeholder="Type Something"
                            placeholderTextColor="gray"
                            inputContainerStyle={inputContainerStyle}
                            onChangeText={handleChange("observation")}
                            onBlur={handleBlur("observation")}
                            errorMessage={errors.observation}
                        />
                    </View>
                    <View>
                        <Button title="Submit" />
                    </View>
                </ScrollView>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    autocompleteContainer: {
        backgroundColor: '#ffffff',
        borderWidth: 0,
    },
    descriptionContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    itemText: {
        fontSize: 15,
        paddingTop: 5,
        paddingBottom: 5,
        margin: 2,
    },
    infoText: {
        textAlign: 'center',
        fontSize: 16,
    }
})
