import { create } from 'zustand';
import { api, QueueItem, QueueListResponse } from '../services/api';

interface QueueState {
  // 狀態
  queue: QueueItem[];
  isLoading: boolean;
  isOperating: boolean; // 操作中鎖定狀態
  error: string | null;
  lastUpdateTime: number | null;
  autoRefresh: boolean;
  autoRefreshInterval: NodeJS.Timeout | null;

  // 統計信息
  totals: {
    groups: number;
    people: number;
  } | null;

  // 上限信息
  limits: {
    today_people_limit: number | null;
    today_people_remaining: number | null;
    weekly: Record<string, number>;
  } | null;

  // Actions
  refreshQueue: (force?: boolean) => Promise<void>;
  callNext: () => Promise<void>;
  callById: (id: string) => Promise<void>;
  skip: (id: string) => Promise<void>;
  cancel: (id: string) => Promise<void>;
  done: (id: string) => Promise<void>;
  addQueue: (name: string, size: number, userId?: string) => Promise<void>;
  toggleAutoRefresh: () => void;
  setAutoRefresh: (enabled: boolean) => void;
  getLimits: () => Promise<void>;
  setTodayLimit: (weekday: number, people: number) => Promise<void>;
  setLimits: (json: string) => Promise<void>;
}

export const useQueueStore = create<QueueState>((set, get) => ({
  // 初始狀態
  queue: [],
  isLoading: false,
  isOperating: false,
  error: null,
  lastUpdateTime: null,
  autoRefresh: false,
  autoRefreshInterval: null,
  totals: null,
  limits: null,

  // 刷新候位清單
  refreshQueue: async (force = false) => {
    const state = get();
    
    // 檢查快取（如果不是強制刷新）
    if (!force && state.lastUpdateTime) {
      const timeSinceLastUpdate = Date.now() - state.lastUpdateTime;
      if (timeSinceLastUpdate < 15000) {
        // 15秒內使用快取（從5秒增加到15秒）
        console.log('使用快取數據');
        return;
      }
    }

    // 如果正在載入，跳過
    if (state.isLoading) {
      console.log('已有請求正在進行，跳過');
      return;
    }

    set({ isLoading: true, error: null });

    try {
      // 先執行歸檔，確保歸檔完成後再獲取列表
      try {
        const archiveResult = await api.archive();
        if (archiveResult?.ok) {
          const archived = archiveResult.archived || {};
          const moved = archived.moved || 0;
          if (moved > 0) {
            console.log(`已歸檔 ${moved} 筆非今日資料`);
          }
        }
      } catch (archiveError: any) {
        // 歸檔失敗不影響列表載入，只記錄警告
        console.warn('歸檔操作失敗（不影響列表載入）:', archiveError);
      }

      // 歸檔完成後再獲取列表，確保獲取到歸檔後的數據
      const data = await api.list() as QueueListResponse;

      set({
        queue: data.queue || [],
        totals: data.totals || null,
        limits: data.limits || null,
        lastUpdateTime: Date.now(),
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      console.error('刷新候位清單失敗:', error);
      set({
        error: error.message || '刷新失敗',
        isLoading: false,
      });
    }
  },

  // 叫下一組（樂觀更新）
  callNext: async () => {
    const state = get();
    if (state.isOperating) return; // 如果正在操作，直接返回
    
    set({ isOperating: true });
    const nextItem = state.queue.find(item => item.status === 'waiting');
    
    // 樂觀更新：先更新UI
    if (nextItem) {
      const updatedQueue = state.queue.map(item => {
        if (item.status === 'called') {
          return { ...item, status: 'waiting' as const };
        }
        if (item.id === nextItem.id) {
          return { ...item, status: 'called' as const };
        }
        return item;
      });
      set({ queue: updatedQueue });
    }

    try {
      await api.callNext();
      // 等待刷新完成
      await get().refreshQueue(true);
      set({ isOperating: false });
    } catch (error: any) {
      // 失敗時恢復原狀態
      await get().refreshQueue(true);
      set({ error: error.message || '叫號失敗', isOperating: false });
      throw error;
    }
  },

  // 指定號碼叫號（樂觀更新）
  callById: async (id: string) => {
    const state = get();
    if (state.isOperating) return;
    
    set({ isOperating: true });
    
    // 樂觀更新
    const updatedQueue = state.queue.map(item => {
      if (item.status === 'called' && item.id !== id) {
        return { ...item, status: 'waiting' as const };
      }
      if (item.id === id && (item.status === 'waiting' || item.status === 'called')) {
        return { ...item, status: 'called' as const };
      }
      return item;
    });
    set({ queue: updatedQueue });

    try {
      await api.callById(id);
      await get().refreshQueue(true);
      set({ isOperating: false });
    } catch (error: any) {
      await get().refreshQueue(true);
      set({ error: error.message || '叫號失敗', isOperating: false });
      throw error;
    }
  },

  // 過號（樂觀更新）
  skip: async (id: string) => {
    const state = get();
    if (state.isOperating) return;
    
    set({ isOperating: true });
    
    // 樂觀更新：標記為過號
    const updatedQueue = state.queue.map(item => {
      if (item.id === id && (item.status === 'waiting' || item.status === 'called')) {
        return { ...item, status: 'waiting' as const, flag_or_notified: `SKIPPED ${new Date().toISOString()}` };
      }
      return item;
    });
    set({ queue: updatedQueue });

    try {
      await api.skip(id);
      await get().refreshQueue(true);
      set({ isOperating: false });
    } catch (error: any) {
      await get().refreshQueue(true);
      set({ error: error.message || '過號失敗', isOperating: false });
      throw error;
    }
  },

  // 取消（樂觀更新）
  cancel: async (id: string) => {
    const state = get();
    if (state.isOperating) return;
    
    set({ isOperating: true });
    
    // 樂觀更新：從列表中移除
    const updatedQueue = state.queue.filter(item => item.id !== id);
    set({ queue: updatedQueue });

    try {
      await api.cancel(id);
      await get().refreshQueue(true);
      set({ isOperating: false });
    } catch (error: any) {
      await get().refreshQueue(true);
      set({ error: error.message || '取消失敗', isOperating: false });
      throw error;
    }
  },

  // 完成（樂觀更新）
  done: async (id: string) => {
    const state = get();
    if (state.isOperating) return;
    
    set({ isOperating: true });
    
    // 樂觀更新：標記為完成
    const updatedQueue = state.queue.map(item => {
      if (item.id === id) {
        return { ...item, status: 'done' as const };
      }
      return item;
    });
    set({ queue: updatedQueue });

    try {
      await api.done(id);
      await get().refreshQueue(true);
      set({ isOperating: false });
    } catch (error: any) {
      await get().refreshQueue(true);
      set({ error: error.message || '完成失敗', isOperating: false });
      throw error;
    }
  },

  // 新增候位（樂觀更新）
  addQueue: async (name: string, size: number, userId?: string) => {
    const state = get();
    if (state.isOperating) return;
    
    set({ isOperating: true });
    try {
      const result = await api.add(name, size, userId);
      
      // 等待刷新完成
      await get().refreshQueue(true);
      set({ isOperating: false });
    } catch (error: any) {
      await get().refreshQueue(true);
      set({ error: error.message || '新增失敗', isOperating: false });
      throw error;
    }
  },

  // 切換自動刷新
  toggleAutoRefresh: () => {
    const state = get();
    if (state.autoRefresh) {
      // 關閉自動刷新
      if (state.autoRefreshInterval) {
        clearInterval(state.autoRefreshInterval);
      }
      set({ autoRefresh: false, autoRefreshInterval: null });
    } else {
      // 開啟自動刷新（每60秒，從30秒增加到60秒以減少請求）
      const interval = setInterval(() => {
        get().refreshQueue();
      }, 60000);
      set({ autoRefresh: true, autoRefreshInterval: interval });
    }
  },

  // 設定自動刷新
  setAutoRefresh: (enabled: boolean) => {
    const state = get();
    if (state.autoRefreshInterval) {
      clearInterval(state.autoRefreshInterval);
    }
    if (enabled) {
      // 每60秒自動刷新
      const interval = setInterval(() => {
        get().refreshQueue();
      }, 60000);
      set({ autoRefresh: true, autoRefreshInterval: interval });
    } else {
      set({ autoRefresh: false, autoRefreshInterval: null });
    }
  },

  // 獲取上限設定
  getLimits: async () => {
    try {
      const data = await api.getLimits();
      set({ limits: data as any });
    } catch (error: any) {
      set({ error: error.message || '獲取上限失敗' });
    }
  },

  // 設定今日上限
  setTodayLimit: async (weekday: number, people: number) => {
    try {
      await api.setTodayLimit(weekday, people);
      await get().getLimits();
    } catch (error: any) {
      set({ error: error.message || '設定上限失敗' });
      throw error;
    }
  },

  // 設定每週上限
  setLimits: async (json: string) => {
    try {
      await api.setLimits(json);
      await get().getLimits();
    } catch (error: any) {
      set({ error: error.message || '設定上限失敗' });
      throw error;
    }
  },
}));

