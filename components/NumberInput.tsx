import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';

interface NumberInputProps {
  onAction: (number: string, action: 'call' | 'skip' | 'cancel' | 'done') => void;
  disabled?: boolean;
}

export const NumberInput: React.FC<NumberInputProps> = ({ onAction, disabled = false }) => {
  const [number, setNumber] = useState('');

  const handleAction = (action: 'call' | 'skip' | 'cancel' | 'done') => {
    if (number.trim()) {
      onAction(number.trim().toUpperCase(), action);
      setNumber('');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="例如: A01"
        value={number}
        onChangeText={setNumber}
        maxLength={10}
        editable={!disabled}
        autoCapitalize="characters"
        onSubmitEditing={() => handleAction('skip')}
      />
      <View style={styles.buttonContainer}>
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.actionButton, styles.callButton, (disabled || !number.trim()) && styles.disabled]}
            onPress={() => handleAction('call')}
            disabled={disabled || !number.trim()}
            activeOpacity={0.7}
          >
            <Text style={styles.buttonIcon}>📢</Text>
            <Text style={styles.buttonText}>叫號</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.skipButton, (disabled || !number.trim()) && styles.disabled]}
            onPress={() => handleAction('skip')}
            disabled={disabled || !number.trim()}
            activeOpacity={0.7}
          >
            <Text style={styles.buttonIcon}>⏭️</Text>
            <Text style={styles.buttonText}>過號</Text>
          </TouchableOpacity>
        </View>
        <View style={[styles.buttonRow, styles.lastButtonRow]}>
          <TouchableOpacity
            style={[styles.actionButton, styles.cancelButton, (disabled || !number.trim()) && styles.disabled]}
            onPress={() => handleAction('cancel')}
            disabled={disabled || !number.trim()}
            activeOpacity={0.7}
          >
            <Text style={styles.buttonIcon}>❌</Text>
            <Text style={[styles.buttonText, styles.cancelButtonText]}>取消</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.doneButton, (disabled || !number.trim()) && styles.disabled]}
            onPress={() => handleAction('done')}
            disabled={disabled || !number.trim()}
            activeOpacity={0.7}
          >
            <Text style={styles.buttonIcon}>✅</Text>
            <Text style={[styles.buttonText, styles.doneButtonText]}>完成</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 0,
    backgroundColor: 'transparent',
    marginBottom: 0,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
    color: '#183b30',
  },
  input: {
    borderWidth: 1,
    borderColor: '#76867b',
    borderRadius: 6,
    padding: 6,
    paddingHorizontal: 8,
    fontSize: 14,
    marginBottom: 8,
    backgroundColor: '#fff',
  },
  buttonContainer: {
    padding: 0,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  lastButtonRow: {
    marginBottom: 0,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    borderRadius: 6,
    marginHorizontal: 4,
    minHeight: 36,
  },
  callButton: {
    backgroundColor: '#2d4c41',
  },
  skipButton: {
    backgroundColor: '#2d4c41',
  },
  cancelButton: {
    backgroundColor: '#2d4c41',
  },
  doneButton: {
    backgroundColor: '#2d4c41',
  },
  buttonIcon: {
    fontSize: 16,
    marginRight: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  cancelButtonText: {
    color: '#fff',
  },
  doneButtonText: {
    color: '#fff',
  },
  disabled: {
    opacity: 0.5,
  },
});

