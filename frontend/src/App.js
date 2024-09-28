import { useState, useEffect } from "react";
import MainSplitPanelsTwoSides from "./resizablePanels.js";
import CourseTable from "./userCourseList.js";
import ChatInterface from "./chatInterface.js";
import "./App.css";
import { Space, Layout, Dropdown } from "antd";
import { DownOutlined } from "@ant-design/icons";

const { Header, Content } = Layout;

const groupByTerm = (courses) => {
    if (!Array.isArray(courses)) {
        return {};
    }

    return courses.reduce((acc, course) => {
        if (!acc[course.course_term]) {
            acc[course.course_term] = [];
        }
        acc[course.course_term].push(course);
        return acc;
    }, {});
};

function signOut(){
	console.log("Signed out.")
}

function App() {
    const [current_user_course_list, set_current_user_course_list] = useState(
        []
    );

    const [groupedCourses, setGroupedCourses] = useState({});

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

    useEffect(() => {
        // Fetch the JSON file from the public folder
        fetch("/dummy_data.json")
            .then((response) => response.json())
            .then((data) => {
                // Update current user data after fetch
                set_current_user_course_list(data.schedule);
                console.log(data);
            })
            .catch((error) =>
                console.error("Error fetching the JSON data:", error)
            );
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

        setCourseListMaxWidth(maxCourseCount * 130 + 100);
    }, [groupedCourses]);

    const userInfoItems = [
        {
            label: (
                <p className="UserInfoRow">
                    <strong>Student Number: </strong> 1006751267
                </p>
            ),
            key: "0",
			style: {
				cursor: 'default'
			}
        },
        {
            label: (
                <p className="UserInfoRow">
                    <strong>Student Email: </strong>{" "}
                    demeng.chen@mail.utoronto.ca
                </p>
            ),
            key: "1",
			style: {
				cursor: 'default'
			}
        },
        {
            label: (
                <p className="UserInfoRow">
                    <strong>Student Gender: </strong> Male
                </p>
            ),
            key: "2",
			style: {
				cursor: 'default'
			}
        },
        {
            label: (
                <p className="UserInfoRow">
                    <strong>Degree Post: </strong> 
					<span>AECPEBASC</span>
                </p>
            ),
            key: "3",
            type: "info",
			style: {
				cursor: 'default'
			}
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

    console.log("CI/CD testing 2.")

    return (
        <div className="App" style={{ padding: "5px" }}>
            <Layout>
                <Header className="AppHeader">
                    <strong style={{ fontSize: "20pt" }}>
                        ECE496 Capstone Project - Smartgellan{" "}
                    </strong>

                    <div
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <div
                            className="UserAvatar"
                            style={{ marginRight: "10px" }}
                        >
                            DC
                        </div>
                        <Dropdown
                            menu={{
                                items: userInfoItems,
                            }}
                            trigger={["click"]}
							placement="bottomRight"
                            arrow
                        >
                            <Space>
                                <strong style={{ cursor: "pointer" }}>
                                    Demeng Chen
                                </strong>
                                <DownOutlined style={{ cursor: "pointer" }} />
                            </Space>
                        </Dropdown>
                    </div>
                </Header>
                <Content>
                    <MainSplitPanelsTwoSides
                        minWidth={courseListMinWidth}
                        maxWidth={courseListMaxWidth}
                        left={<CourseTable groupedCourses={groupedCourses} />}
                        right={
                            <ChatInterface
                                chatHistory={chatHistory}
                                setChatHistory={setChatHistory}
                            />
                        }
                    />
                </Content>
            </Layout>
        </div>
    );
}

export default App;
