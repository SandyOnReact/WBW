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
import { StyleSheet } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../utils/api'
import { isEmpty } from 'lodash'
import { AutoCompleteInput } from '../components/autocomplete-input/autocomplete.input'
import { CustomTimePicker } from '../components/core/custom-time-picker'
import { Alert } from 'react-native'

let date = new Date()
let topicList = []
const radioButtons = [
    { label: 'Yes', value: "1" },
    { label: 'No', value: "0" }
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

export const AddObservationScreen = ( props ) => {

    const { dashboard } = props.route.params
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
    const [finalValue, setFinalView] = useState('');
    const [filteredData, setFilteredData] = useState([]);

    const [whereObservationHappened,setWhereObservationHappened] = useState( '' )
    const [observation,setObservation] = useState( '' )
    const [token,setToken] = useState( '' )
    const [userData,setUserData] = useState( {} )
    const [actText,setActText] = useState( '' )
    const [isButtonLoading,setIsButtonLoading] = useState( false )



    const inputContainerStyle = { borderWidth: 1, borderColor: '#1e5873', borderRadius: 6 }
    const STATUS_BAR_HEIGHT = getStatusBarHeight()
    const navigation = useNavigation()
    const navigatetoBackScreen = () => {
        navigation.goBack()
    }

    const fetchUserInfoFromStorage = async () => {
        const userInfo = await AsyncStorage.getItem('USER_INFO');
        return userInfo != null ? JSON.parse(userInfo) : null;
    }

    useEffect(() => {
        getAllData()
    }, [])

    const getUser = async ( ) => {
        const user = await fetchUserInfoFromStorage()
        return user;
    }

    const getToken = async ( ) => {
        const token = await AsyncStorage.getItem('Token')
        return token
    }

    const getAllData = async () => {
        const user = await getUser()
        const token = await getToken()
        const result = await api.post({
            url: `api/Common/GetAllFilters`,
            body: {
                UserID: user.UserID,
                AccessToken: token,
                CompanyID: user.CompanyID,
                ObservationSettingID: dashboard.ObservationSettingID
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
            const act = { label: item.Value, value: item.ID }
            return act;
        }, [])
        const hazardData = result.Hazards.map(item => {
            const hazard = { label: item.Value, value: item.ID }
            return hazard;
        }, [])

        const sectionData = result.Sections.map((item, index) => {
            const section = { label: item.Value, value: item.ID }
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
        setShow(Platform.OS === 'ios' ? true : false);
        if (mode === 'date') {
            const pickedDate = moment(currentDate).format("MM/DD/YYYY")
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
            if (item.ID === value) return item
        })
        topicList = topicsBasedOnSections.Topics.map(item => {
            const topic = { label: item.Value, value: item.ID }
            return topic
        })
        setSectionValue(value)
    }

    const searchFilterFunction = (text) => {
        // Check if searched text is not blank
        if (text) {
            const newData = autoCompleteArray.filter(function (item) {
                const itemData = item.Name
                    ? item.Name.toUpperCase()
                    : ''.toUpperCase();
                const textData = text.toUpperCase();
                return itemData.indexOf(textData) > -1;
            });
            setFilteredData(newData);
            setFinalView(text);
        } else {
            setFilteredData([]);
            setFinalView(text);
        }
    };

    const renderTextInput = () => {
        return (
            <Input
                label="Where did the Observation occur"
                labelStyle={{ marginBottom: 5 }}
                placeholder="Type Something"
                placeholderTextColor="gray"
                multiline={true}
                numberOfLines={1}
                value={finalValue}
                inputStyle={{ fontSize: 14 }}
                inputContainerStyle={inputContainerStyle}
                onChangeText={(text) => searchFilterFunction(text)}
            />
        )
    }

    const renderItem = ({ item }) => {
        return (
            <TouchableOpacity
                onPress={() => {
                    setSelectedValue(item);
                    setFilteredData([]);
                    setFinalView(item.Name)
                }}>
                <Text style={styles.itemText}>
                    {item.Name}
                </Text>
            </TouchableOpacity>
        )
    }

    const submitForm = async ( ) => {
        // D1FA00FA-419F-465C-8694-0838066C3011
        setIsButtonLoading( true )
        const user = await getUser()
        const token = await getToken()


        const payload = {
            UserID: user.UserID,
            AccessToken: token,
            LevelID: "d1fa00fa-419f-465c-8694-0838066c3011",
            ObservationSettingID: dashboard.ObservationSettingID,
            SectionID: sectionValue,
            TopicID: topicValue,
            ActOrConditionID: actValue,
            ActOrCondition: actText,
            HazardID: hazardValue,
            Observation: observation,
            IsFollowUpNeeded: radioValue,
            ObservationDate: dateValue,
            ObservationTime: timeValue,	
            DescribeWhereTheIncidentHappened: whereObservationHappened
        }
        const result = await api.post({
            url: 'api/Observation/SaveObservation',
            body: payload
        })

        setIsButtonLoading( false )


        return result
    }

    const showImagePickerAlert = async ( ) => {
        const result = await submitForm()
        Alert.alert(
            "upload",
            "Do you want to upload image",
            [
              {
                text: "Cancel",
                onPress: () => navigation.navigate( 'Home' ),
                style: "No"
              },
              { text: "Yes", onPress: () => navigation.navigate( 'UploadImage', {
                  observationId: result.ObservationID
              } ) }
            ],
            { cancelable: false }
          );
    }

    const getActValue = ( id ) => {
        if( isEmpty( id ) ) return null
        const currentActObject = actList.find( item => {
            if( item.value === String( id ) ) return item
        })
        setActValue( currentActObject.value )
        setActText( currentActObject.label )
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

                <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 30 }} keyboardShouldPersistTaps="always" showsVerticalScrollIndicator={false}>
                    <View style={{ marginTop: '3%'}}>
                        <AutoCompleteInput
                            data={filteredData}
                            renderItem={renderItem}
                            renderTextInput={renderTextInput}
                            maxListHeight={400}
                        />
                    </View>
                    <View>
                        <Input
                            label="Describe where the Observation happened"
                            labelStyle={{ marginBottom: 5 }}
                            numberOfLines={3}
                            multiline={true}   
                            textAlignVertical="top"
                            placeholder="Type Something"
                            placeholderTextColor="gray"
                            inputContainerStyle={inputContainerStyle}
                            onChangeText={(text)=> setWhereObservationHappened( text )}
                            value={whereObservationHappened}
                        />
                    </View>
                    <View>
                        <CustomDateTimePicker
                            label="What was the Date of the Observation"
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
                        <CustomTimePicker
                            label="What was the Time of the Observation"
                            show={show}
                            display="spinner"
                            customRightIcon={{ name: 'time-outline', type: 'ionicon', size: 24, onPress: showTimepicker }}
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
                            }}>  Follow up needed </Text>
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
                            onValueChange={getActValue}
                            items={actList}
                        />
                        <CustomDropdown
                            title={actText && actText.startsWith("Unsafe") ? "Hazard" : "Preventive Hazard"}
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
                            onChangeText={(text)=> setObservation( text )}
                            value={observation}
                        />
                    </View>
                    <View style={{ marginHorizontal: '3%'}}>
                        <Button title="Submit" onPress={showImagePickerAlert} loading={isButtonLoading}/>
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
        fontSize: 14,
        paddingTop: 5,
        paddingBottom: 5,
        margin: 2,
    },
    infoText: {
        textAlign: 'center',
        fontSize: 16,
    }
})
