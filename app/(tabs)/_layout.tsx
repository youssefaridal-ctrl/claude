import { Tabs } from 'expo-router';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Colors } from '../../src/theme/colors';
import { Typography } from '../../src/theme/typography';

interface TabIconProps {
  icon: string;
  label: string;
  focused: boolean;
  color: string;
}

function TabIcon({ icon, label, focused, color }: TabIconProps) {
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
          tabBarIcon: ({ focused, color }) => (
            <TabIcon icon="📊" label="Dashboard" focused={focused} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="salary"
        options={{
          tabBarIcon: ({ focused, color }) => (
            <TabIcon icon="💰" label="Salaire" focused={focused} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="credits"
        options={{
          tabBarIcon: ({ focused, color }) => (
            <TabIcon icon="💳" label="Crédits" focused={focused} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="emergency"
        options={{
          tabBarIcon: ({ focused, color }) => (
            <TabIcon icon="🛡️" label="Urgences" focused={focused} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="goals"
        options={{
          tabBarIcon: ({ focused, color }) => (
            <TabIcon icon="🎯" label="Objectifs" focused={focused} color={color} />
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
    minWidth: 60,
  },
  tabItemFocused: {},
  tabIcon: {
    fontSize: 22,
    marginBottom: 3,
  },
  tabLabel: {
    fontSize: 10,
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
