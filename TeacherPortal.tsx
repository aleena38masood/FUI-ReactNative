// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import {
  View,
  Text,
  Modal,
  ActivityIndicator,
  Image,
  Picker,
  TextInput,
  TouchableOpacity,
  ScrollView,
  useWindowDimensions,
  Platform,
  Alert
} from 'react-native';
import { useNavigation,useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import images from '@/assets/images';
import getStyles from '../../assets/TeacherPortalStyles'; // Import the styles
import DateTimePicker from '@react-native-community/datetimepicker';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Header from '@/components/HeaderComponent';
import config from '@/constants/config'; // adjust the path based on location



import MenuBar from '../../components/MenuBar'; // Adjust path as needed
import SubMenuBar from '@/components/SubMenuBar'; // Adjust path if necessary
import centralData from '@/components/centralData';
import TeacherPortalModal from '@/components/TeacherPortalModal';
//import images from '@/constants/images'; // Your image icons
import { getGlobal,setGlobal } from '@/constants/Globals';
import moment from 'moment';

import AlertModalPopUp from '@/components/AlertModalPopUp'; // Adjust path as needed

import {
  getAttendanceSummary,
  getAttendanceDetail,
  saveAttendance,
  submitAttendance
} from '../../src/services/api'; // adjust path
import { red, rgbaColor } from 'react-native-reanimated/lib/typescript/Colors';
import { Colors } from 'react-native/Libraries/NewAppScreen';

import * as WebBrowser from 'expo-web-browser'; // For web links
import * as FileSystem from 'expo-file-system'; // For file downloads

import TooltipWrapper from '@/assets/TooltipWrapper';


type RootStackParamList = {
  TeacherPortal: { facultyId?: string; isHODView?: boolean; activeTab?: string; courseOfferingID?: number;isAdminView?:boolean };
  TeacherProfile: undefined;
  Announcements: undefined;
  TeacherLogin: undefined;
  Sessionals: undefined;
  StudentResultCard: { student: Student };
  AddNewGroupScreen: undefined;
  SDB: undefined;
  MarksEntryScreen: { courseOfferingID?: number;facultyId?: string; activeTab?: string;};
  AssignmentsScreen: { courseOfferingID?: number };
  // MarksEntrySummary: { courseOfferingID?: number };
};
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type TeacherPortalRouteProp = RouteProp<RootStackParamList, 'TeacherPortal'>;

// Define types for data structures
interface Teacher {
  id: string;
  name: string;
  status: string;
}

interface DiscussionPost {
  id: string;
  title: string;
  author: string;
  date: string;
}

interface Student {
  id: string;
  name: string;
  status: string;
  rollNo?: string;
  email?: string;
  assignment1?: string;
  quiz1?: string;
  midterm?: string;
  final?: string;
  total?: string;
  grade?: string;
}

interface Course {
  courseOfferingID: number;
  courseNo: string;
  courseName: string;
  credits: number;
  students: number;
  studentRollNos: string[]; //Newly Added as per email ask ALEENA
  facultyId: string; // Add this line to the Course interface
}




interface AttendanceDetail {
  AttendanceDetail_ID: string;
  Student: Student;
  Status: string;
  Remarks?: string;
  isEditable?: boolean;
  attendancePercentage : string;
}

interface AttendanceRecord {
  Attendance_CourseOfferID: number;
  AttendanceID: string;
  AttendanceDate: string;
  Attendance_IsSubmitted: boolean;
  Attendance_IsSaved: boolean;
  Attendance_Status: 'Pending' | 'Saved' | 'Submitted';
  Attendance_StartTime: string;
  Attendance_EndTime: string;
  Attendance_IsTheory: boolean;
  Attendance_IsPractical: boolean;
  Attendance_Comments?: string;
  Attendance_IsLocked:boolean,
  students: AttendanceDetail[];
}
interface Course {
  courseOfferingID: number;
  courseNo: string;
  courseName: string;
  credits: string;
  students: number;
  studentRollNos: string[];
  facultyId: string;


  creditHours_Practical : int,
 creditHours_Theory : int,
 hasPractical : boolean,

facultyName : string,
}

interface Student {
  id: string;
  rollNo: string;
  name: string;
  email: string;
  isEditable : boolean;
  attendancePercentage : string;
}



interface LectureMaterial {
  id: string;
  title: string;
  file: string;
  isURL : Boolean;
  isAttachment : boolean;
}

interface Assignment {
  id: string;
  title: string;
  deadline: string;
  submissions: string;
  status: string;
}

interface Quiz {
  id: string;
  title: string;
  date: string;
  attempts: number;
  avgMarks: string;
}

interface Project {
  id: string;
  title: string;
  due: string;
  group: string;
}

interface QuizQuestion {
  id: string;
  questionText: string;
  choice1: string;
  choice2: string;
  choice3: string;
  choice4: string;
  choice5: string;
}

interface Group {
  id: string;
  name: string;
  description: string;
}


 //const [showConfirm, setShowConfirm] = useState(false);

const TeacherPortal = () => {

  const { width } = useWindowDimensions();
  const isMobile = width < 1000;
  const styles = getStyles(isMobile);


  const courseOfferingID = centralData.selectedCourseOfferingID;

const navigateToMarksEntry = () => {
    if (selectedCourse) {
      // Store courseOfferingID in centralData or another state
      centralData.selectedCourseOfferingID = selectedCourse.courseOfferingID;
      console.log('Stored courseOfferingID:', selectedCourse.courseOfferingID);

      // Navigate without passing params in URL
      navigateSafely('MarksEntryScreen');
    } else {
      Alert.alert('Error', 'Please select a course first.');
    }
  };
  const navigateToAssignmentsScreen = () => {
    if (selectedCourse) {
      // Store courseOfferingID in centralData or another state
      centralData.selectedCourseOfferingID = selectedCourse.courseOfferingID;
      console.log('Stored courseOfferingID:', selectedCourse.courseOfferingID);

      // Navigate without passing params in URL
      navigateSafely('AssignmentsScreen');
    } else {
      Alert.alert('Error', 'Please select a course first.');
    }
  };


  

   const handleDelete_CourseContent = async (Get_C_Content_ID,courseOfferingID) => {

     try {
      const token = await AsyncStorage.getItem('token');

        console.log("Delete called "+Get_C_Content_ID );
      // Call your soft delete API here

    const response = await fetch(`${config.BASE_URL}/api/Course/DeleteContent/${Get_C_Content_ID}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const result = await response.json();

    if (response.ok) {
      console.log('Course content deleted successfully:', result.message);

        // Remove the item from the array
      setLectureMaterialsMap(prev => {
        const updated = prev[courseOfferingID]?.filter(m => m.id !== Get_C_Content_ID);  //material.id
        return {
          ...prev,
          [courseOfferingID]: updated,
        };
      });


    } else {
      console.warn('Delete course content failed:', result.message);
    }
  } catch (error) {
    console.error('Delete course Content API error:', error);
  }
  finally{
     loadCourseContents(courseOfferingID);

  }









    
  };


  // Create state: 
  const [currentSession, setCurrentSession] = useState<string | null>('(Session Not Fetched)');

  const [showAlertPopup, setShowAlertPopup] = useState(false);
  const [popupAlertType, setPopupAlertType] = useState('success');
  const [popupAlertTitle, setPopupAlertTitle] = useState('');
  const [popupAlertMessage, setPopupAlertMessage] = useState('');
  const [popupAlertButtons, setPopupAlertButtons] = useState([{ text: 'CONTINUE', onPress: () => {} }]);

  const [showAlertPopupOverModal, setShowAlertPopupOverModal] = useState(false);
  const [popupAlertType_OverModal, setPopupAlertType_OverModal] = useState('success');
  const [popupAlertTitle_OverModal, setPopupAlertTitle_OverModal] = useState('');
  const [popupAlertMessage_OverModal, setPopupAlertMessage_OverModal] = useState('');
  const [popupAlertButtons_OverModal, setPopupAlertButtons_OverModal] = useState([{ text: 'CONTINUE', onPress: () => {} }]);



  //provided by aleena
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<TeacherPortalRouteProp>();

//FK New parameters
const [initialParams] = useState(() => ({
  facultyId: route.params?.facultyId,
  isHODView: route.params?.isHODView,
  isAdminView:route.params?.isAdminView,
  courseOfferingID: route.params?.courseOfferingID,
}));



  const [errorMessage, setErrorMessage] = useState<string | null>(null);



//const navigation = useNavigation<NavigationProp>();
const [loading, setLoading] = useState(true);

const handleModalSave = async (data: any, type: ItemType) => {
  console.log("Function handleModalSave called for " + type);

  let perform_Operation=true;


  if (type === 'lectureMaterial' && selectedCourse) {
    let isUploadSuccessful = false;

    console.log("Function handleModalSave called for title " + data.title);

    const inputType: 'file' | 'url' | 'none' =
      data.isURL ? 'url' : data.filePath ? 'file' : 'none';

    // Improved validation logic
    if (!data.title || !data.description) {
      
      //alert("Please provide both title and description.");

         

          setLoading(false);

      //return;
      perform_Operation=false;
    }

   
    if (inputType === 'url' && !data.url) {
     // alert("Please enter a valid URL hhh.");
      //return;
      perform_Operation=false;
    }

    if (inputType === 'file' && !data.filePath) {
      //alert("Please upload a file  fff.");
      //return;
      perform_Operation=false;
    }

    // // None selected — no file or URL
    // if (inputType === 'none') {
    //   alert("Please select File or URL or choose 'None' intentionally.");
    //   // If 'none' is valid for your case, you can skip this
    //   // return;
    // }



if(perform_Operation)
{
    try {
      const token = await AsyncStorage.getItem('token');

      const get_Content_ID = data.id ?? -1;
      console.log("Function handleModalSave called get_Content_ID " + get_Content_ID);

      const newMaterial = {
        C_Content_ID: get_Content_ID,
        courseOfferedId: selectedCourse.courseOfferingID,
        content_Title: data.title,
        content_Description: data.description || null,
        has_URL: inputType === 'url',
        has_Attachment: inputType === 'file',
        link_OR_AttachmentPath:
          inputType === 'url'
            ? data.url
            : inputType === 'file'
            ? data.filePath
            : '', // For 'none'
        inserted_ByUser: 1, // Replace with actual user ID from session
        learningWeek: data.learningWeek,
      };

      // const Post_Request_URL =
      //   get_Content_ID === -1 || get_Content_ID === 0
      //     ? 'Course/UploadCourseContent'
      //     : 'Course/AddOrUpdate';

      const Post_Request_URL = 'Course/UploadCourseContent' ;

      const response = await fetch(`${config.BASE_URL}/api/${Post_Request_URL}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newMaterial),
      });

      const result = await response.json();

      if (response.ok) {
      //  alert(result.message || "Uploaded successfully");
        isUploadSuccessful = true;

        // Optional clear
        setNewMaterialTitle('');
        setNewMaterialFile('');
        setNewMaterialDesc('');

         setPopupAlertType('success');
      setPopupAlertTitle('Content Uploaded'); // Set custom title
      setPopupAlertMessage("Your content uploaded successfully.");
      setPopupAlertButtons([
        { text: 'Ok', onPress: () => setShowAlertPopup(false) },
      
      ]);
      //console.log('Error Popup State:', { popupType, popupTitle, popupMessage, popupButtons });
      setShowAlertPopup(true);


      } else {
        //alert(result.message || "Upload failed.");
 setPopupAlertType('error');
      setPopupAlertTitle('Unable to Upload'); // Set custom title
      setPopupAlertMessage("Content was not uploaded. Kindly try again.");
      setPopupAlertButtons([
        { text: 'Ok', onPress: () => setShowAlertPopup(false) },
       
      ]);
      //console.log('Error Popup State:', { popupType, popupTitle, popupMessage, popupButtons });
      setShowAlertPopup(true);

      }
    } catch (error) {
      console.error("Uploading content error "+error);
      //alert("Upload failed.");
       setPopupAlertType('error');
      setPopupAlertTitle('Upload Failed !!'); // Set custom title
      setPopupAlertMessage("Error occured while uploading content\. Please try again later.");
      setPopupAlertButtons([
        { text: 'Ok', onPress: () => setShowAlertPopup(false) },
        // { text: 'Yes', onPress: () => {
        //   setShowAlertPopup(false);
        //   //handleSaveOrSubmitAttendance('submit');
        //   handleDeleteAttendance(record.AttendanceID);
        //   // setEmail('');
        //   // setPassword('');
        // }},
      ]);
      //console.log('Error Popup State:', { popupType, popupTitle, popupMessage, popupButtons });
      setShowAlertPopup(true);

    }

  }

    if (isUploadSuccessful && perform_Operation) {
      loadCourseContents(courseOfferingID);
      // setLectureMaterialsMap((prev) => {
      //   const courseId = selectedCourse.courseOfferingID;
      //   const existingMaterials = prev[courseId] || [];
      //   const existingIndex = existingMaterials.findIndex((item) => item.id === data.id);

      //   const updatedMaterials =
      //     existingIndex !== -1
      //       ? [
      //           ...existingMaterials.slice(0, existingIndex),
      //           data,
      //           ...existingMaterials.slice(existingIndex + 1),
      //         ]
      //       : [...existingMaterials, data];

      //   return {
      //     ...prev,
      //     [courseId]: updatedMaterials,
      //   };
      // });
    }
  }
};


//ENDS pop-up handle for course content adding


//   // popup Handle other types (assignment, project, quiz) if needed


    

// Add these state variables at the top of the TeacherPortal component
const [modalVisible, setModalVisible] = useState(false);
const [modalType, setModalType] = useState<ItemType | null>(null);
const [modalInitialData, setModalInitialData] = useState<any>(null);



//provided by aleena
const { facultyId, isHODView,isAdminView } = route.params || {};


//// Read from navigation params
//const route = useRoute<any>();  // top-level in the component
const facultyIdParam = parseInt(route.params?.facultyId || '-1', 10);
const isHODViewParam = route.params?.isHODView === 'true' || route.params?.isHODView === true;
const isAdminViewParam = route.params?.isAdminView === 'true' || route.params?.isAdminView === true;

  // // For DYNAMIC courses keep this BUT For STATIC Comment it
  const [courses, setCourses] = useState<Course[]>(centralData.courses);

  


//   useEffect(() => {
//   const getFullName = async () => {
//     try {
//       const userInfoString = await AsyncStorage.getItem('userInfo');
//       if (userInfoString !== null) {
//         const userInfo = JSON.parse(userInfoString);
//         const fullName = userInfo.fullName;
//         console.log('Full Name:', fullName);
//         setLoggedInUserName(fullName + ' ('+userInfo.role+')');
//        // return fullName;
//       } else {
//         console.log('No userInfo found in AsyncStorage');
//         //return null;
//       }
//     } catch (error) {
//       console.error('Error reading fullName from AsyncStorage', error);
//      // return null;
//     }
//   };

//   getFullName(); // Call the async function
// }, []);


useEffect(() => {
  const { activeTab, courseOfferingID } = route.params || {};

 

  // Set activeTab from route params
  if (activeTab) {
    setActiveTab(activeTab);
  }

  // Set selectedCourse based on courseOfferingID
  if (courseOfferingID) {
    const course = courses.find((c) => c.courseOfferingID === courseOfferingID);
    if (course) {
      setSelectedCourse(course);
      centralData.selectedCourseOfferingID = courseOfferingID;
      loadCourseContents(courseOfferingID);
    } else {
      console.warn(`Course with courseOfferingID ${courseOfferingID} not found`);
    }
  }
}, [route.params, courses]);

useEffect(() => {
  const loadCourses = async () => {
    try {
      setLoading(true);

      const token = await AsyncStorage.getItem('token');
      if (!token) {
        console.warn('No access token found, redirecting to login');
        navigation.replace('TeacherLogin');
        return;
      }

      let filteredCourses: Course[] = [];

      // //Commenting STATIC Mode for COURSES
      // if (config.WorkingMode === 'StaticData') {
      //   filteredCourses = centralData.courses;
      //   if (facultyId && isHODView) {
      //     filteredCourses = centralData.courses.filter((c) => c.facultyId === facultyIdParam.toString());
      //   }
      //   if (filteredCourses.length === 0) {
      //     setErrorMessage('No teaching assignments found for selected faculty.');
      //     setCourses([]);
      //   } else {
      //     setCourses(filteredCourses);
      //     setErrorMessage(null);
      //   }
      //   return;
      // }

      const facultyQuery = facultyIdParam > 0 ? facultyIdParam : -1;
      if (!config.BASE_URL) {
        throw new Error('BASE_URL is not configured');
      }

      const response = await fetch(`${config.BASE_URL}/api/Course/GetAssignedCourses/${facultyQuery}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 401) {
        console.warn('Unauthorized access, redirecting to login');
        setErrorMessage('Unauthorized: Please login again.');
        navigation.navigate('TeacherLogin');
        setCourses([]);
        return;
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API request failed: ${errorText || response.statusText}`);
      }

      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        throw new Error(`Invalid JSON response: ${(jsonError as Error).message}`);
      }

      // Extract session name
      const currentSessionName = data.assignedCourses?.currentSession || '(Session Not Fetched)'; // || null;
      setCurrentSession(currentSessionName); 


      if (!data?.assignedCourses?.courses) {
        setErrorMessage(data.message || 'No teaching history found in current session.');
        setCourses([]);
        return;
      }

      const courses: Course[] = data.assignedCourses.courses.map((c: any) => ({
        courseOfferingID: c.courseOfferingID,
        courseNo: c.courseNo,
        courseName: c.courseName,
        credits: c.credits,
        students: c.students,
        studentRollNos: Array.isArray(c.studentRollNos) ? c.studentRollNos : [],
        facultyId: c.facultyId,

 creditHours_Practical : c.CreditHours_Practical,
 creditHours_Theory : c.CreditHours_Theory,
 hasPractical : c.hasPractical,

 facultyName:c.facultyName,

      }));

      setCourses(courses);
      setErrorMessage(null);

      // Auto-select course if courseOfferingID is provided
      if (route.params?.courseOfferingID) {
        const course = courses.find((c) => c.courseOfferingID === route.params.courseOfferingID);
        if (course) {
          setSelectedCourse(course);
          centralData.selectedCourseOfferingID = route.params.courseOfferingID;
          loadCourseContents(route.params.courseOfferingID);
        }
      }
    } catch (error) {
      console.error('Error loading courses:', error);
      setErrorMessage(`Error: ${error instanceof Error ? error.message : String(error)}`);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  loadCourses();
}, [facultyIdParam, isHODViewParam, route.params]);





  const [newMaterialTitle, setNewMaterialTitle] = useState('');
const [newMaterialFile, setNewMaterialFile] = useState('');
const [newMaterialDesc, setNewMaterialDesc] = useState('');
const [useUrl, setUseUrl] = useState(false); // checkbox/toggle for URL vs attachment



  

  // const [LoggedIn_UserName, setLoggedInUserName] = useState<string>('');


 const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [activeTab, setActiveTab] = useState<string>('Course Content');
    const [hoveredCourse, setHoveredCourse] = useState<string | null>(null);
  const [mode, setMode] = useState<'mark' | 'view' | 'ReadOnly view'>('mark');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showAttendanceSummary, setShowAttendanceSummary] = useState<boolean>(true);
    const [showStudentsList, setShowStudentsList] = useState<boolean>(false);
    const [showSummary, setShowSummary] = useState<boolean>(true);


