import React from "react";
import "./index.css";
import { DeleteOutlined, HeartOutlined, PlusOutlined, QuestionOutlined, SearchOutlined, StarOutlined, UserOutlined } from "@ant-design/icons";

function handleDeleteCourse() {
    console.log("Delete Course");
}

function handleAddCourse() {
    console.log("Add Course");    
}

function handleAskAssistant() {
    console.log("Ask Assistant");

}

function handleGetCourseDetails() {
    console.log("Get Details");
}

const OnEmptyPopup = ({ record, target, visible, x, y }) =>
    visible && (
        <ul
            className="popup"
            style={{ position: "fixed", left: `${x}px`, top: `${y}px` }}
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

const OnCardPopup = ({ record, target, visible, x, y }) =>
    visible && (
        <ul
            className="popup"
            style={{ position: "fixed", left: `${x}px`, top: `${y}px` }}
        >
            <li onClick={handleGetCourseDetails}>
                <SearchOutlined />
                &nbsp; Course Details
            </li>
            <li onClick={handleAskAssistant}>
                <UserOutlined />
                &nbsp; Ask Assistant
            </li>
            <li onClick={handleDeleteCourse} style={{color: 'red'}}>
                <DeleteOutlined />
                &nbsp; Delete Course
            </li>
        </ul>
    );

export {OnEmptyPopup, OnCardPopup};
