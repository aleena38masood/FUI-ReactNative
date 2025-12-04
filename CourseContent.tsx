

// @ts-nocheck
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  useWindowDimensions,
  Alert,
  Image,
  Platform,
  Modal,
} from 'react-native';
import styles from '@/assets/TeacherPortalStyles';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import centralData from '@/components/centralData';
import MenuBar from '@/components/MenuBar';
import SubMenuBar from '@/components/SubMenuBar';
import images from '@/assets/images';
import config from '@/constants/config';
import AsyncStorage from '@react-native-async-storage/async-storage';

type RootStackParamList = {
  TeacherPortal: { activeTab?: string; courseOfferingID?: number; reset?: boolean };
  CourseContent: { courseOfferingID?: number; showSummary?: boolean };
  AssignmentsScreen: { courseOfferingID?: number; showSummary?: boolean };
  AttendanceScreen: { courseOfferingID?: number; showSummary?: boolean };
  TeacherProfile: undefined;
  Announcements: undefined;
  TeacherLogin: undefined;
};

type CourseContentNavigationProp = NativeStackNavigationProp<RootStackParamList, 'CourseContent'>;

interface Course {
  courseOfferingID: number;
  courseNo: string;
  courseName: string;
  credits?: string;
}

interface LectureMaterial {
  id: string;
  courseOfferingID: number;
  learningWeek: string;
  title: string;
  description: string;
  file?: string;
  url?: string;
  filePath?: string;
  isURL: boolean;
  updatedAt: string;
}

interface CentralData {
  courses: Course[];
  lectureMaterials: { [key: number]: LectureMaterial[] };
  selectedCourseOfferingID: number | null;
}

const alert = (title: string, message: string) => {
  if (Platform.OS === 'web') {
    window.alert(`${title}\n${message}`);
  } else {
    Alert.alert(title, message);
  }
};

const CourseContent = () => {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const navigation = useNavigation<CourseContentNavigationProp>();
  const route = useRoute();
  const courseOfferingID = centralData.selectedCourseOfferingID;
  const [activeTab, setActiveTab] = useState<string>('Course Content'); // Match case with SubMenuBar
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [courseDetails, setCourseDetails] = useState<{ lectureMaterials: LectureMaterial[] }>({ lectureMaterials: [] });
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [modalType, setModalType] = useState<string | null>(null);
  const [modalInitialData, setModalInitialData] = useState<LectureMaterial | null>(null);
  const [expandedWeeks, setExpandedWeeks] = useState<{ [key: string]: boolean }>({});
  const [hoveredWeek, setHoveredWeek] = useState<string | null>(null);
  const [hoveredAttachment, setHoveredAttachment] = useState<string | null>(null);
  const [isAddButtonHovered, setIsAddButtonHovered] = useState(false);

  const navigateSafely = (route: keyof RootStackParamList, params?: any) => {
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

  const resetToDashboard = () => {
    console.log('CourseContent: resetToDashboard called, clearing selectedCourseOfferingID');
    centralData.selectedCourseOfferingID = null;
    navigateSafely('TeacherPortal', { reset: true, activeTab: 'Course Content' });
  };

   const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!courseOfferingID) {
      console.warn('No selected course, redirecting to TeacherPortal');
      alert('Error', 'No course selected. Please select a course from the dashboard.');
      navigateSafely('TeacherPortal', { reset: true, activeTab: 'Course Content' });
      return;
    }

    const course = centralData.courses.find(c => c.courseOfferingID === courseOfferingID) || null;
    if (course) {
      setSelectedCourse({
        courseOfferingID: courseOfferingID,
        courseNo: course.courseNo,
        courseName: course.courseName,
        credits: course.credits || 'N/A',
      });
    }

    if (!centralData.lectureMaterials) {
      centralData.lectureMaterials = {};
    }
    if (!centralData.lectureMaterials[courseOfferingID]) {
      centralData.lectureMaterials[courseOfferingID] = [];
    }

    setCourseDetails({ lectureMaterials: centralData.lectureMaterials[courseOfferingID] || [] });

    // Handle route params
    const params = route.params as { activeTab?: string; showSummary?: boolean };
    if (params?.activeTab) {
      setActiveTab(params.activeTab);
    }

    console.log('CourseContent Debug:', {
      courseOfferingID,
      activeTab,
      lectureMaterials: centralData.lectureMaterials?.[courseOfferingID] || 'undefined',
    });
  }, [courseOfferingID, navigation, route.params]);

  // const handleDeleteLectureMaterial = async (materialId: string, courseOfferingId: number) => {
  //   try {
  //     const response = await fetch(`${config.BASE_URL}/api/lecture-materials/${materialId}`, {
  //       method: 'DELETE',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         courseOfferingId: courseOfferingId,
  //       }),
  //     });

  //     if (response.ok) {
  //       setCourseDetails(prevDetails => ({
  //         ...prevDetails,
  //         lectureMaterials: prevDetails.lectureMaterials.filter(material => material.id !== materialId),
  //       }));
  //       centralData.lectureMaterials[courseOfferingId] = centralData.lectureMaterials[courseOfferingId].filter(
  //         material => material.id !== materialId
  //       );
  //       alert('Success', 'Lecture material deleted successfully');
  //     } else {
  //       console.error('Failed to delete lecture material');
  //       alert('Error', 'Failed to delete lecture material');
  //     }
  //   } catch (error) {
  //     console.error('Error deleting lecture material:', error);
  //     alert('Error', 'An error occurred while deleting the lecture material');
  //   }
  // };

