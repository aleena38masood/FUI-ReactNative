
// @ts-nocheck

import React, { useState, useEffect } from 'react';
import {
  View,
 Button,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  useWindowDimensions,
  Picker,
  Platform,
  TextInput,
  Alert,
  Modal,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useNavigationState, useRoute } from '@react-navigation/native';
import type { ViewStyle } from 'react-native';
import type { RouteProp } from '@react-navigation/native';
import images from '@/assets/images';
import config from '@/constants/config';
import MenuBar from '@/components/MenuBar';
import centralDataAdmin from '@/components/centralDataAdmin';
import AlertModalPopUp from '@/components/AlertModalPopUp';
import CustomModal from '@/components/CustomModal';
// import styles from '@/assets/TeacherPortalStyles'; // Import the styles
import TooltipWrapper from '@/assets/TooltipWrapper';
import Header from '@/components/HeaderComponent';

import { getGlobal, setGlobal } from '@/constants/Globals';
import getStyles from '../../assets/TeacherPortalStyles'; // Import the styles

import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

// Define navigation parameter types
type RootStackParamList = {
  AdminDashboard: { userData?: UserData };
  FacultyManagement: undefined;
  Announcements: undefined;
  Profile: undefined;
  TeacherLogin: undefined;
  TeacherPortal: { facultyId: string; isAdminView?: boolean };
};

// Define TypeScript interface for userData
interface UserData {
  fullName?: string;
  isAdmin?: boolean;
  token?: string;
}


interface FacultyInterface {
  TeacherId: number;
  FullName: string;
  Designation: string;
  Email: string;
  Phone: string;
  UserId: number;
  Status?: string;
  isViewed?: number;
}

interface Announcement {
  id: string;
  created_date: string;
  content_Text: string;
  content_Title: string;
  content_Type: string;
  createdBy_Name: string;
  createdBy_ID: string;
  isViewed: number;
  roleId?: string;
  departmentId?: string;
  programId?: string;
}

// Define interfaces for data from centralDataAdmin
interface CourseOffered {
  CourseOfferedId: string;
  CourseId: number;
  CourseName: string;
  ProgramId: number;
  ProgramName: string;
  Session_ID: number;
  Session_Name: string;
  TeacherId: number | null;
  TeacherName: string | null;
}

interface Session {
  Session_ID: number;
  Session_Name: string;
}

interface Program {
  ProgramId: number;
  ProgramName: string;
}

interface Course {
  CourseId: number;
  CourseName: string;
}

interface Teacher {
  TeacherId: number;
  TeacherName: string;
}

// interface Announcement {
//   id: string;
//   date: string;
//   content: string;
//   roleId?: string;
//   departmentId?: string;
//   programId?: string;
// }

const AdminDashboard = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RootStackParamList, 'AdminDashboard'>>();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;





     const styles = getStyles(isMobile);

   const [dashboardContainerHeight, setDashboardContainerHeight] = useState(0);
   const [containerInnerGridViewHeight, setContainerInnerGridViewHeight] = useState(0);
  
    const [designation, setDesignation] = useState<string>('');

 const handleContainersLayout = (event) => {
    // const { height } = event.nativeEvent.layout;
    // setDashboardContainerHeight(height);
    // setContainerInnerGridViewHeight(height*0.5);

//  const screenHeight = Dimensions.get('window').height;
// const screenWidth = Dimensions.get('window').width;
// setDashboardContainerHeight(screenHeight*0.5);
//     setContainerInnerGridViewHeight(screenHeight*0.18);


  };
  
  const screenHeight = Dimensions.get('window').height;
 const screenWidth = Dimensions.get('window').width;
    

  // Get user data from navigation params
  const { userData } = route.params || {};
  const [token, setToken] = useState<string | null>(null);
  const [coursesOffered, setCoursesOffered] = useState<CourseOffered[]>([]);
  const [selectedSession, setSelectedSession] = useState<string>('');
  const [selectedProgram, setSelectedProgram] = useState<string>('-1');
  const [selectedAssignedSession, setSelectedAssignedSession] = useState<string>('');
  const [modalVisible, setModalVisible] = useState(false);
  const [newSessionOption, setNewSessionOption] = useState<'create' | 'copy'>('create');
  const [selectedNewSession, setSelectedNewSession] = useState<string>('');
  const [selectedCopySession, setSelectedCopySession] = useState<string>('');
  const [selectedModalProgram, setSelectedModalProgram] = useState<string>('');
  const [facultyModalVisible, setFacultyModalVisible] = useState(false);
  const [facultyProgram, setFacultyProgram] = useState<string>('');
  const [facultySession, setFacultySession] = useState<string>('');
  const [facultyCourse, setFacultyCourse] = useState<string>('');
  const [selectedTeacher, setSelectedTeacher] = useState<string>('');
  const [selectedAssignedProgram, setSelectedAssignedProgram] = useState<string>('');
  const [alertModal, setAlertModal] = useState<{
    visible: boolean;
    type: 'success' | 'error' | 'confirmation';
    title: string;
    message: string;
    buttons: { text: string; onPress: () => void }[];
  }>({
    visible: false,
    type: 'success',
    title: '',
    message: '',
    buttons: [{ text: 'CONTINUE', onPress: () => setAlertModal((prev) => ({ ...prev, visible: false })) }],
  });



////////////////////////////////////////////////
const [announcements, setAnnouncements] = useState([]);
const [unreadCount, setUnreadCount] = useState(0);

const [isEditing, setIsEditing] = useState(false);
const [mode, setMode] = useState('View'); // 'Add' | 'Edit' | 'View'

const [popupAlertTitle, setPopupAlertTitle] = useState('');
const [popupAlertMessage, setPopupAlertMessage] = useState('');
const [popupAlertButtons, setPopupAlertButtons] = useState([]);
const [showAlertPopup, setShowAlertPopup] = useState(false);
/////////////////////////////////////////////


const [popupAlertType, setPopupAlertType] = useState('success');


const [isModalVisible, setIsModalVisible] = useState(false);

const [currentAnnouncement, setCurrentAnnouncement] = useState({
  AnnouncementId: 0,
  Content_Text: '',
  Content_Title: '',
  Content_Type: '',
  RoleId: null,
  ProgramId: null,
  DepartmentId: null,
  ExpiryDate: ''
});
const [loading, setLoading] = useState(false);
////////////////////////////////////////////////////////////////////
const handleAddAnnouncement = () => {
  setCurrentAnnouncement({
    AnnouncementId: 0,
    Content_Text: '',
    Content_Title: '',
    Content_Type: '',
    RoleId: null,
    ProgramId: null,
    DepartmentId: null,
    ExpiryDate: ''
  });
  setIsEditing(false);
  setIsModalVisible(true);
};

const handleEditAnnouncement = (announcement) => {
  setCurrentAnnouncement(announcement);
  setIsEditing(true);
  setIsModalVisible(true);
};
///////////////////////////////////////////////////
////////////////////////////////////////////////////














  // Mock teacher data (replace with actual data from centralDataAdmin if available)
  const teachers: Teacher[] = centralDataAdmin.teachers || [];

  // Get the current route name
  const currentRouteName = useNavigationState((state) => state.routes[state.index].name);

  // Generate future sessions (e.g., for 2025 and 2026)
  const currentYear = new Date().getFullYear();
  const futureSessions = [
    { Session_ID: centralDataAdmin.sessions.length + 1, Session_Name: `Spring ${currentYear + 1}` },
    { Session_ID: centralDataAdmin.sessions.length + 2, Session_Name: `Fall ${currentYear + 1}` },
    { Session_ID: centralDataAdmin.sessions.length + 3, Session_Name: `Summer ${currentYear + 1}` },
    { Session_ID: centralDataAdmin.sessions.length + 4, Session_Name: `Spring ${currentYear + 2}` },
    { Session_ID: centralDataAdmin.sessions.length + 5, Session_Name: `Fall ${currentYear + 2}` },
    { Session_ID: centralDataAdmin.sessions.length + 6, Session_Name: `Summer ${currentYear + 2}` },
  ].filter(
    (futureSession) =>
      !centralDataAdmin.sessions.some(
        (existingSession) => existingSession.Session_Name === futureSession.Session_Name
      )
  );

  // Filter sessions based on selected program
  const availableSessions = selectedProgram
    ? centralDataAdmin.sessions.filter((session) =>
        coursesOffered.some(
          (course) =>
            course.Session_ID === session.Session_ID &&
            course.ProgramId.toString() === selectedProgram
        )
      )
    : centralDataAdmin.sessions;

  // Filter sessions for faculty modal
  const facultyAvailableSessions = facultyProgram
    ? centralDataAdmin.sessions.filter((session) =>
        coursesOffered.some(
          (course) =>
            course.Session_ID === session.Session_ID &&
            course.ProgramId.toString() === facultyProgram
        )
      )
    : centralDataAdmin.sessions;

  // Filter courses based on selected program and session for faculty modal
  const availableCourses = coursesOffered.filter(
    (course) =>
      (!facultySession || course.Session_ID.toString() === facultySession) &&
      (!facultyProgram || course.ProgramId.toString() === facultyProgram)
  );





const saveAnnouncement = async (announcementData) => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      navigation.replace('TeacherLogin');
      return;
    }

    const res = await fetch(`${config.BASE_URL}/api/Announcement/Save`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(announcementData)
    });

    if (!res.ok) throw new Error('Failed to save announcement');

    fetchAnnouncements();
    fetchUnreadCount();

    setPopupAlertTitle('Success');
    setPopupAlertMessage('Announcement saved successfully.');
    setPopupAlertButtons([{ text: 'OK', onPress: () => setShowAlertPopup(false) }]);
    setShowAlertPopup(true);

  } catch (err) {
    console.error('Error saving announcement:', err);
    showErrorPopup('Save Announcement', 'Unable to save announcement. Please try again.');
  }
};


