import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';

interface AddQueueFormProps {
  onAdd: (name: string, size: number, userId?: string) => Promise<void>;
  disabled?: boolean;
}

export const AddQueueForm: React.FC<AddQueueFormProps> = ({ onAdd, disabled = false }) => {
  const [name, setName] = useState('');
  const [size, setSize] = useState('');
  const [userId, setUserId] = useState('');

  const handleAdd = async () => {
    const nameTrimmed = name.trim();
    const sizeNum = parseInt(size, 10);

    if (!nameTrimmed) {
      Alert.alert('錯誤', '請輸入姓名');
      return;
    }

    if (!sizeNum || sizeNum < 1 || sizeNum > 20) {
      Alert.alert('錯誤', '請輸入有效的人數 (1-20)');
      return;
    }

    try {
      await onAdd(nameTrimmed, sizeNum, userId.trim() || undefined);
      setName('');
      setSize('');
      setUserId('');
      Alert.alert('成功', '候位已新增');
    } catch (error: any) {
      Alert.alert('錯誤', error.message || '新增失敗');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="姓名（必填）"
        value={name}
        onChangeText={setName}
        maxLength={20}
        editable={!disabled}
      />
      
      <TextInput
        style={styles.input}
        placeholder="人數（必填，1-20）"
        value={size}
        onChangeText={setSize}
        keyboardType="numeric"
        editable={!disabled}
      />
      
      <TextInput
        style={[styles.input, styles.lastInput]}
        placeholder="LINE 使用者ID（選填）"
        value={userId}
        onChangeText={setUserId}
        maxLength={50}
        editable={!disabled}
      />
      
      <TouchableOpacity
        style={[styles.addButton, disabled && styles.disabled]}
        onPress={handleAdd}
        disabled={disabled}
      >
        <Text style={styles.addButtonText}>➕ 新增候位</Text>
      </TouchableOpacity>
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
    marginBottom: 6,
    backgroundColor: '#fff',
  },
  lastInput: {
    marginBottom: 8,
  },
  addButton: {
    backgroundColor: '#2d4c41',
    padding: 8,
    borderRadius: 6,
    alignItems: 'center',
    minHeight: 36,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  disabled: {
    opacity: 0.5,
  },
});

