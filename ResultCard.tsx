
// import React from 'react';
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
// import { useNavigation } from '@react-navigation/native';

// const menuItems = [
//   { label: 'Dashboard', icon: 'home', color: '#3f51b5', navigateTo: 'StudentPortal' },
//   { label: 'Course\nRegistration', icon: 'book-open', color: '#4caf50', navigateTo: 'CourseRegistration' },
//   { label: 'Fees', icon: 'cash-multiple', color: '#ff9800', navigateTo: 'Fees' },
//   { label: 'Result Card', icon: 'file-document', color: '#9c27b0', navigateTo: 'ResultCard' },
//   { label: 'Profile', icon: 'account', color: '#03a9f4', navigateTo: 'profile' },
//   { label: 'APS', icon: 'cog-outline', color: '#607d8b', navigateTo: 'APS' },
//   { label: 'Logout', icon: 'logout', color: '#795548', navigateTo: 'StudentLogin' },
// ];

// const ResultCard = () => {
//   const navigation = useNavigation();
//   const { width } = useWindowDimensions();
//   const isMobile = width < 768;

//   const resultData = [
//     ['CSC101', 'Applications of ICT', 3, 87, 'A', 4],
//     ['CSC102', 'Discrete Structures', 3, 86, 'A', 4],
//     ['HUM104', 'Functional English', 3, 85, 'A', 4],
//     ['HUM112', 'Islamic Studies', 2, 92, 'A', 4],
//     ['HUM208', 'Civics & Community', 2, 95, 'A', 4],
//   ];

//   const renderHeader = () => (
//     <>
//       <View style={[styles.topBar, { height: isMobile ? 20 : 25 }]}>
//         <Text style={[styles.welcomeText, { fontSize: isMobile ? 12 : 14 }]}>
//           Welcome: FUI/FA24-BDS-011/ISB
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
//             {menuItems.map((item, index) => (
//               <TouchableOpacity
//                 key={index}
//                 style={[
//                   styles.menuItem,
//                   { width: isMobile ? 70 : 80, height: isMobile ? 50 : 58 },
//                   item.label === 'Result Card' && { backgroundColor: '#3f51b5' },
//                 ]}
//                 onPress={() => item.navigateTo && navigation.navigate(item.navigateTo)}
//               >
//                 <Icon
//                   name={item.icon}
//                   size={isMobile ? 20 : 25}
//                   color={item.label === 'Result Card' ? '#fff' : item.color}
//                 />
//                 <Text
//                   style={[
//                     styles.menuLabel,
//                     { fontSize: isMobile ? 8 : 10 },
//                     item.label === 'Result Card' && { color: '#fff' },
//                   ]}
//                 >
//                   {item.label}
//                 </Text>
//               </TouchableOpacity>
//             ))}
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
//           <ScrollView horizontal style={[styles.resultContainer, { width: '100%' }]}>
//             <View>
//               <Text style={[styles.heading, { fontSize: 16 }]}>
//                 Student Result Card
//               </Text>

//               <View style={[styles.infoRow, { flexDirection: 'column' }]}>
//                 <View style={styles.infoColumn}>
//                   <Text style={[styles.infoText, { fontSize: 12 }]}>
                    
//                     <Text style={styles.bold}>Reg. No:</Text> FUI/FA24-BDS-011/ISB
//                   </Text>
//                   <Text style={[styles.infoText, { fontSize: 12 }]}>
//                     <Text style={styles.bold}>Semester:</Text> Fall 2024
//                   </Text>
//                 </View>
//                 <View style={styles.infoColumn}>
//                   <Text style={[styles.infoText, { fontSize: 12 }]}>
//                     <Text style={styles.bold}>Name:</Text> AIRAJ FATIMA ZAIDI
//                   </Text>
//                   <Text style={[styles.infoText, { fontSize: 12 }]}>
//                     <Text style={styles.bold}>Father Name:</Text> SYED YAWAR ABBAS ZAIDI
//                   </Text>
//                 </View>
//               </View>
//               <Text style={[styles.infoText, { fontSize: 12 }]}>
//                 <Text style={styles.bold}>Program:</Text> BDS (Bachelor of Science in Data Science)
//               </Text>

