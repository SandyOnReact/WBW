import React, { useState, useCallback } from 'react'
import { View, Text, Image, Keyboard } from 'react-native'
import { images } from '../utils/images'
import { Button, Input, Icon } from "react-native-elements";
import { api } from '../utils/api'
import { useFormik } from "formik"
import { string, object } from 'yup'
import { useFocusEffect } from "@react-navigation/native"
import Toast from 'react-native-simple-toast'
import AsyncStorage from '@react-native-async-storage/async-storage'

//TODO: reset form on login button click.
//TODO: formik should only validate the given field and not others. 
export const LoginScreen = ( { navigation} ) => {

    const [isSecured, setIsSecured] = useState( true )
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
    } = useFormik( {
        initialValues: {
            username: "",
            password: "",
        },
        validationSchema: object( {
            username: string()
                .required(),
            password: string()
                .required()
                .min( 6 )
        } ),
        async onSubmit( { username, password } ) {
            Keyboard.dismiss()
            const result = await api.post(  {
                "url": 'api/User/UserLogin',
                body: {
                    UserName:username, 
                    Password:password
                }  
            } )
            if( result.Message ){
                Toast.showWithGravity(result.Message, Toast.LONG, Toast.TOP);
                return null
            }

            // save Accesstoken in localstorage
            await saveToken( result.AccessToken )

            // navigating to Home screen once logged in
            navigation.navigate( 'Home' )
        },
    } )

    const saveToken = async ( value ) => {
        try {
            await AsyncStorage.setItem('Token', value)
          } catch(e) {
            // save error
          }
    }
    
    useFocusEffect(
        useCallback( () => {
            return () => {
                resetForm()
            }
        }, [] ),
    )

    return (
        <View style={{ flex: 1, backgroundColor: 'white', }}>
            <View style={{ flex: 2.5, backgroundColor: 'white', marginTop: '25%', alignItems: 'center' }}>
                <Image source={images.WBW_Logo} resizeMode='contain' width={90} height={90} />
            </View>
            <View style={{ flex: 6.5, marginHorizontal: '8%', marginTop: '2%' }}>
                <Input
                    touched={touched.username}
                    errorMessage={errors.username}
                    placeholder='Enter Username'
                    inputContainerStyle={{ borderBottomWidth: 1, borderColor: '#1e5873'}}
                    inputStyle={{ height: 4 }}
                    onChangeText={handleChange( "username" )}
                    onBlur={handleBlur( "username" )}
                    onSubmitEditing={() => passwordRef.current.focus()}
                />
                <Input
                    placeholder='Enter Password'
                    inputContainerStyle={{ borderBottomWidth: 1, borderColor: '#1e5873', marginTop: 10 }}
                    inputStyle={{ height: 4 }}
                    touched={touched.password}
                    errorMessage={errors.password}
                    secureTextEntry={isSecured}
                    onChangeText={handleChange( "password" )}
                    onBlur={handleBlur( "password" )}
                    onSubmitEditing={handleSubmit}
                />
                <Button 
                    title='Login' 
                    onPress={handleSubmit} 
                    buttonStyle={{ backgroundColor: '#1e5873', padding: '3%' }} 
                    containerStyle={{ marginTop: '5%', borderRadius: 7 }}
                    disabled={!isValid || isSubmitting || isValidating}
                    loading={isSubmitting || isValidating} 
                />
            </View>
        </View>
    )
    
}

