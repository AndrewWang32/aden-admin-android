import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface ActionButtonProps {
  icon: string;
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'secondary';
  disabled?: boolean;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  icon,
  label,
  onPress,
  variant = 'primary',
  disabled = false,
}) => {
  const variantStyles = {
    primary: { bg: '#2d4c41', text: '#fff' },
    success: { bg: '#2d4c41', text: '#fff' },
    warning: { bg: '#2d4c41', text: '#fff' },
    danger: { bg: '#2d4c41', text: '#fff' },
    info: { bg: '#2d4c41', text: '#fff' },
    secondary: { bg: '#2d4c41', text: '#fff' },
  };

  const style = variantStyles[variant];

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: disabled ? '#ccc' : style.bg },
        disabled && styles.disabled,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <Text style={styles.icon}>{icon}</Text>
      <Text style={[styles.label, { color: style.text }]}>{label}</Text>
    </TouchableOpacity>
  );
};

interface ActionButtonsProps {
  onRefresh: () => void;
  onCallNext: () => void;
  onCallSpecific: () => void;
  onSkip: () => void;
  onCancel: () => void;
  onDone: () => void;
  disabled?: boolean;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  onRefresh,
  onCallNext,
  onCallSpecific,
  onSkip,
  onCancel,
  onDone,
  disabled = false,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <ActionButton
          icon="🔄"
          label="刷新清單"
          onPress={onRefresh}
          variant="primary"
          disabled={disabled}
        />
        <ActionButton
          icon="📢"
          label="叫下一組"
          onPress={onCallNext}
          variant="success"
          disabled={disabled}
        />
      </View>
      <View style={styles.row}>
        <ActionButton
          icon="📢"
          label="指定叫號"
          onPress={onCallSpecific}
          variant="info"
          disabled={disabled}
        />
        <ActionButton
          icon="⏭️"
          label="過號"
          onPress={onSkip}
          variant="warning"
          disabled={disabled}
        />
      </View>
      <View style={styles.row}>
        <ActionButton
          icon="❌"
          label="取消"
          onPress={onCancel}
          variant="secondary"
          disabled={disabled}
        />
        <ActionButton
          icon="✅"
          label="完成"
          onPress={onDone}
          variant="success"
          disabled={disabled}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 6,
    marginHorizontal: 4,
    minHeight: 42,
  },
  icon: {
    fontSize: 21,
    marginRight: 6,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
  disabled: {
    opacity: 0.5,
  },
});