//               <Text style={[styles.subheading, { fontSize: 14 }]}>Result Details</Text>
//               <View style={[styles.tableHeaderRow, { backgroundColor: '#e0e0e0' }]}>
//                 <Text style={[styles.tableHeaderText, { width: 60, fontSize: 10, color: '#333' }]}>Course No</Text>
//                 <Text style={[styles.tableHeaderText, { width: 120, fontSize: 10, color: '#333' }]}>Course Title</Text>
//                 <Text style={[styles.tableHeaderText, { width: 50, fontSize: 10, color: '#333' }]}>Credits</Text>
//                 <Text style={[styles.tableHeaderText, { width: 50, fontSize: 10, color: '#333' }]}>Marks</Text>
//                 <Text style={[styles.tableHeaderText, { width: 50, fontSize: 10, color: '#333' }]}>L.G.</Text>
//                 <Text style={[styles.tableHeaderText, { width: 50, fontSize: 10, color: '#333' }]}>G.P.</Text>
//               </View>

//               {resultData.map((row, index) => (
//                 <View key={index} style={styles.courseRow}>
//                   <Text style={[styles.courseText, { width: 60, fontSize: 10 }]}>{row[0]}</Text>
//                   <Text style={[styles.courseText, { width: 120, fontSize: 10, flexWrap: 'wrap', overflow: 'hidden' }]}>{row[1]}</Text>
//                   <Text style={[styles.courseText, { width: 50, fontSize: 10 }]}>{row[2]}</Text>
//                   <Text style={[styles.courseText, { width: 50, fontSize: 10 }]}>{row[3]}</Text>
//                   <Text style={[styles.courseText, { width: 50, fontSize: 10 }]}>{row[4]}</Text>
//                   <Text style={[styles.courseText, { width: 50, fontSize: 10 }]}>{row[5]}</Text>
//                 </View>
//               ))}

//               <Text style={[styles.infoText, { marginTop: 10, fontSize: 12 }]}>
//                 <Text style={styles.bold}>CGPA:</Text> 4.00
//               </Text>
//               <Text style={[styles.infoText, { fontSize: 12 }]}>
//                 <Text style={styles.bold}>Scholastic Status:</Text> GAS
//               </Text>
//             </View>
//           </ScrollView>
//         </ScrollView>
//       ) : (
//         <>
//           {renderHeader()}
//           <ScrollView contentContainerStyle={[styles.scrollArea, { paddingBottom: 30 }]}>
//             <ScrollView horizontal>
//               <View style={[styles.resultContainer, { width: 950 }]}>
//                 <Text style={[styles.heading, { fontSize: 18 }]}>
//                   Student Result Card
//                 </Text>

//                 <View style={[styles.infoRow, { flexDirection: 'row' }]}>
//                   <View style={styles.infoColumn}>
//                     <Text style={[styles.infoText, { fontSize: 14 }]}>
//                       <Text style={styles.bold}>Reg. No:</Text> FUI/FA24-BDS-011/ISB
//                     </Text>
//                     <Text style={[styles.infoText, { fontSize: 14 }]}>
//                       <Text style={styles.bold}>Semester:</Text> Fall 2024
//                     </Text>
//                     <Text style={[styles.infoText, { fontSize: 14 }]}>
//                   <Text style={styles.bold}>Program:</Text> BDS (Bachelor of Science in Data Science)
//                 </Text>
//                   </View>
//                   <View style={styles.infoColumn}>
//                     <Text style={[styles.infoText, { fontSize: 14 }]}>
//                       <Text style={styles.bold}>Name:</Text> AIRAJ FATIMA ZAIDI
//                     </Text>
//                     <Text style={[styles.infoText, { fontSize: 14 }]}>
//                       <Text style={styles.bold}>Father Name:</Text> SYED YAWAR ABBAS ZAIDI
//                     </Text>
                    
//                   </View>
//                 </View>
                

