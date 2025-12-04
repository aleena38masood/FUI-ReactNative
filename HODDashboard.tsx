

// @ts-nocheck
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  useWindowDimensions,
  TextInput,
  Picker,
  Alert,
  Modal,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useNavigationState, useRoute } from '@react-navigation/native';
import type { ViewStyle } from 'react-native';
import type { RouteProp } from '@react-navigation/native';
import images from '@/assets/images';
import { getGlobal, setGlobal } from '@/constants/Globals';
import config from '@/constants/config'; // adjust the path based on location
import Header from '@/components/HeaderComponent';
import MenuBar from '../../components/MenuBar'; // Adjust path as needed

import SubMenuBar from '@/components/SubMenuBar'; // Adjust path if necessary
//import images from '@/constants/images'; // Your image icons
import AlertModalPopUp from '@/components/AlertModalPopUp';
import CustomModal from '@/components/CustomModal';
import getStyles from '../../assets/TeacherPortalStyles';
import TooltipWrapper from '@/assets/TooltipWrapper';
import centralDataAdmin from '@/components/centralDataAdmin';

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



// Define TypeScript interface for userData
interface UserData {
  fullName?: string;
  isHOD?: boolean;
  facultyCount?: number;
  studentCount?: number;
  token?: string;
}

// Define navigation parameter types
type RootStackParamList = {
  HODDashboard: { userData?: UserData };
  FacultyManagement: undefined;
  Announcements: undefined;
  Profile: undefined;
  TeacherLogin: undefined;
  TeacherPortal: { facultyId: string; isHODView?: boolean;isAdminView?: boolean };
};

