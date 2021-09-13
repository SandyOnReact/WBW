import React from 'react'
import { View, Text, Dimensions } from 'react-native'
import { isEmpty } from "lodash"
import { Icon } from "react-native-elements"

export const AuditCard = (props) => {

    const { audit, templateDetails, onEditInspection } = props;

    editInspection = ( ) => {
        onEditInspection( audit?.AuditAndInspectionID )
    }


    const renderTemplateDetails = () => {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', borderTopLeftRadius: 20, borderTopRightRadius: 20, flexDirection: 'row', backgroundColor: '#1e5873' }}>
                {
                    audit.Status === "In Process"
                    ? (
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'row'}}>
                            <View style={{ flex: 0.5, padding: '5%' }}>
                                <Text style={{ color: 'white', fontSize: 15, fontWeight: 'bold' }}>{audit.RecordNumber}</Text>
                            </View>
                            <View style={{ flex: 0.4, justifyContent: 'center', height: '100%', padding: '5%', alignItems: 'flex-end' }}>
                                <Text style={{ color: 'white', fontSize: 15 }}>{audit.Status}</Text>
                            </View>
                            <View style={{ flex: 0.1, justifyContent: 'center', height: '100%', padding: '5%', alignItems: 'flex-end' }}>
                                <Icon name="edit" color="white" size={28} onPress={editInspection}/>
                            </View>
                        </View>
                    )
                    : <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                            <View style={{ flex: 0.7, padding: '5%' }}>
                                <Text style={{ color: 'white', fontSize: 15, fontWeight: 'bold' }}>{audit.RecordNumber}</Text>
                            </View>
                            <View style={{ flex: 0.3, justifyContent: 'center', height: '100%', padding: '5%', alignItems: 'flex-end' }}>
                                <Text style={{ color: 'white', fontSize: 15 }}>{audit.Status}</Text>
                            </View>
                      </View>
                }
            </View>
        )
    }

    const renderAuditCardDetails = (title, value) => {
        return (
            <View style={{ flex: 1}}>
                <View style={{ flex: 1, flexDirection: 'row', paddingLeft: '5%' }}>
                    <View style={{ flex: 0.6 }}>
                        <Text style={{ fontSize: 14, fontWeight: 'bold' }}>{title}</Text>
                    </View>
                    <View style={{ flex: 0.4 }}>
                        <Text style={{ fontSize: 13 }}>{value}</Text>
                    </View>
                </View>
                <View style={{ flex: 0.1, marginBottom: 10 }} />
            </View>

        )
    }

    return (
        <View flex={1} margin="5%">
            <View style={{ borderRadius: 20, borderWidth: 0.5, backgroundColor: 'lightgray' }}>
                {renderTemplateDetails()}
                <View style={{ marginTop: '5%', marginBottom: '5%' }}>
                    {!isEmpty(audit.FullName) && renderAuditCardDetails('Full Name: ', audit.FullName)}
                    {!isEmpty(audit.LastDayOfSchedulePeriod) && renderAuditCardDetails('Last Day Of Schedule Period: ', audit.LastDayOfSchedulePeriod)}
                    {!isEmpty(audit.Tasks) && renderAuditCardDetails('Task(s)?: ', audit.Tasks)}
                    {!isEmpty(audit.IsOutstandingTaskRequired) && renderAuditCardDetails('Outstanding Task(s)?: ', audit.IsOutstandingTaskRequired)}
                    {!isEmpty(audit.AuditAndInspectionFor) && renderAuditCardDetails('Audit And Inspection For: ', audit.AuditAndInspectionFor)}
                    {!isEmpty(audit.Work_Site_Name_Value) && renderAuditCardDetails('Work Site Name Value: ', audit.Work_Site_Name_Value)}
                </View>
            </View>
        </View>
    )
}
