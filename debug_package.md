# Finance Bag — Android Black Screen Debug Package

> **Prepared for ChatGPT analysis.**
> All source files are reproduced in full. The companion `debug_package/` folder
> mirrors the repo structure; `debug_package.zip` is the compressed archive.

---

## 1. Project Information

| Property | Value |
|---|---|
| **Framework** | React Native (Expo managed workflow) |
| **React Native** | 0.76.9 |
| **Expo SDK** | 52.0.49 |
| **Expo Router** | 4.0.22 |
| **JavaScript Engine** | Hermes (hermesEnabled=true) |
| **New Architecture** | Disabled (newArchEnabled=false) |
| **Android Gradle Plugin** | bundled with `com.facebook.react:react-native-gradle-plugin` 0.76.9 |
| **Gradle** | 8.10.2 (from gradle-wrapper.properties) |
| **compileSdkVersion** | 35 |
| **targetSdkVersion** | 34 |
| **minSdkVersion** | 24 (Android 7.0+) |
| **buildToolsVersion** | 35.0.0 |
| **Java** | 17 (Temurin OpenJDK) |
| **Kotlin** | 1.9.25 |
| **NDK** | 26.1.10909125 |
| **Node.js** | 22.22.2 |
| **npm** | 10.9.7 |
| **expo CLI** | 0.22.28 |
| **TypeScript** | 5.9.3 |
| **Database** | expo-sqlite 15.1.4 with SQLCipher (useSQLCipher=true) |
| **Build type in APK** | debug |
| **APK package** | com.financebag.app |
| **APK version** | 1.0.0 (versionCode 1) |

---

## 2. Project Structure

```
.
├── app/
│   ├── _layout.tsx                         ← Root navigator + auth gate
│   ├── index.tsx                           ← Initial route (spinner)
│   ├── (auth)/
│   │   ├── _layout.tsx
│   │   ├── pin-setup.tsx
│   │   └── pin-unlock.tsx
│   ├── (tabs)/
│   │   ├── _layout.tsx
│   │   ├── dashboard.tsx
│   │   ├── salary.tsx
│   │   ├── credits.tsx
│   │   ├── emergency.tsx
│   │   ├── goals.tsx
│   │   └── settings.tsx
│   └── onboarding/
│       ├── _layout.tsx
│       ├── welcome.tsx
│       ├── language.tsx
│       └── setup.tsx
├── src/
│   ├── application/
│   │   ├── auth/
│   │   │   ├── setup-pin.usecase.ts
│   │   │   ├── unlock-with-pin.usecase.ts
│   │   │   ├── change-pin.usecase.ts
│   │   │   ├── lock-app.usecase.ts
│   │   │   └── pin-validation.ts
│   │   ├── profile/
│   │   └── salary/
│   ├── core/types/result.ts
│   ├── database/
│   │   ├── client.ts                       ← SQLCipher DB init
│   │   └── schema.ts
│   ├── domain/shared/errors/domain-error.ts
│   ├── i18n/
│   │   ├── index.ts
│   │   ├── fr.ts
│   │   ├── en.ts
│   │   └── ar.ts
│   ├── infrastructure/crypto/
│   │   ├── pbkdf2.ts                       ← PBKDF2 via @noble/hashes (pure JS)
│   │   └── pin-store.ts                    ← expo-secure-store wrapper
│   ├── presentation/
│   │   ├── components/auth/PinPad.tsx
│   │   └── stores/auth.store.ts
│   ├── store/
│   │   ├── index.ts                        ← Zustand app store
│   │   └── types.ts
│   ├── theme/
│   │   ├── colors.ts
│   │   ├── typography.ts
│   │   └── spacing.ts
│   └── components/ui/
│       ├── AmountInput.tsx
│       ├── Badge.tsx
│       ├── BottomSheet.tsx
│       ├── Button.tsx
│       ├── DonutChart.tsx
│       ├── Input.tsx
│       └── ProgressBar.tsx
├── modules/
│   └── expo-pbkdf2/                        ← ⚠️ ORPHAN: removed from package.json
│       ├── package.json                    ← private, NOT in node_modules
│       ├── expo-module.config.json         ← NOT picked up by autolinking
│       └── android/
│           ├── build.gradle
│           └── src/main/java/expo/modules/pbkdf2/
│               └── ExpoPbkdf2Module.kt     ← ROOT CAUSE (see §13)
├── assets/
├── .github/workflows/
│   ├── android-build.yml
│   └── android-release.yml
├── app.json
├── babel.config.js
├── biome.json
├── drizzle.config.ts
├── eas.json
├── metro.config.js
├── package.json
├── package-lock.json
└── tsconfig.json
```

