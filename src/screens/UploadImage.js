import { fromPairs } from 'lodash';
import React, { useState, useRef } from 'react'
import { View, Text } from 'react-native'
import { Button, Header, Icon } from 'react-native-elements'
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { getStatusBarHeight } from 'react-native-status-bar-height'
import { RNCamera } from "react-native-camera"
import { useNavigation } from "@react-navigation/native"

export const UploadImageScreen = ( props ) => {
    const { callback } = props.route.params
    const [imageData, setImageData] = useState({})
    const STATUS_BAR_HEIGHT = getStatusBarHeight()
    const [imageUrl, setImageUrl] = useState('')
    const [cameraType, setCameraType] = useState("front" | "back")
    const camera = useRef()
    const navigation = useNavigation()

    function selectPicture() {
        launchImageLibrary(
            {
                mediaType: 'photo',
                includeBase64: false,
                maxHeight: 200,
                maxWidth: 200,
            },
            (response) => {
                if (!response.didCancel) {
                    setImageData(response)
                    setImageUrl(response.uri)
                    goToEditImage( response.uri, response )
                }
            })
    }



    function goBack() {
        navigation.goBack()
    }

    const navigateToAddObservation = ( url, imageData ) => {
        callback( url, imageData )
        navigation.goBack()
    }

    function goToEditImage( uri, response ) {
        navigation.navigate( 'CropImage', {
            imageUrl: uri,
            imageData: response,
            callback: ( url, imageData ) => navigateToAddObservation( url, imageData )
        })
    }

    function toggleCameraType() {
        setCameraType(cameraType === "front" ? "back" : "front")
    }

    async function takePicture() {

        const result = await camera.current.takePictureAsync({
            quality: 0.5,
            fixOrientation: Platform.OS === 'android'
        })
        setImageData( result )
        setImageUrl( result.uri )
        goToEditImage( result.uri, result )
    }
    return (
        <View style={{ flex: 1 }}>
            <Header
                containerStyle={{ height: 56 + STATUS_BAR_HEIGHT }}
                statusBarProps={{ barStyle: "light-content", translucent: true, backgroundColor: "transparent" }}
                containerStyle={{ backgroundColor: '#1e5873' }}
                leftComponent={{ icon: 'arrow-back', type: 'ionicons', color: 'white', onPress: goBack }}
                centerComponent={{ text: "Upload", style: { color: '#fff', fontWeight: 'bold', fontSize: 16 } }}
            />
            <RNCamera ref={camera} style={{ flex: 1 }} type={cameraType}>
                <View style={{
                    flex: 1,
                    position: 'absolute',
                    top: 10,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    justifyContent: 'space-between',
                    flexDirection: "column",
                }}>
                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-around', alignItems: "flex-end", paddingHorizontal: 20, marginBottom: 70 }}>
                        <Icon name="repeat" color="white" size={48} onPress={toggleCameraType} />
                        <Icon name="camera" color="white" size={48} onPress={takePicture} />
                        <Icon name="image" color="white" size={48} onPress={selectPicture} />
                    </View>
                </View>
            </RNCamera>
        </View>

    )
}


