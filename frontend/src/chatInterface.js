import React, { useState, useRef, useEffect } from "react";
import { Input, Button, Space, Tooltip } from "antd";
import { AudioOutlined, CopyOutlined, EditOutlined, PauseOutlined, ReloadOutlined, CheckOutlined, CloseOutlined } from "@ant-design/icons";
import "./App.css";
import { format_course_data_source, alphanumerical } from "./utils";

const { TextArea } = Input;

const CopyToClipboardButton = ({ content }) => {
    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = (content) => {
        navigator.clipboard
            .writeText(content)
            .then(() => {
                setIsCopied(true);
                setTimeout(() => setIsCopied(false), 2000);
            })
            .catch((err) => {
                console.error("Failed to copy text: ", err);
            });
    };

    return (
        <Tooltip placement="bottom" arrow title={"Copy"}>
            <Button
                onClick={() => handleCopy(content)}
                type="text"
                size="small"
                style={{ marginLeft: "5px" }}
                shape="circle"
                icon={isCopied ? <CheckOutlined /> : <CopyOutlined />}
            />
        </Tooltip>
    );
};

const SpeakModelResponseButton = ({ content }) => {
    const [isSpeaking, setIsSpeaking] = useState(false);
    const utteranceRef = useRef(null);

    const handleModelResponseReadButton = (content) => {
        if (isSpeaking) {
            speechSynthesis.cancel();
            setIsSpeaking(false);
        } else {
            utteranceRef.current = new SpeechSynthesisUtterance(content);
            utteranceRef.current.onend = () => setIsSpeaking(false);
            speechSynthesis.speak(utteranceRef.current);
            setIsSpeaking(true);
        }
    };

    return (
        <Tooltip placement="bottom" arrow title={"Read"}>
            <Button onClick={() => handleModelResponseReadButton(content)} type="text" size="small" shape="circle">
                <span
                    style={{
                        position: "absolute",
                        transition: "opacity 0.2s ease-out, transform 0.5s ease-out",
                        opacity: isSpeaking ? 1 : 0,
                        transform: isSpeaking ? "scale(1)" : "scale(0.8)",
                    }}
                >
                    <PauseOutlined />
                </span>
                <span
                    style={{
                        position: "absolute",
                        transition: "opacity 0.2s ease-out, transform 0.5s ease-out",
                        opacity: isSpeaking ? 0 : 1,
                        transform: isSpeaking ? "scale(0.8)" : "scale(1)",
                    }}
                >
                    <AudioOutlined />
                </span>
            </Button>
        </Tooltip>
    );
};

