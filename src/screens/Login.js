import React, { useState } from 'react'
import { View, Text, Image, TextInput, Dimensions } from 'react-native'
import { images } from '../utils/images'
import { Button, Input, Icon } from "react-native-elements";
import { api } from '../utils/api'
import { RootStore } from '../store/root-store';
import { getSnapshot } from 'mobx-state-tree'

export const LoginScreen = (props) => {

    const { navigation } = props;

    const [username, setUserName] = useState( '' )
    const [password, setPassword] = useState( '' )
    const [isSecured, setIsSecured] = useState( false )

    // api/User/UserLogin
    const onLoginPress = async ( ) => {
        const result = api.post(  {
            "url": 'api/User/UserLogin',
            body: {
                UserName:username, 
                Password:password
            }  
        } )
        navigation.navigate( 'Home' );

        // await storage.saveString( 'Token', response.AccessToken )

    }

    const rightIcon = isSecured ? "eye" : "eye-off"
    const onRightIconPress = ( e ) => {
        setIsSecured( !isSecured )
    }

    return (
        <View style={{ flex: 1, backgroundColor: 'white', }}>
            <View style={{ flex: 2.5, backgroundColor: 'white', marginTop: '25%', alignItems: 'center' }}>
                <Image source={images.WBW_Logo} resizeMode='contain' width={90} height={90} />
            </View>
            <View style={{ flex: 6.5, marginHorizontal: '8%', marginTop: '2%' }}>
                <Input
                    placeholder='Enter UserId'
                    inputContainerStyle={{ borderBottomWidth: 1, borderColor: '#1e5873'}}
                    inputStyle={{ height: 4 }}
                    value={username}
                    onChangeText={value => setUserName( value) }
                />
                <Input
                    placeholder='Enter Password'
                    inputContainerStyle={{ borderBottomWidth: 1, borderColor: '#1e5873' }}
                    inputStyle={{ height: 4 }}
                    value={password}
                    secureTextEntry={isSecured}
                    // rightIcon={rightIcon}
                    onRightIconPress={onRightIconPress}
                    onChangeText={value => setPassword( value) }
                />
                <Button title='Login' onPress={()=>onLoginPress()} buttonStyle={{ backgroundColor: '#1e5873', padding: '3%' }} containerStyle={{ marginTop: '5%', borderRadius: 7 }} />
            </View>
        </View>
    )
    
}

