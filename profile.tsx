

// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   Image,
//   TouchableOpacity,
//   ScrollView,
//   TextInput,
//   Picker,
//   useWindowDimensions,
// } from 'react-native';
// import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
// import { useNavigation, useRoute } from '@react-navigation/native';

// const logo = require('../../assets/images/logo.png');
// const i2 = require('../../assets/images/i2.jpg');

// const menuItems = [
//   { label: 'Dashboard', icon: 'home', color: '#3f51b5', navigateTo: 'StudentPortal' },
//   { label: 'Course\nRegistration', icon: 'book-open', color: '#4caf50', navigateTo: 'CourseRegistration' },
//   { label: 'Fees', icon: 'cash-multiple', color: '#ff9800', navigateTo: 'Fees' },
//   { label: 'Result Card', icon: 'file-document', color: '#9c27b0', navigateTo: 'ResultCard' },
//   { label: 'Profile', icon: 'account', color: '#03a9f4', navigateTo: 'profile' },
//   { label: 'APS', icon: 'cog-outline', color: '#607d8b', navigateTo: 'APS' },
//   { label: 'Logout', icon: 'logout', color: '#795548', navigateTo: 'TeacherLogin' },
// ];

// const initialProfile = {
//   Name: 'Aleena Khan',
//   FatherName: 'Masood Ahmed',
//   Cnic: '35201-1234567-8',
//   RollNumber: 'FUI/FA24-BDS-011/ISB',
//   Email: 'aleena.khan@example.com',
//   Phone: '03011234567',
//   Program: 'Bachelor of Dental Surgery',
//   Batch: 'Fall 2024',
//   Address: 'House No. 21, Street 4, DHA 1, Islamabad, Pakistan',
// };

// const provinces = [
//   'Punjab',
//   'Sindh',
//   'Khyber Pakhtunkhwa',
//   'Balochistan',
//   'FATA',
//   'Islamabad Federal',
// ];

// const cityOptions = {
//   Punjab: ['Rawalpindi', 'Lahore', 'Sialkot', 'Multan'],
//   Sindh: ['Karachi', 'Hyderabad', 'Larkana', 'Kasoor'],
//   'Khyber Pakhtunkhwa': ['Peshawar', 'Kohat', 'Abbottabad', 'Mardan'],
//   Balochistan: ['Quetta', 'Chaman', 'Gwadar'],
//   'Islamabad Federal': ['Islamabad'],
//   FATA: [],
// };

// const parseAddress = (address) => {
//   const parts = address.split(', ');
//   return {
//     houseNumber: parts[0].replace('House No. ', '') || '',
//     street: parts[1].replace('Street ', '') || '',
//     area: parts[2] || '',
//     city: parts[3] || '',
//     province: '',
//     zip: '',
//     country: parts[4] || '',
//   };
// };

// const formatAddress = (addressObj) => {
//   const parts = [];
//   if (addressObj.houseNumber) parts.push(`House No. ${addressObj.houseNumber}`);
//   if (addressObj.street) parts.push(`Street ${addressObj.street}`);
//   if (addressObj.area) parts.push(addressObj.area);
//   if (addressObj.city) parts.push(addressObj.city);
//   if (addressObj.country) parts.push(addressObj.country);
//   return parts.join(', ');
// };

// const validateEmail = (email) => {
//   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//   return emailRegex.test(email);
// };

// const validatePhone = (phone) => {
//   const phoneRegex = /^\d{11}$/;
//   return phoneRegex.test(phone);
// };

// const Profile = () => {
//   const navigation = useNavigation();
//   const route = useRoute();
//   const { width } = useWindowDimensions();
//   const isMobile = width < 768;

//   const [profile, setProfile] = useState(initialProfile);
//   const [editingField, setEditingField] = useState(null);
//   const [tempValue, setTempValue] = useState('');
//   const [addressForm, setAddressForm] = useState({});
//   const [errors, setErrors] = useState({});

//   const handleEdit = (field) => {
//     setEditingField(field);
//     setErrors({});
//     if (field === 'Address') {
//       setAddressForm(parseAddress(profile[field]));
//     } else {
//       setTempValue(profile[field]);
//     }
//   };

//   const validateAddressForm = () => {
//     const newErrors = {};
//     if (!addressForm.street) newErrors.street = 'Street is required';
//     if (!addressForm.houseNumber) newErrors.houseNumber = 'House number is required';
//     if (!addressForm.area) newErrors.area = 'Area is required';
//     if (!addressForm.city) newErrors.city = 'City is required';
//     if (!addressForm.province) newErrors.province = 'Province is required';
//     if (!addressForm.zip) newErrors.zip = 'ZIP code is required';
//     if (!addressForm.country) newErrors.country = 'Country is required';
//     return newErrors;
//   };