const facultyIdParam = parseInt(route.params?.facultyId || '-1', 10);
const isHODViewParam = route.params?.isHODView === 'true' || route.params?.isHODView === true;

  
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
   
    };



    
    //const navigation = useNavigation<NavigationProp>();
    const [loading, setLoading] = useState(true);
    const handleModalSave = async (data: any, type: ItemType) => {
    
    console.log("Function handleModalSave called for " + type );
    
    //STARTS pop-up handle for course content adding
      if (type === 'lectureMaterial' && selectedCourse) {
        
        let isUploadSuccessful = false; // Introduced variable
    
        console.log("Function handleModalSave called for title " + data.title );
        // Basic validation
        if (!data.title && (!data.file && !data.url)) {
          alert("Please provide title and  file or URL.");
          return;
        }
    
        //if (!newMaterialTitle || !newMaterialFile) {
        //  alert("Please fill Title and File/URL");
        //  return;
        // }
    
        try {
    
          const token = await AsyncStorage.getItem('token');
    
          let get_Content_ID =data.id?? -1;
     console.log("Function handleModalSave called get_Content_ID " + get_Content_ID );
    
          const newMaterial = {
            C_Content_ID : get_Content_ID,
            courseOfferedId: selectedCourse.courseOfferingID,
            content_Title: data.title,
            content_Description: data.description || null,
            has_URL: !!data.url,
            has_Attachment: !data.url,
            link_OR_AttachmentPath: data.url || data.filePath,
            inserted_ByUser: 1, // Replace with actual user ID from token/session
            learningWeek : data.learningWeek
          };
    
    
          let Post_Request_URL = 'Course/UploadCourseContent';
    
          if(get_Content_ID===-1 || get_Content_ID===0)
          {
            //Insert New Content
            Post_Request_URL = 'Course/UploadCourseContent';
          }
          else
          {
            //Edit/Update Case | Update Course Content
            Post_Request_URL = 'Course/AddOrUpdate';
          }
    
        const response = await fetch(`${config.BASE_URL}/api/${Post_Request_URL}`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(newMaterial),
          });
          
    
          const result = await response.json();
    
           if (response.ok ) { // && result?.success    assuming result.success is part of your API response
          alert(result.message || "Uploaded successfully");
          isUploadSuccessful = true;
    
          // Clear form
          setNewMaterialTitle('');
          setNewMaterialFile('');
          setNewMaterialDesc('');
        } else {
          alert(result.message || "Upload failed.");
        }
    
          
        } catch (error) {
          console.error(error);
          alert("Upload failed.");
        }
      
    
        if(isUploadSuccessful){
        //locally adding statically adding without doing postback
        setLectureMaterialsMap((prev) => {
          const courseId = selectedCourse.courseOfferingID;
          const existingMaterials = prev[courseId] || [];
          const existingIndex = existingMaterials.findIndex(
            (item) => item.id === data.id
          );
    
          let updatedMaterials;
          if (existingIndex !== -1) {
            // Update existing material
            updatedMaterials = [...existingMaterials];
            updatedMaterials[existingIndex] = data;
          } else {
            // Add new material
            updatedMaterials = [...existingMaterials, data];
          }
    
          return {
            ...prev,
            [courseId]: updatedMaterials,
          };
        });
       }
    
      }
    //ENDS pop-up handle for course content adding
    
    
    //   // popup Handle other types (assignment, project, quiz) if needed
    
    };


    
      // // For DYNAMIC courses keep this BUT For STATIC Comment it
      const [courses, setCourses] = useState<Course[]>(centralData.courses);
    
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
    
          if (config.WorkingMode === 'StaticData') {
            filteredCourses = centralData.courses;
            if (facultyId && isHODView) {
              filteredCourses = centralData.courses.filter((c) => c.facultyId === facultyIdParam.toString());
            }
            if (filteredCourses.length === 0) {
              setErrorMessage('No teaching assignments found for selected faculty.');
              setCourses([]);
            } else {
              setCourses(filteredCourses);
              setErrorMessage(null);
            }
            return;
          }
    
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
    


    
      useEffect(() => {
      const fetchCourses = async () => {
        try {
          const token = await AsyncStorage.getItem('token');
          if (!token) {
            navigation.replace('TeacherLogin');
            return;
          }
    
    
          // Handle StaticData Mode
    
          // Check if running in StaticData mode
          if (config.WorkingMode === 'StaticData') {
            const staticCourses: Course[] = [
              {
                courseOfferingID: 453,
                courseNo: 'CS101',
                courseName: 'Intro to Programming',
                credits: 3,
                students: 2,
                studentRollNos: ['001', '002'],
                facultyId: 1
              },
              {
                courseOfferingID: 7364,
                courseNo: 'CS102',
                courseName: 'Data Structures',
                credits: 3,
                students: 3,
                studentRollNos: ['003', '004', '005'],
                facultyId: 1
              },
              {
                courseOfferingID: 4564,
                courseNo: 'Bio 102',
                courseName: 'Bio',
                credits: 3,
                students: 3,
                studentRollNos: ['003', '004', '005'],
                facultyId: 2
              }
            ];
    
             let filteredCourses = staticCourses;
    
            if (facultyIdParam > 0 && isHODViewParam) {
              filteredCourses = staticCourses.filter(c => c.facultyId === facultyIdParam);
            }
    
            if (filteredCourses.length === 0) {
              Alert.alert("No Courses", "No teaching assignments found for selected faculty.");
            }
    
              setCourses(filteredCourses);
            //// setCourses(staticCourses);
            return;
          }
    
    
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
        Alert.alert("Unauthorized", "You are not authorized. Please login again.");
        navigation.navigate('TeacherLogin');
      } else if (!response.ok) {
        const message = await response.text();
        Alert.alert("Error", `Unexpected error: ${message}`);
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
        facultyId: c.facultyId
      }));
      setCourses(courses);
    } else {
      //console.warn(data.message || 'No teaching history');
      Alert.alert('Error', data.message);
    }
    
        }
    
        } catch (error) {
          //console.error('Failed to load courses:', error);
          Alert.alert('Error', error);
        }
      };
    
      fetchCourses();
    }, [facultyIdParam, isHODViewParam]);
    
