import {Card} from "antd";

export default function ProductRowLoading({count}: { count: number }) {
    return (
        <>
            {Array.from({length: count}, (_, index) => (
                <Card key={index} loading={true}/>
            ))}
        </>
    );
}