//   const handleSave = (field) => {
//     let newErrors = {};
//     if (field === 'Address') {
//       newErrors = validateAddressForm();
//       if (Object.keys(newErrors).length > 0) {
//         setErrors(newErrors);
//         return;
//       }
//       const formattedAddress = formatAddress(addressForm);
//       setProfile({ ...profile, [field]: formattedAddress });
//     } else {
//       if (!tempValue) {
//         setErrors({ [field]: `${field} is required` });
//         return;
//       }
//       if (field === 'Email' && !validateEmail(tempValue)) {
//         setErrors({ [field]: 'Invalid email format' });
//         return;
//       }
//       if (field === 'Phone' && !validatePhone(tempValue)) {
//         setErrors({ [field]: 'Phone number must be exactly 11 digits' });
//         return;
//       }
//       setProfile({ ...profile, [field]: tempValue });
//     }
//     setEditingField(null);
//     setAddressForm({});
//     setErrors({});
//   };

//   const handleCancel = () => {
//     setEditingField(null);
//     setAddressForm({});
//     setErrors({});
//   };

//   const renderHeader = () => (
//     <>
//       <View style={[styles.topBar, { height: isMobile ? 20 : 25 }]}>
//         <Text style={[styles.welcomeText, { fontSize: isMobile ? 12 : 14 }]}>
//           Welcome: {profile.RollNumber}
//         </Text>
//       </View>

//       <View style={styles.header}>
//         <View style={[styles.contentRow, isMobile && { flexDirection: 'column', alignItems: 'center' }]}>
//           <View style={[styles.logoContainer, isMobile && { width: '100%', marginBottom: 10 }]}>
//             <Image
//               source={logo}
//               style={[styles.logo, { width: isMobile ? 50 : 65, height: isMobile ? 50 : 65 }]}
//             />
//             <Text style={[styles.uniName, { fontSize: isMobile ? 13 : 15 }]}>
//               FOUNDATION UNIVERSITY{'\n'}ISLAMABAD
//             </Text>
//           </View>

//           <View style={[styles.menuGrid, isMobile && { width: '100%', justifyContent: 'center' }]}>
//             {menuItems.map((item, index) => {
//               const isActive = item.navigateTo === route.name;
//               const isCurrent = item.label === 'Profile';

//               return (
//                 <TouchableOpacity
//                   key={index}
//                   style={[
//                     styles.menuItem,
//                     { width: isMobile ? 70 : 80, height: isMobile ? 50 : 58 },
//                     (isCurrent || isActive) && { backgroundColor: '#3f51b5' },
//                   ]}
//                   onPress={() => {
//                     if (item.navigateTo && item.navigateTo !== route.name) {
//                       navigation.navigate(item.navigateTo);
//                     }
//                   }}
//                 >
//                   <Icon
//                     name={item.icon}
//                     size={isMobile ? 20 : 25}
//                     color={(isCurrent || isActive) ? '#fff' : item.color}
//                   />
//                   <Text
//                     style={[
//                       styles.menuLabel,
//                       { fontSize: isMobile ? 8 : 10 },
//                       (isCurrent || isActive) && { color: '#fff' },
//                     ]}
//                   >
//                     {item.label}
//                   </Text>
//                 </TouchableOpacity>
//               );
//             })}
//           </View>

//           {!isMobile && (
//             <View style={styles.rightSection}>
//               <Image source={i2} style={styles.i2} />
//             </View>
//           )}
//         </View>
//       </View>
//     </>
//   );

