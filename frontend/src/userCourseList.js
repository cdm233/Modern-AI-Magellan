import React, { useState, useRef, useEffect } from "react";
import { Col, Row, Table, Divider, Button, ConfigProvider, Modal, Popover, Tabs, Input, Alert, Checkbox, Flex, Typography, List } from "antd";
import { SearchOutlined, QuestionCircleTwoTone, CloseOutlined } from "@ant-design/icons";
import { OnEmptyPopup, OnCardPopup } from "./menuPopUp";
import { format_course_data_source, alphanumerical } from "./utils";
import axios from "axios";
import ceab_default_data from "./ceab_data_default.json";
import { Link } from "react-router-dom";

// Model of a course
const dummy_course = {
    course_term: "20239",
    course_code: "PEY400Y1 Y",
    course_name: "",
    course_status: 1,
    ceab: {
        ES: 12,
        // ...
    },
    area: 1,
    type: "hss",
};

const { Title, Text } = Typography;

const courseDeliveryColumns = [
    {
        title: "Lectures",
        dataIndex: "lectures",
        key: "lectures",
        align: "center",
    },
    {
        title: "Tutorials",
        dataIndex: "tutorials",
        key: "tutorials",
        align: "center",
    },
    { title: "Labs", dataIndex: "labs", key: "labs", align: "center" },
];

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

const courseAUDistributionColumns = [
    {
        title: "Math",
        dataIndex: "MathDistribution",
        key: "Math",
        align: "center",
    },
    {
        title: "NS",
        dataIndex: "NSDistribution",
        key: "NS",
        align: "center",
    },
    {
        title: "CS",
        dataIndex: "CSDistribution",
        key: "CS",
        align: "center",
    },
    {
        title: "ES",
        dataIndex: "ESDistribution",
        key: "ES",
        align: "center",
    },
    {
        title: "ED",
        dataIndex: "EDDistribution",
        key: "ED",
        align: "center",
    },
];

const courseCEABAUColumns = [
    { title: "Math", dataIndex: "MathValue", key: "Math", align: "center" },
    { title: "NS", dataIndex: "NSValue", key: "NS", align: "center" },
    { title: "CS", dataIndex: "CSValue", key: "CS", align: "center" },
    { title: "ES", dataIndex: "ESValue", key: "ES", align: "center" },
    { title: "ED", dataIndex: "EDValue", key: "ED", align: "center" },
];

function getCourseColor(status) {
    if (status === 0) {
        return "black";
    } else if (status === 1) {
        return "#f90";
    } else {
        return "red";
    }
}