const deleteAnnouncement = async (announcementId) => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      navigation.replace('TeacherLogin');
      return;
    }

    const res = await fetch(`${config.BASE_URL}/api/Announcement/Delete?announcementId=${announcementId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) throw new Error('Failed to delete announcement');

    fetchAnnouncements();
    fetchUnreadCount();

    setPopupAlertTitle('Deleted');
    setPopupAlertMessage('Announcement deleted successfully.');
    setPopupAlertButtons([{ text: 'OK', onPress: () => setShowAlertPopup(false) }]);
    setShowAlertPopup(true);

  } catch (err) {
    console.error('Error deleting announcement:', err);
    showErrorPopup('Delete Announcement', 'Unable to delete. Please try again.');
  }
};


const showErrorPopup = (title, message) => {
  setPopupAlertTitle(title);
  setPopupAlertMessage(message);
  setPopupAlertButtons([{ text: 'OK', onPress: () => setShowAlertPopup(false) }]);
  setShowAlertPopup(true);
};




  // Reset selectedSession if it's not in availableSessions
  useEffect(() => {
    if (
      selectedSession &&
      !availableSessions.some((session) => session.Session_ID.toString() === selectedSession)
    ) {
      setSelectedSession(availableSessions[0]?.Session_ID.toString() || '');
    }
  }, [selectedProgram, availableSessions]);

  // Reset facultySession if it's not in facultyAvailableSessions
  useEffect(() => {
    if (
      facultySession &&
      !facultyAvailableSessions.some((session) => session.Session_ID.toString() === facultySession)
    ) {
      setFacultySession(facultyAvailableSessions[0]?.Session_ID.toString() || '');
    }
  }, [facultyProgram, facultyAvailableSessions]);

  // Reset facultyCourse if it's not in availableCourses
  useEffect(() => {
    if (
      facultyCourse &&
      !availableCourses.some((course) => course.CourseOfferedId === facultyCourse)
    ) {
      setFacultyCourse(availableCourses[0]?.CourseOfferedId || '');
    }
  }, [facultySession, facultyProgram, availableCourses]);

  // Filter courses for Courses Offered table based on selected session and program
  const filteredCourses = coursesOffered.filter(
    (course) =>
      (!selectedSession || course.Session_ID.toString() === selectedSession) &&
      (!selectedProgram || course.ProgramId.toString() === selectedProgram)
  );

  // Filter courses for Courses Assigned table based on selected session
  const filteredAssignedCourses = coursesOffered.filter(
    (course) =>
      (!selectedAssignedSession || course.Session_ID.toString() === selectedAssignedSession) &&
      (!selectedAssignedProgram || course.ProgramId.toString() === selectedAssignedProgram)
  );

  // Fetch token and initialize data
  useEffect(() => {
    const initialize = async () => {
      try {
        console.log('userData:', userData);
        console.log('centralDataAdmin:', centralDataAdmin);
        console.log('centralDataAdmin.coursesOffered:', centralDataAdmin.coursesOffered);
        console.log('WorkingMode:', config.WorkingMode);
        console.log('Images:', images);
        console.log('Rendering MenuBar with isMobile:', isMobile);

        const storedToken = await AsyncStorage.getItem('authToken');
        console.log('Stored Token:', storedToken);
        if (storedToken) {
          setToken(storedToken);
        } else if (userData?.token) {
          setToken(userData.token);
          await AsyncStorage.setItem('authToken', userData.token);
        }

        if (userData?.isAdmin === false) {
          console.log('Redirecting to TeacherLogin due to isAdmin:', userData?.isAdmin);
          setAlertModal({
            visible: true,
            type: 'error',
            title: 'Access Denied',
            message: 'You are not authorized to access the Admin Dashboard.',
            buttons: [
              {
                text: 'OK',
                onPress: () => {
                  setAlertModal((prev) => ({ ...prev, visible: false }));
                  navigation.navigate('TeacherLogin');
                },
              },
            ],
          });
          return;
        }

        if (config.WorkingMode === 'APIData') {
          console.log('Setting coursesOffered from centralDataAdmin');
          setCoursesOffered(centralDataAdmin.coursesOffered || []);

          // Set default session and program to the first available
          if (centralDataAdmin.sessions?.length > 0) {
            setSelectedSession(centralDataAdmin.sessions[0].Session_ID.toString());
            setSelectedAssignedSession(centralDataAdmin.sessions[0].Session_ID.toString());
            setFacultySession(centralDataAdmin.sessions[0].Session_ID.toString());
          }
          if (centralDataAdmin.programs?.length > 0) {
            setSelectedProgram(centralDataAdmin.programs[0].ProgramId.toString());
            setSelectedModalProgram(centralDataAdmin.programs[0].ProgramId.toString());
            setFacultyProgram(centralDataAdmin.programs[0].ProgramId.toString());
          }
        } else {
          console.log('API call to fetch coursesOffered would go here');
        }
      } catch (error) {
        console.error('Error initializing:', error);
        setAlertModal({
          visible: true,
          type: 'error',
          title: 'Error',
          message: 'Failed to initialize dashboard.',
          buttons: [
            {
              text: 'OK',
              onPress: () => setAlertModal((prev) => ({ ...prev, visible: false })),
            },
          ],
        });
      }
    };

    initialize();
  }, [userData]);

  useEffect(() => {
    console.log('CoursesOffered state:', coursesOffered);
  }, [coursesOffered]);

  // Handle New Session button press
  const handleNewSession = () => {
    setModalVisible(true);
    setNewSessionOption('create');
    setSelectedNewSession(futureSessions[0]?.Session_ID.toString() || '');
    setSelectedCopySession(centralDataAdmin.sessions[0]?.Session_ID.toString() || '');
  };

  // Handle Allocate Faculty button press
  const handleAllocateFaculty = () => {
    setFacultyModalVisible(true);
    setFacultyProgram(centralDataAdmin.programs[0]?.ProgramId.toString() || '');
    setFacultySession(centralDataAdmin.sessions[0]?.Session_ID.toString() || '');
    setFacultyCourse('');
    setSelectedTeacher('');
  };

  const availableAssignedSessions = selectedAssignedProgram
    ? centralDataAdmin.sessions.filter((session) =>
        coursesOffered.some(
          (course) =>
            course.Session_ID === session.Session_ID &&
            course.ProgramId.toString() === selectedAssignedProgram
        )
      )
    : centralDataAdmin.sessions;

  useEffect(() => {
    if (
      selectedAssignedSession &&
      !availableAssignedSessions.some((session) => session.Session_ID.toString() === selectedAssignedSession)
    ) {
      setSelectedAssignedSession(availableAssignedSessions[0]?.Session_ID.toString() || '');
    }
  }, [selectedAssignedProgram, availableAssignedSessions]);

  // Handle modal confirm for creating or copying sessions
  const handleModalConfirm = () => {
    if (newSessionOption === 'create' && selectedNewSession) {
      const selectedSession = futureSessions.find(
        (session) => session.Session_ID.toString() === selectedNewSession
      );
      if (selectedSession) {
        // Add new session to centralDataAdmin.sessions
        centralDataAdmin.sessions.push({
          Session_ID: selectedSession.Session_ID,
          Session_Name: selectedSession.Session_Name,
        });
        setAlertModal({
          visible: true,
          type: 'success',
          title: 'Success',
          message: `New session ${selectedSession.Session_Name} created successfully.`,
          buttons: [
            {
              text: 'CONTINUE',
              onPress: () => setAlertModal((prev) => ({ ...prev, visible: false })),
            },
          ],
        });
      }
    } else if (newSessionOption === 'copy' && selectedCopySession && selectedTargetSession && selectedModalProgram) {
      const sourceSession = centralDataAdmin.sessions.find(
        (session) => session.Session_ID.toString() === selectedCopySession
      );
      const targetSession = centralDataAdmin.sessions.find(
        (session) => session.Session_ID.toString() === selectedTargetSession
      );
      if (sourceSession && targetSession) {
        // Copy courses from source session to target session for the selected program
        const coursesToCopy = coursesOffered.filter(
          (course) =>
            course.Session_ID.toString() === selectedCopySession &&
            course.ProgramId.toString() === selectedModalProgram
        );
        const newCourses = coursesToCopy.map((course) => ({
          ...course,
          CourseOfferedId: `${course.CourseId}-${targetSession.Session_ID}-${course.ProgramId}`,
          Session_ID: targetSession.Session_ID,
          Session_Name: targetSession.Session_Name,
          TeacherId: null, // Reset teacher assignment for copied courses
          TeacherName: null,
        }));
        setCoursesOffered((prev) => [...prev, ...newCourses]);
        setAlertModal({
          visible: true,
          type: 'success',
          title: 'Success',
          message: `Courses copied from ${sourceSession.Session_Name} to ${targetSession.Session_Name} successfully.`,
          buttons: [
            {
              text: 'CONTINUE',
              onPress: () => setAlertModal((prev) => ({ ...prev, visible: false })),
            },
          ],
        });
      }
    } else {
      setAlertModal({
        visible: true,
        type: 'error',
        title: 'Error',
        message: 'Please select all required fields.',
        buttons: [
          {
            text: 'OK',
            onPress: () => setAlertModal((prev) => ({ ...prev, visible: false })),
          },
        ],
      });
    }
    setModalVisible(false);
    setSelectedNewSession('');
    setSelectedCopySession('');
    setSelectedTargetSession('');
  };


  // Handle modal cancel
  const handleModalCancel = () => {
    setModalVisible(false);
    setSelectedNewSession('');
    setSelectedCopySession('');
    setSelectedTargetSession('');
  };

  // Handle faculty modal confirm
  const handleFacultyModalConfirm = () => {
    if (facultyCourse && selectedTeacher) {
      const selectedCourse = coursesOffered.find(
        (course) => course.CourseOfferedId === facultyCourse
      );
      const selectedTeacherData = teachers.find(
        (teacher) => teacher.TeacherId.toString() === selectedTeacher
      );
      if (selectedCourse && selectedTeacherData) {
        setCoursesOffered((prev) =>
          prev.map((course) =>
            course.CourseOfferedId === facultyCourse
              ? {
                  ...course,
                  TeacherId: selectedTeacherData.TeacherId,
                  TeacherName: selectedTeacherData.TeacherName,
                }
              : course
          )
        );
        setAlertModal({
          visible: true,
          type: 'success',
          title: 'Success',
          message: `Teacher ${selectedTeacherData.TeacherName} allocated to ${selectedCourse.CourseName} successfully.`,
          buttons: [
            {
              text: 'CONTINUE',
              onPress: () => setAlertModal((prev) => ({ ...prev, visible: false })),
            },
          ],
        });
      }
      setFacultyModalVisible(false);
      setFacultyCourse('');
      setSelectedTeacher('');
    } else {
      setAlertModal({
        visible: true,
        type: 'error',
        title: 'Error',
        message: 'Please select a course and a teacher.',
        buttons: [
          {
            text: 'OK',
            onPress: () => setAlertModal((prev) => ({ ...prev, visible: false })),
          },
        ],
      });
    }
  };

  // Handle faculty modal cancel
  const handleFacultyModalCancel = () => {
    setFacultyModalVisible(false);
    setFacultyCourse('');
    setSelectedTeacher('');
  };

  const availableModalSessions = selectedModalProgram
    ? centralDataAdmin.sessions.filter((session) =>
        !coursesOffered.some(
          (course) =>
            course.Session_ID === session.Session_ID &&
            course.ProgramId.toString() === selectedModalProgram
        )
      )
    : centralDataAdmin.sessions;

  // Reset selectedCopySession if it's not in availableModalSessions
  useEffect(() => {
    if (
      selectedCopySession &&
      !availableModalSessions.some((session) => session.Session_ID.toString() === selectedCopySession)
    ) {
      setSelectedCopySession(availableModalSessions[0]?.Session_ID.toString() || '');
    }
  }, [selectedModalProgram, availableModalSessions]);

  // Reset selectedSession if it's not in availableSessions
  useEffect(() => {
    if (
      selectedSession &&
      !availableSessions.some((session) => session.Session_ID.toString() === selectedSession)
    ) {
      setSelectedSession(availableSessions[0]?.Session_ID.toString() || '');
    }
  }, [selectedProgram, availableSessions]);

  const [selectedTargetSession, setSelectedTargetSession] = useState<string>('');

  // Filter sessions for "Select For" dropdown where the course is already registered
  const registeredSessions = selectedModalProgram
    ? centralDataAdmin.sessions.filter((session) =>
        coursesOffered.some(
          (course) =>
            course.Session_ID === session.Session_ID &&
            course.ProgramId.toString() === selectedModalProgram
        )
      )
    : centralDataAdmin.sessions;

  // Reset selectedTargetSession if it's not in registeredSessions
  useEffect(() => {
    if (
      selectedTargetSession &&
      !registeredSessions.some((session) => session.Session_ID.toString() === selectedTargetSession)
    ) {
      setSelectedTargetSession(registeredSessions[0]?.Session_ID.toString() || '');
    }
  }, [selectedModalProgram, registeredSessions]);

  // Render header
  // const renderHeader = () => (
  //   <>
  //     <View style={[styles.topBar, { height: isMobile ? 20 : 25 }] as ViewStyle[]}>
  //       <Text style={[styles.welcomeText, { fontSize: isMobile ? 12 : 14 }]}>
  //         Welcome: {userData?.fullName || ' to FUI Admin Portal'}
  //       </Text>
  //     </View>
  //     <View style={styles.header as ViewStyle}>
  //       <View style={[styles.contentRow, isMobile && { flexDirection: 'column', alignItems: 'center' }] as ViewStyle[]}>
  //         <View style={[styles.logoContainer, isMobile && { width: '100%', marginBottom: 10 }] as ViewStyle[]}>
  //           <Image
  //             source={images.logo}
  //             style={[styles.logo, { width: isMobile ? 60 : 75, height: isMobile ? 60 : 75 }]}
  //           />
  //           <Text style={[styles.uniName, { fontSize: isMobile ? 12 : 16 }]}>
  //             FOUNDATION UNIVERSITY{'\n'}ISLAMABAD
  //           </Text>
  //         </View>
  //         <View style={[styles.menuContainer, isMobile && { width: '100%', alignItems: 'center' }] as ViewStyle[]}>
  //           <View style={[styles.menuGrid, isMobile && { width: '100%', justifyContent: 'center' }, { flexWrap: isMobile ? 'wrap' : 'nowrap' }] as ViewStyle[]}>
  //             <MenuBar isMobile={isMobile} />
  //           </View>
  //         </View>
  //         {!isMobile && (
  //           <View style={styles.rightSection as ViewStyle}>
  //             <Image source={images.i2} style={styles.i2} />
  //           </View>
  //         )}
  //       </View>
  //     </View>
  //   </>
  // );



 
  {announcements.map(a => (
  <TouchableOpacity key={a.announcementId} onPress={() => {
    setCurrentAnnouncement(a);
    setMode('View');
    //markAnnouncementAsRead(a.announcementId);
  }}>
    <Text>{a.content_Title} {a.isViewed === 0 && <Text style={{color:'red'}}>•</Text>}</Text>
  </TouchableOpacity>
))}

<Text>Unread count: {unreadCount}</Text>



// Updated renderNewSessionModal
const renderNewSessionModal = () => (

  
  <CustomModal
    visible={modalVisible}
    onRequestClose={handleModalCancel}
    title={newSessionOption === 'create' ? 'Add New Session' : 'Copy from Existing Session'}
    type="form"
    isMobile={isMobile}
    buttons={[
      {
        text: 'Cancel',
        style: [styles.actionButton, styles.closeButton],
        textStyle: [styles.modalButtonText],
        onPress: handleModalCancel,
      },
      {
        text: newSessionOption === 'create' ? 'Create' : 'Copy',
        style: [styles.actionButton, styles.saveButton],
        textStyle: [styles.modalButtonText, ],
        onPress: handleModalConfirm,
      },
    ]}
  >
    <View style={styles.radioContainer}>
      <Text style={styles.radioLabel}>Select Option:</Text>
      <View style={styles.radioGroup}>
        
        <TouchableOpacity
          style={styles.radioOption}
          onPress={() => {
            setNewSessionOption('create');
            setSelectedNewSession(futureSessions[0]?.Session_ID.toString() || '');
          }}
          accessible={true}
          accessibilityLabel="Create New Session"
        >
          <View style={[styles.radioCircle, newSessionOption === 'create' && styles.radioCircleSelected]} />
          <Text style={styles.radioText}>Create New Session</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.radioOption}
          onPress={() => {
            setNewSessionOption('copy');
            setSelectedCopySession(availableModalSessions[0]?.Session_ID.toString() || '');
            setSelectedTargetSession(registeredSessions[0]?.Session_ID.toString() || '');
          }}
          accessible={true}
          accessibilityLabel="Copy from Existing Session"
        >
          <View style={[styles.radioCircle, newSessionOption === 'copy' && styles.radioCircleSelected]} />
          <Text style={styles.radioText}>Copy from Existing Session</Text>
        </TouchableOpacity>
      </View>
    </View>
    {newSessionOption === 'copy' && (
      <View style={styles.dropdownWrapper}>
        <Text style={styles.radioLabel}>Select Program:</Text>
        <View style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 5, marginBottom: 15 }}>
          <Picker
            selectedValue={selectedModalProgram}
            onValueChange={(value) => setSelectedModalProgram(value)}
            style={{ height: 50 }}
          >
            <Picker.Item label="Select Program" value="" />
            {centralDataAdmin.programs.map((program) => (
              <Picker.Item
                key={program.ProgramId}
                label={program.ProgramName}
                value={program.ProgramId.toString()}
              />
            ))}
          </Picker>
        </View>
      </View>
    )}
    {newSessionOption === 'create' ? (
      <View style={styles.dropdownWrapper}>
        <Text style={styles.radioLabel}>Select New Session:</Text>
        <View style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 5, marginBottom: 15 }}>
          <Picker
            selectedValue={selectedNewSession}
            onValueChange={(value) => setSelectedNewSession(value)}
            style={{ height: 50 }}
          >
            {futureSessions.map((session) => (
              <Picker.Item
                key={session.Session_ID}
                label={session.Session_Name}
                value={session.Session_ID.toString()}
              />
            ))}
          </Picker>
        </View>
      </View>
    ) : (
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 }}>
        <View style={[styles.dropdownWrapper, { flex: 1, marginRight: 10 }]}>
          <Text style={styles.radioLabel}>Select Existing Session:  </Text>
          <View style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 5 }}>
            <Picker
              selectedValue={selectedTargetSession}
              onValueChange={(value) => setSelectedTargetSession(value)}
              style={{ height: 50 }}
            >
              <Picker.Item label="Select Session" value="" />
              {registeredSessions.map((session) => (
                <Picker.Item
                  key={session.Session_ID}
                  label={session.Session_Name}
                  value={session.Session_ID.toString()}
                />
              ))}
            </Picker>
          </View>
        </View>
        <View style={[styles.dropdownWrapper, { flex: 1, marginLeft: 10 }]}>
          <Text style={styles.radioLabel}> Select For: </Text>
          <View style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 5 }}>
            <Picker
              selectedValue={selectedCopySession}
              onValueChange={(value) => setSelectedCopySession(value)}
              style={{ height: 50 }}
            >
              <Picker.Item label="Select Session" value="" />
              {availableModalSessions.map((session) => (
                <Picker.Item
                  key={session.Session_ID}
                  label={session.Session_Name}
                  value={session.Session_ID.toString()}
                />
              ))}
            </Picker>
          </View>
        </View>
      </View>
    )}
  </CustomModal>
);

// Updated renderFacultyAllocationModal
const renderFacultyAllocationModal = () => (
  <CustomModal
    visible={facultyModalVisible}
    onRequestClose={handleFacultyModalCancel}
    title="Allocate Faculty"
    type="form"
    isMobile={isMobile}
    buttons={[
      {
        text: 'Cancel',
        style: [styles.actionButton, styles.closeButton],
        textStyle: [styles.modalButtonText, ],
        onPress: handleFacultyModalCancel,
      },
      {
        text: 'Allocate',
        style: [styles.actionButton, styles.saveButton],

        textStyle: [styles.modalButtonText, ],
        onPress: handleFacultyModalConfirm,
      },
    ]}
  >
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 }}>
      <View style={[styles.dropdownWrapper, { flex: 1, marginRight: 10 }]}>
        <Text style={styles.radioLabel}>Select Program:</Text>
        <View style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 5 }}>
          <Picker
            selectedValue={facultyProgram}
            onValueChange={(value) => setFacultyProgram(value)}
            style={{ height: 50 }}
          >
            <Picker.Item label="Select Program" value="" />
            {centralDataAdmin.programs.map((program) => (
              <Picker.Item
                key={program.ProgramId}
                label={program.ProgramName}
                value={program.ProgramId.toString()}
              />
            ))}
          </Picker>
        </View>
      </View>
      <View style={[styles.dropdownWrapper, { flex: 1, marginLeft: 10 }]}>
        <Text style={styles.radioLabel}>Select Session:</Text>
        <View style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 5 }}>
          <Picker
            selectedValue={facultySession}
            onValueChange={(value) => setFacultySession(value)}
            style={{ height: 50 }}
          >
            <Picker.Item label="Select Session" value="" />
            {facultyAvailableSessions.map((session) => (
              <Picker.Item
                key={session.Session_ID}
                label={session.Session_Name}
                value={session.Session_ID.toString()}
              />
            ))}
          </Picker>
        </View>
      </View>
    </View>
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15, alignItems: 'center' }}>
      <View style={[styles.dropdownWrapper, { flex: 1, marginRight: 10 }]}>
        <Text style={styles.radioLabel}>Select Course:</Text>
        <View style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 5 }}>
          <Picker
            selectedValue={facultyCourse}
            onValueChange={(value) => setFacultyCourse(value)}
            style={{ height: 50 }}
          >
            <Picker.Item label="Select Course" value="" />
            {availableCourses.map((course) => (
              <Picker.Item
                key={course.CourseOfferedId}
                label={course.CourseName}
                value={course.CourseOfferedId}
              />
            ))}
          </Picker>
        </View>
      </View>
      <Text style={[styles.radioLabel, { flex: 1, marginLeft: 10, fontSize: isMobile ? 12 : 14 }]}>
        {facultyCourse
          ? coursesOffered.find((course) => course.CourseOfferedId === facultyCourse)?.TeacherName
            ? `Teacher Assigned: ${
                coursesOffered.find((course) => course.CourseOfferedId === facultyCourse)?.TeacherName
              }`
            : 'No teacher assigned to this course'
          : 'Please select a course'}
      </Text>
    </View>
    <View style={styles.dropdownWrapper}>
      <Text style={styles.radioLabel}>Select Teacher:</Text>
      <View style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 5, marginBottom: 15 }}>
        <Picker
          selectedValue={selectedTeacher}
          onValueChange={(value) => setSelectedTeacher(value)}
          style={{ height: 50 }}
        >
          <Picker.Item label="Select Teacher" value="" />
          {teachers.map((teacher) => (
            <Picker.Item
              key={teacher.TeacherId}
              label={teacher.TeacherName}
              value={teacher.TeacherId.toString()}
            />
          ))}
        </Picker>
      </View>
    </View>
  </CustomModal>
);

  // Render dropdowns, new session button, and courses offered table
  const renderCoursesTable = () => (
    <View style={[styles.tableContainer_admin, {height: screenHeight*0.5 , width:screenWidth*0.4} ] as ViewStyle[]}
        // onLayout={handleContainersLayout} 
         >
      <View style={styles.lectureHeaderContainer_admin}>
        {/* <View style={styles.placeholderView} /> */}
        <Text style={[styles.lectureHeaderText_admin, ]}>
          Courses Offered
        </Text>

        <TooltipWrapper tooltipText="Add a new session">

        <TouchableOpacity
          accessible={true}
          accessibilityLabel="Add New Session"
          accessibilityRole="button"
          style={styles.addLectureButton}
          onPress={handleNewSession}
        >
          <Image source={images.plusCircle} style={styles.addLectureIcon} />
          <Text style={styles.addLectureButtonText}> Add New Session </Text>
        </TouchableOpacity>
        </TooltipWrapper>
      </View>
      <View style={[styles.dropdownContainer, isMobile && { flexDirection: 'column', alignItems: 'center' }] as ViewStyle[]}>
        <View style={[styles.dropdownWrapper, isMobile && { width: '100%', marginBottom: 10 }] as ViewStyle[]}>
          <Text style={[styles.dropdownLabel, { fontSize: isMobile ? 14 : 16 }]}>Select Program:</Text>
          <Picker
            selectedValue={selectedProgram}
            style={[styles.dropdown, { width: isMobile ? '100%' : 250 }]}
            onValueChange={(itemValue) => setSelectedProgram(itemValue)}
             itemStyle={styles.pickerItem} // Apply custom item style
          >
            <Picker.Item label="All Programs" value="" />
            {centralDataAdmin.programs.map((program) => (
              <Picker.Item key={program.ProgramId} label={program.ProgramName} value={program.ProgramId.toString()} />
            ))}
          </Picker>
        </View>
        <View style={[styles.dropdownWrapper, isMobile && { width: '100%', marginBottom: 10 }] as ViewStyle[]}>
          <Text style={[styles.dropdownLabel, { fontSize: isMobile ? 14 : 16 }]}>Select Session:</Text>
          <Picker
            selectedValue={selectedSession}
            style={[styles.dropdown, { width: isMobile ? '100%' : 250 }]}
            onValueChange={(itemValue) => setSelectedSession(itemValue)}
          >
            <Picker.Item label="All Sessions" value="" />
            {availableSessions.map((session) => (
              <Picker.Item key={session.Session_ID} label={session.Session_Name} value={session.Session_ID.toString()} />
            ))}
          </Picker>
        </View>
   
      </View>
      {/* <ScrollView horizontal style={[styles.tableWrapper_admin, ]}> */}
      <View style={[styles.tableWrapper_admin, ]}> 
        {/* <ScrollView style={{ flex: 1 }}> */}
        <ScrollView
                  // style={{ maxHeight: isMobile ? 300 : 216, overflow: 'scroll' }}
                  style={{ maxHeight: screenHeight*0.18, overflow: 'scroll' }}
                  scrollEnabled={length > 5}
                  nestedScrollEnabled={true}
                  bounces={false}
                  contentContainerStyle={{ width: '100%' }}
                >
          <View style={{ width: isMobile ? 300 : 590 }}>
            <View style={[styles.tableRow, styles.tableHeader] as ViewStyle[]}>
              <Text style={[styles.tableCell_admin, styles.tableHeaderText, { width: isMobile ? 100 : 200 }]}>Course No</Text>
              <Text style={[styles.tableCell_admin, styles.tableHeaderText, { width: isMobile ? 200 : 450 }]}>Course Name</Text>
            </View>
            {filteredCourses.length > 0 ? (
              filteredCourses.map((course, index) => (
                <View
                  key={index}
                  style={[styles.tableRow, index % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd] as ViewStyle[]}
                >
                  <Text style={[styles.tableCell_admin, { width: isMobile ? 100 : 200,  }]}>
                    {course.CourseId}
                  </Text>
                  <Text style={[styles.tableCell_admin, { width: isMobile ? 200 : 450,}]}>
                    {course.CourseName}
                  </Text>
                </View>
              ))
            ) : (
              <View style={styles.tableRow as ViewStyle}>
                <Text style={[styles.tableCell_admin, { minWidth: isMobile ? 300 : 550,  }]}>
                  No courses available
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      {/* </ScrollView> */}
      </View>


      
    </View>
  );

  // Render session dropdown, allocate faculty button, and courses assigned table
  const renderAssignedFacultyTable = () => (
     <View style={[styles.tableContainer_admin, {height: screenHeight*0.5 , width:screenWidth*0.4} ] as ViewStyle[]}
        // onLayout={handleContainersLayout} 
         >
      <View style={styles.lectureHeaderContainer_admin}>
        
        {/* <View style={styles.placeholderView} /> */}
        <Text style={[styles.lectureHeaderText_admin]}>
          Faculty Assigned
        </Text>

        <TooltipWrapper tooltipText="Add a new faculty">
        <TouchableOpacity
          accessible={true}
          accessibilityLabel="Allocate Faculty"
          accessibilityRole="button"
          style={styles.addLectureButton}
          onPress={handleAllocateFaculty}
        >
            
          <Image source={images.plusCircle} style={styles.addLectureIcon} />
          <Text style={styles.addLectureButtonText}> Allocate Faculty </Text>
         </TouchableOpacity>    
      </TooltipWrapper> 
      </View> 
      
      
      
      <View style={[styles.dropdownContainer, isMobile && { flexDirection: 'column', alignItems: 'center' }] as ViewStyle[]}>
        <View style={[styles.dropdownWrapper, isMobile && { width: '100%', marginBottom: 10 }] as ViewStyle[]}>
          <Text style={[styles.dropdownLabel, { fontSize: isMobile ? 14 : 16 }]}>Select Program:</Text>
          <Picker
            selectedValue={selectedAssignedProgram}
            style={[styles.dropdown, { width: isMobile ? '100%' : 250 }]}
            onValueChange={(itemValue) => setSelectedAssignedProgram(itemValue)}
            itemStyle={styles.pickerItem} // Apply custom item style
          >
            <Picker.Item label="All Programs" value="" />
            {centralDataAdmin.programs.map((program) => (
              <Picker.Item key={program.ProgramId} label={program.ProgramName} value={program.ProgramId.toString()} />
            ))}
          </Picker>
        </View>
        <View style={[styles.dropdownWrapper, isMobile && { width: '100%', marginBottom: 10 }] as ViewStyle[]}>
          <Text style={[styles.dropdownLabel, { fontSize: isMobile ? 14 : 16 }]}>Select Session:</Text>
          <Picker
            selectedValue={selectedAssignedSession}
            style={[styles.dropdown, { width: isMobile ? '100%' : 250 }]}
            onValueChange={(itemValue) => setSelectedAssignedSession(itemValue)}
            itemStyle={styles.pickerItem} // Apply custom item style
          >
            <Picker.Item label="All Sessions" value="" />
            {availableAssignedSessions.map((session) => (
              <Picker.Item key={session.Session_ID} label={session.Session_Name} value={session.Session_ID.toString()} />
            ))}
          </Picker>
        </View>
      </View>

      <View style={[styles.tableWrapper_admin, ]}> 
        {/* <ScrollView style={{ flex: 1 }}> */}

        
        <ScrollView
                  style={{ maxHeight: screenHeight*0.18, overflow: 'scroll' }}
            
                  nestedScrollEnabled={true}
                  bounces={false}
                  contentContainerStyle={{ width: '100%' }}
                >
          <View style={{ width: isMobile ? 300 : 590 }}>
            <View style={[styles.tableRow, styles.tableHeader] as ViewStyle[]}>
              <Text style={[styles.tableCell_admin, styles.tableHeaderText, { width: isMobile ? 100 : 450 }]}>Course Name</Text>
              <Text style={[styles.tableCell_admin, styles.tableHeaderText, { width: isMobile ? 200 : 450 }]}>Teacher Name</Text>
            </View>
            {filteredAssignedCourses.length > 0 ? (
              filteredAssignedCourses.map((course, index) => (
                <View
                  key={index}
                  style={[styles.tableRow, index % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd] as ViewStyle[]}
                >
                  <Text style={[styles.tableCell_admin, { width: isMobile ? 100 : 450, }]}>
                    {course.CourseName}
                  </Text>
                  <Text style={[styles.tableCell_admin, { width: isMobile ? 200 : 450,}]}>
                    {course.TeacherName || 'Unassigned'}
                  </Text>
                </View>
              ))
            ) : (
              <View style={styles.tableRow as ViewStyle}>
                <Text style={[styles.tableCell_admin, { minWidth: isMobile ? 300 : 590,}]}>
                  No courses assigned
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </View>
  );

    // Fetch token and initialize data
  useEffect(() => {
    const initialize = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('authToken');
        if (storedToken) {
          setToken(storedToken);
        } else if (userData?.token) {
          setToken(userData.token);
          await AsyncStorage.setItem('authToken', userData.token);
        }

        if (userData?.isHOD === false) {
          Alert.alert('Access Denied', 'You are not authorized to access the HOD Dashboard.', [
            { text: 'OK', onPress: () => navigation.navigate('TeacherLogin') },
          ]);
          return;
        }

      // // // Set static data
    //   // setFaculty(staticFaculty);
     //   setAnnouncements(staticAnnouncements);

     //it is called to load data

      } catch (error) {
        console.error('Error initializing:', error);
        Alert.alert('Error', 'Failed to initialize dashboard.');
      }
    };

    initialize();
  }, [userData]);




  const [stats, setStats] = useState<{ faculty: number; courses: number; students: number }>({ faculty: 0, courses: 0, students: 0 });


const [faculty, setFaculty] = useState<FacultyInterface[]>([]);
// const [selectedProgram, setSelectedProgram] = useState<number>(-1);
// const [designation, setDesignation] = useState<string>('');
// const [programs, setPrograms] = useState<any[]>([]); // You may define a Program interface here later




const fetchFaculty = async () => {
  try {
    const userInfo = await AsyncStorage.getItem('userInfo');
    const parsed = JSON.parse(userInfo || '{}');
    const token = await AsyncStorage.getItem('token');


    // //Check if using static data
    // if (config.WorkingMode === 'StaticData') {
    //   const staticFaculty: FacultyInterface[] = [
    //     {
    //       TeacherId: 1,
    //       FullName: 'Dr. Ayesha Khan',
    //       Designation: 'Assistant Professor',
    //       Email: 'ayesha@example.com',
    //       Phone: '0300-1234567',
    //       UserId: 101
    //     },
    //     {
    //       TeacherId: 2,
    //       FullName: 'Mr. Imran Haider',
    //       Designation: 'Lecturer',
    //       Email: 'imran@example.com',
    //       Phone: '0321-9876543',
    //       UserId: 102
    //     }
    //   ];

    //   setFaculty(staticFaculty);
    //   return;
    // }

    //Real API call
    const response = await fetch(
      `${config.BASE_URL}/api/Dashboard/GetFacultySummary?programId=${selectedProgram}&designation=${designation}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const json = await response.json();

    console.log(json);
    
    if (json.success && Array.isArray(json.data)) {
      // const mappedFaculty: FacultyInterface[] = json.data.map((item: any) => ({
      //   TeacherId: item.teacherId,
      //   FullName: item.fullName,
      //   Designation: item.designation,
      //   Email: item.email,
      //   Phone: item.phone,
      //   UserId: item.userId,
      // }));

       const mappedFaculty: FacultyInterface[] = json.data.map((item: any) => ({
          TeacherId: item.teacherId,
          FullName: item.fullName,
          Designation: item.designation,
          Email: item.email,
          Phone: item.phone,
          UserId: item.userId,
          Status: item.status || 'Active',
          isViewed: item.isViewed || 0,
        }));

      setFaculty(mappedFaculty);
    } else {
      Alert.alert('Error', json.message || 'Unexpected response from server.');
    }
  } catch (err) {
    console.error('Error loading faculty:', err);
    Alert.alert('Error', 'Failed to load faculty list.');
  }
};



 




