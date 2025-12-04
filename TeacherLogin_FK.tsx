// @ts-nocheck
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Linking,
  useWindowDimensions,
  Image,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import config from '@/constants/config'; // adjust the path based on location

import { getGlobal,setGlobal } from '@/constants/Globals';

const logo = require('../../assets/images/logo.png');

const TeacherLogin = () => {
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);


    //Fk Remind
  //Copy this Idea .... Make it centralize .... CHeck Role & re-direct to Page
  // Static credentials with passwords meeting the policy
  const credentials = {
    'hod@gmail.com': {
      password: 'Password@1234', // Updated to meet password policy
      role: 'HOD',
      dashboard: 'HODDashboard',
      fullName: 'HOD User',
      token: 'mock-token-hod-123456',
    },
    'dean@gmail.com': {
      password: 'Password@1234', // Updated to meet password policy
      role: 'Dean',
      dashboard: 'DeanDashboard',
      fullName: 'Dean User',
      token: 'mock-token-dean-123456',
    },
    'teacher@gmail.com': {
      password: 'Password@1234', // Updated to meet password policy
      role: 'Teacher',
      dashboard: 'TeacherPortal',
      fullName: 'Teacher User',
      token: 'mock-token-teacher-123456',
    },
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    //const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{8,}$/;
   // return passwordRegex.test(password);
   return true;
  };

  const handleLogin = async () => {
    const newErrors = {};
    if (!email) newErrors.email = 'Email is required';
    else if (!validateEmail(email)) newErrors.email = 'Invalid email format';
    if (!password) newErrors.password = 'Password is required';
    else if (!validatePassword(password)) {
      newErrors.password =
        'Password must be at least 8 characters, contain 1 uppercase, 1 lowercase, 1 digit, and 1 special character';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {




        let data: any;

  if (config.WorkingMode === 'StaticData') {
    // Simulate static user data
    data = {
      isActive: true,
      token: 'static-token-123',
      email,
      fullName: email=='hod@gmail.com'? 'HOD Static User':'Faculty Static User',
      role: 'Faculty',
      campusName: 'Main Campus',
      departmentName: 'CS Dept',
      schoolName: 'School of Computing',
      programName: 'BSCS',
      isDean: false,
      isFaculty: email=='hod@gmail.com'? false:true,
      isHOD: email=='hod@gmail.com'? true:false,
      isRector: false,
      isStaff: false,
    };
  } else {

    // Real API Call

  if (config.Use_HR_API_Authentication) {
    //Call API method that authenticates from HR API & then brings data from FUI DB
    
  }
  else
  {
    //Call the API , already running that authenticates from local DB
    const response = await fetch(`${config.BASE_URL}/auth/Auth/Login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: email,
        password: password,
      }),
    });


    data = await response.json();

    if (!response.ok) {
      setErrors({ general: data.message || 'Login failed' });
      setLoading(false);
      return;
    }

  }

  }


  if (data.isActive) {
    const userData = {
      token: data.token,
      email,
      role: data.role,
      fullName: data.fullName,
      campusName: data.campusName,
      departmentName: data.departmentName,
      schoolName: data.schoolName,
      programName: data.programName,
      isDean: data.isDean,
      isFaculty: data.isFaculty,
      isHOD: data.isHOD,
      isRector: data.isRector,
      isStaff: data.isStaff,
    };

    
  setGlobal('userName', data.fullName);


    await AsyncStorage.setItem('token', userData.token);
    await AsyncStorage.setItem('userInfo', JSON.stringify(userData));

    if (data.isHOD) {
      setGlobal('userRole', 'HOD');
      navigation.replace('HODDashboard');
    } else if (data.isDean) {
       setGlobal('userRole', 'Dean');
      navigation.replace('DeanDashboard');
    } else if (data.isFaculty) {
       setGlobal('userRole', 'Faculty');
      navigation.replace('TeacherPortal');
    } else {
       setGlobal('userRole', 'Staff');
      setErrors({ general: 'Access role not supported' });
    }
  } else {
    setErrors({ general: 'User is in-active | Cannot Login' });
  }


 } 
    catch (error) {
      setErrors({ general: 'Login failed. Please try again.' });
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    Linking.openURL('https://example.com/forgot-password').catch((err) =>
      console.error('Failed to open URL:', err)
    );
  };

  const handleContactFeedback = () => {
    Linking.openURL('https://example.com/contact-feedback').catch((err) =>
      console.error('Failed to open URL:', err)
    );
  };

  return (
    <ScrollView
      contentContainerStyle={{ paddingBottom: 20 }}
      style={{ flex: 1, backgroundColor: '#0f2a47' }}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={[styles.logoContainer, isMobile && { flexDirection: 'column', alignItems: 'center' }]}>
            <Image
              source={logo}
              style={[styles.logo, { width: isMobile ? 60 : 85, height: isMobile ? 60 : 85 }]}
            />
            <Text style={[styles.uniName, { fontSize: isMobile ? 16 : 24, marginLeft: isMobile ? 0 : 20 }]}>
              FOUNDATION UNIVERSITY ISLAMABAD {'\n'}
            </Text>
          </View>
          <Text
            style={[
              styles.uniName,
              { fontSize: isMobile ? 16 : 24, color: '#bcddfd', marginLeft: isMobile ? 0 : 20, fontStyle: 'italic' },
            ]}
          >
            FACULTY PORTAL
          </Text>
        </View>
        <View style={[styles.contentContainer, isMobile && { flexDirection: 'column' }]}>
          <View
            style={[
              styles.policyContainer,
              isMobile && { marginBottom: 20 },
              { width: isMobile ? '90%' : '60%', marginLeft: isMobile ? '5%' : '0%' },
            ]}
          >
            <Text style={styles.policyTitle}>Password policy has been updated!</Text>
            <Text style={styles.policyText}>
              Please review the new requirements before logging in.{'\n\n'}
              • Password must have a minimum length of 8 characters.{'\n'}
              • Password must contain at least one uppercase letter (A-Z).{'\n'}
              • Password must contain at least one lowercase letter (a-z).{'\n'}
              • Password must contain at least one special symbol, like !@#$%^&*()_+-=[]{};':"\\|,./?{'\n'}
              • Do not use password containing your name, same SEQUENCE of characters Foundation ONLY Admin abc e.g: (Admin@123, fui@123){'\n'}
              • Passwords must be changed within 60-90 days. Passwords will expire after 60-90 days.{'\n\n'}
              For example, "Fui@ts1" meets these criteria. Please do not use the example password provided above. Take care when changing your password, and make sure to remember the new one.
            </Text>
          </View>
          <View
            style={[styles.loginContainer, { width: isMobile ? '80%' : '30%', marginLeft: isMobile ? '5%' : '0%' }]}
          >
            <Text style={[styles.heading, { fontSize: isMobile ? 16 : 18 }]}>Faculty Login</Text>
            <View style={styles.form}>
              <View style={styles.formField}>
                <TextInput
                  style={[styles.input, errors.email ? { borderColor: '#f44336' } : {}]}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
              </View>
              <View style={styles.formField}>
                <TextInput
                  style={[styles.input, errors.password ? { borderColor: '#f44336' } : {}]}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Password"
                  secureTextEntry
                />
                {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
              </View>
              {errors.general && <Text style={styles.errorText}>{errors.general}</Text>}
              <TouchableOpacity
                style={[styles.button, { backgroundColor: loading ? '#ccc' : '#4caf50' }]}
                onPress={handleLogin}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <>
                    <Text style={styles.buttonText}>Login</Text>
                    <Icon name="arrow-right" size={20} color="#fff" style={styles.buttonIcon} />
                  </>
                )}
              </TouchableOpacity>
              <TouchableOpacity onPress={handleForgotPassword}>
                <Text style={styles.linkText}>Forgot Password? Click Here</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <TouchableOpacity onPress={handleContactFeedback}>
          <Text style={[styles.linkText, { marginBottom: 20 }]}>For Contact or Feedback Click Here</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0f2a47',
    flex: 1,
    alignItems: 'center',
  },
  header: {
    marginTop: 12,
    paddingHorizontal: 6,
    width: '100%',
    alignItems: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  logo: {
    marginRight: 10,
  },
  uniName: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  contentContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginTop: 20,
    width: '105%',
  },
  policyContainer: {
    backgroundColor: '#e6f0fa',
    padding: 15,
    borderRadius: 10,
    width: '60%',
    marginRight: 20,
  },
  policyTitle: {
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    fontSize: 18,
  },
  policyText: {
    color: '#333',
    fontSize: 13,
    lineHeight: 18,
  },
  loginContainer: {
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 10,
    width: '30%',
  },
  heading: {
    fontWeight: 'bold',
    backgroundColor: '#009688',
    color: '#fff',
    textAlign: 'center',
    paddingVertical: 8,
    borderRadius: 4,
    marginBottom: 10,
  },
  form: {
    padding: 12,
  },
  formField: {
    marginBottom: 15,
  },
  input: {
    backgroundColor: '#fff9e6',
    borderWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
    color: '#333',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonIcon: {
    marginLeft: 5,
  },
  linkText: {
    color: 'blue',
    textAlign: 'center',
    textDecorationLine: 'underline',
    marginTop: 10,
  },
  errorText: {
    color: '#f44336',
    fontSize: 15,
    marginTop: 2,
  },
});

export default TeacherLogin;