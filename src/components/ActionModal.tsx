import React from 'react';
import { Modal, View, StyleSheet, Pressable, TouchableOpacity } from 'react-native';
import { X } from 'lucide-react-native';

interface ActionModalProps {
    isVisible: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

export const ActionModal = ({ isVisible, onClose, children }: ActionModalProps) => {
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isVisible}
            onRequestClose={onClose}
        >
            <Pressable style={styles.overlay} onPress={onClose}>
                <View style={styles.modalContainer} onStartShouldSetResponder={() => true}>
                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <X color="white" size={24} />
                    </TouchableOpacity>
                    {children}
                </View>
            </Pressable>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.85)',
        justifyContent: 'flex-end',
    },
    modalContainer: {
        backgroundColor: '#09090B', 
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 24,
        borderWidth: 1,
        borderColor: '#27272A',
        minHeight: '60%',
    },
    closeButton: {
        alignSelf: 'flex-end',
        marginBottom: 10,
    },
});