// React component to display courses in a grid layout
const CourseTable = ({ groupedCourses, draggingCard, queryCourses, setQueryCourses, userInfo }) => {
    // TODO: [finished] Draggable Cards
    // TODO: [partially finished] Right Click Menu
    //    - Right click "add course" should show a separate popup from search course input field that's more suitable
    // TODO: Search Course
    //    - Auto complete server side, click course for details and drag course to add

    const documentRef = useRef(document);
    const tableRef = useRef(null);

    const [formattedCourseData, setFormattedCourseData] = useState([]);

    const [graduationCheckList, setGraduationCheckList] = useState([]);

    useEffect(() => {
        const formattedData = format_course_data_source(groupedCourses);

        setFormattedCourseData(formattedData);
    }, [groupedCourses]);

    const getGraduationCheckList = ()=>{
        const all_checks = [
            ()=>{
                const success_text = "All required core years courses were taken and passed!";
                const fail_text = "Some required core years courses were not taken or passed!";

                const success = false;

                const return_text = success ? success_text : fail_text;

                return [success, return_text];
            },
            ()=>{
                const success_text = "All required core years courses were taken and passed!";
                const fail_text = "Some required core years courses were not taken or passed!";

                const success = false;

                const return_text = success ? success_text : fail_text;

                return [success, return_text];
            },
            ()=>{
                const success_text = "All required core years courses were taken and passed!";
                const fail_text = "Some required core years courses were not taken or passed!";

                const success = true;

                const return_text = success ? success_text : fail_text;

                return [success, return_text];
            },
            ()=>{
                const success_text = "All required core years courses were taken and passed!";
                const fail_text = "Some required core years courses were not taken or passed!";

                const success = true;

                const return_text = success ? success_text : fail_text;

                return [success, return_text];
            },
            ()=>{
                const success_text = "All required core years courses were taken and passed!";
                const fail_text = "Some required core years courses were not taken or passed!";

                const success = false;

                const return_text = success ? success_text : fail_text;

                return [success, return_text];
            },
        ];

        const return_list = [];

        for(const check of all_checks){
            const [cur_check_passed, text] = check();
            
            return_list.push({
                'status': cur_check_passed,
                'text': text
            })
        }

        return return_list;
    }

    useEffect(()=>{
        setGraduationCheckList(getGraduationCheckList());
    }, [formattedCourseData]);

    const calculateCEABData = () => {
        console.log("Recalculate CEAB");

        if (formattedCourseData.length === 0) {
            return;
        }

        // console.log(formattedCourseData);

        // course.Math
        // course.NS
        // (course.NS + course.Math)
        // course.ES
        // course.ED
        // (course.ES + course.ED)
        // course.CS
        // (course.Math + course.NS + course.CS + course.ES + course.ED)

        var dummyCEABDetails = [...ceab_default_data];
        for (const term of formattedCourseData) {
            for (const course of term.term_courses) {
                if (course.course_status === 0) {
                    dummyCEABDetails[1]["obtained"] += course.Math || 0;
                    dummyCEABDetails[2]["obtained"] += course.NS || 0;
                    dummyCEABDetails[3]["obtained"] += course.NS + course.Math || 0;
                    dummyCEABDetails[4]["obtained"] += course.ES || 0;
                    dummyCEABDetails[5]["obtained"] += course.ED || 0;
                    dummyCEABDetails[6]["obtained"] += course.ES + course.ED || 0;
                    dummyCEABDetails[7]["obtained"] += course.CS || 0;
                    dummyCEABDetails[0]["obtained"] += course.Math + course.NS + course.CS + course.ES + course.ED || 0;
                } else if (course.course_status === 1) {
                    dummyCEABDetails[1]["projected"] += course.Math || 0;
                    dummyCEABDetails[2]["projected"] += course.NS || 0;
                    dummyCEABDetails[3]["projected"] += course.NS + course.Math || 0;
                    dummyCEABDetails[4]["projected"] += course.ES || 0;
                    dummyCEABDetails[5]["projected"] += course.ED || 0;
                    dummyCEABDetails[6]["projected"] += course.ES + course.ED || 0;
                    dummyCEABDetails[7]["projected"] += course.CS || 0;
                    dummyCEABDetails[0]["projected"] += course.Math + course.NS + course.CS + course.ES + course.ED || 0;
                }
            }
        }

        for (var row of dummyCEABDetails) {
            var outstanding = row["minimum"] - row["projected"];

            if (outstanding > 0) {
                row["outstanding"] = outstanding;
            } else {
                row["outstanding"] = "OK";
            }
        }

        // console.log(dummyCEABDetails);
        setCEABDetailsData(dummyCEABDetails);
    };

    // Recalculate ceab data when course list changes
    useEffect(() => {
        calculateCEABData();
    }, [formattedCourseData]);

    const [courseSearchValue, setCourseSearchValue] = useState("");

    const [emptyPopupState, setEmptyPopupState] = useState({
        visible: false,
        x: 0,
        y: 0,
        record: null,
        target: null,
    });

    const [cardPopupState, setCardPopupState] = useState({
        visible: false,
        x: 0,
        y: 0,
        record: null,
        target: null,
    });

    const [alertMessage, setAlertMessage] = useState(null);
    const [courseInfoModalOpen, setCourseInfoModalOpen] = useState(false);

    const [cardPopupListenerCreated, setCardPopupListenerCreated] = useState(false);
    const [emptyPopupListenerCreated, setEmptyPopupListenerCreated] = useState(false);

    const [currentCourseDetails, setCurrentCourseDetails] = useState({
        course_name: "Operating Systems",
        course_code: "ECE344H1",
        description:
            "Operating system structures, concurrency, synchronization, deadlock, CPU scheduling, memory management, file systems. The laboratory exercises will require implementation of part of an operating system.",
        // This could be ECE244H1 and/or ECE243H1, need a way to distinguish
        prerequisites: ["ECE244H1", "ECE243H1"],
        corequisites: [],
        exclusions: ["ECE353H1 S"],

        creditWeight: 0.5,

        // 1, 2, 3, 4, 5, 6, 7(Science and Math)
        area: 6,

        // Kernel, Depth, HSS, CS, Free, None
        type: "Kernel",
        fall: true,
        winter: true,
        offered: "2022-2023",
        delivery: [3, 0, 30],
        au_dist: [0, 0, 0, 60, 40],
        ceab: [0, 0, 0, 32, 21.4],

        // Not Taken, Passed, Failed, In Progress, Planned
        status: "Not Taken",
    });

    const [CEABDetailsData, setCEABDetailsData] = useState(ceab_default_data);

    // Ensure user_course_data is an array before processing
    if (groupedCourses === undefined || groupedCourses === null || Object.values(groupedCourses).length === 0) {
        return <div>No data available</div>;
    }

    function showCourseInfoModal(course_info) {
        // course_code, section, year
        requestCourseDetails(course_info["course_code"], course_info["course_term"]);
        setCourseInfoModalOpen(true);
    }

    const handleOk = () => {
        setCourseInfoModalOpen(false);
    };

    const handleCancel = () => {
        setCourseInfoModalOpen(false);
    };

    // console.log(JSON.stringify(groupedCourses));
    // console.log(JSON.stringify(formattedCourseData));
    // console.log(maxCourseCount)

    const requestCourseDetails = (course_code, course_term) => {
        axios
            .post("http://localhost:8000/api/courses", {
                request: "get_course_details",
                payload: {
                    code: course_code,
                    term: course_term,
                },
            })
            .then((response) => {
                console.log(response.data);
                setCurrentCourseDetails(response.data);
            })
            .catch((error) => {
                if (error.response) {
                    console.log(error.response.data);
                    alert(JSON.stringify(error.response.data));
                } else {
                    console.error("Error", error);
                }
            });
    };

    function findCourse(code) {
        if (code === "") {
            return null;
        }

        code = code.toLowerCase();

        for (const term of formattedCourseData) {
            for (const course of term.term_courses) {
                if (course.course_code.toLowerCase().includes(code)) {
                    return course;
                }
            }
        }

        return null;
    }

    function findCourseLocation(term, code) {
        var term_row_index = 0;
        var valid_term_row = false;
        for (; term_row_index < formattedCourseData.length; term_row_index++) {
            if (formattedCourseData[term_row_index]["term_name"] === term) {
                valid_term_row = true;
                break;
            }
        }

        if (!valid_term_row) {
            term_row_index = -1;
        }

        if (code === null) {
            return term_row_index;
        }

        var term_course_index = 0;
        var valid_course_index = false;

        for (; term_course_index < formattedCourseData[term_row_index]["term_courses"].length; term_course_index++) {
            if (formattedCourseData[term_row_index]["term_courses"][term_course_index]["course_code"] === code) {
                valid_course_index = true;
                break;
            }
        }

        if (!valid_course_index) {
            term_course_index = -1;
        }

        return [term_row_index, term_course_index];
    }

    const handleCourseCardDragStart = (term, code) => {
        const [term_row_index, term_course_index] = findCourseLocation(term, code);
        console.log(`Dragging course at: ${term_row_index}, ${term_course_index}`);

        draggingCard.current = { term_row_index, term_course_index };
    };

    const handleCourseCardDrop = (term, code) => {
        // TODO: Check if it's legal to drop the course at term (course might not have fall variant if it's originally winter)
        if (draggingCard.current) {
            // Dropping on empty slot
            var term_row_index = 0;
            var term_course_index = 0;

            const newData = [...formattedCourseData];
            const dragCardRow = draggingCard.current.term_row_index;
            const dragCardCourse = draggingCard.current.term_course_index;

            // Extract the dragging card data
            const draggedCard = newData[dragCardRow].term_courses[dragCardCourse];

            if (code === null) {
                term_row_index = findCourseLocation(term, null);

                if (!checkCourseLegal(draggedCard, term)) {
                    return;
                }

                // Push dragging course onto row
                newData[term_row_index].term_courses.push(draggedCard);
                newData[term_row_index].term_courses.at(-1)["course_term"] = term;

                // Delete old position
                newData[dragCardRow].term_courses.splice(dragCardCourse, 1);

                setFormattedCourseData(newData);
            } else {
                [term_row_index, term_course_index] = findCourseLocation(term, code);

                if (!checkCourseLegal(draggedCard, term)) {
                    return;
                }

                if (newData[term_row_index].term_courses[term_course_index]["course_code"].includes("PEY")) {
                    return;
                }

                // Replace dragged card position with the dropped position
                newData[dragCardRow].term_courses[dragCardCourse] = newData[term_row_index].term_courses[term_course_index];

                newData[term_row_index].term_courses[term_course_index] = draggedCard;

                // Swap course term
                newData[dragCardRow].term_courses[dragCardCourse]["course_term"] = newData[dragCardRow]["term_name"];
                newData[term_row_index].term_courses[term_course_index]["course_term"] = newData[term_row_index]["term_name"];

                setFormattedCourseData(newData);
            }

            draggingCard.current = null;
        }
    };

    const checkCourseLegal = (course, term) => {
        // Some easy ones can be done in front end
        if (course["course_code"].includes("PEY")) {
            const error_message = `Illegal Course Action: PEY course is not movable`;
            setAlertMessage(error_message);
            return false;
        } else if (course["course_status"] == 0) {
            const error_message = "Illegal Course Action: Passed course is not movable";
            setAlertMessage(error_message);
            return false;
        } else if (course["course_status"] == 2) {
            const error_message = "Illegal Course Action: Failed course is not movable";
            setAlertMessage(error_message);
            return false;
        } else {
            // Other need to call backend
        }
        return true;
    };

    const findCoursePosition = (source_row_index, source_course_index) => {
        const tableDom = tableRef.current.querySelector(".ant-table-content");
        const termRowDom = tableDom.querySelectorAll("tbody tr")[source_row_index].querySelectorAll("td")[1].querySelector("div");
        var courseContainer = termRowDom.querySelectorAll("div .ant-col");

        // If source course index is -1, then it's the last one
        source_course_index = source_course_index == -1 ? courseContainer.length - 1 : source_course_index;
        courseContainer = courseContainer[source_course_index];
        const courseContainerPosition = courseContainer.getBoundingClientRect();

        return [courseContainer, courseContainerPosition];
    };

    const moveCourseCardAnimation = (source_row_index, source_course_index, target_row_index, target_course_index) => {
        const [courseContainer, courseContainerPosition] = findCoursePosition(source_row_index, source_course_index);
        const [targetContainer, targetContainerPosition] = findCoursePosition(target_row_index, target_course_index);

        const translateX =
            targetContainerPosition.left - courseContainerPosition.left + targetContainerPosition.width * (target_course_index == -1);
        const translateY = targetContainerPosition.top - courseContainerPosition.top;

        const transformData = `translate(${translateX}px, ${translateY}px)`;
        const transitionData = `transform 0.5s ease-in-out`;

        courseContainer.style.transform = transformData;
        courseContainer.style.transition = transitionData;
    };

    const manipulateCourseList = async (action) => {
        // There are a few possible operations:
        //      1. Add a brand new course to a term
        //      2. Swap two courses at two different terms
        //      3. Move one course from a term to another term
        //      4. Delete a course

        const action_name = action["action"].toLowerCase();

        if (action_name === "add") {
            const target_term = action["dest_course"]["course_term"];

            if (!checkCourseLegal(action["source_course"], target_term)) {
                return [
                    false,
                    `The course ${action["source_course"]["course_code"]} can not be added to term ${target_term} since it's not offered in that term.`,
                ];
            }

            const target_row_index = findCourseLocation(target_term, null);
            // TODO: if the term is outside of the current course list, then create a new term if it's within the next three years

            const newData = [...formattedCourseData];

            newData[target_row_index].term_courses.push({
                ...action["source_course"],
                course_term: target_term,
            });

            setFormattedCourseData(newData);

            const action_result = `The course ${action["source_course"]["course_code"]} is successfully added to term ${target_term}`;
            console.log(action_result);
            return [true, action_result];
        } else if (action_name === "swap") {
            const target_code = action["dest_course"]["course_code"];
            const target_term = action["dest_course"]["course_term"];
            const [target_row_index, target_course_index] = findCourseLocation(target_term, target_code);

            const source_code = action["source_course"]["course_code"];
            const source_term = action["source_course"]["course_term"];
            const [source_row_index, source_course_index] = findCourseLocation(source_term, source_code);

            if (target_course_index === -1) {
                return [
                    false,
                    `The course ${action["dest_course"]["course_code"]} was not found in the term ${action["dest_course"]["course_term"]}`,
                ];
            }

            if (target_row_index === -1) {
                return [false, `The term term ${action["dest_course"]["course_term"]} does not exist.`];
            }

            if (source_course_index === -1) {
                return [
                    false,
                    `The course ${action["source_course"]["course_code"]} was not found in the term ${action["source_course"]["course_term"]}`,
                ];
            }

            if (source_row_index === -1) {
                return [false, `The term term ${action["source_course"]["course_term"]} does not exist.`];
            }

            const newData = [...formattedCourseData];
            const target_card = newData[target_row_index].term_courses[target_course_index];

            moveCourseCardAnimation(source_row_index, source_course_index, target_row_index, target_course_index);
            moveCourseCardAnimation(target_row_index, target_course_index, source_row_index, source_course_index);

            newData[target_row_index].term_courses[target_course_index] = newData[source_row_index].term_courses[source_course_index];
            newData[source_row_index].term_courses[source_course_index] = target_card;

            newData[target_row_index].term_courses[target_course_index]["course_term"] = newData[target_row_index]["term_name"];
            newData[source_row_index].term_courses[source_course_index]["course_term"] = newData[source_row_index]["term_name"];

            await sleep(500);

            setFormattedCourseData(newData);

            const action_result = `The course ${action["source_course"]["course_code"]} is successfully swapped with the course ${action["dest_course"]["course_code"]}`;
            console.log(action_result);
            return [true, action_result];
        } else if (action_name === "move") {
            const target_term = action["dest_course"]["course_term"];
            const target_row_index = findCourseLocation(target_term, null);

            const source_code = action["source_course"]["course_code"];
            const source_term = action["source_course"]["course_term"];
            const [source_row_index, source_course_index] = findCourseLocation(source_term, source_code);

            if (target_row_index === -1) {
                return [false, `The term term ${action["dest_course"]["course_term"]} does not exist.`];
            }

            if (source_course_index === -1) {
                return [
                    false,
                    `The course ${action["source_course"]["course_code"]} was not found in the term ${action["source_course"]["course_term"]}`,
                ];
            }

            if (source_row_index === -1) {
                return [false, `The term term ${action["source_course"]["course_term"]} does not exist.`];
            }

            const newData = [...formattedCourseData];

            console.log(source_row_index, source_course_index);

            // Animation
            moveCourseCardAnimation(source_row_index, source_course_index, target_row_index, -1);

            newData[target_row_index].term_courses.push(newData[source_row_index].term_courses[source_course_index]);
            newData[target_row_index].term_courses.at(-1)["course_term"] = newData[target_row_index]["term_name"];

            newData[source_row_index].term_courses.splice(source_course_index, 1);

            await sleep(500);

            setFormattedCourseData(newData);

            const action_result = `The course ${action["source_course"]["course_code"]} is successfully moved to the term ${target_term}`;
            console.log(action_result);
            return [true, action_result];
        } else if (action_name === "delete") {
            const source_code = action["source_course"]["course_code"];
            const source_term = action["source_course"]["course_term"];
            const [source_row_index, source_course_index] = findCourseLocation(source_term, source_code);

            if (source_course_index === -1) {
                return [
                    false,
                    `The course ${action["source_course"]["course_code"]} was not found in the term ${action["source_course"]["course_term"]}`,
                ];
            }

            if (source_row_index === -1) {
                return [false, `The term term ${action["source_course"]["course_term"]} does not exist.`];
            }

            const newData = [...formattedCourseData];

            newData[source_row_index].term_courses.splice(source_course_index, 1);

            setFormattedCourseData(newData);

            const action_result = `The course ${action["source_course"]["course_code"]} is successfully deleted`;
            console.log(action_result);
            return [true, action_result];
        } else {
            console.log("The requested action is not unrecognized.");

            return [false, "The requested action is not unrecognized. The available actions are: [move, swap, delete, add]."];
        }
    };

    const handleCourseCardMarginDrop = (term, index, target) => {
        if (draggingCard.current) {
            console.log("Drop on margin", term, index);

            // Dropping on empty slot
            var term_row_index = findCourseLocation(term, null);
            var term_course_index = index;

            const newData = [...formattedCourseData];
            const dragCardRow = draggingCard.current.term_row_index;
            const dragCardCourse = draggingCard.current.term_course_index;

            // Extract the dragging card data
            const draggedCard = newData[dragCardRow].term_courses[dragCardCourse];

            if (!checkCourseLegal(draggedCard, term)) {
                return;
            }

            draggedCard["course_term"] = term;

            // Special case where the new course order is re-arranged

            // Add dragging course to location in new term
            newData[term_row_index].term_courses.splice(term_course_index, 0, draggedCard);

            // Delete the dragging course's old copy
            newData[dragCardRow].term_courses.splice(dragCardCourse + (dragCardRow === term_row_index), 1);

            setFormattedCourseData(newData);
            draggingCard.current = null;

            // Remove styling of margin drop hover effect
            target.classList.remove("courseCardMarginLeftHover");
        }
    };

    const courseListColumns = [
        {
            key: "term_name",
            dataIndex: "term_name",
            render: (text) => <span style={{ fontWeight: "bold" }}>{text}</span>,
        },
        {
            key: "term_courses",
            dataIndex: "term_courses",
            render: (_, record, __) => {
                const courses = record["term_courses"];

                if (courses === undefined) {
                    return <></>;
                }

                return (
                    <Row
                        gutter={[4, 4]}
                        style={{
                            display: "flex",
                            flexWrap: "wrap",
                            marginTop: "-5px",
                            marginBottom: "-5px",
                        }}
                    >
                        {courses.map((course, index) => (
                            <Col
                                key={`col-${alphanumerical()}`}
                                style={{ padding: 0, display: "flex", transition: "all 0.3s ease-in-out" }}
                            >
                                {course["course_code"] !== null && (
                                    <div
                                        className="courseCardMarginLeft"
                                        onDragOver={(e) => e.preventDefault()}
                                        // TODO: Finish this
                                        onDrop={(event) => {
                                            handleCourseCardMarginDrop(course["course_term"], index, event["target"]);
                                        }}
                                        onDragEnter={(event) => {
                                            event["target"].classList.add("courseCardMarginLeftHover");
                                        }}
                                        onDragLeave={(event) => {
                                            event["target"].classList.remove("courseCardMarginLeftHover");
                                        }}
                                    />
                                )}

                                <div
                                    style={{
                                        width: 130,
                                        height: 60,
                                        color: getCourseColor(course["course_status"]),
                                    }}
                                    className={`CourseCardFamily ${course["course_code"] !== null ? "CourseCard" : "CourseCardHidden"}`}
                                    onClick={() =>
                                        course["course_code"] !== null &&
                                        showCourseInfoModal({
                                            code: course["course_code"],
                                            term: course["course_term"],
                                        })
                                    }
                                    draggable
                                    onDragStart={() => handleCourseCardDragStart(course["course_term"], course["course_code"])}
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop={() => handleCourseCardDrop(course["course_term"], course["course_code"])}
                                >
                                    <span
                                        style={{
                                            fontSize: 14,
                                            fontFamily: "arial",
                                            textDecoration: "none",
                                            color: getCourseColor(course["course_status"]),
                                            fontWeight: "bold",
                                        }}
                                        className="CourseCardFamily CourseCardCode"
                                    >
                                        {course["course_code"]}
                                    </span>

                                    <div
                                        style={{
                                            fontSize: "7pt",
                                            fontFamily: "arial",
                                            lineHeight: "1",
                                            cursor: "pointer",
                                        }}
                                        className="CourseCardFamily CourseCardName"
                                    >
                                        {course["course_name"]}
                                    </div>
                                </div>
                            </Col>
                        ))}
                    </Row>
                );
            },
        },
    ];

    const handleCourseListRightClick = (record) => ({
        onContextMenu: (event) => {
            const clickOnCard = event["target"].classList.contains("CourseCardFamily");
            // TODO: Add a second menu pop up for card, so eventually there would be two popup menus:
            // one for clicking on card(delete course, get info, etc.), one for clicking on blank(adding course, etc.)

            event.preventDefault();
            const currentState = clickOnCard ? cardPopupState : emptyPopupState;
            const otherState = clickOnCard ? emptyPopupState : cardPopupState;

            const setterFunc = clickOnCard ? setCardPopupState : setEmptyPopupState;
            const otherSetterFunc = clickOnCard ? setEmptyPopupState : setCardPopupState;

            // Make the other popup menu invisible
            if (otherState.visible) {
                otherSetterFunc({ ...otherState, visible: false });
            }

            if (!currentState.visible) {
                if ((clickOnCard && !cardPopupListenerCreated) || (!clickOnCard && !emptyPopupListenerCreated)) {
                    const curListenerSetter = clickOnCard ? setCardPopupListenerCreated : setEmptyPopupListenerCreated;
                    curListenerSetter(true);

                    documentRef.current.addEventListener(`click`, function onClickOutside() {
                        setterFunc({ ...currentState, visible: false });
                        curListenerSetter(false);
                        documentRef.current.removeEventListener(`click`, onClickOutside);
                    });
                }
            }

            setterFunc({
                record: record,
                target: clickOnCard ? event["target"].parentElement.getElementsByClassName("CourseCardCode")[0].innerText : null,
                visible: true,
                x: event.clientX,
                y: event.clientY,
            });
        },
        // Prevent default action, which terminates drop
        onDragOver: (e) => e.preventDefault(),
        onDrop: () => {
            console.log("Drop on empty row.", record);
            handleCourseCardDrop(record["term_name"], null);
        },
    });

    const handleCourseSearchRequest = (event) => {
        setCourseSearchValue(event.target.value);
        console.log(courseSearchValue);
    };

    const handleAlertClose = () => {
        setAlertMessage(null);
    };

    const tutorialTitle = <span>Tutorial</span>;

    const tutorialContent = (
        <div>
            <p>Content1</p>
            <p>Content2</p>
        </div>
    );

    const firstSemRequiredCourses = ["APS100H1", "APS110H1", "APS111H1", "CIV100H1", "MAT186H1", "MAT188H1"];
    const secondSemRequiredCourses = ["APS105H1", "APS112H1", "ECE110H1", "ECE191H1", "MAT187H1", "MIE100H1"];
    const thirdSemRequiredCourses = ["ECE201H1", "ECE212H1", "ECE241H1", "ECE244H1", "MAT290H1", "MAT291H1"];
    const fourthSemRequiredCourses = ["ECE216H1", "ECE221H1", "ECE231H1", "ECE243H1", "ECE297H1"];

    const RequiredCourseCardSmall = ({ course_codes }) => {
        return course_codes.map((course_code) => {
            const course_info = findCourse(course_code);
            const course_passed = course_info !== null && course_info.course_status === 0;
            return (
                <Col
                    className="lowerProgramRequirementSmallCard"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                        showCourseInfoModal(course_info);
                        console.log(course_code);
                    }}
                    key={`LPRSC-${alphanumerical()}`}
                >
                    <span>{course_code}</span>

                    {course_passed && <Checkbox checked={course_passed} className="lowerProgramRequirementSmallCardCheckBox" />}

                    {!course_passed && (
                        <CloseOutlined
                            style={{
                                border: "1px solid red",
                                borderRadius: "4px",
                                backgroundColor: "red",
                                color: "white",
                                fontWeight: "bold",
                            }}
                        />
                    )}
                </Col>
            );
        });
    };

    const EssentialsCourseCardSmall = ({ course_codes }) => {
        return course_codes.map((course_code) => {
            const course_info = findCourse(course_code);

            return (
                <Col
                    className="lowerProgramRequirementSmallCard"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                        showCourseInfoModal(course_info);
                        console.log(course_code);
                    }}
                    key={`ESCS-${alphanumerical()}`}
                >
                    <span style={{ color: getCourseColor(course_info && course_info.course_status) }}>{course_code}</span>
                </Col>
            );
        });
    };

    const CEABDetailsColumns = [
        {
            title: "Categories",
            dataIndex: "categories",
            key: "categories",
            align: "left",
            render: (item) => {
                return <p style={{ fontWeight: "bold" }}>{item}</p>;
            },
        },
        {
            title: "Minimum Requirement",
            dataIndex: "minimum",
            key: "minimum",
            align: "center",
        },
        {
            title: "Obtained",
            dataIndex: "obtained",
            key: "obtained",
            align: "center",
            render: (text, record, row) => {
                return <p style={{ color: text < record["minimum"] ? "red" : "green" }}>{text}</p>;
            },
        },
        {
            title: "Projected",
            dataIndex: "projected",
            key: "projected",
            align: "center",
            render: (text, record, row) => {
                return <p style={{ color: text < record["minimum"] ? "red" : "green" }}>{text}</p>;
            },
        },
        {
            title: "Outstanding",
            dataIndex: "outstanding",
            key: "outstanding",
            align: "center",
            render: (text, record, row) => {
                return <p style={{ color: text > 0 ? "red" : "green" }}>{text}</p>;
            },
        },
    ];

    const canGraduate = !graduationCheckList.some(item => !item['status']);

    const essentialColumns = [
        {
            title: "",
            dataIndex: "course_name",
            key: "course_name",
            align: "left",
            render: (item) => {
                return <p style={{ fontWeight: "bold" }}>{item}</p>;
            },
        },
        {
            title: "",
            dataIndex: "courses",
            key: "courses",
            align: "center",
            render: (item, record, row) => {
                return (
                    <Row>
                        <EssentialsCourseCardSmall course_codes={item} />
                    </Row>
                );
            },
        },
    ];

    const essentialData = [
        {
            course_name: "Engineering Economics",
            key: "engineering_economics",
            courses: ["ECE472H1"],
        },
        {
            course_name: "Capstone",
            key: "capstone",
            courses: ["ECE496Y1"],
        },
        {
            course_name: "Science/Math",
            key: "science/math",
            courses: ["ECE302H1"],
        },
        {
            course_name: "Technical Electives",
            key: "technical_electives",
            courses: ["CSC317H1", "ECE326H1", "ECE454H1"],
        },
        {
            course_name: "HSS and CS",
            key: "HSS&CS",
            courses: ["CLA204H1", "LIN102H1", "JRE300H1", "JRE410H1"],
        },
        {
            course_name: "Free Elective",
            key: "free_elective",
            courses: ["CSC384H1"],
        },
    ];

    const lowerTabsContent = [
        {
            label: `Core Years`,
            key: "core_years_tab",
            children: (
                <div className="lowerProgramRequirementWrapper" style={{paddingRight: '24px'}}>
                    <div style={{ textAlign: "left" }}>
                        <Title level={3}>First Year</Title>
                    </div>
                    <Row>
                        <RequiredCourseCardSmall course_codes={firstSemRequiredCourses}></RequiredCourseCardSmall>
                    </Row>

                    <Row style={{ marginTop: "10px" }}>
                        <RequiredCourseCardSmall course_codes={secondSemRequiredCourses}></RequiredCourseCardSmall>
                    </Row>

                    <Divider />
                    <div style={{ textAlign: "left" }}>
                        <Title level={3}>Second Year</Title>
                    </div>
                    <Row>
                        <RequiredCourseCardSmall course_codes={thirdSemRequiredCourses}></RequiredCourseCardSmall>
                    </Row>

                    <Row style={{ marginTop: "10px" }}>
                        <RequiredCourseCardSmall course_codes={fourthSemRequiredCourses}></RequiredCourseCardSmall>
                    </Row>
                </div>
            ),
        },
        {
            label: `Kernel/Depth Courses`,
            key: "kernel_depth_courses",
            children: `Content of Upper Years`,
        },
        {
            label: `Electives and Essentials`,
            key: "additional_required_courses",
            children: <Table style={{paddingRight: '24px'}} columns={essentialColumns} dataSource={essentialData} showHeader={false} pagination={false} size="small" />,
        },
        {
            label: `CEAB Requirements`,
            key: "ceab_requirements_tab",
            children: (
                <div style={{paddingRight: '24px'}}>
                    <Table
                        columns={CEABDetailsColumns}
                        dataSource={CEABDetailsData}
                        showHeader={true}
                        pagination={false}
                        size="small"
                        // style={{
                        //     transition: "all 0.5s ease-out allow-discrete",
                        // }}
                        // onRow={handleCourseListRightClick}
                    />
                </div>
            ),
        },
        {
            label: `Graduation Status`,
            key: "graduation_eligibility_tab",
            children: (
                <div style={{paddingRight: '24px'}}>
                    <div style={{ textAlign: "left" }}>
                        <Title level={3}>PEY Requirement</Title>

                        {userInfo && userInfo["PEY"] ? (
                            <Text type="success" strong>You meet the Practical Experience requirement.</Text>
                        ) : (
                            <Text type="danger" strong>You do NOT meet the Practical Experience requirement currently.</Text>
                        )}
                    </div>
                    <Divider style={{}}/>
                    <div style={{ textAlign: "left" }}>
                        <Title level={3}>Graduation Eligibility</Title>
                        <List
                            size="small"
                            dataSource={graduationCheckList}
                            renderItem={(item, index) => (
                                <List.Item>
                                    <Text type={item['status'] ? 'success' : 'danger'} strong> {index + 1}: {item['text']} </Text>
                                </List.Item>
                            )}
                        />

                        {/* <Divider/> */}
                        
                        <div style={{textAlign: 'center'}}>
                            <Title level={4} type={canGraduate ? "success" : "danger"}>{canGraduate ? "You can graduate!" : "You can't graduate!"}</Title>
                        </div>
                    </div>
                </div>
            ),
        },
    ];

    // Profile does not meet the Practical Experience Requirement.
    // This profile does not meet all requirements, as a result you will not graduate!

    return (
        <div className="course-table" style={{ overflow: "auto" }} ref={tableRef}>
            <Modal
                title={`${currentCourseDetails.course_code} - ${currentCourseDetails.course_name} (${currentCourseDetails.offered})`}
                open={courseInfoModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                width={750}
                style={{
                    top: "5%",
                }}
            >
                <div>
                    <p className="courseDetailTitle">
                        <strong>Description:</strong>
                        <span> {currentCourseDetails.description} </span>
                    </p>
                    <p className="courseDetailTitle">
                        <strong>Prerequisites:</strong>
                        <span> {currentCourseDetails.prerequisites}</span>
                    </p>
                    <p className="courseDetailTitle">
                        <strong>Co-requisites:</strong>
                        <span> {currentCourseDetails.corequisites}</span>
                    </p>
                    <p className="courseDetailTitle">
                        <strong>Exclusions:</strong>
                        <span> {currentCourseDetails.exclusions}</span>
                    </p>
                    <p className="courseDetailTitle">
                        <strong>Credit Weight:</strong>
                        <span> {currentCourseDetails.creditWeight}</span>
                    </p>

                    <div className="courseDetailTitle">
                        <strong>Course Offer:</strong>
                        <span>
                            <Row>
                                <Col span={4}>
                                    <Checkbox checked={currentCourseDetails.fall} disabled>
                                        Fall
                                    </Checkbox>
                                </Col>
                                <Col span={4}>
                                    <Checkbox checked={currentCourseDetails.winter} disabled>
                                        Winter
                                    </Checkbox>
                                </Col>
                            </Row>
                        </span>
                    </div>

                    <p className="courseDetailTitle">
                        <strong>Course Type:</strong>
                        <span> {currentCourseDetails.type}</span>
                    </p>
                    <p className="courseDetailTitle">
                        <strong>Area of Study:</strong>
                        <span> {currentCourseDetails.area}</span>
                    </p>
                    <p className="courseDetailTitle">
                        <strong>Current Status:</strong>
                        <span> {currentCourseDetails.status}</span>
                    </p>

                    <Divider></Divider>

                    <strong>Course Delivery:</strong>
                    <Table
                        columns={courseDeliveryColumns}
                        dataSource={[
                            {
                                key: 0,
                                lectures: currentCourseDetails.delivery[0],
                                tutorials: currentCourseDetails.delivery[1],
                                labs: currentCourseDetails.delivery[2],
                            },
                        ]}
                        pagination={false}
                        bordered
                        style={{ marginBottom: "15px" }}
                        size="small"
                    />

                    <strong>AU Distribution(%):</strong>
                    <Table
                        columns={courseAUDistributionColumns}
                        dataSource={[
                            {
                                key: 0,
                                MathDistribution: currentCourseDetails.au_dist[0],
                                NSDistribution: currentCourseDetails.au_dist[1],
                                CSDistribution: currentCourseDetails.au_dist[2],
                                ESDistribution: currentCourseDetails.au_dist[3],
                                EDDistribution: currentCourseDetails.au_dist[4],
                            },
                        ]}
                        pagination={false}
                        bordered
                        style={{ marginBottom: "15px" }}
                        size="small"
                    />

                    <strong>CEAB AU:</strong>
                    <Table
                        columns={courseCEABAUColumns}
                        dataSource={[
                            {
                                key: 0,
                                MathValue: currentCourseDetails.ceab[0],
                                NSValue: currentCourseDetails.ceab[1],
                                CSValue: currentCourseDetails.ceab[2],
                                ESValue: currentCourseDetails.ceab[3],
                                EDValue: currentCourseDetails.ceab[4],
                            },
                        ]}
                        pagination={false}
                        bordered
                        style={{ marginBottom: "15px" }}
                        size="small"
                    />
                </div>
            </Modal>

            {alertMessage !== null && (
                <Alert
                    style={{
                        position: "fixed",
                        top: "10px",
                        left: "40%",
                        fontSize: "12pt",
                    }}
                    message={alertMessage}
                    type="error"
                    closable
                    onClose={handleAlertClose}
                />
            )}

            <ConfigProvider
                theme={{
                    components: {
                        Table: {
                            rowHoverBg: "#ebf7ff63",
                        },
                    },
                }}
            >
                <Table
                    columns={courseListColumns}
                    dataSource={formattedCourseData}
                    showHeader={false}
                    pagination={false}
                    size="small"
                    style={{
                        transition: "all 0.5s ease-out allow-discrete",
                    }}
                    onRow={handleCourseListRightClick}
                    title={() => (
                        <div
                            style={{
                                textAlign: "left",
                                fontWeight: "bold",
                                fontSize: 28,
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                }}
                            >
                                <div>
                                    <span>Course List</span>
                                    <Popover placement="rightTop" title={tutorialTitle} content={tutorialContent} trigger={"hover"}>
                                        <Link to="about">
                                            <QuestionCircleTwoTone
                                                style={{ marginLeft: "10px" }}
                                                onClick={() => {
                                                    console.log("clicked questions");
                                                    manipulateCourseList({
                                                        action: "swap",
                                                        source_course: {
                                                            course_code: "JRE410H1 F",
                                                            course_name: "Markets and Competitive Strategy",
                                                            course_term: "20249",
                                                            course_status: 1,
                                                        },
                                                        dest_course: {
                                                            course_code: "ECE462H1 S",
                                                            course_name: "Multimedia System",
                                                            course_term: "20251",
                                                            course_status: 1,
                                                        },
                                                    });
                                                }}
                                            />
                                        </Link>
                                    </Popover>
                                </div>

                                <Input
                                    placeholder="Search Course"
                                    value={courseSearchValue}
                                    onChange={(event) => {
                                        handleCourseSearchRequest(event);
                                    }}
                                    style={{
                                        width: "20%",
                                    }}
                                />
                            </div>
                            <Divider
                                style={{
                                    marginTop: "4px",
                                    marginBottom: "0px",
                                }}
                            ></Divider>
                        </div>
                    )}
                />
                <OnEmptyPopup {...emptyPopupState} queryCourses={queryCourses} setQueryCourses={setQueryCourses} />
                <OnCardPopup
                    {...cardPopupState}
                    queryCourses={queryCourses}
                    setQueryCourses={setQueryCourses}
                    setCourseList={setFormattedCourseData}
                />
            </ConfigProvider>

            <Divider
                style={{
                    marginTop: "4px",
                    marginBottom: "4px",
                }}
            ></Divider>
            <div style={{ width: "100%", minHeight: "350px", backgroundColor: "white" }}>
                <Tabs tabPosition="left" items={lowerTabsContent} />
            </div>
        </div>
    );
};

export default CourseTable;