//                 <Text style={[styles.subheading, { fontSize: 16 }]}>Result Details</Text>
//                 <View style={[styles.tableHeaderRow, { backgroundColor: '#009688' }]}>
//                   <Text style={[styles.tableHeaderText, { width: '15%', fontSize: 14, color: '#fff' }]}>Course No</Text>
//                   <Text style={[styles.tableHeaderText, { width: '40%', fontSize: 14, color: '#fff' }]}>Course Title</Text>
//                   <Text style={[styles.tableHeaderText, { width: '12%', fontSize: 14, color: '#fff' }]}>Credits</Text>
//                   <Text style={[styles.tableHeaderText, { width: '15%', fontSize: 14, color: '#fff' }]}>Marks</Text>
//                   <Text style={[styles.tableHeaderText, { width: '10%', fontSize: 14, color: '#fff' }]}>L.G.</Text>
//                   <Text style={[styles.tableHeaderText, { width: '10%', fontSize: 14, color: '#fff' }]}>G.P.</Text>
//                 </View>

//                 {resultData.map((row, index) => (
//                   <View key={index} style={styles.courseRow}>
//                     <Text style={[styles.courseText, { width: '15%', fontSize: 14 }]}>{row[0]}</Text>
//                     <Text style={[styles.courseText, { width: '40%', fontSize: 14 }]}>{row[1]}</Text>
//                     <Text style={[styles.courseText, { width: '12%', fontSize: 14 }]}>{row[2]}</Text>
//                     <Text style={[styles.courseText, { width: '15%', fontSize: 14 }]}>{row[3]}</Text>
//                     <Text style={[styles.courseText, { width: '10%', fontSize: 14 }]}>{row[4]}</Text>
//                     <Text style={[styles.courseText, { width: '10%', fontSize: 14 }]}>{row[5]}</Text>
//                   </View>
//                 ))}

//                 <Text style={[styles.infoText, { marginTop: 10, fontSize: 14 }]}>
//                   <Text style={styles.bold}>CGPA:</Text> 4.00
//                 </Text>
//                 <Text style={[styles.infoText, { fontSize: 14 }]}>
//                   <Text style={styles.bold}>Scholastic Status:</Text> GAS
//                 </Text>
//               </View>
//             </ScrollView>
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
//   subheading: {
//     fontWeight: 'bold',
//     marginBottom: 6,
//   },
//   infoRow: {
//     justifyContent: 'space-between',
//     marginBottom: 10,
//   },
//   infoColumn: {
//     flex: 1,
//     marginRight: 10,
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
//   infoText: {
//     color: '#000',
//     marginBottom: 4,
//   },
//   bold: {
//     fontWeight: 'bold',
//   },
// });

// export default ResultCard;


import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

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

