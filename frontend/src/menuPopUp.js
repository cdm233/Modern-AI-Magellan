import React, { useState, useEffect, useRef } from "react";
import "./index.css";
import { Col, Row, Table, Divider, Button, ConfigProvider, Modal, Popover, Tabs, Input, Alert, Checkbox, Space, Flex } from "antd";
import { DeleteOutlined, HeartOutlined, PlusOutlined, QuestionOutlined, SearchOutlined, StarOutlined, UserOutlined } from "@ant-design/icons";
import { alphanumerical } from "./utils";

function handleDeleteCourse() {
    console.log("Delete Course");
}

function handleAddCourse() {
    console.log("Add Course");    
}

function handleAskAssistant(record, target, queryCourses, setQueryCourses) {
    console.log("Ask Assistant");
    console.log(record, target, queryCourses);

    for(var course of record.term_courses){
        if(course['course_code'] === target){
            if(queryCourses){
                setQueryCourses([
                    ...new Set([
                        ...queryCourses,
                        course
                    ]),
                ]);
            } else {
                setQueryCourses([course])
            }
        }
    }
}

function handleGetCourseDetails(record, target) {
    console.log("Get Details");
    for(var course of record.term_courses){
        if(course['course_code'] === target){
            console.log(course);
        }
    }
}

const OnEmptyPopup = ({ record, target, visible, x, y }) =>
    visible && (
        <ul
            className="popup"
            style={{ position: "fixed", left: `${x}px`, top: `${y}px`, zIndex: 3 }}
        >
            <li onClick={handleAddCourse}>
                <PlusOutlined />
                &nbsp; Add Course
            </li>
            <li onClick={handleAskAssistant}>
                <UserOutlined />
                &nbsp; Ask Assistant
            </li>
            <li onClick={handleDeleteCourse} style={{color: 'red'}}>
                <DeleteOutlined />
                &nbsp; Delete All
            </li>
        </ul>
    );

    const OnCardPopup = ({ record, target, visible, x, y, queryCourses, setQueryCourses, setCourseList }) => {
        const [modalOpen, setModelOpen] = useState(false);
        const [currentCourse, setCurrentCourse] = useState({});
        const courseLocation = useRef([-1, -1]);
    
        function handleInputChange(key, newValue) {
            setCurrentCourse(prevCourse => ({
                ...prevCourse,
                [key]: newValue
            }));
        }
    
        function handleEditCourse(record, target) {
            console.log("Edit Course");
            
            for (let course of record.term_courses) {
                if (course['course_code'] === target) {
                    setCurrentCourse(course);
                    setModelOpen(true);
                    break;
                }
            }
        }
    
        const handleModalOK = () => {
            setCourseList(prevState => {
                const newData = [...prevState];
                const course = newData[courseLocation.current[0]].term_courses[courseLocation.current[1]];
    
                for (const [key, value] of Object.entries(currentCourse)) {
                    if(typeof(course[key]) === 'number'){
                        course[key] = Number(value);
                    } else {
                        course[key] = value;
                    }
                }
                
                return newData;
            });
    
            setModelOpen(false);
        };
    
        useEffect(() => {
            if (record !== null) {
                setCourseList(prevState => {
                    let term_row_index = 0;
                    for (; term_row_index < prevState.length; term_row_index++) {
                        if (prevState[term_row_index]["term_name"] === record.term_name) {
                            break;
                        }
                    }
            
                    let term_course_index = 0;
                    for (; term_course_index < prevState[term_row_index]["term_courses"].length; term_course_index++) {
                        if (prevState[term_row_index]["term_courses"][term_course_index]["course_code"] === currentCourse.course_code) {
                            break;
                        }
                    }
        
                    courseLocation.current = [term_row_index, term_course_index];
                    return prevState;
                });
            }
        }, [currentCourse, record, setCourseList]);
    
        return (
            <div>
                <Modal
                    title="Course Debug Menu"
                    open={modalOpen}
                    onOk={handleModalOK}
                    onCancel={() => setModelOpen(false)}
                    width={750}
                    style={{
                        top: '5%'
                    }}
                >
                    {Object.entries(currentCourse).map(([key, value]) => (
                        <Flex key={key} style={{marginTop: '5px'}}>
                            <span style={{ width: '20%' }}>{key}:</span>
                            <Input
                                style={{ marginLeft: '10px', width: '80%' }}
                                value={value}
                                onChange={(event) => handleInputChange(key, event.target.value)}
                            />
                        </Flex>
                    ))}
                </Modal>
    
                {visible && (
                    <ul
                        className="popup"
                        style={{ position: "fixed", left: `${x}px`, top: `${y}px`, zIndex: 3 }}
                    >
                        <li onClick={() => { handleGetCourseDetails(record, target) }}>
                            <SearchOutlined />
                            &nbsp; Course Details
                        </li>
                        <li onClick={() => { handleAskAssistant(record, target, queryCourses, setQueryCourses) }}>
                            <UserOutlined />
                            &nbsp; Ask Assistant
                        </li>
                        <li onClick={handleDeleteCourse} style={{ color: 'red' }}>
                            <DeleteOutlined />
                            &nbsp; Delete Course
                        </li>
                        <li onClick={() => { handleEditCourse(record, target) }} style={{ color: 'red' }}>
                            <DeleteOutlined />
                            &nbsp; [DEBUG] Edit Course
                        </li>
                    </ul>
                )}
            </div>
        );
    };

export {OnEmptyPopup, OnCardPopup};