// Define additional state for filtering (add these to your component's state declarations)
const [selectedFacultyProgram, setSelectedFacultyProgram] = useState<string>('-1');
const [selectedFacultySession, setSelectedFacultySession] = useState<string>('-1');


 //const isAllPrograms = selectedFacultyProgram === '-1';
 //const isAllSessions = selectedFacultySession === '-1';

// // Filter faculty based on selected program and session
// const filteredFaculty = faculty.filter((member) =>
//   (isAllPrograms === '-1' || member.ProgramId?.toString() === selectedFacultyProgram) &&
//   (isAllSessions === '-1' || member.SessionId?.toString() === selectedFacultySession)
// );


// // Filter faculty based on selected program and session  PREVIOUS by ALEENA updated by FK
// const filteredFaculty = faculty.filter(
//   (member) =>
//     //  (selectedFacultyProgram === '-1' || member.ProgramId?.toString() === selectedFacultyProgram ) &&
//     // (selectedFacultySession === '-1' || member.SessionId?.toString() === selectedFacultySession )
//      (!selectedFacultyProgram || member.ProgramId?.toString() === selectedFacultyProgram ) &&
//      (!selectedFacultySession || member.SessionId?.toString() === selectedFacultySession )
// );



   




useFocusEffect(
  useCallback(() => {
    const checkAuthAndFetch = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          navigation.replace('TeacherLogin');
        } else {

          setLoading(false);


  //        // // Set default program and session
   // if (centralDataAdmin.programs?.length > 0) {
   //   setSelectedFacultyProgram(centralDataAdmin.programs[0].ProgramId.toString());
   // }
   // if (centralDataAdmin.sessions?.length > 0) {
   //   setSelectedFacultySession(centralDataAdmin.sessions[0].Session_ID.toString());
   // }


          fetchFaculty(); // Call here to refresh on every focus



        }
      } catch (error) {
        console.error('Auth check error:', error);
        navigation.replace('TeacherLogin');
      }
    };

    checkAuthAndFetch();
  }, [navigation])
);
 




