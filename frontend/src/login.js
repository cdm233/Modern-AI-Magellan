import React, { useState } from "react";
import "./login.css";
import { Input, Button, Typography, Form, Checkbox } from "antd";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

function LoginForm({ setAuthenticated }) {
    const navigate = useNavigate();

    const handleSubmit = async () => {
        console.log("Valid user")
        // Send request to server
        const success_login = true;

        if(success_login){
            setAuthenticated(true);

            navigate('/dashboard')
        } else {

        }
    };

	const onFinish = (values) => {
		console.log('Success:', values);

		handleSubmit();
	};

	const onFinishFailed = (errorInfo) => {
		console.log('Failed:', errorInfo);
	};
	  
    return (
        <div className="login-container">
            <Title level={2} style={{ marginTop: "10px" }}>
                Login
            </Title>
            <Form
                name="basic"
                labelCol={{
                    span: 6,
                }}
                wrapperCol={{
                    span: 18,
                }}
                style={{
                    maxWidth: 600,
                }}
                initialValues={{
                    remember: true,
                }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="on"
            >
                <Form.Item
                    label="UTORid"
                    name="username"
                    rules={[
                        {
                            required: true,
                            message: "Please input your UTORid!",
                        },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Password"
                    name="password"
                    rules={[
                        {
                            required: true,
                            message: "Please input your password!",
                        },
                    ]}
                >
                    <Input.Password />
                </Form.Item>

				<div style={{display: 'flex', flexDirection: 'column', justifyContent: 'right', marginTop: '-14px'}}>
					<Form.Item
						name="remember"
						valuePropName="checked"
						wrapperCol={{
						    offset: 6,
						    span: 18,
						}}
						style={{marginBottom: '10px'}}
					>
						<Checkbox>Remember me</Checkbox>
					</Form.Item>

					<Form.Item
						wrapperCol={{
						    offset: 18,
						    span: 6,
						}}
					>
						<Button type="primary" htmlType="submit">
							Submit
						</Button>
					</Form.Item>
				</div>
            </Form>
        </div>
    );
}

export default LoginForm;

{
    /* <div className="login-container">
<Title level={2} style={{marginTop: '10px'}}>Login</Title>
<form onSubmit={handleSubmit}>
	<div className="form-group">
		<Title level={5}>Email:</Title>
		<Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'}}/>
	</div>
	<div className="form-group">
		<Title level={5}>Password:</Title>
		<Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'}}/>
	</div>
	{error && <p className="error">{error}</p>}
	<div style={{display: 'flex', justifyContent: 'right'}}>
		<Button type="primary" onClick={(e)=>handleSubmit(e)} style={{width: '75px'}}>Login</Button>
	</div>
</form>
</div> */
}
