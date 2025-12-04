
// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   Image,
//   TouchableOpacity,
//   ScrollView,
//   useWindowDimensions,
// } from 'react-native';
// import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';

// const logo = require('../../assets/images/logo.png');
// const i2 = require('../../assets/images/i2.jpg');

// import { useNavigation, useRoute } from '@react-navigation/native';

// const menuItems = [
//   { label: 'Dashboard', icon: 'home', color: '#3f51b5', navigateTo: 'StudentPortal' },
//   { label: 'Course\nRegistration', icon: 'book-open', color: '#4caf50', navigateTo: 'CourseRegistration' },
//   { label: 'Fees', icon: 'cash-multiple', color: '#ff9800', navigateTo: 'Fees' },
//   { label: 'Result Card', icon: 'file-document', color: '#9c27b0', navigateTo: 'ResultCard' },
//   { label: 'Profile', icon: 'account', color: '#03a9f4', navigateTo: 'profile' },
//   { label: 'APS', icon: 'cog-outline', color: '#607d8b', navigateTo: 'APS' },
//   { label: 'Logout', icon: 'logout', color: '#795548', navigateTo: 'StudentLogin' },
// ];

// const CourseRegistrationScreen = () => {
//   const allCourses = [
//     { no: 'CSC101', name: 'Applications of ICT', credits: 3, teacher: 'Mr. Asif', class: 'BSCS-1A' },
//     { no: 'CSC102', name: 'Discrete Structures', credits: 3, teacher: 'Dr. Hina', class: 'BSCS-1B' },
//     { no: 'CSC103', name: 'Programming Fundamentals', credits: 4, teacher: 'Ms. Sana', class: 'BSCS-1A' },
//     { no: 'CSC210', name: 'Professional Practices', credits: 2, teacher: 'Sir Ahmed', class: 'BSCS-2A' },
//   ];

//   const navigation = useNavigation();
//   const route = useRoute();
//   const { width } = useWindowDimensions();
//   const isMobile = width < 768;

//   const [registeredCourses, setRegisteredCourses] = useState([]);

//   const registerCourse = (course) => {
//     if (!registeredCourses.find((c) => c.no === course.no)) {
//       setRegisteredCourses([...registeredCourses, course]);
//     }
//   };

//   const unregisterCourse = (courseNo) => {
//     setRegisteredCourses(registeredCourses.filter((c) => c.no !== courseNo));
//   };

//   const availableCourses = allCourses.filter(
//     (course) => !registeredCourses.some((c) => c.no === course.no)
//   );

//   const renderHeader = () => (
//     <>
//       <View style={[styles.topBar, { height: isMobile ? 20 : 25 }]}>
//         <Text style={[styles.welcomeText, { fontSize: isMobile ? 12 : 14 }]}>
//           Welcome : FUI/FA24-BDS-011/ISB
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
//               const isCurrent = item.label === 'Course\nRegistration';

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

//   return (
//     <View style={styles.container}>
//       {isMobile ? (
//         <ScrollView
//           contentContainerStyle={[styles.scrollArea, { paddingHorizontal: 15, paddingBottom: 50 }]}
//         >
//           {renderHeader()}
//           <View style={[styles.resultContainer, { width: '100%' }]}>
//             <Text style={[styles.heading, { fontSize: 16 }]}>
//               Course Registration
//             </Text>

