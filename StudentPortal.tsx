
// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   Image,
//   TouchableOpacity,
//   useWindowDimensions,
//   ScrollView,
//   Platform,
// } from 'react-native';
// import { MaterialIcons } from '@expo/vector-icons';
// import { useNavigation, useRoute } from '@react-navigation/native';

// const logo = require('../../assets/images/logo.png');
// const i2 = require('../../assets/images/i2.jpg');

// const menuItems = [
//   { label: 'Dashboard', icon: 'home', color: '#3f51b5', navigateTo: 'StudentPortal' },
//   { label: 'Course\nRegistration', icon: 'book', color: '#4caf50', navigateTo: 'CourseRegistration' },
//   { label: 'Fees', icon: 'attach-money', color: '#ff9800', navigateTo: 'Fees' },
//   { label: 'Result Card', icon: 'description', color: '#9c27b0', navigateTo: 'ResultCard' },
//   { label: 'Profile', icon: 'person', color: '#03a9f4', navigateTo: 'profile' },
//   { label: 'APS', icon: 'settings', color: '#607d8b', navigateTo: 'APS' },
//   { label: 'Logout', icon: 'exit-to-app', color: '#795548', navigateTo: 'StudentLogin' },
// ];

// // Sample course details data (replace with actual data from your backend)
// const courseDetails = {
//   '2501': {
//     lectureMaterials: [
//       { id: '1', title: 'Intro to OOP', file: 'lecture1.pdf' },
//       { id: '2', title: 'Classes & Objects', file: 'lecture2.pdf' },
//     ],
//     attendance: [
//       { date: '2025-04-25', status: 'Present' },
//       { date: '2025-04-26', status: 'Absent' },
//     ],
//     quizzes: [
//       { id: 'Q1', title: 'Quiz 1', date: 'Apr 20', score: '8/10' },
//     ],
//     assignments: [
//       { id: 'A1', title: 'Assignment 1', deadline: 'Apr 25', status: 'Submitted' },
//     ],
//     projects: [
//       { id: 'P1', title: 'OOP Project', due: 'May 10', group: 'Team Alpha' },
//     ],
//   },
//   '2502': {
//     lectureMaterials: [
//       { id: '1', title: 'Intro to DSA', file: 'lecture1.pdf' },
//       { id: '2', title: 'Classes & Objects', file: 'lecture2.pdf' },
//     ],
//     attendance: [
//       { date: '2025-04-25', status: 'Present' },
//       { date: '2025-04-26', status: 'Absent' },
//     ],
//     quizzes: [
//       { id: 'Q1', title: 'Quiz 1', date: 'Apr 20', score: '8/10' },
//     ],
//     assignments: [
//       { id: 'A1', title: 'Assignment 1', deadline: 'Apr 25', status: 'Submitted' },
//     ],
//     projects: [
//       { id: 'P1', title: 'OOP Project', due: 'May 10', group: 'Team Alpha' },
//     ],
//   },
//   '2503': {
//     lectureMaterials: [
//       { id: '1', title: 'Intro to SRE', file: 'lecture1.pdf' },
//       { id: '2', title: 'Classes & Objects', file: 'lecture2.pdf' },
//     ],
//     attendance: [
//       { date: '2025-04-25', status: 'Present' },
//       { date: '2025-04-26', status: 'Absent' },
//     ],
//     quizzes: [
//       { id: 'Q1', title: 'Quiz 1', date: 'Apr 20', score: '8/10' },
//     ],
//     assignments: [
//       { id: 'A1', title: 'Assignment 1', deadline: 'Apr 25', status: 'Submitted' },
//     ],
//     projects: [
//       { id: 'P1', title: 'OOP Project', due: 'May 10', group: 'Team Alpha' },
//     ],
//   },
//   '2504': {
//     lectureMaterials: [
//       { id: '1', title: 'Intro to SQE', file: 'lecture1.pdf' },
//       { id: '2', title: 'Classes & Objects', file: 'lecture2.pdf' },
//     ],
//     attendance: [
//       { date: '2025-04-25', status: 'Present' },
//       { date: '2025-04-26', status: 'Absent' },
//     ],
//     quizzes: [
//       { id: 'Q1', title: 'Quiz 1', date: 'Apr 20', score: '8/10' },
//     ],
//     assignments: [
//       { id: 'A1', title: 'Assignment 1', deadline: 'Apr 25', status: 'Submitted' },
//     ],
//     projects: [
//       { id: 'P1', title: 'OOP Project', due: 'May 10', group: 'Team Alpha' },
//     ],
//   },
// };

// const DashboardHeader = () => {
//   const navigation = useNavigation();
//   const route = useRoute();
//   const { width } = useWindowDimensions();
//   const isMobile = width < 768;

//   const [selectedCourse, setSelectedCourse] = useState(null);
//   const [activeTab, setActiveTab] = useState('Course Content');
//   const [hoveredRow, setHoveredRow] = useState(null);

//   const courses = [
//     { courseNo: '2501', courseName: 'OOP', credits: 3, teacher: 'Ms. Asma', class: 9, attendance: '24/25', icon: 'code' },
//     { courseNo: '2502', courseName: 'DSA', credits: 3, teacher: 'Mr. Imran', class: 10, attendance: '24/25', icon: 'developer-board' },
//     { courseNo: '2503', courseName: 'SRE', credits: 3, teacher: 'Ms. Ayesha', class: 11, attendance: '21/25', icon: 'build' },
//     { courseNo: '2504', courseName: 'SQE', credits: 3, teacher: 'Mr. Daud', class: 10, attendance: '19/25', icon: 'verified' },
//   ];

//   const renderCourseContent = () => {
//     const materials = selectedCourse ? courseDetails[selectedCourse.courseNo]?.lectureMaterials || [] : [];
//     return (
//       <View style={styles.tabContent}>
//         <ScrollView
//           horizontal={isMobile}
//           showsHorizontalScrollIndicator={false}
//           contentContainerStyle={{ paddingHorizontal: isMobile ? 8 : 0 }}
//         >
//           <ScrollView style={styles.tableWrapper} nestedScrollEnabled={true} bounces={false}>
//             <View>
//               <View style={[styles.tableRow, styles.tableHeader]}>
//                 <Text style={[styles.tableCell, { width: isMobile ? 130 : '40%', fontSize: isMobile ? 12 : 14 }]}>Title</Text>
//                 <Text style={[styles.tableCell, { width: isMobile ? 110 : '30%', fontSize: isMobile ? 12 : 14 }]}>File</Text>
//                 <Text style={[styles.tableCell, { width: isMobile ? 110 : '30%', fontSize: isMobile ? 12 : 14 }]}>Actions</Text>
//               </View>
//               {materials.length > 0 ? (
//                 materials.map((material, index) => (
//                   <View key={index} style={styles.tableRow}>
//                     <Text style={[styles.tableCell, { width: isMobile ? 130 : '40%', fontSize: isMobile ? 10 : 14 }]}>{material.title}</Text>
//                     <Text style={[styles.tableCell, { width: isMobile ? 110 : '30%', fontSize: isMobile ? 10 : 14 }]}>{material.file}</Text>
//                     <View style={[styles.tableCell, styles.materialActions, { width: isMobile ? 110 : '30%' }]}>
//                       <TouchableOpacity onPress={() => console.log(`View ${material.file}`)}>
//                         <Text style={[styles.actionLink, { fontSize: isMobile ? 8 : 14 }]}>{isMobile ? 'View' : '[View]'}</Text>
//                       </TouchableOpacity>
//                       <TouchableOpacity onPress={() => console.log(`Download ${material.file}`)}>
//                         <Text style={[styles.actionLink, { fontSize: isMobile ? 8 : 14 }]}>{isMobile ? 'Download' : '[Download]'}</Text>
//                       </TouchableOpacity>
//                     </View>
//                   </View>
//                 ))
//               ) : (
//                 <View style={styles.tableRow}>
//                   <Text style={[styles.tableCell, { width: '100%', fontSize: isMobile ? 12 : 14 }]}>No lecture materials available</Text>
//                 </View>
//               )}
//             </View>
//           </ScrollView>
//         </ScrollView>
//       </View>
//     );
//   };

