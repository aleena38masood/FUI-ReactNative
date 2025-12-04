// @ts-nocheck
import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Pressable,
  Platform,
  Dimensions,
  useWindowDimensions,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import getStyles from '../../assets/TeacherPortalStyles'; // Import the styles
import { StoredCredentials } from '@/components/StoredCredentials';

type RootStackParamList = {
  TeacherPortal: undefined;
  StudentPortal: undefined;
  AdminLogin: undefined;
  TeacherLogin: undefined;
  AdminDashboard: undefined;
  HODDashboard: undefined;
  DeanDashboard: undefined;
};

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [hovered, setHovered] = useState<string | null>(null);

  const isWide = Dimensions.get('window').width > 750;

  const { width } = useWindowDimensions();
    const isMobile = width < 768;
    const styles = getStyles(isMobile);



  useEffect(() => {
  StoredCredentials(navigation);
}, []);

  const panels = [
    {
      key: 'teacher',
      title: 'Login as Teacher',
      subtitle: 'Manage students, courses, and performance',
      icon: 'human-male-board',
      screen: 'TeacherLogin',
      color: '#2c3e50',
    },
    {
      key: 'student',
      title: 'Login as Student',
      subtitle: 'Enroll in courses and view your results',
      icon: 'school-outline',
      // screen: 'StudentPortal',
      color: '#A9A9A9',
    },
    {
      key: 'admin',
      title: 'Login as Admin',
      subtitle: 'Manage system settings and user accounts',
      icon: 'shield-account',
      screen: 'AdminLogin',
      color: '#8e44ad',
    },
  ];

  return (
    <View style={[styles.container, isWide && styles.containerRow]}>
      {panels.map((panel) => (
        <Pressable
          key={panel.key}
          style={({ pressed }) => [
            styles.panel,
            { backgroundColor: panel.color },
            isWide && styles.panelHalf,
            hovered === panel.key &&
              Platform.OS === 'web' &&
              panel.key !== 'student' &&
              styles.hoverEffect,
            {
              transform: [
                {
                  scale: pressed && panel.key !== 'student' ? 0.98 : 1,
                },
              ],
              // Set cursor to default for student panel, pointer for others
              cursor: Platform.OS === 'web' && panel.key === 'student' ? 'default' : 'pointer',
            },
          ]}
          onPress={() => {
            if (panel.key !== 'student') {
              navigation.navigate(panel.screen);
            }
          }}
          onHoverIn={() =>
            Platform.OS === 'web' && panel.key !== 'student' && setHovered(panel.key)
          }
          onHoverOut={() =>
            Platform.OS === 'web' && panel.key !== 'student' && setHovered(null)
          }
        >
          <MaterialCommunityIcons name={panel.icon} size={60} color="#fff" />
          <Text style={styles.title}>{panel.title}</Text>
          <Text style={styles.subtitle}>{panel.subtitle}</Text>
        </Pressable>
      ))}
    </View>
  );
};

export default HomeScreen;