//   const renderAddressForm = () => {
//     const cities = cityOptions[addressForm.province] || [];
//     return (
//       <View style={[styles.addressForm, isMobile && { padding: 5 }]}>
//         <View style={[styles.formRow, isMobile && { flexDirection: 'column' }]}>
//           <View style={[styles.formField, isMobile && { marginBottom: 10 }]}>
//             <Text style={[styles.formLabel, { fontSize: isMobile ? 10 : 14 }]}>Street:</Text>
//             <TextInput
//               style={[styles.input, errors.street ? { borderColor: '#f44336' } : {}, { fontSize: isMobile ? 10 : 14 }]}
//               value={addressForm.street}
//               onChangeText={(text) => setAddressForm({ ...addressForm, street: text })}
//               placeholder="Street"
//             />
//             {errors.street && <Text style={[styles.errorText, { fontSize: isMobile ? 10 : 13 }]}>{errors.street}</Text>}
//           </View>
//           <View style={styles.formField}>
//             <Text style={[styles.formLabel, { fontSize: isMobile ? 10 : 14 }]}>House number:</Text>
//             <TextInput
//               style={[styles.input, errors.houseNumber ? { borderColor: '#f44336' } : {}, { fontSize: isMobile ? 10 : 14 }]}
//               value={addressForm.houseNumber}
//               onChangeText={(text) => setAddressForm({ ...addressForm, houseNumber: text })}
//               placeholder="House number"
//             />
//             {errors.houseNumber && <Text style={[styles.errorText, { fontSize: isMobile ? 10 : 13 }]}>{errors.houseNumber}</Text>}
//           </View>
//         </View>
//         <View style={[styles.formRow, isMobile && { flexDirection: 'column' }]}>
//           <View style={[styles.formField, isMobile && { marginBottom: 10 }]}>
//             <Text style={[styles.formLabel, { fontSize: isMobile ? 10 : 14 }]}>Area:</Text>
//             <TextInput
//               style={[styles.input, errors.area ? { borderColor: '#f44336' } : {}, { fontSize: isMobile ? 10 : 14 }]}
//               value={addressForm.area}
//               onChangeText={(text) => setAddressForm({ ...addressForm, area: text })}
//               placeholder="Area"
//             />
//             {errors.area && <Text style={[styles.errorText, { fontSize: isMobile ? 10 : 13 }]}>{errors.area}</Text>}
//           </View>
//         </View>
//         <View style={[styles.formRow, isMobile && { flexDirection: 'column' }]}>
//           <View style={[styles.formField, isMobile && { marginBottom: 10 }]}>
//             <Text style={[styles.formLabel, { fontSize: isMobile ? 10 : 14 }]}>Province:</Text>
//             <Picker
//               selectedValue={addressForm.province}
//               style={[styles.picker, errors.province ? { borderColor: '#f44336' } : {}, { height: isMobile ? 30 : 40 }]}
//               onValueChange={(itemValue) => setAddressForm({ ...addressForm, province: itemValue, city: '' })}
//             >
//               <Picker.Item label="Select Province" value="" />
//               {provinces.map((province, index) => (
//                 <Picker.Item key={index} label={province} value={province} />
//               ))}
//             </Picker>
//             {errors.province && <Text style={[styles.errorText, { fontSize: isMobile ? 10 : 13 }]}>{errors.province}</Text>}
//           </View>
//           <View style={styles.formField}>
//             <Text style={[styles.formLabel, { fontSize: isMobile ? 10 : 14 }]}>ZIP code:</Text>
//             <TextInput
//               style={[styles.input, errors.zip ? { borderColor: '#f44336' } : {}, { fontSize: isMobile ? 10 : 14 }]}
//               value={addressForm.zip}
//               onChangeText={(text) => setAddressForm({ ...addressForm, zip: text })}
//               placeholder="ZIP code"
//             />
//             {errors.zip && <Text style={[styles.errorText, { fontSize: isMobile ? 10 : 13 }]}>{errors.zip}</Text>}
//           </View>
//         </View>
//         <View style={[styles.formRow, isMobile && { flexDirection: 'column' }]}>
//           <View style={[styles.formField, isMobile && { marginBottom: 10 }]}>
//             <Text style={[styles.formLabel, { fontSize: isMobile ? 10 : 14 }]}>City:</Text>
//             <Picker
//               selectedValue={addressForm.city}
//               style={[styles.picker, errors.city ? { borderColor: '#f44336' } : {}, { height: isMobile ? 30 : 40 }]}
//               onValueChange={(itemValue) => setAddressForm({ ...addressForm, city: itemValue })}
//             >
//               <Picker.Item label="Select City" value="" />
//               {cities.map((city, index) => (
//                 <Picker.Item key={index} label={city} value={city} />
//               ))}
//             </Picker>
//             {errors.city && <Text style={[styles.errorText, { fontSize: isMobile ? 10 : 13 }]}>{errors.city}</Text>}
//           </View>
//           <View style={styles.formField}>
//             <Text style={[styles.formLabel, { fontSize: isMobile ? 10 : 14 }]}>Country:</Text>
//             <TextInput
//               style={[styles.input, errors.country ? { borderColor: '#f44336' } : {}, { fontSize: isMobile ? 10 : 14 }]}
//               value={addressForm.country}
//               onChangeText={(text) => setAddressForm({ ...addressForm, country: text })}
//               placeholder="Country"
//             />
//             {errors.country && <Text style={[styles.errorText, { fontSize: isMobile ? 10 : 13 }]}>{errors.country}</Text>}
//           </View>
//         </View>
//         <View style={styles.buttonRow}>
//           <TouchableOpacity
//             style={[styles.button, { backgroundColor: '#4caf50', paddingVertical: isMobile ? 6 : 8, paddingHorizontal: isMobile ? 15 : 20 }]}
//             onPress={() => handleSave('Address')}
//           >
//             <Text style={[styles.buttonText, { fontSize: isMobile ? 10 : 14 }]}>Save</Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={[styles.button, { backgroundColor: '#f44336', paddingVertical: isMobile ? 6 : 8, paddingHorizontal: isMobile ? 15 : 20 }]}
//             onPress={handleCancel}
//           >
//             <Text style={[styles.buttonText, { fontSize: isMobile ? 10 : 14 }]}>Cancel</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     );
//   };