//   const renderAttendance = () => {
//     const attendance = selectedCourse ? courseDetails[selectedCourse.courseNo]?.attendance || [] : [];
//     return (
//       <View style={styles.tabContent}>
//         <ScrollView
//           horizontal={isMobile}
//           showsHorizontalScrollIndicator={false}
//           contentContainerStyle={{ paddingHorizontal: isMobile ? 8 : 0 }}
//         >
//           <ScrollView style={styles.tableWrapper} nestedScrollEnabled={true} bounces={false}>
//             <View>
//               <View style={[styles.tableRow, styles.tableHeader]}>
//                 <Text style={[styles.tableCell, { width: isMobile ? 160 : '50%', fontSize: isMobile ? 12 : 14 }]}>Date</Text>
//                 <Text style={[styles.tableCell, { width: isMobile ? 160 : '50%', fontSize: isMobile ? 12 : 14 }]}>Status</Text>
//               </View>
//               {attendance.length > 0 ? (
//                 attendance.map((record, index) => (
//                   <View key={index} style={styles.tableRow}>
//                     <Text style={[styles.tableCell, { width: isMobile ? 160 : '50%', fontSize: isMobile ? 10 : 14 }]}>{record.date}</Text>
//                     <Text style={[styles.tableCell, { width: isMobile ? 160 : '50%', fontSize: isMobile ? 10 : 14 }]}>{record.status}</Text>
//                   </View>
//                 ))
//               ) : (
//                 <View style={styles.tableRow}>
//                   <Text style={[styles.tableCell, { width: '100%', fontSize: isMobile ? 12 : 14 }]}>No attendance records available</Text>
//                 </View>
//               )}
//             </View>
//           </ScrollView>
//         </ScrollView>
//       </View>
//     );
//   };

//   const renderQuizzes = () => {
//     const quizzes = selectedCourse ? courseDetails[selectedCourse.courseNo]?.quizzes || [] : [];
//     return (
//       <View style={styles.tabContent}>
//         <ScrollView
//           horizontal={isMobile}
//           showsHorizontalScrollIndicator={false}
//           contentContainerStyle={{ paddingHorizontal: isMobile ? 8 : 0 }}
//         >
//           <ScrollView style={styles.tableWrapper} nestedScrollEnabled={true} bounces={false}>
//             <View>
//               <View style={[styles.tableRow, styles.tableHeader]}>
//                 <Text style={[styles.tableCell, { width: isMobile ? 130 : '50%', fontSize: isMobile ? 12 : 14 }]}>Quiz Title</Text>
//                 <Text style={[styles.tableCell, { width: isMobile ? 110 : '25%', fontSize: isMobile ? 12 : 14 }]}>Date</Text>
//                 <Text style={[styles.tableCell, { width: isMobile ? 100 : '25%', fontSize: isMobile ? 12 : 14 }]}>Score</Text>
//               </View>
//               {quizzes.length > 0 ? (
//                 quizzes.map((quiz, index) => (
//                   <View key={quiz.id} style={styles.tableRow}>
//                     <Text style={[styles.tableCell, { width: isMobile ? 130 : '50%', fontSize: isMobile ? 10 : 14 }]}>{quiz.title}</Text>
//                     <Text style={[styles.tableCell, { width: isMobile ? 110 : '25%', fontSize: isMobile ? 10 : 14 }]}>{quiz.date}</Text>
//                     <Text style={[styles.tableCell, { width: isMobile ? 100 : '25%', fontSize: isMobile ? 10 : 14 }]}>{quiz.score}</Text>
//                   </View>
//                 ))
//               ) : (
//                 <View style={styles.tableRow}>
//                   <Text style={[styles.tableCell, { width: '100%', fontSize: isMobile ? 12 : 14 }]}>No quizzes available</Text>
//                 </View>
//               )}
//             </View>
//           </ScrollView>
//         </ScrollView>
//       </View>
//     );
//   };

//   const renderAssignments = () => {
//     const assignments = selectedCourse ? courseDetails[selectedCourse.courseNo]?.assignments || [] : [];
//     return (
//       <View style={styles.tabContent}>
//         <ScrollView
//           horizontal={isMobile}
//           showsHorizontalScrollIndicator={false}
//           contentContainerStyle={{ paddingHorizontal: isMobile ? 8 : 0 }}
//         >
//           <ScrollView style={styles.tableWrapper} nestedScrollEnabled={true} bounces={false}>
//             <View>
//               <View style={[styles.tableRow, styles.tableHeader]}>
//                 <Text style={[styles.tableCell, { width: isMobile ? 130 : '50%', fontSize: isMobile ? 12 : 14 }]}>Title</Text>
//                 <Text style={[styles.tableCell, { width: isMobile ? 100 : '25%', fontSize: isMobile ? 12 : 14 }]}>Deadline</Text>
//                 <Text style={[styles.tableCell, { width: isMobile ? 100 : '25%', fontSize: isMobile ? 12 : 14 }]}>Status</Text>
//               </View>
//               {assignments.length > 0 ? (
//                 assignments.map((assignment, index) => (
//                   <View key={assignment.id} style={styles.tableRow}>
//                     <Text style={[styles.tableCell, { width: isMobile ? 130 : '50%', fontSize: isMobile ? 10 : 14 }]}>{assignment.title}</Text>
//                     <Text style={[styles.tableCell, { width: isMobile ? 100 : '25%', fontSize: isMobile ? 10 : 14 }]}>{assignment.deadline}</Text>
//                     <Text style={[styles.tableCell, { width: isMobile ? 100 : '25%', fontSize: isMobile ? 10 : 14 }]}>{assignment.status}</Text>
//                   </View>
//                 ))
//               ) : (
//                 <View style={styles.tableRow}>
//                   <Text style={[styles.tableCell, { width: '100%', fontSize: isMobile ? 12 : 14 }]}>No assignments available</Text>
//                 </View>
//               )}
//             </View>
//           </ScrollView>
//         </ScrollView>
//       </View>
//     );
//   };

