import { Button, Card, Checkbox, Form, Input, Space } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { REMEMBER_ME, server } from "@/utils/server.ts";
import Cookies from "js-cookie";
import { clientId, redirectUri, responseType, scopes } from "@/utils/oauth2.ts";
import { useNavigate } from "react-router-dom";
import { RootState } from "@/redux/store.ts";
import {
  loginRequest,
  rememberMeRequest,
  updatePassword,
  updateRememberMe,
  updateUsername,
} from "@/redux/modules/auth.ts";
import { UserRemember } from "@/type/types.ts";

export type FieldLoginType = {
  username: string;
  password: string;
  remember: boolean;
};

export function Login() {
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(true);

  const [isLoadingGoogle, setLoadingGoogle] = useState(false);

  const { rememberMe, isPending } = useSelector(
    (state: RootState) => state.auth.login,
  );

  useEffect(() => {
    setIsLoading(false);
    const rememberMeCookie = Cookies.get(REMEMBER_ME);
    if (rememberMeCookie) {
      const userRemember = JSON.parse(atob(rememberMeCookie)) as UserRemember;
      dispatch(updateUsername(userRemember.username));
      dispatch(updatePassword(userRemember.password));
      dispatch(updateRememberMe(userRemember));
    }
    setIsLoading(false);
  }, []);

  function handleGoogleLogin() {
    const h: number = 600;
    const w: number = 500;
    const left: number = screen.width / 2 - w / 2;
    const top: number = screen.height / 2 - h / 2;
    setLoadingGoogle(true);
    window.open(
      "https://accounts.google.com/o/oauth2/v2/auth?&client_id=" +
        clientId +
        "&redirect_uri=" +
        redirectUri +
        "&response_type=" +
        responseType +
        "&scope=" +
        scopes.join("+"),
      "Google Login",
      "width=" + w + ",height=" + h + ",top=" + top + ", left=" + left,
    );

    const getMessage = (event: MessageEvent<string>) => {
      if (server.startsWith(event.origin)) {
        if (event.data) {
          Cookies.set("refreshToken", event.data, { expires: 7 });
          navigate("/");
        }
        window.removeEventListener("message", getMessage);
        setLoadingGoogle(false);
      }
    };
    window.addEventListener("message", getMessage);
  }

  return (
    <div className='font-medium bg-[url("/logo-bg.jpeg")] bg-cover bg-center bg-no-repeat h-screen flex justify-center  items-center'>
      <Card className="w-[350px] m-auto" loading={isLoading}>
        <Space direction="vertical" size="small" style={{ display: "flex" }}>
          <div className="mb-4 flex flex-col gap-2">
            <div className="flex justify-center font-medium text-xl gap-1">
              Đăng nhập
              <span className="text-orange-500 font-['Impact','fantasy'] flex">
                {" "}
                <img src="/Logo.png" className="w-6 h-6" />
                FoodPoni
              </span>
            </div>
            <div className="flex justify-center gap-1 font-medium text-gray-500">
              Cần một tài khoản?
              <a className="float-right" onClick={() => navigate("/signup")}>
                Đăng ký ngay
              </a>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2.5 text-gray-400">
            <button
              className="btn btn-light btn-sm justify-center gap-1"
              onClick={handleGoogleLogin}
            >
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
            </button>
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
            onFinish={() => dispatch(loginRequest({ navigate }))}
          >
            <div className="flex flex-col gap-1 font-medium">
              Email hoặc username
            </div>
            <Form.Item
              name="username"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập username hoặc email của bạn!",
                },
              ]}
              initialValue={rememberMe.username}
            >
              <Input
                className="!py-2 font-medium"
                placeholder="Email hoặc username"
                onChange={(e) => dispatch(updateUsername(e.target.value))}
              />
            </Form.Item>
            <div className="flex font-medium  justify-between">
              Mật khẩu
              <a className="login-form-forgot" href="">
                Quên mật khẩu?
              </a>
            </div>
            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Vui lòng nhập mật khẩu của bạn!" },
              ]}
              initialValue={rememberMe.password}
            >
              <Input.Password
                className="!py-2 font-medium"
                placeholder="Mật khẩu"
                onChange={(e) => dispatch(updatePassword(e.target.value))}
              />
            </Form.Item>
            <Form.Item>
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox
                  onChange={(e) =>
                    dispatch(rememberMeRequest(e.target.checked))
                  }
                >
                  Lưu thông tin đăng nhập
                </Checkbox>
              </Form.Item>
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="!py-5"
                loading={isPending}
                disabled={isPending || isLoadingGoogle}
                block
              >
                Đăng nhập
              </Button>
            </Form.Item>
          </Form>
        </Space>
      </Card>
    </div>
  );
}
