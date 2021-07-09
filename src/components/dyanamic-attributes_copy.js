import React from 'react'
import { View, Text } from 'react-native'

const DynamicAttributeCopy = ( props ) => {
    const {
        item,
        scoreLabel,
        sourceList,
        hazardList,
        auditAndInspectionId
    } = props
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
                        
                    </View>
                )
            }
            <View style={{ marginTop: '3%' }}>
                <CommentInput item={item} selectedScoreValue={selectedScoreValue} isMandatoryType={item.IsCommentsMandatory} />
            </View>
    </View>
    )
}

export default DynamicAttributeCopy
