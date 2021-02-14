import React from 'react'
import { View, Text, Dimensions } from 'react-native'

export const HistoryCard = (props) => {

    const { history } = props;

    return (
        <View style={{ width: '90%', height: Dimensions.get('screen').height * 0.60, margin: '5%' }}>
            <View style={{ width: '100%', height: Dimensions.get('screen').height * 0.6, borderRadius: 20, borderWidth: 0.5, backgroundColor: 'lightgray' }}>

                <View style={{ width: '100%', height: '12%', borderTopLeftRadius: 20, borderTopRightRadius: 20, flexDirection: 'row', backgroundColor: '#1e5873' }}>
                    <View style={{ width: '70%', height: '100%', padding: '5%' }}>
                        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{history.Topic}</Text>
                    </View>
                    <View style={{ width: '30%', alignSelf: 'center', marginTop: '5%', height: '100%', padding: '5%', alignItems: 'flex-end' }}>
                        <Text style={{ color: 'white', fontSize: 16 }}>{history.Status}</Text>
                    </View>
                </View>
                <View style={{ height: '88%', marginTop: '5%' }}>
                    <View style={{ width: '100%', flexDirection: 'row', paddingLeft: '5%' }}>
                        <View style={{ width: '50%' }}>
                            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Observation Name: </Text>
                        </View>
                        <View style={{ width: '50%' }}>
                            <Text style={{ fontSize: 16 }}>{history.Observation}</Text>
                        </View>
                    </View>
                    <View style={{ height: '2%' }} />
                    <View style={{ width: '100%', flexDirection: 'row' }}>
                        <View style={{ width: '50%', paddingLeft: '5%' }}>
                            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Observation Number: </Text>
                        </View>
                        <View style={{ width: '50%', paddingLeft: '5%' }}>
                            <Text style={{ fontSize: 16 }}>{history.ObservationNumber}</Text>
                        </View>
                    </View>
                    <View style={{ height: '2%' }} />
                    <View style={{ width: '100%', flexDirection: 'row' }}>
                        <View style={{ width: '50%', paddingLeft: '5%' }}>
                            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Category: </Text>
                        </View>
                        <View style={{ width: '50%', paddingLeft: '5%' }}>
                            <Text style={{ fontSize: 16 }}>{history.Category}</Text>
                        </View>
                    </View>
                    <View style={{ height: '2%' }} />
                    <View style={{ width: '100%', flexDirection: 'row' }}>
                        <View style={{ width: '50%', paddingLeft: '5%' }}>
                            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Section: </Text>
                        </View>
                        <View style={{ width: '50%', paddingLeft: '5%' }}>
                            <Text style={{ fontSize: 16 }}>{history.Section}</Text>
                        </View>
                    </View>
                    <View style={{ height: '2%' }} />
                    <View style={{ width: '100%', flexDirection: 'row' }}>
                        <View style={{ width: '50%', paddingLeft: '5%' }}>
                            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Hazard: </Text>
                        </View>
                        <View style={{ width: '50%', paddingLeft: '5%' }}>
                            <Text style={{ fontSize: 16 }}>{history.Hazard}</Text>
                        </View>
                    </View>
                    <View style={{ height: '2%' }} />
                    <View style={{ width: '100%', flexDirection: 'row' }}>
                        <View style={{ width: '50%', paddingLeft: '5%' }}>
                            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Follow Up: </Text>
                        </View>
                        <View style={{ width: '50%', paddingLeft: '5%' }}>
                            <Text style={{ fontSize: 16 }}>{history.IsFollowUpNeeded}</Text>
                        </View>
                    </View>
                    <View style={{ height: '2%' }} />
                    <View style={{ width: '100%', flexDirection: 'row' }}>
                        <View style={{ width: '50%', paddingLeft: '5%' }}>
                            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Date Created: </Text>
                        </View>
                        <View style={{ width: '50%', paddingLeft: '5%' }}>
                            <Text style={{ fontSize: 16 }}>{history.DateCreated}</Text>
                        </View>
                    </View>
                    <View style={{ height: '2%' }} />
                    <View style={{ width: '100%', flexDirection: 'row' }}>
                        <View style={{ width: '50%', paddingLeft: '5%' }}>
                            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Submitted By: </Text>
                        </View>
                        <View style={{ width: '50%', paddingLeft: '5%' }}>
                            <Text style={{ fontSize: 16 }}>{history.SubmittedBy}</Text>
                        </View>
                    </View>
                    <View style={{ height: '2%' }} />
                    <View style={{ width: '100%', flexDirection: 'row' }}>
                        <View style={{ width: '50%', paddingLeft: '5%' }}>
                            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Show Manage Task: </Text>
                        </View>
                        <View style={{ width: '50%', paddingLeft: '5%' }}>
                            <Text style={{ fontSize: 16 }}>{history.ShowManageTask}</Text>
                        </View>
                    </View>
                    <View style={{ height: '2%' }} />
                    <View style={{ width: '100%', flexDirection: 'row' }}>
                        <View style={{ width: '50%', paddingLeft: '5%' }}>
                            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Outstanding Task: </Text>
                        </View>
                        <View style={{ width: '50%', paddingLeft: '5%' }}>
                            <Text style={{ fontSize: 16 }}>{history.OutstandingTask}</Text>
                        </View>
                    </View>
                    <View style={{ height: '2%' }} />
                    <View style={{ width: '100%', flexDirection: 'row' }}>
                        <View style={{ width: '50%', paddingLeft: '5%' }}>
                            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Location: </Text>
                        </View>
                        <View style={{ width: '50%', paddingLeft: '5%' }}>
                            <Text style={{ fontSize: 16 }}>{history.Location}</Text>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    )
}