//   const renderProjects = () => {
//     const projects = selectedCourse ? courseDetails[selectedCourse.courseNo]?.projects || [] : [];
//     return (
//       <View style={styles.tabContent}>
//         <ScrollView
//           horizontal={isMobile}
//           showsHorizontalScrollIndicator={false}
//           contentContainerStyle={{ paddingHorizontal: isMobile ? 8 : 0 }}
//         >
//           <ScrollView style={styles.tableWrapper} nestedScrollEnabled={true} bounces={false}>
//             <View>
//               <View style={[styles.tableRow, styles.tableHeader]}>
//                 <Text style={[styles.tableCell, { width: isMobile ? 130 : '50%', fontSize: isMobile ? 12 : 14 }]}>Title</Text>
//                 <Text style={[styles.tableCell, { width: isMobile ? 100 : '25%', fontSize: isMobile ? 12 : 14 }]}>Due Date</Text>
//                 <Text style={[styles.tableCell, { width: isMobile ? 100 : '25%', fontSize: isMobile ? 12 : 14 }]}>Group</Text>
//               </View>
//               {projects.length > 0 ? (
//                 projects.map((project, index) => (
//                   <View key={project.id} style={styles.tableRow}>
//                     <Text style={[styles.tableCell, { width: isMobile ? 130 : '50%', fontSize: isMobile ? 10 : 14 }]}>{project.title}</Text>
//                     <Text style={[styles.tableCell, { width: isMobile ? 100 : '25%', fontSize: isMobile ? 10 : 14 }]}>{project.due}</Text>
//                     <Text style={[styles.tableCell, { width: isMobile ? 100 : '25%', fontSize: isMobile ? 10 : 14 }]}>{project.group}</Text>
//                   </View>
//                 ))
//               ) : (
//                 <View style={styles.tableRow}>
//                   <Text style={[styles.tableCell, { width: '100%', fontSize: isMobile ? 12 : 14 }]}>No projects assigned</Text>
//                 </View>
//               )}
//             </View>
//           </ScrollView>
//         </ScrollView>
//       </View>
//     );
//   };

//   const renderTabs = () => (
//     <View style={[styles.tabContainer, { width: isMobile ? '100%' : '79%' }]}>
//       {isMobile ? (
//         <ScrollView
//           horizontal
//           showsHorizontalScrollIndicator={false}
//           contentContainerStyle={{ flexDirection: 'row', paddingHorizontal: 8 }}
//         >
//           <TouchableOpacity
//             style={styles.tabButton}
//             onPress={() => setSelectedCourse(null)}
//             accessible={true}
//             accessibilityLabel="Back to course list"
//             accessibilityRole="button"
//           >
//             <MaterialIcons name="arrow-back" size={isMobile ? 14 : 25} color="#fff" />
//             <Text style={[styles.tabText, { fontSize: isMobile ? 10 : 14, color: '#fff' }]}>Back</Text>
//           </TouchableOpacity>
//           {[
//             { label: 'Course Content', icon: 'description' },
//             { label: 'Attendance', icon: 'event' },
//             { label: 'Quizzes', icon: 'quiz' },
//             { label: 'Assignments', icon: 'assignment' },
//             { label: 'Projects', icon: 'folder' },
//           ].map((tab) => (
//             <TouchableOpacity
//               key={tab.label}
//               style={[styles.tabButton, { backgroundColor: activeTab === tab.label ? '#3f51b5' : '#fff' }]}
//               onPress={() => setActiveTab(tab.label)}
//               accessible={true}
//               accessibilityLabel={`Switch to ${tab.label} tab`}
//               accessibilityRole="button"
//             >
//               <MaterialIcons
//                 name={tab.icon}
//                 size={isMobile ? 14 : 25}
//                 color={activeTab === tab.label ? '#fff' : '#333'}
//               />
//               <Text
//                 style={[styles.tabText, { fontSize: isMobile ? 10 : 10, color: activeTab === tab.label ? '#fff' : '#333' }]}
//                 numberOfLines={2}
//               >
//                 {tab.label}
//               </Text>
//             </TouchableOpacity>
//           ))}
//         </ScrollView>
//       ) : (
//         <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
//           <TouchableOpacity
//             style={styles.tabButton}
//             onPress={() => setSelectedCourse(null)}
//             accessible={true}
//             accessibilityLabel="Back to course list"
//             accessibilityRole="button"
//           >
//             <MaterialIcons name="arrow-back" size={isMobile ? 14 : 25} color="#fff" />
//             <Text style={[styles.tabText, { fontSize: isMobile ? 10 : 14, color: '#fff',  }]}>Back</Text>
//           </TouchableOpacity>
//           {[
//             { label: 'Course Content', icon: 'description' },
//             { label: 'Attendance', icon: 'event' },
//             { label: 'Quizzes', icon: 'quiz' },
//             { label: 'Assignments', icon: 'assignment' },
//             { label: 'Projects', icon: 'folder' },
//           ].map((tab) => (
//             <TouchableOpacity
//               key={tab.label}
//               style={[styles.tabButton, { backgroundColor: activeTab === tab.label ? '#3f51b5' : '#fff' }]}
//               onPress={() => setActiveTab(tab.label)}
//               accessible={true}
//               accessibilityLabel={`Switch to ${tab.label} tab`}
//               accessibilityRole="button"
//             >
//               <MaterialIcons
//                 name={tab.icon}
//                 size={isMobile ? 14 : 25}
//                 color={activeTab === tab.label ? '#fff' : '#333'}
//               />
//               <Text
//                 style={[styles.tabText, { fontSize: isMobile ? 10 : 10, color: activeTab === tab.label ? '#fff' : '#333' }]}
//                 numberOfLines={2}
//               >
//                 {tab.label}
//               </Text>
//             </TouchableOpacity>
//           ))}
//         </View>
//       )}
//     </View>
//   );

//   const renderTabContent = () => {
//     if (!selectedCourse) {
//       console.log('No course selected');
//       return <Text style={{ fontSize: 16, color: '#fff', textAlign: 'center' }}>Please `Please select a course</Text>;
//     }
//     console.log('Selected Course:', selectedCourse.courseNo, 'Quizzes:', courseDetails[selectedCourse.courseNo]?.quizzes, 'Assignments:', courseDetails[selectedCourse.courseNo]?.assignments);
//     return (
//       <View style={[styles.sectionContainer, { width: isMobile ? '100%' : '50%' }]}>
//         <View style={styles.infoRow}>
//           <Text style={[styles.infoText, { fontSize: isMobile ? 14 : 14 }]}>Credits: {selectedCourse?.credits}</Text>
//           <Text style={[styles.infoText, { fontSize: isMobile ? 16 : 20, fontWeight: 'bold' }]}>
//             {selectedCourse?.courseName} ({selectedCourse?.courseNo})
//           </Text>
//           <Text style={[styles.infoText, { fontSize: isMobile ? 14 : 14 }]}>Teacher: {selectedCourse?.teacher}</Text>
//         </View>
//         {activeTab === 'Course Content' && renderCourseContent()}
//         {activeTab === 'Attendance' && renderAttendance()}
//         {activeTab === 'Quizzes' && renderQuizzes()}
//         {activeTab === 'Assignments' && renderAssignments()}
//         {activeTab === 'Projects' && renderProjects()}
//       </View>
//     );
//   };

