import React, { useState } from 'react'
import { View, Text } from 'react-native'
import _, { isEmpty } from "lodash"
import { FlatList } from 'react-native'
import { CustomDropdown } from '../components/core/custom-dropdown'
import { Input } from "react-native-elements"
import { DynamicAttribute } from "./dynamic-attributes"

const inputContainerStyle = { borderWidth: 1, borderColor: '#1e5873', borderRadius: 6 }

/**
 * 
 * if selected value of score is same as correctAnswer value/ID, do not hazard dropdown
 * fot all other condition keep same logic.
 */

const DynamicGroups = ( props ) => {
    const {
        dynamicGroups,
        sourceList,
        hazardList,
        scoreLabel 
    } = props
    const sortedDynamicGroup = _.sortBy( dynamicGroups?.Attributes, ( item ) => item.AttributeOrder )
    
    const renderItem = ( { item } ) => {
        return (
            <DynamicAttribute 
                item={item} 
                scoreLabel={scoreLabel}
                sourceList={sourceList}
                hazardList={hazardList}
            />
        )
    }

    return (
        <View style={{ flex: 1 }}>
            <View style={{ backgroundColor: '#1e5873', height: 50, marginVertical: '3%', borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginHorizontal: '5%' }}>
                <Text style={{ textAlign: 'center', color: 'white'}}>{dynamicGroups.GroupName}</Text>
            </View>
            <View style={{ flex: 1 }}>
                <FlatList 
                    data={sortedDynamicGroup}
                    renderItem={renderItem}
                    contentContainerStyle={{ paddingBottom: 30 }}
                    keyExtractor={( item ) => item.AttributeID }
                />
            </View>
        </View>
    )
}

export const DynamicGroupsCard = React.memo( DynamicGroups, showPickerProps )

const showPickerProps = ( nextProps, prevProps ) => {
    return (
        nextProps.AttributeID === prevProps.AttributeID
    )
}


