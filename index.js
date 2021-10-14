/**
 * @format
 */
import 'react-native-gesture-handler';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import CodePush from 'react-native-code-push';

const RootComponent = codePush( {
    installMode: codePush.InstallMode.ON_NEXT_RESUME,
    mandatoryInstallMode: codePush.InstallMode.IMMEDIATE
} )( App )

AppRegistry.registerComponent(appName, () => RootComponent);
