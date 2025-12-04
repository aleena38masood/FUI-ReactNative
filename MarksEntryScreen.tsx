
// @ts-nocheck
import { useState, useEffect, useRef  } from 'react';
import {
  View,  Text,  TextInput,TouchableOpacity,ScrollView,useWindowDimensions,Alert,Image,Platform,Modal,
} from 'react-native';
import getStyles from '@/assets/TeacherPortalStyles';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
//import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import centralDataMarksEntry, { StudentTestMarks, TestQuestions } from '@/components/centralDataMarksEntry';
//import centralData from '@/components/centralData';
import MenuBar from '@/components/MenuBar';
import SubMenuBar from '@/components/SubMenuBar';
import images from '@/assets/images';
import { useNavigation,useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '@/components/HeaderComponent';
import TooltipWrapper from '@/assets/TooltipWrapper';

import config from '@/constants/config'; // adjust the path based on location

import { getGlobal,setGlobal } from '@/constants/Globals';


import CustomDatePicker from '@/components/CustomDatePicker';

type RootStackParamList = {
  TeacherPortal: { activeTab?: string; courseOfferingID?: number;facultyId?: number; reset?: boolean };
  MarksEntryScreen: { courseOfferingID?: number ;facultyId?: number; activeTab?: string; };
  TeacherProfile: undefined;
  Announcements: undefined;
  TeacherLogin: undefined;
};

import { useMemo } from 'react'
import { finishScreenTransition } from 'react-native-reanimated';


import AlertModalPopUp from '@/components/AlertModalPopUp'; // Adjust path as needed

type TestEntryNavigationProp = NativeStackNavigationProp<RootStackParamList, 'MarksEntryScreen'>;
//type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

type MarksEntryScreenRouteProp = RouteProp<RootStackParamList, 'MarksEntryScreen'>;

 



interface Course {
  CourseOfferedID: number;
  courseNo: string;
  courseName: string;
  credits?: string;
   creditHours_Practical : number;
 creditHours_Theory : number;
 hasPractical : boolean;

}

interface Student {
  studentId: string;
  rollNo: string;
  name: string;
}

interface TestType {
  TestTypeID: string;
  TestTypeName: string;
  NewTestID :string;
}

interface Topic {
  CO_Topics_ID: string;
  TopicTitle: string;
}

interface Test {
  Test_ID: string;
  TestTypeID: string;
  Test_No: number;
  Test_Name: string;
  CourseOfferedID: number;
 // CreatedBy: string;
 // CreatedDate: string;
  Test_Description: string;
  Test_Date: string;
  Test_TotalMarks: string;
  Test_IsVisible: boolean;
  Test_SubmissionAllowed: boolean;
  Test_Submission_StartDate: string;
  Test_Submission_EndDate: string;
}

interface TestQuestions {
  test_ID: string;
  test_Question_ID: string | number;
  question_Text: string;
  test_Question_No: number;
  test_Question_Marks: string;
  test_Question_CLO_ID: string;
}

interface MarksEntryDetail {
  M_Detail_ID: string;
  M_ID: string;
  studentId: string;
  TotalMarks: string;
  ObtainedMarks: string;
  Remarks: string;
  Created_By: string;
  Created_Date: string;
  Updated_By: string;
  Updated_Date: string;
}

interface centralDataMarksEntry {
  courses: Course[];
  studentsMap: { [key: number]: Student[] };
  tests: { [key: number]: Test[] };
  marksEntryDetails: { [key: string]: MarksEntryDetail[] };
  topicMap: { [key: number]: Topic[] };
  testTypes: TestType[];
  selectedCourseOfferingID: number | null;
  testTypes_Unique : TestType[];
}

const alert = (title: string, message: string) => {
  if (Platform.OS === 'web') {
    window.alert(`${title}\n${message}`);
  } else {
    Alert.alert(title, message);
  }
};


interface MarksSeedDTO {
  selectedCourseOfferingID: number;
  courses: Course[];
  studentsMap: { [courseOfferedID: number]: Student[] };
  testTypes: TestType[];
  tests: { [courseOfferedID: number]: Test[] };
  topicMap: { [courseOfferedID: number]: Topic[] };
  marksEntryDetails: { [m_ID: string]: MarksEntryDetail[] };
  testTypes_Unique: TestType[];
  testQuestions : TestQuestions[];
  studentTestMarks : StudentTestMarks[];
};

const MarksEntryScreen = () => {

  const navigation = useNavigation<TestEntryNavigationProp>();
  const route = useRoute<MarksEntryScreenRouteProp>();


 const { courseOfferingID, facultyId, activeTab: initialActiveTab , isHODView,isAdminView } = route.params || {};

  console.log('FK new param facultyId:', facultyId, 'courseOfferingID:', courseOfferingID);
   
  //const { courseOfferingID } = route.params || {};

  const facultyIdParam = parseInt(route.params?.facultyId || '-1', 10);
const isHODViewParam = route.params?.isHODView === 'true' || route.params?.isHODView === true;
const isAdminViewParam = route.params?.isAdminView === 'true' || route.params?.isAdminView === true;
 


  const { width } = useWindowDimensions();
    const isMobile = width < 768;
    const styles = getStyles(isMobile);

  
 // const courseOfferingID = centralDataMarksEntry.selectedCourseOfferingID;
 centralDataMarksEntry.selectedCourseOfferingID = courseOfferingID;

  const [activeTab, setActiveTab] = useState<string>('Marks Entry');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  //Newly Added
  const [selectedMarksDetails,setSelectedMarksDetails] = useState<MarksEntryDetail[]>([]);


  const [showAlertPopup, setShowAlertPopup] = useState(false);
    const [popupAlertType, setPopupAlertType] = useState('success');
    const [popupAlertTitle, setPopupAlertTitle] = useState('');
    const [popupAlertMessage, setPopupAlertMessage] = useState('');
    const [popupAlertButtons, setPopupAlertButtons] = useState([{ text: 'CONTINUE', onPress: () => {} }]);


   // const [activeTab, setActiveTab] = useState<string>('Marks Entry');

  // const [selectedCourse, setSelectedCourse] = useState<{
  //   courseOfferingID: number;
  //   courseNo: string;
  //   courseName: string;
  //   credits?: string;
  //   studentRollNos?: any[];
  // } | null>(null);

 const [showAttendanceSummary, setShowAttendanceSummary] = useState<boolean>(true);
//const [courses, setCourses] = useState<Course[]>(centralData.courses);
const [courses, setCourses] = useState<Course[]>([]);

  const [testTypeID, setTestTypeID] = useState<number>(-1);
  const [testTypeName, setTestTypeName] = useState('Select Test Type');

  const [examType, setExamType] = useState<string>(''); // Mid, Sessionals, Finals
 const [examName, setExamName] = useState<string>(''); // Selected exam name
const [examNames, setExamNames] = useState<string[]>([
  'Midterm Exam',
  'Final Exam',
  'Supplementary Exam',
  'Special Exam',
]); // Array of exam names
  const [testNo, setTestNo] = useState<number>(0);
  const [testName, setTestName] = useState<string>('');
  const [testDate, setTestDate] = useState<Date>(new Date());
  const [totalMarks, setTotalMarks] = useState<string>('');
  const [testDescription, setTestDescription] = useState<string>('');
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [submissionAllowed, setSubmissionAllowed] = useState<boolean>(true);
  const [submissionStartDate, setSubmissionStartDate] = useState<Date>(new Date());
  const [submissionEndDate, setSubmissionEndDate] = useState<Date>(new Date());
  const [selectedTopicID, setSelectedTopicID] = useState<string>('');
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [showSubmissionStartPicker, setShowSubmissionStartPicker] = useState<boolean>(false);
  const [showSubmissionEndPicker, setShowSubmissionEndPicker] = useState<boolean>(false);
  const [refreshKey, setRefreshKey] = useState<number>(0);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [marksModalVisible, setMarksModalVisible] = useState<boolean>(false);
  const [selectedTest, setSelectedTest] = useState<Test | null>(null);
  const [editModalVisible, setEditModalVisible] = useState<boolean>(false);
  const [editingDetail, setEditingDetail] = useState<MarksEntryDetail | null>(null);
  const [editedMarks, setEditedMarks] = useState<string>('');
  const [editedRemarks, setEditedRemarks] = useState<string>('');
  const [showStudentsList, setShowStudentsList] = useState<boolean>(false);
  const [showSummary, setShowSummary] = useState<boolean>(true);
  const [isAddButtonHovered, setIsAddButtonHovered] = useState(false);
  const [editTestModalVisible, setEditTestModalVisible] = useState<boolean>(false);
  const [editingTest, setEditingTest] = useState<Test | null>(null);
  const [editedTestName, setEditedTestName] = useState<string>('');
  const [editedTestDate, setEditedTestDate] = useState<Date>(new Date());
  const [editedTotalMarks, setEditedTotalMarks] = useState<string>('');
  const [editedTestDescription, setEditedTestDescription] = useState<string>('');
  const [editedIsVisible, setEditedIsVisible] = useState<boolean>(true);
  const [editedSubmissionAllowed, setEditedSubmissionAllowed] = useState<boolean>(true);
  const [editedSubmissionStartDate, setEditedSubmissionStartDate] = useState<Date>(new Date());
  const [editedSubmissionEndDate, setEditedSubmissionEndDate] = useState<Date>(new Date());
  const [showEditTestDatePicker, setShowEditTestDatePicker] = useState<boolean>(false);
  const [showEditSubmissionStartPicker, setShowEditSubmissionStartPicker] = useState<boolean>(false);
  const [showEditSubmissionEndPicker, setShowEditSubmissionEndPicker] = useState<boolean>(false);
  const [editMarksModalVisible, setEditMarksModalVisible] = useState<boolean>(false);
  const [editingTestId, setEditingTestId] = useState<string | null>(null);

  const [marksEntryId, setMarksEntryId] = useState<number | -1>(0);
  const [totalTestMarks, settotalTestMarks] = useState<number>(0);
//////////////////////////////////////////////////////
  ///////////NEW
  
  const [showQuestionsForm, setShowQuestionsForm] = useState<boolean>(false);
  const [testQuestions, setTestQuestions] = useState<TestQuestions[]>([]);
  const [newQuestionText, setNewQuestionText] = useState<string>('');
  const [newQuestionMarks, setNewQuestionMarks] = useState<string>('');
  const [newQuestionCLO, setNewQuestionCLO] = useState<string>('');
  const [questionCounter, setQuestionCounter] = useState<number>(1);
  
  //////////////////////////////////////////////////////////////////
  
  
  
  
    // Function to save test and questions
    const handleSaveTest = async () => {
      if (!editingTestId) {
        setPopupAlertType('error');
        setPopupAlertTitle('Error');
        setPopupAlertMessage('No test selected for saving.');
        setPopupAlertButtons([{ text: 'OK', onPress: () => setShowAlertPopup(false) }]);
        setShowAlertPopup(true);
        return;
      }
  
      try {
        setLoading(true);
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          alert('Authentication Error', 'Please log in again.');
          navigation.replace('TeacherLogin');
          return;
        }
  
        const testData = {
          test_ID: editingTestId,
          courseOfferingID,
          testTypeID,
          test_Name: testName,
          test_TotalMarks: totalMarks,
          test_Date: testDate.toISOString(),
          test_Description: testDescription,
          submissionAllowed,
          submissionStartDate: submissionStartDate.toISOString(),
          submissionEndDate: submissionEndDate.toISOString(),
          createdBy: '1',
          createdDate: new Date().toISOString(),
          updatedBy: '1',
          updatedDate: new Date().toISOString(),
        };
  
       
        //FK Temporary STATIC Questions Saving 1
        // Save test questions to centralDataMarksEntry
        centralDataMarksEntry.testQuestions[editingTestId] = testQuestions;
  
        // Save test data (assuming saveTest is an existing function)
        await saveTest(testData);
  
        // Optionally save questions to backend (implement as needed)
        // await saveTestQuestions(testQuestions, editingTestId, token);
  
        setPopupAlertType('success');
        setPopupAlertTitle('Success');
        setPopupAlertMessage('Test and questions saved successfully.');
        setPopupAlertButtons([{ text: 'OK', onPress: () => setShowAlertPopup(false) }]);
        setShowAlertPopup(true);
        setModalVisible(false);
        setTestQuestions([]); // Clear questions after saving
        loadTestsSeed(courseOfferingID);
      } catch (error) {
        console.error('Error saving test:', error);
        setPopupAlertType('error');
        setPopupAlertTitle('Error');
        setPopupAlertMessage('Failed to save test and questions.');
        setPopupAlertButtons([{ text: 'OK', onPress: () => setShowAlertPopup(false) }]);
        setShowAlertPopup(true);
      } finally {
        setLoading(false);
      }
    };
  

  
  // useEffect(() => {
  //   if (showQuestionsForm) {
  //     setTestQuestions([]);
  //     setQuestionCounter(1);
  //     setNewQuestionText('');
  //     setNewQuestionMarks('');
  //     setNewQuestionCLO('');
  //   }
  // }, [showQuestionsForm]);
  
  ////////////////////////
  
  const [showAlertPopupOverModal, setShowAlertPopupOverModal] = useState(false);
    const [popupAlertType_OverModal, setPopupAlertType_OverModal] = useState('success');
    const [popupAlertTitle_OverModal, setPopupAlertTitle_OverModal] = useState('');
    const [popupAlertMessage_OverModal, setPopupAlertMessage_OverModal] = useState('');
    const [popupAlertButtons_OverModal, setPopupAlertButtons_OverModal] = useState([{ text: 'CONTINUE', onPress: () => {} }]);
  
    ///////////////////////////////
    //////////////////////////////////

  const [studentMarks, setStudentMarks] = useState<{ [key: string]: { obtainedMarks: string; remarks: string , m_detail_id: number } }>({});
  // Add this with other state declarations (around line 130)
  const [showTestAndMarksTable, setTestAndMarksTable] = useState<boolean>(false);

  //Aleena added
  const [formMode, setFormMode] = useState<'add' | 'edit' | 'view'>('add'); // Tracks whether form is in add, edit, or view mode

 
  const [LoggedIn_UserName, setLoggedInUserName] = useState<string>('');


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

 const [, setVersion] = useState(0);

//// Aleena Logic Commented
//  const [facultyId, setFacultyId] = useState<number | undefined>(facultyID);
//  useEffect(() => {
//   console.log('MarksEntryScreen - Received facultyID:', facultyID);
// }, [facultyID]);

const [marksSeedLoaded, setMarksSeedLoaded] = useState(false);
const loadMarksSeed = async (courseofferID: number) => {
  setMarksSeedLoaded(false);
  try {
    // … your existing fetch + centralData assignments …
console.log("load Marks API called 1 ")
        setLoading(true);

      const token = await AsyncStorage.getItem('token');
      if (!token) {
        console.warn('No token found. Redirecting to login.');
        navigation.replace('TeacherLogin');
        return;
      }


       const response = await fetch(`${config.BASE_URL}/api/Marks/${courseofferID}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 401) {
        console.warn('Unauthorized. Redirecting to login.');
        setErrorMessage('Unauthorized: Please login again.');
        navigation.navigate('TeacherLogin');
       
        return;
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Marks API request failed: ${errorText || response.statusText}`);
      }

        const seed: MarksSeedDTO = await response.json();

        // overwrite your centralData exactly
        centralDataMarksEntry.selectedCourseOfferingID = seed.selectedCourseOfferingID;
        centralDataMarksEntry.courses                  = seed.courses;
        centralDataMarksEntry.studentsMap              = seed.studentsMap;
        centralDataMarksEntry.testTypes                = seed.testTypes;
        centralDataMarksEntry.tests                    = seed.tests;
        centralDataMarksEntry.topicMap                 = seed.topicMap;
        centralDataMarksEntry.marksEntryDetails        = seed.marksEntryDetails;

        centralDataMarksEntry.testTypes_Unique                = seed.testTypes_Unique;
        

       // centralDataMarksEntry.testQuestions[editingTestId] = testQuestions;

       centralDataMarksEntry.testQuestions = seed.testQuestions;
       centralDataMarksEntry.studentTestMarks = seed.studentTestMarks || {};

    setVersion(v => v + 1);

    // now mark data as ready
    setMarksSeedLoaded(true);
  } catch (err: any) {
    console.error('Error loading marks seed:', err);
    Alert.alert('Load Error', err.message || 'Could not load marks data.');
  } finally {
    setLoading(false);
  }
};

