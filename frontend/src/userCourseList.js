import React, { useState, useRef, useEffect } from "react";
import { Col, Row, Table, Divider, Button, ConfigProvider, Modal, Popover } from "antd";
import { SearchOutlined, QuestionCircleTwoTone } from "@ant-design/icons";
import { OnEmptyPopup, OnCardPopup } from "./menuPopUp";

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

const courseDeliveryData = [{ key: "1", lectures: 3, tutorials: 0, labs: 30 }];

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
const courseAUDistributionData = [
    {
        key: "1",
        MathDistribution: 0,
        NSDistribution: 0,
        CSDistribution: 0,
        ESDistribution: 60,
        EDDistribution: 40,
    },
];

const courseCEABAUColumns = [
    { title: "Math", dataIndex: "MathValue", key: "Math", align: "center" },
    { title: "NS", dataIndex: "NSValue", key: "NS", align: "center" },
    { title: "CS", dataIndex: "CSValue", key: "CS", align: "center" },
    { title: "ES", dataIndex: "ESValue", key: "ES", align: "center" },
    { title: "ED", dataIndex: "EDValue", key: "ED", align: "center" },
];

const courseCEABAUValueData = [
    {
        key: "1",
        MathValue: 0,
        NSValue: 0,
        CSValue: 0,
        ESValue: 32,
        EDValue: 21.4,
    },
];

const format_course_data_source = (groupedCourses) => {
    var formattedDataSource = [];

    var maxCourseCount = 1;
    for (var cur_courses of Object.values(groupedCourses)) {
        if (cur_courses.length > maxCourseCount) {
            maxCourseCount = cur_courses.length;
        }
    }

    for (const [term, courses] of Object.entries(groupedCourses)) {
        const curTermCourseList = [];

        for (var i = 0; i < maxCourseCount; i++) {
            if (i < courses.length) {
                curTermCourseList.push({
                    course_name: courses[i]["course_name"],
                    course_code: courses[i]["course_code"],
                    course_status: courses[i]["course_status"],
                    course_term: courses[i]["course_term"],
                });
            }
            // else {
            //     curTermCourseList.push({
            //         course_name: null,
            //         course_code: null,
            //         course_status: 0,
            //         course_term: courses[0]["course_term"],
            //     })
            // }
        }

        formattedDataSource.push({
            key: `${term}`,
            term_name: term,
            term_courses: curTermCourseList,
        });
    }

    return formattedDataSource;
};

function flushEmptyCourseCardBack(term_courses) {
    var new_term_courses = [];
    var empty_courses = [];

    for (var course of term_courses) {
        if (course["course_code"] !== null) {
            new_term_courses.push(course);
        } else {
            empty_courses.push(course);
        }
    }

    new_term_courses = [...new_term_courses, ...empty_courses];

    console.log(term_courses);
    console.log(new_term_courses);
    return new_term_courses;
}

