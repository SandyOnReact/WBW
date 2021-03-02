import { fromPairs } from 'lodash';
import React, { useState } from 'react'
import { View, Text } from 'react-native'
import { Button, Header } from 'react-native-elements'
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import {getStatusBarHeight} from 'react-native-status-bar-height'

export const UploadImageScreen = () => {
    const [imageData, setImageData] = useState({})
    const STATUS_BAR_HEIGHT = getStatusBarHeight()
    const [imageUrl, setImageUrl] = useState('')
    const [cameraType, setCameraType] = useState("front" | "back")
    
    
    
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
                    console.log(response);
                    setImageData(response)
                    setImageUrl(response.uri)
                }
            })
    }



    function goBack() {
        navigation.goBack()
    }

    function goToEditImage() {
        navigation.navigate('Crop')
    }

    function toggleCameraType() {
        setCameraType(cameraType === "front" ? "back" : "front")
    }

    async function takePicture() {

        const result = await camera.current.takePictureAsync({
            quality: 0.5,
            fixOrientation: Platform.OS === 'android'
        })
        imagePostDraft.setRawAssetUri(result.uri)
        goToEditImage()
    }
    return (
        <View style={{ flex: 1 }}>
             <Header
                                containerStyle={{ height: 56 + STATUS_BAR_HEIGHT }}
                                statusBarProps={{ barStyle: "light-content", translucent: true, backgroundColor: "transparent" }}
                                containerStyle={{ backgroundColor: '#1e5873' }}
                                leftComponent={{ icon: 'arrow-back', type: 'ionicons', color: 'white', onPress: goBack }}
                                centerComponent={{ text: "Upload", style: { color: '#fff' ,fontWeight:'bold', fontSize:16} }}
                            />
            <View style={{ flex: 1, justifyContent: 'space-around', alignItems: 'center' }}>
                <Button name="repeat" color="white" size={48} onPress={toggleCameraType} />
                <Button name="camera" color="white" size={48} raised rounded bg="primary" onPress={takePicture} />
                <Button name="image" color="white" size={48} onPress={selectPicture} />
            </View>
        </View>

    )
}


