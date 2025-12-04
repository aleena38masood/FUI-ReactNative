// app/tabs/TeacherLogout.tsx
import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Redirect } from 'expo-router';

export default function LogoutScreen() {
  useEffect(() => {
    const logout = async () => {
      try {
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('userInfo');

      } catch (error) {
        console.error('Logout error:', error);
      }
    };

    logout();
  }, []);

  // After cleanup, redirect to login
  return <Redirect href="/HomeScreen" />;
}