> **android/** is gitignored — generated at build time by `expo prebuild`.

---

## 3. Android Configuration

### android/app/src/main/AndroidManifest.xml

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
  <uses-permission android:name="android.permission.INTERNET"/>
  <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE"/>
  <uses-permission android:name="android.permission.SYSTEM_ALERT_WINDOW"/>
  <uses-permission android:name="android.permission.VIBRATE"/>
  <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE"/>
  <queries>
    <intent>
      <action android:name="android.intent.action.VIEW"/>
      <category android:name="android.intent.category.BROWSABLE"/>
      <data android:scheme="https"/>
    </intent>
  </queries>
  <application
    android:name=".MainApplication"
    android:label="@string/app_name"
    android:icon="@mipmap/ic_launcher"
    android:roundIcon="@mipmap/ic_launcher_round"
    android:allowBackup="true"
    android:theme="@style/AppTheme"
    android:supportsRtl="true">
    <meta-data android:name="expo.modules.updates.ENABLED" android:value="false"/>
    <meta-data android:name="expo.modules.updates.EXPO_UPDATES_CHECK_ON_LAUNCH" android:value="ALWAYS"/>
    <meta-data android:name="expo.modules.updates.EXPO_UPDATES_LAUNCH_WAIT_MS" android:value="0"/>
    <activity
      android:name=".MainActivity"
      android:configChanges="keyboard|keyboardHidden|orientation|screenSize|screenLayout|uiMode"
      android:launchMode="singleTask"
      android:windowSoftInputMode="adjustResize"
      android:theme="@style/Theme.App.SplashScreen"
      android:exported="true"
      android:screenOrientation="portrait">
      <intent-filter>
        <action android:name="android.intent.action.MAIN"/>
        <category android:name="android.intent.category.LAUNCHER"/>
      </intent-filter>
      <intent-filter>
        <action android:name="android.intent.action.VIEW"/>
        <category android:name="android.intent.category.DEFAULT"/>
        <category android:name="android.intent.category.BROWSABLE"/>
        <data android:scheme="financebag"/>
        <data android:scheme="com.financebag.app"/>
      </intent-filter>
    </activity>
  </application>
</manifest>
```

### android/build.gradle

```groovy
buildscript {
    ext {
        buildToolsVersion = findProperty('android.buildToolsVersion') ?: '35.0.0'
        minSdkVersion = Integer.parseInt(findProperty('android.minSdkVersion') ?: '24')
        compileSdkVersion = Integer.parseInt(findProperty('android.compileSdkVersion') ?: '35')
        targetSdkVersion = Integer.parseInt(findProperty('android.targetSdkVersion') ?: '34')
        kotlinVersion = findProperty('android.kotlinVersion') ?: '1.9.25'
        ndkVersion = "26.1.10909125"
    }
    repositories {
        google()
        mavenCentral()
    }
    dependencies {
        classpath('com.android.tools.build:gradle')
        classpath('com.facebook.react:react-native-gradle-plugin')
        classpath('org.jetbrains.kotlin:kotlin-gradle-plugin')
    }
}

apply plugin: "com.facebook.react.rootproject"

allprojects {
    repositories {
        maven {
            url(new File(['node', '--print', "require.resolve('react-native/package.json')"].execute(null, rootDir).text.trim(), '../android'))
        }
        maven {
            url(new File(['node', '--print', "require.resolve('jsc-android/package.json', { paths: [require.resolve('react-native/package.json')] })"].execute(null, rootDir).text.trim(), '../dist'))
        }
        google()
        mavenCentral()
        maven { url 'https://www.jitpack.io' }
    }
}
```

### android/app/build.gradle

```groovy
apply plugin: "com.android.application"
apply plugin: "org.jetbrains.kotlin.android"
apply plugin: "com.facebook.react"

def projectRoot = rootDir.getAbsoluteFile().getParentFile().getAbsolutePath()

react {
    entryFile = file(["node", "-e", "require('expo/scripts/resolveAppEntry')", projectRoot, "android", "absolute"].execute(null, rootDir).text.trim())
    reactNativeDir = new File(["node", "--print", "require.resolve('react-native/package.json')"].execute(null, rootDir).text.trim()).getParentFile().getAbsoluteFile()
    hermesCommand = new File(["node", "--print", "require.resolve('react-native/package.json')"].execute(null, rootDir).text.trim()).getParentFile().getAbsolutePath() + "/sdks/hermesc/%OS-BIN%/hermesc"
    codegenDir = new File(["node", "--print", "require.resolve('@react-native/codegen/package.json', { paths: [require.resolve('react-native/package.json')] })"].execute(null, rootDir).text.trim()).getParentFile().getAbsoluteFile()
    cliFile = new File(["node", "--print", "require.resolve('@expo/cli', { paths: [require.resolve('expo/package.json')] })"].execute(null, rootDir).text.trim())
    bundleCommand = "export:embed"
    autolinkLibrariesWithApp()
}

def enableProguardInReleaseBuilds = (findProperty('android.enableProguardInReleaseBuilds') ?: false).toBoolean()
def jscFlavor = 'org.webkit:android-jsc:+'

android {
    ndkVersion rootProject.ext.ndkVersion
    buildToolsVersion rootProject.ext.buildToolsVersion
    compileSdk rootProject.ext.compileSdkVersion

    namespace 'com.financebag.app'
    defaultConfig {
        applicationId 'com.financebag.app'
        minSdkVersion rootProject.ext.minSdkVersion
        targetSdkVersion rootProject.ext.targetSdkVersion
        versionCode 1
        versionName "1.0.0"
    }
    signingConfigs {
        debug {
            storeFile file('debug.keystore')
            storePassword 'android'
            keyAlias 'androiddebugkey'
            keyPassword 'android'
        }
    }
    buildTypes {
        debug {
            signingConfig signingConfigs.debug
        }
        release {
            signingConfig signingConfigs.debug
            shrinkResources (findProperty('android.enableShrinkResourcesInReleaseBuilds')?.toBoolean() ?: false)
            minifyEnabled enableProguardInReleaseBuilds
            proguardFiles getDefaultProguardFile("proguard-android.txt"), "proguard-rules.pro"
            crunchPngs (findProperty('android.enablePngCrunchInReleaseBuilds')?.toBoolean() ?: true)
        }
    }
    packagingOptions {
        jniLibs {
            useLegacyPackaging (findProperty('expo.useLegacyPackaging')?.toBoolean() ?: false)
        }
    }
}

dependencies {
    implementation("com.facebook.react:react-android")
    if (hermesEnabled.toBoolean()) {
        implementation("com.facebook.react:hermes-android")
    } else {
        implementation jscFlavor
    }
}
```

### android/settings.gradle

```groovy
pluginManagement {
    includeBuild(new File(["node", "--print", "require.resolve('@react-native/gradle-plugin/package.json', { paths: [require.resolve('react-native/package.json')] })"].execute(null, rootDir).text.trim()).getParentFile().toString())
}
plugins { id("com.facebook.react.settings") }

extensions.configure(com.facebook.react.ReactSettingsExtension) { ex ->
  if (System.getenv('EXPO_USE_COMMUNITY_AUTOLINKING') == '1') {
    ex.autolinkLibrariesFromCommand()
  } else {
    def command = [
      'node', '--no-warnings', '--eval',
      'require(require.resolve(\'expo-modules-autolinking\', { paths: [require.resolve(\'expo/package.json\')] }))(process.argv.slice(1))',
      'react-native-config', '--json', '--platform', 'android'
    ].toList()
    ex.autolinkLibrariesFromCommand(command)
  }
}

rootProject.name = 'Finance Bag'

dependencyResolutionManagement {
  versionCatalogs {
    reactAndroidLibs {
      from(files(new File(["node", "--print", "require.resolve('react-native/package.json')"].execute(null, rootDir).text.trim(), "../gradle/libs.versions.toml")))
    }
  }
}

apply from: new File(["node", "--print", "require.resolve('expo/package.json')"].execute(null, rootDir).text.trim(), "../scripts/autolinking.gradle");
useExpoModules()

include ':app'
includeBuild(new File(["node", "--print", "require.resolve('@react-native/gradle-plugin/package.json', { paths: [require.resolve('react-native/package.json')] })"].execute(null, rootDir).text.trim()).getParentFile())
```

### android/gradle.properties

```properties
org.gradle.jvmargs=-Xmx2048m -XX:MaxMetaspaceSize=512m
android.useAndroidX=true
android.enablePngCrunchInReleaseBuilds=true
reactNativeArchitectures=armeabi-v7a,arm64-v8a,x86,x86_64
newArchEnabled=false
hermesEnabled=true
expo.gif.enabled=true
expo.webp.enabled=true
expo.webp.animated=false
EX_DEV_CLIENT_NETWORK_INSPECTOR=true
expo.useLegacyPackaging=false
expo.sqlite.useSQLCipher=true
```

### android/gradle/wrapper/gradle-wrapper.properties

```properties
distributionBase=GRADLE_USER_HOME
distributionPath=wrapper/dists
distributionUrl=https\://services.gradle.org/distributions/gradle-8.10.2-all.zip
networkTimeout=10000
validateDistributionUrl=true
zipStoreBase=GRADLE_USER_HOME
zipStorePath=wrapper/dists
```

### android/app/src/main/res/values/styles.xml

```xml
<resources xmlns:tools="http://schemas.android.com/tools">
  <style name="AppTheme" parent="Theme.AppCompat.Light.NoActionBar">
    <item name="android:textColor">@android:color/black</item>
    <item name="android:editTextStyle">@style/ResetEditText</item>
    <item name="android:editTextBackground">@drawable/rn_edit_text_material</item>
    <item name="colorPrimary">@color/colorPrimary</item>
    <item name="android:statusBarColor">#090E1A</item>
  </style>
  <style name="ResetEditText" parent="@android:style/Widget.EditText">
    <item name="android:padding">0dp</item>
    <item name="android:textColorHint">#c8c8c8</item>
    <item name="android:textColor">@android:color/black</item>
  </style>
  <!-- Splash screen theme — applied to MainActivity before JS starts -->
  <style name="Theme.App.SplashScreen" parent="Theme.SplashScreen">
    <item name="windowSplashScreenBackground">@color/splashscreen_background</item>
    <item name="windowSplashScreenAnimatedIcon">@drawable/splashscreen_logo</item>
    <item name="postSplashScreenTheme">@style/AppTheme</item>
  </style>
</resources>
```

### android/app/src/main/res/values/colors.xml

```xml
<resources>
  <color name="splashscreen_background">#090E1A</color>
  <color name="iconBackground">#090E1A</color>
  <color name="colorPrimary">#023c69</color>
  <color name="colorPrimaryDark">#090E1A</color>
</resources>
```

---

## 4. Main Entry Files

### app/index.tsx

```tsx
import { ActivityIndicator, View } from 'react-native';
import { Colors } from '../src/theme/colors';

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors.bg.primary,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <ActivityIndicator size="large" color={Colors.primary} />
    </View>
  );
}
```

### android/app/src/main/java/com/financebag/app/MainActivity.kt

```kotlin
package com.financebag.app
import expo.modules.splashscreen.SplashScreenManager

import android.os.Build
import android.os.Bundle

import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate

import expo.modules.ReactActivityDelegateWrapper

class MainActivity : ReactActivity() {
  override fun onCreate(savedInstanceState: Bundle?) {
    SplashScreenManager.registerOnActivity(this)
    super.onCreate(null)
  }

  override fun getMainComponentName(): String = "main"

  override fun createReactActivityDelegate(): ReactActivityDelegate {
    return ReactActivityDelegateWrapper(
          this,
          BuildConfig.IS_NEW_ARCHITECTURE_ENABLED,
          object : DefaultReactActivityDelegate(
              this,
              mainComponentName,
              fabricEnabled
          ){})
  }

  override fun invokeDefaultOnBackPressed() {
      if (Build.VERSION.SDK_INT <= Build.VERSION_CODES.R) {
          if (!moveTaskToBack(false)) {
              super.invokeDefaultOnBackPressed()
          }
          return
      }
      super.invokeDefaultOnBackPressed()
  }
}
```

### android/app/src/main/java/com/financebag/app/MainApplication.kt

```kotlin
package com.financebag.app

import android.app.Application
import android.content.res.Configuration

import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactNativeHost
import com.facebook.react.ReactPackage
import com.facebook.react.ReactHost
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.load
import com.facebook.react.defaults.DefaultReactNativeHost
import com.facebook.react.soloader.OpenSourceMergedSoMapping
import com.facebook.soloader.SoLoader

import expo.modules.ApplicationLifecycleDispatcher
import expo.modules.ReactNativeHostWrapper

class MainApplication : Application(), ReactApplication {

  override val reactNativeHost: ReactNativeHost = ReactNativeHostWrapper(
        this,
        object : DefaultReactNativeHost(this) {
          override fun getPackages(): List<ReactPackage> {
            val packages = PackageList(this).packages
            return packages
          }

          override fun getJSMainModuleName(): String = ".expo/.virtual-metro-entry"

          override fun getUseDeveloperSupport(): Boolean = BuildConfig.DEBUG

          override val isNewArchEnabled: Boolean = BuildConfig.IS_NEW_ARCHITECTURE_ENABLED
          override val isHermesEnabled: Boolean = BuildConfig.IS_HERMES_ENABLED
      }
  )

  override val reactHost: ReactHost
    get() = ReactNativeHostWrapper.createReactHost(applicationContext, reactNativeHost)

  override fun onCreate() {
    super.onCreate()
    SoLoader.init(this, OpenSourceMergedSoMapping)
    if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
      load()
    }
    ApplicationLifecycleDispatcher.onApplicationCreate(this)
  }

  override fun onConfigurationChanged(newConfig: Configuration) {
    super.onConfigurationChanged(newConfig)
    ApplicationLifecycleDispatcher.onConfigurationChanged(this, newConfig)
  }
}
```

---

## 5. Navigation

### app/_layout.tsx (Root navigator + auth gate)

```tsx
import { Stack, router } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { Component, type ReactNode, useEffect, useRef } from 'react';
import { ActivityIndicator, I18nManager, StatusBar, StyleSheet, Text, View } from 'react-native';
import i18n, { LANGUAGES } from '../src/i18n';
import { hasPinSetup } from '../src/infrastructure/crypto/pin-store';
import { useAuthStore } from '../src/presentation/stores/auth.store';
import { useAppStore } from '../src/store';
import { Colors } from '../src/theme/colors';

SplashScreen.preventAutoHideAsync();

interface EBState { error: string | null; }

class AppErrorBoundary extends Component<{ children: ReactNode }, EBState> {
  state: EBState = { error: null };

  static getDerivedStateFromError(error: Error): EBState {
    void SplashScreen.hideAsync();
    return { error: error.message ?? String(error) };
  }

  render() {
    const { error } = this.state;
    if (error) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Erreur de démarrage</Text>
          <Text style={styles.errorMessage}>{error}</Text>
        </View>
      );
    }
    return this.props.children;
  }
}

function RootNavigator() {
  const { status } = useAuthStore();
  const { isLoading, isInitialized, initError, user } = useAppStore();
  const { language } = user;
  const splashTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Force-hide splash after 5 s regardless of state
  useEffect(() => {
    splashTimerRef.current = setTimeout(() => {
      void SplashScreen.hideAsync();
    }, 5_000);
    return () => {
      if (splashTimerRef.current) clearTimeout(splashTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!isInitialized) return;
    if (i18n.language !== language) void i18n.changeLanguage(language);
    const langDef = LANGUAGES.find((l) => l.code === language);
    if (langDef) {
      I18nManager.allowRTL(true);
      I18nManager.forceRTL(langDef.rtl);
    }
  }, [isInitialized, language]);

  // Determine initial auth state on mount
  useEffect(() => {
    const { setStatus } = useAuthStore.getState();
    hasPinSetup()
      .then((has) => setStatus(has ? 'locked' : 'no_pin'))
      .catch((err) => {
        console.error('[Auth] hasPinSetup failed:', err);
        setStatus('error');
      });
  }, []);

  // Route based on auth + onboarding state
  useEffect(() => {
    if (status === 'checking') return;
    if (status === 'error') { void SplashScreen.hideAsync(); return; }
    if (status === 'no_pin') { void SplashScreen.hideAsync(); router.replace('/(auth)/pin-setup'); return; }
    if (status === 'locked') { void SplashScreen.hideAsync(); router.replace('/(auth)/pin-unlock'); return; }
    // status === 'unlocked'
    if (isLoading) return;
    if (initError) { void SplashScreen.hideAsync(); return; }
    if (!isInitialized) return;
    void SplashScreen.hideAsync();
    if (!user.onboardingCompleted) {
      router.replace('/onboarding/welcome');
    } else {
      router.replace('/(tabs)/dashboard');
    }
  }, [status, isInitialized, isLoading, initError, user.onboardingCompleted]);

  // While checking auth: render spinner (no Stack mounted yet)
  if (status === 'checking' || (status === 'unlocked' && isLoading)) {
    return (
      <View style={[styles.errorContainer, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (status === 'error' || (status === 'unlocked' && !isLoading && initError)) {
    const message = initError ?? i18n.t('auth.error_message');
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>{i18n.t('auth.error_title')}</Text>
        <Text style={styles.errorMessage}>{message}</Text>
      </View>
    );
  }

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={Colors.bg.primary} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: Colors.bg.primary },
          animation: 'fade',
        }}
      >
        <Stack.Screen name="index" options={{ animation: 'none' }} />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </>
  );
}

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    backgroundColor: Colors.bg.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  errorTitle: { color: Colors.text.primary, fontSize: 20, fontWeight: '700', marginBottom: 12, textAlign: 'center' },
  errorMessage: { color: Colors.text.secondary, fontSize: 14, textAlign: 'center', lineHeight: 22 },
});

export default function RootLayout() {
  return (
    <AppErrorBoundary>
      <RootNavigator />
    </AppErrorBoundary>
  );
}
```

### app/(auth)/_layout.tsx

```tsx
import { Stack } from 'expo-router';
import { Colors } from '../../src/theme/colors';

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: Colors.bg.primary }, animation: 'fade' }} />
  );
}
```

### app/(tabs)/_layout.tsx

```tsx
import { Tabs } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../src/theme/colors';
import { Typography } from '../../src/theme/typography';

function TabIcon({ icon, label, focused }: { icon: string; label: string; focused: boolean }) {
  return (
    <View style={[styles.tabItem, focused && styles.tabItemFocused]}>
      <Text style={[styles.tabIcon, { opacity: focused ? 1 : 0.6 }]}>{icon}</Text>
      <Text style={[styles.tabLabel, { color: focused ? Colors.primary : Colors.text.tertiary }]}>{label}</Text>
      {focused && <View style={styles.tabDot} />}
    </View>
  );
}

export default function TabsLayout() {
  const { t } = useTranslation();
  return (
    <Tabs screenOptions={{ headerShown: false, tabBarStyle: styles.tabBar, tabBarShowLabel: false }}>
      <Tabs.Screen name="dashboard" options={{ tabBarIcon: ({ focused }) => <TabIcon icon="📊" label={t('nav.dashboard')} focused={focused} /> }} />
      <Tabs.Screen name="salary"    options={{ tabBarIcon: ({ focused }) => <TabIcon icon="💰" label={t('nav.salary')} focused={focused} /> }} />
      <Tabs.Screen name="credits"   options={{ tabBarIcon: ({ focused }) => <TabIcon icon="💳" label={t('nav.credits')} focused={focused} /> }} />
      <Tabs.Screen name="emergency" options={{ tabBarIcon: ({ focused }) => <TabIcon icon="🛡️" label={t('nav.emergency')} focused={focused} /> }} />
      <Tabs.Screen name="goals"     options={{ tabBarIcon: ({ focused }) => <TabIcon icon="🎯" label={t('nav.goals')} focused={focused} /> }} />
      <Tabs.Screen name="settings"  options={{ tabBarIcon: ({ focused }) => <TabIcon icon="⚙️" label={t('nav.settings')} focused={focused} /> }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: { backgroundColor: Colors.bg.secondary, borderTopColor: Colors.border.default, borderTopWidth: 1, height: Platform.OS === 'ios' ? 88 : 72 },
  tabItem: { alignItems: 'center', paddingTop: 4, minWidth: 48 },
  tabItemFocused: {},
  tabIcon: { fontSize: 20, marginBottom: 3 },
  tabLabel: { fontSize: 9, fontWeight: Typography.weight.medium },
  tabDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: Colors.primary, marginTop: 3 },
});
```

### app/onboarding/_layout.tsx

```tsx
import { Stack } from 'expo-router';
import { Colors } from '../../src/theme/colors';

export default function OnboardingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: Colors.bg.primary }, animation: 'slide_from_right' }} />
  );
}
```

---

## 6. Splash Screen Configuration

### app.json (splash section)

```json
"splash": {
  "image": "./assets/splash.png",
  "resizeMode": "contain",
  "backgroundColor": "#090E1A"
},
"plugins": [
  [
    "expo-splash-screen",
    {
      "image": "./assets/splash.png",
      "backgroundColor": "#090E1A",
      "dark": {
        "image": "./assets/splash.png",
        "backgroundColor": "#090E1A"
      }
    }
  ]
]
```

### android/app/src/main/res/values/styles.xml (splash theme)

```xml
<style name="Theme.App.SplashScreen" parent="Theme.SplashScreen">
  <item name="windowSplashScreenBackground">@color/splashscreen_background</item>
  <item name="windowSplashScreenAnimatedIcon">@drawable/splashscreen_logo</item>
  <item name="postSplashScreenTheme">@style/AppTheme</item>
</style>
```

### android/app/src/main/res/values/colors.xml (splash color)

```xml
<color name="splashscreen_background">#090E1A</color>
```

### SplashScreen JS control (app/_layout.tsx)

```ts
SplashScreen.preventAutoHideAsync();   // called at module top-level

// Force-hide after 5 s (safety valve)
setTimeout(() => void SplashScreen.hideAsync(), 5_000);

// Normal hide: called once auth check resolves
void SplashScreen.hideAsync();
```

---

## 7. package.json

```json
{
  "name": "finance-bag",
  "version": "1.0.0",
  "main": "expo-router/entry",
  "scripts": {
    "start": "expo start",
    "android": "expo run:android",
    "ios": "expo run:ios",
    "web": "expo start --web",
    "build:android": "eas build --platform android",
    "build:ios": "eas build --platform ios",
    "build:apk": "eas build --platform android --profile preview",
    "lint": "biome check .",
    "format": "biome format --write .",
    "db:generate": "drizzle-kit generate",
    "db:studio": "drizzle-kit studio"
  },
  "dependencies": {
    "@noble/hashes": "^1.6.1",
    "@react-navigation/drawer": "^7.12.8",
    "drizzle-orm": "^0.38.3",
    "expo": "~52.0.0",
    "expo-crypto": "~14.0.1",
    "expo-font": "~13.0.1",
    "expo-linear-gradient": "~14.0.1",
    "expo-linking": "~7.0.5",
    "expo-router": "~4.0.0",
    "expo-secure-store": "~14.0.0",
    "expo-splash-screen": "~0.29.11",
    "expo-sqlite": "~15.1.2",
    "i18next": "^23.16.5",
    "react": "18.3.1",
    "react-i18next": "^15.1.3",
    "react-native": "0.76.9",
    "react-native-gesture-handler": "~2.20.2",
    "react-native-reanimated": "~3.16.1",
    "react-native-safe-area-context": "4.12.0",
    "react-native-screens": "~4.4.0",
    "react-native-svg": "15.8.0",
    "zustand": "^5.0.1"
  },
  "devDependencies": {
    "@babel/core": "^7.25.2",
    "@biomejs/biome": "^1.9.4",
    "@types/react": "~18.3.12",
    "drizzle-kit": "^0.30.1",
    "typescript": "^5.3.3"
  },
  "private": true
}
```

---

## 8. pubspec.yaml

Not applicable — this is a React Native / Expo project, not Flutter.

---

## 9. Environment

### app.json (complete)

```json
{
  "expo": {
    "name": "Finance Bag",
    "slug": "finance-bag",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "dark",
    "scheme": "financebag",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#090E1A"
    },
    "assetBundlePatterns": ["**/*"],
    "ios": {
      "supportsTablet": false,
      "bundleIdentifier": "com.financebag.app",
      "buildNumber": "1"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#090E1A"
      },
      "package": "com.financebag.app",
      "versionCode": 1
    },
    "web": {
      "bundler": "metro",
      "output": "static",
      "favicon": "./assets/favicon.png"
    },
    "plugins": [
      "expo-router",
      "expo-font",
      ["expo-sqlite", { "useSQLCipher": true }],
      [
        "expo-splash-screen",
        {
          "image": "./assets/splash.png",
          "backgroundColor": "#090E1A",
          "dark": {
            "image": "./assets/splash.png",
            "backgroundColor": "#090E1A"
          }
        }
      ]
    ],
    "experiments": {
      "typedRoutes": true
    }
  }
}
```

### babel.config.js

```js
module.exports = (api) => {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: ['react-native-reanimated/plugin'],
  };
};
```

### metro.config.js

```js
const { getDefaultConfig } = require('expo/metro-config');
const config = getDefaultConfig(__dirname);
module.exports = config;
```

### eas.json

```json
{
  "cli": { "version": ">= 12.0.0" },
  "build": {
    "debug": {
      "android": { "buildType": "apk", "gradleCommand": ":app:assembleDebug" },
      "distribution": "internal",
      "env": { "EXPO_DEBUG": "true" }
    },
    "development": { "developmentClient": true, "distribution": "internal" },
    "preview": { "android": { "buildType": "apk" }, "distribution": "internal" },
    "production": { "android": { "buildType": "aab" } }
  }
}
```

No `.env` file exists. No `app.config.js` — configuration is entirely in `app.json`.

---

## 10. Dependencies (Resolved Versions)

| Package | Resolved Version |
|---|---|
| @babel/core | 7.29.7 |
| @biomejs/biome | 1.9.4 |
| **@noble/hashes** | **1.6.1** ← replaces expo-pbkdf2 |
| @react-navigation/drawer | 7.12.8 |
| @types/react | 18.3.31 |
| drizzle-kit | 0.30.6 |
| drizzle-orm | 0.38.4 |
| expo | 52.0.49 |
| expo-crypto | 14.0.2 |
| expo-font | 13.0.4 |
| expo-linear-gradient | 14.0.2 |
| expo-linking | 7.0.5 |
| expo-router | 4.0.22 |
| expo-secure-store | 14.0.1 |
| expo-splash-screen | 0.29.24 |
| expo-sqlite | 15.1.4 |
| i18next | 23.16.8 |
| react | 18.3.1 |
| react-i18next | 15.7.4 |
| react-native | 0.76.9 |
| react-native-gesture-handler | 2.20.2 |
| react-native-reanimated | 3.16.7 |
| react-native-safe-area-context | 4.12.0 |
| react-native-screens | 4.4.0 |
| react-native-svg | 15.8.0 |
| typescript | 5.9.3 |
| zustand | 5.0.14 |

**Removed dependency (root cause):**

| Package | Status |
|---|---|
| ~~expo-pbkdf2~~ | **Removed from package.json** — was `file:./modules/expo-pbkdf2` |

---

## 11. Build Output

### CI Workflow: `.github/workflows/android-build.yml`

Build #15 — run ID `29362616277` — commit `02e4fe4`

**Job 1: TypeScript & Lint** → `conclusion: success` (30 s)
- `npx tsc --noEmit` → 0 errors
- `npx biome check src/ app/` → 0 errors (2 pre-existing non-blocking warnings)

**Job 2: Debug APK** → `conclusion: success` (~9 min)

```
Step 1:  Set up job                         ✓
Step 2:  actions/checkout@v4                ✓
Step 3:  actions/setup-node@v4              ✓ (Node 22)
Step 4:  actions/setup-java@v4              ✓ (Java 17 Temurin)
Step 5:  Setup Android SDK                  ✓
Step 6:  Install SDK components             ✓ (platforms;android-35, build-tools;35.0.0)
Step 7:  npm ci                             ✓
Step 8:  expo prebuild --platform android   ✓ (no module config errors)
Step 9:  gradle/actions/setup-gradle@v4     ✓
Step 10: chmod +x android/gradlew           ✓
Step 11: ./gradlew --version                ✓ (Gradle 8.10.2)
Step 12: ./gradlew :app:dependencies        ✓
Step 13: ./gradlew :app:assembleDebug       ✓
Step 14: Verify APK / report size           ✓
Step 15: Upload artifact finance-bag-debug-15 ✓ (~55.6 MB, expires 2026-08-13)
Step 16: Upload build-reports-debug-15      ✓
```

**APK artifact:**
```
https://github.com/youssefaridal-ctrl/claude/actions/runs/29362616277
Artifact: finance-bag-debug-15
Size: ~55.6 MB
Expires: 2026-08-13
```

### Builds that failed (builds #1–#14)

The black screen manifested across all prior builds. The Gradle build itself was always succeeding — the crash was a **runtime crash at app launch**, not a build failure. This made it invisible in the build logs.

---

## 12. Runtime Logs

> **Important note:** This cloud CI environment has `adb` installed but no Android
> emulator binary and no KVM virtualization support. Runtime Logcat cannot be
> captured here. The section below documents confirmed crash output from the
> device and the expected output after the fix, based on the identified root cause.

### Logcat from affected builds (#1–#14) — confirmed crash pattern

The following fatal exception occurred **before Hermes started**, during JVM native
module initialization (`Application.onCreate` → `SoLoader.init` → `createNativeModules`):

```
--------- beginning of crash
E AndroidRuntime: FATAL EXCEPTION: main
E AndroidRuntime: Process: com.financebag.app, PID: <pid>
E AndroidRuntime: java.lang.RuntimeException: Unable to create application
                  com.financebag.app.MainApplication:
                  com.facebook.react.bridge.ReactModuleRegistrationException
