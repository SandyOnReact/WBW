import React, { useState, useEffect } from 'react'
import { View, Text } from 'react-native'
import { Input } from 'react-native-elements'
import { CustomDropdown } from './core/custom-dropdown'
import _, { isEmpty } from "lodash"
import { useNavigation } from '@react-navigation/core'
import AsyncStorage from "@react-native-async-storage/async-storage"
import { Platform } from 'react-native'


const inputContainerStyle = { borderWidth: 1, borderColor: '#1e5873', borderRadius: 6 }

export const CommentInput = ( { item, selectedScoreValue, isMandatoryType, onCommentInputChange, commentsFromHazard, attributeIdFromHazard } ) => {
    const shouldCheckForNonApplicableValues = item.ScoreList.find( item => {
        if( item.Value === "Not Applicable" && item.ID === selectedScoreValue ) {
            return true
        }else{
            return false
        }
    })
    const checkIfTruthyValues = item.ScoreList.find( item => {
        if( ["True", "False", "Yes", "No","Pass","Fail"].includes( item.Value ) && item.ID === selectedScoreValue ) {
            return true
        }else{
            return false
        }
    })

    const [inputValue,setInputValue] = useState( item.Comments )

    useEffect(()=>{
        setInputValue(item.Comments)
        onCommentInputChange( item.Comments )
    },[item.Comments])
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
            else if( checkIfTruthyValues ? Number( selectedScoreValue ) === Number( item.CorrectAnswerID ) : Number( selectedScoreValue ) >= Number( item.CorrectAnswerID ) ) {
                commentLabel = 'Comments *'
                break;
            }else{
                commentLabel = 'Comments'
                break;
            }
        }
        case 'Mandatory for Failing Score': {
            if( Number(selectedScoreValue) !== 0 && Number( selectedScoreValue ) < Number( item.CorrectAnswerID ) ) {
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


    const onChangeText = ( value ) => {
        setInputValue( value )
        onCommentInputChange( value )
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
                onChangeText={onChangeText}
            />
        </View>
    )
}

export const SourceDropdown = ( { sourceList, onSourceValueSelected } ) => {
    const [sourceValue,setSourceValue] = useState( '' )
    const sourceData = sourceList.map( item => {
        const source = { label: item.Value, value: item.ID }
        return source
    })

    const onSourceValueChange = ( value ) => {
        setSourceValue( value )
        onSourceValueSelected( value )
    }

    return (
        <CustomDropdown
            title="Source"
            items={sourceData}
            value={sourceValue}
            onValueChange={(value)=>onSourceValueChange(value)}
        />
    )
}

export const HazardDropdown = ( { hazardList, item, auditAndInspectionId, onHazardValueSelected } ) => {
    const navigation = useNavigation()
    const [hazardValue,setHazardValue] = useState( '' )
    const [shouldUpdate,setShouldUpdate] = useState( false )
    useEffect(()=> {
        setHazardValueBasedonClearHazard()
    }, [item.HazardsID] )

    const setHazardValueBasedonClearHazard = async ( ) => {
        console.log( 'Inside clearing haazard', item.HazardsID)
        setHazardValue(null)
        await AsyncStorage.removeItem("cancelData")
    }

    const hazardData = hazardList.map( item => {
        const hazard = { label: item.Value, value: item.ID }
        return hazard
    })
    const onClear = ( ) => {
        console.log( 'clearing hazard' )
        setHazardValue( '' )
    }

    const onUpdateHazard = ( newHazard ) => {
        console.log( 'Inside new hazard', JSON.stringify( newHazard ) )
        setShouldUpdate( !shouldUpdate )
        setHazardValue( newHazard )
        onHazardValueSelected( newHazard )
    }

    const navigateToCompleteOrAssignTask = async ( ) => {
        await AsyncStorage.setItem( 'AttributeID', item.AttributeID )
        navigation.navigate( 'CompleteOrAssignTask', {
            selectedHazardValue: hazardValue,
            hazardData: hazardData,
            item: item,
            auditAndInspectionId: auditAndInspectionId,
            clearHazards: ( ) => onClear(),
            updateHazards: ( newHazard ) => onUpdateHazard( newHazard ),
            from: "audit"
        } )
        onHazardValueSelected( value )
    }

    const onHazardValueChange = async ( value ) => {
        console.log( 'value in hazard is  ',value)
        if( value === null ) {
            setHazardValue( value )
            onHazardValueSelected( '' )
            return null
        }
        setHazardValue( value )
        if( Platform.OS === "android" ) {
            navigateToCompleteOrAssignTask()
        }
    }

    return (
        <CustomDropdown
            title="Hazards *"
            items={hazardData}
            value={hazardValue}
            onValueChange={onHazardValueChange}
            onDonePress={navigateToCompleteOrAssignTask}
        />
    )
}



const RenderHazardDropdown = ( props ) => {
    const {
        item, 
        scoreValue, 
        sourceList, 
        hazardList, 
        auditAndInspectionId, 
        onHazardValueSelected
    } = props
    const shouldCheckForTruthyValues = item.CorrectAnswerValue === "True" || item.CorrectAnswerValue === "Yes" || item.CorrectAnswerValue === "Pass"|| item.CorrectAnswerValue === "Fail"  ||item.CorrectAnswerValue === "No" || item.CorrectAnswerValue === "False" || item.CorrectAnswerValue === "Not Applicable"
    // if( isEmpty( sourceList ) ) {
    //     return null
    // }else{
    //     if( item.DoNotShowHazard === "True" || shouldCheckForTruthyValues ? Number(scoreValue) === Number(item.CorrectAnswerID) : Number( scoreValue ) >= Number( item.CorrectAnswerID ) ) {
    //         return null
    //     }else{
    //         return (
    //             <View>
    //                 <HazardDropdown 
    //                     hazardList={hazardList}
    //                     item={item} 
    //                     auditAndInspectionId={auditAndInspectionId}
    //                     onHazardValueSelected={(value)=>onHazardValueSelected(value)}
    //                 />
    //             </View>  
    //         )
    //     }
    // }
    const shouldCheckForNonApplicableValues = item.ScoreList.some( item => {
        if( item.Value === "Not Applicable" && item.ID === scoreValue ) {
            return true
        }else{
            return false
        }
    })
    
    if( item.DoNotShowHazard === "True"){

        return null
    }
    
    if( shouldCheckForTruthyValues ? Number(scoreValue) === Number(item.CorrectAnswerID) : Number( scoreValue ) >= Number( item.CorrectAnswerID ) ) {

        return null
    }else if(shouldCheckForNonApplicableValues){
        return null
    }else{
        return (
            <View>
                <HazardDropdown 
                    hazardList={hazardList}
                    item={item} 
                    auditAndInspectionId={auditAndInspectionId}
                    onHazardValueSelected={(value)=>onHazardValueSelected(value)}
                />
            </View>  
        )
    }
}


export const GroupAttributes = ( props ) => {
    const { item, scoreLabel, sourceList, hazardList, auditAndInspectionId, currentScoreValue, checkboxValue, onSourceValueSelected, onHazardValueSelected } = props
    const [scoreValue,setScoreValue] = useState( null )
    const scoreData = item.ScoreList.map( item => {
        const score = { label: item.Value, value: item.ID }
        return score
    })

    useEffect(() => {
        if( !checkboxValue ) {
            setScoreValue( null )
        }
    }, [checkboxValue])

    const onScoreValueChange = ( value ) => {
        if( scoreValue !== value ) {
            setScoreValue( value ),
            currentScoreValue( value )
        }
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
                        value={checkboxValue && isEmpty(scoreValue) ? item.MaxCorrectAnswerID : scoreValue}
                        onValueChange={onScoreValueChange}
                    />
                )
            }
            {
                isEmpty( sourceList ) || item.AuditAndInspectionScore === "Do Not Show Score"
                ? null 
                : (
                    <View>
                        <SourceDropdown 
                            sourceList={sourceList}
                            onSourceValueSelected={(value)=>onSourceValueSelected(value)}
                        />
                    </View>  
                )
            }
            {
                 isEmpty( scoreValue ) 
                 ? null 
                 // : renderHazardDropdown( item, scoreValue, sourceList, hazardList, auditAndInspectionId, )         
                 : <RenderHazardDropdown 
                        item={item}
                        scoreValue={scoreValue}
                        sourceList={sourceList}
                        hazardList={hazardList}
                        auditAndInspectionId={auditAndInspectionId}
                        onHazardValueSelected={(value)=>onHazardValueSelected(value)}
                    />
            }
        </View>
    )
}

