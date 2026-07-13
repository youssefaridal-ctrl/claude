import { Tabs } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../src/theme/colors';
import { Typography } from '../../src/theme/typography';

interface TabIconProps {
  icon: string;
  label: string;
  focused: boolean;
}

function TabIcon({ icon, label, focused }: TabIconProps) {
  return (
    <View style={[styles.tabItem, focused && styles.tabItemFocused]}>
      <Text style={[styles.tabIcon, { opacity: focused ? 1 : 0.6 }]}>{icon}</Text>
      <Text style={[styles.tabLabel, { color: focused ? Colors.primary : Colors.text.tertiary }]}>
        {label}
      </Text>
      {focused && <View style={styles.tabDot} />}
    </View>
  );
}

export default function TabsLayout() {
  const { t } = useTranslation();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.text.tertiary,
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="📊" label={t('nav.dashboard')} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="salary"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="💰" label={t('nav.salary')} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="credits"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="💳" label={t('nav.credits')} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="emergency"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="🛡️" label={t('nav.emergency')} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="goals"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="🎯" label={t('nav.goals')} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="⚙️" label={t('nav.settings')} focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.bg.secondary,
    borderTopWidth: 1,
    borderTopColor: Colors.border.default,
    height: Platform.OS === 'ios' ? 88 : 72,
    paddingBottom: Platform.OS === 'ios' ? 24 : 8,
    paddingTop: 8,
    elevation: 0,
    shadowOpacity: 0,
  },
  tabItem: {
    alignItems: 'center',
    paddingTop: 4,
    minWidth: 48,
  },
  tabItemFocused: {},
  tabIcon: {
    fontSize: 20,
    marginBottom: 3,
  },
  tabLabel: {
    fontSize: 9,
    fontWeight: Typography.weight.medium,
  },
  tabDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.primary,
    marginTop: 3,
  },
});