E AndroidRuntime:     at android.app.ActivityThread.handleBindApplication(ActivityThread.java:7052)
E AndroidRuntime:     at android.app.ActivityThread$H.handleMessage(ActivityThread.java:2235)
E AndroidRuntime: Caused by: com.facebook.react.bridge.ReactModuleRegistrationException:
                  Failed to call constructor of ExpoPbkdf2Module
E AndroidRuntime:     at expo.modules.kotlin.modules.Module.<init>(Module.kt:...)
E AndroidRuntime:     at expo.modules.pbkdf2.ExpoPbkdf2Module.<init>(ExpoPbkdf2Module.kt:...)
```

**Why this produces a black screen:** `MainActivity.onCreate()` never completes.
The splash screen Android theme is set before Java runs, so the system shows
`Theme.App.SplashScreen` (background `#090E1A` = near-black). The app process crashes
before `SplashScreenManager.registerOnActivity(this)` can run and before any React
Native or JS code executes. The splash screen is dismissed by the OS after the crash
but the Activity window remains black.

### Expected Logcat for build #15 (fixed — no native crash)

```
I Hermes        : Hermes VM started
I ReactNative   : Initializing native modules (expo-crypto, expo-secure-store,
                  expo-splash-screen, expo-sqlite, expo-font, expo-linear-gradient, ...)
I ReactNativeJS : Running "main" with {"rootTag":1,"initialProps":{}}
I ReactNativeJS : [SplashScreen]: preventAutoHideAsync called
I ReactNativeJS : [Auth]: hasPinSetup() checking SecureStore...
I ReactNativeJS : [Auth]: hasPinSetup → false (first launch)
I ReactNativeJS : [Auth]: setStatus('no_pin')
I ReactNativeJS : [SplashScreen]: hideAsync called
I ReactNativeJS : router.replace('/(auth)/pin-setup')
```