//   const renderCourseList = () => (
//     <View style={[styles.resultContainer, { width: isMobile ? '100%' : '80%' }]}>
//       <Text style={[styles.heading, { fontSize: isMobile ? 16 : 18 }]}>Registered Courses List</Text>
//       <ScrollView
//         horizontal={isMobile}
//         showsHorizontalScrollIndicator={false}
//         contentContainerStyle={{ paddingHorizontal: isMobile ? 8 : 0 }}
//       >
//         <ScrollView
//           style={styles.tableWrapper}
//           nestedScrollEnabled={true}
//           showsVerticalScrollIndicator={false}
//           bounces={false}
//         >
//           <View>
//             <View style={[styles.tableRow, styles.tableHeader]}>
//               <Text style={[styles.tableCell, { width: isMobile ? "15%" : 110, fontSize: isMobile ? 12 : 14 }]}>Course No</Text>
//               <Text style={[styles.tableCell, { width: isMobile ? "40%" : 254, fontSize: isMobile ? 12 : 14 }]}>Course Name</Text>
//               <Text style={[styles.tableCell, { width: isMobile ? "15%" : 100, fontSize: isMobile ? 12 : 14 }]}>Credits</Text>
//               <Text style={[styles.tableCell, { width: isMobile ? "30%" : 300, fontSize: isMobile ? 12 : 14 }]}>Teacher</Text>
//               <Text style={[styles.tableCell, { width: isMobile ? "20%" : 140, fontSize: isMobile ? 12 : 14 }]}>Class</Text>
//               <Text style={[styles.tableCell, { width: isMobile ? "20%" : 100, fontSize: isMobile ? 12 : 14 }]}>Attendance</Text>
//             </View>
//             {courses.map((course, index) => (
//               <TouchableOpacity
//                 key={index}
//                 style={[
//                   styles.tableRow,
//                   selectedCourse?.courseNo === course.courseNo && styles.selectedCourse,
//                   hoveredRow === index && !isMobile && styles.hoverRow,
//                 ]}
//                 onPress={() => setSelectedCourse(course)}
//                 {...(!isMobile && {
//                   onMouseEnter: () => setHoveredRow(index),
//                   onMouseLeave: () => setHoveredRow(null),
//                 })}
//                 accessible={true}
//                 accessibilityLabel={`View details for ${course.courseName}`}
//                 accessibilityRole="button"
//               >
//                 <View style={[styles.tableCell, { width: isMobile ?  "13%" : 110, flexDirection: 'row', alignItems: 'center' }]}>
//                   {/* <MaterialIcons name={course.icon} size={isMobile ? 16 : 20} color="#3f51b5" style={{ marginRight: 4 }} /> */}
//                   <Text style={[styles.tableCellText, { fontSize: isMobile ? 12 : 14 }]}>{course.courseNo}</Text>
//                 </View>
//                 <Text style={[styles.tableCell, styles.tableCellText, { width: isMobile ? "35%" : 253, fontSize: isMobile ? 12 : 14 }]}>{course.courseName}</Text>
//                 <Text style={[styles.tableCell, styles.tableCellText, { width: isMobile ?  "15%" : 100, fontSize: isMobile ? 12 : 14 }]}>{course.credits}</Text>
//                 <Text style={[styles.tableCell, styles.tableCellText, { width: isMobile ?  "30%" : 300, fontSize: isMobile ? 12 : 14 }]}>{course.teacher}</Text>
//                 <Text style={[styles.tableCell, styles.tableCellText, { width: isMobile ?  "20%" : 140, fontSize: isMobile ? 12 : 14 }]}>{course.class}</Text>
//                 <Text style={[styles.tableCell, styles.tableCellText, { width: isMobile ?  "20%" : 100, fontSize: isMobile ? 12 : 14 }]}>{course.attendance}</Text>
//               </TouchableOpacity>
//             ))}
//           </View>
//         </ScrollView>
//       </ScrollView>
//     </View>
//   );
//   return (
//     <ScrollView
//       style={styles.fullScrollContainer}
//       contentContainerStyle={{ paddingBottom: 50 }}
//       showsVerticalScrollIndicator={false}
//       bounces={false}
//     >
//       <View style={styles.container}>
//         <View style={[styles.topBar, { height: isMobile ? 20 : 25 }]}>
//           <Text style={[styles.welcomeText, { fontSize: isMobile ? 12 : 14 }]}>
//             Welcome : FUI/FA24-BDS-011/ISB
//           </Text>
//         </View>
  
//         <View style={styles.header}>
//           <View style={[styles.contentRow, isMobile && styles.contentColumn]}>
//             <View style={[styles.logoContainer, isMobile && styles.fullWidth]}>
//               <Image
//                 source={logo}
//                 style={[styles.logo, { width: isMobile ? 50 : 65, height: isMobile ? 50 : 65 }]}
//               />
//               <Text style={[styles.uniName, { fontSize: isMobile ? 13 : 15 }]}>
//                 FOUNDATION UNIVERSITY{'\n'}ISLAMABAD
//               </Text>
//             </View>
  
//             <View style={[styles.menuGrid, isMobile && styles.fullWidth]}>
//               {menuItems.map((item, index) => {
//                 const isActive = item.navigateTo === route.name;
//                 const isCurrent = item.label === 'StudentPortal';
//                 return (
//                   <TouchableOpacity
//                     key={index}
//                     style={[
//                       styles.menuItem,
//                       { width: isMobile ? 70 : 80, height: isMobile ? 50 : 58 },
//                       (isActive || isCurrent) && { backgroundColor: '#3f51b5' },
//                     ]}
//                     onPress={() => {
//                       if (item.navigateTo && item.navigateTo !== route.name) {
//                         navigation.navigate(item.navigateTo);
//                       }
//                     }}
//                     accessible={true}
//                     accessibilityLabel={item.label}
//                     accessibilityRole="button"
//                   >
//                     <MaterialIcons
//                       name={item.icon}
//                       size={isMobile ? 20 : 25}
//                       color={(isActive || isCurrent) ? '#fff' : item.color}
//                     />
//                     <Text
//                       style={[
//                         styles.menuLabel,
//                         { fontSize: isMobile ? 8 : 10 },
//                         (isActive || isCurrent) && { color: '#fff' },
//                       ]}
//                     >
//                       {item.label}
//                     </Text>
//                   </TouchableOpacity>
//                 );
//               })}
//             </View>
  
//             {!isMobile && (
//               <View style={styles.rightSection}>
//                 <Image source={i2} style={styles.i2} />
//               </View>
//             )}
//           </View>
//         </View>
  
//         <ScrollView
//           vertical={isMobile}
//           contentContainerStyle={[styles.scrollArea, isMobile && { paddingHorizontal: 15, paddingBottom: 50 }]}
//           nestedScrollEnabled={true}
//           showsHorizontalScrollIndicator={false}
//         >
//           {selectedCourse ? (
//             <>
//               {renderTabs()}
//               {renderTabContent()}
//             </>
//           ) : (
//             renderCourseList()
//           )}
//         </ScrollView>
//       </View>
//     </ScrollView>
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
//     height: 25,
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
//   contentColumn: {
//     flexDirection: 'column',
//     alignItems: 'center',
//   },
//   fullWidth: {
//     width: '100%',
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
//     paddingBottom: "100%",
//   },
//   resultContainer: {
//     backgroundColor: '#fff',
//     padding: 5,
//     borderRadius: 12,
//     elevation: 6,
//     marginTop: 10,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//   },
//   heading: {
//     fontWeight: 'bold',
//     backgroundColor: '#009688',
//     color: '#fff',
//     textAlign: 'center',
//     paddingVertical: 10,
//     borderRadius: 8,
//     marginBottom: 2,
//     fontSize: 18,
//   },
//   tableWrapper: {
//     width: '100%',
//     minWidth: Platform.OS === 'web' ? 'auto' : 300, // Ensure horizontal scrolling on mobile
//     maxHeight: Platform.OS === 'web' ? 400 : 300, // Limit height for vertical scrolling
//   },
//   tableRow: {
//     flexDirection: 'row',
//     borderWidth: 1,
//     borderColor: '#e0e0e0',
//     borderRadius: 8,
//     // marginVertical: 1,
//     backgroundColor: '#fff',
//     // elevation: 2,
//   },
//   tableHeader: {
//     backgroundColor: '#afb0b0',
//     // borderColor: '#3f51b5',
//     borderRadius: 8,
    
