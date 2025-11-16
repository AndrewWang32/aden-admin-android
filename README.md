# 候位管理系統 - 手機版

這是基於 React Native 和 Expo 的手機應用程式，用於管理候位清單。它提供了直觀的移動端界面來執行各種候位管理操作。

## 功能特色

- 📱 **手機應用程式** - 原生移動端體驗
- 📋 **候位清單查看** - 即時查看所有候位狀態
- 📢 **叫號功能** - 一鍵叫下一組客人或指定號碼叫號
- ⏭️ **過號處理** - 快速處理過號情況
- ❌ **取消功能** - 取消指定號碼
- ✅ **完成標記** - 標記已完成的號碼
- ➕ **人工新增候位** - 支援現場客人候位登記
- 🔄 **自動刷新** - 可設定自動刷新清單（每30秒）
- 📊 **系統資訊** - 顯示候位統計和今日進度
- 🎯 **觸控優化** - 針對手機觸控操作優化

## 系統需求

- Node.js 16.0 或更高版本
- npm 或 yarn 套件管理器
- Expo Go 應用程式（用於測試）

## 快速開始

### 1. 安裝依賴

```bash
npm install
```

### 2. 啟動開發伺服器

```bash
npx expo start
```

或使用 tunnel 模式（用於遠端測試）：

```bash
npx expo start --host tunnel
```

### 3. 在手機上測試

1. 在手機上安裝 Expo Go 應用程式
2. 掃描終端機顯示的 QR Code
3. 應用程式將在手機上載入

## 使用說明

### 基本操作

1. **查看候位清單**
   - 點擊「刷新清單」按鈕
   - 或開啟自動刷新功能

2. **叫下一組**
   - 點擊「叫下一組」按鈕

3. **指定號碼操作**
   - 在「號碼操作」區域輸入號碼（如：A01）
   - 點擊對應的操作按鈕：
     - 📢 **叫號** - 叫指定號碼
     - ⏭️ **過號** - 標記為過號
     - ❌ **取消** - 取消該號碼
     - ✅ **完成** - 標記為已完成
   - 或點擊快速操作按鈕，在彈出視窗中輸入號碼

4. **人工新增候位**
   - 在「人工新增候位」區域填寫：
     - **姓名** - 客人姓名（必填）
     - **人數** - 用餐人數（必填，1-20人）
     - **LINE 使用者ID** - LINE 使用者ID（選填，用於推播通知）
   - 點擊「新增候位」按鈕

### 進階功能

1. **自動刷新**
   - 點擊右上角的「自動刷新」按鈕開啟/關閉
   - 預設每 30 秒自動刷新一次

2. **點擊候位項目**
   - 點擊候位清單中的任何項目可查看詳細資訊
   - 並可快速執行操作（叫號、過號、取消、完成）

## 專案結構

```
ramen_admin_54/
├── App.tsx                 # 主應用程式
├── components/             # React 組件
│   ├── QueueList.tsx      # 候位清單組件
│   ├── ActionButtons.tsx  # 操作按鈕組件
│   ├── NumberInput.tsx    # 號碼輸入組件
│   ├── AddQueueForm.tsx   # 新增候位表單
│   └── InfoPanel.tsx      # 系統資訊面板
├── services/               # API 服務
│   └── api.ts             # API 調用封裝
├── store/                 # 狀態管理
│   └── queueStore.ts      # Zustand 狀態管理
└── package.json           # 專案配置
```

## API 配置

應用程式的 API 端點和 Token 已在 `services/api.ts` 中配置：

```typescript
const CONFIG = {
  EXEC_URL: 'https://script.google.com/macros/s/.../exec',
  TOKEN: 'reman-admin-2025'
};
```

如需修改，請編輯 `services/api.ts` 文件中的 `CONFIG` 物件。

## 技術棧

- **React Native** - 跨平台移動應用框架
- **Expo** - React Native 開發工具鏈
- **TypeScript** - 類型安全的 JavaScript
- **Zustand** - 輕量級狀態管理
- **React Hooks** - 函數式組件和狀態管理

## 開發指南

### 自訂開發

1. **修改界面**
   - 編輯 `App.tsx` 和各組件文件
   - 修改 `StyleSheet` 來調整樣式

2. **新增功能**
   - 在 `services/api.ts` 中添加新的 API 方法
   - 在 `store/queueStore.ts` 中添加狀態和操作
   - 在組件中使用新的功能

3. **修改 API 調用**
   - 編輯 `services/api.ts` 中的 `apiCall` 函數和 API 方法

## 授權

MIT License

## 支援

如有問題或建議，請聯繫開發團隊。

