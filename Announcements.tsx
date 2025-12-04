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
  Picker,
  Platform,
} from 'react-native';
import { useNavigation, useNavigationState } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import images from '@/assets/images';
import MenuBar from '../../components/MenuBar'; // Adjust path as needed
import centralDataAdmin from '@/components/centralDataAdmin'; // Adjust path as needed
import getStyles from '../../assets/TeacherPortalStyles'; // Import the styles
import CustomModal from '@/components/CustomModal'; // Import CustomModal (adjust path as needed)
import TooltipWrapper from '@/assets/TooltipWrapper';
import AlertModalPopUp from '@/components/AlertModalPopUp';
import Header from '@/components/HeaderComponent';

import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

import config from '@/constants/config';

interface Announcement {
  id: string;
  created_date: string;
  content_Text: string;
  createdBy_Name: string;
  createdBy_ID: string;
  content_Title: string;
  content_Type: string;
  isViewed: number;
}

const Announcements = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const styles = getStyles(isMobile);

  const currentRouteName = useNavigationState((state) => {
    const route = state.routes[state.index];
    return route.name;
  });

  const [announcements, setAnnouncements] = useState<Announcement[]>(centralDataAdmin.announcements);
  const [form, setForm] = useState({ id: null, content_Text: '', createdBy_Name: '', content_Title: '', content_Type: 'General', roleId: '-1', departmentId: '-1', programId: '-1' });
  const [isFormVisible, setIsFormVisible] = useState(false);

  const unreadCount = announcements.filter(ann => ann.isViewed === 0).length;
  
  
  const [hoveredAttachment, setHoveredAttachment] = useState<string | null>(null);
  const [isAddButtonHovered, setIsAddButtonHovered] = useState(false);

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
      buttons: [{ text: 'OK', onPress: () => setAlertModal((prev) => ({ ...prev, visible: false })) }],
    });

  const menuItems = [
    { label: 'Dashboard', icon: images.home, navigateTo: 'TeacherPortal' },
    { label: 'Profile', icon: images.profile, navigateTo: 'TeacherProfile' },
    { label: `Announcements${unreadCount > 0 ? ` (${unreadCount})` : ''}`, icon: images.bell, navigateTo: 'Announcements' },
    { label: 'Logout', icon: images.logout, navigateTo: 'TeacherLogin' },
  ];

useFocusEffect(
  useCallback(() => {
    const checkAuthAndFetch = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          navigation.replace('TeacherLogin');
        } else {
          setLoading(false);
          fetchAnnouncements(); // Call here to refresh on every focus
        }
      } catch (error) {
        console.error('Auth check error:', error);
        navigation.replace('TeacherLogin');
      }
    };

    checkAuthAndFetch();
  }, [navigation])
);

// useEffect(() => { fetchAnnouncements(); }, [])





 const fetchAnnouncements = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      console.warn('No token found, redirecting to login');
      navigation.replace('TeacherLogin');
      return;
    }


    console.log("Fetching Announcement");
    //// Replace these with actual user's data:
    //const userId = 123;
    // const roleId = 2;
    // const programId = 7;
    // const departmentId = 4;

    //const res = await fetch(`${config.BASE_URL}/api/Announcement/GetForUser?userId=${userId}&roleId=${roleId}&programId=${programId}&departmentId=${departmentId}`, {
    const res = await fetch(`${config.BASE_URL}/api/Announcement/GetForUser`, {
    method: 'GET',
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) throw new Error('Failed to load announcements');

    const json_new = await res.json();
     const mapped: Announcement[] = (json_new.data || []).map((item: any) => ({
      id: item.id ?? '',
      created_date: item.created_date ?? '',
      content_Text: item.content_Text ?? '',
      createdBy_Name: item.createdBy_Name ?? '',
      createdBy_ID: item.createdBy_ID ?? '',
      content_Title: item.content_Title ?? '',
      content_Type: item.content_Type ?? '',
      isViewed: item.isViewed ?? 0
    }));

    setAnnouncements(mapped);


  } catch (err) {
    console.error('Error fetching announcements:', err);
    showErrorPopup('Loading Announcements', 'Unable to load announcements. Please try again.');
  }
};