const [MainAttendance_isDisabled, set_MainAttendance_isDisabled] = useState<boolean>(false);
const [MainAttendance_show_UnLockedSign, set_MainAttendance_show_UnLockedSign] = useState<boolean>(false);
const [MainAttendance_isSubmitted, set_MainAttendance_isSubmitted] = useState<boolean>(false);

  //const [attendanceRecords, setAttendanceRecords] = useState<{ [key: number]: AttendanceRecord[] }>(centralData.attendanceRecords);
  const [attendanceRecords, setAttendanceRecords] = useState<{ [key: number]: AttendanceRecord[] }>({});

  
 const [groupsMap, setGroupsMap] = useState<{ [key: number]: Group[] }>(centralData.groups);

  const [assignmentsMap, setAssignmentsMap] = useState<{ [key: number]: Assignment[] }>(centralData.assignments);
  const [quizzesMap, setQuizzesMap] = useState<{ [key: number]: Quiz[] }>(centralData.quizzes);
  const [projectsMap, setProjectsMap] = useState<{ [key: number]: Project }>(centralData.projects);
  const [gradesMap, setGradesMap] = useState<{ [key: number]: { [rollNo: string]: any } }>(centralData.grades);

  const [quizQuestionsMap, setQuizQuestionsMap] = useState<{ [key: number]: QuizQuestion[] }>(centralData.quizQuestions);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    questionText: '',
    choice1: '',
    choice2: '',
    choice3: '',
    choice4: '',
    choice5: '',
  });

  const [attendanceData, setAttendanceData] = useState<{
    teachers: Teacher[];
    students: Student[];
  }>({
    teachers: [
      { id: 'T001', name: 'Dr. Ali Rehman', status: 'Present' },
      { id: 'T002', name: 'Prof. Sana Malik', status: 'On Leave' },
    ],
    students: [
      { id: 'S001', name: 'Ahmed Khan', status: 'Present' },
      { id: 'S002', name: 'Sara Ali', status: 'Absent' },
      { id: 'S003', name: 'Omar Malik', status: 'On Leave' },
    ],
  });


  

  const formatDate = (date: Date | string): string => {
    return new Date(date).toLocaleDateString('en-CA');
  };
    const [hoveredWeek, setHoveredWeek] = useState<string | null>(null);
    // const [hoveredAttachment, setHoveredAttachment] = useState<string | null>(null);
    // const [isAddButtonHovered, setIsAddButtonHovered] = useState(false);
  

  const [expandedWeeks, setExpandedWeeks] = useState<{ [key: string]: boolean }>({});

  
  useEffect(() => {
  const fetchCourses = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        navigation.replace('TeacherLogin');
        return;
      }


//       // Handle StaticData Mode
// //Commenting STATIC Mode for COURSES

//       // Check if running in StaticData mode
//       if (config.WorkingMode === 'StaticData') {
//         const staticCourses: Course[] = [
//           {
//             courseOfferingID: 453,
//             courseNo: 'CS101',
//             courseName: 'Intro to Programming',
//             credits: 3,
//             students: 2,
//             studentRollNos: ['001', '002'],
//             facultyId: 1
//           },
//           {
//             courseOfferingID: 7364,
//             courseNo: 'CS102',
//             courseName: 'Data Structures',
//             credits: 3,
//             students: 3,
//             studentRollNos: ['003', '004', '005'],
//             facultyId: 1
//           },
//           {
//             courseOfferingID: 4564,
//             courseNo: 'Bio 102',
//             courseName: 'Bio',
//             credits: 3,
//             students: 3,
//             studentRollNos: ['003', '004', '005'],
//             facultyId: 2
//           }
//         ];

//          let filteredCourses = staticCourses;

//         if (facultyIdParam > 0 && isHODViewParam) {
//           filteredCourses = staticCourses.filter(c => c.facultyId === facultyIdParam);
//         }

//         if (filteredCourses.length === 0) {
//           Alert.alert("No Courses", "No teaching assignments found for selected faculty.");
//         }

//           setCourses(filteredCourses);
//         //// setCourses(staticCourses);
//         return;
//       }


         // API MODE
      const facultyQuery = facultyIdParam > 0 ? facultyIdParam : -1;

      const response = await fetch(`${config.BASE_URL}/api/Course/GetAssignedCourses/${facultyQuery}`, // use option 1 route style 
        {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

if (response.status === 401) {
    //Alert.alert("Unauthorized", "You are not authorized. Please login again.");

 setPopupAlertType('error');
      setPopupAlertTitle('Un-Authorized'); // Set custom title
      setPopupAlertMessage("You are not authorized to access data.");
      setPopupAlertButtons([
        { text: 'Ok', onPress: () => setShowAlertPopup(false) },
        // { text: 'Yes', onPress: () => {
        //   setShowAlertPopup(false);
        //   //handleSaveOrSubmitAttendance('submit');
        //   handleDeleteAttendance(record.AttendanceID);
        //   // setEmail('');
        //   // setPassword('');
        // }},
      ]);
      //console.log('Error Popup State:', { popupType, popupTitle, popupMessage, popupButtons });
      setShowAlertPopup(true);


    navigation.navigate('TeacherLogin');
  } else if (!response.ok) {
    const message = await response.text();
console.log("un-expected error occured "+message);
    //Alert.alert("Error", `Unexpected error: ${message}`);

 setPopupAlertType('error');
      setPopupAlertTitle('Error !!'); // Set custom title
      setPopupAlertMessage("Un-expected error occured while accessing data.");
      setPopupAlertButtons([
        { text: 'Ok', onPress: () => setShowAlertPopup(false) },
        // { text: 'Yes', onPress: () => {
        //   setShowAlertPopup(false);
        //   //handleSaveOrSubmitAttendance('submit');
        //   handleDeleteAttendance(record.AttendanceID);
        //   // setEmail('');
        //   // setPassword('');
        // }},
      ]);
      //console.log('Error Popup State:', { popupType, popupTitle, popupMessage, popupButtons });
      setShowAlertPopup(true);




  }
  else
  {
      //const data = await response.json();
      ////Previously correctly working logic
      // if (data?.assignedCourses?.courses) {
      //   setCourses(data.assignedCourses.courses);
      // } else {
      //   console.warn(data.message || 'No teaching history');
      // }


      const data = await response.json();

if (data?.assignedCourses?.courses) {
  const courses: Course[] = data.assignedCourses.courses.map((c: any) => ({

    courseOfferingID: c.courseOfferingID,
    courseNo: c.courseNo,
    courseName: c.courseName,
    credits: c.credits,
    students: c.students,
    studentRollNos: Array.isArray(c.studentRollNos) ? c.studentRollNos : [],
    facultyId: c.facultyId,

     creditHours_Practical : c.CreditHours_Practical,
 creditHours_Theory : c.CreditHours_Theory,
 hasPractical : c.hasPractical,

 facultyName:c.facultyName,

  }));
  setCourses(courses);
} else {
  console.warn(data.message || 'No teaching history');
  //Alert.alert('Error', data.message);

   setPopupAlertType('confirmation');
      setPopupAlertTitle('Teaching History'); // Set custom title
      setPopupAlertMessage("No teaching histroy found");
      setPopupAlertButtons([
        { text: 'Ok', onPress: () => setShowAlertPopup(false) },
        // { text: 'Yes', onPress: () => {
        //   setShowAlertPopup(false);
        //   //handleSaveOrSubmitAttendance('submit');
        //   handleDeleteAttendance(record.AttendanceID);
        //   // setEmail('');
        //   // setPassword('');
        // }},
      ]);
      //console.log('Error Popup State:', { popupType, popupTitle, popupMessage, popupButtons });
      setShowAlertPopup(true);
      
}

    }

    } catch (error) {
      console.error('Failed to load courses:', error);
      //Alert.alert('Error', error);
       setPopupAlertType('error');
      setPopupAlertTitle('Loading Courses'); // Set custom title
      setPopupAlertMessage("Failed to load courses !!");
      setPopupAlertButtons([
        { text: 'Ok', onPress: () => setShowAlertPopup(false) },
        // { text: 'Yes', onPress: () => {
        //   setShowAlertPopup(false);
        //   //handleSaveOrSubmitAttendance('submit');
        //   handleDeleteAttendance(record.AttendanceID);
        //   // setEmail('');
        //   // setPassword('');
        // }},
      ]);
      //console.log('Error Popup State:', { popupType, popupTitle, popupMessage, popupButtons });
      setShowAlertPopup(true);

    }
  };

  fetchCourses();
}, [facultyIdParam, isHODViewParam]);


const [lectureMaterialsMap, setLectureMaterialsMap] = useState<{ [key: number]: LectureMaterial[] }>({});


