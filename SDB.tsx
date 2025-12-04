// SDB.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';

import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Navigation types (copied from TeacherPortal for standalone use)
type RootStackParamList = {
  TeacherPortal: undefined;
  SDB: undefined;
  // Include other routes if needed
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Define GDB Answer type
interface GDBAnswer {
  id: string;
  regNo: string;
  studentName: string;
  submittedOn: string;
}

const SDB = () => {
  const navigation = useNavigation<NavigationProp>();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  // Sample data for GDB answers (same as in the image)
  const gdbAnswers: GDBAnswer[] = [
    { id: '1', regNo: 'FUI/FA13-BCS-002/ISB', studentName: 'Muhammad Hamza', submittedOn: 'Submitted on 23/4/12' },
    { id: '2', regNo: 'FUI/FA13-BCS-009/ISB', studentName: 'Tehseen Qaiser', submittedOn: 'Unable to understand question 3' },
    { id: '3', regNo: 'FUI/FA13-BCS-039/ISB', studentName: 'Sadaq Amin', submittedOn: '---' },
    { id: '4', regNo: 'FUI/FA13-BCS-057/ISB', studentName: 'Amni Nabi', submittedOn: '---' },
    { id: '5', regNo: 'FUI/FA13-BCS-120/ISB', studentName: 'Sheharyar Ali', submittedOn: '---' },
    { id: '6', regNo: 'FUI/FA13-BCS-162/ISB', studentName: 'Muhammad Jahangir Dar', submittedOn: '---' },
    { id: '7', regNo: 'FUI/FA13-BCS-227/ISB', studentName: 'Albaallah Waqar', submittedOn: '---' },
    { id: '8', regNo: 'FUI/FA14-BCS-003/ISB', studentName: 'M Shahzaib', submittedOn: '---' },
    { id: '9', regNo: 'FUI/FA14-BCS-005/ISB', studentName: 'Hira Saleem', submittedOn: '---' },
    { id: '10', regNo: 'FUI/FA14-BCS-007/ISB', studentName: 'Muhammad Hider Amin', submittedOn: '---' },
    { id: '11', regNo: 'FUI/FA14-BCS-008/ISB', studentName: 'Mutaba Bin Khalid', submittedOn: '---' },
    { id: '12', regNo: 'FUI/FA14-BCS-010/ISB', studentName: 'Aftab Arshad', submittedOn: '---' },
    { id: '13', regNo: 'FUI/FA14-BCS-011/ISB', studentName: 'Beenish Khan', submittedOn: '---' },
  ];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={[styles.scrollArea, { paddingBottom: 10 }]}>
        <View style={[styles.sectionContainer, { width: isMobile ? '80%' : '60%' }]}>
          <View style={styles.headerRow}>
            <TouchableOpacity
              accessible={true}
              accessibilityLabel="Back to Teacher Portal"
              accessibilityRole="button"
              style={[styles.actionButton, { backgroundColor: '#ff9800' }]}
              onPress={() => navigation.navigate('TeacherPortal')}
            >
              <Icon name="arrow-left" size={isMobile ? 16 : 20} color="#fff" />
              <Text style={[styles.actionText, { fontSize: isMobile ? 12 : 14 }]}>Back</Text>
            </TouchableOpacity>
            <Text style={[styles.heading, { fontSize: isMobile ? 16 : 20 }]}>
              GDB 1 Students Answers
            </Text>
          </View>
          <ScrollView
            style={[styles.tableWrapper, { width: '100%' }]}
            nestedScrollEnabled={true}
            bounces={false}
          >
            <View>
              <View style={[styles.tableRow, styles.tableHeader, { backgroundColor: '#00C4B4' }]}>
                <Text style={[styles.tableCell, { width: isMobile ? 50 : 80, fontSize: isMobile ? 12 : 14, color: '#fff' }]}>S.No</Text>
                <Text style={[styles.tableCell, { width: isMobile ? 150 : 250, fontSize: isMobile ? 12 : 14, color: '#fff' }]}>Reg#</Text>
                <Text style={[styles.tableCell, { width: isMobile ? 150 : 300, fontSize: isMobile ? 12 : 14, color: '#fff' }]}>Student Name</Text>
                <Text style={[styles.tableCell, { width: isMobile ? 100 : 200, fontSize: isMobile ? 12 : 14, color: '#fff' }]}>Responses</Text>
              </View>
              {gdbAnswers.length > 0 ? (
                gdbAnswers.map((answer) => (
                  <View key={answer.id} style={[styles.tableRow, { backgroundColor: '#F5F6F5' }]}>
                    <Text
                      style={[styles.tableCell, { width: isMobile ? 50 : 80, fontSize: isMobile ? 10 : 12 }]}
                      accessible={true}
                      accessibilityLabel={`Serial number ${answer.id}`}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {answer.id}
                    </Text>
                    <Text
                      style={[styles.tableCell, { width: isMobile ? 150 : 250, fontSize: isMobile ? 10 : 12 }]}
                      accessible={true}
                      accessibilityLabel={`Registration number ${answer.regNo}`}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {answer.regNo}
                    </Text>
                    <Text
                      style={[styles.tableCell, { width: isMobile ? 150 : 300, fontSize: isMobile ? 10 : 12 }]}
                      accessible={true}
                      accessibilityLabel={`Student name ${answer.studentName}`}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {answer.studentName}
                    </Text>
                    <Text
                      style={[styles.tableCell, { width: isMobile ? 100 : 200, fontSize: isMobile ? 10 : 12 }]}
                      accessible={true}
                      accessibilityLabel={`Submitted on ${answer.submittedOn}`}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {answer.submittedOn}
                    </Text>
                  </View>
                ))
              ) : (
                <View style={styles.tableRow}>
                  <Text
                    style={[styles.tableCell, { width: '100%', fontSize: isMobile ? 12 : 14 }]}
                    accessible={true}
                    accessibilityLabel="No GDB answers available"
                  >
                    No GDB answers available
                  </Text>
                </View>
              )}
            </View>
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
};

// Styles (adapted from TeacherPortal for consistency)
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0f2a47',
    flex: 1,
  },
  scrollArea: {
    alignItems: 'center',
  },
  sectionContainer: {
    backgroundColor: '#fff',
    padding: 2,
    borderRadius: 8,
    elevation: 4,
    marginTop: 15,
    marginBottom: 10,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  heading: {
    fontWeight: 'bold',
    color: '#333',
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
  tableHeader: {
    backgroundColor: '#cbc9c9',
    borderBottomWidth: 2,
    borderBottomColor: '#009688',
  },
  tableCell: {
    padding: 4,
    borderRightWidth: 1,
    borderColor: '#333',
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  actionButton: {
    backgroundColor: '#3f51b5',
    padding: 4,
    borderRadius: 6,
    alignItems: 'center',
    flexDirection: 'row',
  },
  actionText: {
    color: '#fff',
    fontWeight: '500',
    marginLeft: 8,
  },
});

export default SDB;