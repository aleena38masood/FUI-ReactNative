

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
  Alert,
  Modal,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useNavigationState, useRoute } from '@react-navigation/native';
import type { ViewStyle } from 'react-native';
import type { RouteProp } from '@react-navigation/native';
import images from '@/assets/images';

import config from '@/constants/config'; // adjust the path based on location

import MenuBar from '../../components/MenuBar'; // Adjust path as needed

import SubMenuBar from '@/components/SubMenuBar'; // Adjust path if necessary
//import images from '@/constants/images'; // Your image icons


interface FacultyInterface {
  TeacherId: number;
  FullName: string;
  Designation: string;
  Email: string;
  Phone: string;
  UserId: number;
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
  DeanDashboard: { userData?: UserData };
  FacultyManagement: undefined;
  Announcements: undefined;
  Profile: undefined;
  TeacherLogin: undefined;
  TeacherPortal: { facultyId: string; isHODView?: boolean };
};

const DeanDashboard = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RootStackParamList, 'DeanDashboard'>>();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  // Get user data from navigation params
  const { userData } = route.params || {};
  const [token, setToken] = useState<string | null>(null);
  // const [faculty, setFaculty] = useState<
  //   { id: string; name: string; status: string }[]
  // >([]);
  const [announcements, setAnnouncements] = useState<
    { id: number; date: string; title: string; content: string }[]
  >([]);
  const [form, setForm] = useState<{ id: number | null; title: string; content: string }>({
    id: null,
    title: '',
    content: '',
  });
  const [isFormVisible, setIsFormVisible] = useState(false);

  // Get the current route name
  const currentRouteName = useNavigationState((state) => state.routes[state.index].name);

  // // Menu items
  // const menuItems = [
  //   { label: 'Dashboard', icon: images.home, navigateTo: 'DeanDashboard' },
  //   // { label: 'Faculty Management', icon: images.profile, navigateTo: 'FacultyManagement' },
  //   // { label: 'Announcements', icon: images.bell, navigateTo: 'Announcements' },
  //   { label: 'Profile', icon: images.profile, navigateTo: 'Profile' },
  //   { label: 'Logout', icon: images.logout, navigateTo: 'TeacherLogin' },
  // ];

  // Static data for faculty (from TeacherPortal's centralData.teachers)
  const staticFaculty = [
    { id: 'T001', name: 'Dr. Ali Rehman', status: 'Present' },
    { id: 'T002', name: 'Prof. Sana Malik', status: 'On Leave' },
  ];

  const staticAnnouncements = [
    {
      id: 1,
      date: 'Oct 10, 2025',
      title: 'Department Meeting',
      content: 'All faculty members are requested to attend the meeting on Oct 15, 2025, at 10 AM.',
    },
    {
      id: 2,
      date: 'Oct 5, 2025',
      title: 'Course Registration',
      content: 'Course registration for the Spring 2026 semester begins on Oct 20, 2025.',
    },
  ];

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
          Alert.alert('Access Denied', 'You are not authorized to access the Dean Dashboard.', [
            { text: 'OK', onPress: () => navigation.navigate('TeacherLogin') },
          ]);
          return;
        }

       // // Set static data
       // setFaculty(staticFaculty);
        setAnnouncements(staticAnnouncements);
      } catch (error) {
        console.error('Error initializing:', error);
        Alert.alert('Error', 'Failed to initialize dean dashboard.');
      }
    };

    initialize();
  }, [userData]);





  //////////////////////////////////////////////////////

  const [stats, setStats] = useState<{ faculty: number; courses: number; students: number }>({ faculty: 0, courses: 0, students: 0 });


//const [faculty, setFaculty] = useState([]);
//const [selectedProgram, setSelectedProgram] = useState(-1);
//const [designation, setDesignation] = useState('');
//const [programs, setPrograms] = useState([]);

const [faculty, setFaculty] = useState<FacultyInterface[]>([]);
const [selectedProgram, setSelectedProgram] = useState<number>(-1);
const [designation, setDesignation] = useState<string>('');
const [programs, setPrograms] = useState<any[]>([]); // You may define a Program interface here later