//     // elevation: 4,
//   },
//   tableCell: {
//     padding: 6,
//     borderRightWidth: 1,
//     borderColor: '#82878c',
//     textAlign: 'center',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   tableCellText: {
//     color: '#333',
//     fontWeight: '500',
//   },
//   selectedCourse: {
//     backgroundColor: '#e8f5e9',
//     borderLeftWidth: 4,
//     borderLeftColor: '#4caf50',
//   },
//   hoverRow: {
//     backgroundColor: '#e3e7e7',
//     transform: [{ scale: 1.02 }],
//     transitionDuration: '0.2s',
//   },
//   tabContainer: {
//     marginTop: 0.5,
//   },
//   tabButton: {
//     borderRadius: 6,
//     alignItems: 'center',
//     justifyContent: 'flex-start',
//     margin: 8,
//     paddingTop: 8,
//     width: 80,
//     height: 58,
//   },
//   tabText: {
//     marginTop: 4,
//     textAlign: 'center',
//     fontWeight: '500',
//   },
//   tabContent: {
//     marginTop: 14,
//   },
//   sectionContainer: {
//     backgroundColor: '#fff',
//     padding: 6,
//     borderRadius: 8,
//     elevation: 4,
//     marginTop: 10,
//     marginBottom: 20,
//     width: '100%', // Ensure full width on all devices
//   },
//   infoRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     paddingHorizontal: 10,
//   },
//   infoText: {
//     color: '#333',
//   },
//   materialActions: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//   },
//   actionLink: {
//     color: '#3f51b5',
//     marginHorizontal: 2,
//   },
// });

// export default DashboardHeader;

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  useWindowDimensions,
  ScrollView,
  Platform,
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

// Image assets for tabs
const tabImages = {
  'arrow-back': require('../../assets/images/arrow-left.png'),
  description: require('../../assets/images/file.png'),
  event: require('../../assets/images/calendar-check.png'),
  quiz: require('../../assets/images/test-tube.png'),
  assignment: require('../../assets/images/file-document.png'),
  folder: require('../../assets/images/folder.png'),
};


// // Image assets for courses
// const courseImages = {
//   code: require('../../assets/images/code.png'),
//   'developer-board': require('../../assets/images/developer-board.png'),
//   build: require('../../assets/images/build.png'),
//   verified: require('../../assets/images/verified.png'),
// };

const menuItems = [
  { label: 'Dashboard', icon: 'home', color: '#3f51b5', navigateTo: 'StudentPortal' },
  { label: 'Course\nRegistration', icon: 'book', color: '#4caf50', navigateTo: 'CourseRegistration' },
  { label: 'Fees', icon: 'money', color: '#ff9800', navigateTo: 'Fees' },
  { label: 'Result Card', icon: 'description', color: '#9c27b0', navigateTo: 'ResultCard' },
  { label: 'Profile', icon: 'person', color: '#03a9f4', navigateTo: 'profile' },
  { label: 'APS', icon: 'settings', color: '#607d8b', navigateTo: 'APS' },
  { label: 'Logout', icon: 'logout', color: '#795548', navigateTo: 'StudentLogin' },
];

// Sample course details data (replace with actual data from your backend)
const courseDetails = {
  '2501': {
    lectureMaterials: [
      { id: '1', title: 'Intro to OOP', file: 'lecture1.pdf' },
      { id: '2', title: 'Classes & Objects', file: 'lecture2.pdf' },
    ],
    attendance: [
      { date: '2025-04-25', status: 'Present' },
      { date: '2025-04-26', status: 'Absent' },
    ],
    quizzes: [
      { id: 'Q1', title: 'Quiz 1', date: 'Apr 20', score: '8/10' },
    ],
    assignments: [
      { id: 'A1', title: 'Assignment 1', deadline: 'Apr 25', status: 'Submitted' },
    ],
    projects: [
      { id: 'P1', title: 'OOP Project', due: 'May 10', group: 'Team Alpha' },
    ],
  },
  '2502': {
    lectureMaterials: [
      { id: '1', title: 'Intro to DSA', file: 'lecture1.pdf' },
      { id: '2', title: 'Classes & Objects', file: 'lecture2.pdf' },
    ],
    attendance: [
      { date: '2025-04-25', status: 'Present' },
      { date: '2025-04-26', status: 'Absent' },
    ],
    quizzes: [
      { id: 'Q1', title: 'Quiz 1', date: 'Apr 20', score: '8/10' },
    ],
    assignments: [
      { id: 'A1', title: 'Assignment 1', deadline: 'Apr 25', status: 'Submitted' },
    ],
    projects: [
      { id: 'P1', title: 'OOP Project', due: 'May 10', group: 'Team Alpha' },
    ],
  },
  '2503': {
    lectureMaterials: [
      { id: '1', title: 'Intro to SRE', file: 'lecture1.pdf' },
      { id: '2', title: 'Classes & Objects', file: 'lecture2.pdf' },
    ],
    attendance: [
      { date: '2025-04-25', status: 'Present' },
      { date: '2025-04-26', status: 'Absent' },
    ],
    quizzes: [
      { id: 'Q1', title: 'Quiz 1', date: 'Apr 20', score: '8/10' },
    ],
    assignments: [
      { id: 'A1', title: 'Assignment 1', deadline: 'Apr 25', status: 'Submitted' },
    ],
    projects: [
      { id: 'P1', title: 'OOP Project', due: 'May 10', group: 'Team Alpha' },
    ],
  },
  '2504': {
    lectureMaterials: [
      { id: '1', title: 'Intro to SQE', file: 'lecture1.pdf' },
      { id: '2', title: 'Classes & Objects', file: 'lecture2.pdf' },
    ],
    attendance: [
      { date: '2025-04-25', status: 'Present' },
      { date: '2025-04-26', status: 'Absent' },
    ],
    quizzes: [
      { id: 'Q1', title: 'Quiz 1', date: 'Apr 20', score: '8/10' },
    ],
    assignments: [
      { id: 'A1', title: 'Assignment 1', deadline: 'Apr 25', status: 'Submitted' },
    ],
    projects: [
      { id: 'P1', title: 'OOP Project', due: 'May 10', group: 'Team Alpha' },
    ],
  },
};