const loadCourseContents = async (courseOfferingID: number) => {
  try {

    const token = await AsyncStorage.getItem('token');
    const response = await fetch(`${config.BASE_URL}/api/Course/GetCourseContents/${courseOfferingID}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const json = await response.json();

    if (!json.status || !json.data?.contents) {
      console.warn(json.message || 'Unauthorized or no data');
      return;
    }

    // const contents = json.data.contents.map((c: any) => ({
    //   id: c.c_Content_ID.toString(),
    //   title: c.content_Title,
    //   file: c.link_OR_AttachmentPath || '',
    //   isURL : String(c.Has_URL).toLowerCase() === 'true' ,
    //   isAttachment : String(c.Has_Attachment).toLowerCase() === 'true',
    // }));

     const contents = json.data.contents.map((c: any) => ({
      id: String(c.c_Content_ID),
      title: c.content_Title || '',
      file: c.link_OR_AttachmentPath || '',
      isURL: !!(c.has_URL === true || c.has_URL === 1 || String(c.has_URL).toLowerCase() === 'true'),
      isAttachment: !!(c.has_Attachment === true || c.has_Attachment === 1 || String(c.has_Attachment).toLowerCase() === 'true'),
      learningWeek: c.learningWeek || 'Week-1',
      description : c.content_Description,
    }));

    // learningWeek || 'Week-1'

    setLectureMaterialsMap(prev => ({
      ...prev,
      [courseOfferingID]: contents,
    }));
  } catch (err) {
    console.error('Error loading contents', err);
  }
};




const downloadOrOpenAttachment = async (contentId, courseOfferId) => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      showAlert('Auth Error', 'User token not found','error');
      return;
    }

    const downloadUrl = `${config.BASE_URL}/api/Course/DownloadAttachment_CourseContent/${contentId}/${courseOfferId}`;

    if (Platform.OS === 'web') {
      // Fetch file manually with token
      const response = await fetch(downloadUrl, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        showAlert('Download Failed', `Server responded with status ${response.status}`,'error');
        return;
      }

      const blob = await response.blob();
      const fileName = response.headers.get('Content-Disposition')?.split('filename=')[1] || `attachment_${Date.now()}`;
      const blobUrl = window.URL.createObjectURL(blob);

      // Trigger download
      const link = document.createElement('a');
      link.href = blobUrl;
      link.setAttribute('download', fileName.replace(/"/g, '')); // remove quotes if present
      document.body.appendChild(link);
      link.click();
      link.remove();

    } else {
      // Mobile logic (unchanged)
      const fileUri = FileSystem.documentDirectory + `attachment_${contentId}_${Date.now()}`;
      const downloadResumable = FileSystem.createDownloadResumable(
        downloadUrl,
        fileUri,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { uri, status } = await downloadResumable.downloadAsync();

      if (status === 200) {
      //  Alert.alert('Download Complete', `File saved to:\n${uri}`);
      } else {
       // Alert.alert('Download Failed', 'Could not download the file.');
      }
    }
  } catch (error) {
    console.error(error);
    showAlert('Error', 'Something went wrong while downloading the file.','error');
  }
};


// Reusable alert function
const showAlert = (title, message,getType) => {

 setPopupAlertType(getType);
      setPopupAlertTitle(title); // Set custom title
      setPopupAlertMessage(message);
      setPopupAlertButtons([
        { text: 'Ok', onPress: () => setShowAlertPopup(false) },
        // { text: 'Yes', onPress: () => {
        //   setShowAlertPopup(false);
        //   //handleSaveOrSubmitAttendance('submit');
        //   handleDeleteAttendance(record.AttendanceID);
        //   // setEmail('');
        //   // setPassword('');
        // }},
      ]);
      //console.log('Error Popup State:', { popupType, popupTitle, popupMessage, popupButtons });
      setShowAlertPopup(true);



  // if (Platform.OS === 'web') {
  //   window.alert(`${title}\n\n${message}`);
  // } else {
  //   Alert.alert(title, message);
  // }
};





 //const [studentsMap, setStudentsMap] = useState<{ [key: number]: Student[] }>(centralData.studentsMap);
const [studentsMap, setStudentsMap] = useState<{ [key: number]: Student[] }>({});

const loadStudentsAndAttendance = async (courseOfferingID, selectedDate) => {
  try {

    console.log('loading attendance for course offerID', courseOfferingID);
   const token = await AsyncStorage.getItem('token');
     const response = await fetch(`${config.BASE_URL}/api/Attendance/Detail?courseOfferId=${courseOfferingID}&date=${new Date(selectedDate).toLocaleDateString('en-CA')}`, 
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

    if (!response.ok) {
      throw new Error('Failed to load attendance data');
    }
    const data = await response.json();

    // Assuming data format:
    // { students: [{ id, name, status }], submitted: boolean, lastModified: timestamp, AID: attendanceId }

    setCurrentStudents(data.students || []);
    //setIsSubmitted(data.submitted);
   setAttendanceRecordId(data.AttendanceDate); // to use when saving or submitting
    setLastModified(data.updatedDate);

    

  } catch (error) {
    console.error('Error loading attendance:', error);
    alert('Error loading attendance data. Please try again.');
  }
};


// //New 4 June 2024
// const handleSaveAttendance = async (attendanceRecordId,selectedCourseId) => {
//   try {
//     const token = await AsyncStorage.getItem('token');
//     if (!token) {
//       alert('User not authenticated.');
//       return;
//     }

//     const formattedDate = new Date(selectedDate).toISOString().split('T')[0];


//       console.log('Save Attendance button pressed', {
//     selectedCourse: selectedCourse?.courseOfferingID,
//     selectedDate: formattedDate, // Now safe to use
//     currentStudents: currentStudents.length,
//   });

//   // Validate prerequisites
//   if (!selectedCourse) {
//     console.warn('No course selected');
//     Alert.alert('Error', 'No course selected.');
//     return;
//   }

//     const courseRecords = attendanceRecords[selectedCourse.courseOfferingID] || [];
//   const existingRecord = courseRecords.find((record) => record.A_Date === formattedDate);

// // Use its ID if found; otherwise 0
// const attendanceId = existingRecord?.AID ? parseInt(existingRecord.AID) : 0;

//    const payload = {
//   AttendanceID:  attendanceId,
//   CourseOfferID: selectedCourseId,
//   A_Date: formattedDate,
//   Status: 'Saved', // or 'Submitted'
//   LastModified: new Date().toISOString(),
//   ModifiedBy: 1, // replace with actual logged-in user ID

//   Details: currentStudents.map((s) => ({
//     DetailID: s.detailID ?? 0,
//     AttendanceID: attendanceId, // not required if you're inserting
//     StudentID: s.id ?? '',
//     RollNo: s.rollNo ?? '',
//     Email: s.email ?? '',
//     Name: s.name ?? '',
//     Status: s.status ?? 'NotMarked', // "Present", "Absent", "Leave"
//     Remarks: s.remarks ?? '',
//   })),
// };
     
      
//  const res = await fetch(`${config.BASE_URL}/api/attendance/save`, {
//       method: 'POST',
//       headers: {
//         'Authorization': `Bearer ${token}`,
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(payload),
//     });

//     if (!res.ok) {
//       throw new Error(`Server responded with status ${res.status}`);
//     }

//     //const response = await res.json();
//     alert('Attendance saved successfully');

//     loadAttendanceFromAPI_ALL(selectedCourseId); // Refresh list

//     //Redirect to attendance summary
//     setShowAttendanceSummary(true);

//   } catch (error) {
//     console.error('Error saving attendance:', error);
//     alert('Error saving attendance. Please try again.');
//   }
// };

// // 5 June 2025   | 5 AM | handleViewAttendance
// const handleViewAttendance = async (AID,date) => {
//   try {
   
//     if (!selectedCourse) return;
//   setMode('ReadOnly view');
//   setSelectedDate(new Date(date));

//   if (config.WorkingMode === 'StaticData') {
//   const courseRecords = attendanceRecords[selectedCourse.courseOfferingID] || [];
//   setCurrentStudents(
//     courseRecords.find((record) => record.A_Date === date)?.students || []
//   );
//   }
//   else
//   {
//     loadAttendanceFromAPI(selectedCourse.courseOfferingID,AID,date);
//   }



//   setShowAttendanceSummary(false);


//   } catch (error) {
//     console.error('Error viewing attendance:', error);
//     alert('Error viewing attendance. Please try again.');
//   }
// };





//New 4 June 2024
const handleDeleteAttendance = async (attendanceId) => {



  let error_occured=false;


  try {
   // const response = await fetch(`${config.BASE_URL}/api/attendance/submit/${attendanceId}`, {
   //   method: 'PUT', // or PATCH
   // });
     const token = await AsyncStorage.getItem('token');
     const response = await fetch(`${config.BASE_URL}/api/attendance/delete/${attendanceId}`, 
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

    if (!response.ok) {
      throw new Error('Failed to delete attendance & attendance details');
    }

   // alert('Attendance & its details deleted successfully');
   

 


    //loadStudentsAndAttendance(selectedCourseId,new Date(selectedDate).toISOString().split('T')[0]);


  } catch (error) {
    console.error('Error deleting attendance:', error);
    // alert('Error deleting attendance. Please try again.');

     error_occured=true;

     


  }
finally
{
//// // reload the attendance summary to update status
//   ///loadAttendanceSummary(courseOfferingID);

   ////Previously this was called
   //loadAttendanceFromAPI_ALL(courseOfferingID);
}

  if(error_occured)
  {
  setPopupAlertType('error');
      setPopupAlertTitle('Deleting Attendance'); // Set custom title
      setPopupAlertMessage("Error in deleting attendance & it's details. Please try agian.");
      setPopupAlertButtons([
        { text: 'Ok', onPress: () => setShowAlertPopup(false) },
        // { text: 'Yes', onPress: () => {
        //   setShowAlertPopup(false);
        //   //handleSaveOrSubmitAttendance('submit');
        //   handleDeleteAttendance(record.AttendanceID);
        //   // setEmail('');
        //   // setPassword('');
        // }},
      ]);
      //console.log('Error Popup State:', { popupType, popupTitle, popupMessage, popupButtons });
      setShowAlertPopup(true);
  
  }
  else {
  
     setPopupAlertType('success');
      setPopupAlertTitle('Record Deleted'); // Set custom title
      setPopupAlertMessage("Attendance & it's details deleted successfully !!");
      setPopupAlertButtons([
        { text: 'Ok', onPress: () =>{ setShowAlertPopup(false);  loadAttendanceFromAPI_ALL(courseOfferingID); } },
        // { text: 'Yes', onPress: () => {
        //   setShowAlertPopup(false);
        //   //handleSaveOrSubmitAttendance('submit');
        //   handleDeleteAttendance(record.AttendanceID);
        //   // setEmail('');
        //   // setPassword('');
        // }},
      ]);
      //console.log('Error Popup State:', { popupType, popupTitle, popupMessage, popupButtons });
      setShowAlertPopup(true);
  
  }


};











////// This method submits attendance from Main Grid options
//New 4 June 2024
const handleSubmitAttendance = async (attendanceId) => {
  try {
   // const response = await fetch(`${config.BASE_URL}/api/attendance/submit/${attendanceId}`, {
   //   method: 'PUT', // or PATCH
   // });
     const token = await AsyncStorage.getItem('token');
     const response = await fetch(`${config.BASE_URL}/api/attendance/submit/${attendanceId}`, 
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

    if (!response.ok) {
      throw new Error('Failed to submit attendance');
    }

    //alert('Attendance submitted successfully');
     setPopupAlertType('success');
      setPopupAlertTitle('Submitted'); // Set custom title
      setPopupAlertMessage("Attendance submitted successfuly.");
      setPopupAlertButtons([
        { text: 'Ok', onPress: () => {setShowAlertPopup(false);  loadAttendanceFromAPI_ALL(courseOfferingID);} },
        // { text: 'Yes', onPress: () => {
        //   setShowAlertPopup(false);
        //   //handleSaveOrSubmitAttendance('submit');
        //   handleDeleteAttendance(record.AttendanceID);
        //   // setEmail('');
        //   // setPassword('');
        // }},
      ]);
      //console.log('Error Popup State:', { popupType, popupTitle, popupMessage, popupButtons });
      setShowAlertPopup(true);

    

  } catch (error) {
    console.error('Error submitting attendance:', error);
    //alert('Error submitting attendance. Please try again.');

     setPopupAlertType('error');
      setPopupAlertTitle('Error Occured !'); // Set custom title
      setPopupAlertMessage("Error occured in submitting attendance. Please try again later.");
      setPopupAlertButtons([
        { text: 'Ok', onPress: () => setShowAlertPopup(false) },
        // { text: 'Yes', onPress: () => {
        //   setShowAlertPopup(false);
        //   //handleSaveOrSubmitAttendance('submit');
        //   handleDeleteAttendance(record.AttendanceID);
        //   // setEmail('');
        //   // setPassword('');
        // }},
      ]);
      //console.log('Error Popup State:', { popupType, popupTitle, popupMessage, popupButtons });
      setShowAlertPopup(true);

  }
  finally
{
// // reload the attendance summary to update status
   //loadAttendanceSummary(courseOfferingID);

}


};


// Below is CORRECT working but picks ALL ATTENDANCE Summary & Detail
//Updated Method FK | 4 June 2025 | 10 PM


//New method FK 30 June 2025
const handleViewAttendance = async (attendanceId, attendanceDate) => {
  try {
    setMode('View');
    setIsEditing(false);
    setCurrentAttendanceID(attendanceId);
   // setShowAttendanceSummary(false);

    const token = await AsyncStorage.getItem('token');
    const res = await fetch(`${config.BASE_URL}/api/attendance/GetAttendanceByID/${attendanceId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!res.ok) throw new Error('Failed to fetch attendance for view');

    const record = await res.json();


//Previous view record

    
//     //// Set all fields (read-only)
//     //setDate(new Date(record.attendanceDate));
// setDate(record.attendanceDate);
//     setStartTime(record.startTime);
//     setEndTime(record.endTime);
//     setSubjectType(record.isTheory ? 'Theory' : 'Practical');
//     setGlobalComments(record.remarks || '');
//     setCurrentStudents(
//       record.students.map((s) => ({
//         id: s.studentId,
//         name: s.name,
//         email: s.email || '',
//         status: s.status || 'Absent',
//         comments: s.remarks || '',
//         isEditable:s.isEditable || true,
//         attendancePercentage: s.attendancePercentage || '0%',
//       }))
//     );




//New record fetching 
     // Set all fields
    ////setDate(new Date(record.attendanceDate)); // date locked in edit
    setDate(record.attendanceDate); // date locked in edit

    //setStartTime(record.startTime);
    const [start_hours, start_minutes] = record.startTime.split(':');
     setStartHour(start_hours);
    setStartMinute(start_minutes);

//console.log('Hours:', hours);   // → "09"
//console.log('Minutes:', minutes); // → "00"

   
    
    //setEndTime(record.endTime);
    const [end_hours, end_minutes] = record.endTime.split(':');

    setEndHour(end_hours);
    setEndMinute(end_minutes);

    //Time validation trigger
    setIsDataReady(true); // trigger validation only after setting is done
     setIsEditDataReady(true);


    setSubjectType(record.isTheory ? 'Theory' : 'Practical');
    setGlobalComments(record.remarks || '');
    setCurrentStudents(
      record.students.map((s) => ({
        id: s.studentId,
        name: s.name,
        email: s.email || '',
        status: s.status || 'Absent',
        comments: s.remarks || '',
         isEditable:s.isEditable===true ||s.isEditable==='true' || false,
        attendancePercentage: s.attendancePercentage || '0%',
      }))
    );



    setShowAttendanceSummary(false);





  } catch (err) {
    console.error("Loading view "+err);
    //alert('Error loading attendance for view');
     setPopupAlertType('error');
      setPopupAlertTitle('Loading View'); // Set custom title
      setPopupAlertMessage("Error in loading attendance view");
      setPopupAlertButtons([
        { text: 'Ok', onPress: () => setShowAlertPopup(false) },
        // { text: 'Yes', onPress: () => {
        //   setShowAlertPopup(false);
        //   //handleSaveOrSubmitAttendance('submit');
        //   handleDeleteAttendance(record.AttendanceID);
        //   // setEmail('');
        //   // setPassword('');
        // }},
      ]);
      //console.log('Error Popup State:', { popupType, popupTitle, popupMessage, popupButtons });
      setShowAlertPopup(true);

  }
};






////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////

const handleUnlockAttendance = async (attendanceId, attendanceDate) => {
  try {
   
    
///////////////////////////////////////////////////////////////////////////////////


    setMode('View');
    setIsEditing(false);
    setCurrentAttendanceID(attendanceId);
   // setShowAttendanceSummary(false);

    const token = await AsyncStorage.getItem('token');
    const res = await fetch(`${config.BASE_URL}/api/attendance/GetAttendanceByID/${attendanceId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!res.ok) throw new Error('Failed to fetch attendance for unlock');

    const record = await res.json();

    ////setDate(new Date(record.attendanceDate)); // date locked in edit
    setDate(record.attendanceDate); // date locked in edit

    //setStartTime(record.startTime);
    const [start_hours, start_minutes] = record.startTime.split(':');
     setStartHour(start_hours);
    setStartMinute(start_minutes);

//console.log('Hours:', hours);   // → "09"
//console.log('Minutes:', minutes); // → "00"

   
    //setEndTime(record.endTime);
    const [end_hours, end_minutes] = record.endTime.split(':');

    setEndHour(end_hours);
    setEndMinute(end_minutes);

    //Time validation trigger
    setIsDataReady(true); // trigger validation only after setting is done
     setIsEditDataReady(true);


    setSubjectType(record.isTheory ? 'Theory' : 'Practical');
    setGlobalComments(record.remarks || '');
    setCurrentStudents(
      record.students.map((s) => ({
        id: s.studentId,
        name: s.name,
        email: s.email || '',
        status: s.status || 'Absent',
        comments: s.remarks || '',
         isEditable:s.isEditable===true ||s.isEditable==='true' || false,
        attendancePercentage: s.attendancePercentage || '0%',
      }))
    );


     //Previous Working
    setShowSelectStudentsTable(true);
    setShowAttendanceSummary(false);


  } catch (err) {
    console.error("Loading unlock error "+err);
    //alert('Error loading attendance for view');
     setPopupAlertType('error');
      setPopupAlertTitle('Loading unlock'); // Set custom title
      setPopupAlertMessage("Error in loading unlock attendance view");
      setPopupAlertButtons([
        { text: 'Ok', onPress: () => setShowAlertPopup(false) },
        // { text: 'Yes', onPress: () => {
        //   setShowAlertPopup(false);
        //   //handleSaveOrSubmitAttendance('submit');
        //   handleDeleteAttendance(record.AttendanceID);
        //   // setEmail('');
        //   // setPassword('');
        // }},
      ]);
      //console.log('Error Popup State:', { popupType, popupTitle, popupMessage, popupButtons });
      setShowAlertPopup(true);

  }
};




/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////







// //replaced by above FK
// //Previous view Attendance
// const handleViewAttendance = (attendanceID, attendanceDate) => {
//   const record = findAttendanceRecordByDate(new Date(attendanceDate));
//   if (record) {
//     setDate(new Date(record.AttendanceDate));
//     setSubjectType(record.SubjectType || 'Theory');
//     setStartTime(record.StartTime || '00:00');
//     setEndTime(record.EndTime || '00:00');
//     setGlobalComments(record.GlobalComments || '');
//     setCurrentStudents(
//       record.students.map((student) => ({
//         id: student.id,
//         name: student.name,
//         status: student.Status,
//         comments: student.Comments || '',
//         attendancePercentage: courseDetails.students.find((s) => s.id === student.id)?.attendancePercentage,
//       }))
//     );
//     setCurrentAttendanceID(attendanceID);
//     setMode('View'); // Set to view-only mode
//     setIsEditing(false); // Not editing
//     setShowAttendanceSummary(false); // Show detailed view
//   } else {
//     alert('Attendance record not found.');
//   }
// };










//Above Aleena Method New ENDS
//Fk updating 1 | 30 June 25 at 8:20AM
const loadAttendanceFromAPI_ALL = async (courseOfferId: number) => {
  try {
    console.log('loadAttendanceFromAPI_ALL Called 1 for '+courseOfferId);
    const token = await AsyncStorage.getItem('token');
     const userInfo = await AsyncStorage.getItem('userInfo');
    const parsed = JSON.parse(userInfo || '{}');

    const res = await fetch(`${config.BASE_URL}/api/attendance/all_detailordefault?courseOfferId=${courseOfferId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

console.log('FK API ALL Method Called 2 for '+courseOfferId);
    if (!res.ok) throw new Error('Failed to load attendances');
    
    const response = await res.json();

    const attendanceList: AttendanceRecord[] = [];
   // const uniqueStudentsMap: { [studentID: string]: Student } = {};


// Read from named tuple keys
//const attendanceListRaw = response.attendanceList;
//const uniqueStudentDetails = response.uniqueStudentDetails;


const attendanceListRaw = Array.isArray(response.attendanceList)
  ? response.attendanceList
  : [];


console.log('Attendance List:', attendanceListRaw);



const uniqueStudentDetails = Array.isArray(response.uniqueStudentDetails)
  ? response.uniqueStudentDetails
  : [];

console.log('Unique Student Details:', uniqueStudentDetails);


// const attendanceList: AttendanceRecord[] = attendanceListRaw.map((record: any) => ({
//   id: record.attendanceID,
//   date: record.attendanceDate,
//   remarks: record.remarks ?? '',
//   isSubmitted: record.isSubmitted ?? false,
//   details: record.details ?? [],
// }));

const uniqueStudentsMap: { [studentID: string]: Student } = {};

// Loop over the second tuple part
for (const student of uniqueStudentDetails) {
  if (!uniqueStudentsMap[student.studentID]) {
    uniqueStudentsMap[student.studentID] = {
      id: student.studentID,
      name: student.name ?? '',
      rollNo: student.rollNo ?? '',
      email: student.email ?? '',
      status: 'NotMarked', // Default value,
      attendancePercentage : student.attendancePercentage || '0%'
    };
  }
}

console.log('FK API ALL for unique '+uniqueStudentsMap);


    // Set unique students
    const uniqueStudentList = Object.values(uniqueStudentsMap);
    setStudentsMap(prev => ({
      ...prev,
      [courseOfferId]: uniqueStudentList,
    }));

    // Optionally set current view to latest students
    setCurrentStudents(uniqueStudentList);




    console.log('unique STUDENT check 1 '+courseOfferId);

    for (const data of attendanceListRaw) {

      if (!Array.isArray(data.details)) continue;

      //Previous Unique Students fetching way
      /* 
      // Collect unique students
      data.details.forEach((d: any) => {
        if (!uniqueStudentsMap[d.studentID]) {
          uniqueStudentsMap[d.studentID] = {
            id: d.studentID,
            name: d.name ?? '',
            rollNo: d.rollNo ?? '',
            email: d.email ?? '',
            status: 'NotMarked', // this is default; override per attendance record
          };
        }
      });
      */






//       // Format students for this attendance record (includes status/remarks)
//       const recordStudents: Student[] = data.details.map((d: any) => ({
//         id: d.studentID,
//         name: d.name ?? '',
//         rollNo: d.rollNo ?? '',
//         email: d.email ?? '',
//         status: d.status ?? 'NotMarked',
//         comments: d.Comments || '',
//   attendancePercentage: d.attendancePercentage,//courseDetails.students.find((s) => s.id === d.studentID)?.attendancePercentage,
//   AttendanceDetailID : d.AttendanceDetailID,
// AttendanceID : d.AttendanceID,
//       }));

//       // const record: AttendanceRecord = {
//       //   AID: data.attendanceID?.toString() ?? '',
//       //   A_Date: data.a_Date,
//       //   students: recordStudents,
//       //   lastModified: data.lastModified ?? new Date().toISOString(),
//       //   submitted: data.status === 'Submitted',
//       // };

const recordStudents: AttendanceDetail[] = data.details.map((d: any) => ({
  AttendanceDetailID: d.attendanceDetailID ?? '0',
  AttendanceID: d.attendanceID ?? '0',
  Student: {
    id: d.studentID,
    name: d.name ?? '',
    rollNo: d.rollNo ?? '',
    email: d.email ?? '',
    status: d.status ?? 'NotMarked',
    isEditable :d.isEditable===true ||d.isEditable==='true' ||false, //d.isEditable ?? true,
    attendancePercentage : d.attendancePercentage ?? '0%',
  },
  Status: d.status ?? 'NotMarked',
  Remarks: d.comments ?? 'Not Available',
}));


       const record: AttendanceRecord = {
        AttendanceID: data.attendanceID?.toString() ?? '0',
AttendanceDate: data.attendanceDate ?? '',

        students: recordStudents,
        //lastModified: data.lastModified ?? new Date().toISOString(),
          Attendance_IsSubmitted: data.status === 'Submitted',
          Attendance_IsSaved: data.status === 'Saved',
          Attendance_CourseOfferID : data.attendance_CourseOfferID,
          Attendance_Status: data.status,
          
          //Fk need checks
         Attendance_StartTime: data.attendance_StartTime ?? '00:00',
Attendance_EndTime: data.attendance_EndTime ?? '00:00',
Attendance_IsTheory: data.attendance_IsTheory ?? true,
Attendance_IsPractical: data.attendance_IsPractical ?? false,
Attendance_Comments: data.attendance_Comments ?? 'Not Available',
Attendance_IsLocked : data.attendance_IsLocked ?? false,

      };













console.log('FK API ALL Method Called 5 for '+courseOfferId);


//FK commented for short time

       if(parsed.isDean || parsed.isHOD || parsed.isRector)
      {

         //For HOD / Dean / Rector CASE
         // //Push only if submitted
         if (record.Attendance_IsSubmitted) {
         attendanceList.push(record);
         }
         else {
          //Also push those attendance which are no more editable & crossed the time bar
          const attendanceDate_record = new Date(record.AttendanceDate); 

          const today_new = new Date();
          // Zero out time parts for both dates
          today_new.setHours(0, 0, 0, 0);
          attendanceDate_record.setHours(0, 0, 0, 0); 
                    
          // Calculate difference in days
          const diffInDays = (today_new - attendanceDate_record) / (1000 * 60 * 60 * 24);
          const isDisabled = (diffInDays > `${config.DaysCount_Attendance_Editable}`) ; // 17;

          if (isDisabled) {
            attendanceList.push(record);
          }

         }
        

       }
      else
      {  //isFaculty    //isStaff  (Admin/Super Admin)
       //For faculty case  & Admin Case push all attendance
        attendanceList.push(record);
      }
     
      
      


    }

    // Update Attendance Records
    setAttendanceRecords(prev => ({
      ...prev,
      [courseOfferId]: attendanceList,
    }));


    //Previous Setting of unique students
// console.log('FK API ALL Method Called 6 for unique '+uniqueStudentsMap);
//     // Set unique students
//     const uniqueStudentList = Object.values(uniqueStudentsMap);
//     setStudentsMap(prev => ({
//       ...prev,
//       [courseOfferId]: uniqueStudentList,
//     }));

//     // Optionally set current view to latest students
//     setCurrentStudents(uniqueStudentList);




  } catch (err) {
    console.error('Error fetching attendance:', err);
    // Alert.alert('Error', 'Failed to load attendance history');

     setPopupAlertType('error');
      setPopupAlertTitle('Fetch attendance'); // Set custom title
      setPopupAlertMessage("Error in fetching attendance history. Please try again.");
      setPopupAlertButtons([
        { text: 'Ok', onPress: () => setShowAlertPopup(false) },
        // { text: 'Yes', onPress: () => {
        //   setShowAlertPopup(false);
        //   //handleSaveOrSubmitAttendance('submit');
        //   handleDeleteAttendance(record.AttendanceID);
        //   // setEmail('');
        //   // setPassword('');
        // }},
      ]);
      //console.log('Error Popup State:', { popupType, popupTitle, popupMessage, popupButtons });
      setShowAlertPopup(true);


  }




};

// Below is CORRECT working but picks only one ATTENDANCE Summary & Detail
//Updated Method FK | 4 June 2025 | 1PM
const loadAttendanceFromAPI = async (courseOfferId: number,Attendance_ID: number,selectedDate: Date ) => { // (courseOfferId: number, selectedDate: Date) => {
  try {

   // setShowAttendanceSummary(false);

    const token = await AsyncStorage.getItem('token');
    const formattedDate = moment(selectedDate).format('YYYY-MM-DD'); //selectedDate.toISOString().split('T')[0];

    // const res = await fetch(`${config.BASE_URL}/api/attendance/detailordefault?courseOfferId=${courseOfferId}&date=${formattedDate}`, {
    //   method: 'GET',
    //   headers: {
    //     'Authorization': `Bearer ${token}`,
    //     'Content-Type': 'application/json',
    //   },
    // });

const res = await fetch(`${config.BASE_URL}/api/attendance/detailordefault?courseOfferId=${courseOfferId}&Attendance_ID=${Attendance_ID}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });



    if (!res.ok) {
      throw new Error('Failed to fetch attendance detail of particular date');
    }

    const data = await res.json();

     // If API returns full object (recommended)
if (!Array.isArray(data.details)) {
  throw new Error('Invalid API response: details not found');
}

// Map students separately only if student info exists in details
const students: Student[] = data.details.map((d: any) => ({
  id: d.studentID,
  name: d.name ?? '',
  status: d.status ?? 'NotMarked',
  rollNo: d.rollNo,
	email : d.email,
  attendancePercentage : d.attendancePercentage || '0%',
}));

//setStudentsMap(prev => ({ ...prev, [courseOfferId]: students }));

const record: AttendanceRecord = {
  AID: data.attendanceID?.toString() ?? '',
  A_Date: formattedDate,
  students: students,
  lastModified: data.lastModified ?? new Date().toISOString(),
  submitted: data.status === 'Submitted',
};

setAttendanceRecords((prev) => ({
  ...prev,
  [courseOfferId]: [record],
}));
setCurrentStudents(students);

  } catch (error) {
    console.error('Error loading attendance for particular date:', error);
    //alert('Failed to load attendance details for particular date');
  }
};





 const loadAttendanceSummary = async (courseOfferId) => {
    try {
//       //const result = await getAttendanceSummary(courseOfferId, token);
//      // setSummary(result);
//  const res = await axios.get(`${API_BASE_URL}/summary/${courseOfferId}`, {
//     headers: { Authorization: `Bearer ${token}` }
//   });

 const token = await AsyncStorage.getItem('token');
      if (!token) {
        console.warn('No access token found, redirecting to login');
        navigation.replace('TeacherLogin');
        return;
      }
   
     const res = await fetch(`${config.BASE_URL}/api/attendance/summary/${courseOfferId}`, 
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

setSummary(res.data);


    } catch (error) {
      console.error('Error fetching summary:', error);
      //Alert.alert('Error', 'Failed to load summary.');
    }
  };

const selectedDateStr = new Date(selectedDate).toLocaleDateString('en-CA'); // Format: "YYYY-MM-DD"

useEffect( () => {
  if (selectedCourse) {
    console.log('useEffect triggered for course', selectedCourse.courseOfferingID);
    console.log('useEffect triggered for course', selectedDate);
    console.log('selectedDate:', selectedDate);
console.log('typeof selectedDate:', typeof selectedDate);
console.log('New Date selectedDate:',  new Date(selectedDate).toLocaleDateString('en-CA'));
console.log('Moment of selectedDate:', moment(selectedDate).format('YYYY-MM-DD'));

    const selectedDateStr = moment(selectedDate).format('YYYY-MM-DD');//new Date(selectedDate).toISOString().split('T')[0];//selectedDate.toISOString().split('T')[0];
 
//   if (config.WorkingMode === 'APIData') {
//   //Picks Summary of All
   loadAttendanceFromAPI_ALL(selectedCourse.courseOfferingID);
//   }

  }
}, [selectedCourse, selectedDate]);

  const courseDetails = {
    //For static //lectureMaterials: selectedCourse ? lectureMaterialsMap[selectedCourse.courseOfferingID] || [] : [],
lectureMaterials: selectedCourse ? lectureMaterialsMap[selectedCourse.courseOfferingID] || [] : [],
    students: selectedCourse ? studentsMap[selectedCourse.courseOfferingID] || [] : [],
    assignments: selectedCourse ? assignmentsMap[selectedCourse.courseOfferingID] || [] : [],
    quizzes: selectedCourse ? quizzesMap[selectedCourse.courseOfferingID] || [] : [],
    project: selectedCourse ? projectsMap[selectedCourse.courseOfferingID] || null : null,
    grades: selectedCourse ? gradesMap[selectedCourse.courseOfferingID] || null : null,
  };



  

  const handleEditClick = (quiz: QuizQuestion) => {
    setEditingId(quiz.id);
    setEditForm({
      questionText: quiz.questionText,
      choice1: quiz.choice1,
      choice2: quiz.choice2,
      choice3: quiz.choice3,
      choice4: quiz.choice4,
      choice5: quiz.choice5,
    });
  };

  const handleSaveClick = (id: string) => {
    setQuizQuestions((prev) =>
      prev.map((quiz) =>
        quiz.id === id ? { ...quiz, ...editForm } : quiz
      )
    );
    setEditingId(null);
  };

  const handleCancelClick = () => {
    setEditingId(null);
  };

  const handleInputChange = (field: string, value: string) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  };



  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Present':
        return <Image source={images.checkCircle} style={{ width: isMobile ? 20 : 20, height: isMobile ? 20 : 20 }} tintColor="#4caf50" />;
      case 'Absent':
        return <Image source={images.closeCircle} style={{ width: isMobile ? 20 : 20, height: isMobile ? 20 : 20 }} tintColor="#f44336" />;
      case 'On Leave':
        return <Image source={images.accountOff} style={{ width: isMobile ? 20 : 20, height: isMobile ? 20 : 20 }} tintColor="#ff9800" />;
      default:
        return <Text>-</Text>;
    }
  };


const resetToDashboard = () => {
  // console.log('TeacherPortal: resetToDashboard called');
  // setSelectedCourse(null); // Reset selected course
  // setActiveTab('Course Content'); // Reset to default tab
  // setShowAttendanceSummary(true); // Reset attendance view if needed
  // centralData.selectedCourseOfferingID = null; // Clear central data
  // navigateSafely('TeacherPortal', { reset: true }); // Navigate with reset flag
  // console.log('TeacherPortal: State reset, navigating to TeacherPortal main screen');

  navigateToRouteSafely('TeacherPortal', { 
    reset: true,
    facultyId: initialParams.facultyId,
    isHODView: initialParams.isHODView,
    isAdminView:initialParams.isAdminView,
  });


};

useEffect(() => {
  const { activeTab, courseOfferingID, reset } = route.params || {};
  console.log('TeacherPortal: useEffect triggered with params', { activeTab, courseOfferingID, reset });

  if (reset) {
    console.log('TeacherPortal: Reset flag detected, clearing state');
    setSelectedCourse(null);
    setActiveTab('Course Content');
    centralData.selectedCourseOfferingID = null;
    return; // Skip further processing
  }

  if (activeTab) {
    setActiveTab(activeTab);
  }

  if (courseOfferingID && !reset) {
    const course = courses.find((c) => c.courseOfferingID === courseOfferingID);
    if (course) {
      console.log('TeacherPortal: Setting selectedCourse', course);
      setSelectedCourse(course);
      centralData.selectedCourseOfferingID = courseOfferingID;
      loadCourseContents(courseOfferingID);
    } else {
      console.warn(`Course with courseOfferingID ${courseOfferingID} not found`);
    }
  }
}, [route.params, courses]);


  const summary = {
    totalCourses: courses?.length || 0,
    totalStudents: courses?.reduce((sum, course) => sum + course.students, 0) || 0,
    notifications: 0,
  };

  const navigateSafely = (route: keyof RootStackParamList, params?: any) => {
    try {
      if (navigation.getState().routeNames.includes(route)) {
        navigation.navigate(route, params);
      } else {
        console.warn(`Route ${route} not found`);
      }
    } catch (error) {
      console.error(`Navigation error: ${(error as Error).message}`);
    }
  };

  const handleMenuPress = (item: { navigateTo: keyof RootStackParamList | string }) => {
    if (item.navigateTo === 'TeacherPortal') {
      setSelectedCourse(null);
      setActiveTab('Course Content');
      setQuizQuestions([]);
      setDiscussionPosts([]);
    } else if (item.navigateTo) {
      navigateSafely(item.navigateTo as keyof RootStackParamList);
    }
  };


const [hoveredAttachment, setHoveredAttachment] = useState<string | null>(null);
const [isAddButtonHovered, setIsAddButtonHovered] = useState(false);


const renderLectureMaterials = () => {
  // Group lecture materials by learningWeek and calculate last updated
  const groupedMaterials = courseDetails.lectureMaterials.reduce((acc, material, index) => {
    const week = material.learningWeek || 'No Week Provided';
    if (!acc[week]) {
      acc[week] = { materials: [], serialNumber: Object.keys(acc).length + 1 };
    }
    acc[week].materials.push(material);
    // Update lastUpdated if material has updatedAt and is more recent
    if (material.updatedAt) {
      const materialDate = new Date(material.updatedAt);
      if (!acc[week].lastUpdated || materialDate > new Date(acc[week].lastUpdated)) {
        acc[week].lastUpdated = material.updatedAt;
      }
    }

    acc[week].weekMaterialCount = acc[week].materials.length;

    return acc;
  }, {});

  const sortedWeeks = Object.keys(groupedMaterials).sort((a, b) => {
    if (a === 'No Week Provided') return 1;
    if (b === 'No Week Provided') return -1;
    const weekNumberA = parseInt(a.match(/\d+/)?.[0] || 0, 10);
    const weekNumberB = parseInt(b.match(/\d+/)?.[0] || 0, 10);
    return weekNumberB - weekNumberA;
  });

  // Toggle week expansion
  const toggleWeek = (week) => {
    setExpandedWeeks(prev => ({
      ...prev,
      [week]: !prev[week]
    }));
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Debug: Log the number of weeks and materials
  console.log('Sorted Weeks:', sortedWeeks);
  console.log('Grouped Materials:', groupedMaterials);

  return (
    <View style={[styles.tableContainerLM]}>
      <View style={[styles.HeaderContainer]}>
        {/* Left Placeholder */}
        {/* Centered Heading */}
        <Text style={[styles.HeaderText]}>
          Lecture Material 
          <Text style={[styles.noteText]}>
            (<Text style={[styles.noteBold]}>Note :</Text> Click on specific week to view its details.)
          </Text>
        </Text>

        <TooltipWrapper tooltipText="Click to Add New Content">
          {/* Right-Aligned Add Button */}
          <TouchableOpacity
            accessible={true}
            accessibilityLabel="Add new lecture material"
            accessibilityRole="button"
            style={[
              styles.addLectureButton,
              Platform.OS === 'web' && !isMobile && isAddButtonHovered && styles.hoverEffect,
            ]}
            onPress={() => {
              setModalType('lectureMaterial');
              setModalInitialData(null);
              setModalVisible(true);
            }}
            {...(Platform.OS === 'web' && !isMobile
              ? {
                  onMouseEnter: () => setIsAddButtonHovered(true),
                  onMouseLeave: () => setIsAddButtonHovered(false),
                }
              : {})}
          >
            <Image source={images.plusCircle} style={[styles.addLectureIcon]} />
            <Text style={[styles.addLectureButtonText]}>Add Lecture Material</Text>
          </TouchableOpacity>
        </TooltipWrapper>
      </View>

      <View style={[styles.tableWrapper]}>
        {/* Learning Week Title and Header */}
        <View style={[styles.tableRowLM, styles.weekTableHeaderLM, styles.fullWidth]}>
          <Text style={[styles.tableCellLM, styles.weekHeaderTextLM, styles.serialColumn]}></Text>
          <Text style={[styles.tableCellLM, styles.weekHeaderTextLM, styles.weekHeaderContent]}>Weekly Content</Text>
          <Text style={[styles.tableCellLM, styles.weekHeaderTextLM, styles.weekHeaderCount]}>Count</Text>
        </View>

        <View style={[styles.tableWrapper]}>
          {sortedWeeks.map((week, weekIndex) => (
            <View key={week} onLayout={() => console.log(`Rendering week: ${week}`)}>
              {/* Week Header Row with Chevron Toggle */}
              <TouchableOpacity
                style={[styles.tableRowLM, styles.weekHeaderRowLM, styles.fullWidth]}
                onPress={() => toggleWeek(week)}
                accessible={true}
                accessibilityLabel={`Toggle ${week} materials`}
                accessibilityRole="button"
                {...(Platform.OS === 'web' && !isMobile
                  ? {
                      onMouseEnter: () => setHoveredWeek(week),
                      onMouseLeave: () => setHoveredWeek(null),
                    }
                  : {})}
              >
                <View style={[styles.serialColumn]}>
                  <Image
                    source={expandedWeeks[week] ? images.minuscircle_white : images.plusCircle}
                    style={[styles.pencilIconLM]}
                  />
                </View>
                <Text style={[
                  styles.tableCellLM, 
                  styles.weekHeaderTextLM,
                  styles.weekHeaderContent,
                  Platform.OS === 'web' && !isMobile && hoveredWeek === week && styles.weekHoverEffect,
                  expandedWeeks[week] && styles.expandedWeekBackground
                ]}>
                  {week}
                </Text>
                <Text style={[styles.tableCellLM, styles.weekHeaderTextLM, styles.weekHeaderCount]}>
                  {groupedMaterials[week].weekMaterialCount}
                </Text>
              </TouchableOpacity>
              <ScrollView
                horizontal={isMobile}
                style={[styles.fullWidth]}
                contentContainerStyle={[styles.scrollContentContainer]}
                showsHorizontalScrollIndicator={isMobile}
                nestedScrollEnabled={isMobile}
                bounces={isMobile}
                scrollEnabled={isMobile} 
              >
                {/* Collapsible Content */}
                {expandedWeeks[week] && (
                  <View style={[styles.tableWrapperExpandedRow]}>
                    <View style={[styles.tableRowLM, styles.tableHeaderexpanded]}>
                      <Text style={[styles.tableCellLM, styles.tableHeaderTextExpanded, styles.serialColumn]}> S# </Text>
                      <Text style={[styles.tableCellLM, styles.tableHeaderTextExpanded, styles.titleColumn]}> Title </Text>
                      <Text style={[styles.tableCellLM, styles.tableHeaderTextExpanded, styles.descriptionColumn]}> Description </Text>
                      <Text style={[styles.tableCellLM, styles.tableHeaderTextExpanded, styles.attachmentColumn]}> Attachment </Text>
                      <Text style={[styles.tableCellLM, styles.tableHeaderTextExpanded, styles.actionsColumn]}> Actions </Text>
                    </View>
                    {/* Lecture Materials for this Week */}
                    {groupedMaterials[week].materials.map((material, index) => (
                      <View key={material.id}
                        style={[styles.tableRowLM, index % 2 === 0 ? styles.tableRowEvenLM : styles.tableRowOddLM]}
                        onLayout={() => console.log(`Rendering material: ${material.id} in week: ${week}`)} >
                        <Text style={[styles.tableCellExpanded, styles.serialColumn]}>
                          {index + 1}.
                        </Text>
                        <Text style={[styles.tableCellExpanded, styles.titleColumn]}
                          accessible={true} accessibilityLabel={`Lecture material title ${material.title}`} numberOfLines={1}
                          ellipsizeMode="tail" > {material.title} </Text>
                        <Text style={[styles.tableCellExpanded, styles.descriptionColumn]}
                          accessible={true} accessibilityLabel={`Description ${material.description || 'No description'}`}
                          numberOfLines={2} ellipsizeMode="tail" >
                          {material.description || '-'}
                        </Text>
                        <View style={[styles.tableCellExpanded, styles.attachmentColumn]}>
                          {/* No Link & No attachment Case - Disabled interaction */}
                          {!material.isURL && !material.file && !material.isAttachment && (
                            <View style={[styles.actionButtonLM, styles.editButtonLM, styles.noAttachmentButton]}>
                              <Image source={images.nothing_circle} style={[styles.pencilIconLM]}/>
                            </View>
                          )}
                          {material.isURL && !material.isAttachment && (material.file) ? (
                            <TooltipWrapper tooltipText="Open attachment">
                              <TouchableOpacity 
                                accessible={true} 
                                accessibilityLabel={`Open URL ${material.file || material.url}`} 
                                accessibilityRole="link" 
                                style={[styles.actionButtonLM, styles.editButtonLM, styles.urlButton]} 
                                onPress={async () => {
                                  try {
                                    const url = (material.file || material.url || '').trim();
                                    console.log("material.filePath "+material.filePath);
                                    console.log("material.file "+material.file);
                                    console.log("material.url "+material.url);
                                    if (!url) {
                                      Alert.alert('Error', 'No URL provided');
                                      return;
                                    }
                                    
                                    const openLink = url.startsWith('http://') || url.startsWith('https://') ? url : `http://${url}`;
                                    
                                    // Validate URL format
                                    try {
                                      new URL(openLink); // throws if invalid
                                    } catch (e) {
                                      if (Platform.OS === 'web') {
                                        window.alert('Invalid URL\n\nThe provided link is not valid.');
                                      } else {
                                        Alert.alert('Invalid URL', 'The provided link is not valid');
                                      }
                                      return;
                                    }

                                    if (Platform.OS === 'web') {
                                      try {
                                        const result = await WebBrowser.openBrowserAsync(openLink);
                                        if (result.type === 'cancel') {
                                          Alert.alert('Notice', 'The link was not opened');
                                        }
                                      } catch (e) {
                                        Alert.alert('Error', 'Could not open the link');
                                      }
                                    } else {
                                      try {
                                        await WebBrowser.openBrowserAsync(openLink);
                                      } catch (e) {
                                        Alert.alert('Error', 'Could not open the link');
                                      }
                                    }
                                  } catch (error) {
                                    Alert.alert('Error', 'An unexpected error occurred');
                                  }
                                }}
                                {...(Platform.OS === 'web' && !isMobile ? {
                                  onMouseEnter: () => setHoveredAttachment(material.id), 
                                  onMouseLeave: () => setHoveredAttachment(null)
                                } : {})}
                              >
                                <Image source={images.link_rectangle} style={[styles.pencilIconLM]}/>
                              </TouchableOpacity>
                            </TooltipWrapper>
                          ) : (material.isAttachment) ? (
                            <TooltipWrapper tooltipText="Download attachment">
                              <TouchableOpacity 
                                accessible={true} 
                                accessibilityLabel={`Download file ${material.file || material.filePath}`} 
                                accessibilityRole="button" 
                                style={[styles.actionButtonLM, styles.editButtonLM, styles.downloadButton]} 
                                onPress={async () => {
                                  const filepath = material.filePath || material.file || '';
                                  try {
                                    const downloadLink = `${config.BASE_URL}${filepath}`;
                                    if (filepath) {
                                      if (Platform.OS === 'web') {
                                        try {
                                          const link = document.createElement('a');
                                          link.href = downloadLink;
                                          window.open(link, '_blank');
                                        } catch (e) {
                                          Alert.alert('Download Failed', 'Could not start download');
                                        }
                                      } else {
                                        try {
                                          const downloadResumable = FileSystem.createDownloadResumable(
                                            downloadLink,
                                            FileSystem.documentDirectory + (material.file || 'download'),
                                            {}
                                          );
                                          const { uri } = await downloadResumable.downloadAsync();
                                          Alert.alert('Success', `File downloaded to: ${uri}`);
                                        } catch (e) {
                                          Alert.alert('Download Failed', 'Could not download the file');
                                        }
                                      }
                                    }
                                  } catch (error) {
                                    Alert.alert('Error', 'An unexpected error occurred');
                                  }

                                  if (!filepath) {
                                    console.log("Downloading API method call for content ID "+material.id);
                                    console.log("Downloading API method call for current course ID "+courseOfferingID);
                                    downloadOrOpenAttachment(material.id, courseOfferingID);
                                  }
                                }}
                                {...(Platform.OS === 'web' && !isMobile ? {
                                  onMouseEnter: () => setHoveredAttachment(material.id), 
                                  onMouseLeave: () => setHoveredAttachment(null)
                                } : {})}
                              >
                                <Image source={images.download} style={[styles.pencilIconLM]}/>
                              </TouchableOpacity>
                            </TooltipWrapper>
                          ) : null}
                        </View>
                        <View style={[styles.tableCellExpanded, styles.actionsColumn]}>
                          <TooltipWrapper tooltipText="Click to Edit Content">
                            <TouchableOpacity accessible={true} accessibilityLabel={`Edit ${material.title}`} accessibilityRole="button" style={[styles.actionButtonLM, styles.editButtonLM, styles.actionPadding]} onPress={() => { setModalType('lectureMaterial'); setModalInitialData(material); setModalVisible(true); }}>
                              <Image source={images.pencil} style={[styles.pencilIconLM]} onError={() => console.warn('Failed to load pencil icon')}/>
                            </TouchableOpacity>
                          </TooltipWrapper>
                          <TooltipWrapper tooltipText="Click to delete content">
                            <TouchableOpacity accessible={true} accessibilityLabel={`Delete ${material.title}`} accessibilityRole="button" style={[styles.actionButtonLM, styles.deleteButtonLM, styles.actionPadding]} 
                              onPress={() => { 
                                setPopupAlertType('confirmation');
                                setPopupAlertTitle('Confirm Delete !!');
                                setPopupAlertMessage("Are you sure you want to delete course content ?");
                                setPopupAlertButtons([
                                  { text: 'No', onPress: () => setShowAlertPopup(false) },
                                  { text: 'Yes', onPress: () => {
                                    setShowAlertPopup(false);
                                    handleDelete_CourseContent(material.id, selectedCourse?.courseOfferingID);
                                  }},
                                ]);
                                setShowAlertPopup(true);
                              }}
                            >
                              <Image source={images.deleteIcon} style={[styles.pencilIconLM]} onError={() => console.warn('Failed to load delete icon')}/>
                            </TouchableOpacity>
                          </TooltipWrapper>
                        </View>
                      </View>
                    ))}
                  </View>
                )}
              </ScrollView>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

    const [searchQuery, setSearchQuery] = useState('');
  // const [modalVisible, setModalVisible] = useState(false);
  const [emailModalVisible, setEmailModalVisible] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState(null);


  // Assuming courseDetails and other states are defined above
    const [messageHistoryModalVisible, setMessageHistoryModalVisible] = useState(false);
    const [selectedStudentMessages, setSelectedStudentMessages] = useState([]);
    const [messageTitle, setMessageTitle] = useState('Attendance Related');
    const [messageDescription, setMessageDescription] = useState('');
    const [messageLevel, setMessageLevel] = useState('Normal');
  
  //   const handle_ViewStudentMessages = async (studentId) => {
  //   try {
  //     const response = await fetch(`/api/messages?studentId=${studentId}`, {
  //       method: 'GET',
  //       headers: { 'Content-Type': 'application/json' },
  //     });
  //     const messages = await response.json();
  //     setSelectedStudentMessages(messages);
  //     setMessageHistoryModalVisible(true);
  //   } catch (error) {
  //     console.error('Error fetching messages:', error);
  //     setSelectedStudentMessages([]); // Fallback to empty array
  //   }
  // };

  //Above Fk commented duplicate ALEENA
  
  // const handle_MessageSendingToStudent = async () => {
  //   const student = courseDetails.students.find((s) => s.id === selectedStudentId);
  //   if (student) {
  //     const messageData = {
  //       For_Student_ID: selectedStudentId,
  //       Title: messageTitle,
  //       Description: messageDescription,
  //       IsGeneralMessage: 0,
  //       IsCourseSpecificMsg: 1,
  //       Message_Level: messageLevel,
  //       IsViewed: 0,
  //       IsAcknowledged: 0,
  //     };
  //     try {
  //       await fetch('/api/messages', {
  //         method: 'POST',
  //         headers: { 'Content-Type': 'application/json' },
  //         body: JSON.stringify(messageData),
  //       });
  //       console.log('Message saved successfully:', messageData);
  //     } catch (error) {
  //       console.error('Error saving message:', error);
  //     }
  //   }
  //   setEmailModalVisible(false);
  // };
  