//             <Text style={[styles.subheading, { fontSize: 14 }]}>
//               Registered Courses
//             </Text>
//             {registeredCourses.length === 0 ? (
//               <Text style={[styles.infoText, { fontSize: 12 }]}>
//                 No course registered yet.
//               </Text>
//             ) : (
//               <ScrollView horizontal style={styles.tableWrapper}>
//                 <View>
//                   <View style={[styles.tableHeaderRow, { backgroundColor: '#e0e0e0' }]}>
//                     <Text style={[styles.tableHeaderText, { width: 60, fontSize: 10, color: '#333' }]}>
//                       Course No
//                     </Text>
//                     <Text style={[styles.tableHeaderText, { width: 120, fontSize: 10, color: '#333' }]}>
//                       Course Title
//                     </Text>
//                     <Text style={[styles.tableHeaderText, { width: 50, fontSize: 10, color: '#333' }]}>
//                       Credits
//                     </Text>
//                     <Text style={[styles.tableHeaderText, { width: 100, fontSize: 10, color: '#333' }]}>
//                       Teacher
//                     </Text>
//                     <Text style={[styles.tableHeaderText, { width: 60, fontSize: 10, color: '#333' }]}>
//                       Class
//                     </Text>
//                     <Text style={[styles.tableHeaderText, { width: 80, fontSize: 10, color: '#333' }]}>
//                       Action
//                     </Text>
//                   </View>

//                   {registeredCourses.map((course, index) => (
//                     <View key={index} style={styles.courseRow}>
//                       <Text style={[styles.courseText, { width: 60, fontSize: 10 }]}>
//                         {course.no}
//                       </Text>
//                       <Text style={[styles.courseText, { width: 120, fontSize: 10, flexWrap: 'wrap', overflow: 'hidden' }]}>
//                         {course.name}
//                       </Text>
//                       <Text style={[styles.courseText, { width: 50, fontSize: 10 }]}>
//                         {course.credits}
//                       </Text>
//                       <Text style={[styles.courseText, { width: 100, fontSize: 10, flexWrap: 'wrap', overflow: 'hidden' }]}>
//                         {course.teacher}
//                       </Text>
//                       <Text style={[styles.courseText, { width: 60, fontSize: 10 }]}>
//                         {course.class}
//                       </Text>
//                       <TouchableOpacity
//                         style={[styles.unregisterButton, { width: 80 }]}
//                         onPress={() => unregisterCourse(course.no)}
//                       >
//                         <Text style={[styles.buttonText, { fontSize: 10 }]}>
//                           Unregister
//                         </Text>
//                       </TouchableOpacity>
//                     </View>
//                   ))}
//                 </View>
//               </ScrollView>
//             )}

//             <Text style={[styles.subheading, { fontSize: 14 }]}>
//               Courses Available for Registration
//             </Text>
//             {availableCourses.length === 0 ? (
//               <Text style={[styles.infoText, { fontSize: 12 }]}>
//                 All courses registered.
//               </Text>
//             ) : (
//               <ScrollView horizontal style={styles.tableWrapper}>
//                 <View>
//                   <View style={[styles.tableHeaderRow, { backgroundColor: '#e0e0e0' }]}>
//                     <Text style={[styles.tableHeaderText, { width: 60, fontSize: 10, color: '#333' }]}>
//                       Course No
//                     </Text>
//                     <Text style={[styles.tableHeaderText, { width: 120, fontSize: 10, color: '#333' }]}>
//                       Course Title
//                     </Text>
//                     <Text style={[styles.tableHeaderText, { width: 50, fontSize: 10, color: '#333' }]}>
//                       Credits
//                     </Text>
//                     <Text style={[styles.tableHeaderText, { width: 100, fontSize: 10, color: '#333' }]}>
//                       Teacher
//                     </Text>
//                     <Text style={[styles.tableHeaderText, { width: 60, fontSize: 10, color: '#333' }]}>
//                       Class
//                     </Text>
//                     <Text style={[styles.tableHeaderText, { width: 80, fontSize: 10, color: '#333' }]}>
//                       Action
//                     </Text>
//                   </View>

