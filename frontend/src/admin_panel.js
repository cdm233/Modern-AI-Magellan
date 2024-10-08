import { Input, Button, Space, Collapse, List, Typography, Flex, Popconfirm, message, Upload, Switch, Divider } from "antd";
import { useState } from "react";
import CryptoJS from "crypto-js";
import { InboxOutlined } from "@ant-design/icons";

const AdminPanelContent = () => {
    // List of features:
    //  * Add a user
    //  * Get database status
    //  * Modify a course
    //  * Delete all courses
    //  * Delete a specific course
    //  * Modify a user information
    //  * Get a user
    //  * Delete all users
    //  * Delete a specific user

    const text = "hey";
    const [db_stats, setDB_stats] = useState([
        "Racing car sprays burning fuel into crowd.",
        "Japanese princess to wed commoner.",
        "Australian walks 100km after outback crash.",
        "Man charged over missing wedding girl.",
        "Los Angeles battles huge wildfires.",
    ]);

    const [dummyUserInfo, setDummyUserInfo] = useState({
        "name": "",
        "email": "",
        "number": "",
        "gender": "",
        "program": "",

        // Authentication
        "utorid": "",
        "password": ""
    });

    const [userFileList, setUserFileList] = useState([]);

    function getDatabaseStats() {
        setDB_stats(["Database statistics is now refreshed."]);
    }

    function deleteAllCourses() {
        message.success("All courses deleted from the Database.");
    }

    function deleteAllUsers() {
        message.success("All users deleted from the Database.");
    }

    const handleChange = (info) => {
        console.log(info);
        setUserFileList(info.fileList);

        var newFileList = [];
        for(const file of info.fileList){
            newFileList = [...newFileList, file.originFileObj]
        }
        setUserFileList(newFileList);
    };

    function uploadUserFile(){
        if(userFileList.length === 0){
            message.error("No file selected!");
            return;
        }
        
        for(const file of userFileList){
            const reader = new FileReader();

            reader.onload = e => {
                console.log(JSON.parse(e.target.result));
            };
            reader.readAsText(file);
        }

        message.success('User created!');
    }

    const userUploadProps = {
        name: "file",
        multiple: true,
        headers: {
            authorization: "authorization-text",
        },
        onChange: handleChange,
        beforeUpload: ()=>{
            return false;
        }
    };

    function handleInputChange(key, newValue) {
        setDummyUserInfo(prevCourse => ({
            ...prevCourse,
            [key]: newValue
        }));
    }

    const adminItems = [
        {
            key: "add_user",
            label: "Add a User",
            children: (
                <div>
                    {Object.entries(dummyUserInfo).map(([key, value]) => (
                        <Flex align="center" justify="left" style={{ marginTop: "5px" }}>
                            <span style={{ width: '10%' }}>{key}:</span>
                            <Input
                                value={value}
                                onChange={(event) => handleInputChange(key, event.target.value)}
                            />
                        </Flex>
                    ))}
                    
                    <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', marginTop: '15px'}}>
                        <Button type="primary" onClick={()=>{
                            console.log(dummyUserInfo);
                            message.success('User created!');
                        }}>Upload User Manually</Button>
                    </div>

                    <Divider>OR Upload User File Directly</Divider>

                    <Upload.Dragger {...userUploadProps}>
                        <p className="ant-upload-drag-icon">
                            <InboxOutlined />
                        </p>
                        <p className="ant-upload-text">Click or drag user files to this area to upload</p>
                        <p className="ant-upload-hint">Support for a single user file or bulk upload. Legal users will be created.</p>
                    </Upload.Dragger>
                    
                    <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', marginTop: '15px'}}>
                        <Button type="primary" onClick={()=>{
                            uploadUserFile();
                        }}>Upload User with File</Button>
                    </div>
                </div>
            ),
        },
        {
            key: "get_db_stats",
            label: "Get Database Statistics",
            children: (
                <div>
                    <List
                        header={
                            <Flex align="center" justify="space-between">
                                <Typography.Title level={2}>Database Statistics</Typography.Title>{" "}
                                <Button onClick={getDatabaseStats}>Refresh</Button>{" "}
                            </Flex>
                        }
                        bordered
                        dataSource={db_stats}
                        renderItem={(item) => <List.Item>{item}</List.Item>}
                    />
                </div>
            ),
        },
        {
            key: "query_course",
            label: "Query a Course",
            children: <p>{text}</p>,
        },
        {
            key: "modify_course",
            label: "Modify a Course",
            children: <p>{text}</p>,
        },
        {
            key: "delete_all_course",
            label: "Delete All Courses",
            children: (
                <Popconfirm
                    title="Delete All Courses"
                    description="Are you sure to perform this action?"
                    okText="Yes"
                    cancelText="No"
                    placement="right"
                    onConfirm={(e) => {
                        console.log(e);
                        deleteAllCourses();
                    }}
                >
                    <Button danger type="primary">
                        Delete All Courses
                    </Button>
                </Popconfirm>
            ),
        },
        {
            key: "delete_course",
            label: "Delete a course",
            children: <p>{text}</p>,
        },
        {
            key: "query_user",
            label: "Query a User",
            children: <p>{text}</p>,
        },
        {
            key: "modify_user",
            label: "Modify a User",
            children: <p>{text}</p>,
        },
        {
            key: "delete_all_user",
            label: "Delete All Users",
            children: (
                <Popconfirm
                    title="Delete All Users"
                    description="Are you sure to perform this action?"
                    okText="Yes"
                    cancelText="No"
                    placement="right"
                    onConfirm={(e) => {
                        console.log(e);
                        deleteAllUsers();
                    }}
                >
                    <Button danger type="primary">
                        Delete All Users
                    </Button>
                </Popconfirm>
            ),
        },
        {
            key: "delete_user",
            label: "Delete a User",
            children: <p>{text}</p>,
        },
    ];

    return (
        <div style={{ padding: "12px" }}>
            <h1>Admin Panel</h1>

            <Collapse
                items={adminItems}
                defaultActiveKey={["add_user"]}
                onChange={(a, b, c) => {
                    console.log(a, b, c);
                }}
            />
        </div>
    );
};

const AdminPanel = () => {
    const [adminLogin, setAdminLogin] = useState(false);
    const [loginInputValue, setLoginInputValue] = useState("");
    const hardcodedHash = "6ca13d52ca70c883e0f0bb101e425a89e8624de51db2d2392593af6a84118090";

    function admin_login(loginInputValue) {
        const hashedPassword = CryptoJS.SHA256(loginInputValue).toString();

        console.log(hashedPassword);
        if (hashedPassword === hardcodedHash) {
            setAdminLogin(true);
        } else {
            alert("Login credential is not correct!");
        }
    }

    return (
        <>
            {adminLogin ? (
                <AdminPanelContent></AdminPanelContent>
            ) : (
                <div>
                    <h1>Admin Panel Log in</h1>
                    <Space.Compact style={{ width: "100%" }}>
                        <Input.Password
                            value={loginInputValue}
                            onChange={(event) => {
                                setLoginInputValue(event.target.value);
                            }}
                            onPressEnter={() => {
                                admin_login(loginInputValue);
                            }}
                        />
                        <Button
                            type="primary"
                            onClick={() => {
                                admin_login(loginInputValue);
                            }}
                            style={{ height: 40 }}
                        >
                            Login
                        </Button>
                    </Space.Compact>
                </div>
            )}
        </>
    );
};

export default AdminPanel;
