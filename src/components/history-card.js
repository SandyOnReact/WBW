import React from 'react'
import { View, Text, Dimensions } from 'react-native'
import { isEmpty } from "lodash"

export const HistoryCard = (props) => {

    const { history } = props;

    const renderObservationNumberAndStatus = () => {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', borderTopLeftRadius: 20, borderTopRightRadius: 20, flexDirection: 'row', backgroundColor: '#1e5873' }}>
                <View style={{ flex: 0.7, padding: '5%' }}>
                    <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{history.ObservationNumber}</Text>
                </View>
                <View style={{ flex: 0.3, justifyContent: 'center', height: '100%', padding: '5%', alignItems: 'flex-end' }}>
                    <Text style={{ color: 'white', fontSize: 16 }}>{history.Status}</Text>
                </View>
            </View>
        )
    }

    const renderHistoryCardDetails = (title, value) => {
        return (
            <View style={{ flex: 1}}>
                <View style={{ flex: 1, flexDirection: 'row', paddingLeft: '5%' }}>
                    <View style={{ flex: 0.5 }}>
                        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{title}</Text>
                    </View>
                    <View style={{ flex: 0.5 }}>
                        <Text style={{ fontSize: 16 }}>{value}</Text>
                    </View>
                </View>
                <View style={{ flex: 0.1, marginBottom: 10 }} />
            </View>

        )
    }

    return (
        <View flex={1} margin="5%">
            <View style={{ borderRadius: 20, borderWidth: 0.5, backgroundColor: 'lightgray' }}>
                {renderObservationNumberAndStatus()}
                <View style={{ marginTop: '5%', marginBottom: '5%' }}>
                    {!isEmpty(history.Observation) && renderHistoryCardDetails('Observation: ', history.Observation)}
                    {!isEmpty(history.Location) && renderHistoryCardDetails('Location: ', history.Location)}
                    {!isEmpty(history.Category) && renderHistoryCardDetails('Category: ', history.Category)}
                    {!isEmpty(history.Section) && renderHistoryCardDetails('Section: ', history.Section)}
                    {!isEmpty(history.Topic) && renderHistoryCardDetails('Topic: ', history.Topic)}
                    {!isEmpty(history.PreventiveHazard) && renderHistoryCardDetails('Preventive Hazard: ', history.PreventiveHazard)}
                    {!isEmpty(history.Hazard) && renderHistoryCardDetails('Hazard: ', history.Hazard)}
                    {!isEmpty(history.IsFollowUpNeeded) && renderHistoryCardDetails('isFollowUpNeeded: ', history.IsFollowUpNeeded)}
                    {!isEmpty(history.DateCreated) && renderHistoryCardDetails('Date Created: ', history.DateCreated)}
                    {!isEmpty(history.SubmittedBy) && renderHistoryCardDetails('Submitted By: ', history.SubmittedBy)}
                    {!isEmpty(history.OutstandingTask) && renderHistoryCardDetails('Outstanding Task: ', history.OutstandingTask)}
                </View>
            </View>
        </View>
    )
}