const fetchFaculty = async () => {
  try {
    const userInfo = await AsyncStorage.getItem('userInfo');
    const parsed = JSON.parse(userInfo || '{}');
    const token = await AsyncStorage.getItem('token');


    //Check if using static data
    if (config.WorkingMode === 'StaticData') {
      const staticFaculty: FacultyInterface[] = [
        {
          TeacherId: 1,
          FullName: 'Dr. Ayesha Khan',
          Designation: 'Assistant Professor',
          Email: 'ayesha@example.com',
          Phone: '0300-1234567',
          UserId: 101
        },
        {
          TeacherId: 2,
          FullName: 'Mr. Imran Haider',
          Designation: 'Lecturer',
          Email: 'imran@example.com',
          Phone: '0321-9876543',
          UserId: 102
        }
      ];

      setFaculty(staticFaculty);
      return;
    }

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

    if (json.success && Array.isArray(json.data)) {
      const mappedFaculty: FacultyInterface[] = json.data.map((item: any) => ({
        TeacherId: item.teacherId,
        FullName: item.fullName,
        Designation: item.designation,
        Email: item.email,
        Phone: item.phone,
        UserId: item.userId,
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

  if (config.WorkingMode === 'StaticData') {
    //Dont call dynamic stats
  }
  else
  {
    //Get Stats from API
    const token = await AsyncStorage.getItem('token');
    const userInfo = JSON.parse(await AsyncStorage.getItem('userInfo') || '{}');

    const response = await fetch(`${config.BASE_URL}/api/Dashboard/GetDashboardStats`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const json = await response.json();

    // Optional: Check for nulls or unexpected response
    if (!json || json.facultyCount === undefined) {
      console.warn('Invalid stats response', json);
      return;
    }

    setStats({
      faculty: json.facultyCount,
      courses: json.courseCount,
      students: json.studentCount,
    });


  }



};



////For future use

// const fetchPrograms = async () => {
//   const token = await AsyncStorage.getItem('token');
//   //const userInfo = JSON.parse(await AsyncStorage.getItem('userInfo') || '{}');

//   const response = await fetch(`${config.BASE_URL}/api/Common/GetProgramsByDept`, {
//     headers: { Authorization: `Bearer ${token}` }
//   });
//   const data = await response.json();
//   setProgramList(data);
// };


  /////////////////////////////////////////////////



  useEffect(() => {
  const init = async () => {
    await fetchFaculty();
   // await fetchPrograms();
    await loadDashboardStats();
  };
  init();
}, []);


  
  // Handle announcement form submission
  const handleSaveAnnouncement = async () => {
    if (!form.title.trim() || !form.content.trim()) {
      Alert.alert('Error', 'Announcement title and content cannot be empty.');
      return;
    }

    const currentDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

    try {
      const updatedAnnouncement = {
        id: form.id || Date.now(),
        title: form.title,
        content: form.content,
        date: currentDate,
      };

      if (form.id) {
        setAnnouncements(
          announcements.map((ann) =>
            ann.id === form.id ? { ...ann, ...updatedAnnouncement } : ann
          )
        );
      } else {
        setAnnouncements([...announcements, updatedAnnouncement]);
      }

      setForm({ id: null, title: '', content: '' });
      setIsFormVisible(false);
    } catch (error) {
      console.error('Error saving announcement:', error);
      Alert.alert('Error', 'An error occurred while saving the announcement.');
    }
  };

  // Handle edit announcement
  const handleEdit = (announcement: { id: number; title: string; content: string }) => {
    setForm({ id: announcement.id, title: announcement.title, content: announcement.content });
    setIsFormVisible(true);
  };

  // Handle delete announcement
  const handleDelete = async (id: number) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this announcement?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setAnnouncements(announcements.filter((ann) => ann.id !== id));
            } catch (error) {
              console.error('Error deleting announcement:', error);
              Alert.alert('Error', 'An error occurred while deleting the announcement.');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  // Render faculty table
  const renderFacultyTable = () => (
    <View style={[styles.tableContainer, { width: isMobile ? '90%' : '57%' }] as ViewStyle[]}>
      <Text style={[styles.heading, { fontSize: isMobile ? 16 : 18 }]}>
        Faculty Members
      </Text>
      <ScrollView horizontal style={styles.tableWrapper}>
        <View>
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
  onPress={() =>
    navigation.replace('TeacherPortal', {
      facultyId: member.TeacherId,
      isHODView: true,
    })
  }
>
   <Text style={[styles.actionText, { fontSize: isMobile ? 12 : 14 }]}>View</Text>
  </TouchableOpacity>

                  {/* <TouchableOpacity
                    style={[styles.actionButton, styles.viewButton] as ViewStyle[]}
                    onPress={() => 
                      //navigation.navigate('TeacherPortal', { facultyId: member.TeacherId, isHODView: true })
                    
                      navigation.navigate({
  name: 'TeacherPortal',
  params: { facultyId: member.TeacherId, isHODView: true },
  key: `TeacherPortal-${member.TeacherId}`, // unique key per faculty
})
                    
                    
                    }
                  >
                    <Text style={[styles.actionText, { fontSize: isMobile ? 12 : 14 }]}>View</Text>
                  </TouchableOpacity> */}
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
    </View>
  );

  // Render header
  const renderHeader = () => (
    <>
      <View style={[styles.topBar, { height: isMobile ? 20 : 25 }] as ViewStyle[]}>
        <Text style={[styles.welcomeText, { fontSize: isMobile ? 12 : 14 }]}>
          Welcome: {userData?.fullName || ' to FUI Faculty Portal'}
        </Text>
      </View>
      <View style={styles.header as ViewStyle}>
        <View style={[styles.contentRow, isMobile && { flexDirection: 'column', alignItems: 'center' }] as ViewStyle[]}>
          <View style={[styles.logoContainer, isMobile && { width: '100%', marginBottom: 10 }] as ViewStyle[]}>
            <Image
              source={images.logo}
              style={[styles.logo, { width: isMobile ? 60 : 75, height: isMobile ? 60 : 75 }]}
            />
            <Text style={[styles.uniName, { fontSize: isMobile ? 12 : 16 }]}>
              FOUNDATION UNIVERSITY{'\n'}ISLAMABAD
            </Text>
          </View>
          <View style={[styles.menuContainer, isMobile && { width: '100%', alignItems: 'center' }] as ViewStyle[]}>


            <View style={[styles.menuGrid, isMobile && { width: '100%', justifyContent: 'center' }, { flexWrap: isMobile ? 'wrap' : 'nowrap' }] as ViewStyle[]}>
                           
                           
               <MenuBar isMobile={isMobile} />  {/*Centralized shared Menu */}
           
           
           
              {/* {menuItems.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.menuItem,
                    { width: isMobile ? '30%' : 80, height: isMobile ? '42%' : 58, marginTop: isMobile ? 10 : 8 },
                    item.navigateTo === currentRouteName && { backgroundColor: '#3f51b5' },
                  ]}
                  onPress={async () => {
                    if (item.navigateTo === 'TeacherLogin') {
                      await AsyncStorage.removeItem('authToken');
                    }
                    item.navigateTo && navigation.navigate(item.navigateTo);
                  }}
                >
                  <Image
                    source={item.icon}
                    style={{ width: isMobile ? 24 : 25, height: isMobile ? 24 : 25 }}
                    tintColor={item.navigateTo === currentRouteName ? '#fff' : '#333'}
                  />
                  <Text
                    style={[
                      styles.menuLabel,
                      { fontSize: isMobile ? 9 : 9 },
                      item.navigateTo === currentRouteName && { color: '#fff' },
                    ]}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))} */}



            </View>



          </View>
          {!isMobile && (
            <View style={styles.rightSection as ViewStyle}>
              <Image source={images.i2} style={styles.i2} />
            </View>
          )}
        </View>
      </View>
    </>
  );

  // Render summary card
  const renderSummaryCard = () => (
    <View style={[styles.tableContainer, { width: isMobile ? '90%' : '37%' }] as ViewStyle[]}>
      <Text style={[styles.heading, { fontSize: isMobile ? 16 : 18 }]}>
        Department Summary
      </Text>
      <View style={styles.cardContent as ViewStyle}>
        {/* <Text style={[styles.cardText, { fontSize: isMobile ? 12 : 14 }]}>Faculty: {userData?.facultyCount || 15}</Text>
        <Text style={[styles.cardText, { fontSize: isMobile ? 12 : 14 }]}>Courses: 3</Text>
        <Text style={[styles.cardText, { fontSize: isMobile ? 12 : 14 }]}>Students: {userData?.studentCount || 350}</Text> */}

 <Text style={[styles.cardText, { fontSize: isMobile ? 12 : 14 }]}>Faculty: {stats.faculty}</Text>
        <Text style={[styles.cardText, { fontSize: isMobile ? 12 : 14 }]}>Courses: {stats.courses}</Text>
        <Text style={[styles.cardText, { fontSize: isMobile ? 12 : 14 }]}>Students: {stats.students}</Text>



      </View>
    </View>
  );

  // Render announcements table
  const renderAnnouncementsTable = () => (
    <View style={[styles.tableContainer, { width: isMobile ? '90%' : '57%' }] as ViewStyle[]}>
      <Text style={[styles.heading, { fontSize: isMobile ? 16 : 18 }]}>
        Recent Announcements
      </Text>
      <Text> In-Progress </Text>
      {/* <ScrollView horizontal style={styles.tableWrapper}>
        <View>
          <View style={[styles.tableRow, styles.tableHeader] as ViewStyle[]}>
            <Text style={[styles.tableCell, styles.tableHeaderText, { minWidth: isMobile ? 100 : 150 }]}>Date</Text>
            <Text style={[styles.tableCell, styles.tableHeaderText, { minWidth: isMobile ? 120 : 200 }]}>Title</Text>
            <Text style={[styles.tableCell, styles.tableHeaderText, { minWidth: isMobile ? 200 : 400 }]}>Content</Text>
            <Text style={[styles.tableCell, styles.tableHeaderText, { minWidth: isMobile ? 120 : 150 }]}>Actions</Text>
          </View>
          {announcements.length > 0 ? (
            announcements.map((announcement, index) => (
              <View
                key={index}
                style={[styles.tableRow, index % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd] as ViewStyle[]}
              >
                <Text style={[styles.tableCell, { minWidth: isMobile ? 100 : 150, fontSize: isMobile ? 12 : 14 }]}>
                  {announcement.date}
                </Text>
                <Text style={[styles.tableCell, { minWidth: isMobile ? 120 : 200, fontSize: isMobile ? 12 : 14 }]}>
                  {announcement.title}
                </Text>
                <Text style={[styles.tableCell, { minWidth: isMobile ? 200 : 400, fontSize: isMobile ? 12 : 14 }]}>
                  {announcement.content}
                </Text>
                <View
                  style={[styles.tableCell, { minWidth: isMobile ? 120 : 150, flexDirection: 'row', justifyContent: 'center' }] as ViewStyle[]}
                >
                  <TouchableOpacity
                    style={[styles.actionButton, styles.editButton] as ViewStyle[]}
                    onPress={() => handleEdit(announcement)}
                  >
                    <Image
                      source={images.pencil}
                      style={{ width: isMobile ? 16 : 18, height: isMobile ? 16 : 18 }}
                      tintColor="#fff"
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.deleteButton] as ViewStyle[]}
                    onPress={() => handleDelete(announcement.id)}
                  >
                    <Image
                      source={images.deleteIcon}
                      style={{ width: isMobile ? 16 : 18, height: isMobile ? 16 : 18 }}
                      tintColor="#fff"
                    />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.tableRow as ViewStyle}>
              <Text style={[styles.tableCell, { minWidth: isMobile ? 540 : 900, fontSize: isMobile ? 12 : 14 }]}>
                No announcements available
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
      <TouchableOpacity
        style={[styles.newAnnouncementButton, { width: isMobile ? '90%' : '22%' }] as ViewStyle[]}
        onPress={() => {
          setForm({ id: null, title: '', content: '' });
          setIsFormVisible(true);
        }}
      >
        <Text style={styles.newAnnouncementText}>New Announcement</Text>
      </TouchableOpacity> */}
    </View>
  );

  // Render announcement form modal
  const renderAnnouncementForm = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isFormVisible}
      onRequestClose={() => setIsFormVisible(false)}
    >
      <View style={styles.modalOverlay as ViewStyle}>
        <View style={[styles.formContainer, { width: isMobile ? '90%' : '50%' }] as ViewStyle[]}>
          <Text style={[styles.formTitle, { fontSize: isMobile ? 16 : 18 }]}>
            {form.id ? 'Edit Announcement' : 'Create Announcement'}
          </Text>
          <TextInput
            style={[styles.input, { fontSize: isMobile ? 12 : 14 }]}
            placeholder="Enter announcement title"
            value={form.title}
            onChangeText={(text) => setForm({ ...form, title: text })}
          />
          <TextInput
            style={[styles.input, { fontSize: isMobile ? 12 : 14 }]}
            placeholder="Enter announcement content"
            value={form.content}
            onChangeText={(text) => setForm({ ...form, content: text })}
            multiline
            numberOfLines={4}
          />
          <View style={styles.buttonRow as ViewStyle}>
            <TouchableOpacity
              style={[styles.actionButton, styles.saveButton] as ViewStyle[]}
              onPress={handleSaveAnnouncement}
            >
              <Text style={[styles.actionText, { fontSize: isMobile ? 12 : 14 }]}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.cancelButton] as ViewStyle[]}
              onPress={() => {
                setForm({ id: null, title: '', content: '' });
                setIsFormVisible(false);
              }}
            >
              <Text style={[styles.actionText, { fontSize: isMobile ? 12 : 14 }]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container as ViewStyle}>
      {isMobile ? (
        <ScrollView contentContainerStyle={[styles.scrollArea, { paddingBottom: 50 }] as ViewStyle[]}>
          {renderHeader()}
          {renderSummaryCard()}
          {renderFacultyTable()}
          {renderAnnouncementsTable()}
        </ScrollView>
      ) : (
        <>
          {renderHeader()}
          <ScrollView contentContainerStyle={[styles.scrollArea, { paddingBottom: 30 }] as ViewStyle[]}>
            {renderSummaryCard()}
            {renderFacultyTable()}
            {renderAnnouncementsTable()}
          </ScrollView>
        </>
      )}
      {renderAnnouncementForm()}
    </View>
  );
};

// Updated styles
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0f2a47',
    flex: 1,
  },
  topBar: {
    paddingVertical: 4,
    alignItems: 'center',
    backgroundColor: '#009688',
    width: '100%',
  },
  welcomeText: {
    color: '#fff',
    fontWeight: 14,
  },
  header: {
    // backgroundColor: '#fff',
    marginTop: 8,
    paddingHorizontal: 6,
  },
  contentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  logoContainer: {
    width: '12%',
    alignItems: 'left',
    flex: 1,
    flexDirection: 'row',
  },
  logo: {
    marginLeft: 30,
  },
  uniName: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'left',
    marginLeft: 8,
    marginTop: 16,
  },
  menuContainer: {
    width: '50%',
  },
  menuGrid: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
  },
  menuItem: {
    backgroundColor: '#fff',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'flex-start',
    margin: 6,
    marginTop: 8,
    paddingTop: 8,
    elevation: 2,
  },
  menuLabel: {
    marginTop: 8,
    textAlign: 'center',
    color: '#333',
    fontWeight: '500',
  },
  rightSection: {
    width: '20%',
    alignItems: 'center',
    flex: 1,
  },
  i2: {
    width: 70,
    height: 70,
    borderRadius: 2,
    marginLeft: 40,
  },
  scrollArea: {
    alignItems: 'center',
  },
  tableContainer: {
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 8,
    elevation: 4,
    marginTop: 8,
    marginBottom: 2,
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
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tableRowEven: {
    backgroundColor: '#f5f5f5',
  },
  tableRowOdd: {
    backgroundColor: '#ffffff',
  },
  tableHeader: {
    backgroundColor: '#e0e0e0',
    borderBottomWidth: 2,
    borderBottomColor: '#333',
  },
  tableCell: {
    flex: 1,
    paddingVertical: 5,
    paddingHorizontal: 8,
    marginTop: 2,
    textAlign: 'center',
    color: '#333',
  },
  tableHeaderText: {
    fontWeight: 'bold',
    color: '#333',
    fontSize: 14,
  },
  actionButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  viewButton: {
    backgroundColor: '#3f51b5',
  },
  editButton: {
    backgroundColor: '#ff9800',
  },
  deleteButton: {
    backgroundColor: '#f44336',
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  cardText: {
    color: '#333',
  },
  newAnnouncementButton: {
    backgroundColor: '#3f51b5',
    paddingVertical: 2,
    marginTop: 7,
    borderRadius: 6,
    alignSelf: 'center',
    alignItems: 'center',
  },
  newAnnouncementText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0,0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    elevation: 4,
  },
  formTitle: {
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 4,
    padding: 8,
    marginBottom: 12,
    textAlignVertical: 'top',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  saveButton: {
    backgroundColor: '#4caf50',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    marginHorizontal: 8,
  },
  cancelButton: {
    backgroundColor: '#f44336',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    marginHorizontal: 8,
  },
  actionText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default DeanDashboard;
