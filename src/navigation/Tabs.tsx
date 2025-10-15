import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import TodayScreen from '@/screens/Tabs/TodayScreen';
import HabitsScreen from '@/screens/Tabs/HabitsScreen';
import CalendarScreen from '@/screens/Tabs/CalendarScreen';
import ProgressScreen from '@/screens/Tabs/ProgressScreen';
import NutritionScreen from '@/screens/Tabs/NutritionScreen';
import LocationScreen from '@/screens/Tabs/LocationScreen';
import ProfileScreen from '@/screens/Tabs/ProfileScreen';
import RewardsScreen from '@/screens/Tabs/RewardsScreen';
import { colors } from '@/theme/colors';
import { Ionicons, Feather } from '@expo/vector-icons';

export type TabParamList = {
  Today: undefined;
  Habits: undefined;
  Calendar: undefined;
  Progress: undefined;
  Nutrition: undefined;
  Location: undefined;
  Profile: undefined;
  Rewards: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

export default function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: '#0D141B', borderTopColor: '#0D141B' },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.subtext
      }}
      initialRouteName="Today"
    >
      <Tab.Screen
        name="Today"
        component={TodayScreen}
        options={{
          tabBarLabel: 'Hoje',
          tabBarIcon: ({ color, size }) => <Ionicons name="home" color={color} size={size} />
        }}
      />
      <Tab.Screen
        name="Habits"
        component={HabitsScreen}
        options={{
          tabBarLabel: 'Hábitos',
          tabBarIcon: ({ color, size }) => <Feather name="check-square" color={color} size={size} />
        }}
      />
      <Tab.Screen
        name="Calendar"
        component={CalendarScreen}
        options={{
          tabBarLabel: 'Calendário',
          tabBarIcon: ({ color, size }) => <Ionicons name="calendar" color={color} size={size} />
        }}
      />
      <Tab.Screen
        name="Progress"
        component={ProgressScreen}
        options={{
          tabBarLabel: 'Progresso',
          tabBarIcon: ({ color, size }) => <Feather name="bar-chart-2" color={color} size={size} />
        }}
      />
      <Tab.Screen
        name="Nutrition"
        component={NutritionScreen}
        options={{
          tabBarLabel: 'Nutrição',
          tabBarIcon: ({ color, size }) => <Ionicons name="restaurant" color={color} size={size} />
        }}
      />
      <Tab.Screen
        name="Location"
        component={LocationScreen}
        options={{
          tabBarLabel: 'Locais',
          tabBarIcon: ({ color, size }) => <Ionicons name="navigate" color={color} size={size} />
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Perfil',
          tabBarIcon: ({ color, size }) => <Ionicons name="person" color={color} size={size} />
        }}
      />
      <Tab.Screen
        name="Rewards"
        component={RewardsScreen}
        options={{
          tabBarLabel: 'Rewards',
          tabBarIcon: ({ color, size }) => <Ionicons name="trophy" color={color} size={size} />
        }}
      />
    </Tab.Navigator>
  );
}