const ResultCard = () => {
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  const resultData = [
    ['CSC101', 'Applications of ICT', 3, 87, 'A', 4],
    ['CSC102', 'Discrete Structures', 3, 86, 'A', 4],
    ['HUM104', 'Functional English', 3, 85, 'A', 4],
    ['HUM112', 'Islamic Studies', 2, 92, 'A', 4],
    ['HUM208', 'Civics & Community', 2, 95, 'A', 4],
  ];

  const renderHeader = () => (
    <>
      <View style={[styles.topBar, { height: isMobile ? 20 : 25 }]}>
        <Text style={[styles.welcomeText, { fontSize: isMobile ? 12 : 14 }]}>
          Welcome: FUI/FA24-BDS-011/ISB
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
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.menuItem,
                  { width: isMobile ? 70 : 80, height: isMobile ? 50 : 58 },
                  item.label === 'Result Card' && { backgroundColor: '#3f51b5' },
                ]}
                onPress={() => item.navigateTo && navigation.navigate(item.navigateTo)}
              >
                <Image
                  source={menuImages[item.icon]}
                  style={{
                    width: isMobile ? 20 : 25,
                    height: isMobile ? 20 : 25,
                    tintColor: item.label === 'Result Card' ? '#fff' : item.color,
                  }}
                />
                <Text
                  style={[
                    styles.menuLabel,
                    { fontSize: isMobile ? 8 : 10 },
                    item.label === 'Result Card' && { color: '#fff' },
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
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
          <ScrollView horizontal style={[styles.resultContainer, { width: '100%' }]}>
            <View>
              <Text style={[styles.heading, { fontSize: 16 }]}>
                Student Result Card
              </Text>

              <View style={[styles.infoRow, { flexDirection: 'column' }]}>
                <View style={styles.infoColumn}>
                  <Text style={[styles.infoText, { fontSize: 12 }]}>
                    <Text style={styles.bold}>Reg. No:</Text> FUI/FA24-BDS-011/ISB
                  </Text>
                  <Text style={[styles.infoText, { fontSize: 12 }]}>
                    <Text style={styles.bold}>Semester:</Text> Fall 2024
                  </Text>
                </View>
                <View style={styles.infoColumn}>
                  <Text style={[styles.infoText, { fontSize: 12 }]}>
                    <Text style={styles.bold}>Name:</Text> AIRAJ FATIMA ZAIDI
                  </Text>
                  <Text style={[styles.infoText, { fontSize: 12 }]}>
                    <Text style={styles.bold}>Father Name:</Text> SYED YAWAR ABBAS ZAIDI
                  </Text>
                </View>
              </View>
              <Text style={[styles.infoText, { fontSize: 12 }]}>
                <Text style={styles.bold}>Program:</Text> BDS (Bachelor of Science in Data Science)
              </Text>

              <Text style={[styles.subheading, { fontSize: 14 }]}>Result Details</Text>
              <View style={[styles.tableHeaderRow, { backgroundColor: '#e0e0e0' }]}>
                <Text style={[styles.tableHeaderText, { width: 60, fontSize: 10, color: '#333' }]}>Course No</Text>
                <Text style={[styles.tableHeaderText, { width: 120, fontSize: 10, color: '#333' }]}>Course Title</Text>
                <Text style={[styles.tableHeaderText, { width: 50, fontSize: 10, color: '#333' }]}>Credits</Text>
                <Text style={[styles.tableHeaderText, { width: 50, fontSize: 10, color: '#333' }]}>Marks</Text>
                <Text style={[styles.tableHeaderText, { width: 50, fontSize: 10, color: '#333' }]}>L.G.</Text>
                <Text style={[styles.tableHeaderText, { width: 50, fontSize: 10, color: '#333' }]}>G.P.</Text>
              </View>

              {resultData.map((row, index) => (
                <View key={index} style={styles.courseRow}>
                  <Text style={[styles.courseText, { width: 60, fontSize: 10 }]}>{row[0]}</Text>
                  <Text style={[styles.courseText, { width: 120, fontSize: 10, flexWrap: 'wrap', overflow: 'hidden' }]}>{row[1]}</Text>
                  <Text style={[styles.courseText, { width: 50, fontSize: 10 }]}>{row[2]}</Text>
                  <Text style={[styles.courseText, { width: 50, fontSize: 10 }]}>{row[3]}</Text>
                  <Text style={[styles.courseText, { width: 50, fontSize: 10 }]}>{row[4]}</Text>
                  <Text style={[styles.courseText, { width: 50, fontSize: 10 }]}>{row[5]}</Text>
                </View>
              ))}

              <Text style={[styles.infoText, { marginTop: 10, fontSize: 12 }]}>
                <Text style={styles.bold}>CGPA:</Text> 4.00
              </Text>
              <Text style={[styles.infoText, { fontSize: 12 }]}>
                <Text style={styles.bold}>Scholastic Status:</Text> GAS
              </Text>
            </View>
          </ScrollView>
        </ScrollView>
      ) : (
        <>
          {renderHeader()}
          <ScrollView contentContainerStyle={[styles.scrollArea, { paddingBottom: 30 }]}>
            <ScrollView horizontal>
              <View style={[styles.resultContainer, { width: 950 }]}>
                <Text style={[styles.heading, { fontSize: 18 }]}>
                  Student Result Card
                </Text>

                <View style={[styles.infoRow, { flexDirection: 'row' }]}>
                  <View style={styles.infoColumn}>
                    <Text style={[styles.infoText, { fontSize: 14 }]}>
                      <Text style={styles.bold}>Reg. No:</Text> FUI/FA24-BDS-011/ISB
                    </Text>
                    <Text style={[styles.infoText, { fontSize: 14 }]}>
                      <Text style={styles.bold}>Semester:</Text> Fall 2024
                    </Text>
                    <Text style={[styles.infoText, { fontSize: 14 }]}>
                      <Text style={styles.bold}>Program:</Text> BDS (Bachelor of Science in Data Science)
                    </Text>
                  </View>
                  <View style={styles.infoColumn}>
                    <Text style={[styles.infoText, { fontSize: 14 }]}>
                      <Text style={styles.bold}>Name:</Text> AIRAJ FATIMA ZAIDI
                    </Text>
                    <Text style={[styles.infoText, { fontSize: 14 }]}>
                      <Text style={styles.bold}>Father Name:</Text> SYED YAWAR ABBAS ZAIDI
                    </Text>
                  </View>
                </View>

                <Text style={[styles.subheading, { fontSize: 16 }]}>Result Details</Text>
                <View style={[styles.tableHeaderRow, { backgroundColor: '#009688' }]}>
                  <Text style={[styles.tableHeaderText, { width: '15%', fontSize: 14, color: '#fff' }]}>Course No</Text>
                  <Text style={[styles.tableHeaderText, { width: '40%', fontSize: 14, color: '#fff' }]}>Course Title</Text>
                  <Text style={[styles.tableHeaderText, { width: '12%', fontSize: 14, color: '#fff' }]}>Credits</Text>
                  <Text style={[styles.tableHeaderText, { width: '15%', fontSize: 14, color: '#fff' }]}>Marks</Text>
                  <Text style={[styles.tableHeaderText, { width: '10%', fontSize: 14, color: '#fff' }]}>L.G.</Text>
                  <Text style={[styles.tableHeaderText, { width: '10%', fontSize: 14, color: '#fff' }]}>G.P.</Text>
                </View>

                {resultData.map((row, index) => (
                  <View key={index} style={styles.courseRow}>
                    <Text style={[styles.courseText, { width: '15%', fontSize: 14 }]}>{row[0]}</Text>
                    <Text style={[styles.courseText, { width: '40%', fontSize: 14 }]}>{row[1]}</Text>
                    <Text style={[styles.courseText, { width: '12%', fontSize: 14 }]}>{row[2]}</Text>
                    <Text style={[styles.courseText, { width: '15%', fontSize: 14 }]}>{row[3]}</Text>
                    <Text style={[styles.courseText, { width: '10%', fontSize: 14 }]}>{row[4]}</Text>
                    <Text style={[styles.courseText, { width: '10%', fontSize: 14 }]}>{row[5]}</Text>
                  </View>
                ))}

                <Text style={[styles.infoText, { marginTop: 10, fontSize: 14 }]}>
                  <Text style={styles.bold}>CGPA:</Text> 4.00
                </Text>
                <Text style={[styles.infoText, { fontSize: 14 }]}>
                  <Text style={styles.bold}>Scholastic Status:</Text> GAS
                </Text>
              </View>
            </ScrollView>
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
    width:"100%"
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
    flexDirection: 'row',
  },
  logo: {
    marginBottom: 8,
    marginLeft: 10,
  },
  uniName: {
    color: 'white',
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
  scrollArea: {
    alignItems: 'center',
  },
  resultContainer: {
    backgroundColor: '#fff',
    padding: 5,
    borderRadius: 10,
    elevation: 4,
    marginTop: 10,
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
  subheading: {
    fontWeight: 'bold',
    marginBottom: 6,
  },
  infoRow: {
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  infoColumn: {
    flex: 1,
    marginRight: 10,
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
  infoText: {
    color: '#000',
    marginBottom: 4,
  },
  bold: {
    fontWeight: 'bold',
  },
});

export default ResultCard;