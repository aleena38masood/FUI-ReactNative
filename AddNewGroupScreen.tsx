import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
  TextInput,
} from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';

import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Define navigation params for TypeScript
type RootStackParamList = {
  TeacherPortal: undefined;
  TeacherProfile: undefined;
  Announcements: undefined;
  StudentLogin: undefined;
  Sessionals: undefined;
  StudentResultCard: { student: Student };
  AddNewGroupScreen: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Define Student type (same as in TeacherPortal)
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

const AddNewGroupScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  // Sample student data (you can replace this with actual data from TeacherPortal)
  const allStudents: Student[] = [
    { id: 'S001', name: 'Ahmed Khan', status: 'Present', rollNo: '001', email: 'ahmed@email.com' },
    { id: 'S002', name: 'Sara Ali', status: 'Absent', rollNo: '002', email: 'sara@email.com' },
    { id: 'S003', name: 'Omar Malik', status: 'On Leave', rollNo: '003', email: 'omar@email.com' },
    { id: 'S004', name: 'Dua Khan', status: 'Present', rollNo: '004', email: 'dua@email.com' },
    { id: 'S005', name: 'Maheen', status: 'Present', rollNo: '005', email: 'maheen@email.com' },
  ];

  // State for group name and description
  const [groupName, setGroupName] = useState<string>('');
  const [groupDescription, setGroupDescription] = useState<string>('');

  // State to track selected students
  const [selectedStudents, setSelectedStudents] = useState<Student[]>([]);

  // Students available to display in the left table (excluding selected ones)
  const availableStudents = allStudents.filter(
    (student) => !selectedStudents.some((selected) => selected.id === student.id)
  );

  // Handle checkbox toggle
  const handleCheckboxToggle = (student: Student) => {
    if (selectedStudents.some((s) => s.id === student.id)) {
      setSelectedStudents(selectedStudents.filter((s) => s.id !== student.id));
    } else {
      setSelectedStudents([...selectedStudents, student]);
    }
  };

  // Navigate back to TeacherPortal
  const handleBackPress = () => {
    navigation.navigate('TeacherPortal');
  };

  // Save the group
  const handleSaveGroup = () => {
    if (!groupName.trim()) {
      alert('Please enter a group name.');
      return;
    }
    console.log('Saving group:', {
      name: groupName,
      description: groupDescription,
      students: selectedStudents,
    });
    navigation.navigate('TeacherPortal');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          accessible={true}
          accessibilityLabel="Back to Teacher Portal"
          accessibilityRole="button"
          style={styles.backButton}
          onPress={handleBackPress}
        >
          <Icon name="arrow-left" size={isMobile ? 20 : 24} color="#fff" />
          <Text style={[styles.backText, { fontSize: isMobile ? 14 : 16 }]}>Back</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { fontSize: isMobile ? 18 : 24 }]}>Add New Group</Text>
        <TouchableOpacity
          accessible={true}
          accessibilityLabel="Save group"
          accessibilityRole="button"
          style={styles.saveButton}
          onPress={handleSaveGroup}
        >
          <Text style={[styles.saveText, { fontSize: isMobile ? 14 : 16 }]}>Save</Text>
        </TouchableOpacity>
      </View>

      {/* Input Container for Group Name and Description */}
      <View style={[styles.inputContainer, isMobile && { padding: 5 }]}>
        <View style={styles.inputRow}>
          <Text style={[styles.inputLabel, { fontSize: isMobile ? 14 : 16 }]}>Group Name</Text>
          <TextInput
            style={[styles.input, { fontSize: isMobile ? 12 : 14 }]}
            value={groupName}
            onChangeText={setGroupName}
            placeholder="Enter group name"
            placeholderTextColor="#999"
            accessible={true}
            accessibilityLabel="Group name input"
          />
        </View>
        <View style={styles.inputRow}>
          <Text style={[styles.inputLabel, { fontSize: isMobile ? 14 : 16 }]}>Description</Text>
          <TextInput
            style={[styles.input, { fontSize: isMobile ? 12 : 14 }]}
            value={groupDescription}
            onChangeText={setGroupDescription}
            placeholder="Enter group description"
            placeholderTextColor="#999"
            multiline
            numberOfLines={3}
            accessible={true}
            accessibilityLabel="Group description input"
          />
        </View>
      </View>

      {/* Tables Container */}
      <View style={[styles.tablesContainer, isMobile && { flexDirection: 'column' }]}>
        {/* Left Table: Available Students */}
        <View style={[styles.tableSection, isMobile && { width: '100%' }]}>
          <Text style={[styles.tableTitle, { fontSize: isMobile ? 16 : 18 }]}>Available Students</Text>
          <ScrollView
            style={[styles.tableWrapper, { width: '100%' }]}
            nestedScrollEnabled={true}
            bounces={false}
          >
            <View>
              <View style={[styles.tableRow, styles.tableHeader1]}>
                <Text style={[styles.tableCell1, { width: isMobile ? 50 : 100, fontSize: isMobile ? 12 : 14 }]}>Select</Text>
                <Text style={[styles.tableCell1, { width: isMobile ? 100 : 150, fontSize: isMobile ? 12 : 14 }]}>Roll No</Text>
                <Text style={[styles.tableCell1, { width: isMobile ? 150 : 250, fontSize: isMobile ? 12 : 14 }]}>Name</Text>
              </View>
              {availableStudents.length > 0 ? (
                availableStudents.map((student, index) => (
                  <View key={student.id} style={styles.tableRow}>
                    <View
                      style={[styles.tableCell1, { width: isMobile ? 50 : 100, justifyContent: 'center', alignItems: 'center' }]}
                    >
                      <TouchableOpacity
                        accessible={true}
                        accessibilityLabel={`Select student ${student.name}`}
                        accessibilityRole="checkbox"
                        onPress={() => handleCheckboxToggle(student)}
                      >
                        <Icon
                          name="checkbox-blank-outline"
                          size={isMobile ? 20 : 24}
                          color="#333"
                        />
                      </TouchableOpacity>
                    </View>
                    <Text
                      style={[styles.tableCell1, { width: isMobile ? 100 : 150, fontSize: isMobile ? 10 : 12 }]}
                      accessible={true}
                      accessibilityLabel={`Roll number ${student.rollNo}`}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {student.rollNo}
                    </Text>
                    <Text
                      style={[styles.tableCell1, { width: isMobile ? 150 : 250, fontSize: isMobile ? 10 : 12 }]}
                      accessible={true}
                      accessibilityLabel={`Student name ${student.name}`}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {student.name}
                    </Text>
                  </View>
                ))
              ) : (
                <View style={styles.tableRow}>
                  <Text
                    style={[styles.tableCell1, { width: '100%', fontSize: isMobile ? 12 : 14 }]}
                    accessible={true}
                    accessibilityLabel="No students available"
                  >
                    No students available
                  </Text>
                </View>
              )}
            </View>
          </ScrollView>
        </View>

        {/* Right Table: Selected Students */}
        <View style={[styles.tableSection, isMobile && { width: '100%', marginTop: 20 }]}>
          <Text style={[styles.tableTitle, { fontSize: isMobile ? 16 : 18 }]}>Selected Students</Text>
          <ScrollView
            style={[styles.tableWrapper, { width: '100%' }]}
            nestedScrollEnabled={true}
            bounces={false}
          >
            <View>
              <View style={[styles.tableRow, styles.tableHeader1]}>
                <Text style={[styles.tableCell1, { width: isMobile ? 100 : 150, fontSize: isMobile ? 12 : 14 }]}>Roll No</Text>
                <Text style={[styles.tableCell1, { width: isMobile ? 150 : 250, fontSize: isMobile ? 12 : 14 }]}>Name</Text>
                <Text style={[styles.tableCell1, { width: isMobile ? 50 : 100, fontSize: isMobile ? 12 : 14 }]}>Remove</Text>
              </View>
              {selectedStudents.length > 0 ? (
                selectedStudents.map((student, index) => (
                  <View key={student.id} style={styles.tableRow}>
                    <Text
                      style={[styles.tableCell1, { width: isMobile ? 100 : 150, fontSize: isMobile ? 10 : 12 }]}
                      accessible={true}
                      accessibilityLabel={`Roll number ${student.rollNo}`}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {student.rollNo}
                    </Text>
                    <Text
                      style={[styles.tableCell1, { width: isMobile ? 150 : 250, fontSize: isMobile ? 10 : 12 }]}
                      accessible={true}
                      accessibilityLabel={`Student name ${student.name}`}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {student.name}
                    </Text>
                    <View
                      style={[styles.tableCell1, { width: isMobile ? 50 : 100, justifyContent: 'center', alignItems: 'center' }]}
                    >
                      <TouchableOpacity
                        accessible={true}
                        accessibilityLabel={`Remove student ${student.name}`}
                        accessibilityRole="button"
                        onPress={() => handleCheckboxToggle(student)}
                      >
                        <Icon name="delete" size={isMobile ? 20 : 24} color="#f44336" />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))
              ) : (
                <View style={styles.tableRow}>
                  <Text
                    style={[styles.tableCell1, { width: '100%', fontSize: isMobile ? 12 : 14 }]}
                    accessible={true}
                    accessibilityLabel="No students selected"
                  >
                    No students selected
                  </Text>
                </View>
              )}
            </View>
          </ScrollView>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    
    backgroundColor: '#0f2a47',
    padding: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3f51b5',
    padding: 10,
    borderRadius: 6,
  },
  backText: {
    color: '#fff',
    marginLeft: 8,
  },
  title: {
    color: '#fff',
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#4caf50',
    padding: 10,
    borderRadius: 6,
  },
  saveText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  inputContainer: {
    backgroundColor: '#fff',
    padding: 5,
    borderRadius: 8,
    marginBottom: 20,
    elevation: 2,
    width:"60%",
    alignContent:"center",
    // alignItems:"center"
    alignSelf:"center"
  },
  inputRow: {
    marginBottom: 15,
  },
  inputLabel: {
    color: '#333',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    color: '#333',
    backgroundColor: '#f5f5f5',
  },
  tablesContainer: {
    flexDirection: 'row',
    // justifyContent: 'space-between',
    marginLeft:90
  },
  tableSection: {
    width: '38%',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    elevation: 4,
    marginLeft:70

  },
  tableTitle: {
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  tableWrapper: {
    width: '100%',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    alignItems: 'center',
    minHeight: 25,
  },
  tableHeader1: {
    backgroundColor: '#cbc9c9',
    borderBottomWidth: 2,
    borderBottomColor: '#009688',
  },
  tableCell1: {
    padding: 4,
    borderRightWidth: 1,
    borderColor: '#333',
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AddNewGroupScreen;