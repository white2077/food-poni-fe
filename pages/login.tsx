import type {NextPage} from 'next'
import {Avatar, Button, Card, Checkbox, Form, Input, notification, Space} from 'antd';
import {GithubOutlined, GoogleOutlined, LockOutlined, UserOutlined} from "@ant-design/icons";
import {useEffect, useState} from "react";
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

export interface IUserRemember {
    username: string;
    password: string;
    avatar: string;
}

const Login: NextPage = () => {

    const router: NextRouter = useRouter();

    const dispatch = useDispatch();

    const [isLoading, setIsLoading] = useState(true);

    const [username, setUsername] = useState('');

    const [password, setPassword] = useState('');

    const [pending, setPending] = useState<boolean>(false);

    useEffect(() => {
        // Kiểm tra nếu cookie REMEMBER_ME tồn tại
        const rememberMeCookie = getCookie(REMEMBER_ME);
        if (rememberMeCookie) {
            // Giải mã thông tin từ cookie REMEMBER_ME
            const userRemember = JSON.parse(atob(rememberMeCookie));
            // Đặt giá trị của username bằng userRemember.username
            setUsername(userRemember.username || '');
            setPassword(userRemember.password || '');
        }
        // Đã cập nhật username, đặt loading thành false
        setIsLoading(false);
    },[]);

    const onFinish = (values: any): void => {
        setPending(true);
        let user: AuthenticationRequest = values.username.includes("@")
            ? {username: null, email: values.username, password: values.password}
            : {username: values.username, email: null, password: values.password}

        axiosInterceptor.post("/auth/login", user)
            .then(function (res: AxiosResponse<AuthenticationResponse>): void {
                setPending(false);

                const accessToken: string = res.data.accessToken ?? "";

                if (accessToken) {
                    const payload: CurrentUser = jwtDecode(accessToken);
                    dispatch(setCurrentUser(payload));
                    setAccessToken(accessToken);

                    // set refresh token
                    setCookie(REFRESH_TOKEN, res.data.refreshToken, {
                        expires: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 30),
                    });

                    //set user remembered and delete
                    if (values.remember) {
                        const userRemember: IUserRemember = {
                            username: user.username ? user.username! : user.email!,
                            password: user.password,
                            avatar: "currentUser.avatar"
                        }
                        setCookie(REMEMBER_ME, btoa(JSON.stringify(userRemember)), {
                            expires: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 30),
                        });
                    } else deleteCookie(REMEMBER_ME);

                    router.push('/');
                }

            })
            .catch(function (res): void {
                setPending(false);
                notification.open({
                    type: 'error',
                    message: 'Login message',
                    description: res.message,
                });
            });
    };

    return (
        <div className='bg-[url("/login-bg.png")] bg-cover bg-center bg-no-repeat h-screen'>
            <Card style={{width: "500px", margin: "auto"}} loading={isLoading}>
                <Space direction="vertical" size="middle" style={{display: 'flex'}}>
                    <div>
                        <Avatar size={64} icon={<UserOutlined/>}/>
                        <h2>Welcome back!...</h2>
                        <span>Sign in to your account to continue</span>
                    </div>
                    <Form
                        name="normal_login"
                        className="login-form"
                        initialValues={{remember: true}}
                        onFinish={onFinish}
                    >
                        <Form.Item
                            name="username"
                            rules={[{required: true, message: 'Please input your Username or Email!'}]}
                            initialValue={username}
                        >
                            <Input prefix={<UserOutlined className="site-form-item-icon"/>} placeholder="Username"/>
                        </Form.Item>
                        <Form.Item
                            name="password"
                            rules={[{required: true, message: 'Please input your Password!'}]}
                            initialValue={password}
                        >
                            <Input
                                prefix={<LockOutlined className="site-form-item-icon"/>}
                                type="password"
                                placeholder="Password"
                            />
                        </Form.Item>
                        <Form.Item>
                            <Form.Item name="remember" valuePropName="checked" noStyle>
                                <Checkbox>Remember me</Checkbox>
                            </Form.Item>

                            <a className="login-form-forgot" href="">
                                Forgot password
                            </a>
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="login-form-button" loading={pending}
                                    block>
                                Log in
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
                        <a className='float-right' onClick={() => router.push('/signup')}>Register now</a>
                    </div>
                </Space>
            </Card>
        </div>

    );

};

export default Login;