export const DynamicAttribute = ( props ) => {
    const { item, scoreLabel, sourceList, hazardList, auditAndInspectionId, checkboxValue, onSelectScoreValue, onSelectedSourceValue, onHazardValueSelected, onCommentInputChange } = props
    const [selectedScoreValue, setSelectedScoreValue] = useState( '' )
    const [commentValue, setCommentValue] = useState( '' )
    const [commentsFromHazard, setCommentsFromHazard] = useState( '' )
    const [attributeIdFromHazard, setAttributeIdFromHazard] = useState( '' )
    const onChangeCurrentScoreValue = ( value ) => {
        setSelectedScoreValue( value )
        onSelectScoreValue( value )
    }

    const onChangeCurrentSourceValue = ( value ) => {
        onSelectedSourceValue( value )
    }

    const onCommentValueChange = ( value ) => {
        setCommentValue( value )
        onCommentInputChange( value )
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
                            onSourceValueSelected={(value)=>onChangeCurrentSourceValue(value)}
                            onHazardValueSelected={(value)=>onHazardValueSelected(value)}
                            checkboxValue={checkboxValue}
                            onCommentInputChange={(value)=>onCommentInputChange(value)}
                       />
                    </View>
                )
            }
            <View style={{ marginTop: '3%' }}>
                <CommentInput 
                    item={item} 
                    selectedScoreValue={selectedScoreValue} 
                    isMandatoryType={item.IsCommentsMandatory}
                    onCommentInputChange={(value, id )=>onCommentValueChange(value, id)}
                    commentsFromHazard={commentsFromHazard}
                    attributeIdFromHazard={attributeIdFromHazard}
                />
            </View>
    </View>
    )
}
