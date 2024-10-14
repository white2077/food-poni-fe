import { useEffect } from "react";
import { Card, Space } from "antd";
import { useNavigate } from "react-router-dom"; 
import SignUpForm from "../organisms/singUpForm";


export default function SignUpWrapper() {
  const navigate = useNavigate();
  useEffect(() => {
    console.log("SignUpWrapper rendered");
  });
  return (
    <div className='font-medium bg-[url("/logo-bg.jpeg")] bg-cover bg-center bg-no-repeat h-screen flex justify-center  items-center'>
      <Card style={{ width: "350px", margin: "auto" }}>
        <Space direction="vertical" size="middle" style={{ display: "flex" }}>
          <div className="my-2 flex flex-col gap-2">
            <div className="flex justify-center font-medium text-xl gap-2">
              Đăng ký
              <span className="text-orange-500 font-['Impact','fantasy'] flex">
                <img src="/Logo.png" className="w-6 h-6" alt="Logo" />
                FoodPoni
              </span>
            </div>
            <div className="flex justify-center gap-1 font-medium text-gray-500">
              Bạn đã có tài khoản?
              <a
                className="float-right cursor-pointer text-blue-500 hover:underline"
                onClick={() => navigate("/auth/login")}
              >
                Đăng nhập
              </a>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2.5 text-gray-400">
            {/* Google and Facebook buttons */}
          </div>
          <div className="flex items-center gap-2">
            <span className="border-t border-gray-200 w-full"></span>
            <span className="text-sm font-medium text-gray-400 uppercase">
              Hoặc
            </span>
            <span className="border-t border-gray-200 w-full"></span>
          </div>
          <SignUpForm />
        </Space>
      </Card>
    </div>
  );
}