// Render attendance management table
const renderTableAttendanceManagement = () => (

      



    <View style={[styles.tableContainer_admin, {height: screenHeight*0.5 , width:screenWidth*0.4} ] as ViewStyle[]}
        // onLayout={handleContainersLayout} 
         >





 {/* <View style={styles.lectureHeaderContainer_admin}>
         
          <Text style={[styles.lectureHeaderText_admin]}>Faculty Management</Text>
         
        </View> */}



        {/* <View style={[styles.tableWrapper_admin]}>
          <ScrollView
            style={{ maxHeight: isMobile ? 300 : 150, overflow: 'scroll' }}
            scrollEnabled={faculty.length > 2}
            nestedScrollEnabled={true}
            bounces={false}
            contentContainerStyle={{ width: '100%' }}
          >
            <View style={{ width: isMobile ? 360 : 890 }}>
              
       <View style={[styles.tableRow, styles.tableHeader] as ViewStyle[]}>
         <Text style={[styles.tableCell, styles.tableHeaderText, { minWidth: isMobile ? 100 : 150 }]}>Teacher ID</Text>
         <Text style={[styles.tableCell, styles.tableHeaderText, { minWidth: isMobile ? 150 : 250 }]}>Full Name</Text>
         <Text style={[styles.tableCell, styles.tableHeaderText, { minWidth: isMobile ? 100 : 150 }]}>Designation</Text>
         <Text style={[styles.tableCell, styles.tableHeaderText, { minWidth: isMobile ? 100 : 150 }]}>Status</Text>
          <Text style={[styles.tableCell, styles.tableHeaderText, { minWidth: isMobile ? 100 : 150 }]}>Action</Text>
        </View>
      {faculty.length > 0 ? (
          faculty.map((member, index) => (
            <View
              key={index}
              style={[styles.tableRow, index % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd] as ViewStyle[]}
            >
              <Text style={[styles.tableCell, { minWidth: isMobile ? 100 : 150, fontSize: isMobile ? 12 : 14 }]}>
                {member.TeacherId}
              </Text>
              <Text style={[styles.tableCell, { minWidth: isMobile ? 150 : 250, fontSize: isMobile ? 12 : 14 }]}>
                {member.FullName}
              </Text>
              <Text style={[styles.tableCell, { minWidth: isMobile ? 100 : 150, fontSize: isMobile ? 12 : 14 }]}>
                {member.Designation}
              </Text>
              <Text style={[styles.tableCell, { minWidth: isMobile ? 100 : 150, fontSize: isMobile ? 12 : 14 }]}>
                (Not Available)
              </Text>
              <View
                style={[styles.tableCell, { minWidth: isMobile ? 100 : 150, flexDirection: 'row', justifyContent: 'center' }] as ViewStyle[]}
              >
                <TouchableOpacity
                  style={[styles.actionButton, styles.viewButton] as ViewStyle[]}
                  onPress={() => {
                    console.log('Navigating to TeacherPortal with facultyID:', member.TeacherId);
                    navigation.replace('TeacherPortal', {
                      facultyId: member.TeacherId,
                      isHODView: true,
                    });
                  }}
                >
                  <Text style={[styles.actionText, { fontSize: isMobile ? 12 : 14 }]}>View</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.tableRow as ViewStyle}>
            <Text style={[styles.tableCell, { minWidth: isMobile ? 450 : 700, fontSize: isMobile ? 12 : 14 }]}>
              No faculty members available
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
        
      </View> */}





    <View style={styles. lectureHeaderContainer_admin}>
        {/* <View style={styles.placeholderView} /> */}
        <Text style={[styles.lectureHeaderText_admin]}>
          Attendance Management
        </Text>


         <TouchableOpacity
          accessible={true}
          accessibilityLabel="Add New Student"
          accessibilityRole="button"
          style={styles.addLectureButton}
         disabled={true}
        >
          <Text style={styles.addLectureButtonText}>  </Text>

          {/* <Image source={images.plusCircle} style={styles.addLectureIcon} />
          <Text style={styles.addLectureButtonText}> Add Student </Text> */}
        </TouchableOpacity> 


      </View>



 <View style={[styles.dropdownContainer, isMobile && { flexDirection: 'column', alignItems: 'center' }] as ViewStyle[]}>
      <View style={[styles.dropdownWrapper, isMobile && { width: '100%', marginBottom: 10 }] as ViewStyle[]}>
        <Text style={[styles.dropdownLabel, { fontSize: isMobile ? 14 : 16 }]}>Select Program:</Text>
        <Picker
          selectedValue={selectedFacultyProgram}
          style={[styles.dropdown, { width: isMobile ? '100%' : 250 }]}
          onValueChange={(itemValue) => setSelectedFacultyProgram(itemValue)}
          enabled={false}
        >
          <Picker.Item label="All Programs" value="-1" />
          {/* {centralDataAdmin.programs.map((program) => (
            <Picker.Item
              key={program.ProgramId}
              label={program.ProgramName}
              value={program.ProgramId.toString()}
            />
          ))} */}
        </Picker>
      </View>
      <View style={[styles.dropdownWrapper, isMobile && { width: '100%', marginBottom: 10 }] as ViewStyle[]}>
        <Text style={[styles.dropdownLabel, { fontSize: isMobile ? 14 : 16 }]}>Select Session:</Text>
        <Picker
          selectedValue={selectedFacultySession}
          style={[styles.dropdown, { width: isMobile ? '100%' : 250 }]}
          onValueChange={(itemValue) => setSelectedFacultySession(itemValue)}
          itemStyle={styles.pickerItem} // Apply custom item style
          enabled={false}
        >
          <Picker.Item label="All Sessions" value="-1" />
          {/* {centralDataAdmin.sessions.map((session) => (
            <Picker.Item
              key={session.Session_ID}
              label={session.Session_Name}
              value={session.Session_ID.toString()}
            />
          ))} */}
        </Picker>
      </View>
    </View>
    {/* <ScrollView horizontal style={styles.tableWrapper_admin}> */}
<ScrollView
          // style={{ maxHeight: isMobile ? 300 : 150, overflow: 'scroll' }}
          style={{ maxHeight: screenHeight*0.18, overflow: 'scroll' }}
          scrollEnabled={announcements.length > 2}
          nestedScrollEnabled={true}
          bounces={false}
          contentContainerStyle={{ width: '100%' }}
        >
       <View style={{ width: isMobile ? 300 : 690 }}>
        <View style={[styles.tableRow, styles.tableHeader] as ViewStyle[]}>
          <Text style={[styles.tableCell_admin, styles.tableHeaderText, { minWidth: isMobile ? 100 : 150 }]}>
            {/* Teacher ID */} S#
          </Text>
          <Text style={[styles.tableCell_admin, styles.tableHeaderText, { minWidth: isMobile ? 100 : 150 }]}>
            Full Name
          </Text>
          <Text style={[styles.tableCell_admin, styles.tableHeaderText, { minWidth: isMobile ? 100 : 150 }]}>
            Designation
          </Text>
          {/* <Text style={[styles.tableCell_admin, styles.tableHeaderText, { minWidth: isMobile ? 100 : 150 }]}>
            Status
          </Text> */}
          <Text style={[styles.tableCell_admin, styles.tableHeaderText, { minWidth: isMobile ? 100 : 150 }]}>
            Action
          </Text>
        </View>
        {faculty.length > 0 ? (//filteredFaculty.length > 0 ? (
          faculty.map((member, index) => (//filteredFaculty.map((member, index) => (
            <View
              key={index}
              style={[styles.tableRow, index % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd] as ViewStyle[]}
            >
              <Text style={[styles.tableCell_admin, { minWidth: isMobile ? 100 : 150, fontSize: isMobile ? 12 : 14 }]}>
                {/* {member.TeacherId} */}
                {index + 1}.
              </Text>
              <Text style={[styles.tableCell_admin, { minWidth: isMobile ? 100 : 150, fontSize: isMobile ? 12 : 14 }]}>
                {member.FullName}
              </Text>
              <Text style={[styles.tableCell_admin, { minWidth: isMobile ? 100 : 150, fontSize: isMobile ? 12 : 14 }]}>
                {member.Designation}
              </Text>
              {/* <Text style={[styles.tableCell_admin, { minWidth: isMobile ? 100 : 150, fontSize: isMobile ? 12 : 14 }]}>
                (Not Available)
              </Text> */}
              <View
                style={[styles.tableCell_admin, { minWidth: isMobile ? 100 : 150, flexDirection: 'row', justifyContent: 'center' }] as ViewStyle[]}
              >
                <TouchableOpacity
                  style={[styles.actionButton, styles.viewButton] as ViewStyle[]}
                  onPress={() => {
                    console.log('Navigating to TeacherPortal with facultyId:', member.teacherId);
                    navigation.replace('TeacherPortal', {
                      facultyId: member.TeacherId.toString(),
                      isAdminView: true,
                    });
                  }}
                >
                  <Text style={[styles.actionText, { fontSize: isMobile ? 12 : 14 }]}>View</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.tableRow as ViewStyle}>
            <Text
              style={[styles.tableCell_admin, { minWidth: isMobile ? 600 : 400, fontSize: isMobile ? 12 : 14, textAlign: 'center' }]}
            >
              No faculty members available
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  </View>
);


const [form, setForm] = useState<{
    id: string | null;
    content_Text: string;
    content_Title: string;
    content_Type: string;
    createdBy_Name: string;
    roleId: string;
    departmentId: string;
    programId: string;
  }>({
    id: null,
    content_Text: '',
    content_Title: '',
    content_Type: 'General',
    createdBy_Name: '',
    roleId: '-1',
    departmentId: '-1',
    programId: '-1',
  });

//  const [announcements, setAnnouncements] = useState<Announcement[]>([
//     // { id: 'A1', date: 'Apr 15', content: 'Midterm exams will start on April 20.', roleId: '1', departmentId: '1', programId: '1' },
//     // { id: 'A2', date: 'Apr 18', content: 'Submit your projects by May 20.', roleId: '2', departmentId: '2', programId: '2' },
//   ]);

  const [isFormVisible, setIsFormVisible] = useState(false);

// Filter programs based on selected department
  const filteredPrograms = form.departmentId && form.departmentId !== '-1'
    ? centralDataAdmin.programs.filter(
        (program) => program.DepartmentId.toString() === form.departmentId
      )
    : centralDataAdmin.programs;

  // Reset programId when departmentId changes
  useEffect(() => {
    if (form.departmentId && form.departmentId !== '-1') {
      const validProgram = filteredPrograms.find(
        (program) => program.ProgramId.toString() === form.programId
      );
      if (!validProgram) {
        setForm((prev) => ({ ...prev, programId: '-1' }));
      }
    }
  }, [form.departmentId]);
  
const renderTableAnnouncementManagement = ({


  announcements = [],
    setAnnouncements = () => {},
    isMobile = false,
    styles = {},
    setAlertModal = () => {},
  }: {
    announcements?: Announcement[];
    setAnnouncements?: React.Dispatch<React.SetStateAction<Announcement[]>>;
    isMobile?: boolean;
    styles?: any;
    setAlertModal?: React.Dispatch<
      React.SetStateAction<{
        visible: boolean;
        type: 'success' | 'error' | 'confirmation';
        title: string;
        message: string;
        buttons: { text: string; onPress: () => void }[];
      }>
    >;
  }) => {
    const [form, setForm] = useState<{
      id: string | null;
      content_Text: string;
      content_Title: string;
      content_Type: string;
      createdBy_Name: string;
      roleId: string;
      departmentId: string;
      programId: string;
    }>({
      id: null,
      content_Text: '',
      content_Title: '',
      content_Type: 'General',
      createdBy_Name: '',
      roleId: '-1',
      departmentId: '-1',
      programId: '-1',
    });
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [viewModalVisible, setViewModalVisible] = useState(false);
    const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);

    const getProgramName = (programId?: string) => {
      if (!programId || programId === '-1') return 'All Programs';
      const program = centralDataAdmin.programs.find((p) => p.ProgramId.toString() === programId);
      return program ? program.ProgramName : 'N/A';
    };

    const getRoleName = (roleId?: string) => {
      if (!roleId || roleId === '-1') return 'All Roles';
      const role = centralDataAdmin.roles.find((r) => r.RoleId.toString() === roleId);
      return role ? role.RoleName : 'N/A';
    };

    //     const handleSaveAnnouncement = () => {
    //   if (!form.content_Text.trim() || !form.content_Title.trim() || !form.content_Type.trim()) {
    //     setAlertModal({
    //       visible: true,
    //       type: 'error',
    //       title: 'Error',
    //       message: 'Announcement title, content, and type cannot be empty.',
    //       buttons: [{ text: 'OK', onPress: () => setAlertModal((prev) => ({ ...prev, visible: false })) }],
    //     });
    //     return;
    //   }

    //   const currentDate = new Date().toLocaleDateString('en-US', {
    //     month: 'short',
    //     day: 'numeric',
    //   });

    //   if (form.id) {
    //     setAnnouncements(
    //       announcements.map((ann) =>
    //         ann.id === form.id
    //           ? {
    //               ...ann,
    //               content_Text: form.content_Text,
    //               content_Title: form.content_Title,
    //               content_Type: form.content_Type,
    //               created_date: currentDate,
    //               createdBy_Name: form.createdBy_Name,
    //               roleId: form.roleId !== '-1' ? form.roleId : undefined,
    //               departmentId: form.departmentId !== '-1' ? form.departmentId : undefined,
    //               programId: form.programId !== '-1' ? form.programId : undefined,
    //               isViewed: 0,
    //             }
    //           : ann
    //       )
    //     );
    //     setAlertModal({
    //       visible: true,
    //       type: 'success',
    //       title: 'Success',
    //       message: 'Announcement updated successfully.',
    //       buttons: [{ text: 'OK', onPress: () => setAlertModal((prev) => ({ ...prev, visible: false })) }],
    //     });
    //   } else {
    //     const newAnnouncement: Announcement = {
    //       id: `A${announcements.length + 1}`,
    //       created_date: currentDate,
    //       content_Text: form.content_Text,
    //       content_Title: form.content_Title,
    //       content_Type: form.content_Type,
    //       createdBy_Name: form.createdBy_Name,
    //       createdBy_ID: `U${announcements.length + 1}`,
    //       isViewed: 0,
    //       roleId: form.roleId !== '-1' ? form.roleId : undefined,
    //       departmentId: form.departmentId !== '-1' ? form.departmentId : undefined,
    //       programId: form.programId !== '-1' ? form.programId : undefined,
    //     };
    //     setAnnouncements([...announcements, newAnnouncement]);
    //     setAlertModal({
    //       visible: true,
    //       type: 'success',
    //       title: 'Success',
    //       message: 'Announcement created successfully.',
    //       buttons: [{ text: 'OK', onPress: () => setAlertModal((prev) => ({ ...prev, visible: false })) }],
    //     });
    //   }

    //   setForm({
    //     id: null,
    //     content_Text: '',
    //     content_Title: '',
    //     content_Type: 'General',
    //     createdBy_Name: '',
    //     roleId: '-1',
    //     departmentId: '-1',
    //     programId: '-1',
    //   });
    //   setIsFormVisible(false);
    // };

const handleSaveAnnouncement = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      console.warn('No token found'); 
      navigation.replace('TeacherLogin');
      return;
    }

    // Build payload
    const payload = {
      AnnouncementId: form.id === '-1' ? null : parseInt(form.id), 
      Content_Text: form.content_Text,
      Content_Title: form.content_Title,
      Content_Type: form.content_Type,
      CreatedBy_ID: 1,  // Make sure you have user.id in state
      CreatedBy_Name: '',// user.name,
      RoleId: form.roleId === '-1' ? null : parseInt(form.roleId),
      ProgramId: form.programId === '-1' ? null : parseInt(form.programId),
      DepartmentId: form.departmentId === '-1' ? null : parseInt(form.departmentId),
      ExpiryDate: null // If you add expiry date field later
    };

    const res = await fetch(`${config.BASE_URL}/api/announcement/Save`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) throw new Error('Failed to save announcement');

    const newId = await res.json();
    console.log('Announcement saved, id:', newId);

    setIsFormVisible(false);
    refreshAnnouncements(); // refetch list to show updated data
  } catch (err) {
    console.error('Error saving announcement', err);

    setPopupAlertType('error');
    setPopupAlertTitle('Save Failed');
    setPopupAlertMessage('Could not save announcement. Please try again.');
    setPopupAlertButtons([{ text: 'OK', onPress: () => setShowAlertPopup(false) }]);
    setShowAlertPopup(true);
  }
};

