import { useState, useEffect, useRef } from "react";
import MainSplitPanelsTwoSides from "./resizablePanels.js";
import CourseTable from "./userCourseList.js";
import ChatInterface from "./chatInterface.js";
import "./App.css";
import { Space, Layout, Dropdown, Typography } from "antd";
import { DownOutlined } from "@ant-design/icons";
import axios from 'axios';
import { useNavigate } from "react-router-dom";


const { Header, Content } = Layout;
const { Title } = Typography;

const groupByTerm = (courses) => {
    if (!Array.isArray(courses)) {
        return {};
    }

    return courses.reduce((acc, course) => {
        if (!acc[course.term]) {
            acc[course.term] = [];
        }
        acc[course.term].push(course);
        return acc;
    }, {});
};

function signOut() {
    console.log("Signed out.");
}

function App() {
    const navigate = useNavigate();

    const [current_user_course_list, set_current_user_course_list] = useState([]);
    const [currentUserInfo, setCurrentUserInfo] = useState({
        "student_number": 1006751267,
        "name": "Demeng Chen",
        "email": "demeng.chen@mail.utoronto.ca",
        "degree": "AECPEBASC",
        "gender": "Male",
        "program": ""
    });

    const [groupedCourses, setGroupedCourses] = useState({});
    const [queryCourses, setQueryCourses] = useState([]);

    // Draggable Course Card State
    const draggingCard = useRef(null);

    const [chatHistory, setChatHistory] = useState([
        {
            role: "assistant",
            content: "Hi! How can I assist you today?",
        },
        {
            role: "user",
            content: "What's the tallest mountain?",
        },
        {
            role: "assistant",
            content:
                "The tallest mountain in the world is Mount Everest. It is located in the Himalayas on the border between Nepal and the Tibet Autonomous Region of China. Mount Everest's peak reaches an elevation of approximately 8,848.86 meters (29,031.7 feet) above sea level, making it the highest point on Earth.",
        },
    ]);

    const [courseListMaxWidth, setCourseListMaxWidth] = useState(100);
    const courseListMinWidth = 3 * 130 + 100;
    const courseListDefaultWidth = 6 * 130 + 100;

    useEffect(() => {
        // Fetch the JSON file from the public folder
        axios.post('/api/', {
            request: 'get_user_info',
            payload: {
                utorid: 'wangw362', 
            }
        }).then(response => {
            const userInfo = response.data;
            console.log(userInfo);

            setCurrentUserInfo({
                ...userInfo,
                "student_initial": userInfo.name.split(' ').map((i)=>(i[0].toUpperCase()))
            });
            set_current_user_course_list(userInfo.courses);
            // set_current_user_course_list(JSON.parse(userInfo.courseList));
        }).catch(error => {
            if (error.response) {
                console.log(error.response.data);
                // alert(JSON.stringify(error.response.data));
            } else {
                console.error('Error', error);
            }
        });

        fetch("/dummy_data.json")
            .then((response) => response.json())
            .then((data) => {
                // Update current user data after fetch
                setCurrentUserInfo({
                    "student_number": data['Student Number'],
                    "name": data.Name,
                    "email": data.Email,
                    "altemail": data['Alternative Email'],
                    "degree": data['Degree Post'],
                    "gender": data.Gender,
                    "program": data['Graduation Program'],
                })
                set_current_user_course_list(data.schedule);
            })
            .catch((error) => console.error("Error fetching the JSON data:", error));
    }, []);

    useEffect(() => {
        setGroupedCourses(groupByTerm(current_user_course_list));
    }, [current_user_course_list]);

    useEffect(() => {
        var maxCourseCount = 1;
        for (var cur_courses of Object.values(groupedCourses)) {
            if (cur_courses.length > maxCourseCount) {
                maxCourseCount = cur_courses.length;
            }
        }

        setCourseListMaxWidth((maxCourseCount + 1) * 130 + 100);
    }, [groupedCourses]);

    const userInfoItems = [
        {
            label: (
                <p className="UserInfoRow">
                    <strong>Student Number: </strong> {currentUserInfo.student_number}
                </p>
            ),
            key: "0",
            style: {
                cursor: "default",
            },
        },
        {
            label: (
                <p className="UserInfoRow">
                    <strong>Student Email: </strong> {currentUserInfo.email}
                </p>
            ),
            key: "1",
            style: {
                cursor: "default",
            },
        },
        {
            label: (
                <p className="UserInfoRow">
                    <strong>Student Gender: </strong> {currentUserInfo.gender}
                </p>
            ),
            key: "2",
            style: {
                cursor: "default",
            },
        },
        {
            label: (
                <p className="UserInfoRow">
                    <strong>Degree Post: </strong>
                    <span>{currentUserInfo.degree}</span>
                </p>
            ),
            key: "3",
            type: "info",
            style: {
                cursor: "default",
            },
        },
        {
            type: "divider",
        },
        {
            label: "Sign Out",
            onClick: signOut,
            key: "4",
        },
    ];

    return (
        <div className="App" style={{ padding: "5px"}}>
            <Layout>
                <Header className="AppHeader">
                    <strong style={{ fontSize: "20pt", cursor: 'pointer' }} onClick={()=>{navigate('/')}}>ECE496 Capstone Project - Smartgellan </strong>

                    <div
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <div className="UserAvatar" style={{ marginRight: "10px" }}>
                        {currentUserInfo.name.split(' ').map((i)=>(i[0].toUpperCase()))}
                        </div>
                        <Dropdown
                            menu={{
                                items: userInfoItems,
                            }}
                            trigger={["click"]}
                            placement="bottomRight"
                            arrow
                            // width={'500px'}
                            style={{width: '500px'}}
                        >
                            <Space>
                                <strong style={{ cursor: "pointer" }}>{currentUserInfo.name}</strong>
                                <DownOutlined style={{ cursor: "pointer" }} />
                            </Space>
                        </Dropdown>
                    </div>
                </Header>
                <Content style={{height: 'calc(100vh - 77px)'}}>
                    <MainSplitPanelsTwoSides
                        minWidth={courseListMinWidth}
                        maxWidth={courseListMaxWidth}
                        defaultWidth={courseListDefaultWidth}
                        left={
                            <CourseTable
                                groupedCourses={groupedCourses}
                                draggingCard={draggingCard}
                                queryCourses={queryCourses}
                                setQueryCourses={setQueryCourses}
                                userInfo={currentUserInfo}
                            />
                        }
                        right={
                            <ChatInterface
                                chatHistory={chatHistory}
                                setChatHistory={setChatHistory}
                                draggingCourse={draggingCard}
                                courseList={groupedCourses}
                                queryCourses={queryCourses}
                                setQueryCourses={setQueryCourses}
                                userInfo={currentUserInfo}
                            />
                        }
                    />
                </Content>
            </Layout>
        </div>  
    );
}

export default App;