const showErrorPopup = (title, message) => {
  setPopupAlertTitle(title);
  setPopupAlertMessage(message);
  setPopupAlertButtons([{ text: 'OK', onPress: () => setShowAlertPopup(false) }]);
  setShowAlertPopup(true);
};



const [popupAlertTitle, setPopupAlertTitle] = useState('');
const [popupAlertMessage, setPopupAlertMessage] = useState('');
const [popupAlertButtons, setPopupAlertButtons] = useState([]);
const [showAlertPopup, setShowAlertPopup] = useState(false);














 const handleSaveAnnouncement = () => {
  if (!form.content_Text.trim() || !form.content_Title.trim() || !form.content_Type.trim()) {
    setAlertModal({
      visible: true,
      type: 'error',
      title: 'Error',
      message: 'Announcement content, title, and type cannot be empty.',
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
          ? { ...ann, content_Text: form.content_Text, content_Title: form.content_Title, content_Type: form.content_Type, created_date: currentDate, createdBy_Name: form.createdBy_Name, isViewed: 0 }
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
    const newAnnouncement = {
      id: `A${announcements.length + 1}`,
      created_date: currentDate,
      content_Text: form.content_Text,
      content_Title: form.content_Title,
      content_Type: form.content_Type,
      createdBy_Name: form.createdBy_Name,
      createdBy_ID: `U${announcements.length + 1}`,
      isViewed: 0,
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

  setForm({ id: null, content_Text: '', createdBy_Name: '', content_Title: '', content_Type: 'General', roleId: '-1', departmentId: '-1', programId: '-1' });
  setIsFormVisible(false);
};

  const handleEdit = (announcement: Announcement) => {
    setForm({
      id: announcement.id,
      content_Text: announcement.content_Text,
      createdBy_Name: announcement.createdBy_Name,
      content_Title: announcement.content_Title,
      content_Type: announcement.content_Type,
      roleId: '-1',
      departmentId: '-1',
      programId: '-1',
    });
    setIsFormVisible(true);
    setAnnouncements(
      announcements.map((ann) =>
        ann.id === announcement.id ? { ...ann, isViewed: 1 } : ann
      )
    );
  };

   const handleDelete = (id: string) => {
  setAlertModal({
    visible: true,
    type: 'confirmation',
    title: 'Confirm Delete',
    message: 'Are you sure you want to delete this announcement?',
    buttons: [
      {
        text: 'Delete',
        onPress: () => {
          setAnnouncements(announcements.filter((ann) => ann.id !== id));
          setAlertModal({
            visible: true,
            type: 'success',
            title: 'Success',
            message: 'Announcement deleted successfully.',
            buttons: [{ text: 'OK', onPress: () => setAlertModal((prev) => ({ ...prev, visible: false })) }],
          });
        },
      },
      {
        text: 'Cancel',
        onPress: () => setAlertModal((prev) => ({ ...prev, visible: false })),
      },
    ],
  });
};





const markAnnouncementAsRead = async (announcementId) => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      navigation.replace('TeacherLogin');
      return;
    }

   // const userId = 123;
                           //&userId=${userId}
    await fetch(`${config.BASE_URL}/api/Announcement/MarkAsRead?announcementId=${announcementId}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` }
    });

    // Refresh list & count
    fetchAnnouncements();
    //fetchUnreadCount();
  } catch (err) {
    console.error('Error marking as read:', err);
    showErrorPopup('Mark as Read', 'Could not mark as read. Try again.');
  }
};




  const handleView = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement);
    setViewModalVisible(true);

 markAnnouncementAsRead(announcement.id);

 // //Static refresh
    // setAnnouncements(
    //   announcements.map((ann) =>
    //     ann.id === announcement.id ? { ...ann, isViewed: 1 } : ann
    //   )
    // );



  };

  const modalButtons = [
    {
      text: 'Save',
      onPress: handleSaveAnnouncement,
      style: [styles.actionButton, styles.saveButton],
      textStyle: styles.actionText,
    },
    {
      text: 'Cancel',
      onPress: () => {
        setForm({ id: null, content_Text: '', createdBy_Name: '', content_Title: '', content_Type: 'General', roleId: '-1', departmentId: '-1', programId: '-1' });
        setIsFormVisible(false);
         setAlertModal({
        visible: true,
        type: 'success',
        title: 'Cancelled',
        message: 'Announcement creation cancelled.',
        buttons: [{ text: 'OK', onPress: () => setAlertModal((prev) => ({ ...prev, visible: false })) }],
      });
      },
      style: [styles.actionButton, styles.closeButton],
      textStyle: styles.actionText,
    },
  ];


  const deleteModalButtons = [
    {
      text: 'Delete',
      onPress: () => {
        setAnnouncements(announcements.filter((ann) => ann.id !== selectedAnnouncement?.id));
        setViewModalVisible(false);
        setSelectedAnnouncement(null);
        setAlertModal({
        visible: true,
        type: 'success',
        title: 'Success',
        message: 'Announcement deleted successfully.',
        buttons: [{ text: 'OK', onPress: () => setAlertModal((prev) => ({ ...prev, visible: false })) }],
      });
      },
      style: [styles.actionButton, styles.deleteButton],
      textStyle: styles.actionText,
    },
    {
      text: 'Cancel',
      onPress: () => {
        setViewModalVisible(false);
        setSelectedAnnouncement(null);
      },
        style: [styles.actionButton, styles.closeButton],
      textStyle: styles.actionText,
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
            style: [styles.actionButton, styles.saveButton],    //styles.editButtonLM, { alignSelf: 'center', minWidth: 100 }
            textStyle: [styles.buttonText],
          },
          {
            text: 'Close',
            onPress: () => {
              setViewModalVisible(false);
              setSelectedAnnouncement(null);
            },
            style: [styles.actionButton, styles.closeButton], // { alignSelf: 'center', minWidth: 100 }
            textStyle: [styles.buttonText],
          },
        ];


  // const renderHeader = () => (
  //   <>
  //     <View style={[styles.topBar]}>
  //       <Text style={[styles.welcomeText]}>
  //         Welcome: FUI/TEACH-001/ISB
  //       </Text>
  //     </View>
  //     <View style={styles.header,  isMobile && { paddingVertical: 2 }}>
  //       <View style={[styles.contentRow, isMobile && { flexDirection: 'column', alignItems: 'center' }]}>
  //         <View style={[styles.logoContainer, isMobile && { width: '100%', marginBottom: 10 }]}>
  //           <Image
  //             source={images.logo}
  //             style={[styles.logo, { width: isMobile ? 60 : 75, height: isMobile ? 60 : 75 }]}
  //           />
  //           <Text style={[styles.uniName, { fontSize: isMobile ? 12 : 16 }]}>
  //             FOUNDATION UNIVERSITY{'\n'}ISLAMABAD
  //           </Text>
  //         </View>
  //         <View style={[styles.menuContainer, isMobile && { width: '100%', alignItems: 'center' }]}>
  //           <View style={[styles.menuGrid, isMobile && { width: '100%', justifyContent: 'center' }, { flexWrap: isMobile ? 'wrap' : 'nowrap' }]}>
  //             <MenuBar isMobile={isMobile} />
  //           </View>
  //         </View>
  //         {!isMobile && (
  //           <View style={styles.rightSection}>
  //             <Image source={images.i2} style={styles.i2} />
  //           </View>
  //         )}
  //       </View>
  //     </View>
  //   </>
  // );

  const renderAnnouncementsTable = () => (
    <View style={[styles.tableContainer, { width: isMobile ? '90%' : '80%' }]}>
      <View style={styles.headingContainer}>
        
        <Text style={[styles.heading, { fontSize: isMobile ? 16 : 18 }]}>
          Announcements
        </Text>

        
      
{/* 
        {unreadCount > 0 && (
          <Text style={[styles.unreadCount, { fontSize: isMobile ? 12 : 14 }]}>
            {unreadCount} Unread
          </Text> */}
        {/* )} */}
      </View>
       <ScrollView
        horizontal={isMobile}
        style={{ width: '100%' }}
        contentContainerStyle={{ minWidth: isMobile ? 900 : '100%' }}
        showsHorizontalScrollIndicator={isMobile}
        nestedScrollEnabled={isMobile}
        bounces={isMobile}
        scrollEnabled={isMobile} 
      >

      <View style={[styles.tableWrapper, { width: '100%' }]}>
        <View style={{ width: '100%' }}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={[styles.tableCell, styles.tableHeaderText, { flex: 1, fontSize: isMobile ? 12 : 14, padding: isMobile ? 6 : 8 }]}>
              Date
            </Text>
            <Text style={[styles.tableCell, styles.tableHeaderText, { flex: 2, fontSize: isMobile ? 12 : 14, padding: isMobile ? 6 : 8 }]}>
              Announcement
            </Text>
            <Text style={[styles.tableCell, styles.tableHeaderText, { flex: 1, fontSize: isMobile ? 12 : 14, padding: isMobile ? 6 : 8 }]}>
              Created By
            </Text>
            <Text style={[styles.tableCell, styles.tableHeaderText, { flex: 1, fontSize: isMobile ? 12 : 14, padding: isMobile ? 6 : 8 }]}>
              Actions
            </Text>
          </View>
          {announcements.length > 0 ? (
            announcements.map((announcement, index) => (
              <View
                key={index}
                style={[
                  styles.tableRow,
                  index % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd,
                  announcement.isViewed === 0 && styles.unreadRow,
                ]}
              >
                <Text
                  style={[
                    styles.tableCell,
                    { flex: 1, fontSize: isMobile ? 12 : 14, padding: isMobile ? 6 : 8, textAlign: 'center', color: announcement.isViewed === 0 ? '#f44336' : '#333' },
                  ]}
                  accessible={true}
                  accessibilityLabel={`created_date ${announcement.created_date}`}
                >
                  {announcement.created_date}
                </Text>
                <Text
                  style={[
                    styles.tableCell,
                    { flex: 2, fontSize: isMobile ? 12 : 14, padding: isMobile ? 6 : 8, textAlign: 'center', color: announcement.isViewed === 0 ? '#f44336' : '#333' },
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
                    styles.tableCell,
                    { flex: 1, fontSize: isMobile ? 12 : 14, padding: isMobile ? 6 : 8, textAlign: 'center', color: announcement.isViewed === 0 ? '#f44336' : '#333' },
                  ]}
                  accessible={true}
                  accessibilityLabel={`Created by ${announcement.createdBy_Name}`}
                  numberOfLines={3}
                  ellipsizeMode="tail"
                >
                  {announcement.createdBy_Name}
                </Text>
                <View
                  style={[
                    styles.tableCell,
                    { flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: isMobile ? 6 : 8 },
                  ]}
                  accessible={true}
                  accessibilityLabel="Actions"
                >
                  <TouchableOpacity
                    // style={[styles.actionButton, styles.viewButton]}
                     style={[styles.actionButtonLM, { padding: isMobile ? 6 : 6, backgroundColor: 'lightgreen' }]}
                    onPress={() => handleView(announcement)}
                  >

                   
                                                  <Image
                                                        source={images.view}
                                                        style={styles.pencilIconLM}
                                                        onError={() => console.warn('Failed to load view icon')}
                                                                   />
                  </TouchableOpacity>
                  <TouchableOpacity
                    // style={[styles.actionButton, styles.editButton]}
                     style={[styles.actionButtonLM, styles.editButtonLM, { padding: isMobile ? 6 : 6, marginRight: 4 , opacity:0.2,}]}
              
                    onPress={() => handleEdit(announcement)}
                    disabled={true}

                  >
                     <Image source={images.pencil} style={[styles.pencilIconLM]} />
                  </TouchableOpacity>

                  <TouchableOpacity
                    // style={[styles.actionButton, styles.deleteButton]}
style={[styles.actionButtonLM, {  backgroundColor: '#ff0800' , opacity:0.2,}]}
                    onPress={() => handleDelete(announcement.id)}
                    disabled={true}
                  >
                    <Image
                                                                    source={images.deleteIcon}
                                                                    style={styles.pencilIconLM}
                                                                     
                                                                    onError={() => console.warn('Failed to load delete icon')}
                                                                  />
                                                                 
                  </TouchableOpacity>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.tableRow}>
              <Text
                style={[styles.tableCell, { flex: 1, fontSize: isMobile ? 12 : 14, padding: isMobile ? 6 : 8, textAlign: 'center' }]}
                accessible={true}
                accessibilityLabel="No announcements available"
              >
                No announcements available
              </Text>
            </View>
          )}
        </View>
      </View>
      </ScrollView>
      <TouchableOpacity
        style={[styles.newAnnouncementButton, { width: isMobile ? '90%' : '22%' , opacity:0.2,}]}
        onPress={() => {
          setForm({ id: null, content_Text: '', createdBy_Name: '', content_Title: '', content_Type: 'General', roleId: '-1', departmentId: '-1', programId: '-1' });
          setIsFormVisible(true);
        }}

        disabled={true}
      >
        <Text style={styles.newAnnouncementText}>New Announcement</Text>
      </TouchableOpacity>


      
       
               
    </View>
  ); 

 
   const renderAnnouncementForm = () => {
  // Filter programs based on selected department
  const filteredPrograms = form.departmentId === '-1'
    ? centralDataAdmin.programs
    : centralDataAdmin.programs.filter(program => program.DepartmentId === parseInt(form.departmentId));

  // Debugging: Log the filtered programs to verify
  console.log('Selected DepartmentId:', form.departmentId);
  console.log('Filtered Programs:', filteredPrograms);

  return (
  <CustomModal
    visible={isFormVisible}
    onRequestClose={() => setIsFormVisible(false)}
    title={form.id ? 'Edit Announcement' : 'Create Announcement'}
    buttons={[
     
      {
        text: 'Save',
        onPress: handleSaveAnnouncement,
        style: [styles.actionButton, styles.saveButton],
        textStyle: styles.actionText,
      },
       {
        text: 'Cancel',
        onPress: () => {
          setForm({ id: null, content_Text: '', createdBy_Name: '', content_Title: '', content_Type: 'General', roleId: '-1', departmentId: '-1', programId: '-1' });
          setIsFormVisible(false);
        },
        style: [styles.actionButton, styles.closeButton],
        textStyle: styles.actionText,
      },
    ]}
    type="form"
    isMobile={isMobile}
  >


<View style={[styles.pickerRow, { flexDirection: isMobile? "column ": 'row', marginBottom: 15 }]}>
      <View style={[styles.dropdownWrapper, { flex: 0.33, marginRight: 5 }]}>
        <Text style={[styles.dropdownLabel, { fontSize: isMobile ? 14 : 16 }]}>Select Department:</Text>
        <Picker
                    selectedValue={form.departmentId}
                    style={[styles.dropdown, { width: '100%' }]}
                    onValueChange={(itemValue) => {
                      // Update departmentId and reset programId
                      setForm({ ...form, departmentId: itemValue, programId: '-1' });
                    }}
                  >
          <Picker.Item label="All Departments" value="-1" />
                     {centralDataAdmin.departments.map((department) => (
                       <Picker.Item
                         key={department.DepartmentId}
                         label={department.DepartmentName}
                         value={department.DepartmentId.toString()}
                       />
                     ))}
                   </Picker>
      </View>
      <View style={[styles.dropdownWrapper, { flex: 0.33, marginHorizontal: 5 }]}>
        <Text style={[styles.dropdownLabel, { fontSize: isMobile ? 14 : 16 }]}>Select Program:</Text>
        <Picker
          selectedValue={form.programId}
          style={[styles.dropdown, { width: '100%' }]}
          onValueChange={(itemValue) => setForm({ ...form, programId: itemValue })}
        >
          <Picker.Item label="All Programs" value="-1" />
                      {filteredPrograms.length > 0 ? (
                        filteredPrograms.map((program) => (
                          <Picker.Item
                            key={program.ProgramId}
                            label={program.ProgramName}
                            value={program.ProgramId.toString()}
                          />
                        ))
                      ) : (
                        <Picker.Item label="No Programs Available" value="-1" />
                      )}
                    </Picker>
      </View>
      <View style={[styles.dropdownWrapper, { flex: 0.33, marginLeft: 5 }]}>
        <Text style={[styles.dropdownLabel, { fontSize: isMobile ? 14 : 16 }]}>Select Role:</Text>
        <Picker
          selectedValue={form.roleId}
          style={[styles.dropdown, { width: '100%' }]}
          onValueChange={(itemValue) => setForm({ ...form, roleId: itemValue })}
        >
          <Picker.Item label="All Roles" value="-1" />
                      {centralDataAdmin.roles.map((role) => (
                        <Picker.Item
                          key={role.RoleId}
                          label={role.RoleName}
                          value={role.RoleId.toString()}
                        />
                      ))}
                    </Picker>
      </View>
    </View>
    <View style={[styles.pickerRow, { flexDirection: 'row', marginBottom: 15 }]}>
      <View style={[styles.dropdownWrapper, { flex: 1 }]}>
        <Text style={[styles.dropdownLabel, { fontSize: isMobile ? 14 : 16 }]}>Select Type:</Text>
        <Picker
          selectedValue={form.content_Type}
          style={[styles.dropdown, { width: '100%' }]}
          onValueChange={(itemValue) => setForm({ ...form, content_Type: itemValue })}
        >
          <Picker.Item label="General" value="General" />
          <Picker.Item label="News" value="News" />
          <Picker.Item label="Info" value="Info" />
        </Picker>
      </View>
    </View>
     <TextInput
      style={[styles.input_Modal]}
      placeholder="Enter announcement title"
      value={form.content_Title}
      onChangeText={(text) => setForm({ ...form, content_Title: text })}
    />
    <TextInput
      style={[styles.input_Modal, {height: 100 }]}
      placeholder="Enter announcement content"
      value={form.content_Text}
      onChangeText={(text) => setForm({ ...form, content_Text: text })}
      multiline
      numberOfLines={4}
    />
  </CustomModal>
);
};

  const renderViewModal = () => (
    <CustomModal
      visible={viewModalVisible}
      onRequestClose={() => {
        setViewModalVisible(false);
        setSelectedAnnouncement(null);
      }}
      title={selectedAnnouncement?.content_Title || 'Announcement Details'}
      buttons={
        selectedAnnouncement?.content_Text.startsWith('Are you sure')
          ? deleteModalButtons
          : viewModalButtons
      }
      type={selectedAnnouncement?.content_Text.startsWith('Are you sure') ? 'alert' : 'form'}
      alertType="confirmation"
      alertMessage={selectedAnnouncement?.content_Text.startsWith('Are you sure') ? selectedAnnouncement.content_Text : undefined}
      isMobile={isMobile}
    >
      {selectedAnnouncement && !selectedAnnouncement.content_Text.startsWith('Are you sure') && (
        <View style={styles.tableWrapper}>
          <View style={{ width: '100%' }}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={[styles.tableCell, styles.tableHeaderText, { flex: 1, fontSize: isMobile ? 12 : 14, padding: isMobile ? 6 : 8 }]}>
                Field
              </Text>
              <Text style={[styles.tableCell, styles.tableHeaderText, { flex: 2, fontSize: isMobile ? 12 : 14, padding: isMobile ? 6 : 8 }]}>
                Details
              </Text>
            </View>
            <View style={[styles.tableRow, styles.tableRowEven]}>
              <Text style={[styles.tableCell, { flex: 1, fontSize: isMobile ? 12 : 14, padding: isMobile ? 6 : 8, fontWeight: 'bold' }]}>
                ID
              </Text>
              <Text style={[styles.tableCell, { flex: 2, fontSize: isMobile ? 12 : 14, padding: isMobile ? 6 : 8 }]}>
                {selectedAnnouncement.id}
              </Text>
            </View>
            <View style={[styles.tableRow, styles.tableRowOdd]}>
              <Text style={[styles.tableCell, { flex: 1, fontSize: isMobile ? 12 : 14, padding: isMobile ? 6 : 8, fontWeight: 'bold' }]}>
                Title
              </Text>
              <Text style={[styles.tableCell, { flex: 2, fontSize: isMobile ? 12 : 14, padding: isMobile ? 6 : 8 }]}>
                {selectedAnnouncement.content_Title}
              </Text>
            </View>
            <View style={[styles.tableRow, styles.tableRowEven]}>
              <Text style={[styles.tableCell, { flex: 1, fontSize: isMobile ? 12 : 14, padding: isMobile ? 6 : 8, fontWeight: 'bold' }]}>
                Content
              </Text>
              <Text style={[styles.tableCell, { flex: 2, fontSize: isMobile ? 12 : 14, padding: isMobile ? 6 : 8 }]}>
                {selectedAnnouncement.content_Text}
              </Text>
            </View>
            <View style={[styles.tableRow, styles.tableRowOdd]}>
              <Text style={[styles.tableCell, { flex: 1, fontSize: isMobile ? 12 : 14, padding: isMobile ? 6 : 8, fontWeight: 'bold' }]}>
                Type
              </Text>
              <Text style={[styles.tableCell, { flex: 2, fontSize: isMobile ? 12 : 14, padding: isMobile ? 6 : 8 }]}>
                {selectedAnnouncement.content_Type}
              </Text>
            </View>
            <View style={[styles.tableRow, styles.tableRowEven]}>
              <Text style={[styles.tableCell, { flex: 1, fontSize: isMobile ? 12 : 14, padding: isMobile ? 6 : 8, fontWeight: 'bold' }]}>
                Created By
              </Text>
              <Text style={[styles.tableCell, { flex: 2, fontSize: isMobile ? 12 : 14, padding: isMobile ? 6 : 8 }]}>
                {selectedAnnouncement.createdBy_Name}
              </Text>
            </View>
            <View style={[styles.tableRow, styles.tableRowOdd]}>
              <Text style={[styles.tableCell, { flex: 1, fontSize: isMobile ? 12 : 14, padding: isMobile ? 6 : 8, fontWeight: 'bold' }]}>
                Date
              </Text>
              <Text style={[styles.tableCell, { flex: 2, fontSize: isMobile ? 12 : 14, padding: isMobile ? 6 : 8 }]}>
                {selectedAnnouncement.created_date}
              </Text>
            </View>
          </View>
        </View>
      )}
    </CustomModal>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {isMobile ? (
        <ScrollView contentContainerStyle={[styles.scrollArea, { paddingBottom: 50 }]}>
          {/* {renderHeader()} */}
          <Header isMobile={isMobile} />
          {renderAnnouncementsTable()}
        </ScrollView>
      ) : (
        <>
          {/* {renderHeader()} */}
          <Header isMobile={isMobile} />
          <ScrollView contentContainerStyle={[styles.scrollArea, { paddingBottom: 30 }]}>
            {renderAnnouncementsTable()}
          </ScrollView>
        </>
      )}
      {renderAnnouncementForm()}
      {renderViewModal()}

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

export default Announcements;