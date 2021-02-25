import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { View, Text } from 'react-native'
import { Overlay } from 'react-native-elements'
import TreeView from 'react-native-final-tree-view'

export const OverlayComponent = (props) => {
    const { isVisible, treeData, onBackdropPress } = props;

    const getIndicator = (isExpanded, hasChildrenNodes) => {
        if (!hasChildrenNodes) {
            return '*';
        } else if (isExpanded) {
            return '-';
        } else {
            return '+';
        }
    };


    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ padding: 10 }}>
                <TreeView
                    data={treeData}
                    renderNode={
                        ({
                            node,
                            level,
                            isExpanded,
                            hasChildrenNodes
                        }) => {
                            return (
                                <View>
                                    <Text
                                        style={{
                                            marginLeft: 25 * level,
                                            fontSize: 18,
                                        }}>
                                        {getIndicator(isExpanded, hasChildrenNodes)}
                                        {node.name}
                                    </Text>
                                </View>
                            );
                        }}
                />
            </View>
        </SafeAreaView>

    )
}