//                   {availableCourses.map((course, index) => (
//                     <View key={index} style={styles.courseRow}>
//                       <Text style={[styles.courseText, { width: 60, fontSize: 10 }]}>
//                         {course.no}
//                       </Text>
//                       <Text style={[styles.courseText, { width: 120, fontSize: 10, flexWrap: 'wrap', overflow: 'hidden' }]}>
//                         {course.name}
//                       </Text>
//                       <Text style={[styles.courseText, { width: 50, fontSize: 10 }]}>
//                         {course.credits}
//                       </Text>
//                       <Text style={[styles.courseText, { width: 100, fontSize: 10, flexWrap: 'wrap', overflow: 'hidden' }]}>
//                         {course.teacher}
//                       </Text>
//                       <Text style={[styles.courseText, { width: 60, fontSize: 10 }]}>
//                         {course.class}
//                       </Text>
//                       <TouchableOpacity
//                         style={[styles.registerButton, { width: 80 }]}
//                         onPress={() => registerCourse(course)}
//                       >
//                         <Text style={[styles.buttonText, { fontSize: 10 }]}>
//                           Register
//                         </Text>
//                       </TouchableOpacity>
//                     </View>
//                   ))}
//                 </View>
//               </ScrollView>
//             )}
//           </View>
//         </ScrollView>
//       ) : (
//         <>
//           {renderHeader()}
//           <ScrollView
//             contentContainerStyle={[styles.scrollArea, { paddingBottom: 30 }]}
//           >
//             <View style={[styles.resultContainer, { width: '95%' }]}>
//               <Text style={[styles.heading, { fontSize: 18 }]}>
//                 Course Registration
//               </Text>

//               <Text style={[styles.subheading, { fontSize: 16, marginTop: 10 }]}>
//                 Registered Courses
//               </Text>
//               {registeredCourses.length === 0 ? (
//                 <Text style={[styles.infoText, { fontSize: 14 }]}>
//                   No course registered yet.
//                 </Text>
//               ) : (
//                 <ScrollView horizontal={isMobile} style={styles.tableWrapper}>
//                   <View>
//                     <View style={[styles.tableHeaderRow, { backgroundColor: '#009688' }]}>
//                       <Text style={[styles.tableHeaderText, { width: '15%', fontSize: 14, color: '#fff' }]}>
//                         Course No
//                       </Text>
//                       <Text style={[styles.tableHeaderText, { width: '40%', fontSize: 14, color: '#fff' }]}>
//                         Course Title
//                       </Text>
//                       <Text style={[styles.tableHeaderText, { width: '8%', fontSize: 14, color: '#fff' }]}>
//                         Credits
//                       </Text>
//                       <Text style={[styles.tableHeaderText, { width: '18%', fontSize: 14, color: '#fff' }]}>
//                         Teacher
//                       </Text>
//                       <Text style={[styles.tableHeaderText, { width: '10%', fontSize: 14, color: '#fff' }]}>
//                         Class
//                       </Text>
//                       <Text style={[styles.tableHeaderText, { width: '9%', fontSize: 14, color: '#fff' }]}>
//                         Action
//                       </Text>
//                     </View>

//                     {registeredCourses.map((course, index) => (
//                       <View key={index} style={styles.courseRow}>
//                         <Text style={[styles.courseText, { width: '15%', fontSize: 14 }]}>
//                           {course.no}
//                         </Text>
//                         <Text style={[styles.courseText, { width: '40%', fontSize: 14, flexWrap: 'nowrap', overflow: 'visible' }]}>
//                           {course.name}
//                         </Text>
//                         <Text style={[styles.courseText, { width: '8%', fontSize: 14 }]}>
//                           {course.credits}
//                         </Text>
//                         <Text style={[styles.courseText, { width: '18%', fontSize: 14, flexWrap: 'nowrap', overflow: 'visible' }]}>
//                           {course.teacher}
//                         </Text>
//                         <Text style={[styles.courseText, { width: '10%', fontSize: 14 }]}>
//                           {course.class}
//                         </Text>
//                         <TouchableOpacity
//                           style={[styles.unregisterButton, { flex: 1 }]}
//                           onPress={() => unregisterCourse(course.no)}
//                         >
//                           <Text style={[styles.buttonText, { fontSize: 12 }]}>
//                             Unregister
//                           </Text>
//                         </TouchableOpacity>
//                       </View>
//                     ))}
//                   </View>
//                 </ScrollView>
//               )}

