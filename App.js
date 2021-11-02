/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import { NavigationContainer } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { RootNavigator } from './src/navigators/root-navigator';
import { SafeAreaProvider } from "react-native-safe-area-context";
import CodePush from 'react-native-code-push';

const App = () => {

  useEffect(()=>{
    syncCodePushUpdates()
  }, [] )

  const syncCodePushUpdates = async ( ) => {
    await CodePush.sync()
  }

  return (
    //tags 
    <NavigationContainer>
      <SafeAreaProvider>
        <RootNavigator />
      </SafeAreaProvider>
    </NavigationContainer>

  )
}

export default App;
