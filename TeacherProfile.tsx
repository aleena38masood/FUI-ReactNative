


// @ts-nocheck
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  TextInput,
  Picker,
  useWindowDimensions,
} from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useNavigationState } from '@react-navigation/native';
import images from '@/assets/images';
import getStyles from '../../assets/TeacherPortalStyles'; // Import the styles

import config from '@/constants/config'; // adjust the path based on location

import MenuBar from '../../components/MenuBar'; // Adjust path as needed
import Header from '@/components/HeaderComponent';
import SubMenuBar from '@/components/SubMenuBar'; // Adjust path if necessary
//import images from '@/constants/images'; // Your image icons


// const menuItems = [
//   { label: 'Dashboard', icon: images.home, navigateTo: 'TeacherPortal' },
//   { label: 'Profile', icon: images.profile, navigateTo: 'TeacherProfile' },
//   { label: 'Announcements', icon: images.bell, navigateTo: 'Announcements' },
//   { label: 'Logout', icon: images.logout, navigateTo: 'TeacherLogout' },
// ];

const initialProfile = {
  Name: 'Aleena Khan',
  FatherName: 'Masood Ahmed',
  RollNumber: 'FUI/FA24-BDS-011/ISB',
  Email: 'aleena.khan@example.com',
  Phone: '03011234567',
  CNIC: '35201-1234567-8',
  Address: 'House No. 21, Street 4, DHA 1, Islamabad, Pakistan',
};

const provinces = [
  'Punjab',
  'Sindh',
  'Khyber Pakhtunkhwa',
  'Balochistan',
  'FATA',
  'Islamabad Federal',
];

const cityOptions = {
  Punjab: ['Rawalpindi', 'Lahore', 'Sialkot', 'Multan'],
  Sindh: ['Karachi', 'Hyderabad', 'Larkana', 'Kasoor'],
  'Khyber Pakhtunkhwa': ['Peshawar', 'Kohat', 'Abbottabad', 'Mardan'],
  Balochistan: ['Quetta', 'Chaman', 'Gwadar'],
  'Islamabad Federal': ['Islamabad'],
  FATA: [],
};

const parseAddress = (address) => {
  const parts = address.split(', ');
  return {
    houseNumber: parts[0].replace('House No. ', '') || '',
    street: parts[1].replace('Street ', '') || '',
    area: parts[2] || '',
    city: parts[3] || '',
    province: '',
    zip: '',
    country: parts[4] || '',
  };
};

const formatAddress = (addressObj) => {
  const parts = [];
  if (addressObj.houseNumber) parts.push(`House No. ${addressObj.houseNumber}`);
  if (addressObj.street) parts.push(`Street ${addressObj.street}`);
  if (addressObj.area) parts.push(addressObj.area);
  if (addressObj.city) parts.push(addressObj.city);
  if (addressObj.country) parts.push(addressObj.country);
  return parts.join(', ');
};

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePhone = (phone) => {
  const phoneRegex = /^\d{11}$/;
  return phoneRegex.test(phone);
};