//               <Text style={[styles.subheading, { fontSize: 16, marginTop: 10 }]}>
//                 Courses Available for Registration
//               </Text>
//               {availableCourses.length === 0 ? (
//                 <Text style={[styles.infoText, { fontSize: 14 }]}>
//                   All courses registered.
//                 </Text>
//               ) : (
//                 <ScrollView horizontal={isMobile} style={styles.tableWrapper}>
//                   <View>
//                     <View style={[styles.tableHeaderRow, { backgroundColor: '#009688' }]}>
//                       <Text style={[styles.tableHeaderText, { width: '15%', fontSize: 14, color: '#fff' }]}>
//                         Course No
//                       </Text>
//                       <Text style={[styles.tableHeaderText, { width: '40%', fontSize: 14, color: '#fff' }]}>
//                         Course Title
//                       </Text>
//                       <Text style={[styles.tableHeaderText, { width: '8%', fontSize: 14, color: '#fff' }]}>
//                         Credits
//                       </Text>
//                       <Text style={[styles.tableHeaderText, { width: '18%', fontSize: 14, color: '#fff' }]}>
//                         Teacher
//                       </Text>
//                       <Text style={[styles.tableHeaderText, { width: '10%', fontSize: 14, color: '#fff' }]}>
//                         Class
//                       </Text>
//                       <Text style={[styles.tableHeaderText, { width: '9%', fontSize: 14, color: '#fff' }]}>
//                         Action
//                       </Text>
//                     </View>

//                     {availableCourses.map((course, index) => (
//                       <View key={index} style={styles.courseRow}>
//                         <Text style={[styles.courseText, { width: '15%', fontSize: 14 }]}>
//                           {course.no}
//                         </Text>
//                         <Text style={[styles.courseText, { width: '40%', fontSize: 14, flexWrap: 'nowrap', overflow: 'visible' }]}>
//                           {course.name}
//                         </Text>
//                         <Text style={[styles.courseText, { width: '8%', fontSize: 14 }]}>
//                           {course.credits}
//                         </Text>
//                         <Text style={[styles.courseText, { width: '18%', fontSize: 14, flexWrap: 'nowrap', overflow: 'visible' }]}>
//                           {course.teacher}
//                         </Text>
//                         <Text style={[styles.courseText, { width: '10%', fontSize: 14 }]}>
//                           {course.class}
//                         </Text>
//                         <TouchableOpacity
//                           style={[styles.registerButton, { flex: 0.8 }]}
//                           onPress={() => registerCourse(course)}
//                         >
//                           <Text style={[styles.buttonText, { fontSize: 12 }]}>
//                             Register
//                           </Text>
//                         </TouchableOpacity>
//                       </View>
//                     ))}
//                   </View>
//                 </ScrollView>
//               )}
//             </View>
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
//   contentRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'flex-start',
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
//   scrollArea: {
//     alignItems: 'center',
//   },
//   resultContainer: {
//     backgroundColor: '#fff',
//     padding: 5,
//     borderRadius: 10,
//     elevation: 4,
//     marginTop: 10,
//     maxWidth: 950,
//   },
//   heading: {
//     fontWeight: 'bold',
//     backgroundColor: '#009688',
//     color: '#fff',
//     textAlign: 'center',
//     paddingVertical: 8,
//     borderRadius: 4,
//     // marginBottom: 10,
//   },
//   subheading: {
//     fontWeight: 'bold',
//     marginBottom: 2,
//   },
//   tableWrapper: {
//     flex: 1,
//   },
//   tableHeaderRow: {
//     flexDirection: 'row',
//     paddingVertical: 6,
//     borderRadius: 6,
//     marginBottom: 6,
//   },
//   tableHeaderText: {
//     fontWeight: 'bold',
//     textAlign: 'center',
//     padding: 4,
//     // borderWidth: 1,
//     // borderColor: '#ccc',
//   },
//   courseRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 6,
//   },
//   courseText: {
//     textAlign: 'center',
//     borderWidth: 1,
//     borderColor: '#ccc',
//     padding: 4,
//   },
//   registerButton: {
//     backgroundColor: '#4CAF50',
//     paddingHorizontal: 10,
//     paddingVertical: 4,
//     borderRadius: 5,
//     height: 25,
//     marginLeft: 4,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   unregisterButton: {
//     backgroundColor: '#f44336',
//     paddingHorizontal: 10,
//     paddingVertical: 4,
//     borderRadius: 5,
//     height: 25,
//     marginLeft: 4,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   buttonText: {
//     textAlign: 'center',
//     color: 'white',
//   },
//   infoText: {
//     color: '#000',
//     marginBottom: 4,
//   },
// });

