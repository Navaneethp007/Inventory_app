# Inventory Management App

A React Native mobile application for managing inventory and tracking products efficiently.

## Project Structure

- **Components/**
  - `ProductCard.js`: Displays individual product information
  - `StatCard.js`: Shows statistical information on the dashboard

- **Contexts/**
  - `InventoryContext.js`: Manages global state for inventory data

- **Screens/**
  - `DashboardScreen.js`: Main screen showing inventory overview
  - `ProductsScreen.js`: Lists all products in inventory
  - `AddProductScreen.js`: Form for adding new products

## Features

- **Dashboard Overview**: Visual representation of inventory statistics
- **Product Management**: Add, view, and manage products
- **Real-time Updates**: Dynamic inventory tracking
- **Intuitive UI**: User-friendly interface with modern design
- **Data Persistence**: Local storage for offline access

## Project Architecture

```
├── App.js                 # Entry point of the application
├── app.json               # Expo configuration
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── ProductCard.js # Product display component
│   │   └── StatCard.js    # Statistics display component
│   ├── constants/
│   │   └── theme.js      # Theme configuration
│   ├── contexts/
│   │   └── InventoryContext.js # Global state management
│   ├── navigation/
│   │   └── AppNavigator.js     # Navigation configuration
│   └── screens/
│       ├── AddProductScreen.js  # Product creation screen
│       ├── DashboardScreen.js   # Main dashboard
│       └── ProductsScreen.js    # Products listing screen
```

## Tech Stack

- React Native
- Expo
- React Navigation
- AsyncStorage for local data persistence
- Context API for state management

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or higher)
- npm or pnpm
- Expo CLI
- iOS Simulator (for Mac) or Android Studio (for Android development)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Navaneethp007/Inventory_app.git
   cd Inventory
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

   or if using npm:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   pnpm start
   ```

   or
   ```bash
   npm start
   ```

## Usage

After starting the development server:

1. Press `a` - to run on Android emulator/device
2. Press `i` - to run on iOS simulator (Mac only)
3. Scan the QR code with Expo Go app on your physical device

## Building for Production

### Android Build

1. Generate a keystore file (only needed if building without Expo/EAS, using plain React Native):

   ```bash
   keytool -genkey -v -keystore inventory-release-key.keystore -alias inventory-key-alias -keyalg RSA -keysize 2048 -validity 10000
   ```

   Note: When using EAS build or Expo build services, the keystore is managed automatically by Expo's servers, so you can skip this step.

2. Create a production build:

   ```bash
   eas build -p android --profile production
   ```

   Or using Expo classic build:

   ```bash
   expo build:android -t apk    # For APK format
   expo build:android -t app-bundle    # For Android App Bundle (recommended for Play Store)
   ```

### iOS Build

1. Configure your Apple Developer account in app.json

2. Create a production build:

   ```bash
   eas build -p ios --profile production
   ```

   Or using Expo classic build:

   ```bash
   expo build:ios -t archive    # For App Store build
   expo build:ios -t simulator  # For iOS simulator build
   ```

### Additional Build Commands

- Generate development client:

  ```bash
  eas build --profile development
  ```

- View build status:

  ```bash
  eas build:list
  ```

Note: Make sure you have configured your app.json and eas.json files properly before building.
For iOS builds, you need a paid Apple Developer account and proper certificates configured.