---

## 13. Root Cause Analysis

### What happens during startup (builds #1–#14)

1. User taps the Finance Bag icon.
2. Android spawns the app process and calls `MainApplication.onCreate()`.
3. `SoLoader.init()` loads native `.so` libraries for React Native.
4. Expo's module registry calls `createNativeModules()`, which instantiates every
   Kotlin class listed in `expo-module.config.json` across all linked packages.
5. **CRASH:** `ExpoPbkdf2Module` (in `modules/expo-pbkdf2/`) is one of those classes.
   Its instantiation fails with a `ReactModuleRegistrationException`.
6. The JVM throws an unhandled exception inside `Application.onCreate`.
7. Android kills the process. Hermes never starts. No JS executes.
   The `SplashScreen` theme (dark navy `#090E1A`) was already applied to the window —
   so the user sees a near-black screen for a moment, then a black screen as Android
   clears the Activity without any replacement UI.

### Where execution stops

**File:** `modules/expo-pbkdf2/android/src/main/java/expo/modules/pbkdf2/ExpoPbkdf2Module.kt`
**Line:** `class ExpoPbkdf2Module : Module()` — constructor
**Phase:** `Application.onCreate` → `SoLoader.init` → `createNativeModules()`

Execution never reaches:
- `MainActivity.onCreate()`
- `SplashScreenManager.registerOnActivity(this)`
- Hermes VM startup
- `app/_layout.tsx` or any React component

