import React from 'react'
import { View, Text } from 'react-native'
import { CropView } from "react-native-image-crop-tools"
import { Header } from 'react-native-elements'
import { neverSettle } from 'react-async'


export const CropImageScreen = () => {

    function goBack ( ) {
        navigation.goBack( )
    }

    function cropImage ( ) {
        cropperView.current.saveImage( true, 90 )
    }

    function goToSubmitPost ( ) {

console.log(" you succed the contrest")

    }

    function onImageCrop ( res ) {
        imagePostDraft.setCroppedImageUri( res.uri )
        goToSubmitPost( )
    }

    return (
        <View style={{ flex: 1 }}>
             <Header
                leftIcon="arrow-left"
                rightIcon={{
                    name: "check",
                    iconRatio: 0.95,
                    size: 24,
                    onPress: cropImage
                }}
                title="Crop Photo"
                onLeftIconPress={ goBack } 
            /> 
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <CropView
                    style={STYLES.cropperViewStyle}
                    ref={cropperView}
                    sourceUrl={imagePostDraft.rawAssetUri}
                    onImageCrop={onImageCrop}
                    keepAspectRatio
                    aspectRatio={{ width: 480, height: 528 }}
                />
            </View>
        </View>
    )
}