const handle_MessageSendingToStudent = async () => {
  try {

    console.log("1 I m called");

    const Allow_Message_Sending =true; 

    const token = await AsyncStorage.getItem('token');
    if (!token) {
      //Alert.alert('Error', 'No auth token found. Please login again.');

   setPopupAlertType_OverModal('error');
      setPopupAlertTitle_OverModal('Error Occured'); // Set custom title
      setPopupAlertMessage_OverModal("No authentication token found");
      setPopupAlertButtons_OverModal([
        { text: 'Ok' ,onPress:() =>{setShowAlertPopupOverModal(false);    return;} },
        // { text: 'Yes', onPress: () => {
        //   setShowAlertPopup(false);
        //   //handleSaveOrSubmitAttendance('submit');
        //   handleDeleteAttendance(record.AttendanceID);
        //   // setEmail('');
        //   // setPassword('');
        // }},
      ]);
       setShowAlertPopupOverModal(true);

      Allow_Message_Sending=false;
    }

    console.log("2 I m called");

    const student = courseDetails.students.find((s) => s.id === selectedStudentId);
    if (!student) {
      //Alert.alert('Error', 'Selected student not found.');

         setPopupAlertType_OverModal('error');
      setPopupAlertTitle_OverModal('Error Occured'); // Set custom title
      setPopupAlertMessage_OverModal("Selected student not found");
      setPopupAlertButtons_OverModal([
        { text: 'Ok' , OnPress:() =>{setShowAlertPopupOverModal(false);} },
        // { text: 'Yes', onPress: () => {
        //   setShowAlertPopup(false);
        //   //handleSaveOrSubmitAttendance('submit');
        //   handleDeleteAttendance(record.AttendanceID);
        //   // setEmail('');
        //   // setPassword('');
        // }},
      ]);
       setShowAlertPopupOverModal(true);

      //return;
      Allow_Message_Sending=false;
    }

console.log("3 I m called");

 // Trim to avoid spaces-only descriptions
  if ((!messageDescription || messageDescription.trim() === '') && (!messageTitle || messageTitle.trim() === '') ) {
   // Alert.alert('Validation', 'Description cannot be empty.');

       setPopupAlertType_OverModal('error');
      setPopupAlertTitle_OverModal('Error Occured'); // Set custom title
      setPopupAlertMessage_OverModal("Message description or title cannot be null.");
      setPopupAlertButtons_OverModal([
        { text: 'Ok',onPress:() =>{setShowAlertPopupOverModal(false); return;}  },
        // { text: 'Yes', onPress: () => {
        //   setShowAlertPopup(false);
        //   //handleSaveOrSubmitAttendance('submit');
        //   handleDeleteAttendance(record.AttendanceID);
        //   // setEmail('');
        //   // setPassword('');
        // }},
      ]);
       setShowAlertPopupOverModal(true);

    //return;  // stop further execution
    Allow_Message_Sending=false;
  }

    console.log("4 I m called val "+Allow_Message_Sending);

if(Allow_Message_Sending)
{
  setEmailModalVisible(false);

    const messageData = {
      For_Student_ID: selectedStudentId,
      Title: messageTitle,
      Description: messageDescription,
      IsGeneralMessage: false,
      IsCourseSpecificMsg: true,
      Message_Level: messageLevel,
      CourseOffered_ID: selectedCourse?.courseOfferingID ?? -1,
    };

    const response = await fetch(`${config.BASE_URL}/api/student/SendMessage_ToStudent`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(messageData)
    });

     console.log("5 I m called val "+Allow_Message_Sending);

    const result = await response.json();

    if (response.ok) {
      console.log('Message saved successfully:', result);
      //Alert.alert('Success', 'Message sent to student.');

   setPopupAlertType_OverModal('success');
      setPopupAlertTitle_OverModal('Message Sent'); // Set custom title
      setPopupAlertMessage_OverModal("Message successfully sent to student");
      setPopupAlertButtons_OverModal([
        { text: 'Ok'
          , onPress: () => setShowAlertPopupOverModal(false) 

        },
        // { text: 'Yes', onPress: () => {
        //   setShowAlertPopup(false);
        //   //handleSaveOrSubmitAttendance('submit');
        //   handleDeleteAttendance(record.AttendanceID);
        //   // setEmail('');
        //   // setPassword('');
        // }},
      ]);
       setShowAlertPopupOverModal(true);


    } else {
      console.warn('Failed to send message:', result.message);
      //Alert.alert('Error', result.message || 'Failed to send message.');

   setPopupAlertType_OverModal('error');
      setPopupAlertTitle_OverModal('Error Occured'); // Set custom title
      setPopupAlertMessage_OverModal("Error occured while sending message to student ");
      setPopupAlertButtons_OverModal([
        { text: 'Ok'
          , onPress: () => setShowAlertPopupOverModal(false) 
        },
        // { text: 'Yes', onPress: () => {
        //   setShowAlertPopup(false);
        //   //handleSaveOrSubmitAttendance('submit');
        //   handleDeleteAttendance(record.AttendanceID);
        //   // setEmail('');
        //   // setPassword('');
        // }},
      ]);

       setShowAlertPopupOverModal(true);

    }


  }




  } catch (error) {
    console.error('Error sending message:', error);
    //Alert.alert('Error', 'Unexpected error while sending message.');

   setPopupAlertType('error');
      setPopupAlertTitle('Error Occured'); // Set custom title
      setPopupAlertMessage("Un expected error occured while sending mesaage to student");
      setPopupAlertButtons([
        { text: 'Ok'
          , onPress: () => setShowAlertPopup(false) 
        },
        // { text: 'Yes', onPress: () => {
        //   setShowAlertPopup(false);
        //   //handleSaveOrSubmitAttendance('submit');
        //   handleDeleteAttendance(record.AttendanceID);
        //   // setEmail('');
        //   // setPassword('');
        // }},
      ]);

 setShowAlertPopup(true);

  } finally {
    setEmailModalVisible(false);
  }
};