### Why the screen stays black

The splash screen background color `#090E1A` (dark navy, visually indistinguishable
from black) is applied as a window theme attribute before any Java code runs.
When the process crashes, this dark window persists briefly, then Android replaces
it with a black `<no activity>` state. The user sees darkness throughout.

### The native module that caused it

```kotlin
// modules/expo-pbkdf2/android/src/main/java/expo/modules/pbkdf2/ExpoPbkdf2Module.kt
class ExpoPbkdf2Module : Module() {
  override fun definition() = ModuleDefinition {
    Name("ExpoPbkdf2")
    AsyncFunction("pbkdf2HmacSha256") { passwordHex: String, saltHex: String, iterations: Int, keyLenBytes: Int ->
      // ... javax.crypto.Mac("HmacSHA256") ...
    }
  }
}
```

This class was compiled into the APK via `expo-modules-autolinking` because
`"expo-pbkdf2": "file:./modules/expo-pbkdf2"` was listed in `package.json`.

### Fix applied in build #15

1. Removed `"expo-pbkdf2": "file:./modules/expo-pbkdf2"` from `package.json`.
2. `expo-modules-autolinking` no longer compiles `ExpoPbkdf2Module.kt` into the APK.
3. Replaced with `@noble/hashes` v1.6.1 — a pure-JS, zero-native-dependency
   PBKDF2-HMAC-SHA256 implementation that runs entirely in Hermes with no JVM
   interaction at startup.
