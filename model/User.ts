export interface User {
  id: string;

  avatar: string;

  email: string;

  firstName: string;

  lastName: string;

  phoneNumber: string;

  username: string;

  role: string;

  status: boolean;

}

export interface UserRequest {

  id: string;

}

export interface UserRequestLogin {

  username: string | null;

  email: string | null;

  password: string;

}
