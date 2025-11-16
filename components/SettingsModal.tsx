import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';

interface SettingsModalProps {
  visible: boolean;
  onClose: () => void;
  limits: {
    today_people_limit: number | null;
    today_people_remaining: number | null;
    weekly: Record<string, number>;
  } | null;
  onLoadLimits: () => Promise<void>;
  onSaveLimits: (json: string) => Promise<void>;
}

const weekdayNames = ['週日', '週一', '週二', '週三', '週四', '週五', '週六'];

export const SettingsModal: React.FC<SettingsModalProps> = ({
  visible,
  onClose,
  limits,
  onLoadLimits,
  onSaveLimits,
}) => {
  const [weeklyLimits, setWeeklyLimits] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // 初始化输入框值
  useEffect(() => {
    if (limits?.weekly) {
      const initialValues: Record<string, string> = {};
      for (let i = 0; i <= 6; i++) {
        initialValues[i] = limits.weekly[i]?.toString() || '';
      }
      setWeeklyLimits(initialValues);
    }
  }, [limits, visible]);

  const handleLoadLimits = async () => {
    setIsLoading(true);
    try {
      await onLoadLimits();
      Alert.alert('成功', '上限設定已載入');
    } catch (error: any) {
      Alert.alert('錯誤', error.message || '載入失敗');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveLimits = async () => {
    setIsSaving(true);
    try {
      const limitsToSave: Record<string, number> = {};
      let hasValidLimit = false;

      // 收集所有输入的值
      for (let i = 0; i <= 6; i++) {
        const value = weeklyLimits[i]?.trim();
        if (value) {
          const numValue = parseInt(value, 10);
          if (numValue > 0) {
            limitsToSave[i] = numValue;
            hasValidLimit = true;
          }
        }
      }

      if (!hasValidLimit) {
        Alert.alert('錯誤', '請至少設定一個有效的人數上限');
        setIsSaving(false);
        return;
      }

      await onSaveLimits(JSON.stringify(limitsToSave));
      Alert.alert('成功', '每週上限設定已儲存');
      onClose();
    } catch (error: any) {
      Alert.alert('錯誤', error.message || '儲存失敗');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLimitChange = (weekday: number, value: string) => {
    setWeeklyLimits((prev) => ({
      ...prev,
      [weekday]: value,
    }));
  };

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
            <Text style={styles.title}>設定</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>每週每日上限</Text>

            <View style={styles.limitsGrid}>
              {[0, 1, 2, 3, 4, 5, 6].map((weekday) => (
                <View key={weekday} style={styles.limitRow}>
                  <Text style={styles.weekdayLabel}>
                    {weekdayNames[weekday]}
                  </Text>
                  <TextInput
                    style={styles.limitInput}
                    placeholder="—"
                    value={weeklyLimits[weekday] || ''}
                    onChangeText={(value) => handleLimitChange(weekday, value)}
                    keyboardType="numeric"
                    maxLength={3}
                  />
                </View>
              ))}
            </View>

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.actionButton, styles.loadButton]}
                onPress={handleLoadLimits}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <>
                    <Text style={styles.buttonIcon}>🔄</Text>
                    <Text style={styles.buttonText}>載入</Text>
                  </>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.saveButton]}
                onPress={handleSaveLimits}
                disabled={isSaving}
              >
                {isSaving ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <>
                    <Text style={styles.buttonIcon}>💾</Text>
                    <Text style={styles.buttonText}>儲存</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
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
  limitsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  limitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '48%',
    marginBottom: 8,
    paddingVertical: 6,
    paddingHorizontal: 8,
    backgroundColor: '#fff',
    borderRadius: 6,
  },
  weekdayLabel: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    minWidth: 50,
  },
  limitInput: {
    borderWidth: 1,
    borderColor: '#76867b',
    borderRadius: 6,
    padding: 6,
    paddingHorizontal: 8,
    fontSize: 14,
    backgroundColor: '#fff',
    width: 70,
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 6,
    minHeight: 40,
    marginHorizontal: 4,
  },
  loadButton: {
    backgroundColor: '#2d4c41',
  },
  saveButton: {
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
});

