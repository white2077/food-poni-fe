import { useDispatch, useSelector } from "react-redux";
import { Button, Card, Form, Input, Space } from "antd";
import {
  updateFormEditingSuccess,
  registerUserAction,
} from "@/redux/modules/auth";
import { RootState } from "@/redux/store.ts";
import { useNavigate } from "react-router-dom";

export const SignupPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { formEditing } = useSelector((state: RootState) => state.auth);

  const formErrors = formEditing.fields.reduce((map, it) => {
    if (it.errorMessage) {
      map.set(it.field, it.errorMessage);
    }
    return map;
  }, new Map<string, string>());

  const isFormValid =
    !formEditing.isDirty &&
    formEditing.fields.every((field) => field.value !== "");

  return (
    <div className='font-medium bg-[url("/logo-bg.jpeg")] bg-cover bg-center bg-no-repeat h-screen flex justify-center  items-center'>
      <Card style={{ width: "350px", margin: "auto" }}>
        <Space direction="vertical" size="middle" style={{ display: "flex" }}>
          <div className="my-2 flex flex-col gap-2">
            <div className="flex justify-center font-medium text-xl gap-2">
              Đăng ký
              <span className="text-orange-500 font-['Impact','fantasy'] flex">
                <img src="/public/logo-02.png" className="w-6 h-6" alt="Logo" />
                FoodPoni
              </span>
            </div>
            <div className="flex justify-center gap-1 font-medium text-gray-500">
              Bạn đã có tài khoản?
              <a
                className="float-right cursor-pointer text-blue-500 hover:underline"
                onClick={() => navigate("/login")}
              >
                Đăng nhập
              </a>
            </div>
          </div>
          <Form
            name="signup"
            onFinish={(values) => {
              dispatch(registerUserAction({ values, navigate }));
            }}
          >
            <Form.Item
              name="username"
              validateStatus={formErrors.get("username") && "error"}
              help={formErrors.get("username")}
            >
              <Input
                placeholder="Tên đăng nhập"
                onChange={(e) =>
                  dispatch(
                    updateFormEditingSuccess({
                      field: "username",
                      value: e.target.value,
                    })
                  )
                }
              />
            </Form.Item>

            <Form.Item
              name="email"
              validateStatus={formErrors.get("email") && "error"}
              help={formErrors.get("email")}
            >
              <Input
                placeholder="Email"
                onChange={(e) =>
                  dispatch(
                    updateFormEditingSuccess({
                      field: "email",
                      value: e.target.value,
                    })
                  )
                }
              />
            </Form.Item>

            <Form.Item
              name="password"
              validateStatus={formErrors.get("password") && "error"}
              help={formErrors.get("password")}
            >
              <Input.Password
                placeholder="Mật khẩu"
                onChange={(e) =>
                  dispatch(
                    updateFormEditingSuccess({
                      field: "password",
                      value: e.target.value,
                    })
                  )
                }
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="sign-up-form-button"
                block
                disabled={isFormValid}
              >
                Đăng ký
              </Button>
            </Form.Item>
          </Form>
        </Space>
      </Card>
    </div>
  );
};
