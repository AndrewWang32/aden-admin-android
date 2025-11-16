# Android APK 打包指南

## 方法一：使用 EAS Build（推荐，云端构建）

### 步骤 1: 安装和登录 EAS CLI

```bash
# 如果还没安装，运行：
npm install -g eas-cli

# 登录 Expo 账号（如果没有账号，先到 https://expo.dev 注册）
eas login
```

### 步骤 2: 配置 EAS Build

```bash
# 在项目根目录运行，会创建 eas.json 配置文件
eas build:configure
```

### 步骤 3: 构建 APK

```bash
# 构建 APK（用于测试和分发）
eas build --platform android --profile preview

# 或者构建 AAB（用于 Google Play 商店上架）
eas build --platform android --profile production
```

### 步骤 4: 下载 APK

构建完成后，EAS 会提供一个下载链接，或者运行：

```bash
# 查看构建状态
eas build:list

# 下载最新构建
eas build:download
```

---

## 方法二：本地构建（需要 Android Studio）

### 前置要求

1. 安装 Android Studio
2. 安装 Android SDK
3. 配置环境变量

### 步骤 1: 安装依赖

```bash
npm install
```

### 步骤 2: 生成原生项目

```bash
# 安装 Expo CLI（如果还没有）
npm install -g expo-cli

# 生成原生 Android 项目
npx expo prebuild --platform android
```

### 步骤 3: 使用 Android Studio 构建

1. 打开 Android Studio
2. 打开 `android` 文件夹
3. 选择 `Build` > `Build Bundle(s) / APK(s)` > `Build APK(s)`
4. APK 文件会在 `android/app/build/outputs/apk/` 目录下

---

## 当前配置

- **应用名称**: 阿等Aden
- **Package Name**: com.aden.admin
- **版本**: 1.0.0

## 注意事项

1. **首次构建**：EAS Build 首次构建可能需要 10-20 分钟
2. **免费额度**：Expo 提供有限的免费构建次数
3. **签名**：生产版本需要配置签名密钥
4. **图标尺寸**：确保 `aden-logo.png` 至少是 1024x1024 像素

## 快速开始（推荐）

```bash
# 1. 登录
eas login

# 2. 配置
eas build:configure

# 3. 构建 APK
eas build --platform android --profile preview
```

构建完成后，APK 文件可以下载并安装到 Android 设备上。