const renderStudentList = () => {
  // Filter students based on roll number or name
  const filteredStudents = courseDetails.students.filter(
    (student) =>
      student.rollNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle email icon press to show modal
  const handle_StudentMessaging = async (studentId) => {
    setSelectedStudentId(studentId);
    setEmailModalVisible(true);
    // Reset form fields when opening modal
    setMessageTitle('Attendance Related');
    setMessageDescription('');
    setMessageLevel('Normal');
  };

  const handle_ViewStudentMessages = async (studentId) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        setPopupAlertType('error');
        setPopupAlertTitle('Verification');
        setPopupAlertMessage("No authentication token found");
        setPopupAlertButtons([
          { text: 'Ok', onPress: () => setShowAlertPopup(false) },
        ]);
        setShowAlertPopup(true);
        return;
      }

      const courseOfferedID = selectedCourse?.courseOfferingID ?? -1;

      const response = await fetch(`${config.BASE_URL}/api/student/messagesByStudent/${studentId}?courseOffered_ID=${courseOfferedID}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const result = await response.json();

      if (response.ok && Array.isArray(result)) {
        console.log('Fetched messages:', result);
        setSelectedStudentMessages(result);
        setMessageHistoryModalVisible(true);
      } else {
        console.warn('Failed to fetch messages:', result.message);
        setPopupAlertType('error');
        setPopupAlertTitle('Error');
        setPopupAlertMessage("Failed to fetch messages.");
        setPopupAlertButtons([
          { text: 'Ok', onPress: () => setShowAlertPopup(false) },
        ]);
        setShowAlertPopup(true);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      setPopupAlertType('error');
      setPopupAlertTitle('Error');
      setPopupAlertMessage("Exception occurred while fetching messages.");
      setPopupAlertButtons([
        { text: 'Ok', onPress: () => setShowAlertPopup(false) },
      ]);
      setShowAlertPopup(true);
    }
  };

  return (
    <View style={[styles.tableContainerLM]}>
      {/* Header with Search Bar */}
      <View style={[styles.HeaderContainer]}>
        <Text style={[styles.HeaderText]}>
          Student's List
        </Text>
        <TextInput
          style={[styles.searchInput_Student]}
          placeholder="Search by Name/Roll No"
          value={searchQuery}
          onChangeText={setSearchQuery}
          accessible={true}
          accessibilityLabel="Search students"
        />
      </View>

      <View style={[styles.tableWrapper]}>
        {/* Fixed Table Header */}
        <View style={[styles.tableRow, styles.tableHeader, styles.tableHeaderRow]}>
          <Text style={[styles.tableCell, styles.tableHeaderText, styles.serialColumn]}>
            S No.
          </Text>
          <Text style={[styles.tableCell, styles.tableHeaderText, styles.columnEqualWidth]}>
            Roll No
          </Text>
          <Text style={[styles.tableCell, styles.tableHeaderText, styles.columnEqualWidth]}>
            Name
          </Text>
          <Text style={[styles.tableCell, styles.tableHeaderText, styles.columnEqualWidth]}>
            Class Attendance
          </Text>
          <Text style={[styles.tableCell, styles.tableHeaderText, styles.columnEqualWidth]}>
            Contact
          </Text>
        </View>
        <View style={[styles.tableWrapper]}>
          {filteredStudents.length > 0 ? (
            filteredStudents.map((student, index) => (
              <View
                key={student.rollNo}
                style={[styles.tableRowLM, index % 2 === 0 ? styles.tableRowEvenLM : styles.tableRowOddLM]}
              >
                <Text style={[styles.tableCell, styles.serialColumn]}>
                  {index + 1}.
                </Text>
                <Text
                  style={[styles.tableCell, styles.columnEqualWidth]}
                  accessible={true}
                  accessibilityLabel={`Roll number ${student.rollNo}`}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {student.rollNo}
                </Text>
                <Text
                  style={[styles.tableCell, styles.columnEqualWidth]}
                  accessible={true}
                  accessibilityLabel={`Student name ${student.name}`}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {student.name}
                </Text>
                <Text style={[styles.tableCell,  styles.columnEqualWidth]}>
                  {student.attendancePercentage}
                </Text>
                <View style={[styles.tableCell, styles.columnEqualWidth]}>
                  <TooltipWrapper tooltipText="Click to Send Message">
                    <TouchableOpacity
                      onPress={() => handle_StudentMessaging(student.id)}
                      accessible={true}
                      accessibilityLabel={`Contact student ${student.name}`}
                    >
                      <Image
                        source={images.email}
                        style={[styles.emailIcon]}
                      />
                    </TouchableOpacity>
                  </TooltipWrapper>
                  <TooltipWrapper tooltipText="Click to View Message History">
                    <TouchableOpacity
                      onPress={() => handle_ViewStudentMessages(student.id)}
                      accessible={true}
                      accessibilityLabel={`View messages for student ${student.name}`}
                    >
                      <Image
                        source={images.view}
                        style={[styles.emailIcon, styles.viewIcon]}
                      />
                    </TouchableOpacity>
                  </TooltipWrapper>
                </View>
              </View>
            ))
          ) : (
            <View style={[styles.tableRowLM]}>
              <Text style={[styles.tableCellAtt, styles.noStudentsCell]}>
                No students enrolled
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Email Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={emailModalVisible}
        onRequestClose={() => setEmailModalVisible(false)}
        style={[styles.modalStyle]}
      >
        <View style={[styles.modalContainer, styles.modalContainerPadding]}>
          <View style={[styles.modalContent, styles.modalContentWidth]}>
            <Text style={[styles.modalTitle]}>Send Message</Text>
            {/* Title Dropdown */}
            <View style={[styles.dropdownContainer, styles.dropdownContainerLayout]}>
              <Text style={[styles.modalLabel, styles.modalLabelFont]}>Title</Text>
              <Picker
                selectedValue={messageTitle}
                onValueChange={(itemValue) => setMessageTitle(itemValue)}
                style={[styles.picker, styles.pickerSize]}
                itemStyle={[styles.pickerItemFont]}
              >
                <Picker.Item label="Attendance Related" value="Attendance Related" />
                <Picker.Item label="Performance Related" value="Performance Related" />
                <Picker.Item label="Ethic Related" value="Ethic Related" />
              </Picker>
              <Text style={[styles.modalLabel, styles.modalLabelFont]}>Priority</Text>
              <Picker
                selectedValue={messageLevel}
                onValueChange={(itemValue) => setMessageLevel(itemValue)}
                style={[styles.picker, styles.pickerSize]}
                itemStyle={[styles.pickerItemFont]}
              >
                <Picker.Item label="High Priority" value="High Priority" />
                <Picker.Item label="Normal" value="Normal" />
                <Picker.Item label="Low Priority" value="Low Priority" />
              </Picker>
            </View>
            {/* Description TextInput */}
            <View style={[styles.inputContainer, styles.inputContainerMargin]}>
              <Text style={[styles.modalLabel, styles.modalLabelFont]}>Description</Text>
              <TextInput
                style={[styles.modalInput, styles.modalInputHeight]}
                placeholder="Enter message description"
                placeholderTextColor="#666"
                multiline
                value={messageDescription}
                onChangeText={setMessageDescription}
                accessible={true}
                accessibilityLabel="Message description"
              />
            </View>
            <View style={[styles.modalButtons, styles.modalButtonsLayout]}>
              <TouchableOpacity
                style={[styles.actionButton, styles.closeButton, styles.buttonPadding]}
                onPress={() => setEmailModalVisible(false)}
              >
                <Text style={[styles.modalButtonText, styles.modalButtonTextFont]}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.actionButton,
                  styles.saveButton,
                  styles.buttonPadding,
                  (!messageDescription.trim()) && styles.disabledButton
                ]}
                disabled={!messageDescription.trim()}
                onPress={() => {
                  setPopupAlertType_OverModal('confirmation');
                  setPopupAlertTitle_OverModal('Sending Message');
                  setPopupAlertMessage_OverModal("Have you reviewed message and sure its okay to send ?");
                  setPopupAlertButtons_OverModal([
                    { text: 'No', onPress: () => setShowAlertPopupOverModal(false) },
                    { text: 'Yes', onPress: () => {
                      handle_MessageSendingToStudent();
                      setShowAlertPopupOverModal(false);
                    }},
                  ]);
                  setShowAlertPopupOverModal(true);
                }}
              >
                <Text style={[styles.modalButtonText, styles.modalButtonTextFont]}>
                  Send
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Message History Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={messageHistoryModalVisible}
        onRequestClose={() => setMessageHistoryModalVisible(false)}
      >
        <View style={[styles.modalContainer, styles.modalContainerPadding]}>
          <View style={[styles.modalContent, styles.messageHistoryModalWidth]}>
            <Text style={[styles.modalTitle, styles.messageHistoryTitle]}>
              Message History
            </Text>
            <ScrollView style={[styles.messageHistoryScroll]}>
              <View style={[styles.tableWrapper]}>
                <View style={[styles.tableRowLM, styles.tableHeaderLM]}>
                  <Text style={[styles.tableCell, styles.tableHeaderText, styles.columnEqualWidth]}>
                    Title
                  </Text>
                  <Text style={[styles.tableCell, styles.tableHeaderText, styles.columnEqualWidth]}>
                    Description
                  </Text>
                  <Text style={[styles.tableCell, styles.tableHeaderText, styles.columnEqualWidth]}>
                    General
                  </Text>
                  <Text style={[styles.tableCell, styles.tableHeaderText, styles.columnEqualWidth]}>
                    Course Specific
                  </Text>
                  <Text style={[styles.tableCell, styles.tableHeaderText, styles.columnEqualWidth]}>
                    Priority
                  </Text>
                  <Text style={[styles.tableCell, styles.tableHeaderText, styles.columnEqualWidth]}>
                    Viewed
                  </Text>
                  <Text style={[styles.tableCell, styles.tableHeaderText, styles.columnEqualWidth]}>
                    Acknowledged
                  </Text>
                </View>
                {selectedStudentMessages.length > 0 ? (
                  selectedStudentMessages.map((message, index) => (
                    <View
                      key={index}
                      style={[styles.tableRowLM, index % 2 === 0 ? styles.tableRowEvenLM : styles.tableRowOddLM, styles.messageRowPadding]}
                    >
                      <Text style={[styles.tableCell, styles.columnEqualWidth]}>
                        {message.title}
                      </Text>
                      <Text style={[styles.tableCell, styles.columnEqualWidth]} numberOfLines={2} ellipsizeMode="tail">
                        {message.description}
                      </Text>
                      <Text style={[styles.tableCell, styles.columnEqualWidth]}>
                        {message.isGeneralMessage ? 'Yes' : 'No'}
                      </Text>
                      <Text style={[styles.tableCell, styles.columnEqualWidth]}>
                        {message.isCourseSpecificMsg ? 'Yes' : 'No'}
                      </Text>
                      <Text style={[styles.tableCell, styles.columnEqualWidth]}>
                        {message.message_Level}
                      </Text>
                      <Text style={[styles.tableCell, styles.columnEqualWidth]}>
                        {message.isViewed ? 'Yes' : 'No'}
                      </Text>
                      <Text style={[styles.tableCell, styles.columnEqualWidth]}>
                        {message.isAcknowledged ? 'Yes' : 'No'}
                      </Text>
                    </View>
                  ))
                ) : (
                  <View style={[styles.tableRowLM]}>
                    <Text style={[styles.tableCell, styles.noMessagesCell]}>
                      No messages found
                    </Text>
                  </View>
                )}
              </View>
            </ScrollView>
            <View style={[styles.modalButtons, styles.modalButtonsCentered]}>
              <TouchableOpacity
                style={[styles.actionButton, styles.closeButton, styles.closeButtonPadding]}
                onPress={() => setMessageHistoryModalVisible(false)}
              >
                <Text style={[styles.modalButtonText, styles.modalButtonTextFont]}>
                  Close
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <AlertModalPopUp
        visible={showAlertPopupOverModal}
        type={popupAlertType_OverModal}
        title={popupAlertTitle_OverModal}
        message={popupAlertMessage_OverModal}
        buttons={popupAlertButtons_OverModal}
        onClose={() => setShowAlertPopupOverModal(false)}
      />
    </View>
  );
};


  const [showComments, setShowComments] = useState(false);
  const [globalComments, setGlobalComments] = useState('');
  //const [date, setDate] = useState(new Date('2025-06-22T17:28:00')); // Updated to 05:28 PM PKT, June 22, 2025
  const [date,setDate] = useState(new Date(Date.now()).toLocaleDateString('en-CA'));
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [currentStudents, setCurrentStudents] = useState([
    // { id: 'FA13-BCS-002', name: 'MUHAMMAD HAMZA', status: '', attendancePercentage: '0%', comments: '',isEditable : true },
    // { id: 'FA13-BCS-009', name: 'TEHSEEN GAISER', status: '', attendancePercentage: '0%', comments: '',isEditable : true },
  ]);




  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    const FormatedDate = new Date(currentDate).toLocaleDateString('en-CA');
    setShowDatePicker(false);
    setDate(FormatedDate);
  };

  const handleShowComments = () => {
    setShowComments(!showComments);
  };

  const handleTimeChange = (type, text) => {
    const cleanedText = text.replace(/[^0-9:]/g, '');
    if (cleanedText.length <= 5) {
      if (type === 'start') setStartTime(cleanedText);
      else if (type === 'end') setEndTime(cleanedText);
    }
  };

  const validateTime = (time) => {
    const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
    return timeRegex.test(time);
  };


 useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setShowAttendanceSummary(true);
    });
    return unsubscribe;
  }, [navigation]);


//   //Previous Method
// const confirmSubmitAttendance = () => {
//   if (!selectedCourse) {
//     alert('Please select a course');
//     return;
//   }

//   const formattedDate = formatDate(date);
//   const existingRecord = findAttendanceRecordByDate(date);

//   if (!existingRecord && !isEditing) {
//     alert('Please save the attendance record before submitting.');
//     return;
//   }

//   handleSubmitAttendance(existingRecord?.AttendanceID || currentAttendanceID, 'submit');
//   setShowAttendanceSummary(true); // Redirect to summary view
// };



//Final updated | 7 july 2025 at 2AM
const validateClashBeforeSave = async (finalStartTime,finalEndTime) => {
  try {
    const token = await AsyncStorage.getItem('token');
    const formattedDate = date;//date.toISOString().split('T')[0];

    console.log("Clash compare from end "+{finalEndTime});


    const url = `${config.BASE_URL}/api/attendance/check_clash?courseOfferID=${selectedCourse.courseOfferingID}&date=${formattedDate}&startTime=${finalStartTime}&endTime=${finalEndTime}${
      isEditing ? `&excludeID=${currentAttendanceID||-1}` : ''
    }`;

    const res = await fetch(url, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });

    const result = await res.json();

    if (result.isClashing) {
      showAlert('Clash Detected', 'This time range clashes with an existing attendance record.','error');
      return false;
    }

    return true;
  } catch (err) {
    console.error('Error checking clash', err);
    showAlert('Error', 'Failed to check for time clash.','error');
    return false;
  }
};


//New Method |  30 June 2025
const handleSaveOrSubmitAttendance = async (action: 'save' | 'submit') => {
  if (!selectedCourse) return alert('Please select a course');

  const finalStartTime = `${startHour}:${startMinute}`;  //startTime || 
  const finalEndTime =  `${endHour}:${endMinute}`; //endTime ||

  const finalDate =  date || selectedDate;
  const finalFormattedDate = new Date(finalDate).toLocaleDateString('en-CA');



  console.log("Start Time to Save:", finalStartTime);
  console.log("End Time to Save:", finalEndTime);

   if (!validateTime(finalStartTime) || !validateTime(finalEndTime)) {
     return alert('Invalid time format. Use HH:MM');
   }

  const isClashFree = await validateClashBeforeSave(finalStartTime,finalEndTime);
  console.log("FK class "+isClashFree);
  if (!isClashFree) return;

  // Proceed to call API to save/submit
  ////await saveAttendanceToServer(action);

  console.log("FK start class "+finalStartTime);

  const isSubmit = action === 'submit';
  const formattedDate = finalDate;//date.toISOString().split('T')[0];
  const attendanceID = isEditing ? currentAttendanceID : 0;
  //const decided_Editable_Student = isEditing ? false : true;
  
   console.log("FK end class "+endTime);

  const payload = {
    AttendanceID: attendanceID || 0,
    CourseOfferID: selectedCourse.courseOfferingID,
    AttendanceDate: finalFormattedDate,//formattedDate,
    StartTime: finalStartTime,
    EndTime: finalEndTime,
    IsTheory: subjectType === 'Theory',
    IsPractical: subjectType === 'Practical',
    IsSubmitted: isSubmit,
    Comments: globalComments,
    Students: currentStudents.map((student) => ({
      //AttendanceDetail_ID: `AD${selectedCourse.courseOfferingID}-${student.id}`,
      StudentId: student.id,
  RollNo: student.rollNo,
  Name: student.name,
  Email: student.email,
  Status: student.status || 'Absent',
  Remarks: student.comments || '',
  //isEditable : decided_Editable_Student ? true : student.IsEditable || true,
    }))
  };

  try {
    const token = await AsyncStorage.getItem('token');
    const res = await fetch(`${config.BASE_URL}/api/attendance/SaveOrSubmitAttendance`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) throw new Error('Failed to save attendance');

    const result = await res.json();
    
    //alert(result.message || 'Attendance saved');
        setPopupAlertType('success');
      setPopupAlertTitle('Saved !!'); // Set custom title
      setPopupAlertMessage("Attendance saved successfully ");
      setPopupAlertButtons([
        { text: 'Ok', onPress: () => setShowAlertPopup(false) },
        
      ]);
      //console.log('Error Popup State:', { popupType, popupTitle, popupMessage, popupButtons });
      setShowAlertPopup(true);



    // Refresh records (if needed)
    await loadAttendanceFromAPI_ALL(selectedCourse.courseOfferingID);

    // Reset state
    setShowAttendanceSummary(true);
    setGlobalComments('');
    setCurrentStudents([]);
    setSubjectType('Theory');

      //Attendance compare check RESET states
   setIsDataReady(false); // trigger validation only after setting is done
   setIsEditDataReady(false);


  } catch (err) {
    console.error("Error saving attendance " + err);
   // alert('Error saving attendance. Please try again.');

        setPopupAlertType('error');
      setPopupAlertTitle('Error !!'); // Set custom title
      setPopupAlertMessage("Error in saving attendance. Kindly try again.");
      setPopupAlertButtons([
        { text: 'Ok', onPress: () => setShowAlertPopup(false) },
      
      ]);
      //console.log('Error Popup State:', { popupType, popupTitle, popupMessage, popupButtons });
      setShowAlertPopup(true);



  }
};


const confirmSubmitAttendance = () => {
  console.log('submit attendance pressed');

      setPopupAlertType('confirmation');
      setPopupAlertTitle('Confirm Submit ??'); // Set custom title
      setPopupAlertMessage("Are you sure you want to submit this attendance ?");
      setPopupAlertButtons([
        { text: 'No', onPress: () => setShowAlertPopup(false) },
        { text: 'Yes', onPress: () => {
          setShowAlertPopup(false);
          handleSaveOrSubmitAttendance('submit');
          // setEmail('');
          // setPassword('');
        }},
      ]);
      //console.log('Error Popup State:', { popupType, popupTitle, popupMessage, popupButtons });
      setShowAlertPopup(true);



  // if (Platform.OS === 'web') {
  //   // Browser fallback
  //   const ok = window.confirm(
  //     'Confirm Submit\n\nAre you sure you want to submit this attendance?'
  //   );
  //   if (ok) {
  //     handleSaveOrSubmitAttendance('submit');
  //   }
  // } else {
  //   // Native mobile
  //   Alert.alert(
  //     'Confirm Submit',
  //     'Are you sure you want to submit this attendance?',
  //     [
  //       { text: 'Cancel', style: 'cancel' },
  //       {
  //         text: 'Submit',
  //         style: 'destructive', // iOS: red tint
  //         onPress: () => handleSaveOrSubmitAttendance('submit'),
  //       },
  //     ],
  //     { cancelable: false } // Android: force a button tap
  //   );
  // }






};


// //Below method over-rided by above
// //// Handle both save and submit
// const handleSubmitAttendance = (attendanceId, action) => {
//   if (!selectedCourse || !date || !startTime || !endTime || !validateTime(startTime) || !validateTime(endTime)) {
//     alert('Please fill in all required fields with valid data.');
//     return;
//   }

//   const isSubmit = action === 'submit';
//   const attendanceID = attendanceId || `ATT${selectedCourse.courseOfferingID}-${Date.now()}`;
//   const newAttendanceRecord = {
//     Attendance_CourseOfferID: selectedCourse.courseOfferingID,
//     AttendanceID: attendanceID,
//     AttendanceDate: date.toISOString().split('T')[0],
//     Attendance_IsSubmitted: isSubmit,
//     Attendance_IsSaved: true,
//     Attendance_Status: isSubmit ? 'Submitted' : 'Saved',
//     Attendance_StartTime: startTime,
//     Attendance_EndTime: endTime,
//     Attendance_IsTheory: subjectType === 'Theory',
//     Attendance_IsPractical: subjectType === 'Practical',
//     Attendance_Comments: globalComments || '',
//     students: currentStudents.map((student) => ({
//       AttendanceDetail_ID: `AD${selectedCourse.courseOfferingID}-${student.id}`,
//       Student: {
//         id: student.id,
//         rollNo: student.id, //it is wrong
//         name: student.name,
//         email: student.email || '',
//       },
//       Status: student.status || 'Absent',
//       Remarks: student.comments || '',
//     })),
//   };

//   const updatedRecords = {
//     ...attendanceRecords,
//     [selectedCourse.courseOfferingID]: attendanceId
//       ? attendanceRecords[selectedCourse.courseOfferingID].map((record) =>
//           record.AttendanceID === attendanceId ? newAttendanceRecord : record
//         )
//       : [...(attendanceRecords[selectedCourse.courseOfferingID] || []), newAttendanceRecord],
//   };

//   setAttendanceRecords(updatedRecords);
//   setShowAttendanceSummary(true);
//   setGlobalComments('');
//   setCurrentStudents([]);
//   setSubjectType('Theory');
// };

// // Save attendance
// const handleSaveAttendance = () => {
//   if (!selectedCourse) {
//     alert('Please select a course');
//     return;
//   }

//   const formattedDate = formatDate(date);
//   const existingRecord = findAttendanceRecordByDate(date);

//   if (existingRecord && !isEditing) {
//     alert('An attendance record already exists for this date. You can edit the existing record.');
//     return;
//   }

//   const attendanceData = {
//     AttendanceID: isEditing ? currentAttendanceID : Date.now().toString(), // Use existing ID if editing
//     AttendanceDate: formattedDate,
//     SubjectType: subjectType,
//     StartTime: startTime,
//     EndTime: endTime,
//     GlobalComments: globalComments,
//     students: currentStudents.map((student) => ({
//       id: student.id,
//       name: student.name,
//       Status: student.status || 'Absent', // Default to Absent if not set
//       Comments: student.comments || '',
//     })),
//     Attendance_Status: 'Saved',
//     Attendance_IsSubmitted: false,
//   };

//   // Update attendanceRecords
//   setAttendanceRecords((prevRecords) => {
//     const courseRecords = Array.isArray(prevRecords[selectedCourse.courseOfferingID])
//       ? [...prevRecords[selectedCourse.courseOfferingID]]
//       : [];

//     if (isEditing) {
//       // Update existing record
//       const updatedRecords = courseRecords.map((record) =>
//         record.AttendanceID === attendanceData.AttendanceID ? attendanceData : record
//       );
//       return {
//         ...prevRecords,
//         [selectedCourse.courseOfferingID]: updatedRecords,
//       };
//     } else {
//       // Add new record
//       return {
//         ...prevRecords,
//         [selectedCourse.courseOfferingID]: [...courseRecords, attendanceData],
//       };
//     }
//   });

//   alert(isEditing ? 'Attendance updated successfully!' : 'Attendance saved successfully!');
//   setShowAttendanceSummary(true); // Return to summary view
// };


const [isEditDataReady, setIsEditDataReady] = useState(false);



//New Method  \ Fk Added
const handleAddNewAttendance = () => {
  setMode('Add');
  setIsEditing(false);
  setCurrentAttendanceID(null);

  // Allow date selection (not locked like Edit mode)
  const FormattedDate = new Date(Date.now()).toLocaleDateString('en-CA');
 console.log("Newly Set Formatted Date "+FormattedDate);
  //setDate(new Date());
  setDate(FormattedDate);
  //setStartTime('09:00');
  //setEndTime('10:00');
  setSubjectType('Theory');
  setGlobalComments('');


setStartHour(hour_now);
setStartMinute(minute_now);
setEndHour(endHourVal);
setEndMinute(minute_now);






  //Attendance compare check
   setIsDataReady(true); // trigger validation only after setting is done
   setIsEditDataReady(true);

  // Reset students for marking
  setCurrentStudents(courseDetails.students.map((s) => ({
    id: s.id,
    name: s.name,
    rollNo: s.rollNo,
    email: s.email,
    status: 'Absent',
    comments: '',
    isEditable: true,
    attendancePercentage:s.attendancePercentage || '0%',
  })));

  setShowAttendanceSummary(false);
};


const [selectedAttendanceID, setSelectedAttendanceID] = useState(null);
useEffect(() => {
  if (selectedAttendanceID && !showAttendanceSummary && selectedCourse) {
    const record = attendanceRecords[selectedCourse.courseOfferingID]?.find(
      (r) => r.AttendanceID === selectedAttendanceID
    );
    if (record && record.students) {
      setCurrentStudents(
        record.students.map((student) => ({
          id: student.Student.id, // Access nested Student.id
          rollNo: student.Student.rollNo, // Use rollNo for Reg. No.
          name: student.Student.name, // Access nested Student.name
          status: student.Status || 'Not Set',
          comments: student.Remarks || '', // Use Remarks instead of comments
          isEditable : student.isEditable===true ||student.isEditable==='true' ||false,
          attendancePercentage: student.attendancePercentage || '0%', // Placeholder since not in interface
        }))
      );
      // Set other states from the record
      setSubjectType(record.Attendance_IsTheory ? 'Theory' : 'Practical');
      setStartTime(record.Attendance_StartTime || '09:00');
      setEndTime(record.Attendance_EndTime || '10:30');
      setGlobalComments(record.Attendance_Comments || '');
      
      
      //setDate(new Date(record.AttendanceDate));
      setDate(record.AttendanceDate);

    } else {
      setCurrentStudents([]);
      console.warn('No record or students found for AttendanceID:', selectedAttendanceID);
    }
  }

}
//, [selectedAttendanceID, showAttendanceSummary, attendanceRecords, selectedCourse]);
, [selectedAttendanceID, attendanceRecords, selectedCourse]); //New removed

const [isEditing, setIsEditing] = useState(false);
const [currentAttendanceID, setCurrentAttendanceID] = useState(null);


//New By FK | 30 June 2025
const handleEditAttendance = async (attendanceId, attendanceDate,isDisabled,show_UnLockedSign,is_Submitted) => {
  try {
    setMode('Edit');
    setIsEditing(true);
    setCurrentAttendanceID(attendanceId);
    

    const token = await AsyncStorage.getItem('token');
    const res = await fetch(`${config.BASE_URL}/api/attendance/GetAttendanceByID/${attendanceId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!res.ok) throw new Error('Failed to fetch attendance for editing');

    const record = await res.json();

    // Set all fields
    ////setDate(new Date(record.attendanceDate)); // date locked in edit
    setDate(record.attendanceDate); // date locked in edit

    //setStartTime(record.startTime);
    const [start_hours, start_minutes] = record.startTime.split(':');
     setStartHour(start_hours);
    setStartMinute(start_minutes);

//console.log('Hours:', hours);   // → "09"
//console.log('Minutes:', minutes); // → "00"

   
    
    //setEndTime(record.endTime);
    const [end_hours, end_minutes] = record.endTime.split(':');

    setEndHour(end_hours);
    setEndMinute(end_minutes);

    //Time validation trigger
    setIsDataReady(true); // trigger validation only after setting is done
     setIsEditDataReady(true);


    setSubjectType(record.isTheory ? 'Theory' : 'Practical');
    setGlobalComments(record.remarks || '');
    setCurrentStudents(
      record.students.map((s) => ({
        id: s.studentId,
        name: s.name +''+ s.isEditable,
        email: s.email || '',
        status: s.status || 'Absent',
        comments: s.remarks || '',
         isEditable:s.isEditable ==='true' ||s.isEditable ===true || false,
        attendancePercentage: s.attendancePercentage || '0%',
      }))
    );

    setShowAttendanceSummary(false);

    set_MainAttendance_isDisabled(isDisabled);
    set_MainAttendance_show_UnLockedSign(show_UnLockedSign);
    set_MainAttendance_isSubmitted(is_Submitted);
    
    

  } catch (err) {
    console.error("Error in loading attendance "+err);
    //alert('Error loading attendance for edit');

      setPopupAlertType('error');
      setPopupAlertTitle('Loading Attendance'); // Set custom title
      setPopupAlertMessage("Error in loading attendance. Kindly try again after some time.");
      setPopupAlertButtons([
        { text: 'OK', onPress: () => setShowAlertPopup(false) },
      
      ]);
      //console.log('Error Popup State:', { popupType, popupTitle, popupMessage, popupButtons });
      setShowAlertPopup(true);


  }
};