//   const renderProfileTable = () => (
//     <View style={[styles.tableContainer, { width: isMobile ? '100%' : '65%' }]}>
//       <Text style={[styles.heading, { fontSize: isMobile ? 16 : 18 }]}>
//         Student's Profile
//       </Text>
//       <ScrollView horizontal style={styles.tableWrapper}>
//         <View>
//           <View style={[styles.tableRow, styles.tableHeader, { backgroundColor: isMobile ? '#e0e0e0' : '#e0e0e0' }]}>
//             <Text style={[styles.tableCell, { minWidth: isMobile ? 150 : 180, fontSize: isMobile ? 10 : 14, color: isMobile ? '#333' : "black" }]}>
//               Field
//             </Text>
//             <Text style={[styles.tableCell, { minWidth: isMobile ? 300 : 520, fontSize: isMobile ? 10 : 14, color: isMobile ? '#333' : "black" }]}>
//               Value
//             </Text>
//             <Text style={[styles.tableCell, { minWidth: isMobile ? 120 : 100, fontSize: isMobile ? 10 : 14, color: isMobile ? '#333' : "black" }]}>
//               Action
//             </Text>
//           </View>
//           {Object.entries(profile).map(([field, value], index) => (
//             <View key={index} style={styles.tableRow}>
//               <Text
//                 style={[styles.tableCell, { minWidth: isMobile ? 150 : 180, fontSize: isMobile ? 10 : 14 }]}
//                 accessible={true}
//                 accessibilityLabel={`Field ${field}`}
//               >
//                 {field.replace(/([A-Z])/g, ' $1')}
//               </Text>
//               <View
//                 style={[styles.tableCell, { minWidth: isMobile ? 300 : 520 }]}
//                 accessible={true}
//                 accessibilityLabel={`Value ${value}`}
//               >
//                 {editingField === field ? (
//                   field === 'Address' ? (
//                     renderAddressForm()
//                   ) : (
//                     <View>
//                       <TextInput
//                         style={[styles.input, errors[field] ? { borderColor: '#f44336' } : {}, { fontSize: isMobile ? 10 : 14 }]}
//                         value={tempValue}
//                         onChangeText={setTempValue}
//                         placeholder={`Enter ${field}`}
//                         autoFocus
//                       />
//                       {errors[field] && <Text style={[styles.errorText, { fontSize: isMobile ? 10 : 13 }]}>{errors[field]}</Text>}
//                     </View>
//                   )
//                 ) : (
//                   <Text style={{ fontSize: isMobile ? 10 : 14, textAlign: 'center', flexWrap: isMobile ? 'wrap' : 'nowrap', overflow: isMobile ? 'hidden' : 'visible' }}>
//                     {value}
//                   </Text>
//                 )}
//               </View>
//               <View
//                 style={[
//                   styles.tableCell,
//                   { minWidth: isMobile ? 120 : 100, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' },
//                 ]}
//                 accessible={true}
//                 accessibilityLabel={editingField === field ? `Save or Cancel ${field}` : `Edit ${field}`}
//               >
//                 {['Name', 'RollNumber', 'FatherName', 'Cnic', 'Batch', 'Program'].includes(field) ? (
//                   <Icon
//                     name="pencil"
//                     size={isMobile ? 16 : 20}
//                     color="#b0b0b0"
//                   />
//                 ) : (
//                   <>
//                     <TouchableOpacity
//                       onPress={() => (editingField === field ? handleSave(field) : handleEdit(field))}
//                     >
//                       <Icon
//                         name={editingField === field && field !== 'Address' ? 'check-circle' : 'pencil'}
//                         size={isMobile ? 16 : 20}
//                         color={editingField === field && field !== 'Address' ? '#4caf50' : '#3f51b5'}
//                       />
//                     </TouchableOpacity>
//                     {editingField === field && field !== 'Address' && (
//                       <TouchableOpacity
//                         onPress={handleCancel}
//                         style={{ marginLeft: 10 }}
//                       >
//                         <Icon
//                           name="cancel"
//                           size={isMobile ? 16 : 20}
//                           color="#f44336"
//                         />
//                       </TouchableOpacity>
//                     )}
//                   </>
//                 )}
//               </View>
//             </View>
//           ))}
//         </View>
//       </ScrollView>
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       {isMobile ? (
//         <ScrollView
//           contentContainerStyle={[styles.scrollArea, { paddingHorizontal: 15, paddingBottom: 50 }]}
//         >
//           {renderHeader()}
//           {renderProfileTable()}
//         </ScrollView>
//       ) : (
//         <>
//           {renderHeader()}
//           <ScrollView contentContainerStyle={[styles.scrollArea, { paddingBottom: 30 }]}>
//             {renderProfileTable()}
//           </ScrollView>
//         </>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     backgroundColor: '#0f2a47',
//     flex: 1,
//   },
//   topBar: {
//     paddingVertical: 4,
//     alignItems: 'center',
//     backgroundColor: '#009688',
//   },
//   welcomeText: {
//     color: '#fff',
//     fontWeight: 'bold',
//   },
//   header: {
//     backgroundColor: '#0f2a47',
//     paddingVertical: 12,
//     paddingHorizontal: 6,
//   },
//   logoContainer: {
//     width: '22%',
//     alignItems: 'center',
//     flexDirection: 'row',
//   },
//   logo: {
//     marginBottom: 8,
//     marginLeft: 10,
//   },
//   uniName: {
//     color: 'white',
//     fontWeight: 'bold',
//     textAlign: 'left',
//     marginLeft: 10,
//   },
//   menuGrid: {
//     width: '55%',
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'center',
//   },
//   scrollArea: {
//     alignItems: 'center',
//   },
//   contentRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'flex-start',
//   },
//   menuItem: {
//     backgroundColor: '#fff',
//     borderRadius: 6,
//     alignItems: 'center',
//     justifyContent: 'flex-start',
//     margin: 6,
//     paddingTop: 5,
//   },
//   menuLabel: {
//     marginTop: 2,
//     textAlign: 'center',
//     color: '#333',
//     fontWeight: '500',
//   },
//   rightSection: {
//     width: '20%',
//     alignItems: 'center',
//   },
//   i2: {
//     width: 70,
//     height: 70,
//     borderRadius: 2,
//     resizeMode: 'cover',
//   },
//   tableContainer: {
//     backgroundColor: '#fff',
//     padding: 5,
//     borderRadius: 10,
//     elevation: 4,
//     marginTop: 10,
//     alignSelf: 'center',
//     marginBottom: 20,
//     maxWidth: 950,
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
//   },
//   tableRow: {
//     flexDirection: 'row',
//     borderWidth: 1,
//     borderColor: "black",
//   },
//   tableHeader: {
//     borderWidth: 1,
//     borderColor: "black",
//   },
//   tableCell: {
//     padding: 4,
//     borderRightWidth: 1,
//     borderColor: "black",
//     textAlign: 'center',
//   },
//   input: {
//     borderBottomWidth: 1,
//     borderColor: '#009688',
//     paddingVertical: 2,
//     textAlign: 'center',
//     color: '#333',
//   },
//   picker: {
//     borderBottomWidth: 1,
//     borderColor: '#009688',
//     color: '#333',
//   },
//   addressForm: {
//     padding: 10,
//   },
//   formRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 10,
//   },
//   formField: {
//     flex: 1,
//     marginHorizontal: 5,
//   },
//   formLabel: {
//     marginBottom: 5,
//     color: '#333',
//   },
//   buttonRow: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     marginTop: 10,
//   },
//   button: {
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
//     marginTop: 2,
//   },
// });

// export default Profile;

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Picker,
  useWindowDimensions,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const logo = require('../../assets/images/logo.png');
const i2 = require('../../assets/images/i2.jpg');

// Image assets for menu items and actions
const menuImages = {
 home: require('../../assets/images/home.png'),
  book: require('../../assets/images/book-open.png'),
  money: require('../../assets/images/money.png'),
  description: require('../../assets/images/file-document.png'),
  person: require('../../assets/images/profile.png'),
  settings: require('../../assets/images/settings.png'),
  logout: require('../../assets/images/logout.png'),
  pencil: require('../../assets/images/pencil.png'),
  'check-circle': require('../../assets/images/check-circle.png'),
  cancel: require('../../assets/images/cancel.png'),
};

const menuItems = [
  { label: 'Dashboard', icon: 'home', color: '#3f51b5', navigateTo: 'StudentPortal' },
  { label: 'Course\nRegistration', icon: 'book', color: '#4caf50', navigateTo: 'CourseRegistration' },
  { label: 'Fees', icon: 'money', color: '#ff9800', navigateTo: 'Fees' },
  { label: 'Result Card', icon: 'description', color: '#9c27b0', navigateTo: 'ResultCard' },
  { label: 'Profile', icon: 'person', color: '#03a9f4', navigateTo: 'profile' },
  { label: 'APS', icon: 'settings', color: '#607d8b', navigateTo: 'APS' },
  { label: 'Logout', icon: 'logout', color: '#795548', navigateTo: 'StudentLogin' },
];

const initialProfile = {
  Name: 'Aleena Khan',
  FatherName: 'Masood Ahmed',
  Cnic: '35201-1234567-8',
  RollNumber: 'FUI/FA24-BDS-011/ISB',
  Email: 'aleena.khan@example.com',
  Phone: '03011234567',
  Program: 'Bachelor of Dental Surgery',
  Batch: 'Fall 2024',
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

const Profile = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

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

  const renderHeader = () => (
    <>
      <View style={[styles.topBar, { height: isMobile ? 20 : 25 }]}>
        <Text style={[styles.welcomeText, { fontSize: isMobile ? 12 : 14 }]}>
          Welcome: {profile.RollNumber}
        </Text>
      </View>

      <View style={styles.header}>
        <View style={[styles.contentRow, isMobile && { flexDirection: 'column', alignItems: 'center' }]}>
          <View style={[styles.logoContainer, isMobile && { width: '100%', marginBottom: 10 }]}>
            <Image
              source={logo}
              style={[styles.logo, { width: isMobile ? 50 : 65, height: isMobile ? 50 : 65 }]}
            />
            <Text style={[styles.uniName, { fontSize: isMobile ? 13 : 15 }]}>
              FOUNDATION UNIVERSITY{'\n'}ISLAMABAD
            </Text>
          </View>

          <View style={[styles.menuGrid, isMobile && { width: '100%', justifyContent: 'center' }]}>
            {menuItems.map((item, index) => {
              const isActive = item.navigateTo === route.name;
              const isCurrent = item.label === 'Profile';

              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.menuItem,
                    { width: isMobile ? 70 : 80, height: isMobile ? 50 : 58 },
                    (isCurrent || isActive) && { backgroundColor: '#3f51b5' },
                  ]}
                  onPress={() => {
                    if (item.navigateTo && item.navigateTo !== route.name) {
                      navigation.navigate(item.navigateTo);
                    }
                  }}
                >
                  <Image
                    source={menuImages[item.icon]}
                    style={{
                      width: isMobile ? 20 : 25,
                      height: isMobile ? 20 : 25,
                      tintColor: (isCurrent || isActive) ? '#fff' : item.color,
                    }}
                  />
                  <Text
                    style={[
                      styles.menuLabel,
                      { fontSize: isMobile ? 8 : 10 },
                      (isCurrent || isActive) && { color: '#fff' },
                    ]}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {!isMobile && (
            <View style={styles.rightSection}>
              <Image source={i2} style={styles.i2} />
            </View>
          )}
        </View>
      </View>
    </>
  );

  const renderAddressForm = () => {
    const cities = cityOptions[addressForm.province] || [];
    return (
      <View style={[styles.addressForm, isMobile && { padding: 5 }]}>
        <View style={[styles.formRow, isMobile && { flexDirection: 'column' }]}>
          <View style={[styles.formField, isMobile && { marginBottom: 10 }]}>
            <Text style={[styles.formLabel, { fontSize: isMobile ? 10 : 14 }]}>Street:</Text>
            <TextInput
              style={[styles.input, errors.street ? { borderColor: '#f44336' } : {}, { fontSize: isMobile ? 10 : 14 }]}
              value={addressForm.street}
              onChangeText={(text) => setAddressForm({ ...addressForm, street: text })}
              placeholder="Street"
            />
            {errors.street && <Text style={[styles.errorText, { fontSize: isMobile ? 10 : 13 }]}>{errors.street}</Text>}
          </View>
          <View style={styles.formField}>
            <Text style={[styles.formLabel, { fontSize: isMobile ? 10 : 14 }]}>House number:</Text>
            <TextInput
              style={[styles.input, errors.houseNumber ? { borderColor: '#f44336' } : {}, { fontSize: isMobile ? 10 : 14 }]}
              value={addressForm.houseNumber}
              onChangeText={(text) => setAddressForm({ ...addressForm, houseNumber: text })}
              placeholder="House number"
            />
            {errors.houseNumber && <Text style={[styles.errorText, { fontSize: isMobile ? 10 : 13 }]}>{errors.houseNumber}</Text>}
          </View>
        </View>
        <View style={[styles.formRow, isMobile && { flexDirection: 'column' }]}>
          <View style={[styles.formField, isMobile && { marginBottom: 10 }]}>
            <Text style={[styles.formLabel, { fontSize: isMobile ? 10 : 14 }]}>Area:</Text>
            <TextInput
              style={[styles.input, errors.area ? { borderColor: '#f44336' } : {}, { fontSize: isMobile ? 10 : 14 }]}
              value={addressForm.area}
              onChangeText={(text) => setAddressForm({ ...addressForm, area: text })}
              placeholder="Area"
            />
            {errors.area && <Text style={[styles.errorText, { fontSize: isMobile ? 10 : 13 }]}>{errors.area}</Text>}
          </View>
        </View>
        <View style={[styles.formRow, isMobile && { flexDirection: 'column' }]}>
          <View style={[styles.formField, isMobile && { marginBottom: 10 }]}>
            <Text style={[styles.formLabel, { fontSize: isMobile ? 10 : 14 }]}>Province:</Text>
            <Picker
              selectedValue={addressForm.province}
              style={[styles.picker, errors.province ? { borderColor: '#f44336' } : {}, { height: isMobile ? 30 : 40 }]}
              onValueChange={(itemValue) => setAddressForm({ ...addressForm, province: itemValue, city: '' })}
            >
              <Picker.Item label="Select Province" value="" />
              {provinces.map((province, index) => (
                <Picker.Item key={index} label={province} value={province} />
              ))}
            </Picker>
            {errors.province && <Text style={[styles.errorText, { fontSize: isMobile ? 10 : 13 }]}>{errors.province}</Text>}
          </View>
          <View style={styles.formField}>
            <Text style={[styles.formLabel, { fontSize: isMobile ? 10 : 14 }]}>ZIP code:</Text>
            <TextInput
              style={[styles.input, errors.zip ? { borderColor: '#f44336' } : {}, { fontSize: isMobile ? 10 : 14 }]}
              value={addressForm.zip}
              onChangeText={(text) => setAddressForm({ ...addressForm, zip: text })}
              placeholder="ZIP code"
            />
            {errors.zip && <Text style={[styles.errorText, { fontSize: isMobile ? 10 : 13 }]}>{errors.zip}</Text>}
          </View>
        </View>
        <View style={[styles.formRow, isMobile && { flexDirection: 'column' }]}>
          <View style={[styles.formField, isMobile && { marginBottom: 10 }]}>
            <Text style={[styles.formLabel, { fontSize: isMobile ? 10 : 14 }]}>City:</Text>
            <Picker
              selectedValue={addressForm.city}
              style={[styles.picker, errors.city ? { borderColor: '#f44336' } : {}, { height: isMobile ? 30 : 40 }]}
              onValueChange={(itemValue) => setAddressForm({ ...addressForm, city: itemValue })}
            >
              <Picker.Item label="Select City" value="" />
              {cities.map((city, index) => (
                <Picker.Item key={index} label={city} value={city} />
              ))}
            </Picker>
            {errors.city && <Text style={[styles.errorText, { fontSize: isMobile ? 10 : 13 }]}>{errors.city}</Text>}
          </View>
          <View style={styles.formField}>
            <Text style={[styles.formLabel, { fontSize: isMobile ? 10 : 14 }]}>Country:</Text>
            <TextInput
              style={[styles.input, errors.country ? { borderColor: '#f44336' } : {}, { fontSize: isMobile ? 10 : 14 }]}
              value={addressForm.country}
              onChangeText={(text) => setAddressForm({ ...addressForm, country: text })}
              placeholder="Country"
            />
            {errors.country && <Text style={[styles.errorText, { fontSize: isMobile ? 10 : 13 }]}>{errors.country}</Text>}
          </View>
        </View>
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: '#4caf50', paddingVertical: isMobile ? 6 : 8, paddingHorizontal: isMobile ? 15 : 20 }]}
            onPress={() => handleSave('Address')}
          >
            <Text style={[styles.buttonText, { fontSize: isMobile ? 10 : 14 }]}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: '#f44336', paddingVertical: isMobile ? 6 : 8, paddingHorizontal: isMobile ? 15 : 20 }]}
            onPress={handleCancel}
          >
            <Text style={[styles.buttonText, { fontSize: isMobile ? 10 : 14 }]}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderProfileTable = () => (
    <View style={[styles.tableContainer, { width: isMobile ? '100%' : '65%' }]}>
      <Text style={[styles.heading, { fontSize: isMobile ? 16 : 18 }]}>
        Student's Profile
      </Text>
      <ScrollView horizontal style={styles.tableWrapper}>
        <View>
          <View style={[styles.tableRow, styles.tableHeader, { backgroundColor: isMobile ? '#e0e0e0' : '#e0e0e0' }]}>
            <Text style={[styles.tableCell, { minWidth: isMobile ? 150 : 180, fontSize: isMobile ? 10 : 14, color: isMobile ? '#333' : "black" }]}>
              Field
            </Text>
            <Text style={[styles.tableCell, { minWidth: isMobile ? 300 : 520, fontSize: isMobile ? 10 : 14, color: isMobile ? '#333' : "black" }]}>
              Value
            </Text>
            <Text style={[styles.tableCell, { minWidth: isMobile ? 120 : 100, fontSize: isMobile ? 10 : 14, color: isMobile ? '#333' : "black" }]}>
              Action
            </Text>
          </View>
          {Object.entries(profile).map(([field, value], index) => (
            <View key={index} style={styles.tableRow}>
              <Text
                style={[styles.tableCell, { minWidth: isMobile ? 150 : 180, fontSize: isMobile ? 10 : 14 }]}
                accessible={true}
                accessibilityLabel={`Field ${field}`}
              >
                {field.replace(/([A-Z])/g, ' $1')}
              </Text>
              <View
                style={[styles.tableCell, { minWidth: isMobile ? 300 : 520 }]}
                accessible={true}
                accessibilityLabel={`Value ${value}`}
              >
                {editingField === field ? (
                  field === 'Address' ? (
                    renderAddressForm()
                  ) : (
                    <View>
                      <TextInput
                        style={[styles.input, errors[field] ? { borderColor: '#f44336' } : {}, { fontSize: isMobile ? 10 : 14 }]}
                        value={tempValue}
                        onChangeText={setTempValue}
                        placeholder={`Enter ${field}`}
                        autoFocus
                      />
                      {errors[field] && <Text style={[styles.errorText, { fontSize: isMobile ? 10 : 13 }]}>{errors[field]}</Text>}
                    </View>
                  )
                ) : (
                  <Text style={{ fontSize: isMobile ? 10 : 14, textAlign: 'center', flexWrap: isMobile ? 'wrap' : 'nowrap', overflow: isMobile ? 'hidden' : 'visible' }}>
                    {value}
                  </Text>
                )}
              </View>
              <View
                style={[
                  styles.tableCell,
                  { minWidth: isMobile ? 120 : 100, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' },
                ]}
                accessible={true}
                accessibilityLabel={editingField === field ? `Save or Cancel ${field}` : `Edit ${field}`}
              >
                {['Name', 'RollNumber', 'FatherName', 'Cnic', 'Batch', 'Program'].includes(field) ? (
                  <Image
                    source={menuImages.pencil}
                    style={{
                      width: isMobile ? 16 : 20,
                      height: isMobile ? 16 : 20,
                      tintColor: '#b0b0b0',
                    }}
                  />
                ) : (
                  <>
                    <TouchableOpacity
                      onPress={() => (editingField === field ? handleSave(field) : handleEdit(field))}
                    >
                      <Image
                        source={menuImages[editingField === field && field !== 'Address' ? 'check-circle' : 'pencil']}
                        style={{
                          width: isMobile ? 16 : 20,
                          height: isMobile ? 16 : 20,
                          tintColor: editingField === field && field !== 'Address' ? '#4caf50' : '#3f51b5',
                        }}
                      />
                    </TouchableOpacity>
                    {editingField === field && field !== 'Address' && (
                      <TouchableOpacity
                        onPress={handleCancel}
                        style={{ marginLeft: 10 }}
                      >
                        <Image
                          source={menuImages.cancel}
                          style={{
                            width: isMobile ? 16 : 20,
                            height: isMobile ? 16 : 20,
                            tintColor: '#f44336',
                          }}
                        />
                      </TouchableOpacity>
                    )}
                  </>
                )}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );

  return (
    <View style={styles.container}>
      {isMobile ? (
        <ScrollView
          contentContainerStyle={[styles.scrollArea, { paddingHorizontal: 15, paddingBottom: 50 }]}
        >
          {renderHeader()}
          {renderProfileTable()}
        </ScrollView>
      ) : (
        <>
          {renderHeader()}
          <ScrollView contentContainerStyle={[styles.scrollArea, { paddingBottom: 30 }]}>
            {renderProfileTable()}
          </ScrollView>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0f2a47',
    flex: 1,
  },
  topBar: {
    paddingVertical: 4,
    alignItems: 'center',
    backgroundColor: '#009688',
     width:"100%"
  },
  welcomeText: {
    color: '#fff',
    fontWeight: 'bold',
    
  },
  header: {
    backgroundColor: '#0f2a47',
    paddingVertical: 12,
    paddingHorizontal: 6,
  },
  logoContainer: {
    width: '22%',
    alignItems: 'center',
    flexDirection: 'row',
  },
  logo: {
    height: 65,
    width: 65,
    marginLeft: 10,
  },
  uniName: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'left',
    marginLeft: 10,
  },
  menuGrid: {
    width: '55%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  scrollArea: {
    alignItems: 'center',
  },
  contentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  menuItem: {
    backgroundColor: '#fff',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'flex-start',
    margin: 6,
    paddingTop: 5,
  },
  menuLabel: {
    marginTop: 2,
    textAlign: 'center',
    color: '#333',
    fontWeight: '500',
  },
  rightSection: {
    width: '20%',
    alignItems: 'center',
  },
  i2: {
    width: 70,
    height: 70,
    borderRadius: 2,
    resizeMode: 'cover',
  },
  tableContainer: {
    backgroundColor: '#fff',
    padding: 5,
    borderRadius: 10,
    elevation: 4,
    marginTop: 10,
    alignSelf: 'center',
    marginBottom: 20,
    maxWidth: 950,
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
  tableWrapper: {
    width: '100%',
  },
  tableRow: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: "black",
  },
  tableHeader: {
    borderWidth: 1,
    borderColor: "black",
  },
  tableCell: {
    padding: 4,
    borderRightWidth: 1,
    borderColor: "black",
    textAlign: 'center',
  },
  input: {
    borderBottomWidth: 1,
    borderColor: '#009688',
    paddingVertical: 2,
    textAlign: 'center',
    color: '#333',
  },
  picker: {
    borderBottomWidth: 1,
    borderColor: '#009688',
    color: '#333',
  },
  addressForm: {
    padding: 10,
  },
  formRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  formField: {
    flex: 1,
    marginHorizontal: 5,
  },
  formLabel: {
    marginBottom: 5,
    color: '#333',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  button: {
    borderRadius: 5,
    marginHorizontal: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  errorText: {
    color: '#f44336',
    marginTop: 2,
  },
});

export default Profile;