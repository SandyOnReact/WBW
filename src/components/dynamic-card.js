import React, { useEffect, useState } from 'react'
import { View, Text } from 'react-native'
import _, { isEmpty } from "lodash"
import { FlatList } from 'react-native'
import { DynamicAttribute } from "./dynamic-attributes"
import { Icon } from 'react-native-elements'


/**
 * 
 * if selected value of score is same as correctAnswer value/ID, do not hazard dropdown
 * fot all other condition keep same logic.
 */

let scoreArray = []
const DynamicGroups = ( props ) => {
    const {
        dynamicGroups,
        sourceList,
        hazardList,
        scoreLabel,
        auditAndInspectionId
    } = props
    const sortedDynamicGroup = _.sortBy( dynamicGroups?.Attributes, ( item ) => item.AttributeOrder )
    const [scoreArrayList, setScoreArrayList] = useState( [] )
    useEffect( ( ) =>  {
        scoreArray = !isEmpty(sortedDynamicGroup) && sortedDynamicGroup.map( item => {
            const score = {
                id: item.AuditAndInspectionScoreID,
                value: false,
                order: item.AttributeOrder,
                groupId: item.CustomFormGroupID
            }
            return score
        })
    }, [] )

    useEffect( ( ) => {
        setScoreArrayList( scoreArray )
    }, [scoreArray] )
    
    const onUpdate = ( value, id ) => {
        scoreArray = scoreArray.filter( item => {
            if( item.id === id ) {
                item.value = value
                return item
            }
            return item
        })
        return scoreArray
    }

    
    const renderItem = ( { item } ) => {
        return (
            <DynamicAttribute 
                item={item} 
                scoreLabel={scoreLabel}
                sourceList={sourceList}
                hazardList={hazardList}
                auditAndInspectionId={auditAndInspectionId}
                scoreArray={scoreArray}
                updateScoreArray={(val,id)=>onUpdate(val, id )}
            />
        )
    }

    const renderIcon = ( ) => {
        console.log( scoreArrayList )
        if( scoreArrayList.every( item => item.value === true ) ) {
            return (
                <Icon name="check" type="font-awesome" />
            )
        }else{
            return (
                <Icon name="circle-with-cross" type="entypo" />
            )
        }
    }

    return (
        <View style={{ flex: 1 }}>
            <View style={{ backgroundColor: '#1e5873', height: 50, marginVertical: '3%', borderRadius: 10, flexDirection : 'row', alignItems: "center", marginHorizontal: '5%' }}>
                <View style={{ flex: 0.1, paddingLeft: '3%' }}>
                    <Icon name="chevron-down" type="material-community" />
                </View>
                <View style={{ flex: 0.7, paddingLeft: '3%' }}>
                    <Text style={{ color: 'white' }}>{dynamicGroups.GroupName}</Text>
                </View>
                <View style={{ flex: 0.2 }}>
                   {renderIcon()}
                </View>
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