// export default CourseRegistrationScreen;


import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const logo = require('../../assets/images/logo.png');
const i2 = require('../../assets/images/i2.jpg');

// Image assets for menu items
const menuImages = {
  home: require('../../assets/images/home.png'),
  book: require('../../assets/images/book-open.png'),
  money: require('../../assets/images/money.png'),
  description: require('../../assets/images/file-document.png'),
  person: require('../../assets/images/profile.png'),
  settings: require('../../assets/images/settings.png'),
  logout: require('../../assets/images/logout.png'),
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

const CourseRegistrationScreen = () => {
  const allCourses = [
    { no: 'CSC101', name: 'Applications of ICT', credits: 3, teacher: 'Mr. Asif', class: 'BSCS-1A' },
    { no: 'CSC102', name: 'Discrete Structures', credits: 3, teacher: 'Dr. Hina', class: 'BSCS-1B' },
    { no: 'CSC103', name: 'Programming Fundamentals', credits: 4, teacher: 'Ms. Sana', class: 'BSCS-1A' },
    { no: 'CSC210', name: 'Professional Practices', credits: 2, teacher: 'Sir Ahmed', class: 'BSCS-2A' },
  ];

  const navigation = useNavigation();
  const route = useRoute();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  const [registeredCourses, setRegisteredCourses] = useState([]);

  const registerCourse = (course) => {
    if (!registeredCourses.find((c) => c.no === course.no)) {
      setRegisteredCourses([...registeredCourses, course]);
    }
  };

  const unregisterCourse = (courseNo) => {
    setRegisteredCourses(registeredCourses.filter((c) => c.no !== courseNo));
  };

  const availableCourses = allCourses.filter(
    (course) => !registeredCourses.some((c) => c.no === course.no)
  );

  const renderHeader = () => (
    <>
      <View style={[styles.topBar, { height: isMobile ? 20 : 25 }]}>
        <Text style={[styles.welcomeText, { fontSize: isMobile ? 12 : 14 }]}>
          Welcome : FUI/FA24-BDS-011/ISB
        </Text>
      </View>

      <View style={styles.header}>
        <View style={[styles.contentRow, isMobile && { flexDirection: 'column', alignItems: 'center' }]}>
          {/* Logo + Text */}
          <View style={[styles.logoContainer, isMobile && { width: 'Heaven', marginBottom: 10 }]}>
            <Image
              source={logo}
              style={[styles.logo, { width: isMobile ? 60 : 65, height: isMobile ? 60 : 65 }]}
            />
            <Text style={[styles.uniName, { fontSize: isMobile ? 14 : 15 }]}>
              FOUNDATION UNIVERSITY{'\n'}ISLAMABAD
            </Text>
          </View>


          <View style={[styles.menuGrid, isMobile && { width: '100%', justifyContent: 'center' }]}>
            {menuItems.map((item, index) => {
              const isActive = item.navigateTo === route.name;
              const isCurrent = item.label === 'Course\nRegistration';

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

  return (
    <View style={styles.container}>
      {isMobile ? (
        <ScrollView
          contentContainerStyle={[styles.scrollArea, { paddingHorizontal: 15, paddingBottom: 50 }]}
        >
          {renderHeader()}
          <View style={[styles.resultContainer, { width: '100%' }]}>
            <Text style={[styles.heading, { fontSize: 16 }]}>
              Course Registration
            </Text>

            <Text style={[styles.subheading, { fontSize: 14 }]}>
              Registered Courses
            </Text>
            {registeredCourses.length === 0 ? (
              <Text style={[styles.infoText, { fontSize: 12 }]}>
                No course registered yet.
              </Text>
            ) : (
              <ScrollView horizontal style={styles.tableWrapper}>
                <View>
                  <View style={[styles.tableHeaderRow, { backgroundColor: '#e0e0e0' }]}>
                    <Text style={[styles.tableHeaderText, { width: 60, fontSize: 10, color: '#333' }]}>
                      Course No
                    </Text>
                    <Text style={[styles.tableHeaderText, { width: 120, fontSize: 10, color: '#333' }]}>
                      Course Title
                    </Text>
                    <Text style={[styles.tableHeaderText, { width: 50, fontSize: 10, color: '#333' }]}>
                      Credits
                    </Text>
                    <Text style={[styles.tableHeaderText, { width: 100, fontSize: 10, color: '#333' }]}>
                      Teacher
                    </Text>
                    <Text style={[styles.tableHeaderText, { width: 60, fontSize: 10, color: '#333' }]}>
                      Class
                    </Text>
                    <Text style={[styles.tableHeaderText, { width: 80, fontSize: 10, color: '#333' }]}>
                      Action
                    </Text>
                  </View>

                  {registeredCourses.map((course, index) => (
                    <View key={index} style={styles.courseRow}>
                      <Text style={[styles.courseText, { width: 60, fontSize: 10 }]}>
                        {course.no}
                      </Text>
                      <Text style={[styles.courseText, { width: 120, fontSize: 10, flexWrap: 'wrap', overflow: 'hidden' }]}>
                        {course.name}
                      </Text>
                      <Text style={[styles.courseText, { width: 50, fontSize: 10 }]}>
                        {course.credits}
                      </Text>
                      <Text style={[styles.courseText, { width: 100, fontSize: 10, flexWrap: 'wrap', overflow: 'hidden' }]}>
                        {course.teacher}
                      </Text>
                      <Text style={[styles.courseText, { width: 60, fontSize: 10 }]}>
                        {course.class}
                      </Text>
                      <TouchableOpacity
                        style={[styles.unregisterButton, { width: 80 }]}
                        onPress={() => unregisterCourse(course.no)}
                      >
                        <Text style={[styles.buttonText, { fontSize: 10 }]}>
                          Unregister
                        </Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              </ScrollView>
            )}

            <Text style={[styles.subheading, { fontSize: 14 }]}>
              Courses Available for Registration
            </Text>
            {availableCourses.length === 0 ? (
              <Text style={[styles.infoText, { fontSize: 12 }]}>
                All courses registered.
              </Text>
            ) : (
              <ScrollView horizontal style={styles.tableWrapper}>
                <View>
                  <View style={[styles.tableHeaderRow, { backgroundColor: '#e0e0e0' }]}>
                    <Text style={[styles.tableHeaderText, { width: 60, fontSize: 10, color: '#333' }]}>
                      Course No
                    </Text>
                    <Text style={[styles.tableHeaderText, { width: 120, fontSize: 10, color: '#333' }]}>
                      Course Title
                    </Text>
                    <Text style={[styles.tableHeaderText, { width: 50, fontSize: 10, color: '#333' }]}>
                      Credits
                    </Text>
                    <Text style={[styles.tableHeaderText, { width: 100, fontSize: 10, color: '#333' }]}>
                      Teacher
                    </Text>
                    <Text style={[styles.tableHeaderText, { width: 60, fontSize: 10, color: '#333' }]}>
                      Class
                    </Text>
                    <Text style={[styles.tableHeaderText, { width: 80, fontSize: 10, color: '#333' }]}>
                      Action
                    </Text>
                  </View>

                  {availableCourses.map((course, index) => (
                    <View key={index} style={styles.courseRow}>
                      <Text style={[styles.courseText, { width: 60, fontSize: 10 }]}>
                        {course.no}
                      </Text>
                      <Text style={[styles.courseText, { width: 120, fontSize: 10, flexWrap: 'wrap', overflow: 'hidden' }]}>
                        {course.name}
                      </Text>
                      <Text style={[styles.courseText, { width: 50, fontSize: 10 }]}>
                        {course.credits}
                      </Text>
                      <Text style={[styles.courseText, { width: 100, fontSize: 10, flexWrap: 'wrap', overflow: 'hidden' }]}>
                        {course.teacher}
                      </Text>
                      <Text style={[styles.courseText, { width: 60, fontSize: 10 }]}>
                        {course.class}
                      </Text>
                      <TouchableOpacity
                        style={[styles.registerButton, { width: 80 }]}
                        onPress={() => registerCourse(course)}
                      >
                        <Text style={[styles.buttonText, { fontSize: 10 }]}>
                          Register
                        </Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              </ScrollView>
            )}
          </View>
        </ScrollView>
      ) : (
        <>
          {renderHeader()}
          <ScrollView
            contentContainerStyle={[styles.scrollArea, { paddingBottom: 30 }]}
          >
            <View style={[styles.resultContainer, { width: '95%' }]}>
              <Text style={[styles.heading, { fontSize: 18 }]}>
                Course Registration
              </Text>

              <Text style={[styles.subheading, { fontSize: 16, marginTop: 10 }]}>
                Registered Courses
              </Text>
              {registeredCourses.length === 0 ? (
                <Text style={[styles.infoText, { fontSize: 14 }]}>
                  No course registered yet.
                </Text>
              ) : (
                <ScrollView horizontal={isMobile} style={styles.tableWrapper}>
                  <View>
                    <View style={[styles.tableHeaderRow, { backgroundColor: '#009688' }]}>
                      <Text style={[styles.tableHeaderText, { width: '15%', fontSize: 14, color: '#fff' }]}>
                        Course No
                      </Text>
                      <Text style={[styles.tableHeaderText, { width: '40%', fontSize: 14, color: '#fff' }]}>
                        Course Title
                      </Text>
                      <Text style={[styles.tableHeaderText, { width: '8%', fontSize: 14, color: '#fff' }]}>
                        Credits
                      </Text>
                      <Text style={[styles.tableHeaderText, { width: '18%', fontSize: 14, color: '#fff' }]}>
                        Teacher
                      </Text>
                      <Text style={[styles.tableHeaderText, { width: '10%', fontSize: 14, color: '#fff' }]}>
                        Class
                      </Text>
                      <Text style={[styles.tableHeaderText, { width: '9%', fontSize: 14, color: '#fff' }]}>
                        Action
                      </Text>
                    </View>

                    {registeredCourses.map((course, index) => (
                      <View key={index} style={styles.courseRow}>
                        <Text style={[styles.courseText, { width: '15%', fontSize: 14 }]}>
                          {course.no}
                        </Text>
                        <Text style={[styles.courseText, { width: '40%', fontSize: 14, flexWrap: 'nowrap', overflow: 'visible' }]}>
                          {course.name}
                        </Text>
                        <Text style={[styles.courseText, { width: '8%', fontSize: 14 }]}>
                          {course.credits}
                        </Text>
                        <Text style={[styles.courseText, { width: '18%', fontSize: 14, flexWrap: 'nowrap', overflow: 'visible' }]}>
                          {course.teacher}
                        </Text>
                        <Text style={[styles.courseText, { width: '10%', fontSize: 14 }]}>
                          {course.class}
                        </Text>
                        <TouchableOpacity
                          style={[styles.unregisterButton, { flex: 1 }]}
                          onPress={() => unregisterCourse(course.no)}
                        >
                          <Text style={[styles.buttonText, { fontSize: 12 }]}>
                            Unregister
                          </Text>
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                </ScrollView>
              )}

              <Text style={[styles.subheading, { fontSize: 16, marginTop: 10 }]}>
                Courses Available for Registration
              </Text>
              {availableCourses.length === 0 ? (
                <Text style={[styles.infoText, { fontSize: 14 }]}>
                  All courses registered.
                </Text>
              ) : (
                <ScrollView horizontal={isMobile} style={styles.tableWrapper}>
                  <View>
                    <View style={[styles.tableHeaderRow, { backgroundColor: '#009688' }]}>
                      <Text style={[styles.tableHeaderText, { width: '15%', fontSize: 14, color: '#fff' }]}>
                        Course No
                      </Text>
                      <Text style={[styles.tableHeaderText, { width: '40%', fontSize: 14, color: '#fff' }]}>
                        Course Title
                      </Text>
                      <Text style={[styles.tableHeaderText, { width: '8%', fontSize: 14, color: '#fff' }]}>
                        Credits
                      </Text>
                      <Text style={[styles.tableHeaderText, { width: '18%', fontSize: 14, color: '#fff' }]}>
                        Teacher
                      </Text>
                      <Text style={[styles.tableHeaderText, { width: '10%', fontSize: 14, color: '#fff' }]}>
                        Class
                      </Text>
                      <Text style={[styles.tableHeaderText, { width: '9%', fontSize: 14, color: '#fff' }]}>
                        Action
                      </Text>
                    </View>

                    {availableCourses.map((course, index) => (
                      <View key={index} style={styles.courseRow}>
                        <Text style={[styles.courseText, { width: '15%', fontSize: 14 }]}>
                          {course.no}
                        </Text>
                        <Text style={[styles.courseText, { width: '40%', fontSize: 14, flexWrap: 'nowrap', overflow: 'visible' }]}>
                          {course.name}
                        </Text>
                        <Text style={[styles.courseText, { width: '8%', fontSize: 14 }]}>
                          {course.credits}
                        </Text>
                        <Text style={[styles.courseText, { width: '18%', fontSize: 14, flexWrap: 'nowrap', overflow: 'visible' }]}>
                          {course.teacher}
                        </Text>
                        <Text style={[styles.courseText, { width: '10%', fontSize: 14 }]}>
                          {course.class}
                        </Text>
                        <TouchableOpacity
                          style={[styles.registerButton, { flex: 0.8 }]}
                          onPress={() => registerCourse(course)}
                        >
                          <Text style={[styles.buttonText, { fontSize: 12 }]}>
                            Register
                          </Text>
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                </ScrollView>
              )}
            </View>
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
  contentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  logoContainer: {
    width: '22%',
    alignItems: 'center',
    flexDirection: 'row'
  },
  logo: {
    height: 65,
    width: 65,
    marginBottom: 8,
    marginLeft:10
  },
  uniName: {
    color: 'white',
    fontSize: 13,
    fontWeight: 'bold',
    textAlign: 'left',
    marginLeft:10,
    
  },
  menuGrid: {
    width: '55%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
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
    marginTop: 1,
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
  scrollArea: {
    alignItems: 'center',
  },
  
  resultContainer: {
    backgroundColor: '#fff',
    padding: 5,
    borderRadius: 10,
    elevation: 4,
    marginTop: 10,
    maxWidth: 950,
  },
  heading: {
    fontWeight: 'bold',
    backgroundColor: '#009688',
    color: '#fff',
    textAlign: 'center',
    paddingVertical: 8,
    borderRadius: 4,
  },
  subheading: {
    fontWeight: 'bold',
    marginBottom: 2,
  },
  tableWrapper: {
    flex: 1,
  },
  tableHeaderRow: {
    flexDirection: 'row',
    paddingVertical: 6,
    borderRadius: 6,
    marginBottom: 6,
  },
  tableHeaderText: {
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 4,
  },
  courseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  courseText: {
    textAlign: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 4,
  },
  registerButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 5,
    height: 25,
    marginLeft: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unregisterButton: {
    backgroundColor: '#f44336',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 5,
    height: 25,
    marginLeft: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    textAlign: 'center',
    color: 'white',
  },
  infoText: {
    color: '#000',
    marginBottom: 4,
  },
});

export default CourseRegistrationScreen;