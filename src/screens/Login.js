import React, { useState, useCallback } from 'react'
import { View, Text, Image, Keyboard ,Platform} from 'react-native'
import { images } from '../utils/images'
import { Button, Input, Avatar } from "react-native-elements";
import { api } from '../utils/api'
import { useFormik } from "formik"
import { useKeyboard } from "@react-native-community/hooks";

import { string, object } from 'yup'
import { useFocusEffect } from "@react-navigation/native"
import Toast from 'react-native-simple-toast'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { ScrollView } from 'react-native';

//TODO: reset form on login button click.
//TODO: formik should only validate the given field and not others. 
//TODO: once authentication flow is setup, remove navigataion.navigate function()
export const LoginScreen = ({ navigation }) => {
    const keyboard = useKeyboard();
    const [isSecured, setIsSecured] = useState(true)
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
            username: "",
            password: "",
        },
        validationSchema: object({
            username: string()
                .required(),
            password: string()
                .required()
                .min(6)
        }),
        async onSubmit({ username, password }) {
            Keyboard.dismiss()
            const result = await api.post({
                "url": 'api/User/UserLogin',
                body: {
                    UserName: username,
                    Password: password
                }
            })
            if (result.Message) {
                Toast.showWithGravity(result.Message, Toast.LONG, Toast.TOP);
                return null
            }

            // save Accesstoken in localstorage
            await saveToken(result.AccessToken)

            // save Entire response object in Asynstorage
            const { ['AccessToken']: remove, ...rest } = result

            const userInfoWithoutToken = JSON.stringify(rest)
            await saveUserInfo(userInfoWithoutToken)
            resetForm({ username: "", password: ""})
            // navigating to Home screen once logged in
            navigation.navigate('Home')
        },
    })


    const saveUserInfo = async (value) => {
        try {
            await AsyncStorage.setItem('USER_INFO', value)
        } catch (e) {
            // save error
            Toast.showWithGravity(result.Message, Toast.LONG, Toast.TOP);
            return null
        }
    }

    const saveToken = async (value) => {
        try {
            await AsyncStorage.setItem('Token', value)
        } catch (e) {
            // save error
            Toast.showWithGravity(result.Message, Toast.LONG, Toast.TOP);
            return null
        }
    }
    
    return (
            <View style={{ flex:9, marginHorizontal: '8%'}}>
                <ScrollView style={{flex:1}} showsVerticalScrollIndicator={false}>

            <View style={{  marginTop: '25%', alignItems: 'center' ,marginBottom :"15%"}}>
                <Image source={images.WBW_Logo} style={{
                    width: 150,
                    height: 150,
                    borderRadius: 150 / 2,
                    overflow: "hidden",
                    borderWidth: 1,
                    borderColor: "white"
                }} />
            </View>
                <Text style={{fontSize:22,alignSelf:'center',fontWeight:'bold',marginTop:"-2%",marginBottom:"4%"}}> Login</Text>
                <Input
                    touched={touched.username}
                    errorMessage={errors.username}
                    placeholder='Enter Username'
                    inputContainerStyle={{ borderBottomWidth: 1, borderColor: '#1e5873' }}
                    inputStyle={{ height: 4 }}
                    onChangeText={handleChange("username")}
                    onBlur={handleBlur("username")}
                />
                <Input
                    placeholder='Enter Password'
                    inputContainerStyle={{ borderBottomWidth: 1, borderColor: '#1e5873', marginTop: 10 }}
                    inputStyle={{ height: 4 }}
                    touched={touched.password}
                    errorMessage={errors.password}
                    secureTextEntry={isSecured}
                    onChangeText={handleChange("password")}
                    onBlur={handleBlur("password")}
                />
                <Button
                    title='Login'
                    onPress={handleSubmit}
                    buttonStyle={{ backgroundColor: '#1e5873', padding: '3%' }}
                    containerStyle={{ marginTop: '5%', borderRadius: 7 }}
                    disabled={!isValid || isSubmitting || isValidating}
                    loading={isSubmitting || isValidating}
                />
                 {
                keyboard.keyboardShown && Platform.OS === 'ios' ?
                    <View height = { keyboard.keyboardHeight }/> :
                    null
            }
              </ScrollView>
             
            </View>
                    
    )

}