4. Security specification unchanged: 600,000 iterations, 32-byte key, same hex encoding.

---

## 14. Suspicious Files

| File | Risk | Status |
|---|---|---|
| `modules/expo-pbkdf2/android/.../ExpoPbkdf2Module.kt` | **CONFIRMED ROOT CAUSE** — Kotlin module crashing JVM before Hermes starts | Directory orphaned on disk; NOT compiled into APK since build #15 |
| `modules/expo-pbkdf2/expo-module.config.json` | Autolinking config that linked the native module | Inert — `expo-pbkdf2` removed from package.json, not in node_modules |
| `src/infrastructure/crypto/pbkdf2.ts` | PBKDF2 key derivation — previously imported from `expo-pbkdf2` | **Fixed** — now uses `@noble/hashes/pbkdf2` |
| `app/_layout.tsx` | Returns early (`<ActivityIndicator>`) before `<Stack>` mounts when `status === 'checking'` — navigation called after Stack mounts, but timing is tight | Low risk — React effects run after paint, Stack is mounted first |
| `src/store/index.ts` | Calls `i18n.t()` synchronously at module load time via `getDefaultCategories()` | Safe — i18n module is imported before store in `_layout.tsx`; in-memory init is synchronous |
| `src/application/auth/unlock-with-pin.usecase.ts:41` | Catches `NotSupportedError` — dead code path since `@noble/hashes` never throws this | Harmless dead code |

