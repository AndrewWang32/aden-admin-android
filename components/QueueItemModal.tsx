import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
} from 'react-native';
import { QueueItem } from '../services/api';

interface QueueItemModalProps {
  visible: boolean;
  item: QueueItem | null;
  onClose: () => void;
  onCall?: (id: string) => Promise<void>;
  onSkip?: (id: string) => Promise<void>;
  onCancel?: (id: string) => Promise<void>;
  onDone?: (id: string) => Promise<void>;
  disabled?: boolean;
}

const getStatusText = (status: string) => {
  switch (status) {
    case 'waiting':
      return '等待中';
    case 'called':
      return '已叫號';
    case 'done':
      return '已完成';
    case 'cancelled':
      return '已取消';
    default:
      return status;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'waiting':
      return '#2d4c41';
    case 'called':
      return '#FFB870';
    case 'done':
      return '#76867b';
    case 'cancelled':
      return '#76867b';
    default:
      return '#76867b';
  }
};

export const QueueItemModal: React.FC<QueueItemModalProps> = ({
  visible,
  item,
  onClose,
  onCall,
  onSkip,
  onCancel,
  onDone,
  disabled = false,
}) => {
  if (!item) return null;

  const statusText = getStatusText(item.status);
  const statusColor = getStatusColor(item.status);
  const canOperate = item.status === 'waiting' || item.status === 'called';

  const handleAction = async (action: () => Promise<void>) => {
    // 先关闭模态框
    onClose();
    // 然后执行操作（在关闭后执行，这样处理中状态会显示）
    try {
      await action();
    } catch (err) {
      // 错误处理由调用方处理
      throw err;
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {/* 标题 */}
            <View style={styles.header}>
              <Text style={styles.title}>號碼 {item.id}</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={onClose}
                disabled={disabled}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* 信息内容 */}
            <View style={styles.infoContainer}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>姓名：</Text>
                <Text style={styles.infoValue}>{item.name}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>人數：</Text>
                <Text style={styles.infoValue}>{item.party_size} 人</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>狀態：</Text>
                <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
                  <Text style={styles.statusText}>{statusText}</Text>
                </View>
              </View>
              {item.user_id && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>LINE ID：</Text>
                  <Text style={styles.infoValue}>{item.user_id}</Text>
                </View>
              )}
            </View>

            {/* 操作按钮 */}
            <View style={styles.actionsContainer}>
              {canOperate && (
                <>
                  {onCall && item.status === 'waiting' && (
                    <TouchableOpacity
                      style={[styles.actionButton, styles.callButton]}
                      onPress={() => handleAction(() => onCall(item.id))}
                      disabled={disabled}
                    >
                      <Text style={styles.actionButtonText}>叫號</Text>
                    </TouchableOpacity>
                  )}
                  {onSkip && (
                    <TouchableOpacity
                      style={[styles.actionButton, styles.skipButton]}
                      onPress={() => handleAction(() => onSkip(item.id))}
                      disabled={disabled}
                    >
                      <Text style={styles.actionButtonText}>過號</Text>
                    </TouchableOpacity>
                  )}
                  {onCancel && (
                    <TouchableOpacity
                      style={[styles.actionButton, styles.cancelButton]}
                      onPress={() => handleAction(() => onCancel(item.id))}
                      disabled={disabled}
                    >
                      <Text style={styles.actionButtonText}>取消</Text>
                    </TouchableOpacity>
                  )}
                </>
              )}
              {item.status === 'called' && onDone && (
                <TouchableOpacity
                  style={[styles.actionButton, styles.doneButton]}
                  onPress={() => handleAction(() => onDone(item.id))}
                  disabled={disabled}
                >
                  <Text style={styles.actionButtonText}>完成</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={[styles.actionButton, styles.closeActionButton]}
                onPress={onClose}
                disabled={disabled}
              >
                <Text style={styles.closeActionButtonText}>關閉</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(24, 59, 48, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
  },
  modalContent: {
    backgroundColor: '#eeebe1',
    borderRadius: 10,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#d4d0c5',
  },
  title: {
    fontSize: 20,
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
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  infoContainer: {
    padding: 14,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  infoLabel: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
    minWidth: 70,
  },
  infoValue: {
    fontSize: 16,
    color: '#183b30',
    fontWeight: '600',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    minWidth: 65,
    alignItems: 'center',
  },
  statusText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  actionsContainer: {
    padding: 14,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#d4d0c5',
    gap: 8,
  },
  actionButton: {
    padding: 11,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 42,
  },
  callButton: {
    backgroundColor: '#FFB870',
  },
  skipButton: {
    backgroundColor: '#2d4c41',
  },
  cancelButton: {
    backgroundColor: '#d32f2f',
  },
  doneButton: {
    backgroundColor: '#2d4c41',
  },
  closeActionButton: {
    backgroundColor: '#76867b',
    marginTop: 2,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  closeActionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});


