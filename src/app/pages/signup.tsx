import type { NextPage } from "next";
import { Button, Card, Form, Input, notification, Space } from "antd";
import React, { useEffect, useState } from "react";
import { setCookie } from "cookies-next";
import { REMEMBER_ME } from "../utils/server";
import { NextRouter, useRouter } from "next/router";
import { AxiosResponse } from "axios";
import { UserCreationRequestDTO } from "../models/user/UserRequest";
import { api } from "../utils/axios-config";
import { UserAPIResponse } from "../models/user/UserAPIResponse";

export interface IUserRemember {
  username: string;
  password: string;
  avatar: string;
}

const Signup: NextPage = () => {
  const router: NextRouter = useRouter();

  const [isLoading, setIsLoading] = useState(true);

  const [pending, setPending] = useState<boolean>(false);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const onFinish = (values: any): void => {
    setPending(true);
    let user: UserCreationRequestDTO = {
      username: values.username,
      email: values.email,
      password: values.password,
    };
    api
      .post("/users", user)
      .then(function (res: AxiosResponse<UserAPIResponse>): void {
        setPending(false);
        notification.open({
          type: "success",
          message: "Đăng ký",
          description: "Đăng ký tài khoản thành công!",
        });
        const userRemember: IUserRemember = {
          username: user.username ? user.username! : user.email!,
          password: user.password,
          avatar: "currentUser.avatar",
        };
        setCookie(REMEMBER_ME, btoa(JSON.stringify(userRemember)), {
          expires: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 30),
        });
        router.push("/login");
      })
      .catch(function (res): void {
        setPending(false);
        notification.open({
          type: "error",
          message: "Đăng ký",
          description: res.response.data.error.message,
        });
      });
  };

  return (
    <div className='font-medium bg-[url("/logo-bg.jpeg")] bg-cover bg-center bg-no-repeat h-screen flex items-center'>
      <Card style={{ width: "350px", margin: "auto" }} loading={isLoading}>
        <Space direction="vertical" size="middle" style={{ display: "flex" }}>
          <div className="my-2 flex flex-col gap-2">
            <div className="flex justify-center font-medium text-xl gap-2">
              Đăng ký
              <span className="text-orange-500 font-['Impact','fantasy'] flex">
                {" "}
                <img src="/Logo.png" className="w-6 h-6" />
                FoodPoni
              </span>
            </div>
            <div className="flex justify-center gap-1 font-medium text-gray-500">
              Bạn đã có tài khoản?
              <a className="float-right" onClick={() => router.push("/login")}>
                Đăng nhập
              </a>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2.5 text-gray-400">
            <a className="btn btn-light btn-sm justify-center gap-1" href="#">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M24 12.27C24 11.48 23.9284 10.73 23.8058 9.99998H12.2605V14.51H18.871C18.5747 15.99 17.7062 17.24 16.4189 18.09V21.09H20.3627C22.6717 19 24 15.92 24 12.27Z"
                  fill="#4285F4"
                />
                <path
                  d="M12.2606 24C15.571 24 18.3398 22.92 20.3628 21.09L16.419 18.09C15.3156 18.81 13.9158 19.25 12.2606 19.25C9.06269 19.25 6.35515 17.14 5.38453 14.29H1.31812V17.38C3.33089 21.3 7.46882 24 12.2606 24Z"
                  fill="#34A853"
                />
                <path
                  d="M5.38442 14.2901C5.12899 13.5701 4.99617 12.8001 4.99617 12.0001C4.99617 11.2001 5.13921 10.4301 5.38442 9.71009V6.62009H1.31801C0.480203 8.24009 0 10.0601 0 12.0001C0 13.9401 0.480203 15.7601 1.31801 17.3801L5.38442 14.2901Z"
                  fill="#FBBC05"
                />
                <path
                  d="M12.2606 4.74998C14.0691 4.74998 15.6834 5.35999 16.9605 6.54999L20.4548 3.12999C18.3398 1.18999 15.571 -1.52588e-05 12.2606 -1.52588e-05C7.46882 -1.52588e-05 3.33089 2.69999 1.31812 6.61999L5.38453 9.70999C6.35515 6.85999 9.06269 4.74998 12.2606 4.74998Z"
                  fill="#EA4335"
                />
              </svg>
              <span className="text-[#4b5675]">Google</span>
            </a>
            <a className="btn btn-light btn-sm justify-center" href="#">
              <img alt="" src="/public/facebook.png" className="w-5 h-5" />
              <span className="text-[#4b5675]">Facebook</span>
            </a>
          </div>
          <div className="flex items-center gap-2">
            <span className="border-t border-gray-200 w-full"></span>
            <span className="text-sm font-medium text-gray-400 uppercase">
              Hoặc
            </span>
            <span className="border-t border-gray-200 w-full"></span>
          </div>
          <Form
            name="normal_login"
            className="login-form"
            initialValues={{ remember: true }}
            onFinish={onFinish}
          >
            <div className="font-medium flex flex-col gap-1">Username</div>
            <Form.Item
              name="username"
              rules={[
                { required: true, message: "Vui lòng nhập username của bạn!" },
              ]}
            >
              <Input className="py-2" placeholder="Username" />
            </Form.Item>
            <div className="font-medium flex flex-col gap-1">Email</div>
            <Form.Item
              name="email"
              rules={[
                { required: true, message: "Vui lòng nhập email của bạn!" },
                { type: "email", message: "Sai định dạng email!" },
              ]}
            >
              <Input className="py-2" placeholder="Email" />
            </Form.Item>
            <div className="font-medium flex flex-col gap-1">Mật khẩu</div>
            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Vui lòng nhập mật khẩu của bạn!" },
              ]}
            >
              <Input.Password
                className="py-2"
                type="password"
                placeholder="Mật khẩu"
              />
            </Form.Item>
            <div className="font-medium flex flex-col gap-1">
              Nhập lại mật khẩu
            </div>
            <Form.Item
              name="rePassword"
              dependencies={["password"]}
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập lại mật khẩu của bạn!",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("Mật khẩu chưa trùng khớp!"),
                    );
                  },
                }),
              ]}
            >
              <Input.Password
                className="py-2"
                type="password"
                placeholder="Nhập lại mật khẩu"
              />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" className="!py-5" block>
                Đăng ký
              </Button>
            </Form.Item>
          </Form>
        </Space>
      </Card>
    </div>
  );
};

export default Signup;