// //replaced by above
// //previous Working
// const handleEditAttendance = (attendanceID, attendanceDate) => {
//   const record = findAttendanceRecordByDate(new Date(attendanceDate));
//   if (record) {
//     if (record.Attendance_IsSubmitted) {
//       alert('This attendance record is submitted and cannot be edited. You can only view it.');
//       handleViewAttendance(attendanceID, attendanceDate); // Switch to view mode
//       return;
//     }
//     setDate(new Date(record.AttendanceDate));
//     setSubjectType(record.SubjectType || 'Theory');
//     setStartTime(record.StartTime || '00:00');
//     setEndTime(record.EndTime || '00:00');
//     setGlobalComments(record.GlobalComments || '');
//     setCurrentStudents(
//       record.students.map((student) => ({
//         id: student.id,
//         name: student.name,
//         status: student.Status,
//         comments: student.Comments || '',
//         attendancePercentage: courseDetails.students.find((s) => s.id === student.id)?.attendancePercentage,
//       }))
//     );
//     setCurrentAttendanceID(attendanceID);
//     setIsEditing(true);
//     setMode('Edit'); // Set to edit mode
//     setShowAttendanceSummary(false);
//   } else {
//     alert('Attendance record not found.');
//   }
// };


useEffect(() => {
  if (mode === 'Add' && !currentAttendanceID) {
    // Initialize students with "Not Set" status for new attendance
    const initialStudents = courseDetails.students.map((student) => ({
      id: student.id,
      name: student.name,
      attendancePercentage: student.attendancePercentage || '0%',
      status: 'Not Set', // Explicitly set to "Not Set"
      comments: '',
    }));
    setCurrentStudents(initialStudents);
  }
}, [mode, courseDetails.students, currentAttendanceID]);

// const handleSelectAll = (status) => {
//   setCurrentStudents(
//     currentStudents.map((student) => ({
//       ...student,
//       status,
//     }))
//   );
// };

const handleSelectAll = (status) => {
  if (mode === 'View' || isSubmitted) return; // Prevent changes in View mode or if submitted
  const updatedStudents = currentStudents.map((student) => ({
    ...student,
    status: status,
  }));
  setCurrentStudents(updatedStudents);
};

const handleStatusChange = (studentId, status) => {
  //if (mode === 'View' || isSubmitted) return; // Prevent changes in View mode or if submitted
  if (mode === 'View' ) return; // Prevent changes in View mode
  const updatedStudents = currentStudents.map((student) =>
    student.id === studentId ? { ...student, status } : student
  );
  setCurrentStudents(updatedStudents);
};

const handleCommentChange = (studentId, text) => {
  setCurrentStudents(
    currentStudents.map((student) =>
      student.id === studentId ? { ...student, comments: text } : student
    )
  );
};


const findAttendanceRecordByDate = (date) => {
  const formattedDate = formatDate(date);
  const courseRecords = Array.isArray(attendanceRecords[selectedCourse?.courseOfferingID])
    ? attendanceRecords[selectedCourse.courseOfferingID]
    : [];
  return courseRecords.find(
    (record) => record && record.AttendanceDate && formatDate(new Date(record.AttendanceDate)) === formattedDate
  );
};

 const [subjectType, setSubjectType] = useState('Theory'); // State for subject type
 const currentRecord = findAttendanceRecordByDate(date);
const isSubmitted = currentRecord?.Attendance_IsSubmitted || false;

//REset let me check testing
//commented

// useFocusEffect(
//     useCallback(() => {
//       // Reset to show summary table when the screen comes into focus
//       setShowAttendanceSummary(true);
//     }, [])
//   );


const now = new Date();
const hour_now = String(now.getHours()).padStart(2, '0');
const minutes_now = now.getMinutes();
const rounded = Math.ceil(minutes_now / 15) * 15;
const roundedMinutes = rounded === 60 ? 0 : rounded;
const minute_now = String(roundedMinutes).padStart(2, '0');
// Optional: end time as +1 hour
const endHourVal = String((now.getHours() + 1) % 24).padStart(2, '0');


const [startHour, setStartHour] = React.useState(hour_now);
const [startMinute, setStartMinute] = React.useState(minute_now);
const [endHour, setEndHour] = React.useState(endHourVal);
const [endMinute, setEndMinute] = React.useState(minute_now);

// const [startHour, setStartHour] = React.useState('00');
// const [startMinute, setStartMinute] = React.useState('00');
// const [endHour, setEndHour] = React.useState('00');
// const [endMinute, setEndMinute] = React.useState('00');

const validateEndTime = () => {
  if (startHour && endHour && startMinute && endMinute) {
    const startTimeMinutes = parseInt(startHour) * 60 + parseInt(startMinute);
    const endTimeMinutes = parseInt(endHour) * 60 + parseInt(endMinute);
    if (endTimeMinutes <= startTimeMinutes) {
      if (validEndHours.length > 0) {
        const newEndHour = validEndHours[0];
        setEndHour(newEndHour);
        const newValidEndMinutes = parseInt(newEndHour) === parseInt(startHour)
          ? minutes.filter((minute) => parseInt(minute) > parseInt(startMinute))
          : minutes;
        setEndMinute(newValidEndMinutes.length > 0 ? newValidEndMinutes[0] : '00');
        setEndTime(`${newEndHour}:${newValidEndMinutes.length > 0 ? newValidEndMinutes[0] : '00'}`);
      }
    }
  }
};
// React.useEffect(() => {
//   validateEndTime();
// }, [startHour, startMinute]);

const [isDataReady, setIsDataReady] = useState(false);

React.useEffect(() => {
 if (isDataReady) {
    validateEndTime();
  }
 }, [startHour, startMinute]);

const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
////const minutes = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));

//// Only keep quarter hours
const minutes = ["00", "15", "30", "45"];


// const validEndHours = startHour
//   ? hours.filter((hour) => parseInt(hour) >= parseInt(startHour))
//   : hours;

// const validEndMinutes = startHour && endHour
//   ? minutes.filter((minute) => {
//       if (parseInt(endHour) > parseInt(startHour)) return true;
//       if (parseInt(endHour) === parseInt(startHour)) return parseInt(minute) > parseInt(startMinute);
//       return false;
//     })
//   : minutes;

const validEndHours = React.useMemo(() => {
  if (!startHour) return hours;

  const startH = parseInt(startHour);
  const startM = parseInt(startMinute);

  // If startMinute is 45, we *cannot* allow same hour
  if (startM === 45) {
    const nextHour = (startH + 1).toString().padStart(2, '0');
    return hours.filter(hour => parseInt(hour) >= parseInt(nextHour));
  }

  // Normal case: allow same hour or later
  return hours.filter(hour => parseInt(hour) >= startH);
}, [startHour, startMinute]);

const validEndMinutes = React.useMemo(() => {
  if (!startHour || !endHour) return minutes;

  const startH = parseInt(startHour);
  const startM = parseInt(startMinute);
  const endH = parseInt(endHour);

  if (endH > startH) {
    return minutes;
  } else if (endH === startH) {
    // If start minute is 45, this block won't be used since endHour is forced to next hour
    return minutes.filter(minute => parseInt(minute) > startM);
  } else {
    return []; // invalid state, no minutes
  }
}, [startHour, startMinute, endHour]);


const [showSelectStudentsTable, setShowSelectStudentsTable] = useState(false);
const [selectedStudents, setSelectedStudents] = useState([]); // To track selected students



