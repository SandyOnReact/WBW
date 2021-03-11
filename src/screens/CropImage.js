import React, { useRef, useState } from 'react'
import { View, Text, Dimensions } from 'react-native'
import { CropView } from "react-native-image-crop-tools"
import { Header } from 'react-native-elements'
import { neverSettle } from 'react-async'
import { api } from '../utils/api'
import { useNavigation } from "@react-navigation/native"
import { ActivityIndicator } from 'react-native'


export const CropImageScreen = (props) => {
    const { imageUrl, imageData, observationId } = props.route.params
    const [url, setUrl] = useState(imageUrl)
    const [isLoading, setIsLoading] = useState( false )
    const cropperView = useRef()
    const navigation = useNavigation()

    function goBack() {
        navigation.goBack()
    }

    function cropImage() {
        cropperView.current.saveImage(true, 90)
    }

   
    function onImageCrop(res) {
        setUrl(res.uri)
    }

    async function onSubmit( ) {
        setIsLoading( true )    
        const result = await api.imageUpload({
            image: imageData,
            url: `api/Observation/Upload?ObservationID=${observationId}`
        })
        setIsLoading( false )    
        navigation.navigate( 'Home' )
    }

    if( isLoading ) {
        return (
            <View style={{ flex:1, justifyContent: 'center', alignItems: 'center'}}>
                <ActivityIndicator color="red" />
            </View>
        )
    }

    return (
        <View style={{ flex: 1 }}>
            <Header
                containerStyle={{ height: 56  }}
                statusBarProps={{ barStyle: "light-content", translucent: true, backgroundColor: "transparent" }}
                containerStyle={{ backgroundColor: '#1e5873' }}
                leftComponent={{ icon: 'arrow-back', type: 'ionicons', color: 'white', onPress: goBack }}
                rightComponent={{ icon: 'check', type: 'ionicons', color: 'white', onPress: onSubmit }}
                rightContainerStyle={{ marginRight: 10 }}
                centerComponent={{ text: "Crop", style: { color: '#fff', fontWeight: 'bold', fontSize: 16 } }}
            />
            <CropView
                style={{ flex: 1 }}
                ref={cropperView}
                sourceUrl={url}
                onImageCrop={onImageCrop}
                keepAspectRatio
                aspectRatio={{ width: imageData.width, height: imageData.height }}
            />
        </View>
    )
}

