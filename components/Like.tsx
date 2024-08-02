// Tạo một React component trong file LabelContainer.js trong dự án Next.js của bạn
import React from 'react';

const Like = () => {
    const handleLike = (event: React.ChangeEvent<HTMLInputElement>) => {
        // Handle checkbox click event
        console.log('Liked:', event.target.checked);
    };

    return (
        <div className="heart-container" title="Like">
            <input
                type="checkbox"
                className="checkbox"
                id="Give-It-An-Id"
                onChange={handleLike}
            />
            <div className="svg-container">
                <svg
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="rgb(5, 97, 242)"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path d="M8 10V20M8 10L4 9.99998V20L8 20M8 10L13.1956 3.93847C13.6886 3.3633 14.4642 3.11604 15.1992 3.29977L15.2467 3.31166C16.5885 3.64711 17.1929 5.21057 16.4258 6.36135L14 9.99998H18.5604C19.8225 9.99998 20.7691 11.1546 20.5216 12.3922L19.3216 18.3922C19.1346 19.3271 18.3138 20 17.3604 20L8 20"></path>
                </svg>
                <svg
                    viewBox="0 0 24 24"
                    className="svg-filled-like"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path d="M8 10V20M8 10L4 9.99998V20L8 20M8 10L13.1956 3.93847C13.6886 3.3633 14.4642 3.11604 15.1992 3.29977L15.2467 3.31166C16.5885 3.64711 17.1929 5.21057 16.4258 6.36135L14 9.99998H18.5604C19.8225 9.99998 20.7691 11.1546 20.5216 12.3922L19.3216 18.3922C19.1346 19.3271 18.3138 20 17.3604 20L8 20"></path>
                </svg>
                <svg
                    className="svg-celebrate-like"
                    width="100"
                    height="100"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <polygon points="10,10 20,20"></polygon>
                    <polygon points="10,50 20,50"></polygon>
                    <polygon points="20,80 30,70"></polygon>
                    <polygon points="90,10 80,20"></polygon>
                    <polygon points="90,50 80,50"></polygon>
                    <polygon points="80,80 70,70"></polygon>
                </svg>
            </div>
        </div>
    );
};

export default Like;