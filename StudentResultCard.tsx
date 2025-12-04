import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  useWindowDimensions,
  TouchableOpacity,
} from 'react-native';
import { useRoute } from '@react-navigation/native';

const StudentResultCard = () => {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const route = useRoute();
  const { student } = route.params;

  // State for active tab
  const [activeTab, setActiveTab] = useState('Summary');

  // Mock data for breakdowns, specific to student roll number
  const breakdownData = {
    '001': {
      quizzes: [
        { title: 'Quiz 1', date: 'Apr 5', marksObtained: 9, totalMarks: 10, remarks: 'Good' },
        { title: 'Quiz 2', date: 'Apr 12', marksObtained: 7, totalMarks: 10, remarks: 'Avg' },
      ],
      assignments: [
        { title: 'Assignment 1', submittedOn: 'Apr 3', marks: 8, totalMarks: 10, feedback: 'Well done' },
        { title: 'Assignment 2', submittedOn: 'Apr 10', marks: 6, totalMarks: 10, feedback: 'Improve formatting' },
      ],
      projects: [
        { title: 'E-Commerce App', group: 'Team Alpha', marks: '40/50', comments: 'Excellent contribution' },
      ],
      exams: [
        { type: 'Midterm', date: 'Mar 20', marksObtained: 35, totalMarks: 40 },
        { type: 'Final', date: 'May 10', marksObtained: '—', totalMarks: 50 },
      ],
    },
    '002': {
      quizzes: [
        { title: 'Quiz 1', date: 'Apr 5', marksObtained: 8, totalMarks: 10, remarks: 'Good' },
        { title: 'Quiz 2', date: 'Apr 12', marksObtained: 6, totalMarks: 10, remarks: 'Needs improvement' },
      ],
      assignments: [
        { title: 'Assignment 1', submittedOn: 'Apr 3', marks: 7, totalMarks: 10, feedback: 'Good effort' },
        { title: 'Assignment 2', submittedOn: 'Apr 10', marks: 9, totalMarks: 10, feedback: 'Excellent' },
      ],
      projects: [
        { title: 'Inventory System', group: 'Team Beta', marks: '38/50', comments: 'Solid work' },
      ],
      exams: [
        { type: 'Midterm', date: 'Mar 20', marksObtained: 32, totalMarks: 40 },
        { type: 'Final', date: 'May 10', marksObtained: '—', totalMarks: 50 },
      ],
    },
    '003': {
      quizzes: [
        { title: 'Quiz 1', date: 'Apr 5', marksObtained: 10, totalMarks: 10, remarks: 'Excellent' },
        { title: 'Quiz 2', date: 'Apr 12', marksObtained: 8, totalMarks: 10, remarks: 'Good' },
      ],
      assignments: [
        { title: 'Assignment 1', submittedOn: 'Apr 3', marks: 8, totalMarks: 10, feedback: 'Well done' },
        { title: 'Assignment 2', submittedOn: 'Apr 10', marks: 7, totalMarks: 10, feedback: 'Good structure' },
      ],
      projects: [
        { title: 'Social Media App', group: 'Team Gamma', marks: '42/50', comments: 'Innovative approach' },
      ],
      exams: [
        { type: 'Midterm', date: 'Mar 20', marksObtained: 38, totalMarks: 40 },
        { type: 'Final', date: 'May 10', marksObtained: '—', totalMarks: 50 },
      ],
    },
  };

  const studentBreakdown = breakdownData[student.rollNo] || {
    quizzes: [],
    assignments: [],
    projects: [],
    exams: [],
  };

  // Tabs
  const tabs = ['Summary', 'Quiz Breakdown', 'Assignment Breakdown', 'Project Evaluation', 'Exams'];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { padding: isMobile ? 10 : 15 }]}>
        <Text style={[styles.headerText, { fontSize: isMobile ? 18 : 22 }]}>
          Student Result Card
        </Text>
      </View>

      {/* Scrollable Body */}
      <ScrollView contentContainerStyle={[styles.scrollArea, { paddingBottom: isMobile ? 50 : 30 }]}>
        <View style={[styles.cardContainer, { maxWidth: isMobile ? '90%' : '80%' }]}>

          {/* Student Information */}
          <View style={styles.infoSection}>
            <Text style={[styles.infoTitle, { fontSize: isMobile ? 16 : 18 }]}>
              Student Information
            </Text>
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { fontSize: isMobile ? 12 : 14 }]}>Roll No:</Text>
              <Text style={[styles.infoValue, { fontSize: isMobile ? 12 : 14 }]}>{student.rollNo}</Text>
            
            
              <Text style={[styles.infoLabel, { fontSize: isMobile ? 12 : 14 }]}>Name:</Text>
              <Text style={[styles.infoValue, { fontSize: isMobile ? 12 : 14 }]}>{student.name}</Text>
          
              <Text style={[styles.infoLabel, { fontSize: isMobile ? 12 : 14 }]}>Total Marks:</Text>
              <Text style={[styles.infoValue, { fontSize: isMobile ? 12 : 14 }]}>{student.total}</Text>
            
           
              <Text style={[styles.infoLabel, { fontSize: isMobile ? 12 : 14 }]}>Grade:</Text>
              <Text style={[styles.infoValue, { fontSize: isMobile ? 12 : 14 }]}>{student.grade}</Text>
            </View>
          </View>

          {/* Tab Navigation */}
          <View style={[styles.tabRow, isMobile && { flexWrap: 'wrap', justifyContent: 'center' }]}>
            {tabs.map((tab) => (
              <TouchableOpacity
                key={tab}
                style={[
                  styles.tabButton,
                  activeTab === tab && styles.activeTab,
                  isMobile && { margin: 5, paddingHorizontal: 10 },
                ]}
                onPress={() => setActiveTab(tab)}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab === tab && styles.activeTabText,
                    { fontSize: isMobile ? 12 : 14 },
                  ]}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Tab Content */}
          {activeTab === 'Summary' && (
            <View style={styles.tabContent}>
              <Text style={[styles.heading, { fontSize: isMobile ? 16 : 18 }]}>Performance Summary</Text>
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { fontSize: isMobile ? 12 : 14 }]}>Assignment:</Text>
                <Text style={[styles.summaryValue, { fontSize: isMobile ? 12 : 14 }]}>{student.assignment1}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { fontSize: isMobile ? 12 : 14 }]}>Quiz:</Text>
                <Text style={[styles.summaryValue, { fontSize: isMobile ? 12 : 14 }]}>{student.quiz1}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { fontSize: isMobile ? 12 : 14 }]}>Midterm:</Text>
                <Text style={[styles.summaryValue, { fontSize: isMobile ? 12 : 14 }]}>{student.midterm}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { fontSize: isMobile ? 12 : 14 }]}>Final:</Text>
                <Text style={[styles.summaryValue, { fontSize: isMobile ? 12 : 14 }]}>{student.final}</Text>
              </View>
            </View>
          )}

          {activeTab === 'Quiz Breakdown' && (
            <View style={styles.tabContent}>
              <Text style={[styles.heading, { fontSize: isMobile ? 16 : 18 }]}>Quiz Breakdown</Text>
              <View style={styles.tableContainer}>
                <ScrollView horizontal style={styles.tableWrapper}>
                  <View style={styles.tableContent}>
                    <View style={[styles.tableRow, styles.tableHeader]}>
                      <Text style={[styles.tableCell, { minWidth: isMobile ? 100 : 120 }]}>Quiz Title</Text>
                      <Text style={[styles.tableCell, { minWidth: isMobile ? 80 : 100 }]}>Date</Text>
                      <Text style={[styles.tableCell, { minWidth: isMobile ? 80 : 100 }]}>Marks Obtained</Text>
                      <Text style={[styles.tableCell, { minWidth: isMobile ? 80 : 100 }]}>Total Marks</Text>
                      <Text style={[styles.tableCell, { minWidth: isMobile ? 100 : 120 }]}>Remarks</Text>
                    </View>
                    {studentBreakdown.quizzes.length > 0 ? (
                      studentBreakdown.quizzes.map((quiz, index) => (
                        <View key={index} style={styles.tableRow}>
                          <Text style={[styles.tableCell, { minWidth: isMobile ? 100 : 120, fontSize: isMobile ? 10 : 12 }]}>
                            {quiz.title}
                          </Text>
                          <Text style={[styles.tableCell, { minWidth: isMobile ? 80 : 100, fontSize: isMobile ? 10 : 12 }]}>
                            {quiz.date}
                          </Text>
                          <Text style={[styles.tableCell, { minWidth: isMobile ? 80 : 100, fontSize: isMobile ? 10 : 12 }]}>
                            {quiz.marksObtained}
                          </Text>
                          <Text style={[styles.tableCell, { minWidth: isMobile ? 80 : 100, fontSize: isMobile ? 10 : 12 }]}>
                            {quiz.totalMarks}
                          </Text>
                          <Text style={[styles.tableCell, { minWidth: isMobile ? 100 : 120, fontSize: isMobile ? 10 : 12 }]}>
                            {quiz.remarks}
                          </Text>
                        </View>
                      ))
                    ) : (
                      <View style={styles.tableRow}>
                        <Text style={[styles.tableCell, { minWidth: 400, fontSize: isMobile ? 12 : 14 }]}>
                          No quiz data available
                        </Text>
                      </View>
                    )}
                  </View>
                </ScrollView>
              </View>
              <Text style={[styles.summaryText, { fontSize: isMobile ? 12 : 14 }]}>
                📊 Quiz Average: {studentBreakdown.quizzes.reduce((sum, q) => sum + q.marksObtained, 0)}/{studentBreakdown.quizzes.length * 10}
              </Text>
            </View>
          )}

          {activeTab === 'Assignment Breakdown' && (
            <View style={styles.tabContent}>
              <Text style={[styles.heading, { fontSize: isMobile ? 16 : 18 }]}>Assignment Breakdown</Text>
              <View style={styles.tableContainer}>
                <ScrollView horizontal style={styles.tableWrapper}>
                  <View style={styles.tableContent}>
                    <View style={[styles.tableRow, styles.tableHeader]}>
                      <Text style={[styles.tableCell, { minWidth: isMobile ? 120 : 150 }]}>Assignment Title</Text>
                      <Text style={[styles.tableCell, { minWidth: isMobile ? 100 : 120 }]}>Submitted On</Text>
                      <Text style={[styles.tableCell, { minWidth: isMobile ? 80 : 100 }]}>Marks</Text>
                      <Text style={[styles.tableCell, { minWidth: isMobile ? 80 : 100 }]}>Total Marks</Text>
                      <Text style={[styles.tableCell, { minWidth: isMobile ? 120 : 150 }]}>Feedback</Text>
                    </View>
                    {studentBreakdown.assignments.length > 0 ? (
                      studentBreakdown.assignments.map((assignment, index) => (
                        <View key={index} style={styles.tableRow}>
                          <Text style={[styles.tableCell, { minWidth: isMobile ? 120 : 150, fontSize: isMobile ? 10 : 12 }]}>
                            {assignment.title}
                          </Text>
                          <Text style={[styles.tableCell, { minWidth: isMobile ? 100 : 120, fontSize: isMobile ? 10 : 12 }]}>
                            {assignment.submittedOn}
                          </Text>
                          <Text style={[styles.tableCell, { minWidth: isMobile ? 80 : 100, fontSize: isMobile ? 10 : 12 }]}>
                            {assignment.marks}
                          </Text>
                          <Text style={[styles.tableCell, { minWidth: isMobile ? 80 : 100, fontSize: isMobile ? 10 : 12 }]}>
                            {assignment.totalMarks}
                          </Text>
                          <Text style={[styles.tableCell, { minWidth: isMobile ? 120 : 150, fontSize: isMobile ? 10 : 12 }]}>
                            {assignment.feedback}
                          </Text>
                        </View>
                      ))
                    ) : (
                      <View style={styles.tableRow}>
                        <Text style={[styles.tableCell, { minWidth: 400, fontSize: isMobile ? 12 : 14 }]}>
                          No assignment data available
                        </Text>
                      </View>
                    )}
                  </View>
                </ScrollView>
              </View>
            </View>
          )}

          {activeTab === 'Project Evaluation' && (
            <View style={styles.tabContent}>
              <Text style={[styles.heading, { fontSize: isMobile ? 16 : 18 }]}>Project Evaluation</Text>
              <View style={styles.tableContainer}>
                <ScrollView horizontal style={styles.tableWrapper}>
                  <View style={styles.tableContent}>
                    <View style={[styles.tableRow, styles.tableHeader]}>
                      <Text style={[styles.tableCell, { minWidth: isMobile ? 120 : 150 }]}>Project Title</Text>
                      <Text style={[styles.tableCell, { minWidth: isMobile ? 100 : 120 }]}>Group</Text>
                      <Text style={[styles.tableCell, { minWidth: isMobile ? 80 : 100 }]}>Marks</Text>
                      <Text style={[styles.tableCell, { minWidth: isMobile ? 120 : 150 }]}>Comments</Text>
                    </View>
                    {studentBreakdown.projects.length > 0 ? (
                      studentBreakdown.projects.map((project, index) => (
                        <View key={index} style={styles.tableRow}>
                          <Text style={[styles.tableCell, { minWidth: isMobile ? 120 : 150, fontSize: isMobile ? 10 : 12 }]}>
                            {project.title}
                          </Text>
                          <Text style={[styles.tableCell, { minWidth: isMobile ? 100 : 120, fontSize: isMobile ? 10 : 12 }]}>
                            {project.group}
                          </Text>
                          <Text style={[styles.tableCell, { minWidth: isMobile ? 80 : 100, fontSize: isMobile ? 10 : 12 }]}>
                            {project.marks}
                          </Text>
                          <Text style={[styles.tableCell, { minWidth: isMobile ? 120 : 150, fontSize: isMobile ? 10 : 12 }]}>
                            {project.comments}
                          </Text>
                        </View>
                      ))
                    ) : (
                      <View style={styles.tableRow}>
                        <Text style={[styles.tableCell, { minWidth: 400, fontSize: isMobile ? 12 : 14 }]}>
                          No project data available
                        </Text>
                      </View>
                    )}
                  </View>
                </ScrollView>
              </View>
            </View>
          )}

          {activeTab === 'Exams' && (
            <View style={styles.tabContent}>
              <Text style={[styles.heading, { fontSize: isMobile ? 16 : 18 }]}>Final Exam / Midterm</Text>
              <View style={styles.tableContainer}>
                <ScrollView horizontal style={styles.tableWrapper}>
                  <View style={styles.tableContent}>
                    <View style={[styles.tableRow, styles.tableHeader]}>
                      <Text style={[styles.tableCell, { minWidth: isMobile ? 100 : 120 }]}>Exam Type</Text>
                      <Text style={[styles.tableCell, { minWidth: isMobile ? 80 : 100 }]}>Date</Text>
                      <Text style={[styles.tableCell, { minWidth: isMobile ? 80 : 100 }]}>Marks Obtained</Text>
                      <Text style={[styles.tableCell, { minWidth: isMobile ? 80 : 100 }]}>Total Marks</Text>
                    </View>
                    {studentBreakdown.exams.length > 0 ? (
                      studentBreakdown.exams.map((exam, index) => (
                        <View key={index} style={styles.tableRow}>
                          <Text style={[styles.tableCell, { minWidth: isMobile ? 100 : 120, fontSize: isMobile ? 10 : 12 }]}>
                            {exam.type}
                          </Text>
                          <Text style={[styles.tableCell, { minWidth: isMobile ? 80 : 100, fontSize: isMobile ? 10 : 12 }]}>
                            {exam.date}
                          </Text>
                          <Text style={[styles.tableCell, { minWidth: isMobile ? 80 : 100, fontSize: isMobile ? 10 : 12 }]}>
                            {exam.marksObtained}
                          </Text>
                          <Text style={[styles.tableCell, { minWidth: isMobile ? 80 : 100, fontSize: isMobile ? 10 : 12 }]}>
                            {exam.totalMarks}
                          </Text>
                        </View>
                      ))
                    ) : (
                      <View style={styles.tableRow}>
                        <Text style={[styles.tableCell, { minWidth: 400, fontSize: isMobile ? 12 : 14 }]}>
                          No exam data available
                        </Text>
                      </View>
                    )}
                  </View>
                </ScrollView>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f2a47',
  },
  header: {
    backgroundColor: '#009688',
    alignItems: 'center',
  },
  headerText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  scrollArea: {
    alignItems: 'center',
  },
  cardContainer: {
    backgroundColor: '#fff',
    padding: 4,
    borderRadius: 10,
    elevation: 4,
    marginTop: 10,
    alignSelf: 'center',
    width: 'auto',
  },
  infoSection: {
    marginBottom: 20,
    padding: 2,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  infoTitle: {
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    // justifyContent: 'space-between',
    textAlign: 'left',
    marginHorizontal: 20,
    
  },
  infoLabel: {
    fontWeight: 'bold',
    color: '#333',
    marginHorizontal: 20,
    marginLeft:50,

    
  },
  infoValue: {
    color: '#333',
    // marginHorizontal: 10,
    fontSize:20,
    
  },
  tabRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 15,
  },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 4,
    backgroundColor: '#fff',
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#333',
  },
  activeTab: {
    backgroundColor: '#4caf50',
    borderColor: '#4caf50',
  },
  tabText: {
    color: '#333',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  activeTabText: {
    color: '#fff',
  },
  tabContent: {
    marginTop: 10,
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
  tableContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tableWrapper: {
    flexGrow: 0,
  },
  tableContent: {
    alignSelf: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#333',
    flexWrap: 'wrap',
  },
  tableHeader: {
    backgroundColor: '#e0e0e0',
  },
  tableCell: {
    // flex: 1,
    padding: 4,
    fontSize: 12,
    borderRightWidth: 1,
    borderColor: '#333',
    textAlign: 'left',
  },
  summaryText: {
    marginTop: 10,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
    paddingHorizontal: 10,
  },
  summaryLabel: {
    fontWeight: 'bold',
    color: '#333',
  },
  summaryValue: {
    color: '#333',
  },
});

export default StudentResultCard;