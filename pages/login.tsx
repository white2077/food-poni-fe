import type {NextPage} from 'next'

export interface IPost {
    id: number;
    title: string;
    content: string;
    image: string;
    date: string;
}

const Login: NextPage = () => {

    return (
        <div>
            Login page
        </div>
    );
}

export default Login