//provided by aleena
const { facultyId, isHODView } = route.params || {};


//// Read from navigation params
//const route = useRoute<any>();  // top-level in the component

    
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
          isAttachment: !!(c.Has_Attachment === true || c.Has_Attachment === 1 || String(c.Has_Attachment).toLowerCase() === 'true'),
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
    
    
     const [studentsMap, setStudentsMap] = useState<{ [key: number]: Student[] }>(centralData.studentsMap);
    
        

  const groupedMaterials = courseDetails.lectureMaterials.reduce((acc, material, index) => {
    const week = material.learningWeek || 'No Week Provided';
    if (!acc[week]) {
      acc[week] = { materials: [], serialNumber: Object.keys(acc).length + 1 };
    }
    acc[week].materials.push(material);
    if (material.updatedAt) {
      const materialDate = new Date(material.updatedAt);
      if (!acc[week].lastUpdated || materialDate > new Date(acc[week].lastUpdated)) {
        acc[week].lastUpdated = material.updatedAt;
      }
    }
    return acc;
  }, {} as { [key: string]: { materials: LectureMaterial[]; serialNumber: number; lastUpdated?: string } });

  const sortedWeeks = Object.keys(groupedMaterials).sort((a, b) => {
    if (a === 'No Week Provided') return 1;
    if (b === 'No Week Provided') return -1;
    const weekNumberA = parseInt(a.match(/\d+/)?.[0] || '0', 10);
    const weekNumberB = parseInt(b.match(/\d+/)?.[0] || '0', 10);
    return weekNumberA - weekNumberB;
  });

  const toggleWeek = (week: string) => {
    setExpandedWeeks(prev => ({
      ...prev,
      [week]: !prev[week],
    }));
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };


  useEffect(() => {
  if (courseOfferingID) {
    loadCourseContents(courseOfferingID);
  }
}, [courseOfferingID]);

  const renderHeader = () => (
    <>
      <View style={[styles.topBar, { height: isMobile ? 20 : 25 }]}>
        <Text style={[styles.welcomeText, { fontSize: isMobile ? 12 : 16 }]}>Welcome</Text>
      </View>
      <View style={[styles.header, isMobile && { paddingVertical: 2 }]}>
        <View style={[styles.contentRow, isMobile && { flexDirection: 'column', alignItems: 'center' }]}>
          <View style={[styles.logoContainer, isMobile && { width: '100%', marginBottom: 2 }]}>
            <Image
              source={images.logo}
              style={[styles.logo, { width: isMobile ? 60 : 75, height: isMobile ? 60 : 75 }]}
              onError={() => console.warn('Failed to load logo')}
            />
            <Text style={[styles.uniName, { fontSize: isMobile ? 12 : 16 }]}>
              FOUNDATION UNIVERSITY{'\n'}ISLAMABAD
            </Text>
          </View>
          <View style={[styles.menuContainer, isMobile && { width: '100%', alignItems: 'center' }]}>
            <View
              style={[styles.menuGrid, { justifyContent: 'center' }, isMobile && { width: '100%' }, { flexWrap: isMobile ? 'wrap' : 'nowrap' }]}
            >
              <MenuBar isMobile={isMobile} resetToDashboard={resetToDashboard} />
            </View>
          </View>
        {!isMobile && (
            <View style={styles.rightSection}>
              <Image
                source={images.i2}
                style={styles.i2}
                onError={() => console.warn('Failed to load i2 image')}
              />
            </View>
          )}
        </View>
      </View>
    </>
  );

  const renderTabs = () => (
    <View style={[styles.tabContainer, { width: isMobile ? '100%' : '65%', marginTop: isMobile ? 12 : 0 }]}>
      {isMobile ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            flexDirection: 'row',
            paddingHorizontal: 8,
          }}
        >
          <SubMenuBar
            isMobile={isMobile}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            selectedCourse={selectedCourse}
            setSelectedCourse={setSelectedCourse}
            setShowAttendanceSummary={() => {}}
            courseOfferingID={courseOfferingID}
          />
        </ScrollView>
      ) : (
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          <SubMenuBar
            isMobile={isMobile}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            selectedCourse={selectedCourse}
            setSelectedCourse={setSelectedCourse}
            setShowAttendanceSummary={() => {}}
            courseOfferingID={courseOfferingID}
          />
        </View>
      )}
    </View>
  );

  const renderContent = () => (
   
    

    <View style={[styles.tableContainerLM, { width: isMobile ? '95%' : '70%' }]}>
      <View style={styles.HeaderContainer}>
        <View style={styles.placeholderView} />
        <Text style={[styles.HeaderText, { fontSize: isMobile ? 16 : 20 }]}>
          Lecture Material
        </Text>
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
          <Image source={images.plusCircle} style={styles.addLectureIcon} />
          <Text style={styles.addLectureButtonText}>Add Lecture Material</Text>
        </TouchableOpacity>
      </View>
      <View style={[styles.tableWrapperLM, { width: '99%' }]}>
        <View style={[styles.tableRowLM, styles.weekTableHeaderLM, { width: '100%' }]}>
          <Text style={[styles.tableCellLM, styles.weekHeaderTextLM, { width: '5%', textAlign: 'center' }]}>S#</Text>
          <Text style={[styles.tableCellLM, styles.weekHeaderTextLM, { width: '80%', textAlign: 'center' }]}>Learning Week</Text>
          <Text style={[styles.tableCellLM, styles.weekHeaderTextLM, { width: '25%', textAlign: 'center' }]}>Last Updated</Text>
        </View>
        <ScrollView
          style={{
            maxHeight: 210,
            overflow: 'scroll',
          }}
          scrollEnabled={courseDetails.lectureMaterials.length > 5}
          nestedScrollEnabled={true}
          bounces={false}
          contentContainerStyle={{ width: '100%' }}
        >
          <View style={[styles.tableWrapperLM, { width: '99%' }]}>
            {sortedWeeks.map((week) => (
              <View key={week}>
                <TouchableOpacity
                  style={[
                    styles.tableRowLM,
                    styles.weekHeaderRowLM,
                    Platform.OS === 'web' && !isMobile && hoveredWeek === week && styles.weekHoverEffect,
                  ]}
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
                  <Text style={[styles.tableCellLM, styles.weekHeaderTextLM, { width: '4%', textAlign: 'center' }]}>
                    {groupedMaterials[week].serialNumber}.
                  </Text>
                  <Text style={[styles.tableCellLM, styles.weekHeaderTextLM, { width: '80%', textAlign: 'center' }]}>
                    {week}
                  </Text>
                  <Text style={[styles.tableCellLM, styles.weekHeaderTextLM, { width: '25%', textAlign: 'center' }]}>
                    {formatDate(groupedMaterials[week].lastUpdated)}
                  </Text>
                  <Image
                    source={expandedWeeks[week] ? images.chevronUp : images.chevronDown}
                    style={styles.dropdownIcon}
                  />
                </TouchableOpacity>
                {expandedWeeks[week] && (
                  <View
                    style={[
                      styles.tableWrapperLM,
                      { width: '97%', alignSelf: 'flex-end', borderWidth: 1, borderColor: 'red', backgroundColor: '#E0E0E0' },
                    ]}
                  >
                    <View style={[styles.tableRowLM, styles.tableHeaderexpanded]}>
                      <Text style={[styles.tableCellLM, styles.tableHeaderTextExpanded, { width: '5%' }]}>S#</Text>
                      <Text style={[styles.tableCellLM, styles.tableHeaderTextExpanded, { width: '20%' }]}>Learning Week</Text>
                      <Text style={[styles.tableCellLM, styles.tableHeaderTextExpanded, { width: '22%' }]}>Title</Text>
                      <Text style={[styles.tableCellLM, styles.tableHeaderTextExpanded, { width: '25%' }]}>Description</Text>
                      <Text style={[styles.tableCellLM, styles.tableHeaderTextExpanded, { width: '17%' }]}>Attachment</Text>
                      <Text style={[styles.tableCellLM, styles.tableHeaderTextExpanded, { width: '10%' }]}>Actions</Text>
                    </View>
                    {groupedMaterials[week].materials.map((material, index) => (
                      <View
                        key={material.id}
                        style={[styles.tableRowLM, index % 2 === 0 ? styles.tableRowEvenLM : styles.tableRowOddLM]}
                      >
                        <Text style={[styles.tableCellExpanded, { width: '5%', fontSize: isMobile ? 12 : 16 }]}>
                          {index + 1}.
                        </Text>
                        <Text
                          style={[styles.tableCellExpanded, { width: '20%', fontSize: isMobile ? 12 : 16 }]}
                          accessible={true}
                          accessibilityLabel={`Description ${material.learningWeek || 'No Week Provided'}`}
                          numberOfLines={2}
                          ellipsizeMode="tail"
                        >
                          {material.learningWeek || '-'}
                        </Text>
                        <Text
                          style={[styles.tableCellExpanded, { width: '22%', fontSize: isMobile ? 12 : 16 }]}
                          accessible={true}
                          accessibilityLabel={`Lecture material title ${material.title}`}
                          numberOfLines={1}
                          ellipsizeMode="tail"
                        >
                          {material.title}
                        </Text>
                        <Text
                          style={[styles.tableCellExpanded, { width: '25%', fontSize: isMobile ? 12 : 16 }]}
                          accessible={true}
                          accessibilityLabel={`Description ${material.description || 'No description'}`}
                          numberOfLines={2}
                          ellipsizeMode="tail"
                        >
                          {material.description || '-'}
                        </Text>
                        <TouchableOpacity
                          style={[
                            styles.tableCellExpanded,
                            { width: '18%' },
                            Platform.OS === 'web' && !isMobile && hoveredAttachment === material.id && styles.hoveredRow,
                          ]}
                          accessible={true}
                          accessibilityLabel={`Open attachment ${material.file || material.url}`}
                          accessibilityRole="button"
                          onPress={() => {
                            let openLink = '';
                            let filepath_Or_Name = '';
                            console.log('check what is clicked is URL ?? ' + material.isURL);
                            if (material.isURL) {
                              const url = material.file || material.url || '';
                              openLink = url.startsWith('http://') || url.startsWith('https://') ? url : `http://${url}`;
                            } else {
                              filepath_Or_Name = material.filePath || material.file || '';
                              openLink = `${config.BASE_URL}${filepath_Or_Name}`;
                            }
                            if (Platform.OS === 'web') {
                              window.open(openLink, '_blank');
                            } else {
                              console.log(`Open ${openLink}`);
                            }
                          }}
                          {...(Platform.OS === 'web' && !isMobile
                            ? {
                                onMouseEnter: () => setHoveredAttachment(material.id),
                                onMouseLeave: () => setHoveredAttachment(null),
                              }
                            : {})}
                        >
                          <Text
                            style={[
                              styles.tableCellExpanded,
                              { fontSize: isMobile ? 12 : 16 },
                              Platform.OS === 'web' && !isMobile && styles.clickableText,
                            ]}
                            numberOfLines={1}
                            ellipsizeMode="tail"
                          >
                            {material.file || material.url || '-'}
                          </Text>
                        </TouchableOpacity>
                        <View style={[styles.tableCellExpanded, { width: '10%', flexDirection: 'row', justifyContent: 'left' }]}>
                          <TouchableOpacity
                            accessible={true}
                            accessibilityLabel={`Edit ${material.title}`}
                            accessibilityRole="button"
                            style={[styles.actionButtonLM, styles.editButtonLM]}
                            onPress={() => {
                              setModalType('lectureMaterial');
                              setModalInitialData(material);
                              setModalVisible(true);
                            }}
                          >
                            <Image
                              source={images.pencil}
                              style={styles.pencilIconLM}
                              onError={() => console.warn('Failed to load pencil icon')}
                            />
                          </TouchableOpacity>
                          <TouchableOpacity
                            accessible={true}
                            accessibilityLabel={`Delete ${material.title}`}
                            accessibilityRole="button"
                            style={[styles.actionButtonLM, styles.deleteButtonLM]}
                            onPress={() => {
                              Alert.alert(
                                'Confirm Delete',
                                'Are you sure you want to delete this lecture material?',
                                [
                                  { text: 'Cancel', style: 'cancel' },
                                  {
                                    text: 'Delete',
                                    style: 'destructive',
                                    onPress: () => handleDeleteLectureMaterial(material.id, courseOfferingID!),
                                  },
                                ]
                              );
                            }}
                          >
                            <Image
                              source={images.deleteIcon}
                              style={styles.iconLM}
                              onError={() => console.warn('Failed to load delete icon')}
                            />
                          </TouchableOpacity>
                        </View>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {isMobile ? (
        <ScrollView contentContainerStyle={[styles.scrollArea, { paddingBottom: 50 }]}>
          {renderHeader()}
          {renderTabs()}
          {renderContent()}
        </ScrollView>
      ) : (
        <>
          {renderHeader()}
          <ScrollView contentContainerStyle={[styles.scrollArea, { paddingBottom: 20 }]}>
            {renderTabs()}
            {renderContent()}
          </ScrollView>
        </>
      )}
    </View>
  );
};

export default CourseContent;