// React component to display courses in a grid layout
const CourseTable = ({ groupedCourses }) => {
    // TODO: Draggable Cards
    // TODO: Right Click Menu
    // TODO: Search Course
    const documentRef = useRef(document);
    const tableRef = useRef(null);

    const [formattedCourseData, setFormattedCourseData] = useState([]);

    useEffect(() => {
        const formattedData = format_course_data_source(groupedCourses);

        setFormattedCourseData(formattedData);
    }, [groupedCourses]);

    // if(formattedCourseData.length > 0){
    //     console.log(formattedCourseData)
    // }

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

    // Draggable Course Card State
    const draggingCard = useRef(null);

    const [courseInfoModalOpen, setCourseInfoModalOpen] = useState(false);

    const [currentSelectedCourseInfo, setCurrentSelectedCourseInfo] = useState({});
    const [cardPopupListenerCreated, setCardPopupListenerCreated] = useState(false);
    const [emptyPopupListenerCreated, setEmptyPopupListenerCreated] = useState(false);

    // Ensure user_course_data is an array before processing
    if (groupedCourses === undefined || groupedCourses === null || Object.values(groupedCourses).length === 0) {
        return <div>No data available</div>;
    }

    function showCourseInfoModal(course_info) {
        // course_code, section, year
        setCurrentSelectedCourseInfo({
            code: course_info["code"].split(" ")[0],
            section: course_info["code"].split(" ")[1],
            term: course_info["term"],
        });
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

    function findCourseLocation(term, code) {
        var term_row_index = 0;
        var valid_term_row = false;
        // TODO: if the term is outside of the current course list, then create a new term if it's within the next three years
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

                // Push dragging course onto row
                newData[term_row_index].term_courses.push(draggedCard);
                newData[term_row_index].term_courses.at(-1)["course_term"] = term;

                // Delete old position
                newData[dragCardRow].term_courses.splice(dragCardCourse, 1);

                setFormattedCourseData(newData);
            } else {
                [term_row_index, term_course_index] = findCourseLocation(term, code);

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

    const checkCourseOfferValidity = (course_code, term) => {
        return true;
    };

    const findCoursePosition = (source_row_index, source_course_index) => {
        const tableDom = tableRef.current.querySelector(".ant-table-content");
        const termRowDom = tableDom.querySelectorAll("tbody tr")[source_row_index].querySelectorAll("td")[1].querySelector("div");
        const courseContainer = termRowDom.querySelectorAll("div .ant-col")[source_course_index];
        const courseContainerPosition = courseContainer.getBoundingClientRect();

        return [courseContainer, courseContainerPosition];
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

            if (!checkCourseOfferValidity(action["source_course"]["course_code"], target_term)) {
                return (
                    false,
                    `The course ${action["source_course"]["course_code"]} can not be added to term ${target_term} since it's not offered in that term.`
                );
            }

            const target_row_index = findCourseLocation(target_term, null);

            const newData = [...formattedCourseData];

            newData[target_row_index].term_courses.push({
                ...action["source_course"],
                course_term: target_term,
            });

            setFormattedCourseData(newData);

            const action_result = `The course ${action["source_course"]["course_code"]} is successfully added to term ${target_term}`;
            console.log(action_result);
            return true, action_result;
        } else if (action_name === "swap") {
            const target_code = action["dest_course"]["course_code"];
            const target_term = action["dest_course"]["course_term"];
            const [target_row_index, target_course_index] = findCourseLocation(target_term, target_code);

            const source_code = action["source_course"]["course_code"];
            const source_term = action["source_course"]["course_term"];
            const [source_row_index, source_course_index] = findCourseLocation(source_term, source_code);

            const newData = [...formattedCourseData];
            const target_card = newData[target_row_index].term_courses[target_course_index];

            newData[target_row_index].term_courses[target_course_index] = newData[source_row_index].term_courses[source_course_index];
            newData[source_row_index].term_courses[source_course_index] = target_card;

            newData[target_row_index].term_courses[target_course_index]["course_term"] = newData[target_row_index]["term_name"];
            newData[source_row_index].term_courses[source_course_index]["course_term"] = newData[source_row_index]["term_name"];

            setFormattedCourseData(newData);

            const action_result = `The course ${action["source_course"]["course_code"]} is successfully swapped with the course ${action["dest_course"]["course_code"]}`;
            console.log(action_result);
            return true, action_result;
        } else if (action_name === "move") {
            const target_term = action["dest_course"]["course_term"];
            const target_row_index = findCourseLocation(target_term, null);

            if (target_row_index === -1) {
                // Handle target term does not exist error
            }

            const source_code = action["source_course"]["course_code"];
            const source_term = action["source_course"]["course_term"];
            const [source_row_index, source_course_index] = findCourseLocation(source_term, source_code);

            if (source_row_index === -1) {
                // Handle source course does not exist error
            } else if (source_course_index === -1) {
                // Handle source course term does not exist error
            }

            const newData = [...formattedCourseData];
            
            console.log(source_row_index, source_course_index)

            // Animation
            const [courseContainer, courseContainerPosition] = findCoursePosition(source_row_index, source_course_index);
            const [targetContainer, targetContainerPosition] = findCoursePosition(
                target_row_index,
                newData[target_row_index].term_courses.length - 1
            );

            const translateX = targetContainerPosition.left - courseContainerPosition.left + targetContainerPosition.width;
            const translateY = targetContainerPosition.top - courseContainerPosition.top;

            const transformData = `translate(${translateX}px, ${translateY}px)`;
            const transitionData = `transform 0.5s ease-in-out`;

            courseContainer.style.transform = transformData;
            courseContainer.style.transition = transitionData;

            newData[target_row_index].term_courses.push(newData[source_row_index].term_courses[source_course_index]);
            newData[target_row_index].term_courses.at(-1)['course_term'] = newData[target_row_index]['term_name'];

            newData[source_row_index].term_courses.splice(source_course_index, 1);

            await sleep(500);

            setFormattedCourseData(newData);

            const action_result = `The course ${action["source_course"]["course_code"]} is successfully moved to the term ${target_term}`;
            console.log(action_result);
            return true, action_result;
        } else if (action_name === "delete") {
            const source_code = action["source_course"]["course_code"];
            const source_term = action["source_course"]["course_term"];
            const [source_row_index, source_course_index] = findCourseLocation(source_term, source_code);

            const newData = [...formattedCourseData];

            newData[source_row_index].term_courses.splice(source_course_index, 1);

            setFormattedCourseData(newData);

            const action_result = `The course ${action["source_course"]["course_code"]} is successfully deleted`;
            console.log(action_result);
            return true, action_result;
        } else {
            console.log("Action unrecognized.");
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

            draggedCard["course_term"] = term;

            // Special case where the new course order is re-arranged
            if (dragCardRow === term_row_index) {
                newData[term_row_index].term_courses[index] = newData[term_row_index].term_courses[index];
            }

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
                            <Col key={`col-${Math.random()}`} style={{ padding: 0, display: "flex", transition: "all 0.3s ease-in-out" }}>
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
                                        color: course["course_status"] === 0 ? "black" : "#f90",
                                    }}
                                    className={`CourseCardFamily ${course["course_code"] !== null ? "CourseCard" : "CourseCardHidden"}`}
                                    onClick={() =>
                                        course["course_code"] !== null &&
                                        showCourseInfoModal({
                                            code: course["course_code"],
                                            term: course["course_term"],
                                        })
                                    }
                                    draggable={
                                        course["course_code"] !== null &&
                                        !course["course_code"].includes("PEY") &&
                                        course["course_status"] === 1
                                    }
                                    onDragStart={() => handleCourseCardDragStart(course["course_term"], course["course_code"])}
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop={() => handleCourseCardDrop(course["course_term"], course["course_code"])}
                                >
                                    <span
                                        style={{
                                            fontSize: 14,
                                            fontFamily: "arial",
                                            textDecoration: "none",
                                            color: course["course_status"] === 0 ? "black" : "#f90",
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

    const text = <span>Title</span>;

    const content = (
        <div>
            <p>Content</p>
            <p>Content</p>
        </div>
    );

    return (
        <div className="course-table" style={{}} ref={tableRef}>
            <Modal
                title={`${currentSelectedCourseInfo["code"]} - Operating Systems (2022 - 2023)`}
                open={courseInfoModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                width={750}
            >
                <div>
                    <p style={{ display: "flex" }}>
                        <strong style={{ width: "30%" }}>Description:</strong>
                        <span style={{ width: "80%" }}> courseData.description</span>
                    </p>
                    <p style={{ display: "flex" }}>
                        <strong style={{ width: "30%" }}>Prerequisites:</strong>
                        <span style={{ width: "80%" }}> courseData.prerequisites</span>
                    </p>
                    <p style={{ display: "flex" }}>
                        <strong style={{ width: "30%" }}>Co-requisites:</strong>
                        <span style={{ width: "80%" }}> courseData.corequisites</span>
                    </p>
                    <p style={{ display: "flex" }}>
                        <strong style={{ width: "30%" }}>Exclusions:</strong>
                        <span style={{ width: "80%" }}> courseData.exclusions</span>
                    </p>
                    <p style={{ display: "flex" }}>
                        <strong style={{ width: "30%" }}>Credit Weight:</strong>
                        <span style={{ width: "80%" }}> courseData.creditWeight</span>
                    </p>
                    <p style={{ display: "flex" }}>
                        <strong style={{ width: "30%" }}>Area of Study:</strong>
                        <span style={{ width: "80%" }}> courseData.area</span>
                    </p>

                    <Divider></Divider>

                    <strong>Course Delivery:</strong>
                    <Table
                        columns={courseDeliveryColumns}
                        dataSource={courseDeliveryData}
                        pagination={false}
                        bordered
                        style={{ marginBottom: "15px" }}
                    />

                    <strong>AU Distribution(%):</strong>
                    <Table
                        columns={courseAUDistributionColumns}
                        dataSource={courseAUDistributionData}
                        pagination={false}
                        bordered
                        style={{ marginBottom: "15px" }}
                    />

                    <strong>CEAB AU:</strong>
                    <Table
                        columns={courseCEABAUColumns}
                        dataSource={courseCEABAUValueData}
                        pagination={false}
                        bordered
                        style={{ marginBottom: "15px" }}
                    />
                </div>
            </Modal>

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
                                    <Popover placement="rightTop" title={text} content={content} trigger={"hover"}>
                                        <QuestionCircleTwoTone
                                            style={{ marginLeft: "10px" }}
                                            onClick={() => {
                                                console.log("clicked questions");
                                            }}
                                        />
                                    </Popover>
                                </div>

                                <Button
                                    onClick={() => {
                                        manipulateCourseList({
                                            action: "move",
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
                                >
                                    Search Course <SearchOutlined />
                                </Button>
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
                <OnEmptyPopup {...emptyPopupState} />
                <OnCardPopup {...cardPopupState} />
            </ConfigProvider>
        </div>
    );
};

export default CourseTable;