const TeacherProfile = () => {
  const navigation = useNavigation();
const [loading, setLoading] = useState(true);

useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        navigation.replace('TeacherLogin'); // Redirect to login if not authenticated
      } else {
        setLoading(false); // Authenticated
      }
    };

    checkAuth();
  }, []);


  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const styles = getStyles(isMobile);

  const currentRouteName = useNavigationState((state) => {
    const route = state.routes[state.index];
    return route.name;
  });

  const [profile, setProfile] = useState(initialProfile);
  const [editingField, setEditingField] = useState(null);
  const [tempValue, setTempValue] = useState('');
  const [addressForm, setAddressForm] = useState({});
  const [errors, setErrors] = useState({});

  const handleEdit = (field) => {
    setEditingField(field);
    setErrors({});
    if (field === 'Address') {
      setAddressForm(parseAddress(profile[field]));
    } else {
      setTempValue(profile[field]);
    }
  };

  const validateAddressForm = () => {
    const newErrors = {};
    if (!addressForm.street) newErrors.street = 'Street is required';
    if (!addressForm.houseNumber) newErrors.houseNumber = 'House number is required';
    if (!addressForm.area) newErrors.area = 'Area is required';
    if (!addressForm.city) newErrors.city = 'City is required';
    if (!addressForm.province) newErrors.province = 'Province is required';
    if (!addressForm.zip) newErrors.zip = 'ZIP code is required';
    if (!addressForm.country) newErrors.country = 'Country is required';
    return newErrors;
  };

  const handleSave = (field) => {
    let newErrors = {};
    if (field === 'Address') {
      newErrors = validateAddressForm();
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }
      const formattedAddress = formatAddress(addressForm);
      setProfile({ ...profile, [field]: formattedAddress });
    } else {
      if (!tempValue) {
        setErrors({ [field]: `${field} is required` });
        return;
      }
      if (field === 'Email' && !validateEmail(tempValue)) {
        setErrors({ [field]: 'Invalid email format' });
        return;
      }
      if (field === 'Phone' && !validatePhone(tempValue)) {
        setErrors({ [field]: 'Phone number must be exactly 11 digits' });
        return;
      }
      setProfile({ ...profile, [field]: tempValue });
    }
    setEditingField(null);
    setAddressForm({});
    setErrors({});
  };

  const handleCancel = () => {
    setEditingField(null);
    setAddressForm({});
    setErrors({});
  };

  const navigateSafely = (route) => {
    try {
      if (navigation.getState().routeNames.includes(route)) {
        navigation.navigate(route);
      } else {
        console.warn(`Route ${route} not found`);
      }
    } catch (error) {
      console.error(`Navigation error: ${error.message}`);
    }
  };


    // const renderHeader = () => (
    //   <>
    //     <View style={[styles.topBar]}>
    //       <Text style={[styles.welcomeText]}>
    //        Welcome
    //       </Text>
    //     </View>
    //     <View style={styles.header}>
    //       <View style={[styles.contentRow]}>
    //         <View style={[styles.logoContainer, isMobile && { width: '100%', marginBottom: 10 }]}>
    //           <Image
    //             source={images.logo}
    //             style={[styles.logo, { }]}
    //           />
    //           <Text style={[styles.uniName]}>
    //             FOUNDATION UNIVERSITY{'\n'}ISLAMABAD
    //           </Text>
    //         </View>
    //         <View style={[styles.menuContainer, isMobile && { alignItems: 'center' }]}>
    //           <View style={[styles.menuGrid]}>
              
    //                <MenuBar isMobile={isMobile} isDashboardView={false} />

  
  
  
    //           </View>
  
  
  
  
    //           <View
    //             style={[
    //               styles.actionRow
    //             ]}
    //           />
    //         </View>
    //         {!isMobile && (
    //           <View style={styles.rightSection}>
    //             <Image source={images.i2} style={styles.i2} />
    //           </View>
    //         )}
    //       </View>
    //     </View>
    //   </>
    // );
  

  
  const renderAddressForm = () => {
    const cities = cityOptions[addressForm.province] || [];
    return (
      <View style={styles.addressForm_profile}>
        <View style={styles.formRow_profile}>
          <View style={styles.formField_profile}>
            <Text style={styles.formLabel_profile}>Street:</Text>
            <TextInput
              style={[styles.input_profile, errors.street ? { borderColor: '#f44336' } : {}]}
              value={addressForm.street}
              onChangeText={(text) => setAddressForm({ ...addressForm, street: text })}
              placeholder="Street"
            />
            {errors.street && <Text style={styles.errorText}>{errors.street}</Text>}
          </View>
          <View style={styles.formField_profile}>
            <Text style={styles.formLabel_profile}>House number:</Text>
            <TextInput
              style={[styles.input_profile, errors.houseNumber ? { borderColor: '#f44336' } : {}]}
              value={addressForm.houseNumber}
              onChangeText={(text) => setAddressForm({ ...addressForm, houseNumber: text })}
              placeholder="House number"
            />
            {errors.houseNumber && <Text style={styles.errorText}>{errors.houseNumber}</Text>}
          </View>
        </View>
        <View style={styles.formRow_profile}>
          <View style={styles.formField_profile}>
            <Text style={styles.formLabel_profile}>Area:</Text>
            <TextInput
              style={[styles.input_profile, errors.area ? { borderColor: '#f44336' } : {}]}
              value={addressForm.area}
              onChangeText={(text) => setAddressForm({ ...addressForm, area: text })}
              placeholder="Area"
            />
            {errors.area && <Text style={styles.errorText}>{errors.area}</Text>}
          </View>
        </View>
        <View style={styles.formRow_profile}>
          <View style={styles.formField_profile}>
            <Text style={styles.formLabel_profile}>Province:</Text>
            <Picker
              selectedValue={addressForm.province}
              style={[styles.picker_profile, errors.province ? { borderColor: '#f44336' } : {}]}
              onValueChange={(itemValue) => setAddressForm({ ...addressForm, province: itemValue, city: '' })}
            >
              <Picker.Item label="Select Province" value="" />
              {provinces.map((province, index) => (
                <Picker.Item key={index} label={province} value={province} />
              ))}
            </Picker>
            {errors.province && <Text style={styles.errorText}>{errors.province}</Text>}
          </View>
          <View style={styles.formField_profile}>
            <Text style={styles.formLabel_profile}>ZIP code:</Text>
            <TextInput
              style={[styles.input_profile, errors.zip ? { borderColor: '#f44336' } : {}]}
              value={addressForm.zip}
              onChangeText={(text) => setAddressForm({ ...addressForm, zip: text })}
              placeholder="ZIP code"
            />
            {errors.zip && <Text style={styles.errorText}>{errors.zip}</Text>}
          </View>
        </View>
        <View style={styles.formRow_profile}>
          <View style={styles.formField}_profile>
            <Text style={styles.formLabel_profile}>City:</Text>
            <Picker
              selectedValue={addressForm.city}
              style={[styles.picker_profile, errors.city ? { borderColor: '#f44336' } : {}]}
              onValueChange={(itemValue) => setAddressForm({ ...addressForm, city: itemValue })}
            >
              <Picker.Item label="Select City" value="" />
              {cities.map((city, index) => (
                <Picker.Item key={index} label={city} value={city} />
              ))}
            </Picker>
            {errors.city && <Text style={styles.errorText}>{errors.city}</Text>}
          </View>
          <View style={styles.formField_profile}>
            <Text style={styles.formLabel_profile}>Country:</Text>
            <TextInput
              style={[styles.input_profile, errors.country ? { borderColor: '#f44336' } : {}]}
              value={addressForm.country}
              onChangeText={(text) => setAddressForm({ ...addressForm, country: text })}
              placeholder="Country"
            />
            {errors.country && <Text style={styles.errorText}>{errors.country}</Text>}
          </View>
        </View>
        <View style={styles.buttonRow_profile}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: '#4caf50' }]}
            onPress={() => handleSave('Address')}
          >
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: '#f44336' }]}
            onPress={handleCancel}
          >
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };


  useEffect(() => {
  const fetchUserProfile = async () => {
    setLoading(true); //show
    try {
      const token = await AsyncStorage.getItem('token');


 // Check if running in StaticData mode
      if (config.WorkingMode === 'StaticData') {
      return;
      }



      const response = await fetch(`${config.BASE_URL}/api/Course/GetUserProfile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        setErrors({ general: data.message || 'Failed to fetch user profile' });
      } else {
        const profile = data.userProfileData?.profileDetails;

        if (!profile) {
          setErrors({ general: 'No profile data returned' });
          return;
        }

        setProfile({
          Name: profile.fullName || '',
          FatherName: profile.father_Name || '',
          RegNo: profile.office_Registration_No || '',
          Email: profile.personal_Email || '',
          Phone: profile.phone || '',
          CNIC: profile.cnic || '',
          Address: profile.permanent_Address || ''
        });
      }
    } catch (error) {
      console.error('Profile fetch failed:', error);
      setErrors({ general: 'Unexpected error occurred' });
    }
    finally{
      setLoading(false); //show

    }
  };

  fetchUserProfile();
}, []);



if (loading) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
      <ActivityIndicator size="large" color="#009688" />
      <Text style={{ marginTop: 10, color: '#009688' }}>Loading profile...</Text>
    </View>
  );
}




 const renderProfileTable = () => (
  <View style={[styles.tableContainer, { width: isMobile ? '90%' : '58%' }]}>
    <Text style={[styles.heading, { fontSize: isMobile ? 14 : 20 }]}>
      Teacher's Profile
    </Text>
    <View style={[styles.tableWrapper, { width: '100%' }]}>
      <View style={{ width: '100%' }}>
        <View style={[styles.tableRow_profile, styles.tableHeader_profile]}>
          <Text
            style={[
              styles.tableCell_profile,
              {
                flex: 1,
                fontSize: isMobile ? 12 : 14,
                padding: isMobile ? 6 : 8,
              },
            ]}
          >
            Field
          </Text>
          <Text
            style={[
              styles.tableCell_profile,
              {
                flex: 2,
                fontSize: isMobile ? 12 : 14,
                padding: isMobile ? 6 : 8,
              },
            ]}
          >
            Value
          </Text>
          {/* <Text
            style={[
              styles.tableCell_profile,
              {
                flex: 1,
                fontSize: isMobile ? 12 : 14,
                padding: isMobile ? 6 : 8,
              },
            ]}
          >
            Action
          </Text> */}
        </View>
        {Object.entries(profile).map(([field, value], index) => (
          <View key={index} style={styles.tableRow_profile}>
            <Text
              style={[
                styles.tableCell_profile,
                {
                  flex: 1,
                  fontSize: isMobile ? 12 : 14,
                  padding: isMobile ? 6 : 8,
                  textAlign: 'left',
                },
              ]}
              accessible={true}
              accessibilityLabel={`Field ${field}`}
            >
              {field.replace(/([A-Z])/g, ' $1')}
            </Text>
            <View
              style={[
                styles.tableCell_profile,
                {
                  flex: 2,
                  padding: isMobile ? 6 : 8,
                },
              ]}
              accessible={true}
              accessibilityLabel={`Value ${value}`}
            >
              {editingField === field ? (
                field === 'Address' ? (
                  renderAddressForm()
                ) : (
                  <View>
                    <TextInput
                      style={[
                        styles.input,
                        errors[field] ? { borderColor: '#f44336' } : {},
                        { fontSize: isMobile ? 12 : 14 },
                      ]}
                      value={tempValue}
                      onChangeText={setTempValue}
                      placeholder={`Enter ${field}`}
                      autoFocus
                    />
                    {errors[field] && (
                      <Text style={styles.errorText}>{errors[field]}</Text>
                    )}
                  </View>
                )
              ) : (
                <Text
                  style={{
                    fontSize: isMobile ? 12 : 14,
                    textAlign: 'left',
                    marginLeft: 10,
                    flexWrap: 'wrap',
                  }}
                  numberOfLines={3}
                  ellipsizeMode="tail"
                >
                  {value}
                </Text>
              )}
            </View>
            {/* <View
              style={[
                styles.tableCell_profile,
                {
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexDirection: 'row',
                  padding: isMobile ? 6 : 8,
                },
              ]}
              accessible={true}
              accessibilityLabel={
                editingField === field ? `Save or Cancel ${field}` : `Edit ${field}`
              }
            >
              {['Name', 'RollNumber', 'FatherName', 'CNIC'].includes(field) ? (
                <Image
                  source={images.pencil}
                  style={{
                    width: isMobile ? 20 : 20,
                    height: isMobile ? 20 : 20,
                    resizeMode: 'contain',
                  }}
                  tintColor="#b0b0b0"
                  onError={() => console.log('Failed to load pencil')}
                />
              ) : (
                <>
                  <TouchableOpacity
                    onPress={() =>
                      editingField === field ? handleSave(field) : handleEdit(field)
                    }
                  >
                    <Image
                      source={
                        editingField === field && field !== 'Address'
                          ? images.checkCircle
                          : images.pencil
                      }
                      style={{
                        width: isMobile ? 20 : 20,
                        height: isMobile ? 20 : 20,
                        resizeMode: 'contain',
                      }}
                      tintColor={
                        editingField === field && field !== 'Address'
                          ? '#4caf50'
                          : '#3f51b5'
                      }
                      onError={() =>
                        console.log(
                          `Failed to load ${
                            editingField === field && field !== 'Address'
                              ? 'checkCircle'
                              : 'pencil'
                          }`
                        )
                      }
                    />
                  </TouchableOpacity>
                  {editingField === field && field !== 'Address' && (
                    <TouchableOpacity
                      onPress={handleCancel}
                      style={{ marginLeft: 10 }}
                    >
                      <Image
                        source={images.closeCircle}
                        style={{
                          width: isMobile ? 20 : 20,
                          height: isMobile ? 20 : 20,
                          resizeMode: 'contain',
                        }}
                        tintColor="#ff0000"
                        onError={() => console.log('Failed to load cancelIcon')}
                      />
                    </TouchableOpacity>
                  )}
                </>
              )}
            </View> */}
          </View>
        ))}
      </View>
    </View>
  </View>
);  


  return (
    <View style={styles.container}>
      {isMobile ? (
        <ScrollView contentContainerStyle={[styles.scrollArea, { paddingBottom: 50 }]}>
          {/* {renderHeader()} */}
          <Header isMobile={isMobile} />
          {renderProfileTable()}
        </ScrollView>
      ) : (
        <>
          {/* {renderHeader()} */}
          <Header isMobile={isMobile} />
          <ScrollView contentContainerStyle={[styles.scrollArea, { paddingBottom: 30 }]}>
            {renderProfileTable()}
          </ScrollView>
        </>
      )}
    </View>
  );
};

// const styles = StyleSheet.create({
//   container: {
//     backgroundColor: '#0f2a47',
//     flex: 1,
//   },
//   topBar: {
//     paddingVertical: 4,
//     alignItems: 'center',
//     backgroundColor: '#009688',
//     width: '100%',
//   },
//   welcomeText: {
//     color: '#fff',
//     fontWeight: 'bold',
//   },
//   header: {
//     backgroundColor: '#0f2a47',
//     marginTop: 12,
//     paddingHorizontal: 6,
//   },
//   contentRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'flex-start',
//   },
//   logoContainer: {
//     width: '12%',
//     alignItems: 'left',
//     flex: 1,
//     flexDirection: 'row',
//   },
//   logo: {
//     marginLeft: 30,
//   },
//   uniName: {
//     color: 'white',
//     fontWeight: 'bold',
//     textAlign: 'left',
//     marginLeft: 8,
//     marginTop: 14,
//   },
//   menuContainer: {
//     width: '50%',
//   },
//   menuGrid: {
//     width: '100%',
//     flexDirection: 'row',
//     justifyContent: 'center',
//   },
//   menuItem: {
//     backgroundColor: '#fff',
//     borderRadius: 6,
//     alignItems: 'center',
//     justifyContent: 'flex-start',
//     margin: 6,
//     paddingTop: 8,
//   },
//   menuLabel: {
//     // marginTop: 1,
//     textAlign: 'center',
//     color: '#333',
//     fontWeight: '500',
//   },
//   rightSection: {
//     width: '20%',
//     alignItems: 'center',
//     flex: 1,
//   },
//   i2: {
//     width: 70,
//     height: 70,
//     borderRadius: 2,
//     marginLeft: 40,
//   },
//   actionRow: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     marginTop: 10,
//   },
//   scrollArea: {
//     alignItems: 'center',
//   },

  
//   tableContainer: {
//     backgroundColor: '#fff',
//     padding: 6,
//     borderRadius: 10,
//     elevation: 4,
//     marginTop: 10,
//     alignSelf: 'center',
//     marginBottom: 20,
//   },
//   heading: {
//     fontWeight: 'bold',
//     backgroundColor: '#009688',
//     color: '#fff',
//     textAlign: 'center',
//     paddingVertical: 8,
//     borderRadius: 4,
//     marginBottom: 10,
//   },
//   tableWrapper: {
//     width: '100%',
//     overflow: 'hidden', // Prevent any overflow
//   },
//   tableRow: {
//     flexDirection: 'row',
//     borderWidth: 1,
//     borderColor: '#333',
//     width: '100%',
//   },
//   tableHeader: {
//     backgroundColor: '#e0e0e0',
//   },
//   tableCell_profile: {
//     borderRightWidth: 1,
//     borderColor: '#333',
//     textAlign: 'center',
//     flexWrap: 'wrap', // Allow text to wrap
//   },

//   input_profile: {
//     borderBottomWidth: 1,
//     borderColor: '#009688',
//     paddingVertical: 2,
//     textAlign: 'center',
//     color: '#333',
//     flex: 1, // Ensure input fits within cell
//   },
//   picker_profile: {
//     borderBottomWidth: 1,
//     borderColor: '#009688',
//     height: 40,
//     color: '#333',
//     flex: 1,
//   },

//   addressForm_profile: {
//     padding: 10,
//   },
//   formRow_profile: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 10,
//   },
//   formField_profile: {
//     flex: 1,
//     marginHorizontal: 5,
//   },
//   formLabel_profile: {
//     fontSize: 14,
//     marginBottom: 5,
//     color: '#333',
//   },
//   buttonRow_profile: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     marginTop: 10,
//   },
//   button: {
//     paddingVertical: 8,
//     paddingHorizontal: 20,
//     borderRadius: 5,
//     marginHorizontal: 10,
//   },
//   buttonText: {
//     color: '#fff',
//     fontWeight: 'bold',
//     textAlign: 'center',
//   },
//   errorText: {
//     color: '#f44336',
//     fontSize: 13,
//     marginTop: 2,
//   },
// });

export default TeacherProfile;