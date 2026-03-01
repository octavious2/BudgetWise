import React from 'react';
import { Modal, View, StyleSheet, Pressable, TouchableOpacity } from 'react-native';
import { X } from 'lucide-react-native';

interface ActionModalProps {
    isVisible: boolean;
    onClose: () => void;
    children: React.ReactNode;
    title?: string;
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

                <Pressable
                    style={styles.modalContent}
                    onStartShouldSetResponder={() => true} 
                >
                    <View style={styles.header}>
                        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                            <X color="#94a3b8" size={24} />
                        </TouchableOpacity>
                    </View>

                    {children}
                </Pressable>
            </Pressable>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)', // Dimmed background
        justifyContent: 'flex-end', // Pulls modal to the bottom
    },
    modalContent: {
        backgroundColor: '#09090B', // Dark fintech background
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingHorizontal: 20,
        paddingBottom: 40,
        paddingTop: 10,
        width: '100%',
        maxHeight: '85%', // Prevents it from covering the very top of the screen
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        width: '100%',
        paddingVertical: 10,
    },
    closeBtn: {
        padding: 5,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 20,
    },
});