import React, { useState, useEffect } from 'react'
import { View, Text } from 'react-native'
import { Input } from 'react-native-elements'
import { CustomDropdown } from './core/custom-dropdown'
import _, { isEmpty } from "lodash"
import { useNavigation } from '@react-navigation/core'


const inputContainerStyle = { borderWidth: 1, borderColor: '#1e5873', borderRadius: 6 }

export const CommentInput = ( { item, selectedScoreValue, isMandatoryType } ) => {
    const shouldCheckForNonApplicableValues = item.ScoreList.find( item => {
        if( item.Value === "Not Applicable" && item.ID === selectedScoreValue ) {
            return true
        }else{
            return false
        }
    })
    const [inputValue,setInputValue] = useState( item?.Comments )
    let commentLabel = ''

    switch( isMandatoryType ) {
        case 'Mandatory': {
            commentLabel = 'Comments *'
            break;
        }
        case 'Mandatory for Passing Score': {
            if( shouldCheckForNonApplicableValues ) {
                commentLabel = 'Comments'
                break;
            }
            else if( Number( selectedScoreValue ) >= Number( item.CorrectAnswerID ) ) {
                commentLabel = 'Comments *'
                break;
            }else{
                commentLabel = 'Comments'
                break;
            }
        }
        case 'Mandatory for Failing Score': {
            if( Number( selectedScoreValue ) < Number( item.CorrectAnswerID ) ) {
                commentLabel = 'Comments *'
                break;
            }else{
                commentLabel = 'Comments'
            }
            
        }
        case 'Not Mandatory': {
            commentLabel = 'Comments'
            break;
        }
        case 'Mandatory for N/A': {
            if( shouldCheckForNonApplicableValues ) {
                commentLabel = 'Comments *'
                break;
            }else{
                commentLabel = 'Comments'
                break;
            }
            
        }
        case 'Mandatory for Passing Score and N/A': {
            if( Number( selectedScoreValue ) >= Number( item.CorrectAnswerID ) || shouldCheckForNonApplicableValues ) {
                commentLabel = 'Comments *'
                break;
            }else{
                commentLabel = 'Comments'
                break;
            }
        }
        case 'Mandatory for Failing Score and N/A': {
            if( Number( selectedScoreValue ) < Number( item.CorrectAnswerID ) || shouldCheckForNonApplicableValues ) {
                commentLabel = 'Comments *'
                break;
            }else{
                commentLabel = 'Comments'
                break;
            }
        }
    }

    return (
        <View>
            <Input
                label={commentLabel}
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

export const HazardDropdown = ( { hazardList, item, auditAndInspectionId } ) => {
    const navigation = useNavigation()
    const [hazardValue,setHazardValue] = useState( '' )
    const hazardData = hazardList.map( item => {
        const hazard = { label: item.Value, value: item.ID }
        return hazard
    })

    const onClear = ( ) => {
        setHazardValue( '' )
    }

    const onHazardValueChange = ( value ) => {
        setHazardValue( value )
        navigation.navigate( 'CompleteOrAssignTask', {
            selectedHazardValue: value,
            hazardData: hazardData,
            item: item,
            auditAndInspectionId: auditAndInspectionId,
            clear: ( ) => onClear()
        } )
    }

    return (
        <CustomDropdown
            title="Hazards"
            items={hazardData}
            value={hazardValue}
            onValueChange={onHazardValueChange}
        />
    )
}



const renderHazardDropdown = ( item, sourceValue, sourceList, hazardList, auditAndInspectionId ) => {
    const shouldCheckForTruthyValues = item.CorrectAnswerValue === "True" || item.CorrectAnswerValue === "False" || item.CorrectAnswerValue === "Not Applicable"
    if( isEmpty( sourceList ) ) {
        return null
    }else{
        if( item.DoNotShowHazard === "True" || shouldCheckForTruthyValues ? Number(sourceValue) === Number(item.CorrectAnswerID) : Number( sourceValue ) >= Number( item.CorrectAnswerID ) ) {
            return null
        }else{
            return (
                <View>
                    <HazardDropdown 
                        hazardList={hazardList}
                        item={item} 
                        auditAndInspectionId={auditAndInspectionId}
                    />
                </View>  
            )
        }
    }
}


export const GroupAttributes = ( props ) => {
    const { item, scoreLabel, sourceList, hazardList, auditAndInspectionId, currentScoreValue, checkboxValue } = props
    const [scoreValue,setScoreValue] = useState( '' )
    const scoreData = item.ScoreList.map( item => {
        const score = { label: item.Value, value: item.ID }
        return score
    })

    useEffect(() => {
        if( !checkboxValue ) {
            setScoreValue( '' )
        }
    }, [checkboxValue])

    const onScoreValueChange = ( value ) => {
        setScoreValue( value ),
        currentScoreValue( value )
    }
    
    return (
        <View style={{ flex: 1 }}>
            {
                item.AuditAndInspectionScore === "Do Not Show Score"
                ? null
                : (
                    <CustomDropdown
                        title={scoreLabel}
                        items={scoreData}
                        value={checkboxValue && isEmpty( scoreValue ) ? item.CorrectAnswerID : scoreValue}
                        onValueChange={onScoreValueChange}
                    />
                )
            }
            {
                isEmpty( sourceList ) || item.AuditAndInspectionScore === "Do Not Show Score"
                ? null 
                : (
                    <View>
                        <SourceDropdown sourceList={sourceList} />
                    </View>  
                )
            }
            {
                 isEmpty( scoreValue ) 
                 ? null 
                 : renderHazardDropdown( item, scoreValue, sourceList, hazardList, auditAndInspectionId )         
            }
        </View>
    )
}

export const DynamicAttribute = ( props ) => {
    const { item, scoreLabel, sourceList, hazardList, auditAndInspectionId, checkboxValue } = props
    const [selectedScoreValue, setSelectedScoreValue] = useState( '' )

    const onChangeCurrentScoreValue = ( value ) => {
        setSelectedScoreValue( value )
    }

    return (
        <View style={{ flex: 1, marginHorizontal: '3%', marginVertical: '2%'}}>
            <View style={{ marginHorizontal: '3%'}}>
                <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{item.AttributeOrder} {item.Title}</Text>
            </View>
            { 
                item.AuditAndInspectionId === '6' 
                ? null
                : (
                    <View style={{ flex: 1 }}>
                        <GroupAttributes 
                            item={item}
                            sourceList={sourceList}
                            scoreLabel={scoreLabel}
                            hazardList={hazardList}
                            auditAndInspectionId={auditAndInspectionId}
                            currentScoreValue={(value)=> onChangeCurrentScoreValue( value )}
                            checkboxValue={checkboxValue}
                       />
                    </View>
                )
            }
            <View style={{ marginTop: '3%' }}>
                <CommentInput item={item} selectedScoreValue={selectedScoreValue} isMandatoryType={item.IsCommentsMandatory} />
            </View>
    </View>
    )
}
