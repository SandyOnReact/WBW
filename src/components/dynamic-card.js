import React, { useState } from 'react'
import { View, Text } from 'react-native'
import _, { isEmpty } from "lodash"
import { FlatList } from 'react-native'
import { CustomDropdown } from '../components/core/custom-dropdown'
import { Input } from "react-native-elements"

const inputContainerStyle = { borderWidth: 1, borderColor: '#1e5873', borderRadius: 6 }

export const ScoreDropdown = ( { item, scoreLabel } ) => {
    const [scoreValue,setScoreValue] = useState( '' )
    const scoreData = item.ScoreList.map( item => {
        const score = { label: item.Value, value: item.ID }
        return score
    })
    return (
        <CustomDropdown
            title={scoreLabel}
            items={scoreData}
            value={scoreValue}
            onValueChange={(value) => setScoreValue(value)}
        />
    )
}
export const SourceDropdown = ( { sourceList } ) => {
    const [sourceValue,setSourceValue] = useState( '' )
    const sourceData = sourceList.map( item => {
        const source = { label: item.Value, value: item.ID }
        return source
    })
    return (
        <CustomDropdown
            title="Source"
            items={sourceData}
            value={sourceValue}
            onValueChange={(value) => setSourceValue(value)}
        />
    )
}
export const HazardDropdown = ( { hazardList } ) => {
    const [hazardValue,setHazardValue] = useState( '' )
    const hazardData = hazardList.map( item => {
        const hazard = { label: item.Value, value: item.ID }
        return hazard
    })
    return (
        <CustomDropdown
            title="Hazards"
            items={hazardData}
            value={hazardValue}
            onValueChange={(value) => setHazardValue(value)}
        />
    )
}

export const CommentInput = ( { item } ) => {
    const [inputValue,setInputValue] = useState( item?.Comments )
    return (
        <View>
            <Input
                label="Comments"
                labelStyle={{ marginBottom: 5 }}
                textAlignVertical="top"
                placeholder="Type Here"
                placeholderTextColor="#9EA0A4"
                inputStyle={{padding:10, textAlign: 'auto',fontSize:16}}
                inputContainerStyle={{...inputContainerStyle, minHeight: 60, maxHeight: 90 }}
                containerStyle={{ margin: 0 }}
                errorStyle={{ margin: -5 }}
                value={inputValue}
                onChangeText={(text) => setInputValue( text )}
            />
        </View>
    )
}
const DynamicGroups = ( props ) => {
    const {
        dynamicGroups,
        sourceList,
        hazardList,
        scoreLabel 
    } = props
    const sortedDynamicGroup = _.sortBy( dynamicGroups?.Attributes, ( item ) => item.AttributeOrder )

    const renderHazardDropdown = ( item ) => {
        if( isEmpty( sourceList ) ) {
            return null
        }else{
            if( item.DoNotShowHazard === "True" ) {
                return null
            }else{
                return (
                    <View>
                        <HazardDropdown hazardList={hazardList} />
                    </View>  
                )
            }
        }
    }

    const renderGroupsByAuditAndInspectionId = ( item ) => {
        if( item.AuditAndInspectionId === '6' ) {
            return null
        }
        return (
            <View>
                    <View>
                        <ScoreDropdown item={item} scoreLabel={scoreLabel} />
                    </View>
                    {
                        isEmpty( sourceList ) 
                        ? null 
                        : (
                            <View>
                                <SourceDropdown sourceList={sourceList} />
                            </View>  
                        )
                    }
                    {
                        renderHazardDropdown( item )
                    }
            </View>
        )
    }

    const renderItem = ( { item } ) => {
        return (
            <View style={{ flex: 1, marginHorizontal: '3%', marginVertical: '2%'}}>
                <View style={{ marginHorizontal: '3%'}}>
                    <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{item.AttributeOrder} {item.Title}</Text>
                </View>
                { 
                    renderGroupsByAuditAndInspectionId( item )
                }
                <View style={{ marginTop: '3%' }}>
                    <CommentInput item={item} />
                </View>
            </View>
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


