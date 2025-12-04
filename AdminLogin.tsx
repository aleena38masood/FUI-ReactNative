// @ts-nocheck
import React, { useState, useEffect } from 'react';
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
import AlertModalPopUp from '@/components/AlertModalPopUp'; // Adjust path as needed
import config from '@/constants/config'; // Adjust path as needed
import { getGlobal, setGlobal } from '@/constants/Globals';
import { StoredCredentials } from '@/components/StoredCredentials';



const logo = require('../../assets/images/logo.png');

const AdminLogin = () => {
  const navigation = useNavigation();
  
  const [loginContainerHeight, setLoginContainerHeight] = useState(0);
    const { width } = useWindowDimensions();
    const isMobile = width < 768; // Adjust breakpoint as needed
  
    const handleLoginContainerLayout = (event) => {
      const { height } = event.nativeEvent.layout;
      setLoginContainerHeight(height);
    };
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupType, setPopupType] = useState('success');
  const [popupTitle, setPopupTitle] = useState('');
  const [popupMessage, setPopupMessage] = useState('');
  const [popupButtons, setPopupButtons] = useState([{ text: 'CONTINUE', onPress: () => {} }]);

  // Captcha States
    const [captcha, setCaptcha] = useState('');
    const [captchaInput, setCaptchaInput] = useState('');
    const [captchaError, setCaptchaError] = useState('');
  useEffect(() => {
  StoredCredentials(navigation, (error) => {
    setErrors(error);
    setPopupType('error');
    setPopupTitle('Access Denied');
    setPopupMessage(error.general);
    setPopupButtons([
      { text: 'TRY AGAIN', onPress: () => setShowPopup(false) },
      { text: 'CANCEL', onPress: () => setShowPopup(false) },
    ]);
    setShowPopup(true);
  });
}, []);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  const generateCaptcha = () => {
    const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
    setCaptcha(randomStr);
  };

  const handleLogin = async () => {
    const newErrors = {};

     if (captchaInput.trim().toUpperCase() !== captcha) {
      setCaptchaError('Invalid Captcha');
      generateCaptcha();
      return;
    } else {
      setCaptchaError('');
    }

    if (!email) newErrors.email = 'Email is required';
    else if (!validateEmail(email)) newErrors.email = 'Invalid email format';
    if (!password) newErrors.password = 'Password is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setPopupType('error');
      setPopupTitle('Error');
      setPopupMessage(Object.values(newErrors)[0]);
      setPopupButtons([
        { text: 'TRY AGAIN', onPress: () => setShowPopup(false) },
        { text: 'CANCEL', onPress: () => {
          setShowPopup(false);
          setEmail('');
          setPassword('');
        }},
      ]);
      console.log('Error Popup State:', { popupType, popupTitle, popupMessage, popupButtons });
      setShowPopup(true);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      let data;

      if (config.WorkingMode === 'StaticData') {
        data = {
          isActive: true,
          token: 'static-token-123',
          email,
          fullName: email === 'hod@gmail.com' ? 'HOD Static User' : 'Faculty Static User',
          role: 'Faculty',
          campusName: 'Main Campus',
          departmentName: 'CS Dept',
          schoolName: 'School of Computing',
          programName: 'BSCS',
          isDean: false,
          isFaculty: email === 'hod@gmail.com' ? false : true,
          isHOD: email === 'hod@gmail.com' ? true : false,
          isAdmin: email === 'hod@gmail.com' ? true : false,
          isRector: false,
          isStaff: false,
        };
      } else {
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
          setPopupType('error');
          setPopupTitle('Login Error');
          setPopupMessage(data.message || 'Login failed');
          setPopupButtons([
            { text: 'TRY AGAIN', onPress: () => setShowPopup(false) },
            { text: 'CANCEL', onPress: () => setShowPopup(false) },
          ]);
          console.log('API Error Popup State:', { popupType, popupTitle, popupMessage, popupButtons });
          setShowPopup(true);
          setLoading(false);
          return;
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
          isAdmin: data.isAdmin,
          isSuperAdmin:data.isSuperAdmin
        };
       setGlobal('userName', data.fullName);

        await AsyncStorage.setItem('token', userData.token);
        await AsyncStorage.setItem('userInfo', JSON.stringify(userData));

       // data.isAdmin = true;

        if (data.isAdmin) {
                  setGlobal('userRole', 'Admin');
                  navigation.replace('AdminDashboard');
                } 
        else if (data.isSuperAdmin) {
                  setGlobal('userRole', 'SuperAdmin');
                  navigation.replace('AdminDashboard');
          } 
        
        
        else {
          setPopupType('error');
          setPopupTitle('Access Denied');
          setPopupMessage('Access role not supported for Admin Portal');
          setPopupButtons([
            { text: 'TRY AGAIN', onPress: () => setShowPopup(false) },
            { text: 'CANCEL', onPress: () => setShowPopup(false) },
          ]);
          console.log('Access Error Popup State:', { popupType, popupTitle, popupMessage, popupButtons });
          setShowPopup(true);
        }
      } else {
        setPopupType('error');
        setPopupTitle('Error');
        setPopupMessage('User not found | Cannot Login');
        setPopupButtons([
          { text: 'TRY AGAIN', onPress: () => setShowPopup(false) },
          { text: 'CANCEL', onPress: () => setShowPopup(false) },
        ]);
        console.log('Confirmation Popup State:', { popupType, popupTitle, popupMessage, popupButtons });
        setShowPopup(true);
      }
    } catch (error) {
      setPopupType('confirmation');
      setPopupTitle('Error');
      setPopupMessage('Login failed. Please try again.');
      setPopupButtons([
        { text: 'TRY AGAIN', onPress: () => setShowPopup(false) },
        { text: 'CANCEL', onPress: () => setShowPopup(false) },
      ]);
      console.log('Catch Error Popup State:', { popupType, popupTitle, popupMessage, popupButtons });
      setShowPopup(true);
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    // Linking.openURL('https://example.com/forgot-password').catch((err) =>
    //   console.error('Failed to open URL:', err)
    // );
  };

  const handleContactFeedback = () => {
    // Linking.openURL('https://example.com/contact-feedback').catch((err) =>
    //   console.error('Failed to open URL:', err)
    // );
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
            ADMIN PORTAL
          </Text>
        </View>
        <View style={[styles.contentContainer, isMobile && { flexDirection: 'column' }]}>
          <View
            style={[
              styles.policyContainer,
              isMobile && { marginBottom: 20 },
              { width: isMobile ? '90%' : '60%', marginLeft: isMobile ? '5%' : '0%'
                ,height: loginContainerHeight // Apply the dynamic height here
               },
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
              For example, "Fui@1" meets these criteria. Please do not use the example password provided above. Take care when changing your password, and make sure to remember the new one.
            </Text>
          </View>
          <View
                      style={[styles.loginContainer, { width: isMobile ? '80%' : '30%', marginLeft: isMobile ? '5%' : '0%' }]}
                      onLayout={handleLoginContainerLayout} // This measures the height
                    >
            <Text style={[styles.heading, { fontSize: isMobile ? 16 : 18 }]}>Admin Login</Text>
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

              
                            {/* Captcha Field */}
                            <View style={styles.formField}>
                              <View style={styles.captchaBox}>
                                <Text style={styles.captchaText}>{captcha}</Text>
                                <TouchableOpacity onPress={generateCaptcha}>
                                  <Icon name="refresh" size={20} color="#009688" style={{ marginLeft: 10 }} />
                                </TouchableOpacity>
                              </View>
                              <TextInput
                                style={[styles.input, captchaError ? { borderColor: '#f44336' } : {}]}
                                value={captchaInput}
                                onChangeText={setCaptchaInput}
                                placeholder="Enter Captcha"
                                autoCapitalize="characters"
                              />
                              {captchaError ? <Text style={styles.errorText}>{captchaError}</Text> : null}
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
              {/* <TouchableOpacity onPress={handleForgotPassword}>
                <Text style={styles.linkText}>Forgot Password? Click Here</Text>
              </TouchableOpacity> */}
            </View>
          </View>
        </View>
        <TouchableOpacity onPress={handleContactFeedback}>
          <Text style={[styles.linkText, { marginBottom: 20 }]}>For Contact or Feedback Click Here</Text>
        </TouchableOpacity>
      </View>
      <AlertModalPopUp
        visible={showPopup}
        type={popupType}
        title={popupTitle} // Added title prop
        message={popupMessage}
        buttons={popupButtons}
        onClose={() => setShowPopup(false)}
      />
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
  captchaBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff9e6',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 8,
  },
  captchaText: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#333',
    letterSpacing: 2,
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

export default AdminLogin;