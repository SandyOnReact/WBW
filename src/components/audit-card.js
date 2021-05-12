import React from 'react'
import { View, Text, Dimensions } from 'react-native'
import { isEmpty } from "lodash"

export const AuditCard = (props) => {

    const { audit, templateDetails } = props;

    const renderTemplateDetails = () => {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', borderTopLeftRadius: 20, borderTopRightRadius: 20, flexDirection: 'row', backgroundColor: '#1e5873' }}>
                <View style={{ flex: 0.5, padding: '5%' }}>
                    <Text style={{ color: 'white', fontSize: 15, fontWeight: 'bold' }}>{templateDetails.Type}</Text>
                </View>
                <View style={{ flex: 0.5, justifyContent: 'center', height: '100%', padding: '5%', alignItems: 'flex-end' }}>
                    <Text style={{ color: 'white', fontSize: 15 }}>{templateDetails.Title}</Text>
                </View>
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
                    {!isEmpty(audit.FullName) && renderAuditCardDetails('FullName: ', audit?.FullName)}
                    {!isEmpty(audit.RecordNumber) && renderAuditCardDetails('RecordNumber: ', audit.RecordNumber)}
                    {!isEmpty(audit.LastDayOfSchedulePeriod) && renderAuditCardDetails('LastDayOfSchedulePeriod: ', audit.LastDayOfSchedulePeriod)}
                    {!isEmpty(audit.Status) && renderAuditCardDetails('Status: ', audit.Status)}
                    {!isEmpty(audit.Tasks) && renderAuditCardDetails('Tasks: ', audit.Tasks)}
                    {!isEmpty(audit.IsOutstandingTaskRequired) && renderAuditCardDetails('IsOutstandingTaskRequired: ', audit.IsOutstandingTaskRequired)}
                    {!isEmpty(audit.AuditAndInspectionFor) && renderAuditCardDetails('AuditAndInspectionFor: ', audit.AuditAndInspectionFor)}
                    {!isEmpty(audit.Work_Site_Name_Value) && renderAuditCardDetails('Work_Site_Name_Value: ', audit.Work_Site_Name_Value)}
                    {!isEmpty(audit.AuditAndInspectionID) && renderAuditCardDetails('AuditAndInspectionID: ', audit.AuditAndInspectionID)}
                    {!isEmpty(audit.AddDateTime) && renderAuditCardDetails('AddDateTime: ', audit.AddDateTime)}
                    {!isEmpty(audit.CompletedDateTime) && renderAuditCardDetails('CompletedDateTime: ', audit.CompletedDateTime)}
                </View>
            </View>
        </View>
    )
}
