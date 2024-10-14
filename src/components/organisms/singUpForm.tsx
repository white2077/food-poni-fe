import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Form, Input } from "antd";
import { updateFormEditingSuccess } from "@/redux/modules/address";
import { RootState } from "@/redux/store.ts";
import { useNavigate } from "react-router-dom";
import { registerUserAction } from "@/redux/modules/auth";

export default function SignUpForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const formEditing = useSelector(
    (state: RootState) => state.address.formEditing
  );
  const handleInputChange =
    (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      dispatch(
        updateFormEditingSuccess({
          type: "TYPING",
          field,
          value: e.target.value,
        })
      );
    };

  const formErrors = useMemo(
    () =>
      formEditing.fields.reduce(
        (acc, field) => {
          if (field.errorMessage) {
            acc[field.field] = field.errorMessage;
          }
          return acc;
        },
        {} as Record<string, string>
      ),
    [formEditing.fields]
  );

  return (
    <Form
      name="signup"
      onFinish={(values) => {
        dispatch(registerUserAction({ values, navigate }));
      }}
    >
      <Form.Item
        name="username"
        validateStatus={formErrors.username ? "error" : ""}
        help={formErrors.username}
      >
        <Input
          placeholder="Tên đăng nhập"
          onChange={handleInputChange("username")}
        />
      </Form.Item>

      <Form.Item
        name="email"
        validateStatus={formErrors.email ? "error" : ""}
        help={formErrors.email}
      >
        <Input placeholder="Email" onChange={handleInputChange("email")} />
      </Form.Item>

      <Form.Item
        name="password"
        validateStatus={formErrors.password ? "error" : ""}
        help={formErrors.password}
      >
        <Input.Password
          placeholder="Mật khẩu"
          onChange={handleInputChange("password")}
        />
      </Form.Item>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          className="sign-up-form-button"
          block
        >
          Đăng ký
        </Button>
      </Form.Item>
    </Form>
  );
}