useEffect( () => {
  if (route.params?.courseOfferingID) {
    console.log('useEffect triggered for marks entry course', route.params?.courseOfferingID);
    loadMarksSeed(route.params?.courseOfferingID);

  }
}
//, [route.params,showSummary]);
, [route.params]);

 useEffect(() => {
  const getFullName = async () => {
    try {
      const userInfoString = await AsyncStorage.getItem('userInfo');
      if (userInfoString !== null) {
        const userInfo = JSON.parse(userInfoString);
        const fullName = userInfo.fullName;
        console.log('Full Name:', fullName);
        setLoggedInUserName(fullName + ' ('+userInfo.role+')');
       // return fullName;
      } else {
        console.log('No userInfo found in AsyncStorage');
        //return null;
      }
    } catch (error) {
      console.error('Error reading fullName from AsyncStorage', error);
     // return null;
    }
  };

  getFullName(); // Call the async function
}, []);


const [loading, setLoading] = useState(true);
 const [errorMessage, setErrorMessage] = useState<string | null>(null);


useEffect(() => {




  const loadCourses = async () => {
    console.log('loadCourses triggered for parameter '+ route.params.courseOfferingID );

    try {
      setLoading(true);

      const token = await AsyncStorage.getItem('token');
      if (!token) {
        console.warn('No token found. Redirecting to login.');
        navigation.replace('TeacherLogin');
        return;
      }

      let filteredCourses: Course[] = [];

     // const facultyQuery = -1;
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
        console.warn('Unauthorized. Redirecting to login.');
        setErrorMessage('Unauthorized: Please login again.');
        navigation.navigate('TeacherLogin');
        setCourses([]);
        return;
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API request failed: ${errorText || response.statusText}`);
      }

      const data = await response.json();

      if (!data?.assignedCourses?.courses) {
        setErrorMessage(data.message || 'No teaching history found.');
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

       // Auto-select course
       if (route.params?.courseOfferingID) {
         const course = courses.find((c) => c.courseOfferingID === route.params.courseOfferingID);
         if (course) {
           setSelectedCourse(course);
           //centralData.selectedCourseOfferingID = course.courseOfferingID;
         }
       }

      console.log("route course offer id "+ route.params.courseOfferingID)
      //// getTestSummary(route.params.courseOfferingID);
      
      console.log("route course offer id again "+ courseOfferingID)
      // if(route.params.courseOfferingID)
      // {
      //   loadMarksSeed(route.params.courseOfferingID);
      // }

    } catch (error) {
      console.error('Error loading courses:', error);
      setErrorMessage(`Error: ${error instanceof Error ? error.message : String(error)}`);
      setCourses([]);
    } finally {
      setLoading(false);



    }
  };
 loadCourses();
 

}, [facultyIdParam, isHODViewParam,route.params]); // <-- NOTE: empty dependency array = runs on first render only
 const handleEditStudentMarks = (test: Test, get_MarksEntryID: item.m_ID,get_TotalMarks:item.totalMarks) => {
    setEditingTestId(test.test_ID); //From My & Aleena
   setMarksEntryId(get_MarksEntryID) ;//My previous
    // settotalTestMarks(get_TotalMarks) ;//My previous

console.log("edit marks 1"+test);

//Below from aleena
 setEditingTest(test);
  setEditedTestName(test.test_Name); // Set editedTestName
  setEditedTestDate(new Date(test.test_Date));
  setEditedTotalMarks(test.test_TotalMarks);


console.log("FK another edit marks called 2"+test);

console.log("0 Final Last edit marks called m_ID "+test.m_ID);

  // const marksDetails = centralDataMarksEntry.marksEntryDetails[test.m_ID] || [];
const marksDetails = centralDataMarksEntry.marksEntryDetails?.[test.m_ID] || [];
   console.log("1 Final Last edit marks called marksDetails "+marksDetails);

    const initialMarks: { [key: string]: { obtainedMarks: string; remarks: string;} } = {};
    (centralDataMarksEntry.studentsMap[courseOfferingID] || []).forEach(student => {
     //// const mark = marksDetails? marksDetails.find(m => m.studentId === student.studentId):{obtainedMarks : '',remarks : ''};
  const mark = marksDetails.find(m => Number(m.studentId) === Number(student.studentId)) || { obtainedMarks: '', remarks: '' };

      console.log('Reading marks details one by one '+ mark);

      initialMarks[student.studentId] = {
        obtainedMarks: mark ? mark.obtainedMarks : '',
        remarks: mark ? mark.remarks : '',
        //m_detail_id : mark ? mark.m_Detail_ID : 0,
      };
    });
    
  console.log('New Initialized studentMarks:'+ initialMarks);
    setStudentMarks(initialMarks);
    // setEditMarksModalVisible(true); //My previous
    setTestAndMarksTable(true);
    setShowSummary(false);

     };

  const handleSaveStudentMarks = async (getTestDate,getTotalMarks) => {
  if (!editingTestId || !validateStudentMarks()) return;

  if (!marksEntryId) {
    console.log('marks entry ID missing');
    alert('Error', 'Missing Marks Entry ID');
    return;
  }

  const token = await AsyncStorage.getItem('token');
  if (!token) {
    alert('Authentication Error', 'Please log in again.');
    navigation.replace('TeacherLogin');
    return;
  }
  console.log("Marks Enty Test Date "+getTestDate);
  console.log("Marks Entry Test Marks "+getTotalMarks);
   
console.log("New Editing TEst "+editingTest);
 const totalMarks = getTotalMarks?.toString() || '0';

  const rawStudents = centralDataMarksEntry.studentsMap[courseOfferingID] || [];
  const now = new Date().toISOString();

  const marksDetails = rawStudents.map(student => {
    const marks = studentMarks[student.studentId] || { obtainedMarks: '0', remarks: '' };
    ////const detail = savedDetails.find(d => d.StudentId === student.studentId);
  //  const marks_detail = selectedMarksDetails.find(m => m.studentId === student.studentId && m.M_ID===marksEntryId);

    return {
      //M_Detail_ID:  marks.m_detail_id,//marks_detail ? marks_detail.M_Detail_ID : -1, //detail?.M_Detail_ID || '0',
      M_ID: marksEntryId,
      StudentId: student.studentId,
      TotalMarks: totalMarks || "0",
      ObtainedMarks: marks.obtainedMarks?.trim() || "0",
      Remarks: marks.remarks?.trim() || "",
      Created_By: "1",
      Created_Date: now,
      Updated_By: "1",
      Updated_Date: now,
      Test_ID: editingTestId,
      CourseOfferedID: courseOfferingID,
      HeldOn: getTestDate || now,//heldOnDate ? new Date(heldOnDate).toISOString() : now
    };
  });

   console.log('0 FK gets Get | marksDetails:'+ marksDetails);

 
  saveMarks(marksDetails);
 try {
 setPopupAlertType('success');
            setPopupAlertTitle('Updated');
            setPopupAlertMessage(`Marks Entry Details updated successfully.`);
            setPopupAlertButtons([
              { text: 'OK'
                , onPress: () => 
                  {
                    setShowAlertPopup(false);

                    //FK added to refresh page data
                    loadMarksSeed(route.params?.courseOfferingID);
                  } 
                },
            ]);
            setShowAlertPopup(true);



  } catch (err) {
    console.error('Save marks Failed to parse JSON:', err);
    console.error('Save marks failed:', err);
    alert('Error', 'Failed to save student marks');
  } finally {
    setLoading(false);
  }
};

  const validateStudentMarks = () => {
    const errors: string[] = [];
const totalMarks = parseFloat(editedTotalMarks || (centralDataMarksEntry.tests[courseOfferingID] || []).find(t => t.Test_ID === editingTestId)?.Test_TotalMarks || '0');
      const students = centralDataMarksEntry.studentsMap[courseOfferingID] || [];
    
      students.forEach(student => {
        const marks = studentMarks[student.studentId]?.obtainedMarks || '';
        if (!marks || marks.trim() === '') {
          errors.push(`Marks for student ${student.rollNo} (${student.name}) are not entered`);
        } else if (!/^\d+(\.\d+)?$/.test(marks) || isNaN(parseFloat(marks)) || parseFloat(marks) < 0) {
          errors.push(`Invalid marks for student ${student.rollNo} (${student.name}): ${marks}`);
        } else if (parseFloat(marks) > totalMarks) {
          errors.push(`Marks for student ${student.rollNo} (${student.name}) exceed total marks (${totalMarks})`);
        }
      });
 if (errors.length > 0) {
      alert('Validation Error', errors.join('\n'));
      return false;
    }
    return true;
  };
  const renderStudentMarksEditModal = () => {
    if (!editMarksModalVisible || !editingTestId) return null;

    const students = centralDataMarksEntry.studentsMap[courseOfferingID] || [];
    const test = (centralDataMarksEntry.tests[courseOfferingID] || []).find(t => t.test_ID === editingTestId);
    const totalMarks = test?.test_TotalMarks || 'N/A';

    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={editMarksModalVisible}
        onRequestClose={() => setEditMarksModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { width: isMobile ? '95%' : '70%' ,height: isMobile ? '85%' : '80%',overflow:'scroll' }]}>
            <Text style={[styles.heading, { fontSize: isMobile ? 16 : 18 }]}>
              Add/Edit Student Marks for {test?.test_Name || 'Test'}
            </Text>
            <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
              <View style={[styles.tableContainerLM, { width: '100%' }]}>
                <View style={[styles.tableRow, styles.tableHeader]}>
                  <Text style={[styles.tableCell, styles.tableHeaderText, { width: '20%' }]}>Roll No</Text>
                  <Text style={[styles.tableCell, styles.tableHeaderText, { width: '30%' }]}>Student Name</Text>
                  <Text style={[styles.tableCell, styles.tableHeaderText, { width: '20%' }]}>Obtained Marks</Text>
                  <Text style={[styles.tableCell, styles.tableHeaderText, { width: '30%' }]}>Remarks  </Text>
                </View>
                {students.length > 0 ? (
                  students.map((student, index) => (
                    

                    <View
                      key={student.studentId}
                      style={[styles.tableRow, index % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd]}
                    >
                      <Text style={[styles.tableCell, { width: '20%', fontSize: isMobile ? 12 : 16 }]}>
                        {student.rollNo}
                      </Text>
                      <Text style={[styles.tableCell, { width: '30%', fontSize: isMobile ? 12 : 16 }]}>
                        {student.name || 'N/A'} 
                        {/* ok {student.studentId} */}
                      </Text>
                      <TextInput
                        style={[styles.input, { width: '20%', fontSize: isMobile ? 12 : 16 }]}
                        value={studentMarks[student.studentId]?.obtainedMarks || ''}
                        onChangeText={(text) => {
  setStudentMarks(prev => ({
    ...prev,
    [student.studentId]: {
      ...(prev[student.studentId] || {}), // preserve existing remarks/marks
      obtainedMarks: text,
    },
  }));
}}
                        
                        placeholder="Enter marks"
                        keyboardType="numeric"
                        placeholderTextColor="#999"
                      />
                      <TextInput
                        style={[styles.input, { width: '30%', fontSize: isMobile ? 12 : 16 }]}
                        value={studentMarks[student.studentId]?.remarks || ''}
                       
                       onChangeText={(text) => {
  setStudentMarks(prev => ({
    ...prev,
    [student.studentId]: {
      ...(prev[student.studentId] || {}),
      remarks: text,
    },
  }));
}}
                        placeholder="Enter remarks"
                        placeholderTextColor="#999"
                      />
                    </View>
                  ))
                ) : (
                  <View style={styles.tableRow}>
                    <Text style={[styles.tableCell, { width: '100%', fontSize: isMobile ? 12 : 16 }]}>
                      No students available
                    </Text>
                  </View>
                )}
              </View>
            </ScrollView>
            
                          <View style={[styles.modalButtons, isMobile && { flexDirection: 'row', justifyContent: 'space-between' }]}>
                                        <TouchableOpacity
                                          style={[styles.actionButton, styles.closeButton, isMobile && { paddingHorizontal: 12, paddingVertical: 8 }]}
                                           onPress={() => setEditMarksModalVisible(false)}
                                        >
                                          <Text style={[styles.modalButtonText, { fontSize: isMobile ? 12 : 14 }]}>
                                            Cancel
                                          </Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                          style={[styles.actionButton, styles.saveButton, isMobile && { paddingHorizontal: 12, paddingVertical: 8 }]}
                                          // onPress={()=>{
                                          //   console.log("log test "+test)
                                          //    handleSaveStudentMarks
                                          // }}
                                          onPress={handleSaveStudentMarks}
                                        >
                                          <Text style={[styles.modalButtonText, { fontSize: isMobile ? 12 : 14 }]}>
                                            Send
                                          </Text>
                                        </TouchableOpacity>
                                      </View>
                        </View>
                      </View>
                    
                  </Modal>
    );
  };

 


  const handleEditTestDetails = (test: Test) => {
  setEditingTest(test);
  setFormMode('edit');

  setEditedTestName(test.Test_Name);
  setEditedTestDate(new Date(test.Test_Date));
  setEditedTotalMarks(test.Test_TotalMarks);
  setEditedTestDescription(test.Test_Description);
  setEditedIsVisible(test.Test_IsVisible);
  setEditedSubmissionAllowed(test.Test_SubmissionAllowed);
  setEditedSubmissionStartDate(
    test.Test_SubmissionStartDate ? new Date(test.Test_SubmissionStartDate) : new Date()
  );
  setEditedSubmissionEndDate(
    test.Test_SubmissionEndDate ? new Date(test.Test_SubmissionEndDate) : new Date()
  );

  // ✅ Load existing questions from centralDataMarksEntry
  // const existingQuestions = centralDataMarksEntry.testQuestions?.[test.Test_ID] || [];
  const existingQuestions =
  centralDataMarksEntry.testQuestions?.[test.Test_ID] ||
  centralDataMarksEntry.studentTestMarks?.[test.Test_ID] ||
  [];
setTestQuestions(existingQuestions);

  setTestQuestions(existingQuestions);
  setQuestionCounter(existingQuestions.length + 1);

  setShowQuestionsForm(true); // show the questions UI
  setEditTestModalVisible(true);
};

  const handleSaveTestDetails = () => {
    if (!editingTest || !validateTestEditForm()) return;

    const updatedTests = (centralDataMarksEntry.tests[courseOfferingID] || []).map(test =>
      test.Test_ID === editingTest.Test_ID
        ? {
            ...test,
            Test_Name: editedTestName,
            Test_Date: editedTestDate.toISOString().split('T')[0],
            Test_TotalMarks: editedTotalMarks,
            Test_Description: editedTestDescription,
            Test_IsVisible: editedIsVisible,
            Test_SubmissionAllowed: editedSubmissionAllowed,
            Test_Submission_StartDate: editedSubmissionAllowed ? editedSubmissionStartDate.toISOString().split('T')[0] : '',
            Test_Submission_EndDate: editedSubmissionAllowed ? editedSubmissionEndDate.toISOString().split('T')[0] : '',
            Updated_By: currentUser,
            Updated_Date: new Date().toISOString(),
          }
        : test
    );

    centralDataMarksEntry.tests[courseOfferingID] = updatedTests;
    setRefreshKey(prev => prev + 1);
    setEditTestModalVisible(false);
    alert('Success', 'Test details updated successfully');
  };

  const validateTestEditForm = () => {
    const errors: string[] = [];
    //if (!editedTestName) errors.push('Test Name is required.');
    if (!editedTestDate) errors.push('Test Date is not selected.');
    if (!editedTotalMarks) {
      errors.push('Total Marks is required.');
    } else if (!/^\d+(\.\d+)?$/.test(editedTotalMarks) || isNaN(parseFloat(editedTotalMarks)) || parseFloat(editedTotalMarks) <= 0) {
      errors.push('Invalid total marks entered');
    }
    if (editedSubmissionAllowed) {
      if (!editedSubmissionStartDate) errors.push('Submission Start Date is required.');
      if (!editedSubmissionEndDate) errors.push('Submission End Date is required.');
      if (editedSubmissionStartDate && editedSubmissionEndDate && editedSubmissionStartDate > editedSubmissionEndDate) {
        errors.push('Submission Start Date cannot be later than End Date.');
      }
    }

    if (errors.length > 0) {
      alert('Validation Error', errors.join('\n'));
      return false;
    }
    return true;
  };
const [isReadOnly, setIsReadOnly] = useState<boolean>(false);

  const navigateToRouteSafely = (route: keyof RootStackParamList, params?: any) => {
    try {
      const availableRoutes = navigation.getState()?.routeNames || [];
      if (availableRoutes.includes(route)) {
        navigation.navigate(route, params);
      } else {
        console.warn(`Route ${route} not found`);
        alert('Navigation Error', `Route ${route} is not available`);
      }
    } catch (error) {
      console.error(`Navigation error: ${(error as Error).message}`);
      alert('Navigation Error', 'An error occurred while navigating');
    }
  };

  const currentUser = 'FUI/TEACH-001/ISB';
const validateTestForm = () => {
  const errors: string[] = [];
  console.log("aleena");
   console.log(totalMarks);

  if (!courseOfferingID) errors.push('Course is not selected.');
  if (!testTypeID) errors.push('Test Type is not selected.');
  if (testTypeID==-1) errors.push('Test Type is not selected.');
  if (testTypeName === 'Exam' && !examName) {
    errors.push('Exam Name is required.');
  } else if (testTypeName === 'Exam' && examName) {
      const existingExam = (centralDataMarksEntry.tests[courseOfferingID] || []).find(
        (test) => test.testTypeName === 'Exam' && test.test_Name === examName
      );
      if (existingExam) {
        errors.push(`The exam "${examName}" has already been added for this course.`);
      }
    } else if (testTypeName !== 'Exam' && !testName) {
    errors.push('Test Name is required.');
  }
  if (!testDate) errors.push('Test Date is not selected.');
  if (!totalMarks) {
    errors.push('Total Marks is required.');
  } else if (!/^\d+(\.\d+)?$/.test(totalMarks) || isNaN(parseFloat(totalMarks)) || parseFloat(totalMarks) <= 0) {
    errors.push('Invalid total marks entered');
  }
  if (submissionAllowed) {
    if (!submissionStartDate) errors.push('Submission Start Date is required.');
    if (!submissionEndDate) errors.push('Submission End Date is required.');
    if (submissionStartDate && submissionEndDate && submissionStartDate > submissionEndDate) {
      errors.push('Submission Start Date cannot be later than End Date.');
    }
  }

  if (errors.length > 0) {
    alert('Validation Error', errors.join('\n'));
    return false;
  }
  return true;
};

  useEffect(() => {

    if (!marksSeedLoaded) return;          // ← wait for API
  if (!courseOfferingID) return;
  if(!centralDataMarksEntry.testTypes) return;

  console.log("Second use effect is called for " + courseOfferingID);
 const tests = centralDataMarksEntry.tests[courseOfferingID] || [];
    const testTypes = centralDataMarksEntry.testTypes || [];


    const sameTypeTests = tests.filter(t => t.testTypeID === testTypeID);


    console.log("0 load called ")
const selected_newTestID = testTypes.find(t => t.testTypeID === testTypeID)?.newTestID;
 

   // const newTestNo = selected_ItemText === 'Exam' ? 1 : selected_newTestID;//sameTypeTests.length + 1;
    console.log("2 load called "+(sameTypeTests.length + 1))

    const newTestNo =  selected_newTestID;
    setTestNo(newTestNo);

    const students = centralDataMarksEntry.studentsMap[courseOfferingID] || [];
    const initialMarks: { [studentId: string]: { marks: string; remarks: string } } = {};
    students.forEach(student => {
      initialMarks[student.studentId] = { marks: '', remarks: '' };
    });
    setStudentMarks(initialMarks);

    const topics = centralDataMarksEntry.topicMap?.[courseOfferingID] || [];
    if (topics.length > 0) {
      setSelectedTopicID(topics[0].CO_Topics_ID);
    } else {
      setSelectedTopicID('');
    }

    // Reset test name when test type changes
    if (testTypeID) {
      const testTypeName = centralDataMarksEntry.testTypes.find(t => t.testTypeID === testTypeID)?.testTypeName || '';
      
      //setTestName(testTypeName === 'Exam' ? 'Mid Exam' : `${testTypeName} ${newTestNo}`);
      setTestName(`${testTypeName} ${newTestNo}`);

    } else {
      setTestName('');
     
    }
  }, [courseOfferingID, testTypeID, marksSeedLoaded]);








  const validateStudentMarksInput = () => {
    const students = centralDataMarksEntry.studentsMap[courseOfferingID] || [];
    const errors: string[] = [];
    students.forEach(student => {
      const marksEntry = studentMarks[student.studentId];
      const marks = marksEntry?.marks || '';
      if (!marks) {
        errors.push(`Marks for student ${student.rollNo} (${student.name}) are not entered`);
      } else {
        const parsedMarks = parseFloat(marks);
        if (isNaN(parsedMarks) || parsedMarks < 0) {
          errors.push(`Invalid marks for student ${student.rollNo} (${student.name}): ${marks}`);
        } else if (parsedMarks > parseFloat(totalMarks)) {
          errors.push(`Marks for student ${student.rollNo} (${student.name}) exceed total marks (${totalMarks})`);
        }
      }
    });

    if (errors.length > 0) {
      alert('Validation Error', errors.join('\n'));
      return false;
    }
    return true;
  };
const course           = useMemo(
  () => centralDataMarksEntry.courses.find(c => c.CourseOfferedID === courseOfferingID) || null,
  [marksSeedLoaded, courseOfferingID]
);

const students         = useMemo(
  () => centralDataMarksEntry.studentsMap[courseOfferingID] || [],
  [marksSeedLoaded, courseOfferingID]
);

const tests            = useMemo(
  () => centralDataMarksEntry.tests?.[courseOfferingID] || [],
  [marksSeedLoaded, courseOfferingID]
);

const groupedTests     = useMemo(() => {
  return tests.reduce<Record<string, Test[]>>((acc, test) => {
    //const key = `${test.testTypeID}-${test.test_Name}-${test.test_Date}-${test.test_No}`;
    const key = `${test.test_ID}`; //`${test.testTypeID}-${test.test_Name}-${test.test_Date}-${test.test_No}`;

    (acc[key] = acc[key] || []).push(test);
    return acc;
  }, {});
}, [tests]);

const summaryData      = useMemo(() => {
  return Object.entries(groupedTests).map(([key, testGroup]) => {
    const firstTest     = testGroup[0];
     const testTypeName = centralDataMarksEntry.testTypes.find(t => t.testTypeID === firstTest.testTypeID)?.testTypeName ||
      firstTest.testTypeID;
    
    const marksDetails  = centralDataMarksEntry.marksEntryDetails[firstTest.m_ID] || [];

    // Use studentsMap to get the total number of students for the course
    const totalStudents = (centralDataMarksEntry.studentsMap[courseOfferingID] || []).length;
    //const totalStudents = marksDetails.length;  //Previous Logic

    const totalMarksSum = marksDetails.reduce( (sum, detail) => sum + parseFloat(detail.obtainedMarks || '0'), 0);
    
    //const totalMarksSum = marksDetails.reduce( (sum, detail) => sum + parseFloat(detail.obtainedMarks || '0'), 0 );

    const averageMarks  = totalStudents > 0 ? (totalMarksSum / totalStudents).toFixed(2) : '0.00';
    
    return { key, testType:    testTypeName, testName:    firstTest.test_Name, testDate:    firstTest.test_Date,
testNo:      firstTest.test_No, totalMarks:  firstTest.test_TotalMarks, 
totalStudents // Updated to use studentsMap length
, averageMarks,
//      totalMarks:  firstTest.Test_TotalMarks,
      test:        firstTest, m_ID: firstTest.m_ID, test_ID: firstTest.test_ID,
    };
  })
  // sort newest first
  .sort((a, b) => new Date(b.testDate).getTime() - new Date(a.testDate).getTime());
}, [groupedTests, courseOfferingID]);




const resetTestForm = () => {
  setFormMode('add');
  setTestTypeID(-1);
  setTestTypeName('Select Test Type');
  setTestName('');
  setExamName('');
  setTestNo(0);
  setTestDate(new Date());
  setTotalMarks('');
  setTestDescription('');
  setIsVisible(true);
  setSubmissionAllowed(true);
  setSubmissionStartDate(new Date());
  setSubmissionEndDate(new Date());
  setSelectedTopicID('');
  setShowQuestionsForm(false);
  setTestQuestions([]);
  setNewQuestionText('');
  setNewQuestionMarks('');
  setNewQuestionCLO('');
  setQuestionCounter(1);
  setEditingQuestion(null);
  const students = centralDataMarksEntry.studentsMap[courseOfferingID] || [];
  const initialMarks = {};
  students.forEach(student => {
    initialMarks[student.studentId] = { marks: '', remarks: '' };
  });
  setStudentMarks(initialMarks);
};

const handleChangeStudentMarks = (studentId: string, value: string) => {
    setStudentMarks(prev => ({
      ...prev,
      [studentId]: { ...prev[studentId], marks: value },
    }));
  };

  const handleChangeStudentRemarks = (studentId: string, value: string) => {
    setStudentMarks(prev => ({
      ...prev,
      [studentId]: { ...prev[studentId], remarks: value },
    }));
  };



// Save test
const saveTest = async (test: Test) => {
  try {
    setLoading(true);

    const token = await AsyncStorage.getItem('token');
    if (!token) {
      console.warn('No token found. Redirecting to login.');
      navigation.replace('TeacherLogin');
      return null;
    }

    const response = await fetch(`${config.BASE_URL}/api/Marks/savetest`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(test)
    });

    if (!response.ok) {
      throw new Error('Failed to save test');
    }

    const json = await response.json();

    if (json.success) {
      return json.data; //Return only the useful part
    } else {
      throw new Error(json.message || 'Save failed');
    }
  } catch (error) {
    console.error('Error saving test:', error);
    throw error;
  } finally {
    setLoading(false);
  }
};


// save question Marks    6:36 AM
const saveStudentQuestionMarks = async (marks) => {
  try {
    setLoading(true);
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      console.warn('No token found');
      return;
    }
    const response = await fetch(`${config.BASE_URL}/api/Marks/saveStudentQuestionMarks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(marks)
    });
    if (!response.ok) throw new Error('Failed to save question marks');
    const result = await response.json();
    console.log('Response from API:', result);
    return result;
  } catch (err) {
    console.error('Error saving question marks:', err);
    throw err;
  } finally {
    setLoading(false);
  }
};
const saveMarks = async (marks: MarksEntryDetail[]) => {
  try {
    setLoading(true);

      const token = await AsyncStorage.getItem('token');
      if (!token) {
        console.warn('No token found. Redirecting to login.');
        navigation.replace('TeacherLogin');
        return;
      }

    const response = await fetch(`${config.BASE_URL}/api/Marks/savemarks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(marks)
    });

    if (!response.ok) {
      throw new Error('FK Failed to save marks');
    }
    return await response.json();
  } catch (error) {
    console.error('FK Error saving marks:', error);
    throw error;
  }
  finally
  {
    setLoading(false);
  }
};
const handleSaveTestAndMarks = async () => {
  if (!validateTestForm()) return;

  const dateStr = testDate.toLocaleDateString('en-CA');//.toISOString().split('T')[0];
  const createdDate = new Date().toLocaleDateString('en-CA');//.toISOString();

  const newTest: Test = {
    Test_ID: "0", // Will be set by server
    TestTypeID: testTypeID,
    Test_No: testTypeName === 'Exam' ? -1 : testNo,
    Test_Name: testTypeName === 'Exam' ? examName : testName,
    CourseOfferedID: courseOfferingID,
    //CreatedBy: currentUser,
   CreatedDate: createdDate,
    Test_Description: testDescription,
    Test_Date: new Date(dateStr),
    Test_TotalMarks: totalMarks,
    Test_IsVisible: isVisible,
    Test_SubmissionAllowed: submissionAllowed,
    Test_Submission_StartDate: submissionAllowed ? new Date(submissionStartDate).toLocaleDateString('en-CA') : new Date().toLocaleDateString('en-CA'),
    Test_Submission_EndDate: submissionAllowed ? new Date(submissionEndDate).toLocaleDateString('en-CA') : new Date().toLocaleDateString('en-CA'),
    TestQuestions: testQuestions ,  // populated array
  };

  try {
    console.log("Creating Test "+newTest);
    // 1. Save test
    const savedTest = await saveTest(newTest);

    if (!savedTest) return;

    const test_ID = savedTest.test_ID;
    const m_ID = savedTest.m_ID;


        console.log("New Test Created "+test_ID);
        console.log("New Entry Created "+m_ID);






    // 2. Prepare marks
    const marksDetails: MarksEntryDetail[] = students.map(student => ({
      //M_Detail_ID: "0", // Will be set by server
 M_ID: m_ID,
  StudentId: student.studentId,
  TotalMarks: totalMarks || "0",  // must be string
  ObtainedMarks: studentMarks[student.studentId]?.marks || "0",
  Remarks: studentMarks[student.studentId]?.remarks || "",
  Created_By: "1",                            // must be string
  Created_Date: new Date(createdDate).toISOString(),
  Updated_By: "1",                            // must be string
  Updated_Date: new Date(createdDate).toISOString(),
  Test_ID: savedTest.Test_ID,
  CourseOfferedID: courseOfferingID,
  HeldOn: new Date(dateStr).toISOString()
    }));




    // 3. Save marks
    await saveMarks(marksDetails);
    console.log("Marks Detail Entry Created ");
    //Aleena method
     // 4. Save questions to centralDataMarksEntry
        const updatedQuestions = testQuestions.map(q => ({
          ...q,
          Test_ID: test_ID, // Use server-returned Test_ID
        }));
        centralDataMarksEntry.testQuestions[test_ID] = updatedQuestions;
    


    //Aleena ends

    // Update local state if needed
    if (!centralDataMarksEntry.tests[courseOfferingID]) {
      centralDataMarksEntry.tests[courseOfferingID] = [];
    }
    centralDataMarksEntry.tests[courseOfferingID].push(savedTest);

    setRefreshKey(prev => prev + 1);
    alert('Success', 'Test and marks saved successfully');
    
  } catch (error) {
    console.error('Error saving test and marks:', error);
   // alert('Error', 'Failed to save test and marks. Please try again.');
  }
  finally{
setShowStudentsList(false);
    setShowSummary(true);
    //FK added to refresh page data
  loadMarksSeed(route.params?.courseOfferingID);

  }

  

};




  const handleClearStudentMarks = () => {
    const newMarks: { [studentId: string]: { marks: string; remarks: string } } = {};
    students.forEach(student => {
      newMarks[student.studentId] = { marks: '', remarks: '' };
    });
    setStudentMarks(newMarks);
    alert('Cleared', 'All marks and remarks have been cleared');
  };

  const handleShowTestDetails = (test: Test) => {
    setSelectedTest(test);
    // getMarksEntryDetails(item.test.Test_ID); // Fills   centralData.marksEntryDetails[testID]
    //OR
    
    setModalVisible(true);
  };

  const handleEditSingleStudentMark = (detail: MarksEntryDetail) => {
    setEditingDetail(detail);
    setEditedMarks(detail.ObtainedMarks);
    setEditedRemarks(detail.Remarks);
    setEditModalVisible(true);
  };

  const handleSaveSingleStudentMark = () => {
    if (!editingDetail) return;

    const parsedMarks = parseFloat(editedMarks);
    if (isNaN(parsedMarks) || parsedMarks < 0 || parsedMarks > parseFloat(totalMarks)) {
      alert('Error', 'Invalid marks entered');
      return;
    }


    console.log("0 FK New New-1 ");

    const updatedDetails = (centralDataMarksEntry.marksEntryDetails[editingDetail.M_ID] || []).map(detail =>
      detail.m_Detail_ID === editingDetail.m_Detail_ID
        ? {
            ...detail,
            ObtainedMarks: editedMarks,
            Remarks: editedRemarks,
            Updated_By: currentUser,
            Updated_Date: new Date().toISOString(),
          }
        : detail
    );

    centralDataMarksEntry.marksEntryDetails[editingDetail.M_ID] = updatedDetails;
    setRefreshKey(prev => prev + 1);
    setEditModalVisible(false);
    alert('Success', 'Marks updated successfully');
  };

  const handleDeleteTest = (test: Test) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this test and its marks?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            centralDataMarksEntry.tests[courseOfferingID] = (centralDataMarksEntry.tests[courseOfferingID] || []).filter(
              t => t.Test_ID !== test.Test_ID
            );
            delete centralDataMarksEntry.marksEntryDetails[test.Test_ID];
            setRefreshKey(prev => prev + 1);
            setModalVisible(false);
            alert('Success', 'Test and marks deleted successfully');
          },
        },
      ]
    );
  };


  const initialParams = {
  facultyId,
  isHODView,
  isAdminView,
  activeTab: 'Course Content',
  courseOfferingID: null
};
  // const resetToTeacherPortal = () => {
  //   centralDataMarksEntry.selectedCourseOfferingID = null;
  //   navigateToRouteSafely('TeacherPortal', { reset: true });
  // };

  const resetToTeacherPortal = () => {
  centralDataMarksEntry.selectedCourseOfferingID = null;
  navigateToRouteSafely('TeacherPortal', { 
    reset: true,
    facultyId: initialParams.facultyId,
    isHODView: initialParams.isHODView,
    isAdminView:initialParams.isAdminView,
  });
};
 const [editingQuestion, setEditingQuestion] = useState(null);
  const questionsTableRef = useRef(null);

  useEffect(() => {
  if (showSummary || showTestAndMarksTable || showStudentsList) {
    setShowQuestionsForm(false);
    setTestQuestions([]);
    setQuestionCounter(1);
    setNewQuestionText('');
    setNewQuestionMarks('');
    setNewQuestionCLO('');
    setEditingQuestion(null);
  }
}, [showSummary, showTestAndMarksTable, showStudentsList]);


useEffect(() => {
  if (showQuestionsForm && questionsTableRef.current) {
    if (Platform.OS === 'web') {
      questionsTableRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      // For mobile, ensure the parent ScrollView has a ref
      scrollViewRef.current?.scrollTo({ y: questionsTableRef.current.offsetTop, animated: true });
    }
  }
}, [showQuestionsForm]);

const scrollViewRef = useRef(null);

const renderTestForm = () => {

  const validateQuestions = () => {
  const errors: string[] = [];
  const questionText = newQuestionText || '';
  if (!questionText.trim()) {
    errors.push(`Question text cannot be empty or contain only whitespace.`);
  }
  if (!newQuestionMarks) {
    errors.push(`Marks are required.`);
  } else {
    const parsedMarks = parseFloat(newQuestionMarks);
    if (isNaN(parsedMarks) || parsedMarks <= 0) {
      errors.push(`Invalid marks entered. Marks must be a positive number.`);
    }
  }
  if (!newQuestionCLO) {
    errors.push(`CLO is required.`);
  }

  ////////////////////////////////////////////////



//   const totalMarks_addedQuestions = testQuestions.reduce((sum_questions, question) => {
//   return sum_questions + parseFloat(question.Test_Question_Marks || "0");
// }, 0);

 const totalMarks_addedQuestions = testQuestions
  .filter(q => {
    // If editingQuestion is true, exclude matching question
    if (editingQuestion) {
      return q.test_Question_No.toString() !== editingQuestion.test_Question_No.toString();
    }
    return true; // keep all if not editing
  })
  .reduce((sum, question) => {
    return sum + parseFloat(question.test_Question_Marks || "0");
  }, 0);



   console.log("Already question total marks "+totalMarks_addedQuestions );
   console.log("New question total marks "+parseFloat(newQuestionMarks || 0) );


   if((parseFloat(newQuestionMarks || 0)+totalMarks_addedQuestions)>totalMarks)
   {
      errors.push(`Individual question marks or sum of question marks cannot be greater than total test marks.`);
   }



  ////////////////////////////////////////////////


  if (errors.length > 0) {
    setPopupAlertType('error');
    setPopupAlertTitle('Validation Error');
    setPopupAlertMessage(errors.join('\n'));
    setPopupAlertButtons([{ text: 'OK', onPress: () => setShowAlertPopup(false) }]);
    setShowAlertPopup(true);
    return { isValid: false };
  }
  return { isValid: true };
};
  // Aleena Logic
  // Helper function to format date or return fallback
  const formatDate = (date: Date | null | undefined): string => {
    if (date && !isNaN(date.getTime())) {
      return date.toISOString().split('T')[0];
    }
    return 'N/A';
  };
  // Aleena Logic
  // Helper function to get valid date or fallback
  const getValidDate = (date: Date | null | undefined): Date => {
    return date && !isNaN(date.getTime()) ? date : new Date();
  };
  // Custom radio button component
  const RadioButton = ({ selected, onPress, label }) => (
    <TouchableOpacity
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: isMobile ? 10 : 15,
      }}
      // onPress={onPress}   //Below Aleena Logic
      onPress={formMode === 'view' ? undefined : onPress}
      disabled={formMode === 'view'}
    >
      <View
        style={{
          height: isMobile ? 16 : 20,
          width: isMobile ? 16 : 20,
          borderRadius: isMobile ? 8 : 10,
          borderWidth: 2,
          borderColor: '#000',
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: 5,
        }}
      >
        {selected && (
          <View
            style={{
              height: isMobile ? 8 : 10,
              width: isMobile ? 8 : 10,
              borderRadius: isMobile ? 4 : 5,
              backgroundColor: '#000',
            }}
          />
        )}
      </View>
      <Text style={{ fontSize: isMobile ? 12 : 14 }}>{label}</Text>
    </TouchableOpacity>
  );

const availableExamNames = marksSeedLoaded
  ? testTypeName === 'Exam'
    ? examNames.filter(
     
        (name) =>
          !(centralDataMarksEntry.tests[courseOfferingID] || []).some(
            (test) => test.testTypeName === 'Exam' && test.test_Name === name
          )
      )
      : examNames
   
  : []; // Default empty array if marksSeedLoaded is false


const AddQuestion_isDisabled = (() => {
  const totalMarks_addedQuestions = testQuestions.reduce((sum, question) => {
    if (
      editingQuestion &&
      String(question?.test_Question_No || '') === String(editingQuestion?.test_Question_No || '')
    ) {
      return sum; // skip the one we are editing
    }
    return sum + parseFloat(question.test_Question_Marks || "0");
  }, 0);

  return parseFloat(totalMarks_addedQuestions || 0) === parseFloat(totalMarks || 0);
})();





  // Handler for starting question edit
  const handleEditQuestion = (question) => {
    setEditingQuestion(question);
    setNewQuestionText(question.question_Text);
    setNewQuestionMarks(question.test_Question_Marks);
    setNewQuestionCLO(question.test_Question_CLO_ID);
  };

  // Handler for saving edited question
  const handleSaveEditedQuestion = () => {
    if (!newQuestionText || !newQuestionMarks || !newQuestionCLO) {
      setPopupAlertType('error');
      setPopupAlertTitle('Validation Error');
      setPopupAlertMessage('Please fill all question fields.');
      setPopupAlertButtons([
        { text: 'OK', onPress: () => setShowAlertPopup(false) },
      ]);
      setShowAlertPopup(true);
      return;
    }
    const parsedMarks = parseFloat(newQuestionMarks);
    if (isNaN(parsedMarks) || parsedMarks <= 0) {
      setPopupAlertType('error');
      setPopupAlertTitle('Validation Error');
      setPopupAlertMessage('Invalid marks entered.');
      setPopupAlertButtons([
        { text: 'OK', onPress: () => setShowAlertPopup(false) },
      ]);
      setShowAlertPopup(true);
      return;
    }
    const updatedQuestions = testQuestions.map((q) =>
      q.test_Question_ID === editingQuestion.test_Question_ID
        ? {
            ...q,
            question_Text: newQuestionText,
            test_Question_Marks: newQuestionMarks,
            test_Question_CLO_ID: newQuestionCLO,
          }
        : q
    );
    setTestQuestions(updatedQuestions);
    setNewQuestionText('');
    setNewQuestionMarks('');
    setNewQuestionCLO('');
    setEditingQuestion(null);
    setPopupAlertType('success');
    setPopupAlertTitle('Updated');
    setPopupAlertMessage('Question updated successfully.');
    setPopupAlertButtons([
      {
        text: 'OK',
        onPress: () => {
          setShowAlertPopup(false);
          loadMarksSeed(route.params?.courseOfferingID);
        },
      },
    ]);
    setShowAlertPopup(true);
  };

  // Handler for deleting a question
  const handleDeleteQuestion = (questionId) => {
  const updatedQuestions = testQuestions
    .filter((q) => q.Test_Question_ID !== questionId)
    .map((q, index) => ({
      ...q,
      test_Question_No: index + 1, // Reassign sequential question numbers
    }));
  setTestQuestions(updatedQuestions);
  setQuestionCounter(updatedQuestions.length + 1); // Update questionCounter for next question
  setPopupAlertType('success');
  setPopupAlertTitle('Deleted');
  setPopupAlertMessage('Question deleted successfully.');
  setPopupAlertButtons([
    {
      text: 'OK',
      onPress: () => {
        setShowAlertPopup(false);
        loadMarksSeed(route.params?.courseOfferingID);
      },
    },
  ]);
  setShowAlertPopup(true);
};



  return (
     <View style={[styles.tableContainer_MES ]}>
          <View style={styles.lectureHeaderContainer}>
            
            <Text style={[styles.lectureHeaderText]}>
              {formMode === 'edit' ? 'Edit Test' : formMode === 'view' ? 'View Test' : 'Add New Test'}
            </Text>
          </View>
      <View style={styles.form}>
        <View style={styles.formRow}>
          <View style={styles.formControl}>
                      <Text style={[styles.labelStyle]}>Test Type:</Text>
           
            {marksSeedLoaded ? (
              formMode === 'add' ? (
  <View style={styles.pickerContainer}>
    <Picker
      selectedValue={testTypeID}
      onValueChange={(itemValue) => {

         const presameTypeTests = (centralDataMarksEntry.tests[courseOfferingID] || []).filter(
          (t) => t.testTypeID === itemValue
        );
console.log("Before Set Count "+(presameTypeTests.length+1));
       setTestTypeID(itemValue);

        const selected_ItemText = centralDataMarksEntry.testTypes_Unique.find(t => t.testTypeID === itemValue)?.testTypeName;
        console.log("After one Set Count "+(presameTypeTests.length+1));
        setTestTypeName(selected_ItemText || '');

const selected_newTestID = centralDataMarksEntry.testTypes_Unique.find(t => t.testTypeID === itemValue)?.newTestID;
        


        const sameTypeTests = (centralDataMarksEntry.tests[courseOfferingID] || []).filter(
          (t) => t.testTypeID === itemValue
        );

console.log("after Set Count "+(presameTypeTests.length+1));


        const newTestNo = selected_ItemText === 'Exam' ? -1 : selected_newTestID;////sameTypeTests.length + 1;
        setTestNo(newTestNo);
        setTestName(itemValue === 'Exam' ? '' : `${itemValue} ${newTestNo}`);
        setExamName('');

        if (selected_ItemText === 'Exam') {
          setSubmissionAllowed(null);
          setSubmissionStartDate(null);
          setSubmissionEndDate(null);
        } else {
          setSubmissionAllowed(true);
          setSubmissionStartDate(new Date());
          setSubmissionEndDate(new Date());
        }

        
        
       

      }}
      style={[styles.inputStyle]}
    >
      <Picker.Item label="Select Test Type" value="-1" Key="-1" />
      {centralDataMarksEntry.testTypes_Unique.map((testType) => (
        <Picker.Item
          key={testType.testTypeID}
          label={testType.testTypeName}
          value={testType.testTypeID}
        />
      ))}
    </Picker>
  </View>
  ) : (
                  <Text style={[styles.inputStyle]}>
                    {centralDataMarksEntry.testTypes_Unique.find(t => t.testTypeID === (editingTest?.testTypeID || testTypeID))?.testTypeName || 'N/A'}
                  </Text>
                )
              ) : (
  <Text style={styles.inputStyle}>Loading test types...</Text>
)}

          </View>
          <View style={styles.formControl}>
             <Text style={[styles.labelStyle]}>Test Name:</Text>
                        {testTypeName === 'Exam' ? (
                          marksSeedLoaded ? (
                            <View style={[styles.pickerContainer]}>
                              <Picker
                                selectedValue={examName}
                                onValueChange={setExamName}
                                style={styles.pickerContainer}
                              >
                  <Picker.Item label="Select Exam Name" value="" />
                  {/* {examNames.map((name) => (
                    <Picker.Item key={name} label={name} value={name} />
                  ))} */}
                  {availableExamNames.length === 0 ? (
                                      <Picker.Item label="No exam names available" value="" />
                                    ) : (
                                      availableExamNames.map((name) => (
                                        <Picker.Item key={name} label={name} value={name} />
                                      ))
                                    )}
                </Picker>
              </View>
              ) : (
    <TextInput
                      style={[styles.pickerContainer, {  borderWidth: 0 }]}
                      value="Loading exam names..."
                      placeholderTextColor="#999"
                      editable={false}
                    />
  )

            ) : (
               <TextInput
                              style={[styles.pickerContainer]}
                              value={testName}
                              placeholder="(Choose Test type to auto-generate name)"
                              placeholderTextColor="#999"
                              editable={false}
                            />
            )}
          </View>

          <View style={styles.formControl}>
                      <Text style={[styles.labelStyle ]}>Total Marks:</Text>
                      <TextInput
                        style={[styles.pickerContainer,]}
                        value={totalMarks}
                        onChangeText={setTotalMarks}
                        placeholder="Enter total marks"
                        keyboardType="numeric"
                        placeholderTextColor="#999"
                      />
                    </View>


    


        </View>


        <View style={styles.formRow}>
          
          <View style={styles.formControl}>
                      <Text style={[styles.labelStyle,]}>Description:</Text>
                      <TextInput
                        style={[styles.pickerContainer, ]}
                        value={testDescription}
                        onChangeText={setTestDescription}
                        placeholder="Enter description"
                        placeholderTextColor="#999"
                      />
                    </View>
        </View>

  <View style={styles.formRow}>

      <View style={styles.formControl}>
                  <Text style={[styles.labelStyle, ]}>Test Date:</Text>
                  <View style={[styles.pickerContainer]}>
                    {Platform.OS === 'web' ? (
                      <DatePicker
                        selected={testDate}
                        onChange={(date: Date) => date && !isNaN(date.getTime()) && setTestDate(date)}
                        dateFormat="yyyy-MM-dd"
                        className="date-picker"
                        wrapperClassName="date-picker-wrapper"
                        placeholderText="Select a date"
                        showPopperArrow={false}
                        customInput={
                          <TextInput
                            style={[styles.inputStyle, ]}
                            placeholderTextColor="#999"
                          />
                  }
                />
              ) : (
                <>
                  <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                                      <Text style={[styles.inputStyle, ]}>{testDate.toISOString().split('T')[0]}</Text>
                                    </TouchableOpacity>
                  {showDatePicker && (
                    <DateTimePicker
                      value={testDate}
                      mode="date"
                      display={Platform.OS === 'ios' ? 'calendar' : 'default'}
                      onChange={(event, selectedDate) => {
                        setShowDatePicker(Platform.OS === 'ios');
                        if (selectedDate && !isNaN(selectedDate.getTime())) setTestDate(selectedDate);
                      }}
                    />
                  )}
                </>
              )}
            </View>
          </View>

       {!testTypeName.toLowerCase().includes('exam') && submissionAllowed && (
  <>
    <View style={styles.formControl}>
      <Text style={[styles.labelStyle, ]}>Submission Start:</Text>
                      <View style={[styles.pickerContainer]}>
        {Platform.OS === 'web' ? (
          <DatePicker
            selected={getValidDate(formMode === 'edit' ? editedSubmissionStartDate : submissionStartDate)}
            onChange={(date: Date) => date && !isNaN(date.getTime()) && (formMode === 'edit' ? setEditedSubmissionStartDate(date) : setSubmissionStartDate(date))}
            dateFormat="yyyy-MM-dd"
            className="date-picker"
            wrapperClassName="date-picker-wrapper"
            placeholderText="Select start date"
            showPopperArrow={false}
           customInput={
                                   <TextInput
                                     style={[styles.inputStyle,]}
                                     placeholderTextColor="#999"
                                     value={formatDate(formMode === 'edit' ? editedSubmissionStartDate : submissionStartDate)}
                                     editable={false}
                                   />
            }
          />
        ) : (
          <>
            <TouchableOpacity onPress={() => formMode !== 'view' && setShowSubmissionStartPicker(true)}>
                                    <Text style={[styles.inputStyle, ]}>
                                      {formatDate(formMode === 'edit' ? editedSubmissionStartDate : submissionStartDate)}
                                    </Text>
                                  </TouchableOpacity>
            {showSubmissionStartPicker && (
              <DateTimePicker
                                          value={getValidDate(formMode === 'edit' ? editedSubmissionStartDate : submissionStartDate)}
                                          mode="date"
                                          display={Platform.OS === 'ios' ? 'calendar' : 'default'}
                                          onChange={(event, selectedDate) => {
                                            setShowSubmissionStartPicker(Platform.OS === 'ios');
                                            if (selectedDate && !isNaN(selectedDate.getTime())) {
                                              formMode === 'edit' ? setEditedSubmissionStartDate(selectedDate) : setSubmissionStartDate(selectedDate);
                                            }
                                          }}
                                        />
            )}
          </>
        )}
      </View>
    </View>

    <View style={styles.formControl}>
      <Text style={[styles.labelStyle]}>Submission End:</Text>
                      <View style={[styles.pickerContainer,]}>
        {Platform.OS === 'web' ? (
          <DatePicker
                                  selected={getValidDate(formMode === 'edit' ? editedSubmissionEndDate : submissionEndDate)}
                                  onChange={(date: Date) => date && !isNaN(date.getTime()) && (formMode === 'edit' ? setEditedSubmissionEndDate(date) : setSubmissionEndDate(date))}
                                  dateFormat="yyyy-MM-dd"
                                  className="date-picker"
                                  wrapperClassName="date-picker-wrapper"
                                  placeholderText="Select end date"
                                  showPopperArrow={false}
                                  customInput={
                                    <TextInput
                                                              style={[styles.inputStyle, ]}
                                                              placeholderTextColor="#999"
                                                              value={formatDate(formMode === 'edit' ? editedSubmissionEndDate : submissionEndDate)}
                                                              editable={false}
                                                            />
                                  }
                                />
                              ) : (
                                <>
                                  <TouchableOpacity onPress={() => formMode !== 'view' && setShowSubmissionEndPicker(true)}>
                                    <Text style={[styles.inputStyle]}>
                                                              {formatDate(formMode === 'edit' ? editedSubmissionEndDate : submissionEndDate)}
                                                            </Text>
                                  </TouchableOpacity>
                                  {showSubmissionEndPicker && (
                                    <DateTimePicker
                                      value={getValidDate(formMode === 'edit' ? editedSubmissionEndDate : submissionEndDate)}
                                      mode="date"
                                      display={Platform.OS === 'ios' ? 'calendar' : 'default'}
                                      onChange={(event, selectedDate) => {
                                        setShowSubmissionEndPicker(Platform.OS === 'ios');
                                        if (selectedDate && !isNaN(selectedDate.getTime())) {
                                          formMode === 'edit' ? setEditedSubmissionEndDate(selectedDate) : setSubmissionEndDate(selectedDate);
                                        }
                                      }}
                                    />
            )}  </>)}
      </View>
    </View>
  </>
)}
 </View>


        <View style={styles.formRow}>
          

          <TooltipWrapper tooltipText="Click to view marks summary">
          <TouchableOpacity
          accessible={true}
          accessibilityLabel="View marks summary"
          accessibilityRole="button"
          style={[
                          styles.actionButton1, styles.backButton, 
                          Platform.OS === 'web' && !isMobile && isAddButtonHovered && styles.hoverEffect,
                        ]}
          // onPress={() => setShowSummary(true)}
          onPress={() => {
                setShowSummary(true);
                setFormMode('add');
                setEditingTest(null);
                setTestDate(new Date());
                setEditedTestDate(null);
                setSubmissionStartDate(new Date());
                setEditedSubmissionStartDate(null);
                setSubmissionEndDate(new Date());
                setEditedSubmissionEndDate(null);

                //FK added to refresh page data
  loadMarksSeed(route.params?.courseOfferingID);

              }}
          {...(Platform.OS === 'web' && !isMobile
            ? {
                onMouseEnter: () => setIsAddButtonHovered(true),
                onMouseLeave: () => setIsAddButtonHovered(false),
              }
            : {})}
        >
          <Image source={images.arrowLeft} style={styles.icon} />
          {/* <Text style={styles.addLectureButtonText}>Back</Text> */}
          <Text style={styles.buttonText}>Back</Text>
        </TouchableOpacity>
</TooltipWrapper>



        <TouchableOpacity
  style={[styles.actionButton1, styles.backButton]}
  onPress={() => {
    if (!testName || !testTypeID || !totalMarks || !testDate) {
      setPopupAlertType('error');
      setPopupAlertTitle('Validation Error');
      setPopupAlertMessage('Please fill all test fields before adding questions.');
      setPopupAlertButtons([
        { text: 'OK', onPress: () => setShowAlertPopup(false) },
      ]);
      setShowAlertPopup(true);
      return;
    }
    setShowQuestionsForm(true); // Only set to true on button click
  }}
>
  <Image source={images.plusCircle} style={styles.icon} />
  <Text style={[styles.buttonText, { marginLeft: 6 }]}>
    {formMode === 'edit' ? 'Manage Questions' : 'Add Questions'} {/* NEW: Dynamic label */}
  </Text>
</TouchableOpacity>
{formMode !== 'view' && (
            <TooltipWrapper tooltipText={formMode === 'edit' ? "Save Test Changes" : "Create Test"}>
              <TouchableOpacity
                style={[styles.actionButton1, styles.backButton]}
                onPress={() => {
                  if (formMode === 'edit') {
                    if (validateTestEditForm()) {
                      handleSaveTestDetails();
                      setShowSummary(true);
                      setFormMode('add');
                      setEditingTest(null);

                      //FK added to refresh page data
  loadMarksSeed(route.params?.courseOfferingID);

                    }
                  } else if (validateTestForm()) {
                    const totalQuestionMarks = testQuestions.reduce(
                      (sum, q) => sum + parseFloat(q.test_Question_Marks),
                      0
                    );

                    const testTotalMarks = parseFloat(totalMarks);
                    if (testQuestions.length === 0 || totalQuestionMarks !== testTotalMarks) {
                      setPopupAlertType('error');
                      setPopupAlertTitle('Validation Error');
                      setPopupAlertMessage(
                        testQuestions.length === 0
                          ? 'Please add at least one question.'
                          : 'Total question marks must equal the test total marks.'
                      );
                      setPopupAlertButtons([
                        { text: 'OK', onPress: () => setShowAlertPopup(false) },
                      ]);
                      setShowAlertPopup(true);
                      return;
                    }
                    handleSaveTestAndMarks();
                    loadMarksSeed(route.params?.courseOfferingID);
                    setPopupAlertType('success');
                    setPopupAlertTitle('Updated');
                    setPopupAlertMessage('Marks Entry Details updated successfully.');
                    setPopupAlertButtons([
                      {
                        text: 'OK',
                        onPress: () => {
                          setShowAlertPopup(false);
                          loadMarksSeed(route.params?.courseOfferingID);
                        },
                      },
                    ]);
                    setShowAlertPopup(true);
                   // handleSaveTestAndMarks();
                   // loadMarksSeed(route.params?.courseOfferingID);
                    //// setShowSummary(true);
                  }
                }}
              >
                <Text style={[styles.buttonText, {marginRight: 6 }]}>
                                 {formMode === 'edit' ? 'Update' : 'Create'}
                               </Text>
                <Image
                  source={images.next}
                  style={styles.icon}
                  onError={() => console.warn('Failed to load next icon')}
                />
              </TouchableOpacity>
            </TooltipWrapper>
          )}
        </View>
{showQuestionsForm && (
          <View style={styles.formRow_Column} ref={questionsTableRef}>
            <View style={[styles.tableContainerLM]}>
              <View style={styles.lectureHeaderContainer}>
                <Text style={[styles.lectureHeaderText]}>
                  Add Test Questions
                </Text>
              </View>
              <View style={styles.form}>
                {/* <View style={styles.formRow_Column}>
                  <View style={styles.formControl, { width: isMobile ? "50%" : "20%"  } }>
                    <Text style={[styles.labelStyle]}>Question Number:</Text>
                    <Text
                      style={[styles.inputStyle, {  width: isMobile ? "40%" : "40%"  }]}
                      value={editingQuestion ? editingQuestion.Test_Question_No.toString() : questionCounter.toString()}
                      editable={false}
                      placeholderTextColor="#999"
                    />
                  </View> */}
                  <View style={styles.formRow_Column}>
    <View style={[styles.formControl, { width: isMobile ? "100%" : "10%"  }]}>
      <Text style={[styles.labelStyle]}>Question Number:</Text>
      <Text
        style={[styles.tableCell, {width: "10%"}]}
      >
        {editingQuestion ? editingQuestion.test_Question_No.toString() : questionCounter.toString()} .
         
        {/* {questionCounter.toString()} . Test */}

      </Text>
    </View>
                  <View style={styles.formControl, { width: isMobile ? "100%" : "50%"  } }>
                    <Text style={[styles.labelStyle]}>Question Text:</Text>
                    <TextInput
                      style={[styles.inputStyle, { width: isMobile ? "90%" : "90%"  }]}
                      value={newQuestionText}
                      onChangeText={setNewQuestionText}
                      placeholder="Enter question text"
                      placeholderTextColor="#999"
                    />
                  </View>
                  <View style={styles.formControl, { width: isMobile ? "50%" : "10%"  } }>
                    <Text style={[styles.labelStyle]}>Marks:</Text>
                    <TextInput
                      style={[styles.inputStyle, { width: isMobile ? "60%" : "60%"  }]}
                      value={newQuestionMarks}
                      onChangeText={setNewQuestionMarks}
                      keyboardType="numeric"
                      // placeholder="Enter marks"
                      placeholderTextColor="#999"
                    />
                  </View>
                  <View style={styles.formControl, { width: isMobile ? "80%" : "35%"  } }>
                    <Text style={[styles.labelStyle]}>CLO:</Text>
                    <Picker
                      selectedValue={newQuestionCLO}
                      onValueChange={setNewQuestionCLO}
                      style={[styles.inputStyle, {  width: isMobile ? "60%" : "40%"  }]}
                    >
                      <Picker.Item label="Select CLO" value="" />
                      {centralDataMarksEntry.questionsCLO.map(clo => (
                        <Picker.Item key={clo.CLO_ID} label={clo.CLO_Name} value={clo.CLO_ID} />
                      ))}
                    </Picker>
                  </View>
                </View>
                <View style={styles.formRow_Column}>
                  <TouchableOpacity

style={[styles.actionButton1, styles.backButton, { backgroundColor: AddQuestion_isDisabled ? '#ddd' : '#4caf50' }]}

// style={{
//       backgroundColor: isDisabled ? '#ddd' : '#3f51b5',
//       padding: 10,
//       borderRadius: 5
//     }}



              onPress={() => {
  if (editingQuestion) {
    const { isValid } = validateQuestions();
    if (!isValid) return;
    handleSaveEditedQuestion();
  } else {
    const { isValid } = validateQuestions();
    if (!isValid) return;
    const New_Temp_Question_ID = testQuestions.length+1;
const newQuestion: TestQuestions = {
      test_ID: '',
      test_Question_ID: New_Temp_Question_ID , //availableIDs[0],
      question_Text: newQuestionText,
      test_Question_No: questionCounter,
      test_Question_Marks: newQuestionMarks,
      test_Question_CLO_ID: newQuestionCLO,
    };
    setTestQuestions(prev => [...prev, newQuestion]);
    setNewQuestionText('');
    setNewQuestionMarks('');
    setNewQuestionCLO('');
    setQuestionCounter(prev => prev + 1);
    setPopupAlertType('success');
    setPopupAlertTitle('Updated');
    setPopupAlertMessage('Question added successfully.');
    setPopupAlertButtons([
      {
        text: 'OK',
        onPress: () => {
          setShowAlertPopup(false);
          loadMarksSeed(route.params?.courseOfferingID);
        },
      },
    ]);
    setShowAlertPopup(true);
  }
}}



     disabled={AddQuestion_isDisabled}
                  
                  >
                     <Image source={images.plusCircle} style={styles.icon} />
                   <Text style={[styles.buttonText, { marginLeft: 6}]}>
                      {editingQuestion ? 'Update Question' : 'Add to grid'}
                    </Text>
                  </TouchableOpacity>
                  {editingQuestion && (
                    <TouchableOpacity
                      style={[styles.actionButton1, styles.closeButton]}
                      onPress={() => {
                        setEditingQuestion(null);
                        setNewQuestionText('');
                        setNewQuestionMarks('');
                        setNewQuestionCLO('');
                      }}
                    >
                      <Text style={[styles.buttonText,]}>Cancel Edit</Text>
                    </TouchableOpacity>
                  )}

                </View>
                {testQuestions.length > 0 && (
                       <ScrollView
                    horizontal={isMobile}
                    style={{ width: '100%' }}
                    contentContainerStyle={styles.contentContainerStyle}
                    showsHorizontalScrollIndicator={isMobile}
                    nestedScrollEnabled={isMobile}
                    bounces={isMobile}
                    scrollEnabled={isMobile} 
                  >
                  <View style={styles.tableWrapper} >
                    <View style={[styles.tableRow, styles.tableHeader]}>
                      <Text style={[styles.tableCell, styles.tableHeaderText,styles.serialColumn]}>Q#</Text>
                      <Text style={[styles.tableCell, styles.tableHeaderText, styles.descriptionColumn]}>Question Text</Text>
                      <Text style={[styles.tableCell, styles.tableHeaderText, styles.columnEqualWidth]}>Marks</Text>
                      <Text style={[styles.tableCell, styles.tableHeaderText, styles.columnEqualWidth]}>CLO</Text>
                      <Text style={[styles.tableCell, styles.tableHeaderText, styles.columnEqualWidth]}>Actions</Text>
                    </View>
                    {testQuestions.map((q, index) => (
                      <View
                        key={q.Test_Question_ID}
                        style={[styles.tableRow, index % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd]}
                      >
                        <Text style={[styles.tableCell, styles.serialColumn]}>{q.test_Question_No}</Text>
                        <Text style={[styles.tableCell, styles.descriptionColumn]}>{q.question_Text}</Text>
                        <Text style={[styles.tableCell, styles.columnEqualWidth]}>{q.test_Question_Marks}</Text>
                        <Text style={[styles.tableCell, styles.columnEqualWidth]}>
                          {centralDataMarksEntry.questionsCLO.find(clo => clo.CLO_ID === q.test_Question_CLO_ID)?.CLO_Name || 'N/A'}
                        </Text>
                        <View style={[styles.tableCell,styles.columnEqualWidth]}>


                          


                           <TouchableOpacity accessible={true} accessibilityRole="button" style={[styles.actionButtonLM, styles.editButtonLM, {padding:5}]} 
                          onPress={() => handleEditQuestion(q)}>
                              <Image source={images.pencil} style={[styles.pencilIconLM]} onError={() => console.warn('Failed to load pencil icon')}/>
                            </TouchableOpacity>


                        


                           <TouchableOpacity accessible={true} accessibilityRole="button" style={[styles.actionButtonLM, styles.deleteButtonLM, {padding:5}]} 
                            onPress={() => { 
                          
                          
                                setPopupAlertType('confirmation');
                                setPopupAlertTitle('Confirm Delete !!'); // Set custom title
                                setPopupAlertMessage("Are you sure you want to delete the question??");
                                setPopupAlertButtons([
                                  { text: 'No', onPress: () => setShowAlertPopup(false) },
                                  { text: 'Yes', onPress: () => {
                                    handleDeleteQuestion(q.Test_Question_ID)
                                    ;
                                    // setEmail('');
                                    // setPassword('');
                                  }},
                                ]);
                                //console.log('Error Popup State:', { popupType, popupTitle, popupMessage, popupButtons });
                                setShowAlertPopup(true);
                           }
                             }>
                              <Image source={images.deleteIcon} style={[styles.pencilIconLM]} onError={() => console.warn('Failed to load delete icon')}/>
                            </TouchableOpacity>
                        </View>
                      </View>
                    ))}
                  </View>
                  </ScrollView>
                )}
              </View>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

  const renderSelectedValuesRow = () => (
    <View style={[styles.tableContainer2]}>
      <View style={[styles.formRow]}>
        <TouchableOpacity
          style={[styles.actionButtonback, styles.backButton, ]}
          onPress={() => setShowStudentsList(false)}
        >
          <Image
            source={images.arrowLeft}
            style={styles.icon}
            onError={() => console.warn('Failed to load back icon')}
          />
          <Text style={[styles.buttonText, { marginLeft: 6 }]}>Back</Text>
        </TouchableOpacity>
        <View style={[styles.formField_MES]}>
          <Text style={[styles.label,]}>Course: {course ? `${course.courseNo} - ${course.courseName}` : 'Course not found'}</Text>
        </View>
        <View style={[styles.formField_MES]}>
          <Text style={[styles.label, ]}>Type: {centralDataMarksEntry.testTypes.find(t => t.testTypeID === testTypeID)?.testTypeName || testTypeID}</Text>
        </View>
        <View style={[styles.formField_MES]}>
          <Text style={[styles.label,]}>Test Number: {testNo}</Text>
        </View>
        <View style={[styles.formField_MES]}>
          <Text style={[styles.label,]}>Test Name: {testName || 'No Name'}</Text>
        </View>
      </View>
    </View>
  );



    const [selectedTestType, setSelectedTestType] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');


const renderTestSummaryTable = ({ isMobile, summaryData, setShowSummary, images, handleEditStudentMarks, handleEditTestDetails, setSelectedTest, setMarksModalVisible, setModalVisible, styles }) => {


  


  // Get unique test types for picker
  const testTypes = ['All', ...new Set(summaryData.map(item => item.testType))];

  // Filter data based on test type and search query
  const filteredData = summaryData.filter(item => 
    (selectedTestType === 'All' || item.testType === selectedTestType) &&
    (searchQuery === '' || item.testName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <View style={[styles.tableContainer_MES]}>
      <View style={styles.HeaderContainer}>
        <Text style={[styles.HeaderText]}>
          Test Summary
        </Text>

        <TooltipWrapper tooltipText="Click to Add New Test">
        <TouchableOpacity
          accessible={true}
          accessibilityLabel="Add new test"
          accessibilityRole="button"
          style={[styles.addLectureButton, Platform.OS === 'web' && !isMobile && isAddButtonHovered && styles.hoverEffect]}
          onPress={
            () => 
            { 

              resetTestForm();

              setShowSummary(false);
              setTestAndMarksTable(false);
              setShowStudentsList(false);

            }

          }
          {...(Platform.OS === 'web' && !isMobile ? { onMouseEnter: () => setIsAddButtonHovered(true), onMouseLeave: () => setIsAddButtonHovered(false) } : {})}
        >
          <Image source={images.plusCircle} style={styles.addLectureIcon} />
          <Text style={styles.addLectureButtonText}>Add New Test</Text>
        </TouchableOpacity>
        </TooltipWrapper>
       

        <View style={styles.placeholderView} />
      </View>

     
      {/* Filter Controls */}
      <View style={{ flexDirection: isMobile ? 'column' : 'row', marginBottom: 10, gap: isMobile ? 10 : 20 }}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.HeaderText, { marginBottom: 5 }]}>
            Filter by Test Type
          </Text>
          <Picker
            selectedValue={selectedTestType}
            onValueChange={(itemValue) => setSelectedTestType(itemValue)}
            style={[styles.picker,]}
          >
            {testTypes.map((type) => (
              <Picker.Item key={type} label={type} value={type} />
            ))}
          </Picker>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.HeaderText, { marginBottom: 5 }]}>
            Search Test Type Name
          </Text>
          <TextInput
            style={[styles.searchInput_MarksEntry]}
            placeholder="Search test name..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            
          />
          
        </View>
      </View>

      <View style={styles.tableWrapper}>
        <View style={[styles.tableRow, styles.tableHeader]}>
          <Text style={[styles.tableCell, styles.tableHeaderText, styles.serialColumn]}>S#</Text>
          <Text style={[styles.tableCell, styles.tableHeaderText, { width: '15%' }]}>Test Date</Text>
          <Text style={[styles.tableCell, styles.tableHeaderText, { width: '15%' }]}>Test Type</Text>
          <Text style={[styles.tableCell, styles.tableHeaderText, { width: '25%' }]}>Test Name</Text>
          <Text style={[styles.tableCell, styles.tableHeaderText, { width: '10%' }]}>Total Students</Text>
          <Text style={[styles.tableCell, styles.tableHeaderText, { width: '10%' }]}>Average Marks</Text>
          <Text style={[styles.tableCell, styles.tableHeaderText, { width: '15%' }]}>Test Marks</Text>
           <Text style={[styles.tableCell, styles.tableHeaderText, { width: '10%' }]}>Test Details</Text>
          {/* <Text style={[styles.tableCell, styles.tableHeaderText, { width: '10%' }]}>Test Details</Text> */}
        </View>
        {filteredData.length > 0 ? (
          filteredData.map((item, index) => (
            <View
              key={item.key}
              style={[styles.tableRow, index % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd]}
            >
              <Text style={[styles.tableCell, { width: '10%', fontSize: isMobile ? 12 : 16 }]}>
                {index + 1}
              </Text>
              <Text style={[styles.tableCell, { width: '15%', fontSize: isMobile ? 12 : 16 }]}>
                 {/* {new Intl.DateTimeFormat('en-GB', {day: '2-digit',month: 'short',year: 'numeric'}).format(new Date(item.testDate))} */}
                 {
                   item.testDate && !isNaN(new Date(item.testDate)) ? 
                       new Date(item.testDate).toLocaleDateString('en-GB', {
                         day: '2-digit',
                         month: 'short',
                         year: 'numeric',
                       }) 
                       : 'Invalid Date'
                   }
              </Text>
              <Text style={[styles.tableCell, { width: '15%', fontSize: isMobile ? 12 : 16 }]}>
                {item.testType}
              </Text>
              <Text style={[styles.tableCell, { width: '25%', fontSize: isMobile ? 12 : 16 }]}>
                {item.testName}
              </Text>
              <Text style={[styles.tableCell, { width: '10%', fontSize: isMobile ? 12 : 16 }]}>
                {item.totalStudents}
              </Text>
              <Text style={[styles.tableCell, { width: '10%', fontSize: isMobile ? 12 : 16 }]}>
                {item.averageMarks}
              </Text>
              <View style={[styles.tableCell, { width: '15%', flexDirection: 'row',justifyContent:'center'}]}>
                {/* , justifyContent: 'space-between'  */}


                <TooltipWrapper tooltipText="Click to manage test marks">
                <TouchableOpacity
                  //style={[styles.actionButton1, styles.editButton, { marginRight: 2 }]}
                  style={[styles.actionButton1, { marginRight: 0 }]}
                  onPress={() => handleEditStudentMarks(item.test , item.m_ID,item.totalMarks)}
                >

                  <Image
                    source={images.manage}
                    style={[styles.pencilIconLM, { width: isMobile ? 12 : 14, height: isMobile ? 12 : 14 }]}
                    //style={[{ width: isMobile ? 12 : 14, height: isMobile ? 12 : 14 }]}
                    onError={() => console.warn('Failed to load pencil icon')}
                  />
                </TouchableOpacity>

                </TooltipWrapper>
 </View>


  <View style={[styles.tableCell, { width: '10%', flexDirection: 'row',justifyContent:'center'}]}>
                {/* , justifyContent: 'space-between'  */}


                <TooltipWrapper tooltipText="Click to manage test details">
                {/* <TouchableOpacity


*/}


<TouchableOpacity
  style={[styles.actionButton1, { marginRight: 0 }]}
  onPress={() => {
    setFormMode('edit'); // Set form to edit mode
    setEditingTest(item.test); // Set the test being edited
    setTestTypeID(item.test.testTypeID); // Set test type ID
    setTestTypeName(centralDataMarksEntry.testTypes.find(t => t.testTypeID === item.test.testTypeID)?.testTypeName || ''); // Set test type name
    setTestName(item.test.test_Name); // Set test name
    setExamName(item.test.testTypeName === 'Exam' ? item.test.test_Name : ''); // Set exam name if applicable
    setTestNo(item.test.test_No); // Set test number
    setTestDate(new Date(item.test.test_Date)); // Set test date
    setTotalMarks(item.test.test_TotalMarks); // Set total marks
    setTestDescription(item.test.test_Description); // Set test description
    setIsVisible(item.test.test_IsVisible); // Set visibility
    setSubmissionAllowed(item.test.test_SubmissionAllowed); // Set submission allowed
    setSubmissionStartDate(item.test.test_Submission_StartDate ? new Date(item.test.test_Submission_StartDate) : new Date()); // Set submission start date
    setSubmissionEndDate(item.test.test_Submission_EndDate ? new Date(item.test.test_Submission_EndDate) : new Date()); // Set submission end date
    
    // Load test questions using the correct test ID
    const questions = centralDataMarksEntry.testQuestions[item.test.test_ID] || [];


    console.log("1 test questions");

    console.log(questions);
    setTestQuestions(questions); // Set test questions
    setQuestionCounter(questions.length > 0 ? Math.max(...questions.map(q => parseInt(q.test_Question_No, 10))) + 1 : 1); // Set question counter based on max question number
    
    setShowSummary(false); // Hide summary table
    setTestAndMarksTable(false); // Ensure marks table is hidden
    setShowStudentsList(false); // Ensure students list is hidden
    setEditingTestId(item.test.test_ID); // Set editing test ID to ensure questions are associated correctly
    
    // NEW: Immediately show the questions section if editing
    setShowQuestionsForm(true);
  }}
>

   <Image
    source={images.pencil}
    style={[styles.pencilIconLM, { width: isMobile ? 12 : 14, height: isMobile ? 12 : 14 }]}
    onError={() => console.warn('Failed to load manage icon')}
  />
  {/* ... rest unchanged */}
</TouchableOpacity>


                </TooltipWrapper>
 </View>

            </View>
          ))
        ) : (
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, { width: '100%' }]}>
              No tests available
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};


  


const [questionMarksModalVisible, setQuestionMarksModalVisible] = useState<boolean>(false);
const [selectedStudent, setSelectedStudent] = useState<{ studentId: string; name: string; rollNo: string } | null>(null);
const [questionMarks, setQuestionMarks] = useState<{ [questionId: string]: string }>({});

 useEffect(() => {
  if (showQuestionsForm && formMode === 'add') {
    setTestQuestions([]);
    setQuestionCounter(1);
    setNewQuestionText('');
    setNewQuestionMarks('');
    setNewQuestionCLO('');
  }
}, [showQuestionsForm, formMode]);


const renderTestAndMarksTable = () => {
  const relatedDetails = selectedTest?.m_ID && centralDataMarksEntry?.marksEntryDetails?.[selectedTest.m_ID]
    ? centralDataMarksEntry.marksEntryDetails[selectedTest.m_ID]
    : [];
  const students = (centralDataMarksEntry.studentsMap[courseOfferingID] || []).filter(
    student => student.studentId && typeof student.studentId === 'string' && student.studentId.trim() !== ''
  );
  const test = (centralDataMarksEntry.tests[courseOfferingID] || []).find(t => t.test_ID === editingTestId);
  const testTypeName = centralDataMarksEntry.testTypes.find(t => t.testTypeID === test?.testTypeID)?.testTypeName || test?.testTypeID || 'N/A';
  const totalMarks = test?.test_TotalMarks || '0';

  // Calculate total obtained marks for each student based on question marks
  const getStudentTotalObtainedMarks = (studentId: number) => {


const questionMarks = centralDataMarksEntry.studentTestMarks[editingTestId!] || [];

console.log(questionMarks);

// Note: your studentId is number now, so compare as number
const totalObtained = questionMarks
    .filter(q => Number(q.studentId) === Number(studentId))
    .reduce((sum, q) => sum + (parseFloat(q.test_Question_ObtainedMarks) || 0), 0);

console.log(`Total obtained marks for student ${studentId} in test ${editingTestId!}:`, totalObtained);
console.log("FK student Total Obtained marks "+totalObtained);

    return totalObtained.toFixed(2); // Return as string with 2 decimal places




  };

  return (
    <View style={[styles.tableContainerLM, { width: isMobile ? '95%' : '80%', alignSelf: 'center', zIndex: 1 }]}>
      <View style={[styles.lectureHeaderContainer]}>
        <TouchableOpacity
          accessible={true}
          accessibilityLabel="Back to test summary"
          accessibilityRole="button"
          onPress={() => {
            setTestAndMarksTable(false);
            setShowSummary(true);
            setIsReadOnly(false);
            loadMarksSeed(route.params?.courseOfferingID);
          }}
          style={[styles.actionButtonback, styles.backButton]}
        >
          <Image source={images.arrowLeft} style={[styles.addLectureIcon]} />
          <Text style={[styles.addLectureButtonText]}>Back</Text>
        </TouchableOpacity>
        <Text style={[styles.lectureHeaderText]}>
          {isReadOnly ? 'View Test and Student Marks' : 'Edit Test and Student Marks'}
        </Text>
      </View>
      <View style={[styles.formContainer]}>
        <View style={[styles.formRow]}>
          <View style={[styles.testinfoContainer]}>
            <View style={{ flex: isMobile ? 1 : 0.25, marginBottom: isMobile ? 8 : 0 }}>
              <Text style={[styles.formLabel]}>Test Type:</Text>
              <Text style={[styles.formLabel]}>{testTypeName || 'N/A'}</Text>
            </View>
            <View style={{ flex: isMobile ? 1 : 0.25, marginBottom: isMobile ? 8 : 0 }}>
              <Text style={[styles.formLabel]}>Test Name:</Text>
              <Text style={[styles.formLabel]}>{test?.test_Name || 'N/A'}</Text>
            </View>
            <View style={{ flex: isMobile ? 1 : 0.25, marginBottom: isMobile ? 8 : 0 }}>
              <Text style={[styles.formLabel]}>Test Date:</Text>
              <Text style={[styles.formLabel]}>
                {editedTestDate && !isNaN(new Date(editedTestDate))
                  ? new Date(editedTestDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
                  : 'Invalid Date'}
              </Text>
            </View>
            <View style={{ flex: isMobile ? 1 : 0.25, marginBottom: isMobile ? 8 : 0 }}>
              <Text style={[styles.formLabel]}>Total Marks:</Text>
              <Text style={[styles.formLabel]}>{editedTotalMarks || test?.test_TotalMarks || '0'}</Text>
            </View>
          </View>
        </View>
        
      </View>
      <ScrollView
        horizontal={isMobile}
        style={{ width: '100%' }}
        contentContainerStyle={{ minWidth: isMobile ? 600 : '100%' }}
        showsHorizontalScrollIndicator={isMobile}
        nestedScrollEnabled={true}
        bounces={false}
      >
        <View style={[styles.tableWrapperLM]}>
          <View style={[styles.tableRowLM, styles.tableHeaderLM, { width: isMobile ? 600 : '100%' }]}>
            <Text style={[styles.tableCellAtt, styles.tableHeaderTextLM, { flex: isMobile ? 0.5 : 0.5, fontSize: isMobile ? 10 : 16 }]}>Roll No</Text>
            <Text style={[styles.tableCellAtt, styles.tableHeaderTextLM, { flex: isMobile ? 1.2 : 1, fontSize: isMobile ? 10 : 16 }]}>Student Name</Text>
            <Text style={[styles.tableCellAtt, styles.tableHeaderTextLM, { flex: isMobile ? 0.5 : 0.8, fontSize: isMobile ? 10 : 16 }]}>Obtained Marks</Text>
            <Text style={[styles.tableCellAtt, styles.tableHeaderTextLM, { flex: isMobile ? 0.5 : 0.5, fontSize: isMobile ? 10 : 16 }]}>Action</Text>
          </View>
          <View style={[styles.tableWrapperLM, { width: isMobile ? 600 : '100%' }]}>
            {students.length > 0 ? (
              students.map((student, index) => (
                <View
                  key={student.studentId || `student-${index}`}
                  style={[styles.tableRowLM, index % 2 === 0 ? styles.tableRowEvenLM : styles.tableRowOddLM]}
                >
                  <Text style={[styles.tableCellAtt, { flex: isMobile ? 0.5 : 0.5, fontSize: isMobile ? 10 : 16 }]}>{student.rollNo}</Text>
                  <Text style={[styles.tableCellAtt, { flex: isMobile ? 1.2 : 1, fontSize: isMobile ? 10 : 16 }]}>{student.name || 'N/A'}</Text>
                  <Text style={[styles.tableCellAtt, { flex: isMobile ? 0.5 : 0.8, fontSize: isMobile ? 10 : 16, textAlign: 'center' }]}>
                    {getStudentTotalObtainedMarks(student.studentId)}
                  </Text>
                  <View style={[styles.tableCellAtt, { flex: isMobile ? 0.5 : 0.5, justifyContent: 'center', alignItems: 'center' }]}>
                    <TouchableOpacity
                      style={[styles.actionButton1, styles.editButton, { padding: isMobile ? 4 : 6, alignSelf: 'center' }]}
                      onPress={() => {
                        setSelectedStudent({
                          studentId: student.studentId,
                          name: student.name || 'N/A',
                          rollNo: student.rollNo || 'N/A',
                        });

                        const questions = centralDataMarksEntry.testQuestions[editingTestId!] || [];
                        const initialQuestionMarks: { [questionId: string]: string } = {};
                        questions.forEach(q => {
                          const mark = (centralDataMarksEntry.studentTestMarks[editingTestId!] || []).find(
                            m => Number(m.test_Question_ID) === Number(q.test_Question_ID) && Number(m.studentId) === Number(student.studentId)
                         
                  
                          );
                          //initialQuestionMarks[q.test_Question_ID] = mark ? mark.test_Question_ObtainedMarks : '';

console.log(` POPup FK  Total obtained marks is ${mark?.test_Question_ObtainedMarks} in question ${q.test_Question_ID!}:`);

                            initialQuestionMarks[q.test_Question_ID.toString()] = mark?.test_Question_ObtainedMarks?.toString() || '0';
                        });
                        setQuestionMarks(initialQuestionMarks);
                        setQuestionMarksModalVisible(true);
                      }}
                    >
                      <Image
                        source={images.pencil}
                        style={[styles.pencilIconLM, { width: isMobile ? 12 : 14, height: isMobile ? 12 : 14 }]}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            ) : (
              <View style={styles.tableRowLM}>
                <Text style={[styles.tableCellAtt, { width: '100%', fontSize: isMobile ? 14 : 16 }]}>No students available</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};



  // Move useEffect to top level of the component
  useEffect(() => {
    if (!questionMarksModalVisible || !selectedStudent || !editingTestId) {
      setQuestionMarks({}); // Reset questionMarks when modal is closed or no student/test selected
      return;
    }

    const test = (centralDataMarksEntry.tests[courseOfferingID] || []).find(t => t.test_ID === editingTestId);
    const questions = centralDataMarksEntry.testQuestions[editingTestId] || [];
    const studentMarksForTest = centralDataMarksEntry.studentTestMarks[editingTestId] || [];

    // Initialize questionMarks with existing marks from studentTestMarks
    const initialQuestionMarks: { [questionId: string]: string } = {};
    questions.forEach(q => {
      const mark = studentMarksForTest.find(
        m => Number(m.test_Question_ID === q.test_Question_ID) && Number(m.studentId === selectedStudent.studentId)
      );
      initialQuestionMarks[q.test_Question_ID.toString()] = mark ? mark.test_Question_ObtainedMarks.toString() : '';
    });

    setQuestionMarks(initialQuestionMarks);
  }, [questionMarksModalVisible, selectedStudent, editingTestId, centralDataMarksEntry]);




  const renderQuestionMarksModal = () => {
    if (!questionMarksModalVisible || !selectedStudent || !editingTestId) return null;
    const test = (centralDataMarksEntry.tests[courseOfferingID] || []).find(t => t.test_ID === editingTestId);
    const questions = centralDataMarksEntry.testQuestions[editingTestId] || [];
    const studentMarksForTest = centralDataMarksEntry.studentTestMarks[editingTestId] || [];

    const validateQuestionMarks = () => {
  let isValid = true;
  let totalObtained = 0;
  const errors = [];

  const questions = centralDataMarksEntry.testQuestions[editingTestId] || [];

  questions.forEach(q => {
    const marks = questionMarks[q.test_Question_ID];
    const maxMarks = parseFloat(q.test_Question_Marks) || 0;

    if (!marks || marks.trim() === '') {
      isValid = false;
      errors.push(`Question ${q.test_Question_No}: Marks field is empty.`);
    } else {
      const obtained = parseFloat(marks);
      if (isNaN(obtained)) {
        isValid = false;
        errors.push(`Question ${q.test_Question_No}: Invalid marks entered.`);
      } else if (obtained > maxMarks) {
        isValid = false;
        errors.push(`Question ${q.test_Question_No}: Obtained marks (${obtained}) exceed total marks (${maxMarks}).`);
      } else if (obtained < 0) {
        isValid = false;
        errors.push(`Question ${q.test_Question_No}: Marks cannot be negative.`);
      } else {
        totalObtained += obtained;
      }
    }
  });

  return { isValid, totalObtained, errorMessage: errors.length > 0 ? errors.join('\n') : '' };
};


const handleSaveQuestionMarks = async () => {
  const { isValid, totalObtained, errorMessage } = validateQuestionMarks();
  if (!isValid) {
    setPopupAlertType('error');
    setPopupAlertTitle('Validation Error');
    setPopupAlertMessage(errorMessage || 'Please correct the errors in question marks.');
    setPopupAlertButtons([{ text: 'OK', onPress: () => setShowAlertPopup(false) }]);
    setShowAlertPopup(true);
    return;
  }

  setPopupAlertType('confirmation');
  setPopupAlertTitle('Confirm Save');
  setPopupAlertMessage('Are you sure you want to save the question marks for this student?');
  setPopupAlertButtons([
    { text: 'Cancel', onPress: () => setShowAlertPopup(false) },
    {
      text: 'Save',
      onPress: async () => {
        setShowAlertPopup(false);
        try {
          setLoading(true);
          const token = await AsyncStorage.getItem('token');
          if (!token) {
            setPopupAlertType('error');
            setPopupAlertTitle('Authentication Error');
            setPopupAlertMessage('Please log in again.');
            setPopupAlertButtons([
              {
                text: 'OK',
                onPress: () => {
                  setShowAlertPopup(false);
                  setQuestionMarksModalVisible(false);
                  navigation.replace('TeacherLogin');
                },
              },
            ]);
            setShowAlertPopup(true);
            return;
          }



          // Update studentTestMarks in centralDataMarksEntry
          const updatedStudentTestMarks: StudentTestMarks[] = questions.map(q => ({
             M_ID: marksEntryId,                   // <-- Add this!
            Test_ID: editingTestId,
            StudentId: selectedStudent.studentId, // Use capital S to match backend
            Test_Question_ID: q.test_Question_ID,
            Test_Question_ObtainedMarks: questionMarks[q.test_Question_ID] || '0',
            
            Test_Question_Marks: q.test_Question_Marks,
            Test_Question_CLO_ID: q.test_Question_CLO_ID,
            
            Client_IP: '', // optional, backend can fill if needed
          }));

          
  


console.log("This is Updated Marks per question ");
console.log(updatedStudentTestMarks);
          //Save Marks using API FK | 6:56AM
saveStudentQuestionMarks(updatedStudentTestMarks);
         
          const now = new Date().toISOString();
          const marksDetails: MarksEntryDetail[] = [{
            M_ID: marksEntryId,
            StudentId: selectedStudent.studentId,
            TotalMarks: test?.test_TotalMarks || '0',
            ObtainedMarks: totalObtained.toString(),
            Remarks: studentMarks[selectedStudent.studentId]?.remarks || '',
            Created_By: '1',
            Created_Date: now,
            Updated_By: '1',
            Updated_Date: now,
            Test_ID: editingTestId,
            CourseOfferedID: courseOfferingID,
            HeldOn: editedTestDate?.toISOString() || now,
          }];

          await saveMarks(marksDetails);
 setQuestionMarksModalVisible(false); // Close modal only after successful save
          setPopupAlertType('success');
          setPopupAlertTitle('Success');
          setPopupAlertMessage('Question marks saved successfully.');
          setPopupAlertButtons([{ text: 'OK', onPress: () => setShowAlertPopup(false) }]);
          setShowAlertPopup(true);
          loadMarksSeed(courseOfferingID);
        } catch (error) {
          console.error('Error saving question marks:', error);
          setPopupAlertType('error');
          setPopupAlertTitle('Error');
          setPopupAlertMessage('Failed to save question marks.');
          setPopupAlertButtons([{ text: 'OK', onPress: () => setShowAlertPopup(false) }]);
          setShowAlertPopup(true);
        } finally {
          setLoading(false);
        }
      },
    },
  ]);
  setShowAlertPopup(true);
};


  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={questionMarksModalVisible}
      onRequestClose={() => setQuestionMarksModalVisible(false)}
    >
      <View style={[styles.modalContainer, { zIndex: 1000 }]}>
        <View style={[styles.modalContent_MES]}>
          <Text style={[styles.heading]}>
            EDIT Mode |  Marks for {test?.test_Name || 'Test'} - {selectedStudent.name} ({selectedStudent.rollNo})
          </Text>
          <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
            <View style={[styles.tableContainerLM, { width: '100%' }]}>
              <View style={[styles.tableRow, styles.tableHeader]}>
                <Text style={[styles.tableCell, styles.tableHeaderText, { width: '10%' }]}>Q#</Text>
                <Text style={[styles.tableCell, styles.tableHeaderText, { width: '40%' }]}>Question Text</Text>
                <Text style={[styles.tableCell, styles.tableHeaderText, { width: '20%' }]}>Total Marks</Text>
                <Text style={[styles.tableCell, styles.tableHeaderText, { width: '30%' }]}>Obtained Marks</Text>
              </View>
              {questions.length > 0 ? (
                questions.map((q, index) => (
                  <View
                    key={q.test_Question_ID}
                    style={[styles.tableRow, index % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd]}
                  >
                    <Text style={[styles.tableCell, { width: '10%', fontSize: isMobile ? 12 : 16 }]}>
                      {q.test_Question_No}
                    </Text>
                    <Text style={[styles.tableCell, { width: '40%' }]}>{q.question_Text}</Text>
                    <Text style={[styles.tableCell, { width: '20%' }]}> {questionMarks[q.test_Question_ID.toString()]} /  {q.test_Question_Marks}</Text>
                    <TextInput
                      style={[styles.input, { width: '30%', fontSize: isMobile ? 12 : 16 }]}
                      value={questionMarks[q.test_Question_ID.toString()]}
                      onChangeText={(text) => {
                        setQuestionMarks(prev => ({
                          ...prev,
                          [q.test_Question_ID]: text,
                        }));
                      }}
                      placeholder="Enter marks"
                      keyboardType="numeric"
                      placeholderTextColor="#999"
                      editable={!isReadOnly}
                    />
                  </View>
                ))
              ) : (
                <View style={styles.tableRow}>
                  <Text style={[styles.tableCell, { width: '100%' }]}>No questions available</Text>
                </View>
              )}
            </View>
          </ScrollView>
          <View style={[styles.modalButtons, isMobile && { flexDirection: 'row', justifyContent: 'space-between' }]}>
            <TouchableOpacity
              style={[styles.actionButton, styles.closeButton, isMobile && { paddingHorizontal: 12, paddingVertical: 8 }]}
              onPress={() => setQuestionMarksModalVisible(false)}
            >
              <Text style={[styles.modalButtonText]}>Cancel</Text>
            </TouchableOpacity>
            {!isReadOnly && (
              <TouchableOpacity
                style={[styles.actionButton, styles.saveButton, isMobile && { paddingHorizontal: 12, paddingVertical: 8 }]}
                onPress={handleSaveQuestionMarks}
              >
                <Text style={[styles.modalButtonText, { fontSize: isMobile ? 12 : 14 }]}>Save</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};
return (
  // <View style={{ flex: 1, backgroundColor: '#fff', paddingTop: 20 }}>
<View style={styles.container}>
  {isMobile ? (
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 50 }}>
      <Header isMobile={isMobile} />
         <View style={{ flexDirection: 'row', justifyContent: 'center', width: isMobile? '167%':"80%", alignSelf: 'center' }}>
          {selectedCourse && selectedCourse.courseOfferingID && (
            <SubMenuBar
              isMobile={isMobile}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              selectedCourse={selectedCourse}
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
        <View style={{ paddingHorizontal: isMobile ? 10 : 0 }}>
          <Text style={{ fontSize: isMobile ? 16 : 20 }}></Text>
          {showSummary ? (
            renderTestSummaryTable({
              isMobile,
              summaryData,
              setShowSummary,
              images,
              handleEditStudentMarks,
              handleEditTestDetails,
              setSelectedTest,
              setMarksModalVisible,
              setModalVisible,
              styles,
            })
          ) : showStudentsList ? (
            <>
              {renderSelectedValuesRow()}
            </>
          ) : showTestAndMarksTable ? (
            renderTestAndMarksTable()
          ) : (
            renderTestForm()
          )}
        </View>
        {showAlertPopup && (
          <View
            style={{
              position: 'absolute',
              zIndex: 1000,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <AlertModalPopUp
              visible={showAlertPopup}
              type={popupAlertType}
              title={popupAlertTitle}
              message={popupAlertMessage}
              buttons={popupAlertButtons}
              onClose={() => setShowAlertPopup(false)}
            />
          </View>
        )}
      </ScrollView>
    ) : (
      <>
       <Header isMobile={isMobile} />
        <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 30 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'center', width: '80%', alignSelf: 'center' }}>
            {selectedCourse && selectedCourse.courseOfferingID && (
              <SubMenuBar
                isMobile={isMobile}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                selectedCourse={selectedCourse}
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
          <View style={{ paddingHorizontal: isMobile ? 10 : 0 }}>
            <Text style={{ fontSize: isMobile ? 16 : 20 }}></Text>
            {showSummary ? (
              renderTestSummaryTable({
                isMobile,
                summaryData,
                setShowSummary,
                images,
                handleEditStudentMarks,
                handleEditTestDetails,
                setSelectedTest,
                setMarksModalVisible,
                setModalVisible,
                styles,
              })
            ) : showStudentsList ? (
              <>
                {renderSelectedValuesRow()}
              </>
            ) : showTestAndMarksTable ? (
              renderTestAndMarksTable()
            ) : (
              renderTestForm()
            )}
          </View>
        </ScrollView>
        {showAlertPopup && (
          <View
            style={{
              position: 'absolute',
              zIndex: 1000,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <AlertModalPopUp
              visible={showAlertPopup}
              type={popupAlertType}
              title={popupAlertTitle}
              message={popupAlertMessage}
              buttons={popupAlertButtons}
              onClose={() => setShowAlertPopup(false)}
            />
          </View>
        )}
      </>
    )}
    {renderQuestionMarksModal()}
  </View>
);


};

export default MarksEntryScreen;
















































