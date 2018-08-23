import { AppRegistry } from 'react-native';
import App from './src/App';


//正式版禁止打印
if (!__DEV__) {
    global.console = {
        info: () => {
        },
        log: () => {
        },
        warn: () => {
        },
        error: () => {
        },
    };
}

console.ignoredYellowBox=['Warning: isMounted'];
AppRegistry.registerComponent('InLuohe', () => App);
