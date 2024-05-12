import type {NextPage} from 'next'
import {Avatar, Button, Card, Checkbox, Form, Input, notification, Space} from 'antd';
import {
    GithubOutlined,
    GoogleOutlined,
    LockOutlined,
    MailOutlined,
    UnlockOutlined,
    UserOutlined
} from "@ant-design/icons";
import {useEffect, useRef, useState} from "react";
import {deleteCookie, getCookie, setCookie} from "cookies-next";
import {REFRESH_TOKEN, REMEMBER_ME} from "../utils/server";
import {NextRouter, useRouter} from "next/router";
import {useDispatch} from "react-redux";
import {AuthenticationRequest} from "../models/auth/AuthenticationRequest";
import {AuthenticationResponse} from "../models/auth/AuthenticationResponse";
import {AxiosResponse} from "axios";
import jwtDecode from "jwt-decode";
import {CurrentUser, setCurrentUser} from "../stores/user.reducer";
import axiosInterceptor from "../utils/axiosInterceptor";
import {setAccessToken} from "../utils/auth";
import {UserCreationRequestDTO} from "../models/user/UserRequest";
import {UserResponseDTO} from "../models/user/UserResponseAPI";

export interface IUserRemember {
    username: string;
    password: string;
    avatar: string;
}

const Signup: NextPage = () => {

    const router: NextRouter = useRouter();

    const dispatch = useDispatch();

    const [isLoading, setIsLoading] = useState(true);

    const [username, setUsername] = useState('');

    const [password, setPassword] = useState('');

    const [pending, setPending] = useState<boolean>(false);

    const formRef = useRef(null);

    const validateConfirmPassword = (_: any,value: string) => {
        const getFieldValue  = formRef.current;
        console.log(getFieldValue('password'))
        if (value !== getFieldValue('password')) {
            return Promise.reject(new Error('Passwords do not match'));
        }
        return Promise.resolve();
    };

    useEffect(() => {
        setIsLoading(false);
    },[]);

    const onFinish = (values: any): void => {
        setPending(true);
        let user: UserCreationRequestDTO ={username: values.username, email: values.email, password: values.password}
        axiosInterceptor.post("/users", user)
            .then(function (res: AxiosResponse<UserResponseDTO>): void {
                setPending(false);
                notification.open({
                    type: 'success',
                    message: 'Sign up',
                    description: 'Sign up success!',
                });
                const userRemember: IUserRemember = {
                    username: user.username ? user.username! : user.email!,
                    password: user.password,
                    avatar: "currentUser.avatar"
                }
                setCookie(REMEMBER_ME, btoa(JSON.stringify(userRemember)), {
                    expires: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 30),
                });
                router.push('/login');
            })
            .catch(function (res): void {
                setPending(false);
                notification.open({
                    type: 'error',
                    message: 'Sign up message',
                    description: res.response.data.error.message,
                });
            });
    };

    return (
        <div className='bg-[url("/login-bg.png")] bg-cover bg-center bg-no-repeat h-screen'>
            <Card style={{width: "500px", margin: "auto"}} loading={isLoading}>
                <Space direction="vertical" size="middle" style={{display: 'flex'}}>
                    <div className="my-2">
                        <Avatar size={64} icon={<UserOutlined/>}/>
                        <h2>Welcome! Create your account to get started.</h2>
                        <span>Sign up to create your account and unlock all the features</span>
                    </div>
                    <Form
                        name="normal_login"
                        className="login-form"
                        form={formRef.current}
                        initialValues={{remember: true}}
                        onFinish={onFinish}
                    >
                        <Form.Item
                            name="username"
                            rules={[{required: true, message: 'Please input your Username or Email!'}]}
                        >
                            <Input prefix={<UserOutlined className="site-form-item-icon"/>} placeholder="Username"/>
                        </Form.Item>
                        <Form.Item
                            name="email"
                            rules={[
                                { required: true, message: 'Please input your Email!' },
                                { type: 'email', message: 'Please enter a valid email address' }
                            ]}
                        >
                            <Input prefix={<MailOutlined className="site-form-item-icon"/>} placeholder="Email"/>
                        </Form.Item>
                        <Form.Item
                            name="password"
                            rules={[{required: true, message: 'Please input your Password!'}]}
                        >
                            <Input
                                prefix={<LockOutlined className="site-form-item-icon"/>}
                                type="password"
                                placeholder="Password"
                            />
                        </Form.Item>
                        <Form.Item
                            name="rePassword"
                            dependencies={['password']}
                            rules={[
                                { required: true, message: 'Please input your Password!' },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('password') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('The two passwords that you entered do not match!'));
                                    },
                                }),
                            ]}
                        >
                            <Input
                                prefix={<UnlockOutlined className="site-form-item-icon"/>}
                                type="password"
                                placeholder="Re-enter password"
                            />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="login-form-button" block>
                                Sign up
                            </Button>
                        </Form.Item>
                    </Form>
                    <div>
                        <div style={{float: 'left'}}>
                            <Space>
                                Other login method
                                <GithubOutlined/>
                                <GoogleOutlined/>
                            </Space>
                        </div>
                        <a className='float-right' onClick={() => router.push('/login')}>Login now</a>
                    </div>
                </Space>
            </Card>
        </div>

    );

};

export default Signup;
