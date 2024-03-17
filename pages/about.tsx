import type {NextPage} from 'next'

export interface IPost {
    id: number;
    title: string;
    content: string;
    image: string;
    date: string;
}

const About: NextPage = () => {

    return (
        <div>
            About
            <a href="/">Home</a>
        </div>
    );
}

export default About
