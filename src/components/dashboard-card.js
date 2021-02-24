import React from 'react'
import { View, Text } from 'react-native'
import { ListItem } from 'react-native-elements';

export const DashboardCard = (props) => {
    const { dashboard, onDashboardPress } = props;

    const onPress = () => {
        onDashboardPress( dashboard )
    }

    return (//#1e5873
        <ListItem bottomDivider containerStyle={{ paddingLeft: '7%',backgroundColor :'#1e5873',borderRadius:8,borderWidth:1}} onPress={onPress}>
            <ListItem.Content>
                <ListItem.Title style={{ color: 'white' }}>{dashboard.Title}</ListItem.Title>
            </ListItem.Content>
            <ListItem.Chevron style={{ height: 25 ,backgroundColor :'#1e5873'}} />
        </ListItem>
    )
}
