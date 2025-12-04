import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { TouchableOpacity, Text } from "react-native";
// import Icon from "react-native-vector-icons/MaterialIcons";
import HomeScreen from "./HomeScreen";
import ResultCard from "./ResultCard";
// import APS from "./APS";
// import CourseRegistration from "./CourseRegistration";
// import Fees from "./Fees";
// import StudentLogin from "./StudentLogin";
// import profile from "./profile";
import TeacherPortal from "./TeacherPortal";
import MarksEntryScreen from "./MarksEntryScreen";
// import StudentGrades from "./StudentGrades";
import AddNewGroupScreen from "./AddNewGroupScreen";
import SDB from "./SDB";
import Announcements from "./Announcements";
import StudentResultCard from "./StudentResultCard";
import TeacherProfile from "./TeacherProfile";
import HODDashboard from "./HODDashboard";
import DeanDashboard from "./DeanDashboard";
import TeacherLogin from "./TeacherLogin";
//import MarksEntrySummaryScreen from "./MarksEntrySummaryScreen";

// import DashboardSummary from "./DashboardSummary";


import TeacherLogout from "./TeacherLogout";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <Stack.Navigator
    
      initialRouteName="HomeScreen"
      screenOptions={({ navigation, route }) => ({
        headerRight: () =>
          route.name !== "HomeScreen" ? ( // Hide Home button on Home screen
            <TouchableOpacity 
              onPress={() => navigation.navigate("HomeScreen")} 
              style={{ flexDirection: "row", alignItems: "center", marginRight: 6}}
            >
              
              <Text style={{ marginLeft: 2, fontSize: 15, color: "#007AFF", fontWeight: "bold" }}>Home</Text>
            </TouchableOpacity>
          ) : null,
      })}
    >
      {/* <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }}/>
      <Stack.Screen name="UniversityPortal" component={UniversityPortal} options={{ headerShown: false }} />
      <Stack.Screen name="CourseRegistration" component={CourseRegistration} options={{ headerShown: false }} />
      
      
     
      <Stack.Screen name="TeacherPortal" component={TeacherPortal} options={{ headerShown: false }}/>
      <Stack.Screen name="CourseManagement" component={CourseManagement} options={{ headerShown: false }}/>
      
      
      
      
     
       */}
       {/* <Stack.Screen name="StudentLogin" component={StudentLogin} options={{ headerShown: false }}/> */}
       <Stack.Screen name="TeacherLogin" component={TeacherLogin} options={{ headerShown: false }}/>
        <Stack.Screen name="TeacherProfile" component={TeacherProfile} options={{ headerShown: false }}/>
       <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ headerShown: false }}/>
       <Stack.Screen name="MarksEntryScreen" component={MarksEntryScreen} options={{ headerShown: false }}/>
       {/* <Stack.Screen name="MarksEntrySummaryScreen" component={MarksEntrySummaryScreen} options={{ headerShown: false }}/> */}
 {/* <Stack.Screen name="DashboardSummary" component={DashboardSummary} options={{ headerShown: false }}/> */}
       <Stack.Screen name="StudentResultCard" component={StudentResultCard} options={{ headerShown: false }}/>
       <Stack.Screen name="Announcements" component={Announcements} options={{ headerShown: false }}/>
       <Stack.Screen name="SDB" component={SDB} options={{ headerShown: false }}/>
       <Stack.Screen name="HODDashboard" component={HODDashboard} options={{ headerShown: false }}/>
       <Stack.Screen name="DeanDashboard" component={DeanDashboard} options={{ headerShown: false }}/>
       {/* <Stack.Screen name="CourseRegistration" component={CourseRegistration} options={{ headerShown: false }}/> */}
       <Stack.Screen name="TeacherPortal" component={TeacherPortal} options={{ headerShown: false }}/>
       <Stack.Screen name="AddNewGroupScreen" component={AddNewGroupScreen} options={{ headerShown: false }}/>
       {/* <Stack.Screen name="StudentPortal" component={StudentPortal} options={{ headerShown: false }}/> */}
       {/* <Stack.Screen name="Fees" component={Fees} options={{ headerShown: false }}/> */}
       <Stack.Screen name="ResultCard" component={ResultCard} options={{ headerShown: false }} />
       {/* <Stack.Screen name="APS" component={APS} options={{ headerShown: false }} /> */}
       {/* <Stack.Screen name="profile" component={profile} options={{ headerShown: false }}/> */}

       {/* <Stack.Screen name="StudentGrades" component={StudentGrades} options={{ headerShown: false }}/> */}

       <Stack.Screen name="TeacherLogout" component={TeacherLogout} options={{ headerShown: false }}/>

    </Stack.Navigator>
  );
}