const refreshAnnouncements = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      console.warn('No token found'); 
      navigation.replace('TeacherLogin');
      return;
    }

    const res = await fetch(`${config.BASE_URL}/api/announcement/GetForUser?userId=${user.id}&roleId=${user.roleId}&programId=${user.programId}&departmentId=${user.departmentId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) throw new Error('Failed to load announcements');

    const data = await res.json();
    setAnnouncements(data); // update your list
  } catch (err) {
    console.error('Error loading announcements', err);
  }
};







    const handleEdit = (announcement: Announcement) => {
      setForm({
        id: announcement.id,
        content_Text: announcement.content_Text,
        content_Title: announcement.content_Title,
        content_Type: announcement.content_Type,
        createdBy_Name: announcement.createdBy_Name,
        roleId: announcement.roleId ?? '-1',
        departmentId: announcement.departmentId ?? '-1',
        programId: announcement.programId ?? '-1',
      });
      setIsFormVisible(true);
      setAnnouncements(
        announcements.map((ann) => (ann.id === announcement.id ? { ...ann, isViewed: 1 } : ann))
      );
    };

    const handleDelete = (id: string) => {
      setViewModalVisible(false);
      setIsFormVisible(false);
      setSelectedAnnouncement({
        id,
        created_date: '',
        content_Text: 'Are you sure you want to delete this announcement?',
        content_Title: 'Confirm Delete',
        content_Type: '',
        createdBy_Name: '',
        createdBy_ID: '',
        isViewed: 0,
      });
      setViewModalVisible(true);
    };

    const handleView = (announcement: Announcement) => {
      setSelectedAnnouncement(announcement);
      setViewModalVisible(true);
      setAnnouncements(
        announcements.map((ann) => (ann.id === announcement.id ? { ...ann, isViewed: 1 } : ann))
      );
    };

    const handleNewAnnouncement = () => {
      setForm({
        id: null,
        content_Text: '',
        content_Title: '',
        content_Type: 'General',
        createdBy_Name: '',
        roleId: '-1',
        departmentId: '-1',
        programId: '-1',
      });
      setIsFormVisible(true);
    };

    const modalButtons = [
      {
        text: 'Save',
        onPress: handleSaveAnnouncement,
        style: [styles.actionButton, styles.saveButton],
        textStyle: [styles.buttonText],
      },
      {
        text: 'Cancel',
        onPress: () => {
          setForm({
            id: null,
            content_Text: '',
            content_Title: '',
            content_Type: 'General',
            createdBy_Name: '',
            roleId: '-1',
            departmentId: '-1',
            programId: '-1',
          });
          setIsFormVisible(false);
        },
        style: [styles.actionButton, styles.closeButton],
        textStyle: [styles.buttonText],
      },
    ];

    const deleteModalButtons = [
      {
        text: 'Delete',
        onPress: () => {
          if (selectedAnnouncement) {
            setAnnouncements(announcements.filter((ann) => ann.id !== selectedAnnouncement.id));
            setAlertModal({
              visible: true,
              type: 'success',
              title: 'Success',
              message: 'Announcement deleted successfully.',
              buttons: [{ text: 'OK', onPress: () => setAlertModal((prev) => ({ ...prev, visible: false })) }],
            });
          }
          setViewModalVisible(false);
          setSelectedAnnouncement(null);
        },
        style: [styles.actionButton, styles.deleteButton],
        textStyle: [styles.buttonText],
      },
      {
        text: 'Cancel',
        onPress: () => {
          setViewModalVisible(false);
          setSelectedAnnouncement(null);
        },
        style: [styles.actionButton, styles.closeButton],
        textStyle: [styles.buttonText],
      },
    ];

    const viewModalButtons = selectedAnnouncement?.content_Text.startsWith('Are you sure')
      ? deleteModalButtons
      : [
          {
            text: 'Edit',
            onPress: () => {
              if (selectedAnnouncement) {
                handleEdit(selectedAnnouncement);
                setViewModalVisible(false);
                setSelectedAnnouncement(null);
              }
            },
            style: [styles.actionButton, styles.editButtonLM, { alignSelf: 'center', minWidth: 100 }],
            textStyle: [styles.buttonText],
          },
          {
            text: 'Close',
            onPress: () => {
              setViewModalVisible(false);
              setSelectedAnnouncement(null);
            },
            style: [styles.actionButton, styles.closeButton, { alignSelf: 'center', minWidth: 100 }],
            textStyle: [styles.buttonText],
          },
        ];

    return (
        <View style={[styles.tableContainer_admin, {height: screenHeight*0.5 , width:screenWidth*0.4} ] as ViewStyle[]}
        // onLayout={handleContainersLayout} 
         >
        <View style={styles.lectureHeaderContainer_admin}>
          <View style={styles.placeholderView} />
          <Text style={[styles.lectureHeaderText_admin]}>Announcement Management</Text>
          <TouchableOpacity
            accessible={true}
            accessibilityLabel="Add New Announcement"
            accessibilityRole="button"
            style={styles.addLectureButton}
            // onPress={handleNewSession}    
            onPress={handleNewAnnouncement}   //{handleAddAnnouncement}
          >
            <Image source={images.plusCircle} style={styles.addLectureIcon} />
            <Text style={styles.addLectureButtonText}>New Announcement</Text>
          </TouchableOpacity>
        </View>


 <View style={[styles.dropdownContainer, isMobile && { flexDirection: 'column', alignItems: 'center' }] as ViewStyle[]}>
       <View style={[styles.dropdownWrapper, isMobile && { width: '50%' }]}>
            <Text style={[styles.dropdownLabel, { fontSize: isMobile ? 14 : 16 }]}>Select Department:</Text>
            <Picker
              selectedValue={form.departmentId}
              style={[styles.dropdown, { width: isMobile ? '100%' : 250 }]}
              onValueChange={(itemValue) => setForm({ ...form, departmentId: itemValue, programId: '-1' })}
              itemStyle={styles.pickerItem} // Apply custom item style
              disabled={true}
            >
              <Picker.Item label="All Departments" value="-1" />
              {/* {centralDataAdmin.departments.map((department) => (
                <Picker.Item key={department.DepartmentId} label={department.DepartmentName} value={department.DepartmentId.toString()} />
              ))} */}
            </Picker>
          </View>

        

      {/* <View style={[styles.dropdownWrapper, isMobile && { width: '100%', marginBottom: 10 }] as ViewStyle[]}>
        <Text style={[styles.dropdownLabel, { fontSize: isMobile ? 14 : 16 }]}>Select Session:</Text>
        <Picker
          selectedValue={selectedFacultySession}
          style={[styles.dropdown, { width: isMobile ? '100%' : 250 }]}
          onValueChange={(itemValue) => setSelectedFacultySession(itemValue)}
          itemStyle={styles.pickerItem} // Apply custom item style
          enabled={false}
        >
          <Picker.Item label="All Sessions" value="-1" />
         
        </Picker>
      </View> */}
    </View>





        <View style={[styles.tableWrapper_admin]}>
          <ScrollView
            // style={{ maxHeight: isMobile ? 300 : 150, overflow: 'scroll' }}
            style={{ maxHeight: screenHeight*0.18, overflow: 'scroll' }}
            scrollEnabled={announcements.length > 2}
            nestedScrollEnabled={true}
            bounces={false}
            contentContainerStyle={{ width: '100%' }}
          >
            <View style={{ width: isMobile ? 300 : 590 }}>
              <View style={[styles.tableRow, styles.tableHeader] as ViewStyle[]}>
                <Text style={[styles.tableCell_admin, styles.tableHeaderText, { width: isMobile ? 60 : 100 }]}>Date</Text>
                <Text style={[styles.tableCell_admin, styles.tableHeaderText, { width: isMobile ? 100 : 200 }]}>Announcement</Text>
                <Text style={[styles.tableCell_admin, styles.tableHeaderText, { width: isMobile ? 60 : 100 }]}>Created For</Text>
                <Text style={[styles.tableCell_admin, styles.tableHeaderText, { width: isMobile ? 80 : 190, textAlign: 'center' }]}>Actions</Text>
              </View>



{announcements.map(item => (
  <View key={item.AnnouncementId}>
    <Text>{item.Content_Title}</Text>
    <Button title="Edit" onPress={() => handleEditAnnouncement(item)} />
    <Button title="Delete" onPress={() => deleteAnnouncement(item.AnnouncementId)} />
  </View>
))}



              {announcements.length > 0 ? (
                announcements.map((announcement, index) => (
                  <View
                    key={index}
                    style={[
                      styles.tableRow,
                      index % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd,
                      announcement.isViewed === 0 && styles.unreadRow,
                    ] as ViewStyle[]}
                  >
                    <Text
                      style={[
                        styles.tableCell_admin,
                        { width: isMobile ? 60 : 100, color: announcement.isViewed === 0 ? '#f44336' : '#333' },
                      ]}
                      accessible={true}
                      accessibilityLabel={`Date ${announcement.created_date}`}
                    >
                      {announcement.created_date}
                    </Text>
                    <Text
                      style={[
                        styles.tableCell_admin,
                        { width: isMobile ? 100 : 200, color: announcement.isViewed === 0 ? '#f44336' : '#333' },
                      ]}
                      accessible={true}
                      accessibilityLabel={`Announcement ${announcement.content_Text}`}
                      numberOfLines={3}
                      ellipsizeMode="tail"
                    >
                      {announcement.content_Text}
                    </Text>
                    <Text
                      style={[
                        styles.tableCell_admin,
                        { width: isMobile ? 60 : 100, color: announcement.isViewed === 0 ? '#f44336' : '#333' },
                      ]}
                      accessible={true}
                      accessibilityLabel={`Created for ${getProgramName(announcement.programId)} - ${getRoleName(announcement.roleId)}`}
                    >
                      {`${getProgramName(announcement.programId)} - ${getRoleName(announcement.roleId)}`}
                    </Text>
                    <View
                      style={[styles.tableCell_admin, { width: isMobile ? 80 : 190, flexDirection: 'row', justifyContent: 'center' }]}
                      accessible={true}
                      accessibilityLabel="Actions"
                    >
                      <TouchableOpacity
                        style={[styles.actionButtonLM, { padding: isMobile ? 6 : 6, backgroundColor: 'lightgreen' }]}
                        onPress={() => handleView(announcement)}
                      >
                        <Image source={images.view} style={styles.pencilIconLM} onError={() => console.warn('Failed to load view icon')} />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.actionButtonLM, styles.editButtonLM, { padding: isMobile ? 6 : 6, marginRight: 4 }]}
                        onPress={() => handleEdit(announcement)}
                      >
                        <Image source={images.pencil} style={styles.pencilIconLM} />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.actionButtonLM, { backgroundColor: '#ff0800' }]}
                        onPress={() => handleDelete(announcement.id)}
                      >
                        <Image source={images.deleteIcon} style={styles.pencilIconLM} onError={() => console.warn('Failed to load delete icon')} />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))
              ) : (
                <View style={styles.tableRow as ViewStyle}>
                  <Text style={[styles.tableCell_admin, { minWidth: isMobile ? 300 : 590, textAlign: 'center' }]}>
                    No announcements available
                  </Text>
                </View>
              )}
            </View>
          </ScrollView>
        </View>























        <CustomModal
  visible={isFormVisible}
  onRequestClose={() => setIsFormVisible(false)}
  title={form.id ? 'Edit Announcement' : 'Create Announcement'}
  buttons={modalButtons}
  type="form"
  isMobile={isMobile}
>
  {/* Filter programs based on selected department */}
  {(() => {
    const filteredPrograms = form.departmentId === '-1'
      ? centralDataAdmin.programs
      : centralDataAdmin.programs.filter(program => program.DepartmentId === parseInt(form.departmentId));
    
    return (
      <>
        <View style={[styles.pickerRow, { flexDirection:isMobile? 'column': 'row', marginBottom: 15 }]}>
          <View style={[styles.dropdownWrapper, isMobile && { width: '100%' }]}>
            <Text style={[styles.dropdownLabel, { fontSize: isMobile ? 14 : 16 }]}>Select Department:</Text>
            <Picker
              selectedValue={form.departmentId}
              style={[styles.dropdown, { width: isMobile ? '100%' : '100%' }]}
              onValueChange={(itemValue) => setForm({ ...form, departmentId: itemValue, programId: '-1' })}
              itemStyle={styles.pickerItem} // Apply custom item style
            >
              <Picker.Item label="All Departments" value="-1" />
              {centralDataAdmin.departments.map((department) => (
                <Picker.Item key={department.DepartmentId} label={department.DepartmentName} value={department.DepartmentId.toString()} />
              ))}
            </Picker>
          </View>
          <View style={[styles.dropdownWrapper, isMobile && { width: '100%' }]}>
            <Text style={[styles.dropdownLabel, { fontSize: isMobile ? 14 : 16 }]}>Select Program:</Text>
            <Picker
              selectedValue={form.programId}
              style={[styles.dropdown, { width: isMobile ? '100%' : '100%' }]}
              onValueChange={(itemValue) => setForm({ ...form, programId: itemValue })}
              itemStyle={styles.pickerItem} // Apply custom item style
            >
              <Picker.Item label="All Programs" value="-1" />
              {filteredPrograms.length > 0 ? (
                filteredPrograms.map((program) => (
                  <Picker.Item key={program.ProgramId} label={program.ProgramName} value={program.ProgramId.toString()} />
                ))
              ) : (
                <Picker.Item label="No Programs Available" value="-1" />
              )}
            </Picker>
          </View>
          <View style={[styles.dropdownWrapper, isMobile && { width: '100%' }]}>
            <Text style={[styles.dropdownLabel, { fontSize: isMobile ? 14 : 16 }]}>Select Role:</Text>
            <Picker
              selectedValue={form.roleId}
              style={[styles.dropdown, { width: isMobile ? '100%' : '100%' }]}
              onValueChange={(itemValue) => setForm({ ...form, roleId: itemValue })}
              itemStyle={styles.pickerItem} // Apply custom item style
            >
              <Picker.Item label="All Roles" value="-1" />
              {centralDataAdmin.roles.map((role) => (
                <Picker.Item key={role.RoleId} label={role.RoleName} value={role.RoleId.toString()} />
              ))}
            </Picker>
          </View>
        </View>
        <View style={[styles.pickerRow, { flexDirection: 'row', marginBottom: 15 }]}>
          <View style={[styles.dropdownWrapper, isMobile && { width: '100%' }]}>
            <Text style={[styles.dropdownLabel, { fontSize: isMobile ? 14 : 16 }]}>Select Type:</Text>
            <Picker
              selectedValue={form.content_Type}
              style={[styles.dropdown, { width: isMobile ? '100%' : '100%' }]}
              onValueChange={(itemValue) => setForm({ ...form, content_Type: itemValue })}
              itemStyle={styles.pickerItem} // Apply custom item style
            >
              <Picker.Item label="General" value="General" />
              <Picker.Item label="News" value="News" />
              <Picker.Item label="Info" value="Info" />
            </Picker>
          </View>
        </View>
        <TextInput
          style={[styles.input, { fontSize: isMobile ? 12 : 14 }]}
          placeholder="Enter announcement title"
          value={form.content_Title}
          onChangeText={(text) => setForm({ ...form, content_Title: text })}
        />
        <TextInput
          style={[styles.input, { fontSize: isMobile ? 12 : 14, height: 100 }]}
          placeholder="Enter announcement content"
          value={form.content_Text}
          onChangeText={(text) => setForm({ ...form, content_Text: text })}
          multiline
          numberOfLines={4}
        />
      </>
    );
  })()}
</CustomModal>
        <CustomModal
          visible={viewModalVisible}
          onRequestClose={() => {
            setViewModalVisible(false);
            setSelectedAnnouncement(null);
          }}
          title={selectedAnnouncement?.content_Title || 'Announcement Details'}
          buttons={viewModalButtons}
          type={selectedAnnouncement?.content_Text.startsWith('Are you sure') ? 'alert' : 'form'}
          alertMessage={selectedAnnouncement?.content_Text.startsWith('Are you sure') ? selectedAnnouncement.content_Text : undefined}
          isMobile={isMobile}
        >
          {selectedAnnouncement && !selectedAnnouncement.content_Text.startsWith('Are you sure') && (
            <View style={styles.tableWrapper_admin}>
              <View style={{ width: '100%' }}>
                <View style={[styles.tableRow, styles.tableHeader] as ViewStyle[]}>
                  <Text style={[styles.tableCell_admin, styles.tableHeaderText, { width: isMobile ? 100 : 150 }]}>Field</Text>
                  <Text style={[styles.tableCell_admin, styles.tableHeaderText, { width: isMobile ? 200 : 440 }]}>Details</Text>
                </View>
                <View style={[styles.tableRow, styles.tableRowEven] as ViewStyle[]}>
                  <Text style={[styles.tableCell_admin, { width: isMobile ? 100 : 150, fontWeight: 'bold' }]}>ID</Text>
                  <Text style={[styles.tableCell_admin, { width: isMobile ? 200 : 440 }]}>{selectedAnnouncement.id}</Text>
                </View>
                <View style={[styles.tableRow, styles.tableRowOdd] as ViewStyle[]}>
                  <Text style={[styles.tableCell_admin, { width: isMobile ? 100 : 150, fontWeight: 'bold' }]}>Title</Text>
                  <Text style={[styles.tableCell_admin, { width: isMobile ? 200 : 440 }]}>{selectedAnnouncement.content_Title}</Text>
                </View>
                <View style={[styles.tableRow, styles.tableRowEven] as ViewStyle[]}>
                  <Text style={[styles.tableCell_admin, { width: isMobile ? 100 : 150, fontWeight: 'bold' }]}>Content</Text>
                  <Text style={[styles.tableCell_admin, { width: isMobile ? 200 : 440 }]}>{selectedAnnouncement.content_Text}</Text>
                </View>
                <View style={[styles.tableRow, styles.tableRowOdd] as ViewStyle[]}>
                  <Text style={[styles.tableCell_admin, { width: isMobile ? 100 : 150, fontWeight: 'bold' }]}>Type</Text>
                  <Text style={[styles.tableCell_admin, { width: isMobile ? 200 : 440 }]}>{selectedAnnouncement.content_Type}</Text>
                </View>
                <View style={[styles.tableRow, styles.tableRowEven] as ViewStyle[]}>
                  <Text style={[styles.tableCell_admin, { width: isMobile ? 100 : 150, fontWeight: 'bold' }]}>Created By</Text>
                  <Text style={[styles.tableCell_admin, { width: isMobile ? 200 : 440 }]}>{selectedAnnouncement.createdBy_Name}</Text>
                </View>
                <View style={[styles.tableRow, styles.tableRowOdd] as ViewStyle[]}>
                  <Text style={[styles.tableCell_admin, { width: isMobile ? 100 : 150, fontWeight: 'bold' }]}>Program</Text>
                  <Text style={[styles.tableCell_admin, { width: isMobile ? 200 : 440 }]}>{getProgramName(selectedAnnouncement.programId)}</Text>
                </View>
                <View style={[styles.tableRow, styles.tableRowEven] as ViewStyle[]}>
                  <Text style={[styles.tableCell_admin, { width: isMobile ? 100 : 150, fontWeight: 'bold' }]}>Role</Text>
                  <Text style={[styles.tableCell_admin, { width: isMobile ? 200 : 440 }]}>{getRoleName(selectedAnnouncement.roleId)}</Text>
                </View>
                <View style={[styles.tableRow, styles.tableRowOdd] as ViewStyle[]}>
                  <Text style={[styles.tableCell_admin, { width: isMobile ? 100 : 150, fontWeight: 'bold' }]}>Date</Text>
                  <Text style={[styles.tableCell_admin, { width: isMobile ? 200 : 440 }]}>{selectedAnnouncement.created_date}</Text>
                </View>
              </View>
            </View>
          )}
        </CustomModal>
      </View>
    );
  };


const isSuperAdmin = getGlobal('userRole') === 'SuperAdmin';

return (
  <View style={styles.container as ViewStyle}>
    {renderNewSessionModal()}
    {renderFacultyAllocationModal()}
    {isMobile ? (
      <ScrollView contentContainerStyle={[styles.scrollArea, { paddingBottom: 50 }] as ViewStyle[]}>
        {/* {renderHeader()} */}
        <Header isMobile={isMobile} />


         
     
        {isSuperAdmin && (
      <>
        {renderCoursesTable()}
        {renderAssignedFacultyTable()}
      </>
    )}
     
      

        {renderTableAttendanceManagement()}
        {renderTableAnnouncementManagement({ announcements, setAnnouncements, isMobile, styles, setAlertModal })}
      </ScrollView>
    ) : (
      <>
        {/* {renderHeader()} */}
        <Header isMobile={isMobile} />
        <ScrollView contentContainerStyle={[styles.scrollArea, { paddingBottom: 30 }] as ViewStyle[]}>

            {isSuperAdmin && (
           <>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between',gap:isMobile?10:20 } as ViewStyle}>
            
            {renderCoursesTable()}
            {renderAssignedFacultyTable()}
         
          </View>
         </>
        )}
          

          <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent:'space-between',gap:isMobile?10:20 } as ViewStyle}>
            {renderTableAttendanceManagement()}
            {renderTableAnnouncementManagement({ announcements, setAnnouncements, isMobile, styles, setAlertModal })}
          </View>
        </ScrollView>
      </>
    )}
     <AlertModalPopUp
        visible={alertModal.visible}
        type={alertModal.type}
        title={alertModal.title}
        message={alertModal.message}
        buttons={alertModal.buttons}
        />
  </View>
);
};



// Additional styles for the modal


export default AdminDashboard;