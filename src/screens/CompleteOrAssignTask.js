import React, { useState } from 'react'
import { View , Text, Image } from 'react-native'
import { getStatusBarHeight } from 'react-native-status-bar-height'
import { Header, Input, Button } from "react-native-elements"
import RadioForm from 'react-native-simple-radio-button';
import { useNavigation, useRoute } from "@react-navigation/native"
import { isEmpty } from "lodash"

const radioButtons = [
    { label: 'Complete Task', value: "Complete Task" },
    { label: 'Assign Task', value: "Assign Task" }
]

const inputContainerStyle = { borderWidth: 1, borderColor: '#1e5873', borderRadius: 6 }
export const CustomInput = ( { value } ) => {
    const [inputValue,setInputValue] = useState( value )  
    return (
        <View>
            <Input
                label="Task Title"
                labelStyle={{ marginBottom: 5 }}
                textAlignVertical="top"
                placeholder="Task Title"
                placeholderTextColor="#9EA0A4"
                inputContainerStyle={inputContainerStyle}
                inputStyle={{ padding:10, textAlign: 'auto',fontSize:16 }}
                containerStyle={{ margin: 0 }}
                errorStyle={{ margin: -5 }}
                value={inputValue}
                onChangeText={(text) => setInputValue( text )}
            />
        </View>
    )
}

export const CustomTextAreaInput = ( { value } ) => {
    const [inputValue,setInputValue] = useState( value )
    return (
        <View>
            <Input
                label="Comments"
                labelStyle={{ marginBottom: 5 }}
                textAlignVertical="top"
                placeholder="Comments"
                placeholderTextColor="#9EA0A4"
                inputStyle={{padding:10, textAlign: 'auto',fontSize:16}}
                inputContainerStyle={{...inputContainerStyle, minHeight: 60, maxHeight: 90 }}
                containerStyle={{ margin: 0 }}
                errorStyle={{ margin: -5 }}
                value={inputValue}
                onChangeText={(text) => setInputValue( text )}
            />
        </View>
    )
}

export const CompleteTask = ( props ) => {
    const {
        selectedHazardValue,
        hazardData,
        item
    } = props
    const [hazardImageValue,setHazardImageValue] = useState( '' )
    const [imagesObject, setImagesObject ] = useState( {} )
    const navigation = useNavigation()

    const selectedHazard = hazardData.find( item => item.value === selectedHazardValue )

    const onImageReceive = ( url, imageData ) => {
        const imageObj = { ...imageData, uri: url }
        setImagesObject( imageObj )
    }

    const navigateToImagePicker = ( ) => {
        navigation.navigate( 'UploadImage', {
            callback: ( url, imageData ) => onImageReceive( url, imageData )
        } )
    }

    const renderImage = ( ) => {
        if( !isEmpty( imagesObject ) ) {
            return (
                <View style={{ width: 100, height: 100, marginHorizontal: '5%', flexDirection: 'row'}}>
                    <Image
                        source={{ uri: imagesObject.uri }}
                        style={{
                            width: 100,
                            height: 100,
                            borderRadius: 8,
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}
                    />
                </View>
            )
        }else{
            return null
        }
    }

    const onCompleteTask = ( ) => {
        //
    }

    const navigateToBackScreen = ( ) => {
        navigation.goBack()
    }

    return (
       <View style={{ flex: 1, marginHorizontal: '3%', marginVertical: '3%' }}>
           <View style={{ flexDirection: 'row', marginHorizontal: '3%', alignItems: 'center' }}>
                <Text style={{ fontSize: 16, fontWeight: 'bold'}}>Selected Hazard: </Text>
                <Text style={{ marginHorizontal: '5%', fontSize: 16 }}>{selectedHazard?.label}</Text>
           </View>
           <View style={{ marginVertical: '5%'}}>
               <CustomInput value={item.Title} />
           </View>
           <View>
               <CustomTextAreaInput value="" />
           </View>
            <View style={{ marginTop: '5%'}}>
                    <Input
                        label="Upload Hazard Completion Image"
                        labelStyle={{ marginBottom: 5 }}
                        textAlignVertical="top"
                        placeholder="Select Image"
                        placeholderTextColor="#9EA0A4"
                        inputContainerStyle={inputContainerStyle}
                        inputStyle={{ padding:10, textAlign: 'auto',fontSize:16 }}
                        containerStyle={{ margin: 0 }}
                        rightIcon={{ name: 'camera', type:'feather', style: { marginRight: 10 }, onPress: navigateToImagePicker }}
                        errorStyle={{ margin: -5 }}
                        value={hazardImageValue}
                        onChangeText={(text) => setHazardImageValue( text )}
                        />
                </View>
                <View>
                    {renderImage()}
                </View>
                <View style={{ marginTop: '3%', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center'}}>
                    <Button  title="Complete Task" titleStyle={{ fontSize: 14 ,fontWeight:'bold'}}  buttonStyle={{ backgroundColor: '#1e5873', padding: 15 }} containerStyle={{ width: '42%'}} onPress={onCompleteTask} />
                    <Button  title="Cancel" titleStyle={{ fontSize: 14 , fontWeight:'bold'}} buttonStyle={{ backgroundColor: '#1e5873', padding: 15 }} containerStyle={{ width: '42%'}} onPress={navigateToBackScreen}/>
                </View>
       </View>
    )
}

export const AssignTask = () => {
    return (
        <Text>Assign Task</Text>
    )
}

export const CompleteOrAssignTask = ( props ) => {
    const route = useRoute()
    const { 
        selectedHazardValue,
        hazardData,
        item
    } = route.params
    const STATUS_BAR_HEIGHT = getStatusBarHeight()
    const navigation = useNavigation()
    const [radioValue,setRadioValue] = useState( 'Complete Task' )

    const navigatetoBackScreen = () => {
        navigation.goBack()
    }

    const renderFormBasedOnRadioValue = ( ) => {
        if( radioValue === "Complete Task" ) {
            return (
                <CompleteTask 
                    selectedHazardValue={selectedHazardValue}
                    hazardData={hazardData}
                    item={item}
                />
            )
        }else{
            return (
                <AssignTask />
            )
        }
    }

    return (
        <View style={{ flex: 1 }}>
            <Header
                containerStyle={{ height: 56 + STATUS_BAR_HEIGHT }}
                statusBarProps={{ barStyle: "light-content", translucent: true, backgroundColor: "transparent" }}
                containerStyle={{ backgroundColor: '#1e5873' }}
                leftComponent={{ icon: 'arrow-back', type: 'ionicons', color: 'white', onPress: navigatetoBackScreen }}
                centerComponent={{ text: 'Complete or Assign Task', style: { color: '#fff', fontSize: 16 } }}
            />
            <View style={{ flex: 1 }}>
                <View style={{ marginVertical: 15 }}>
                    <Text style={{
                        color: '#86939e',
                        fontWeight: 'bold', fontSize: 16, paddingLeft: '3%', marginBottom: '1%'
                    }}>Please Select</Text>
                    <RadioForm style={{ marginLeft: 100 }}
                        radio_props={radioButtons}
                        initial={0}
                        formHorizontal={true}
                        labelHorizontal={true}
                        radioStyle={{ paddingRight: 50 }}
                        buttonColor={'#86939e'}
                        selectedButtonColor={'#1e5873'}
                        labelStyle={{ fontSize: 16 }}
                        animation={true}
                        style={{ paddingHorizontal: 15 }}
                        onPress={(value) => setRadioValue(value)}
                    />
                </View>
                {renderFormBasedOnRadioValue()}
            </View>        
        </View>
    )
}