const DashboardHeader = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  const [selectedCourse, setSelectedCourse] = useState(null);
  const [activeTab, setActiveTab] = useState('Course Content');
  const [hoveredRow, setHoveredRow] = useState(null);

  const courses = [
    { courseNo: '2501', courseName: 'OOP', credits: 3, teacher: 'Ms. Asma', class: 9, attendance: '24/25', icon: 'code' },
    { courseNo: '2502', courseName: 'DSA', credits: 3, teacher: 'Mr. Imran', class: 10, attendance: '24/25', icon: 'developer-board' },
    { courseNo: '2503', courseName: 'SRE', credits: 3, teacher: 'Ms. Ayesha', class: 11, attendance: '21/25', icon: 'build' },
    { courseNo: '2504', courseName: 'SQE', credits: 3, teacher: 'Mr. Daud', class: 10, attendance: '19/25', icon: 'verified' },
  ];

  const renderCourseContent = () => {
    const materials = selectedCourse ? courseDetails[selectedCourse.courseNo]?.lectureMaterials || [] : [];
    return (
      <View style={styles.tabContent}>
        <ScrollView
          horizontal={isMobile}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: isMobile ? 8 : 0 }}
        >
          <ScrollView style={styles.tableWrapper} nestedScrollEnabled={true} bounces={false}>
            <View>
              <View style={[styles.tableRow, styles.tableHeader]}>
                <Text style={[styles.tableCell, { width: isMobile ? 130 : '40%', fontSize: isMobile ? 12 : 14 }]}>Title</Text>
                <Text style={[styles.tableCell, { width: isMobile ? 110 : '30%', fontSize: isMobile ? 12 : 14 }]}>File</Text>
                <Text style={[styles.tableCell, { width: isMobile ? 110 : '30%', fontSize: isMobile ? 12 : 14 }]}>Actions</Text>
              </View>
              {materials.length > 0 ? (
                materials.map((material, index) => (
                  <View key={index} style={styles.tableRow}>
                    <Text style={[styles.tableCell, { width: isMobile ? 130 : '40%', fontSize: isMobile ? 10 : 14 }]}>{material.title}</Text>
                    <Text style={[styles.tableCell, { width: isMobile ? 110 : '30%', fontSize: isMobile ? 10 : 14 }]}>{material.file}</Text>
                    <View style={[styles.tableCell, styles.materialActions, { width: isMobile ? 110 : '30%' }]}>
                      <TouchableOpacity onPress={() => console.log(`View ${material.file}`)}>
                        <Text style={[styles.actionLink, { fontSize: isMobile ? 8 : 14 }]}>{isMobile ? 'View' : '[View]'}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => console.log(`Download ${material.file}`)}>
                        <Text style={[styles.actionLink, { fontSize: isMobile ? 8 : 14 }]}>{isMobile ? 'Download' : '[Download]'}</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))
              ) : (
                <View style={styles.tableRow}>
                  <Text style={[styles.tableCell, { width: '100%', fontSize: isMobile ? 12 : 14 }]}>No lecture materials available</Text>
                </View>
              )}
            </View>
          </ScrollView>
        </ScrollView>
      </View>
    );
  };

  const renderAttendance = () => {
    const attendance = selectedCourse ? courseDetails[selectedCourse.courseNo]?.attendance || [] : [];
    return (
      <View style={styles.tabContent}>
        <ScrollView
          horizontal={isMobile}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: isMobile ? 8 : 0 }}
        >
          <ScrollView style={styles.tableWrapper} nestedScrollEnabled={true} bounces={false}>
            <View>
              <View style={[styles.tableRow, styles.tableHeader]}>
                <Text style={[styles.tableCell, { width: isMobile ? 160 : '50%', fontSize: isMobile ? 12 : 14 }]}>Date</Text>
                <Text style={[styles.tableCell, { width: isMobile ? 160 : '50%', fontSize: isMobile ? 12 : 14 }]}>Status</Text>
              </View>
              {attendance.length > 0 ? (
                attendance.map((record, index) => (
                  <View key={index} style={styles.tableRow}>
                    <Text style={[styles.tableCell, { width: isMobile ? 160 : '50%', fontSize: isMobile ? 10 : 14 }]}>{record.date}</Text>
                    <Text style={[styles.tableCell, { width: isMobile ? 160 : '50%', fontSize: isMobile ? 10 : 14 }]}>{record.status}</Text>
                  </View>
                ))
              ) : (
                <View style={styles.tableRow}>
                  <Text style={[styles.tableCell, { width: '100%', fontSize: isMobile ? 12 : 14 }]}>No attendance records available</Text>
                </View>
              )}
            </View>
          </ScrollView>
        </ScrollView>
      </View>
    );
  };

  const renderQuizzes = () => {
    const quizzes = selectedCourse ? courseDetails[selectedCourse.courseNo]?.quizzes || [] : [];
    return (
      <View style={styles.tabContent}>
        <ScrollView
          horizontal={isMobile}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: isMobile ? 8 : 0 }}
        >
          <ScrollView style={styles.tableWrapper} nestedScrollEnabled={true} bounces={false}>
            <View>
              <View style={[styles.tableRow, styles.tableHeader]}>
                <Text style={[styles.tableCell, { width: isMobile ? 130 : '50%', fontSize: isMobile ? 12 : 14 }]}>Quiz Title</Text>
                <Text style={[styles.tableCell, { width: isMobile ? 110 : '25%', fontSize: isMobile ? 12 : 14 }]}>Date</Text>
                <Text style={[styles.tableCell, { width: isMobile ? 100 : '25%', fontSize: isMobile ? 12 : 14 }]}>Score</Text>
              </View>
              {quizzes.length > 0 ? (
                quizzes.map((quiz, index) => (
                  <View key={quiz.id} style={styles.tableRow}>
                    <Text style={[styles.tableCell, { width: isMobile ? 130 : '50%', fontSize: isMobile ? 10 : 14 }]}>{quiz.title}</Text>
                    <Text style={[styles.tableCell, { width: isMobile ? 110 : '25%', fontSize: isMobile ? 10 : 14 }]}>{quiz.date}</Text>
                    <Text style={[styles.tableCell, { width: isMobile ? 100 : '25%', fontSize: isMobile ? 10 : 14 }]}>{quiz.score}</Text>
                  </View>
                ))
              ) : (
                <View style={styles.tableRow}>
                  <Text style={[styles.tableCell, { width: '100%', fontSize: isMobile ? 12 : 14 }]}>No quizzes available</Text>
                </View>
              )}
            </View>
          </ScrollView>
        </ScrollView>
      </View>
    );
  };

  const renderAssignments = () => {
    const assignments = selectedCourse ? courseDetails[selectedCourse.courseNo]?.assignments || [] : [];
    return (
      <View style={styles.tabContent}>
        <ScrollView
          horizontal={isMobile}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: isMobile ? 8 : 0 }}
        >
          <ScrollView style={styles.tableWrapper} nestedScrollEnabled={true} bounces={false}>
            <View>
              <View style={[styles.tableRow, styles.tableHeader]}>
                <Text style={[styles.tableCell, { width: isMobile ? 130 : '50%', fontSize: isMobile ? 12 : 14 }]}>Title</Text>
                <Text style={[styles.tableCell, { width: isMobile ? 100 : '25%', fontSize: isMobile ? 12 : 14 }]}>Deadline</Text>
                <Text style={[styles.tableCell, { width: isMobile ? 100 : '25%', fontSize: isMobile ? 12 : 14 }]}>Status</Text>
              </View>
              {assignments.length > 0 ? (
                assignments.map((assignment, index) => (
                  <View key={assignment.id} style={styles.tableRow}>
                    <Text style={[styles.tableCell, { width: isMobile ? 130 : '50%', fontSize: isMobile ? 10 : 14 }]}>{assignment.title}</Text>
                    <Text style={[styles.tableCell, { width: isMobile ? 100 : '25%', fontSize: isMobile ? 10 : 14 }]}>{assignment.deadline}</Text>
                    <Text style={[styles.tableCell, { width: isMobile ? 100 : '25%', fontSize: isMobile ? 10 : 14 }]}>{assignment.status}</Text>
                  </View>
                ))
              ) : (
                <View style={styles.tableRow}>
                  <Text style={[styles.tableCell, { width: '100%', fontSize: isMobile ? 12 : 14 }]}>No assignments available</Text>
                </View>
              )}
            </View>
          </ScrollView>
        </ScrollView>
      </View>
    );
  };

  const renderProjects = () => {
    const projects = selectedCourse ? courseDetails[selectedCourse.courseNo]?.projects || [] : [];
    return (
      <View style={styles.tabContent}>
        <ScrollView
          horizontal={isMobile}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: isMobile ? 8 : 0 }}
        >
          <ScrollView style={styles.tableWrapper} nestedScrollEnabled={true} bounces={false}>
            <View>
              <View style={[styles.tableRow, styles.tableHeader]}>
                <Text style={[styles.tableCell, { width: isMobile ? 130 : '50%', fontSize: isMobile ? 12 : 14 }]}>Title</Text>
                <Text style={[styles.tableCell, { width: isMobile ? 100 : '25%', fontSize: isMobile ? 12 : 14 }]}>Due Date</Text>
                <Text style={[styles.tableCell, { width: isMobile ? 100 : '25%', fontSize: isMobile ? 12 : 14 }]}>Group</Text>
              </View>
              {projects.length > 0 ? (
                projects.map((project, index) => (
                  <View key={project.id} style={styles.tableRow}>
                    <Text style={[styles.tableCell, { width: isMobile ? 130 : '50%', fontSize: isMobile ? 10 : 14 }]}>{project.title}</Text>
                    <Text style={[styles.tableCell, { width: isMobile ? 100 : '25%', fontSize: isMobile ? 10 : 14 }]}>{project.due}</Text>
                    <Text style={[styles.tableCell, { width: isMobile ? 100 : '25%', fontSize: isMobile ? 10 : 14 }]}>{project.group}</Text>
                  </View>
                ))
              ) : (
                <View style={styles.tableRow}>
                  <Text style={[styles.tableCell, { width: '100%', fontSize: isMobile ? 12 : 14 }]}>No projects assigned</Text>
                </View>
              )}
            </View>
          </ScrollView>
        </ScrollView>
      </View>
    );
  };

  const renderTabs = () => (
    <View style={[styles.tabContainer, { width: isMobile ? '100%' : '79%' }]}>
      {isMobile ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ flexDirection: 'row', paddingHorizontal: 8 }}
        >
          <TouchableOpacity
            style={styles.tabButton}
            onPress={() => setSelectedCourse(null)}
            accessible={true}
            accessibilityLabel="Back to course list"
            accessibilityRole="button"
          >
            <Image
              source={tabImages['arrow-back']}
              style={{ width: isMobile ? 14 : 25, height: isMobile ? 14 : 25, tintColor: '#fff' }}
            />
            <Text style={[styles.tabText, { fontSize: isMobile ? 10 : 14, color: '#fff' }]}>Back</Text>
          </TouchableOpacity>
          {[
            { label: 'Course Content', icon: 'description' },
            { label: 'Attendance', icon: 'event' },
            { label: 'Quizzes', icon: 'quiz' },
            { label: 'Assignments', icon: 'assignment' },
            { label: 'Projects', icon: 'folder' },
          ].map((tab) => (
            <TouchableOpacity
              key={tab.label}
              style={[styles.tabButton, { backgroundColor: activeTab === tab.label ? '#3f51b5' : '#fff' }]}
              onPress={() => setActiveTab(tab.label)}
              accessible={true}
              accessibilityLabel={`Switch to ${tab.label} tab`}
              accessibilityRole="button"
            >
              <Image
                source={tabImages[tab.icon]}
                style={{
                  width: isMobile ? 14 : 25,
                  height: isMobile ? 14 : 25,
                  tintColor: activeTab === tab.label ? '#fff' : '#333',
                }}
              />
              <Text
                style={[styles.tabText, { fontSize: isMobile ? 10 : 10, color: activeTab === tab.label ? '#fff' : '#333' }]}
                numberOfLines={2}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      ) : (
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          <TouchableOpacity
            style={styles.tabButton}
            onPress={() => setSelectedCourse(null)}
            accessible={true}
            accessibilityLabel="Back to course list"
            accessibilityRole="button"
          >
            <Image
              source={tabImages['arrow-back']}
              style={{ width: isMobile ? 14 : 25, height: isMobile ? 14 : 25, tintColor: '#fff' }}
            />
            <Text style={[styles.tabText, { fontSize: isMobile ? 10 : 14, color: '#fff' }]}>Back</Text>
          </TouchableOpacity>
          {[
            { label: 'Course Content', icon: 'description' },
            { label: 'Attendance', icon: 'event' },
            { label: 'Quizzes', icon: 'quiz' },
            { label: 'Assignments', icon: 'assignment' },
            { label: 'Projects', icon: 'folder' },
          ].map((tab) => (
            <TouchableOpacity
              key={tab.label}
              style={[styles.tabButton, { backgroundColor: activeTab === tab.label ? '#3f51b5' : '#fff' }]}
              onPress={() => setActiveTab(tab.label)}
              accessible={true}
              accessibilityLabel={`Switch to ${tab.label} tab`}
              accessibilityRole="button"
            >
              <Image
                source={tabImages[tab.icon]}
                style={{
                  width: isMobile ? 14 : 25,
                  height: isMobile ? 14 : 25,
                  tintColor: activeTab === tab.label ? '#fff' : '#333',
                }}
              />
              <Text
                style={[styles.tabText, { fontSize: isMobile ? 10 : 10, color: activeTab === tab.label ? '#fff' : '#333' }]}
                numberOfLines={2}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );

  const renderTabContent = () => {
    if (!selectedCourse) {
      console.log('No course selected');
      return <Text style={{ fontSize: 16, color: '#fff', textAlign: 'center' }}>Please select a course</Text>;
    }
    console.log('Selected Course:', selectedCourse.courseNo, 'Quizzes:', courseDetails[selectedCourse.courseNo]?.quizzes, 'Assignments:', courseDetails[selectedCourse.courseNo]?.assignments);
    return (
      <View style={[styles.sectionContainer, { width: isMobile ? '100%' : '50%' }]}>
        <View style={styles.infoRow}>
          <Text style={[styles.infoText, { fontSize: isMobile ? 14 : 14 }]}>Credits: {selectedCourse?.credits}</Text>
          <Text style={[styles.infoText, { fontSize: isMobile ? 16 : 20, fontWeight: 'bold' }]}>
            {selectedCourse?.courseName} ({selectedCourse?.courseNo})
          </Text>
          <Text style={[styles.infoText, { fontSize: isMobile ? 14 : 14 }]}>Teacher: {selectedCourse?.teacher}</Text>
        </View>
        {activeTab === 'Course Content' && renderCourseContent()}
        {activeTab === 'Attendance' && renderAttendance()}
        {activeTab === 'Quizzes' && renderQuizzes()}
        {activeTab === 'Assignments' && renderAssignments()}
        {activeTab === 'Projects' && renderProjects()}
      </View>
    );
  };
const renderCourseList = () => (
  <View style={[styles.resultContainer, { width: isMobile ? '100%' : '80%' }]}>
    <Text style={[styles.heading, { fontSize: isMobile ? 16 : 18 }]}>Registered Courses List</Text>

    <ScrollView
      horizontal={isMobile}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: isMobile ? 8 : 0, minWidth: isMobile ? 440 : 'auto' }}
    >
      <ScrollView
        style={[styles.tableWrapper, { width: isMobile ? '100%' : 'auto' }]}
        nestedScrollEnabled={true}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <View>
          {/* Table Header */}
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={[styles.tableCell, { width: isMobile ? 60 : 110, fontSize: isMobile ? 12 : 14 }]}>Course No</Text>
            <Text style={[styles.tableCell, { width: isMobile ? 140 : 254, fontSize: isMobile ? 12 : 14 }]}>Course Name</Text>
            <Text style={[styles.tableCell, { width: isMobile ? 60 : 100, fontSize: isMobile ? 12 : 14 }]}>Credits</Text>
            <Text style={[styles.tableCell, { width: isMobile ? 100 : 300, fontSize: isMobile ? 12 : 14 }]}>Teacher</Text>
            <Text style={[styles.tableCell, { width: isMobile ? 60 : 140, fontSize: isMobile ? 12 : 14 }]}>Class</Text>
            <Text style={[styles.tableCell, { width: isMobile ? 60 : 100, fontSize: isMobile ? 12 : 14 }]}>Attendance</Text>
          </View>

          {/* Table Rows */}
          {courses.map((course, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.tableRow,
                selectedCourse?.courseNo === course.courseNo && styles.selectedCourse,
                hoveredRow === index && !isMobile && styles.hoverRow,
              ]}
              onPress={() => setSelectedCourse(course)}
              {...(!isMobile && {
                onMouseEnter: () => setHoveredRow(index),
                onMouseLeave: () => setHoveredRow(null),
              })}
              accessible={true}
              accessibilityLabel={`View details for ${course.courseName}`}
              accessibilityRole="button"
            >
              <Text style={[styles.tableCell, styles.tableCellText, { width: isMobile ? 60 : 110, fontSize: isMobile ? 12 : 14 }]}>{course.courseNo}</Text>
              <Text style={[styles.tableCell, styles.tableCellText, { width: isMobile ? 140 : 254, fontSize: isMobile ? 12 : 14 }]}>{course.courseName}</Text>
              <Text style={[styles.tableCell, styles.tableCellText, { width: isMobile ? 60 : 100, fontSize: isMobile ? 12 : 14 }]}>{course.credits}</Text>
              <Text style={[styles.tableCell, styles.tableCellText, { width: isMobile ? 100 : 300, fontSize: isMobile ? 12 : 14 }]}>{course.teacher}</Text>
              <Text style={[styles.tableCell, styles.tableCellText, { width: isMobile ? 60 : 140, fontSize: isMobile ? 12 : 14 }]}>{course.class}</Text>
              <Text style={[styles.tableCell, styles.tableCellText, { width: isMobile ? 60 : 100, fontSize: isMobile ? 12 : 14 }]}>{course.attendance}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </ScrollView>
  </View>
);

// // Example styles
// const styles = StyleSheet.create({
//   resultContainer: { alignItems: 'center' },
//   heading: { fontWeight: 'bold', marginBottom: 10 },
//   tableWrapper: { flex: 1 },
//   tableRow: { flexDirection: 'row', borderBottomWidth: 1, borderColor: '#ddd' },
//   tableHeader: { backgroundColor: '#f0f0f0' },
//   tableCell: {
//     padding: 5,
//     boxSizing: 'border-box',
//     textAlign: 'center',
//     borderRightWidth: 1,
//     borderColor: '#ddd',
//   },
//   tableCellText: { fontSize: 12 },
//   selectedCourse: { backgroundColor: '#e0e0e0' },
//   hoverRow: { backgroundColor: '#f5f5f5' },
// });

  return (
    <ScrollView
      style={styles.fullScrollContainer}
      contentContainerStyle={{ paddingBottom: 50 }}
      showsVerticalScrollIndicator={false}
      bounces={false}
    >
      <View style={styles.container}>
        <View style={[styles.topBar, { height: isMobile ? 20 : 25 }]}>
          <Text style={[styles.welcomeText, { fontSize: isMobile ? 12 : 14 }]}>
            Welcome : FUI/FA24-BDS-011/ISB
          </Text>
        </View>

        <View style={styles.header}>
          <View style={[styles.contentRow, isMobile && styles.contentColumn]}>
            <View style={[styles.logoContainer, isMobile && styles.fullWidth]}>
              <Image
                source={logo}
                style={[styles.logo, { width: isMobile ? 50 : 65, height: isMobile ? 50 : 65 }]}
              />
              <Text style={[styles.uniName, { fontSize: isMobile ? 13 : 15 }]}>
                FOUNDATION UNIVERSITY{'\n'}ISLAMABAD
              </Text>
            </View>

            <View style={[styles.menuGrid, isMobile && styles.fullWidth]}>
              {menuItems.map((item, index) => {
                const isActive = item.navigateTo === route.name;
                const isCurrent = item.label === 'StudentPortal';
                return (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.menuItem,
                      { width: isMobile ? 70 : 80, height: isMobile ? 50 : 58 },
                      (isActive || isCurrent) && { backgroundColor: '#3f51b5' },
                    ]}
                    onPress={() => {
                      if (item.navigateTo && item.navigateTo !== route.name) {
                        navigation.navigate(item.navigateTo);
                      }
                    }}
                    accessible={true}
                    accessibilityLabel={item.label}
                    accessibilityRole="button"
                  >
                    <Image
                      source={menuImages[item.icon]}
                      style={{
                        width: isMobile ? 20 : 25,
                        height: isMobile ? 20 : 25,
                        tintColor: (isActive || isCurrent) ? '#fff' : item.color,
                      }}
                    />
                    <Text
                      style={[
                        styles.menuLabel,
                        { fontSize: isMobile ? 8 : 10 },
                        (isActive || isCurrent) && { color: '#fff' },
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

        <ScrollView
          vertical={isMobile}
          contentContainerStyle={[styles.scrollArea, isMobile && { paddingHorizontal: 15, paddingBottom: 50 }]}
          nestedScrollEnabled={true}
          showsHorizontalScrollIndicator={false}
        >
          {selectedCourse ? (
            <>
              {renderTabs()}
              {renderTabContent()}
            </>
          ) : (
            renderCourseList()
          )}
        </ScrollView>
      </View>
    </ScrollView>
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
    height: 25,
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
  contentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  contentColumn: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  fullWidth: {
    width: '100%',
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
    paddingBottom: "100%",
  },
  resultContainer: {
    backgroundColor: '#fff',
    padding: 5,
    borderRadius: 12,
    elevation: 6,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  heading: {
    fontWeight: 'bold',
    backgroundColor: '#009688',
    color: '#fff',
    textAlign: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 2,
    fontSize: 18,
  },
  tableWrapper: {
    width: '100%',
    minWidth: Platform.OS === 'web' ? 'auto' : 300, // Ensure horizontal scrolling on mobile
    maxHeight: Platform.OS === 'web' ? 400 : 300, // Limit height for vertical scrolling
  },
  tableRow: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  tableHeader: {
    backgroundColor: '#afb0b0',
    borderRadius: 8,
  },
  tableCell: {
    padding: 6,
    borderRightWidth: 1,
    borderColor: '#82878c',
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tableCellText: {
    color: '#333',
    fontWeight: '500',
  },
  selectedCourse: {
    backgroundColor: '#e8f5e9',
    borderLeftWidth: 4,
    borderLeftColor: '#4caf50',
  },
  hoverRow: {
    backgroundColor: '#e3e7e7',
    transform: [{ scale: 1.02 }],
    transitionDuration: '0.2s',
  },
  tabContainer: {
    // marginTop: 0.5,
  },
  tabButton: {
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'flex-start',
    margin: 8,
    paddingTop: 8,
    width: 80,
    height: 58,
  },
  tabText: {
    marginTop: 4,
    textAlign: 'center',
    fontWeight: '500',
  },
  tabContent: {
    marginTop: 14,
  },
  sectionContainer: {
    backgroundColor: '#fff',
    padding: 6,
    borderRadius: 8,
    elevation: 4,
    marginTop: 10,
    marginBottom: 20,
    width: '100%', // Ensure full width on all devices
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  infoText: {
    color: '#333',
  },
  materialActions: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  actionLink: {
    color: '#3f51b5',
    marginHorizontal: 2,
  },
});

export default DashboardHeader;