const renderStudentsAttendance = () => {
  if (!selectedCourse) {
    return (
      <View style={[styles.flex1]}>
        <View style={[styles.tableContainer]}>
          <Text style={[styles.labelStyle]}>No course selected</Text>
        </View>
      </View>
    );
  }

  const courseRecords = Array.isArray(attendanceRecords[selectedCourse.courseOfferingID])
    ? attendanceRecords[selectedCourse.courseOfferingID]
    : [];

  const sortedRecords = courseRecords
    .filter((record) => record && record.AttendanceDate)
    .sort((a, b) => new Date(b.AttendanceDate).getTime() - new Date(a.AttendanceDate).getTime());
 const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
////const minutes = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0')); // All minutes (00–59)
const minutes = ["00", "15", "30", "45"];

  const validEndHours = startHour
  ? hours.filter((hour) => parseInt(hour) >= parseInt(startHour))
  : hours;

const validEndMinutes = startHour && endHour
  ? minutes.filter((minute) => {
      if (parseInt(endHour) > parseInt(startHour)) return true;
      if (parseInt(endHour) === parseInt(startHour)) return parseInt(minute) > parseInt(startMinute);
      return false;
    })
  : minutes;

  if (showAttendanceSummary) {
    return (
      <View style={[styles.flex1]}>
        <View style={[styles.tableContainerLM]}>
          <View style={styles.HeaderContainer}>
          

              {/* Centered Heading */}
      <Text style={[styles.HeaderText]}>
              Attendance Summary 
            
                    <Text style={styles.noteText}>
                      (<Text style={styles.noteBold}>Note :</Text> Attendance will become un-editable<Text style={{ fontWeight: 'bold',backgroundColor:'yellow' }}> {config.DaysCount_Attendance_Editable} Days</Text> after attendance date.)
                    </Text>
           
            </Text>


<TooltipWrapper tooltipText="Click to add attendance">
            <TouchableOpacity
              accessible={true}
              accessibilityLabel="Mark new attendance"
              accessibilityRole="button"
              style={[
                styles.addLectureButton,
                Platform.OS === 'web' && !isMobile && isAddButtonHovered && styles.hoverEffect,
                
              ]}
              onPress={() => {
                handleAddNewAttendance();
               
              }}
              {...(Platform.OS === 'web' && !isMobile
                ? {
                    onMouseEnter: () => setIsAddButtonHovered(true),
                    onMouseLeave: () => setIsAddButtonHovered(false),
                  }
                : {})}
            >
              <Image source={images.plusCircle} style={styles.addLectureIcon} />
              <Text style={styles.addLectureButtonText}>Mark New Attendance</Text>
            </TouchableOpacity>
            </TooltipWrapper>
          </View>
           <ScrollView
            horizontal={isMobile}
            style={[styles.fullWidth]}
            contentContainerStyle={[styles.scrollContentContainer]}
            showsHorizontalScrollIndicator={isMobile}
            nestedScrollEnabled={isMobile}
            bounces={isMobile}
            scrollEnabled={isMobile} 
          >
          

         <View style={[styles.tableWrapper]}>
                    <View style={[styles.tableRow, styles.tableHeader]}>
                     <Text style={[styles.tableCell, styles.tableHeaderText, styles.serialColumn]}>S#</Text>
                     <Text style={[styles.tableCell, styles.tableHeaderText, styles.columnEqualWidth]}>Date</Text>
                     <Text style={[styles.tableCell, styles.tableHeaderText, styles.columnEqualWidth]}>Class Type</Text>
                     <Text style={[styles.tableCell, styles.tableHeaderText, styles.columnEqualWidth]}>Class Time</Text>
                     <Text style={[styles.tableCell, styles.tableHeaderText, styles.attachmentColumn]}>Present</Text>
                     <Text style={[styles.tableCell, styles.tableHeaderText, styles.attachmentColumn]}>Absent</Text>
                     <Text style={[styles.tableCell, styles.tableHeaderText, styles.attachmentColumn]}>Not Marked</Text>
                     <Text style={[styles.tableCell, styles.tableHeaderText, styles.columnEqualWidth]}>Status</Text>
                     <Text style={[styles.tableCell, styles.tableHeaderText, styles.columnEqualWidth]}>Actions</Text>
            </View>
            {/* <ScrollView
              // style={{ maxHeight: 240 }}
              scrollEnabled={sortedRecords.length > 5}
              nestedScrollEnabled={true}
              bounces={false}
              contentContainerStyle={{ width: '100%' }}
            > */}
              <View style={[styles.tableWrapper]}>
                {sortedRecords.length > 0 ? (
                  sortedRecords.map((record, index) => {
                    const present = record.students?.filter((s) => s.Status === 'Present').length || 0;
                    const absent = record.students?.filter((s) => s.Status === 'Absent').length || 0;
                    const notMarked = record.students?.filter((s) => s.Status === 'NotMarked').length || 0;
                    const isSubmitted = record.Attendance_IsSubmitted || false;
                    const today = new Date();
                    const attendanceDate = new Date(record.AttendanceDate);
                    
                    // Zero out time parts for both dates
                    today.setHours(0, 0, 0, 0);
                    attendanceDate.setHours(0, 0, 0, 0);
                    
                    // Calculate difference in days
                    const diffInDays = (today - attendanceDate) / (1000 * 60 * 60 * 24);
                    // Disable if attendance date is older than 17 days
                    const isDisabled = (diffInDays > `${config.DaysCount_Attendance_Editable}`) ; // 17;

                    const show_UnLockedSign =(!record.Attendance_IsLocked) && (diffInDays > `${config.DaysCount_Attendance_Editable}`);



                    //HOD OR Admin can unlock
                    const get_userRole = getGlobal('userRole') || 'Not Found';
                    

                   const get_TeacherID_ofCourse = parseInt(route.params?.facultyId || '-1', 10);
                   const get_TeacherID_LoggedInUser = parseInt(getGlobal('teacherId'), 10) || -1;


                   const isSamePerson = (get_TeacherID_LoggedInUser !== -1&& get_TeacherID_ofCourse === -1)||false;

                    //const CanView_Attendance = true;//Any body who can view this page have view attendance option
                    const CanSubmit_Attendance = (isSamePerson); //Only person Sees submit option
                    const CanDelete_Attendance = (isSamePerson); //Only person Sees delete option
                   // const CanEdit_Attendance = (isSamePerson || get_userRole === 'Admin'); //Admin OR same person Can EDIT
                    const CanEdit_Attendance = (isSamePerson ); //ONLY same person Can EDIT

                    //const HasAccess_To_Unlock = (get_userRole === 'HOD' || get_userRole === 'Admin');//Unlock Admin OR HOD
                    const HasAccess_To_Unlock = (get_userRole === 'SuperAdmin');//Unlock SuperAdmin

                    return (
                      <View
                        key={record.AttendanceID}
                        style={[styles.tableRowLM, index % 2 === 0 ? styles.tableRowEvenLM : styles.tableRowOddLM, isSubmitted && !isDisabled && styles.submittedRow , isDisabled && styles.disabledRow]}
                      >
                                                 <Text style={[styles.tableCell, styles.serialColumn]}>{index + 1}.</Text>
                                                                        <Text style={[styles.tableCell, styles.columnEqualWidth]}>{formatDate(record.AttendanceDate)}</Text>
                                                                        <Text style={[styles.tableCell, styles.columnEqualWidth]}>{record.Attendance_IsTheory?'Theory':''} {record.Attendance_IsPractical?'Practical':''} </Text>
                                                                        <Text style={[styles.tableCell, styles.columnEqualWidth]}>{record.Attendance_StartTime}-{record.Attendance_EndTime}</Text>
                                                                        <Text style={[styles.tableCell, styles.attachmentColumn]}>{present}</Text>
                                                                        <Text style={[styles.tableCell, styles.attachmentColumn]}>{absent}</Text>
                                                                        <Text style={[styles.tableCell, styles.attachmentColumn]}>{notMarked}</Text>
                                                 <Text style={[styles.tableCell, styles.columnEqualWidth]}>
                                                   {/* {'\n'} Att_ID : {record.AttendanceID} */}

                                                   {/* {'\n'}  Role : {getGlobal('userRole')||'Not Found'} */}
                          {record.Attendance_Status} 

{/* { !isDisabled && record.Attendance_Status} */}


 {/* if days passed & record is disabled */}
   {isDisabled && (
    <>
      {!show_UnLockedSign && (
        <>
          {/* always show this when show_UnLockedSign is false */}
          <TooltipWrapper tooltipText="Attendance is locked">
          <TouchableOpacity
            accessible={true}
            accessibilityLabel={`Attendance for ${formatDate(record.AttendanceDate)}`}
            accessibilityRole="button"
            style={[styles.lockIcon]}
            disabled={isDisabled}
          >
            <Image
              source={images.locked}
              style={[styles.pencilIconLM]}
            />
          </TouchableOpacity>
        </TooltipWrapper>

         
        </>
      )}

      {/* if show_UnLockedSign is true */}
      {show_UnLockedSign && (
        <TooltipWrapper tooltipText="Attendance is un-locked">
            <TouchableOpacity
              accessible={true}
              accessibilityLabel={`Attendance for ${formatDate(record.AttendanceDate)}`}
              accessibilityRole="button"
              style={[styles.lockIcon]}
              disabled={isDisabled}
            >
              <Image
                source={images.unlocked}
                style={[styles.pencilIconLM]}
              />
            </TouchableOpacity>
          </TooltipWrapper>
      )}
    </>
  )}


                                             {/* {record.Attendance_Status=='Submitted' ?  
                                             (record.Attendance_IsLocked?'Submitted & Locked':'Submitted & Unlocked') :record.Attendance_Status}  */}
                                              </Text>



    {/* <Text style={[styles.tableCell, { flex: 1,  }]}> Disabled : {(isDisabled)?'Yes':'No'} 
      {'\n'} Locked : {(record.Attendance_IsLocked)?'Yes':'No'}
      {'\n'} Submit : {(record.Attendance_IsSubmitted)?'Yes':'No'}
     
      {'\n'} Att_ID : {record.AttendanceID}
      {'\n'} Unlock : {(show_UnLockedSign)?'Yes':'No'}
      {'\n'}  Role : {getGlobal('userRole')||'Not Found'}
      {'\n'}Access : {(HasAccess_To_Unlock)?'Yes':'No'}
      {'\n'}Of ID : {get_TeacherID_ofCourse}
      {'\n'}By ID : {get_TeacherID_LoggedInUser}

 {'\n'}Same : {(isSamePerson)?'Yes':'No'}
     


    </Text> */}
   
    {/* {'\n'} Saved : {(record.Attendance_IsSaved)?'Yes':'No'} */}

  {/* <View style={[styles.tableCell, { flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }]}> */}

<View  style={[styles.tableCell, styles.columnEqualWidth]}>
  
{isDisabled && !show_UnLockedSign  && HasAccess_To_Unlock && (
            <TooltipWrapper tooltipText="Click to Unlock attendance">
              <TouchableOpacity
                accessible={true}
                accessibilityLabel="View and select students"
                accessibilityRole="button"
                style={[styles.actionButtonLM, { backgroundColor: 'lightgreen', opacity: 1 }]}
                onPress={() => handleUnlockAttendance(record.AttendanceID, record.AttendanceDate)}
                {...(Platform.OS === 'web' && !isMobile
                  ? {
                      onMouseEnter: () => setIsAddButtonHovered(true),
                      onMouseLeave: () => setIsAddButtonHovered(false),
                    }
                  : {})}
                disabled={false}
              >
                <Image
                  source={images.unlocked}
                  style={styles.pencilIconLM}
                  onError={() => console.warn('Failed to load unlocked icon')}
                />
              </TouchableOpacity>
            </TooltipWrapper>
          )}





  {/* if days NOT passed & record is NOT disabled */}
  { ((!isDisabled && CanEdit_Attendance) || (isDisabled && CanEdit_Attendance && !record.Attendance_IsLocked )) && (

     <TooltipWrapper tooltipText="Click to Edit Attendance">
                          <TouchableOpacity
                            accessible={true}
                            accessibilityLabel={`Edit attendance for ${formatDate(record.AttendanceDate)}`}
                            accessibilityRole="button"
                            onPress={() => 
                              handleEditAttendance(record.AttendanceID, record.AttendanceDate,isDisabled,show_UnLockedSign,record.Attendance_IsSubmitted)
                              
                            
                            }
                            //style={[styles.actionButtonLM, styles.editButtonLM, { padding: isMobile ? 6 : 6, marginRight: 4, opacity: isDisabled ? 0.5 : 1 , backgroundColor:'orange' }]}
                            style={[styles.actionButtonAtt]}
                            // disabled={isDisabled}
                          >
                            <Image source={images.pencil} style={[styles.pencilIconLM]} />
                          </TouchableOpacity>

</TooltipWrapper>

  )}
  <TooltipWrapper   tooltipText="Click to view attendance">
                          <TouchableOpacity
                            accessible={true}
                            accessibilityLabel={`View attendance for ${formatDate(record.AttendanceDate)}`}
                            accessibilityRole="button"
                            onPress={() => 
                              handleViewAttendance(record.AttendanceID, record.AttendanceDate)
                              

                            }
                            style={[styles.actionButtonAtt]}
                            // backgroundColor: 'lightgreen'
                          >
                            {/* <Text style={[styles.buttonText, { fontSize: isMobile ? 10 : 12 }]}>View</Text> */}
                              <Image
                                    source={images.view}
                                    style={styles.pencilIconLM}
                                    onError={() => console.warn('Failed to load view icon')}
                                               />


                          </TouchableOpacity>
</TooltipWrapper>


{ ((!isDisabled   && CanSubmit_Attendance) || (isDisabled   && CanSubmit_Attendance && !record.Attendance_IsLocked))
&&
<TooltipWrapper   tooltipText="Click to submit attendance">
                          <TouchableOpacity
                            accessible={true}
                            accessibilityLabel={`Submit attendance for ${formatDate(record.AttendanceDate)}`}
                            accessibilityRole="button"
                            onPress={() => 
                            {



                                setPopupAlertType('confirmation');
      setPopupAlertTitle('Confirm Submit ??'); // Set custom title
      setPopupAlertMessage("Are you sure you want to submit this attendance ?");
      setPopupAlertButtons([
        { text: 'No', onPress: () => setShowAlertPopup(false) },
        { text: 'Yes', onPress: () => {
          setShowAlertPopup(false);
          //handleSaveOrSubmitAttendance('submit');
          handleSubmitAttendance(record.AttendanceID, 'submit');
          // setEmail('');
          // setPassword('');
        }},
      ]);
      //console.log('Error Popup State:', { popupType, popupTitle, popupMessage, popupButtons });
      setShowAlertPopup(true);
                            
}
                            
                            
                            }
                             style={[styles.actionButtonAtt]}
                           
                          >
                             <Image
                                                 source={images.fileDocument}
                                                 style={styles.pencilIconLM}
                                                  
                                                 onError={() => console.warn('Failed to load Submit icon')}
                                               />
                                              
                                               
                          </TouchableOpacity>


</TooltipWrapper>

  }




{!isDisabled && CanDelete_Attendance
&&
<TooltipWrapper   tooltipText="Click to delete attendance">
                           <TouchableOpacity
                            accessible={true}
                            accessibilityLabel={`Delete attendance for ${formatDate(record.AttendanceDate)}`}
                            accessibilityRole="button"
                            onPress={() => {

 console.log('submit attendance pressed');

    setPopupAlertType('confirmation');
      setPopupAlertTitle('Confirm Delete ??'); // Set custom title
      setPopupAlertMessage("Are you sure you want to delete this attendance ?");
      setPopupAlertButtons([
        { text: 'No', onPress: () => setShowAlertPopup(false) },
        { text: 'Yes', onPress: () => {
          setShowAlertPopup(false);
          //handleSaveOrSubmitAttendance('submit');
          handleDeleteAttendance(record.AttendanceID);
          // setEmail('');
          // setPassword('');
        }},
      ]);
      //console.log('Error Popup State:', { popupType, popupTitle, popupMessage, popupButtons });
      setShowAlertPopup(true);

                            }}
                            style={[styles.actionButtonAtt]}
                            // backgroundColor: '#ff0800'
                            disabled={isDisabled}
                          >
                           
                           
                                                     
                                                          <Image
                                                 source={images.deleteIcon}
                                                 style={styles.pencilIconLM}
                                                  
                                                 onError={() => console.warn('Failed to load delete icon')}
                                               />
                                              
                                               
                          </TouchableOpacity>

</TooltipWrapper>

                          }


</View>








                      </View>
                    );
                  })
                ) : (
                  <View style={styles.tableRowLM}>
                    <Text style={[styles.tableCell, styles.columnEqualWidth]}>No attendance records available</Text>
                  </View>
                )}
              </View>
            {/* </ScrollView> */}
          </View>
          </ScrollView>
        </View>
      </View>
    );
  }

  
    if (showSelectStudentsTable) {
    
      //Below was commented because it was Wrong
    //  //const currentRecord = findAttendanceRecordByDate(date);

        
  
    return (


      



      <View style={styles.flex1}>
        <View style={[styles.tableContainerLM]}>
          <View style={[styles.lectureHeaderContainer]}>
            <TooltipWrapper tooltipText="Back to attendance summary">
              <TouchableOpacity
                accessible={true}
                accessibilityLabel="Back to attendance summary"
                accessibilityRole="button"
                onPress={() => {
                  setShowSelectStudentsTable(false);
                  setShowAttendanceSummary(true);
                  setSelectedStudents([]); // Reset selected students
                }}
                style={[styles.actionButtonback, styles.backButton]}
              >
                <Image source={images.arrowLeft} style={[styles.addLectureIcon]} />
                <Text style={[styles.addLectureButtonText]}>Back</Text>
              </TouchableOpacity>
            </TooltipWrapper>
            <Text style={[styles.lectureHeaderText]}>Select Students</Text>
          </View>
          <View style={[styles.formContainer]}>
            <View style={[styles.formRow]}>
              <View style={[styles.AddAttendancecontainer]}>
               
                <View style={styles.columnEqualWidth}>
    <Text style={[styles.formLabel, { marginBottom: 4 }]}>Date:</Text>
    <Text style={[styles.inputContainer, ]}>
      {date instanceof Date ? date.toLocaleDateString('en-CA') : date}
    </Text>
  </View>
                <View style={styles.columnEqualWidth}>
                  <Text style={[styles.formLabel]}>Subject Type :</Text>
                  <Text style={[styles.inputContainer,]}>
                    {subjectType}
                  </Text>
                </View>
                <View style={styles.columnEqualWidth}>
                  <Text style={[styles.formLabel]}>Start Time (HH:MM)</Text>
                  <Text style={[styles.inputContainer, ]}>
                    {startHour}:{startMinute}
                  </Text>
                </View>
                <View style={styles.columnEqualWidth}>
                  <Text style={[styles.formLabel]}>End Time (HH:MM)</Text>
                  <Text style={[styles.inputContainer,]}>
                    {endHour}:{endMinute}
                  </Text>
                </View>
              </View>
            </View>
            {/* {currentRecord?.globalComments && ( */}
              <View style={[styles.commentsContainer]}>
                <Text style={[styles.commentsInput]}>
                  {globalComments}
                </Text>
              </View>
            {/* )} */}
          </View>
  
  <Text style={styles.noteText}>
      (<Text style={styles.noteBold}>Note :</Text> Select checkboxes to unlock student's attendance)
    </Text>
  
  
          <View style={[styles.buttonRow_MES]}>
    <TooltipWrapper tooltipText="Select student to enable his/her attendance">
      <TouchableOpacity
        style={[styles.submitButton]}

        onPress={async () => {
  if (selectedStudents.length === 0) {
    setPopupAlertType('error');
    setPopupAlertTitle('Error');
    setPopupAlertMessage('Please select students before unlocking.');
    setPopupAlertButtons([{ text: 'OK', onPress: () => setShowAlertPopup(false) }]);
    setShowAlertPopup(true);
    return;
  }

  try {
    const token = await AsyncStorage.getItem('token');
    const response = await fetch(`${config.BASE_URL}/api/attendance/UnlockAttendance`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        attendanceId: currentAttendanceID,        // your state
        studentIds: selectedStudents              // array of selected student IDs
      })
    });

    if (!response.ok) {
      throw new Error('Failed to unlock attendance');
    }

    setPopupAlertType('success');
    setPopupAlertTitle('Success');
    setPopupAlertMessage(`Successfully unlocked ${selectedStudents.length} student's attendance.`);
    setPopupAlertButtons([{ text: 'OK', onPress: () => setShowAlertPopup(false) }]);
    setShowAlertPopup(true);

    // Optional: Refresh the view
    // await handleUnlockAttendance(currentAttendanceID);

  } catch (error) {
    console.error("Unlock failed:", error);
    setPopupAlertType('error');
    setPopupAlertTitle('Unlock Failed');
    setPopupAlertMessage('Something went wrong while unlocking attendance.');
    setPopupAlertButtons([{ text: 'OK', onPress: () => setShowAlertPopup(false) }]);
    setShowAlertPopup(true);
  }



  
///////////////////////  FK Refresh
    // Refresh records (if needed)
    await loadAttendanceFromAPI_ALL(selectedCourse.courseOfferingID);

    // Reset state
    setShowAttendanceSummary(true);
    setGlobalComments('');
    setCurrentStudents([]);
    setSubjectType('Theory');

      //Attendance compare check RESET states
   setIsDataReady(false); // trigger validation only after setting is done
   setIsEditDataReady(false);
////////////////////////////////


}}
        accessible={true}
        accessibilityLabel="Save selected students"
        accessibilityRole="button"
        
      >
        <Text style={styles.buttonText}>Unlock</Text>
      </TouchableOpacity>
    </TooltipWrapper>
  </View>
          <ScrollView
            horizontal={isMobile}
            style={{ width: '100%' }}
            contentContainerStyle={{ minWidth: isMobile ? 650 : '100%' }}
            showsHorizontalScrollIndicator={isMobile}
            nestedScrollEnabled={false}
            bounces={false}
          >
            <View style={[styles.tableWrapper]}>
              {/* <View style={[styles.tableRowLM, styles.tableHeaderLM, { width: isMobile ? 650 : '100%' }]}>
                 <Text style={[styles.tableCell, styles.tableHeaderText, { flex: isMobile ? 0.5 : 0.4 }]}>Select</Text> */}
                 <View style={[styles.tableRow, styles.tableHeader, styles.tableHeaderRow]}>
          <Text style={[styles.tableCell, styles.tableHeaderText, styles.serialColumn]}>Select</Text>
          <Text style={[styles.tableCell, styles.tableHeaderText, styles.columnEqualWidth]}>Reg. No.</Text>
          <Text style={[styles.tableCell, styles.tableHeaderText, styles.columnEqualWidth]}>Students</Text>
                {/* <Text style={[styles.tableCell, styles.tableHeaderText, { flex: isMobile ? 0.5 : 0.4 }]}>Present</Text>
                <Text style={[styles.tableCell, styles.tableHeaderText, { flex: isMobile ? 0.5 : 0.4 }]}>Absent</Text> */}
           <Text style={[styles.tableCell, styles.tableHeaderText, styles.columnEqualWidth]}>Status</Text>
                {/* <Text style={[styles.tableCell, styles.tableHeaderText, { flex: isMobile ? 1 : 0.9 }]}>Comments (Optional)</Text> */}
               
              </View>
              <ScrollView
                style={{
                  overflow: 'scroll',
                }}
                scrollEnabled={currentStudents.length > 5}
                nestedScrollEnabled={true}
                bounces={false}
                contentContainerStyle={styles.scrollContentContainer}
              >
                <View style={[styles.tableWrapper]}>
                  {currentStudents.length > 0 ? (
                    currentStudents.map((student, index) => (
                      <View
                        key={student.id || index}
                        style={[styles.tableRowLM, index % 2 === 0 ? styles.tableRowEvenLM : styles.tableRowOddLM]}
                      >
                        {/* <View style={[styles.tableCell, { flex: isMobile ? 0.5 : 0.4, justifyContent: 'center', alignItems: 'center' }]}> */}
                          <View style={[styles.tableCell,  styles.serialColumn]}>
                         {/* <View style={[styles.tableCell, { flex: isMobile ? 0.5 : 0.4, justifyContent: 'center', alignItems: 'center' }]}> */}
    <TouchableOpacity
      style={[
        styles.checkbox,
        selectedStudents.includes(student.id) && styles.checkboxSelected,
        
      ]}
      onPress={() => {
        setSelectedStudents((prev) =>
          prev.includes(student.id)
            ? prev.filter((id) => id !== student.id)
            : [...prev, student.id]
        );
      }}
      accessible={true}
      accessibilityLabel={`Select student ${student.name}`}
    >
      {selectedStudents.includes(student.id) && (
        <View style={[styles.checkboxInner]} />
      )}
    </TouchableOpacity>
  {/* </View> */}
                        </View>
                       <Text style={[styles.tableCell,styles.columnEqualWidth]}>{student.id}</Text>
<Text style={[styles.tableCell,styles.columnEqualWidth]}>
                            {student.name} ({student.attendancePercentage || '0%'})
                        </Text>
                       
                       
<Text style={[styles.tableCell,styles.columnEqualWidth]}>
                            {student.status || 'Not Set'}
                        </Text>
                        {/* <Text style={[styles.tableCell, { flex: isMobile ? 1 : 0.9, fontSize: isMobile ? 10 : 14, padding: isMobile ? 4 : 6 }]}>
                          {student.comments || ''}
                        </Text>
                         */}
                      </View>
                    ))
                  ) : (
                    <View style={styles.tableRowLM}>
<Text style={[styles.tableCell,styles.columnEqualWidth]}>
                          No students enrolled</Text>
                    </View>
                  )}
                </View>
              </ScrollView>
            </View>
          </ScrollView>
        </View>
      </View>
    );
  }

   const AlwaysDisable_WhileEditing = (mode === 'View' || isSubmitted || isEditing);
   const Disable_ViewMode_OR_Submitted = (mode === 'View' || isSubmitted);


    const Allow_Edit_AttendanceDetail=  (!MainAttendance_isSubmitted  ||   (MainAttendance_isSubmitted && MainAttendance_isDisabled && MainAttendance_show_UnLockedSign));


  return (
    <View style={styles.flex1}>
      <View style={[styles.tableContainerLM]}>
        <View style={[styles.lectureHeaderContainer]}>

          <TooltipWrapper tooltipText="Click to view attendance summary">

          
          <TouchableOpacity
            accessible={true}
            accessibilityLabel="Back to attendance summary"
            accessibilityRole="button"
            onPress={() => {
              setShowAttendanceSummary(true);
              setMode('Edit');
              setIsEditing(false);
              setCurrentAttendanceID(null);
            }}
            style={[styles.actionButtonback, styles.backButton]}
          >
            <Image source={images.arrowLeft} style={[styles.addLectureIcon]} />
            <Text style={[styles.addLectureButtonText]}>Back</Text>
          </TouchableOpacity>
          </TooltipWrapper>

          <Text style={[styles.lectureHeaderText]}>
            {mode === 'View' ? 'View Attendance' : isEditing ? 'Edit Attendance' : 'Add Attendance'}
          </Text>
        </View>
          <View style={[styles.formContainer]}>
                  <View style={[styles.formRow]}>
                    <View
                      style = {[styles.AddAttendancecontainer
                       
                      ]} >
              <View style={styles.addAttendanceColumns}>
                <Text style={[styles.formLabel, { marginBottom: 4 }]}>Date :</Text>
                <View style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 6 }}>
              {Platform.OS === 'web' ? (
                <DatePicker
                  selected={date}
                  onChange={(selectedDate) => {
                    if (selectedDate && !isNaN(selectedDate.getTime())) {
                      console.log(" Picker selected "+selectedDate);
                      const FormatedDate = new Date(selectedDate).toLocaleDateString('en-CA');
                      console.log("My formated for Picker selected "+FormatedDate);

                      //setDate(selectedDate);
                      setDate(FormatedDate);
                    }
                  }}
                  dateFormat="yyyy-MM-dd"
                  className="date-picker"
                  wrapperClassName="date-picker-wrapper"
                  placeholderText="Select a date"
                  showPopperArrow={false}
                  customInput={
                     <TextInput
                                              style={[styles.inputContainer ]}
                                                                  placeholderTextColor="#999"
                                                                  editable={false}
                                                                />
                                      }
                  disabled={AlwaysDisable_WhileEditing}
                />
              ) : (
                <>
                  <TouchableOpacity
                    accessible={true}
                    accessibilityLabel="Select date"
                    onPress={() => mode !== 'View' && !MainAttendance_isSubmitted && setShowDatePicker(true)}
                  >
                    <TextInput
                   style={[styles.inputContainer ]}
                    
                   value={date.toLocaleDateString('en-CA')}
                editable={false}
                pointerEvents="none"
                 />
                  </TouchableOpacity>
                  {showDatePicker && (
                    <DateTimePicker
                      value={date}
                      mode="date"
                      display={Platform.OS === 'ios' ? 'calendar' : 'default'}
                      onChange={(event, selectedDate) => {
                        setShowDatePicker(Platform.OS === 'ios');
                        if (selectedDate && !isNaN(selectedDate.getTime())) {
                          console.log(" Picker selected "+selectedDate);
                      const FormatedDate = new Date(selectedDate).toLocaleDateString('en-CA')
                      console.log("My formated for Picker selected "+FormatedDate);

                      //setDate(selectedDate);
                      setDate(FormatedDate);
                        }
                      }}
                      maximumDate={new Date()}
                    />
                  )}
                </>
              )}
            </View>
          </View>
              <View style={styles.addAttendanceColumns}>
                <Text style={[styles.formLabel, {}]}>Subject Type :</Text>
                <View style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 6, overflow: 'hidden' }}>
                  {Platform.OS === 'web' ? (
                  <select
                    value={subjectType}
                    onChange={(e) => setSubjectType(e.target.value)}
                    style={{
                      width: '100%',
                      height: '100%',
                      border: 'none',
                      backgroundColor: '#fff',
                      fontSize: isMobile ? 12 : 16,
                      padding: 8,
                    }}
                    accessible={true}
                    accessibilityLabel="Select subject type"
                    disabled={AlwaysDisable_WhileEditing}
                  >
                     
                    <option value="Theory">Theory </option>
                    {selectedCourse?.hasPractical && (
                        <option value="Practical">Practical</option>
                      )}
                    

                  </select>
                // </View>
              ) : (
                <Picker
                  selectedValue={subjectType}
                  onValueChange={(itemValue) => setSubjectType(itemValue)}
                  style={{
                        width: '100%',
                        fontSize: isMobile ? 10 : 16,
                      }}
                  accessibilityLabel="Select subject type"
                  enabled={mode !== 'View' && !MainAttendance_isSubmitted && !isEditing}
                >

                  <Picker.Item label="Theory" value='Theory' />
                      {selectedCourse?.hasPractical && (
                          <option value="Practical">Practical</option>
                      )}

                </Picker>
              )}
            </View>
          </View>







            <View style={styles.addAttendanceColumns}>
                  <Text style={[styles.formLabel, ]}>Start Time (HH:MM)


                              {/* {
                                //  isEditing &&
                                     <Text>{'\n'} Previous Selected: {startHour}:{startMinute}   </Text>
                                  }   */}



                                </Text>
                  <View style={{ flexDirection: 'row', columnGap: isMobile ? 4 : 8 }}>






{/* isEditDataReady && startHour && startMinute &&endHour &&endMinute  */}   
   {    (
                           
             Platform.OS === 'web' ? (
               <>
                 {/* <View style={[styles.formInput, { flex: 1, marginRight: 5 }]}> */}



                   <select
                     value={startHour}
                     onChange={(e) => {
                       setStartHour(e.target.value);
                       setStartTime(`${e.target.value}:${startMinute}`);
                     }}
                     style={{
                      flex: 1,
                          padding: isMobile ? 6 : 8,
                          backgroundColor: '#fff',
                          borderWidth: 1,
                          borderColor: '#ccc',
                          borderRadius: 6,
                          fontSize: isMobile ? 10 : 16,
                     }}
                     accessible={true}
                     accessibilityLabel="Select start hour"
                     disabled={Disable_ViewMode_OR_Submitted}
                   >
                     {hours.map((hour) => (
                       <option key={hour} value={hour}>
                         {hour}
                       </option>
                     ))}
                   </select>
                 {/* </View> */}
                  <Text style={{ marginHorizontal: 4, fontSize: isMobile ? 12 : 20 }}>:</Text>
                 {/* <View style={[styles.formInput, { flex: 1, marginLeft: 5 }]}> */}
                   <select
                     value={startMinute}
                     onChange={(e) => {
                       setStartMinute(e.target.value);
                       setStartTime(`${startHour}:${e.target.value}`);
                     }}
                     style={{
                       flex: 1,
                          padding: isMobile ? 6 : 8,
                          backgroundColor: '#fff',
                          borderWidth: 1,
                          borderColor: '#ccc',
                          borderRadius: 6,
                          fontSize: isMobile ? 10 : 16,
                     }}
                     accessible={true}
                     accessibilityLabel="Select start minute"
                     disabled={Disable_ViewMode_OR_Submitted}
                   >
                     {minutes.map((minute) => (
                       <option key={minute} value={minute}>
                         {minute}
                       </option>
                     ))}
                   </select>
                 {/* </View> */}
               </>
             ) : (
               <>
                 <Picker
                   selectedValue={startHour}
                   onValueChange={(itemValue) => {
                     setStartHour(itemValue);
                     setStartTime(`${itemValue}:${startMinute}`);
                   }}
                   style={{ flex: 1, fontSize: isMobile ? 10 : 16 }}
                   enabled={mode !== 'View' && !MainAttendance_isSubmitted}
                   accessibilityLabel="Select start hour"
                 >
                   {hours.map((hour) => (
                     <Picker.Item key={hour} label={hour} value={hour} />
                   ))}
                 </Picker>
                 <Text style={{ fontSize: isMobile ? 12 : 16, alignSelf: 'center' }}>:</Text>
                 <Picker
                   selectedValue={startMinute}
                   onValueChange={(itemValue) => {
                     setStartMinute(itemValue);
                     setStartTime(`${startHour}:${itemValue}`);
                   }}
                   style={{ flex: 1, fontSize: isMobile ? 10 : 16 }}
                   enabled={mode !== 'View' && !MainAttendance_isSubmitted}
                   accessibilityLabel="Select start minute"
                 >
                   {minutes.map((minute) => (
                     <Picker.Item key={minute} label={minute} value={minute} />
                   ))}
                 </Picker>
               </>
             )

            )}
           



            

            </View>
                         </View>




                         <View style={styles.addAttendanceColumns}>
                              <Text style={[styles.formLabel, {  }]}>End Time (HH:MM)



                                                       {/* {
                                                          // isEditing &&
                                                <Text>{'\n'} Previous Selected: {endHour}:{endMinute}   </Text>
                                             }   */}



                                                      </Text>
                           <View style={{ flexDirection: 'row', columnGap: isMobile ? 4 : 8 }}>

