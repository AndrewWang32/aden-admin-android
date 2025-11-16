import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
} from 'react-native';
import { NumberInput } from './NumberInput';
import { AddQueueForm } from './AddQueueForm';

interface ActionsModalProps {
  visible: boolean;
  onClose: () => void;
  onNumberAction: (number: string, action: 'call' | 'skip' | 'cancel' | 'done') => Promise<void>;
  onAddQueue: (name: string, size: number, userId?: string) => Promise<void>;
  disabled?: boolean;
}

export const ActionsModal: React.FC<ActionsModalProps> = ({
  visible,
  onClose,
  onNumberAction,
  onAddQueue,
  disabled = false,
}) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>操作選單</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>號碼操作</Text>
            <NumberInput
              onAction={onNumberAction}
              disabled={disabled}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>人工新增候位</Text>
            <AddQueueForm
              onAdd={onAddQueue}
              disabled={disabled}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(24, 59, 48, 0.5)',
  },
  modalContent: {
    backgroundColor: '#eeebe1',
    borderRadius: 12,
    width: '90%',
    maxWidth: 500,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#76867b',
  },
  title: {
    fontSize: 19,
    fontWeight: '600',
    color: '#183b30',
  },
  closeButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#2d4c41',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  section: {
    padding: 12,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#183b30',
    marginBottom: 10,
  },
});