const HODDashboard = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RootStackParamList, 'HODDashboard'>>();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const styles = getStyles(isMobile);

  // Get user data from navigation params
  const { userData } = route.params || {};
  const [token, setToken] = useState<string | null>(null);
 const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [faculty, setFaculty] = useState<FacultyInterface[]>([]);
  const [selectedProgram, setSelectedProgram] = useState<number>(-1);
  const [designation, setDesignation] = useState<string>('');
  const [programs, setPrograms] = useState<any[]>([]);
  const [stats, setStats] = useState<{ faculty: number; courses: number; students: number }>({
    faculty: 0,
    courses: 0,
    students: 0,
  });


 const [showAlertPopup, setShowAlertPopup] = useState(false);
   const [popupAlertType, setPopupAlertType] = useState('success');
   const [popupAlertTitle, setPopupAlertTitle] = useState('');
   const [popupAlertMessage, setPopupAlertMessage] = useState('');
   const [popupAlertButtons, setPopupAlertButtons] = useState([{ text: 'CONTINUE', onPress: () => {} }]);




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

        setAnnouncements(staticAnnouncements);
      } catch (error) {
        console.error('Error initializing:', error);
        Alert.alert('Error', 'Failed to initialize dashboard.');
      }
    };

    initialize();
  }, [userData]);

  const fetchFaculty = async () => {
    try {
      const userInfo = await AsyncStorage.getItem('userInfo');
      const parsed = JSON.parse(userInfo || '{}');
      const token = await AsyncStorage.getItem('token');

      // if (config.WorkingMode === 'StaticData') {
      //   const staticFaculty: FacultyInterface[] = [
      //     {
      //       TeacherId: 1,
      //       FullName: 'Dr. Ayesha Khan',
      //       Designation: 'Assistant Professor',
      //       Email: 'ayesha@example.com',
      //       Phone: '0300-1234567',
      //       UserId: 101,
      //       Status: 'Active',
      //       isViewed: 0,
      //     },
      //     {
      //       TeacherId: 2,
      //       FullName: 'Mr. Imran Haider',
      //       Designation: 'Lecturer',
      //       Email: 'imran@example.com',
      //       Phone: '0321-9876543',
      //       UserId: 102,
      //       Status: 'Active',
      //       isViewed: 0,
      //     },
      //   ];
      //   setFaculty(staticFaculty);
      //   return;
      // }

      const response = await fetch(
        `${config.BASE_URL}/api/Dashboard/GetFacultySummary?programId=${selectedProgram}&designation=${designation}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const json = await response.json();

      if (json.success && Array.isArray(json.data)) {
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

  const loadDashboardStats = async () => {
    // if (config.WorkingMode === 'StaticData') {
    //   setStats({ faculty: 2, courses: 3, students: 350 });
    //   return;
    // }

     const token = await AsyncStorage.getItem('token');
          if (!token) {
            console.warn('No access token found, redirecting to login');
            navigation.replace('TeacherLogin');
            return;
          }



    const response = await fetch(`${config.BASE_URL}/api/Dashboard/GetDashboardStats`, {
      headers: { Authorization: `Bearer ${token}` },
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


    //navigation.navigate('TeacherLogin');
  } 
  else if (!response.ok) {
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


     const json = await response.json();

//     if (!json.ok) {
//        Alert.alert('Failed to fetch STATS', 'Failed to load stats for faculty.');
//   //throw new Error('Failed to fetch: ' + response.status);
// }
    if (json && json.facultyCount !== undefined && json.success) {
      setStats({
        faculty: json.facultyCount,
        courses: json.courseCount,
        students: json.studentCount,
      });
    } else {
      console.warn('Invalid stats response', json);
    }


  }




//     //Check Json Valid response | Fk Check Json
//     if (!response.ok) {
//   throw new Error(`HTTP error! Status: ${response.status}`);
// }

// const contentType = response.headers.get('content-type');
// if (!contentType || !contentType.includes('application/json')) {
//   throw new Error('Response is not valid JSON');
// }



   
  };

  useEffect(() => {
    const init = async () => {
      await fetchFaculty();
      await loadDashboardStats();
    };
    init();
  }, []);

  // const renderHeader = () => (
  //   <>
  //     <View style={[styles.topBar, { height: isMobile ? 20 : 25 }] as ViewStyle[]}>
  //       <Text style={[styles.welcomeText, { fontSize: isMobile ? 12 : 14 }]}>
  //         Welcome: {userData?.fullName || ' to FUI Faculty Portal'}
  //       </Text>
  //     </View> 
  //      <View style={styles.header as ViewStyle}>
  //       <View style={[styles.contentRow, isMobile && { flexDirection: 'column', alignItems: 'center' }] as ViewStyle[]}>
  //         <View style={[styles.logoContainer, isMobile && { width: '100%', marginBottom: 10 }] as ViewStyle[]}>
  //           <Image source={images.logo} style={[styles.logo, { width: isMobile ? 60 : 75, height: isMobile ? 60 : 75 }]} />
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

  const renderSummaryCard = () => (
    <View style={[styles.tableContainer, { width: isMobile ? '90%' : '37%' }] as ViewStyle[]}>
      <Text style={[styles.heading, { fontSize: isMobile ? 16 : 18 }]}>Department Summary</Text>
      <View style={styles.cardContent as ViewStyle}>
        <Text style={[styles.cardText, { fontSize: isMobile ? 12 : 14 }]}>Faculty: {stats.faculty}</Text>
        <Text style={[styles.cardText, { fontSize: isMobile ? 12 : 14 }]}>Courses: {stats.courses}</Text>
        <Text style={[styles.cardText, { fontSize: isMobile ? 12 : 14 }]}>Students: {stats.students}</Text>
      </View>
    </View>
  );

  const renderFacultyTable = ({
    faculty = [],
    isMobile = false,
    styles = {},
    navigation,
  }: {
    faculty?: FacultyInterface[] | null;
    isMobile?: boolean;
    styles?: any;
    navigation?: any;
  }) => {
    const [viewModalVisible, setViewModalVisible] = useState(false);
    const [selectedFaculty, setSelectedFaculty] = useState<FacultyInterface | null>(null);

    const safeFaculty = faculty || [];

    const handleView = (member: FacultyInterface) => {
      setSelectedFaculty(member);
      setViewModalVisible(true);
    };

    const handleEdit = (member: FacultyInterface) => {
      console.log('Editing faculty member:', member.TeacherId);
    };

    const handleDelete = (teacherId: number) => {
      console.log('Deleting faculty member:', teacherId);
    };

    const viewModalButtons = [
      {
        text: 'Close',
        onPress: () => {
          setViewModalVisible(false);
          setSelectedFaculty(null);
        },
        style: [styles.actionButton, styles.closeButton, { alignSelf: 'center', minWidth: 100 }],
        textStyle: [styles.buttonText],
      },
    ];

    return (
      <View style={[styles.tableContainer_HOD] as ViewStyle[]}>
        <View style={styles.lectureHeaderContainer_admin}>
          {/* <View style={styles.placeholderView} /> */}
          <Text style={[styles.lectureHeaderText_admin]}>Faculty Management</Text>
         
        </View>
        <View style={[styles.tableWrapper_admin]}>
          <ScrollView
            style={{ maxHeight: isMobile ? 300 : 150, overflow: 'scroll' }}
            scrollEnabled={safeFaculty.length > 2}
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
                      isAdminView:false,
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
        <CustomModal
          visible={viewModalVisible}
          onRequestClose={() => {
            setViewModalVisible(false);
            setSelectedFaculty(null);
          }}
          title={selectedFaculty?.FullName || 'Faculty Details'}
          buttons={viewModalButtons}
          type="form"
          isMobile={isMobile}
        >
          {selectedFaculty && (
            <View style={styles.tableWrapper_admin}>
              <View style={{ width: '100%' }}>
                <View style={[styles.tableRow, styles.tableHeader] as ViewStyle[]}>
                  <Text style={[styles.tableCell_admin, styles.tableHeaderText, { width: isMobile ? 100 : 150 }]}>Field</Text>
                  <Text style={[styles.tableCell_admin, styles.tableHeaderText, { width: isMobile ? 200 : 440 }]}>Details</Text>
                </View>
                <View style={[styles.tableRow, styles.tableRowEven] as ViewStyle[]}>
                  <Text style={[styles.tableCell_admin, { width: isMobile ? 100 : 150, fontWeight: 'bold' }]}>Teacher ID</Text>
                  <Text style={[styles.tableCell_admin, { width: isMobile ? 200 : 440 }]}>{selectedFaculty.TeacherId}</Text>
                </View>
                <View style={[styles.tableRow, styles.tableRowOdd] as ViewStyle[]}>
                  <Text style={[styles.tableCell_admin, { width: isMobile ? 100 : 150, fontWeight: 'bold' }]}>Full Name</Text>
                  <Text style={[styles.tableCell_admin, { width: isMobile ? 200 : 440 }]}>{selectedFaculty.FullName}</Text>
                </View>
                <View style={[styles.tableRow, styles.tableRowEven] as ViewStyle[]}>
                  <Text style={[styles.tableCell_admin, { width: isMobile ? 100 : 150, fontWeight: 'bold' }]}>Designation</Text>
                  <Text style={[styles.tableCell_admin, { width: isMobile ? 200 : 440 }]}>{selectedFaculty.Designation}</Text>
                </View>
                <View style={[styles.tableRow, styles.tableRowOdd] as ViewStyle[]}>
                  <Text style={[styles.tableCell_admin, { width: isMobile ? 100 : 150, fontWeight: 'bold' }]}>Status</Text>
                  <Text style={[styles.tableCell_admin, { width: isMobile ? 200 : 440 }]}>{selectedFaculty.Status || 'Not Available'}</Text>
                </View>
                <View style={[styles.tableRow, styles.tableRowEven] as ViewStyle[]}>
                  <Text style={[styles.tableCell_admin, { width: isMobile ? 100 : 150, fontWeight: 'bold' }]}>Email</Text>
                  <Text style={[styles.tableCell_admin, { width: isMobile ? 200 : 440 }]}>{selectedFaculty.Email}</Text>
                </View>
                <View style={[styles.tableRow, styles.tableRowOdd] as ViewStyle[]}>
                  <Text style={[styles.tableCell_admin, { width: isMobile ? 100 : 150, fontWeight: 'bold' }]}>Phone</Text>
                  <Text style={[styles.tableCell_admin, { width: isMobile ? 200 : 440 }]}>{selectedFaculty.Phone}</Text>
                </View>
              </View>
            </View>
          )}
        </CustomModal>
      </View>
      </View>
    );
  };

  const renderAnnouncementsTable = ({
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

    const handleSaveAnnouncement = () => {
      if (!form.content_Text.trim() || !form.content_Title.trim() || !form.content_Type.trim()) {
        setAlertModal({
          visible: true,
          type: 'error',
          title: 'Error',
          message: 'Announcement title, content, and type cannot be empty.',
          buttons: [{ text: 'OK', onPress: () => setAlertModal((prev) => ({ ...prev, visible: false })) }],
        });
        return;
      }

      const currentDate = new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });

      if (form.id) {
        setAnnouncements(
          announcements.map((ann) =>
            ann.id === form.id
              ? {
                  ...ann,
                  content_Text: form.content_Text,
                  content_Title: form.content_Title,
                  content_Type: form.content_Type,
                  created_date: currentDate,
                  createdBy_Name: form.createdBy_Name,
                  roleId: form.roleId !== '-1' ? form.roleId : undefined,
                  departmentId: form.departmentId !== '-1' ? form.departmentId : undefined,
                  programId: form.programId !== '-1' ? form.programId : undefined,
                  isViewed: 0,
                }
              : ann
          )
        );
        setAlertModal({
          visible: true,
          type: 'success',
          title: 'Success',
          message: 'Announcement updated successfully.',
          buttons: [{ text: 'OK', onPress: () => setAlertModal((prev) => ({ ...prev, visible: false })) }],
        });
      } else {
        const newAnnouncement: Announcement = {
          id: `A${announcements.length + 1}`,
          created_date: currentDate,
          content_Text: form.content_Text,
          content_Title: form.content_Title,
          content_Type: form.content_Type,
          createdBy_Name: form.createdBy_Name,
          createdBy_ID: `U${announcements.length + 1}`,
          isViewed: 0,
          roleId: form.roleId !== '-1' ? form.roleId : undefined,
          departmentId: form.departmentId !== '-1' ? form.departmentId : undefined,
          programId: form.programId !== '-1' ? form.programId : undefined,
        };
        setAnnouncements([...announcements, newAnnouncement]);
        setAlertModal({
          visible: true,
          type: 'success',
          title: 'Success',
          message: 'Announcement created successfully.',
          buttons: [{ text: 'OK', onPress: () => setAlertModal((prev) => ({ ...prev, visible: false })) }],
        });
      }

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

    const handleNewSession = () => {
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
      <View style={[styles.tableContainer_HOD] as ViewStyle[]}>
        <View style={styles.lectureHeaderContainer_admin}>
          {/* <View style={styles.placeholderView} /> */}
          <Text style={[styles.lectureHeaderText_admin]}>Announcement Management</Text>
          <TouchableOpacity
            accessible={true}
            accessibilityLabel="Add New Announcement"
            accessibilityRole="button"
            style={styles.addLectureButton}
            onPress={handleNewSession}
          >
            <Image source={images.plusCircle} style={styles.addLectureIcon} />
            <Text style={styles.addLectureButtonText}>New Announcement</Text>
          </TouchableOpacity>
        </View>
        <View style={[styles.tableWrapper_admin]}>
          <ScrollView
            style={{ maxHeight: isMobile ? 300 : 150, overflow: 'scroll' }}
            scrollEnabled={announcements.length > 2}
            nestedScrollEnabled={true}
            bounces={false}
            contentContainerStyle={{ width: '100%' }}
          >
            <View style={{ width: isMobile ? 300 : 590 }}>
              <View style={[styles.tableRow, styles.tableHeader] as ViewStyle[]}>
                <Text style={[styles.tableCell_admin, styles.tableHeaderText, { width: isMobile ? 60 : 100 }]}>Date</Text>
                <Text style={[styles.tableCell_admin, styles.tableHeaderText, { width: isMobile ? 300 : 200 }]}>Announcement</Text>
                <Text style={[styles.tableCell_admin, styles.tableHeaderText, { width: isMobile ? 150 : 100 }]}>Created For</Text>
                <Text style={[styles.tableCell_admin, styles.tableHeaderText, { width: isMobile ? 100 : 190, textAlign: 'center' }]}>Actions</Text>
              </View>
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
        {/* <CustomModal
          visible={isFormVisible}
          onRequestClose={() => setIsFormVisible(false)}
          title={form.id ? 'Edit Announcement' : 'Create Announcement'}
          buttons={modalButtons}
          type="form"
          isMobile={isMobile}
        >
          <View style={[styles.pickerRow, { flexDirection: 'row', marginBottom: 15 }]}>
            <View style={[styles.dropdownWrapper, isMobile && { width: '100%' }]}>
              <Text style={[styles.dropdownLabel, { fontSize: isMobile ? 14 : 16 }]}>Select Department:</Text>
              <Picker
                selectedValue={form.departmentId}
                style={[styles.dropdown, { width: isMobile ? '100%' : '100%' }]}
                onValueChange={(itemValue) => setForm({ ...form, departmentId: itemValue })}
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
              >
                <Picker.Item label="All Programs" value="-1" />
                {centralDataAdmin.programs.map((program) => (
                  <Picker.Item key={program.ProgramId} label={program.ProgramName} value={program.ProgramId.toString()} />
                ))}
              </Picker>
            </View>
            <View style={[styles.dropdownWrapper, isMobile && { width: '100%' }]}>
              <Text style={[styles.dropdownLabel, { fontSize: isMobile ? 14 : 16 }]}>Select Role:</Text>
              <Picker
                selectedValue={form.roleId}
                style={[styles.dropdown, { width: isMobile ? '100%' : '100%' }]}
                onValueChange={(itemValue) => setForm({ ...form, roleId: itemValue })}
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
        </CustomModal> */}
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
        <View style={[styles.pickerRow, { flexDirection: isMobile? 'column' : 'row', marginBottom: 15 }]}>
          <View style={[styles.dropdownWrapper, isMobile && { width: '100%' }]}>
            <Text style={[styles.dropdownLabel, { fontSize: isMobile ? 14 : 16 }]}>Select Department:</Text>
            <Picker
              selectedValue={form.departmentId}
              style={[styles.dropdown, { width: isMobile ? '100%' : '100%' }]}
              onValueChange={(itemValue) => setForm({ ...form, departmentId: itemValue, programId: '-1' })}
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

  return (
    <View style={styles.container as ViewStyle}>
      {isMobile ? (
        <ScrollView contentContainerStyle={[styles.scrollArea, { paddingBottom: 50 }] as ViewStyle[]}>
          {/* {renderHeader()} */}
<Header isMobile={isMobile} />
          {renderSummaryCard()}
          <View style={{ flexDirection: isMobile? 'column': 'row', flexWrap: 'wrap', justifyContent: 'space-around' } as ViewStyle}>
            {renderFacultyTable({ faculty, isMobile, styles, navigation })}
            {renderAnnouncementsTable({ announcements, setAnnouncements, isMobile, styles, setAlertModal })}
          </View>
        </ScrollView>
      ) : (
        <>
          {/* {renderHeader()} */}
          <Header isMobile={isMobile} />
          <ScrollView contentContainerStyle={[styles.scrollArea, { paddingBottom: 30 }] as ViewStyle[]}>
            {renderSummaryCard()}
<View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around'} as ViewStyle}>
              {renderFacultyTable({ faculty, isMobile, styles, navigation })}
              {renderAnnouncementsTable({ announcements, setAnnouncements, isMobile, styles, setAlertModal })}
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

// // Updated styles
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
//     fontWeight: 14,
//   },
//   header: {
//     // backgroundColor: '#fff',
//     marginTop: 8,
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
//     color: '#fff',
//     fontWeight: 'bold',
//     textAlign: 'left',
//     marginLeft: 8,
//     marginTop: 16,
//   },
//   menuContainer: {
//     width: '50%',
//   },
//   menuGrid: {
//     flexDirection: 'row',
//     width: '100%',
//     justifyContent: 'center',
//   },
//   menuItem: {
//     backgroundColor: '#fff',
//     borderRadius: 6,
//     alignItems: 'center',
//     justifyContent: 'flex-start',
//     margin: 6,
//     marginTop: 8,
//     paddingTop: 8,
//     elevation: 2,
//   },
//   menuLabel: {
//     marginTop: 8,
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
//   scrollArea: {
//     alignItems: 'center',
//   },
//   tableContainer: {
//     backgroundColor: '#fff',
//     padding: 8,
//     borderRadius: 8,
//     elevation: 4,
//     marginTop: 8,
//     marginBottom: 2,
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
//     borderBottomWidth: 1,
//     borderBottomColor: '#e0e0e0',
//   },
//   tableRowEven: {
//     backgroundColor: '#f5f5f5',
//   },
//   tableRowOdd: {
//     backgroundColor: '#ffffff',
//   },
//   tableHeader: {
//     backgroundColor: '#e0e0e0',
//     borderBottomWidth: 2,
//     borderBottomColor: '#333',
//   },
//   tableCell: {
//     flex: 1,
//     paddingVertical: 5,
//     paddingHorizontal: 8,
//     marginTop: 2,
//     textAlign: 'center',
//     color: '#333',
//   },
//   tableHeaderText: {
//     fontWeight: 'bold',
//     color: '#333',
//     fontSize: 14,
//   },
//   actionButton: {
//     paddingVertical: 6,
//     paddingHorizontal: 12,
//     borderRadius: 4,
//     marginHorizontal: 4,
//   },
//   viewButton: {
//     backgroundColor: '#3f51b5',
//   },
//   editButton: {
//     backgroundColor: '#ff9800',
//   },
//   deleteButton: {
//     backgroundColor: '#f44336',
//   },
//   cardContent: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     paddingHorizontal: 10,
//     paddingVertical: 5,
//   },
//   cardText: {
//     color: '#333',
//   },
//   newAnnouncementButton: {
//     backgroundColor: '#3f51b5',
//     paddingVertical: 2,
//     marginTop: 7,
//     borderRadius: 6,
//     alignSelf: 'center',
//     alignItems: 'center',
//   },
//   newAnnouncementText: {
//     color: '#fff',
//     fontWeight: 'bold',
//     fontSize: 14,
//   },
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0, 0,0, 0.5)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   formContainer: {
//     backgroundColor: '#fff',
//     padding: 16,
//     borderRadius: 8,
//     elevation: 4,
//   },
//   formTitle: {
//     fontWeight: 'bold',
//     color: '#333',
//     textAlign: 'center',
//     marginBottom: 12,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: '#333',
//     borderRadius: 4,
//     padding: 8,
//     marginBottom: 12,
//     textAlignVertical: 'top',
//   },
//   buttonRow: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//   },
//   saveButton: {
//     backgroundColor: '#4caf50',
//     paddingVertical: 8,
//     paddingHorizontal: 16,
//     borderRadius: 4,
//     marginHorizontal: 8,
//   },
//   cancelButton: {
//     backgroundColor: '#f44336',
//     paddingVertical: 8,
//     paddingHorizontal: 16,
//     borderRadius: 4,
//     marginHorizontal: 8,
//   },
//   actionText: {
//     color: '#fff',
//     fontWeight: 'bold',
//     textAlign: 'center',
//   },
// });

export default HODDashboard;