{isEditDataReady && (
             Platform.OS === 'web' ? (
               <>
                 {/* <View style={[styles.formInput, { flex: 1, marginRight: 5 }]}> */}
                   <select
                     value={endHour}
                     onChange={(e) => {
                       setEndHour(e.target.value);
                       setEndTime(`${e.target.value}:${endMinute}`);
                     }}
                     style={{
                       flex: 1,
    padding: isMobile ? 6 : 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    fontSize: isMobile ? 10 : 16,
                     }}
                     accessible={true}
                     accessibilityLabel="Select end hour"
                     disabled={Disable_ViewMode_OR_Submitted}
                   >
                     {validEndHours.map((hour) => (
                       <option key={hour} value={hour}>
                         {hour}
                       </option>
                     ))}
                   </select>
                 {/* </View> */}
                 <Text style={{ marginHorizontal: 4, fontSize: isMobile ? 12 : 20}}>:</Text>
                                       <select
                   value={endMinute}
                   onChange={(e) => {
                     setEndMinute(e.target.value);
                     setEndTime(`${endHour}:${e.target.value}`);
                   }}
                   style={{
                     flex: 1,
                     padding: isMobile ? 6 : 8,
                     backgroundColor: '#fff',
                     borderWidth: 1,
                     borderColor: '#ccc',
                     borderRadius: 6,
                     fontSize: isMobile ? 10 : 16,
                   }}
                   disabled={Disable_ViewMode_OR_Submitted}
                 >
                   {validEndMinutes.map((minute) => (
                     <option key={minute} value={minute}>
                       {minute}
                     </option>
                   ))}
                 </select>
                 {/* </View> */}
               </>
             ) : (
               <>
                 <Picker
                   selectedValue={endHour}
                   onValueChange={(itemValue) => {
                     setEndHour(itemValue);
                     setEndTime(`${itemValue}:${endMinute}`);
                   }}
                     style={{ flex: 1, fontSize: isMobile ? 12 : 16 }}
                   enabled={mode !== 'View' && !MainAttendance_isSubmitted}
                   accessibilityLabel="Select end hour"
                 >
                   {hours.map((hour) => (
                     <Picker.Item key={hour} label={hour} value={hour} />
                   ))}
                 </Picker>
                 <Text style={{ fontSize: isMobile ? 12 : 16, alignSelf: 'center' }}>:</Text>
                 <Picker
                   selectedValue={endMinute}
                   onValueChange={(itemValue) => {
                     setEndMinute(itemValue);
                     setEndTime(`${endHour}:${itemValue}`);
                   }}
                   style={[styles.formInput, { flex: 1, marginLeft: 5, fontSize: isMobile ? 12 : 16 }]}
                   enabled={mode !== 'View' && !MainAttendance_isSubmitted}
                   accessibilityLabel="Select end minute"
                 >
                   {minutes.map((minute) => (
                     <Picker.Item key={minute} label={minute} value={minute} />
                   ))}
                 </Picker>
               </>
             )

            )}
</View>
                         </View>
</View>
                     </View>


                     
          <View style={[styles.buttonRow_MES]}>
          {mode !== 'View' && (Allow_Edit_AttendanceDetail) && (
              <>


 <TooltipWrapper tooltipText="Click to add general comments">
            <TouchableOpacity
              style={styles.commentsButton}
              onPress={handleShowComments}
              disabled={mode==='view' || !Allow_Edit_AttendanceDetail}      //{Disable_ViewMode_OR_Submitted}
            >
              <Text style={styles.buttonText}>Comments
  {/* {(Allow_Edit_AttendanceDetail)?  '\n Fk Allowed Edit' : '\n FK Not Allowed'} */}

              </Text>
            </TouchableOpacity>
            </TooltipWrapper>






              <TooltipWrapper tooltipText="Click to save attendance">
                <TouchableOpacity
                  style={[styles.submitButton]}
                  onPress={()=>
                    {
                      handleSaveOrSubmitAttendance('save');
                    }
                }
                >
                  <Text style={styles.buttonText}>Save</Text>
                </TouchableOpacity>
                </TooltipWrapper>

                {/* <TouchableOpacity
                  style={styles.submitButton}
                   onPress={()=>
                     {
                      confirmSubmitAttendance();
                      // handleSaveOrSubmitAttendance('submit');
                     }
                 }

                 
                >
                  <Text style={styles.buttonText}>Submit</Text>
                </TouchableOpacity> */}

              </>
            )}
          </View>
        </View>
        {showComments && (
           <View style={[styles.commentsContainer,]}>
                                <TextInput
                                  style={[styles.commentsInput, {  }]}
                                  value={globalComments}
                        onChangeText={setGlobalComments}
                        placeholder="Enter comments for attendance..."
                        multiline={true}
                        editable={mode !== 'View' && (Allow_Edit_AttendanceDetail)}
                      />
          </View>

          
        )}
        <ScrollView
                  horizontal={isMobile}
                  style={styles.fullWidth}
                  contentContainerStyle={styles.scrollContentContainer}
                  showsHorizontalScrollIndicator={isMobile}
                  nestedScrollEnabled={false}
                  bounces={false}
                >
        <View style={[styles.tableWrapper]}>
                            <View style={[styles.tableRow, styles.tableHeader, styles.tableHeaderRow]}>
          <Text style={[styles.tableCell, styles.tableHeaderText, styles.columnEqualWidth]}>Reg. No.</Text>
          <Text style={[styles.tableCell, styles.tableHeaderText, styles.columnEqualWidth]}>Students</Text>
                              <View style={[styles.tableCell,styles.columnEqualWidth ,{flexDirection: 'row', alignItems: 'center' }]}>
                                <Text style={[styles.tableHeaderText, { flex: isMobile ? 0.3 : 0.2,  }]}>Present</Text>
                       
                       <TooltipWrapper tooltipText="Click to make all present">
                        <TouchableOpacity
                          style={[styles.radioButton]}
                          onPress={() => handleSelectAll('Present')}
                          accessible={true}
                          accessibilityLabel="Select all Present"
                          disabled={Disable_ViewMode_OR_Submitted}
                        >
                          <View style={[styles.radioButtonSelected]} />
                        </TouchableOpacity>
                        </TooltipWrapper>
                      </View>
                       <View style={[styles.tableCell, styles.columnEqualWidth, {  flexDirection: 'row', alignItems: 'center' }]}>
                                              <Text style={[styles.tableHeaderText, { flex: isMobile ? 0.3 : 0.2,  }]}>Absent</Text>
                                             <TooltipWrapper tooltipText="Click to make all absent">
                        <TouchableOpacity
                          style={[styles.radioButton]}
                          onPress={() => handleSelectAll('Absent')}
                          accessible={true}
                          accessibilityLabel="Select all Absent"
                          disabled={Disable_ViewMode_OR_Submitted}
                        >
                          <View style={[styles.radioButtonSelected]} />
                        </TouchableOpacity>
                        </TooltipWrapper>

                      </View>
                      <Text style={[styles.tableCell, styles.tableHeaderText, styles.columnEqualWidth]}>Status</Text>
                      <Text style={[styles.tableCell, styles.tableHeaderText, styles.columnflex2Width]}>Comments (Optional)</Text>
                      </View>
                    <ScrollView
                      style={{
                        // maxHeight: isMobile ? 200 : 240,
                        overflow: 'scroll',
                      }}
                      scrollEnabled={courseDetails.students.length > 5}
                      nestedScrollEnabled={true}
                      bounces={false}
                      contentContainerStyle={styles.scrollContentContainer}
                    >
                      <View style={[styles.tableWrapper]}>
                        {currentStudents.length > 0 ? (
                          currentStudents.map((student, index) => (
                          
                            <View
    
                            key={student.id || index}
  
                            style={[
    styles.tableRowLM,
    index % 2 === 0 ? styles.tableRowEvenLM : styles.tableRowOddLM,
    (mode !== 'View' && student.isEditable && MainAttendance_isDisabled && MainAttendance_show_UnLockedSign) && { backgroundColor: '#d4edda' } // light green
  ]}
     >
                              <Text style={[styles.tableCell, styles.columnEqualWidth]}>{student.id}
                               
                               
                             


                              </Text>
                              <Text style={[styles.tableCell, styles.columnEqualWidth]}>{student.name} ({student.attendancePercentage || '0%'})</Text>
                               <View style={[styles.tableCell,  styles.columnEqualWidth, {justifyContent: 'center', alignItems: 'center' }]}>
                                                            
                                <TouchableOpacity
                                  style={[styles.radioButton, student.status === 'Present' && styles.radioButtonSelected]}
                                  // onPress={() => handleStatusChange(student.id, 'Present')}

                                  

                                 onPress={() => {
    if (
      (!MainAttendance_isSubmitted && !MainAttendance_isDisabled) ||
      (student.isEditable && MainAttendance_isDisabled && MainAttendance_show_UnLockedSign)
    ) {
      handleStatusChange(student.id, 'Present');
    }
  }}
                                  
                                  
                                >
                                  
                                  {student.status === 'Present' && <View style={[styles.radioButtonInner]} />}
                                </TouchableOpacity>

                              




                              </View>
                                <View style={[styles.tableCell,  styles.columnEqualWidth, {justifyContent: 'center', alignItems: 'center' }]}>
                                <TouchableOpacity
                                  style={[styles.radioButton, student.status === 'Absent' && styles.radioButtonSelected ]}
                                  // onPress={() => handleStatusChange(student.id, 'Absent')}
                                  
                                  onPress={() => {
    if (
      (!MainAttendance_isSubmitted && !MainAttendance_isDisabled) ||
      (student.isEditable && MainAttendance_isDisabled && MainAttendance_show_UnLockedSign)
    ) {
      handleStatusChange(student.id, 'Absent');
    }
  }}
                                  
                                >
                                  {student.status === 'Absent' && <View style={[styles.radioButtonInner]} />}
                                </TouchableOpacity>
                              </View>
                              <Text style={[styles.tableCell, styles.columnEqualWidth ]}>{student.status || 'Not Set'}</Text>
                              
                              <TextInput
                                style={[styles.tableCellComments, styles.columnflex2Width]}
                                value={student.comments || ''}
                                onChangeText={(text) => handleCommentChange(student.id, text)}
                                placeholder="Enter Comments"
                                
                                  disabled={
                                   !(
                                        (!MainAttendance_isSubmitted && !MainAttendance_isDisabled) ||
                                      (student.isEditable && MainAttendance_isDisabled &&
                                              MainAttendance_show_UnLockedSign)
                                     )
                                   }
                                  
                                // editable={mode !== 'View' && !isSubmitted}
                              />
                            </View>
                          ))
                        ) : (
                          <View style={styles.tableRowLM}>
                            <Text style={[styles.tableCell, styles.columnEqualWidth ]}>No students enrolled</Text>
                          </View>
                        )}
                      </View>
                    </ScrollView>
                  </View>
                </ScrollView>
      </View>
    </View>
  );
};


const renderTabs = () => (
  <View style={[styles.tabContainer]}>
    {isMobile ? (
      
          <ScrollView
            horizontal
            scrollEnabled={false} // Disable scrolling
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.contentContainerStyle}
      >

         {selectedCourse && selectedCourse.courseOfferingID && (
        <SubMenuBar
          isMobile={isMobile}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          selectedCourse={selectedCourse} // Pass selectedCourse
          setSelectedCourse={setSelectedCourse}
          setShowAttendanceSummary={setShowAttendanceSummary}
          navigateSafely={navigateSafely}
          backIcon={images.arrowLeft}
          setShowStudentsList={setShowStudentsList}
                    setShowSummary={setShowSummary}
                     facultyId={initialParams.facultyId}
  isHODView={initialParams.isHODView}
  isAdminView={initialParams.isAdminView}
  courseOfferingID={initialParams.courseOfferingID}
                    
        />
        )}

  </ScrollView>
    ) : (
            <View
              style={
                // flexDirection: 'row',
                // justifyContent: 'center',
                // width:isMobile? '170%': '100%',
                // alignSelf: 'center',
                styles.contentContainerStyle
              }
            >
               {selectedCourse && selectedCourse.courseOfferingID && (
        <SubMenuBar
          isMobile={isMobile}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          selectedCourse={selectedCourse} // Pass selectedCourse
          setSelectedCourse={setSelectedCourse}
          setShowAttendanceSummary={setShowAttendanceSummary}
          navigateSafely={navigateSafely}
          backIcon={images.arrowLeft}
          setShowStudentsList={setShowStudentsList}
                    setShowSummary={setShowSummary}

                      facultyId={initialParams.facultyId}
  isHODView={initialParams.isHODView}
  courseOfferingID={initialParams.courseOfferingID}
                    
        />
        )}

      </View>
    )}
  </View>
);




const renderTabContent = () => (
  <>
   

    {/* Section container for tabs and tab content */}
    <View
      style={[
        styles.sectionContainer,
        {
          width: activeTab === 'Course Content' 
            ? (isMobile ? '95%' : '80%') // Width for Lecture Materials tab
            : (isMobile ? '95%' : '80%'), // Width for other tabs
          // height: activeTab === 'Course Content'
          //   ? (isMobile ? '90%' : '80%') // Reduced height for Lecture Materials tab
          //   : (isMobile ? '90%' : '80%') //height for other Tabs
          //   //: 'auto' // Default height for other tabs

          //   // ? (isMobile ? 400 : 200) // Reduced height for Lecture Materials tab
          //   //: (isMobile ? 400 : 200) //height for other Tabs
        }
      ]}
    >
      {/* {renderTabs()} */}
      {activeTab === 'Course Content' && renderLectureMaterials()}
      {activeTab === 'Attendance' && renderStudentsAttendance()}
      {activeTab === 'Students' && renderStudentList()}
      {/* {activeTab === 'Assignments' && renderAssignmentsSummary()} */}
      {activeTab === 'Quizzes' && renderQuizzesSummary()}
      {/* {activeTab === 'Projects' && renderProjects()}
      {activeTab === 'Student Grades' && renderStudentGrades()}
      {activeTab === 'DB' && renderDB()}
      {activeTab === 'Groups' && renderGroups()}
      {activeTab === 'QuizBank' && renderQuizBank()} */}
    </View>
  </>
);


// const renderHeader = () => (
//   <>
//      <View style={[styles.topBar]}>
//           <Text style={[styles.welcomeText]}>
//         Welcome {LoggedIn_UserName}
//       </Text>
//     </View>
//     <View style={[styles.header, isMobile && { paddingVertical: 2 }]}>
//       <View style={[styles.contentRow, isMobile && { flexDirection: 'column', alignItems: 'center' }]}>
//         <View style={[styles.logoContainer, isMobile && { width: '100%', marginBottom: 2 }]}>
//           <Image
//             source={images.logo}
//             style={[styles.logo, { width: isMobile ? 60 : 75, height: isMobile ? 60 : 75 }]}
//             onError={() => console.warn('Failed to load logo')}
//           />
//           <Text style={[styles.uniName, { fontSize: isMobile ? 12 : 16 }]}>
//             FOUNDATION UNIVERSITY{'\n'}ISLAMABAD
//           </Text>
//         </View>
//         <View style={[styles.menuContainer, isMobile && { width: '100%', alignItems: 'center' }]}>
//           <View style={[styles.menuGrid, { justifyContent: 'center' }, isMobile && { width: '100%', justifyContent: 'center' }, { flexWrap: isMobile ? 'wrap' : 'nowrap' }]}>
//             <MenuBar
//               isMobile={isMobile}
//               resetToDashboard={resetToDashboard}
//               isDashboardView={selectedCourse === null} // Pass isDashboardView based on selectedCourse
//               userRole={getGlobal('userRole') || 'Not Found'}
//             />
//           </View>
//         </View>
//         {!isMobile && (
//           <View style={styles.rightSection}>
//             <Image
//               source={images.i2}
//               style={styles.i2}
//               onError={() => console.warn('Failed to load i2 image')}
//             />
//           </View>
//         )}
//       </View>
//     </View>
//   </>
// );



const renderAssignedCourses = () => (
  <View style={[styles.tableContainer, { width: isMobile ? '90%' : '65%' }]}>
    <Text style={styles.heading}>Assigned Courses |  Current Session : {currentSession}</Text>
    <ScrollView
      style={[styles.tableWrapper]}
      nestedScrollEnabled={true}
      bounces={false}
    >
      <View>
         <View style={[styles.tableRow, styles.tableHeader]}>
                  <Text style={[styles.tableCell, styles.headerCell, { width: '10%',   }]}>
                   S# {/* Course No */}
                    </Text>
                  <Text style={[styles.tableCell, styles.headerCell, { width: '30%',   }]}>Course Name</Text>
                  <Text style={[styles.tableCell, styles.headerCell, { width: '30%',  }]}>Teaching Faculty</Text>
                  <Text style={[styles.tableCell, styles.headerCell, { width: '20%',   }]}>Credit Hours</Text>
                  <Text style={[styles.tableCell, styles.headerCell, { width: '10%',    }]}>Students</Text>
                </View>
        {errorMessage && courses.length === 0 ? (
          <View style={styles.tableRow}>
            <Text
              style={[styles.tableCell, { width: '100%',  color: '#f44336', textAlign: 'center' }]}
              accessible={true}
              accessibilityLabel={errorMessage}
            >
              {errorMessage}
            </Text>
          </View>
        ) : courses.length > 0 ? (
          courses.map((course, index) => (
            <TouchableOpacity
              accessible={true}
              accessibilityLabel={`View details for ${course.courseName}`}
              accessibilityRole="button"
              key={course.courseNo}
              style={[
                styles.tableRow,
                styles.courseCard,
                selectedCourse?.courseNo === course.courseNo && styles.selectedCourse,
                // Platform.OS === 'web' &&
                  !isMobile &&
                  hoveredCourse === course.courseNo &&
                  selectedCourse?.courseNo !== course.courseNo && styles.hoveredCourse,
              ]}
              onPress={async() => {
                setSelectedCourse(course);
                await AsyncStorage.setItem('selectedCourse', JSON.stringify(course));
                                
                loadCourseContents(course.courseOfferingID);
              }}
              activeOpacity={0.7}
              {...(Platform.OS === 'web' && !isMobile
                ? {
                    onMouseEnter: () => setHoveredCourse(course.courseNo),
                    onMouseLeave: () => setHoveredCourse(null),
                  }
                : {})}
              //uncomment above later temporary commented
            >
               <Text
                style={[styles.tableCell, styles.cellText, { width: '10%' ,  }]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {index+1}.
              </Text>

              {/* <Text
                style={[styles.tableCell, styles.cellText, { width: isMobile ? '20%' :'20%'  }]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                
              </Text> */}
              <Text
                style={[styles.tableCell, styles.cellText, { width: '30%' ,  }]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
              ({course.courseNo}) {course.courseName}
              </Text>


             <Text
                style={[styles.tableCell, styles.cellText, { width: '30%' , }]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
              {course.facultyName}
              </Text>



              <Text
                style={[styles.tableCell, styles.cellText, { width: '20%', }]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {course.credits}
              </Text>
              <Text
                style={[styles.tableCell, styles.cellText, { width: '10%' , }]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {course.students}
              </Text>
              
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.tableRow}>
            <Text
              style={[styles.tableCell, { width: '100%', fontSize: isMobile ? 16 : 16, textAlign: 'center' }]}
              accessible={true}
              accessibilityLabel="No courses available"
            >
              No courses available
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  </View>
);

const renderDashboardSummary = () => (
    <View style={[styles.summaryCard, { width: isMobile ? '90%' : '65%' }]}>
      <Text style={[styles.summaryTitle, { fontSize: isMobile ? 16 : 18 }]}>
        Dashboard Summary
      </Text>
      <View style={[styles.summaryGrid, isMobile && { flexWrap: 'wrap', justifyContent: 'space-between', padding: 8 }]}>
        <View style={[styles.summaryItem, { width: isMobile ? '48%' : '18%', marginVertical: isMobile ? 8 : 0 }]}>
          <Image
            source={images.bookOpen}
            style={{
              width: isMobile ? 28 : 28,
              height: isMobile ? 28 : 28,
              tintColor: '#3f51b5',
              resizeMode: 'contain',
            }}
          />
          <Text style={[styles.summaryLabel, { fontSize: isMobile ? 16 : 16 }]}>Total Courses</Text>
          <Text style={[styles.summaryValue, { fontSize: isMobile ? 16 : 16 }]}>{summary.totalCourses}</Text>
        </View>
        <View style={[styles.summaryItem, { width: isMobile ? '48%' : '18%', marginVertical: isMobile ? 8 : 0 }]}>
          <Image
            source={images.accountGroup}
            style={{
              width: isMobile ? 28 : 28,
              height: isMobile ? 28 : 28,
              tintColor: '#4caf50',
              resizeMode: 'contain',
            }}
          />
          <Text style={[styles.summaryLabel, { fontSize: isMobile ? 16 : 16 }]}>Total Students</Text>
          <Text style={[styles.summaryValue, { fontSize: isMobile ? 16 : 16 }]}>{summary.totalStudents}</Text>
        </View>
        
        <View style={[styles.summaryItem, { width: isMobile ? '48%' : '18%', marginVertical: isMobile ? 8 : 0 }]}>
          <Image
            source={images.bell}
            style={{
              width: isMobile ? 28 : 28,
              height: isMobile ? 28 : 28,
              tintColor: '#f44336',
              resizeMode: 'contain',
            }}
          />
          <Text style={[styles.summaryLabel, { fontSize: isMobile ? 16 : 16 }]}>Notifications</Text>
          <Text style={[styles.summaryValue, { fontSize: isMobile ? 16 : 16 }]}>{summary.notifications}</Text>
        </View>
      </View>
    </View>
  );
return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      ) : isMobile ? (
        // <View contentContainerStyle={[styles.scrollArea, { paddingBottom: 160 }]}>
                <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        
        <View>
          {/* {renderHeader()} */}
          <Header isMobile={isMobile} />
          
          {selectedCourse ? (
            <>
            
              {renderTabs()}
              {renderTabContent()}
            </>
          ) : (
            <>
              {renderAssignedCourses()}
              {renderDashboardSummary()}
            </>
          )}
        </View>
        </ScrollView>
      ) : (
        <>
          {/* {renderHeader()} */}
          <Header isMobile={isMobile} />
          
          <ScrollView contentContainerStyle={[styles.scrollArea, { paddingBottom: 1 }]}>
          {/* <View> */}
          {/* {renderInfoRow()} */}
            {selectedCourse ? (
              <>
                {renderTabs()}
                {renderTabContent()}
              </>
            ) : (
              <>
                {renderAssignedCourses()}
                {renderDashboardSummary()}
              </>
            )}
          </ScrollView>
        </>
      )}
      {modalVisible && modalType && (
        <TeacherPortalModal
                  isVisible={modalVisible}
                  onClose={() => setModalVisible(false)}
                  onSave={handleModalSave}
                  type={modalType}
                  initialData={modalInitialData || null}
                  maxWeek = {
                    Math.max(...courseDetails.lectureMaterials.map((m) => {
            const match = m.learningWeek?.match(/\d+/); // extract digits
            return match ? parseInt(match[0], 10) : 0;
          }))
                  }
                />
        
      )}

          <AlertModalPopUp
        visible={showAlertPopup}
        type={popupAlertType}
         title={popupAlertTitle}
        message={popupAlertMessage}
        buttons={popupAlertButtons}
        onClose={() => setShowAlertPopup(false)}
      />


    

    </View>
  );
};


                    
                    export default TeacherPortal;
    
    
    