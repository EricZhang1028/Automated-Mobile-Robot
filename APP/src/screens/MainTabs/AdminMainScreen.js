import { Navigation } from 'react-native-navigation';

const startAdminScreen = () => {
    Navigation.startSingleScreenApp({
        screen: {
            screen: 'IM3514_Project.ManagerScreen', // unique ID registered with Navigation.registerScreen
            title: '管理者介面', // title of the screen as appears in the nav bar (optional)            
        },
        drawer: {
            left: {                
                screen: "IM3514_Project.SideDrawer",                
            },
        },
        animationType: 'slide-down' // optional, add transition animation to root change: 'none', 'slide-down', 'fade'
    });
}

export default startAdminScreen;