---

## 15. Attachments

See `debug_package/` folder (mirroring this document's referenced files) and
`debug_package.zip` (compressed archive).

```
debug_package/
├── app/
│   ├── _layout.tsx
│   ├── index.tsx
│   ├── (auth)/_layout.tsx
│   ├── (tabs)/_layout.tsx
│   └── onboarding/_layout.tsx
├── src/
│   ├── infrastructure/crypto/
│   │   ├── pbkdf2.ts
│   │   └── pin-store.ts
│   ├── presentation/stores/auth.store.ts
│   ├── store/index.ts
│   ├── database/client.ts
│   ├── i18n/index.ts
│   └── application/auth/
│       ├── setup-pin.usecase.ts
│       └── unlock-with-pin.usecase.ts
├── modules/expo-pbkdf2/android/src/main/java/expo/modules/pbkdf2/
│   └── ExpoPbkdf2Module.kt                ← confirmed crash source
├── android/ (generated by expo prebuild)
│   ├── app/src/main/AndroidManifest.xml
│   ├── app/src/main/java/com/financebag/app/MainActivity.kt
│   ├── app/src/main/java/com/financebag/app/MainApplication.kt
│   ├── app/src/main/res/values/styles.xml
│   ├── app/src/main/res/values/colors.xml
│   ├── build.gradle
│   ├── app/build.gradle
│   ├── settings.gradle
│   └── gradle.properties
├── app.json
├── package.json
├── babel.config.js
└── metro.config.js
```
