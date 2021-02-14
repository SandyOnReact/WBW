import React from 'react'
import { View, Text } from 'react-native'
import { ListItem } from 'react-native-elements';

export const DashboardCard = (props) => {
    const { dashboard, onDashboardPress } = props;

    const onPress = () => {
        onDashboardPress( dashboard )
    }

    return (
        <ListItem bottomDivider containerStyle={{ paddingLeft: '7%'}} onPress={onPress}>
            <ListItem.Content>
                <ListItem.Title style={{ color: '#1e5873' }}>{dashboard.Title}</ListItem.Title>
                <ListItem.Subtitle>
                    <View style={{ flex: 1, flexDirection: 'column'}}>
                        <Text>{dashboard.Category}</Text>
                        <Text>{dashboard.CreatedOn}</Text>
                    </View>
                </ListItem.Subtitle>
            </ListItem.Content>
            <ListItem.Chevron style={{ height: 30 }} />
        </ListItem>
    )
}
