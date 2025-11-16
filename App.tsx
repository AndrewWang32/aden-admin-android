import React, { useEffect, useState } from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useQueueStore } from './store/queueStore';
import { QueueList } from './components/QueueList';
import { ActionButtons } from './components/ActionButtons';
import { InfoPanel } from './components/InfoPanel';
import { SettingsModal } from './components/SettingsModal';
import { ActionsModal } from './components/ActionsModal';
import { QueueItemModal } from './components/QueueItemModal';
import { QueueItem } from './services/api';

export default function App() {
  const {
    queue,
    isLoading,
    isOperating,
    error,
    lastUpdateTime,
    autoRefresh,
    totals,
    limits,
    refreshQueue,
    callNext,
    callById,
    skip,
    cancel,
    done,
    addQueue,
    toggleAutoRefresh,
    getLimits,
    setLimits,
  } = useQueueStore();

  const [selectedItem, setSelectedItem] = useState<QueueItem | null>(null);
  const [showQueueItemModal, setShowQueueItemModal] = useState(false);
  const [numberInput, setNumberInput] = useState('');
  const [showNumberModal, setShowNumberModal] = useState(false);
  const [numberAction, setNumberAction] = useState<'call' | 'skip' | 'cancel' | 'done' | null>(null);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showActionsModal, setShowActionsModal] = useState(false);

  useEffect(() => {
    // 初始載入
    refreshQueue(true);
  }, []);

  useEffect(() => {
    // 顯示錯誤
    if (error) {
      Alert.alert('錯誤', error);
    }
  }, [error]);

  const handleRefresh = () => {
    refreshQueue(true);
  };

  const handleCallNext = async () => {
    try {
      await callNext();
    } catch (err: any) {
      Alert.alert('錯誤', err.message || '叫號失敗');
    }
  };

  const handleCallSpecific = () => {
    setNumberAction('call');
    setShowNumberModal(true);
  };

  const handleSkip = () => {
    setNumberAction('skip');
    setNumberInput('');
    setShowNumberModal(true);
  };

  const handleCancel = () => {
    setNumberAction('cancel');
    setNumberInput('');
    setShowNumberModal(true);
  };

  const handleDone = () => {
    setNumberAction('done');
    setNumberInput('');
    setShowNumberModal(true);
  };

  const handleNumberAction = async () => {
    if (!numberInput.trim() || !numberAction) return;

    const number = numberInput.trim().toUpperCase();
    setShowNumberModal(false);

    try {
      switch (numberAction) {
        case 'call':
          await callById(number);
          break;
        case 'skip':
          await skip(number);
          break;
        case 'cancel':
          await cancel(number);
          break;
        case 'done':
          await done(number);
          break;
      }
      setNumberInput('');
    } catch (err: any) {
      Alert.alert('錯誤', err.message || '操作失敗');
    }
  };

  const handleAddQueue = async (name: string, size: number, userId?: string) => {
    try {
      await addQueue(name, size, userId);
    } catch (err: any) {
      throw err;
    }
  };

  const handleItemPress = (item: QueueItem) => {
    if (isOperating) return; // 如果正在操作，不显示对话框
    setSelectedItem(item);
    setShowQueueItemModal(true);
  };

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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar />
      
      {/* Loading Indicator */}
      {(isLoading || isOperating) && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2d4c41" />
          <Text style={styles.loadingText}>
            {isOperating ? '處理中，請稍候...' : '載入中...'}
          </Text>
        </View>
      )}

      {/* Main Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
      >
        {/* Logo */}
        <View style={styles.logoContainer}>
          <View style={styles.logoWrapper}>
            <Image
              source={require('./assets/aden-logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          <View style={styles.headerButtons}>
            <TouchableOpacity
              style={[styles.autoRefreshButton, autoRefresh && styles.autoRefreshActive]}
              onPress={toggleAutoRefresh}
            >
              <Text style={[styles.autoRefreshText, autoRefresh && styles.autoRefreshTextActive]}>
                {autoRefresh ? '⏰ 開啟' : '⏰ 關閉'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionsButton}
              onPress={() => setShowActionsModal(true)}
            >
              <Text style={styles.actionsButtonText}>📝</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.settingsButton}
              onPress={() => setShowSettingsModal(true)}
            >
              <Text style={styles.settingsButtonText}>⚙️</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <ActionButtons
            onRefresh={handleRefresh}
            onCallNext={handleCallNext}
            onCallSpecific={handleCallSpecific}
            onSkip={handleSkip}
            onCancel={handleCancel}
            onDone={handleDone}
            disabled={isLoading || isOperating}
          />
        </View>


        {/* Info Panel */}
        <InfoPanel
          totals={totals}
          limits={limits}
          lastUpdateTime={lastUpdateTime}
        />

        {/* Queue List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>候位清單</Text>
          <QueueList queue={queue} onItemPress={handleItemPress} />
        </View>
      </ScrollView>

      {/* Number Input Modal */}
      <Modal
        visible={showNumberModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowNumberModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {numberAction === 'call' && '指定叫號'}
              {numberAction === 'skip' && '過號'}
              {numberAction === 'cancel' && '取消'}
              {numberAction === 'done' && '完成'}
            </Text>
            <TextInput
              style={styles.modalInput}
              placeholder="輸入號碼 (例如: A01)"
              value={numberInput}
              onChangeText={setNumberInput}
              autoCapitalize="characters"
              maxLength={10}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={() => {
                  setShowNumberModal(false);
                  setNumberInput('');
                }}
              >
                <Text style={styles.modalButtonText}>取消</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonConfirm]}
                onPress={handleNumberAction}
                disabled={!numberInput.trim()}
              >
                <Text style={styles.modalButtonConfirmText}>確認</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Actions Modal */}
      <ActionsModal
        visible={showActionsModal}
        onClose={() => setShowActionsModal(false)}
        onNumberAction={async (number, action) => {
          try {
            switch (action) {
              case 'call':
                await callById(number);
                break;
              case 'skip':
                await skip(number);
                break;
              case 'cancel':
                await cancel(number);
                break;
              case 'done':
                await done(number);
                break;
            }
          } catch (err: any) {
            Alert.alert('錯誤', err.message || '操作失敗');
          }
        }}
        onAddQueue={handleAddQueue}
        disabled={isLoading || isOperating}
      />

      {/* Settings Modal */}
      <SettingsModal
        visible={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        limits={limits}
        onLoadLimits={async () => {
          await getLimits();
          await refreshQueue(true);
        }}
        onSaveLimits={async (json: string) => {
          await setLimits(json);
          await refreshQueue(true);
        }}
      />

      {/* Queue Item Modal */}
      <QueueItemModal
        visible={showQueueItemModal}
        item={selectedItem}
        onClose={() => {
          setShowQueueItemModal(false);
          setSelectedItem(null);
        }}
        onCall={async (id: string) => {
          try {
            await callById(id);
          } catch (err: any) {
            Alert.alert('錯誤', err.message || '叫號失敗');
            throw err;
          }
        }}
        onSkip={async (id: string) => {
          try {
            await skip(id);
          } catch (err: any) {
            Alert.alert('錯誤', err.message || '過號失敗');
            throw err;
          }
        }}
        onCancel={async (id: string) => {
          try {
            await cancel(id);
          } catch (err: any) {
            Alert.alert('錯誤', err.message || '取消失敗');
            throw err;
          }
        }}
        onDone={async (id: string) => {
          try {
            await done(id);
          } catch (err: any) {
            Alert.alert('錯誤', err.message || '完成失敗');
            throw err;
          }
        }}
        disabled={isLoading || isOperating}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eeebe1',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 0,
    paddingVertical: 12,
    marginBottom: 8,
    marginLeft: -15,
  },
  logoWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 180,
    height: 65,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 12,
  },
  actionsButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#2d4c41',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  actionsButtonText: {
    fontSize: 18,
    color: '#fff',
  },
  settingsButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#2d4c41',
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsButtonText: {
    fontSize: 18,
    color: '#fff',
  },
  autoRefreshButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    backgroundColor: '#2d4c41',
    marginRight: 8,
  },
  autoRefreshActive: {
    backgroundColor: '#2d4c41',
  },
  autoRefreshText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
  },
  autoRefreshTextActive: {
    color: '#fff',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(238, 235, 225, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 19,
    color: '#2d4c41',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
    paddingHorizontal: 15,
  },
  section: {
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: '600',
    padding: 10,
    paddingBottom: 6,
    color: '#183b30',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(24, 59, 48, 0.5)',
  },
  modalContent: {
    backgroundColor: '#eeebe1',
    borderRadius: 12,
    padding: 24,
    width: '80%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 23,
    fontWeight: '600',
    marginBottom: 16,
    color: '#183b30',
    textAlign: 'center',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#76867b',
    borderRadius: 8,
    padding: 12,
    fontSize: 19,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 6,
  },
  modalButtonCancel: {
    backgroundColor: '#2d4c41',
  },
  modalButtonConfirm: {
    backgroundColor: '#2d4c41',
  },
  modalButtonText: {
    fontSize: 19,
    fontWeight: '600',
    color: '#fff',
  },
  modalButtonConfirmText: {
    fontSize: 19,
    fontWeight: '600',
    color: '#fff',
  },
});