const ChatRow = ({ index, turn, chatHistory, setChatHistory }) => {
    const userHidden = turn["role"] === "assistant";
    const [displayEditButton, setDisplayEditButton] = useState(true);
    const [displayEditButtonHover, setDisplayEditButtonHover] = useState(false);

    const [userInputDisabled, setUserInputDisabled] = useState(true);
    const [currentDisplayText, setCurrentDisplayText] = useState(turn["content"]);

    const [originalInputText, setOriginalInputText] = useState(turn["content"]);

    const onUserRowHoverEnter = () => {
        setDisplayEditButtonHover(true);
    };

    const onUserRowHoverEnd = () => {
        setDisplayEditButtonHover(false);
    };

    const updateCurrentText = (e) => {
        setCurrentDisplayText(e.target.value);
    };

    const updateUserText = (index) => {
        console.log("Update user text and disable text area");
        setDisplayEditButton(true);
        setUserInputDisabled(true);
        setOriginalInputText(currentDisplayText);

        const newChatHistory = [...chatHistory];

        newChatHistory[index]["content"] = currentDisplayText;

        setChatHistory(newChatHistory);

        console.log("New chat history:", newChatHistory);
    };

    const handleCancelEdit = (e) => {
        console.log("Cancel edit.");
        setDisplayEditButton(true);
        setUserInputDisabled(true);
        setCurrentDisplayText(originalInputText);
    };

    const handleModelResponseRegenerateButton = (index, content) => {
        console.log(index, content);
        console.log("Regenerate");
    };

    return (
        <div
            key={index}
            className="ChatRow"
            onMouseOver={userHidden ? null : onUserRowHoverEnter}
            onMouseLeave={userHidden ? null : onUserRowHoverEnd}
            style={{
                display: "flex",
                justifyContent: userHidden ? "flex-start" : "flex-end",
                alignItems: "flex-start",
                marginBottom: "10px",
            }}
        >
            <div
                className="UserAvatar"
                style={{
                    marginRight: "25px",
                    visibility: userHidden ? "visible" : "hidden",
                }}
            >
                Model
            </div>
            <div
                style={{
                    width: userHidden ? "calc(100% - 150px)" : "calc(70% - 150px)",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <Button
                    onClick={() => {
                        setUserInputDisabled(false);
                        setDisplayEditButton(false);
                    }}
                    style={{
                        display: userHidden ? "none" : "",
                        width: "32px",
                        height: "32px",
                        marginRight: "15px",
                        visibility: displayEditButtonHover && displayEditButton ? "visible" : "hidden",
                    }}
                    shape="circle"
                >
                    <EditOutlined />
                </Button>

                <div
                    className="ChatContent"
                    style={{
                        textAlign: "left",
                        border: userHidden ? "" : "1px solid rgb(230, 230, 230)",
                        padding: userHidden ? "5px" : "15px",
                        borderRadius: "15px",
                        width: "calc(100% - 50px)",
                        backgroundColor: userHidden ? "" : "rgb(230, 230, 230)",
                    }}
                >
                    {!userHidden ? (
                        <div style={{ display: "flex", flexDirection: "column" }}>
                            <TextArea
                                variant="borderless"
                                value={currentDisplayText}
                                style={{
                                    width: "100%",
                                    fontSize: "12pt",
                                    color: "black",
                                }}
                                disabled={userInputDisabled}
                                onChange={updateCurrentText}
                                autoSize
                            />

                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    justifyContent: "flex-end",
                                }}
                            >
                                <Button
                                    onClick={handleCancelEdit}
                                    style={{
                                        display: userInputDisabled ? "none" : "",
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={() => updateUserText(index)}
                                    style={{
                                        display: userInputDisabled ? "none" : "",
                                        marginLeft: "15px",
                                    }}
                                    type="primary"
                                >
                                    Okay
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div>
                            {currentDisplayText}
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    justifyContent: "flex-start",
                                    marginTop: "15px",
                                }}
                            >
                                <SpeakModelResponseButton content={turn["content"]} />
                                <CopyToClipboardButton content={turn["content"]} />
                                <Button
                                    onClick={() => handleModelResponseRegenerateButton(index, turn["content"])}
                                    type="text"
                                    size="small"
                                    style={{ marginLeft: "5px" }}
                                    shape="circle"
                                    icon={<ReloadOutlined />}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div
                className="UserAvatar"
                style={{
                    marginLeft: "25px",
                    visibility: !userHidden ? "visible" : "hidden",
                }}
            >
                User
            </div>
        </div>
    );
};

const ChatInterface = ({ chatHistory, setChatHistory, draggingCourse, courseList, queryCourses, setQueryCourses }) => {
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const [currentChatValue, setCurrentChatValue] = useState("");

    const [formattedCourseData, setFormattedCourseData] = useState([]);

    useEffect(() => {
        const formattedData = format_course_data_source(courseList);

        setFormattedCourseData(formattedData);
    }, [courseList]);

    const sendChat = () => {
        if (buttonDisabled) {
            return;
        }

        setChatHistory([
            ...chatHistory,
            {
                role: "user",
                content: currentChatValue,
            },
        ]);
        setButtonDisabled(true);
        setCurrentChatValue("");
    };

    const handleInputChange = (event) => {
        setCurrentChatValue(event.target.value);
    };

    const root_ref = useRef(null);

    if(root_ref.current !== null){
        
        console.log(root_ref.current.offsetWidth);
    }

    return (
        <div
            style={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                backgroundColor: "rgb(250, 250, 250)",
            }}
            ref={root_ref}
        >
            <div style={{ height: "92%", minWidth: "350px", maxWidth: "80%" }}>
                {chatHistory.map((item, index) => (
                    <ChatRow key={index} index={index} turn={item} chatHistory={chatHistory} setChatHistory={setChatHistory} />
                ))}
            </div>

            <div
                style={{
                    width: "40vw",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    position: "fixed",
                    bottom: "30px",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        marginBottom: "5px",
                    }}
                >
                    {queryCourses.map((item, iterator) => (
                        <div key={`QC-${alphanumerical()}`}>
                            <CloseOutlined
                                className="closeButton"
                                onClick={() => {
                                    console.log("Delete course");
                                    const newData = [...queryCourses];
                                    newData.splice(iterator, 1);
                                    setQueryCourses(newData);
                                }}
                            />

                            <div
                                style={{
                                    width: "130px",
                                    height: "60px",
                                    marginRight: "5px",
                                    color: item["status"] === 0 ? "black" : "#f90",
                                    cursor: 'default'

                                }}
                                className="CourseCard"
                            >
                                <span
                                    style={{
                                        fontSize: 14,
                                        fontFamily: "arial",
                                        textDecoration: "none",
                                        color: item["status"] === 0 ? "black" : "#f90",
                                        fontWeight: "bold",
                                    }}
                                    className="CourseCardFamily CourseCardCode"
                                >
                                    {item["code"]}
                                </span>

                                <div
                                    style={{
                                        fontSize: "7pt",
                                        fontFamily: "arial",
                                        lineHeight: "1",
                                    }}
                                    className="CourseCardFamily CourseCardName"
                                >
                                    {item["name"]}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <Space.Compact style={{ width: "100%" }}>
                    <Input
                        placeholder="Ask me anything..."
                        value={currentChatValue}
                        onChange={handleInputChange}
                        onPressEnter={sendChat}
                        style={{ height: 40 }}
                        key={"userInput"}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={() => {
                            console.log(draggingCourse.current);
                            console.log(queryCourses);
                            setQueryCourses([
                                ...new Set([
                                    ...queryCourses,
                                    formattedCourseData[draggingCourse.current.term_row_index].term_courses[
                                        draggingCourse.current.term_course_index
                                    ],
                                ]),
                            ]);
                        }}
                    />
                    <Button type="primary" onClick={sendChat} loading={buttonDisabled} style={{ height: 40 }}>
                        Send
                    </Button>
                </Space.Compact>
            </div>
        </div>
    );
};

export default ChatInterface;
