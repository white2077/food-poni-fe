import React, {useRef, useState} from 'react';

const AudioPlayer = () => {
    const audioFiles = ["/chill1.mp3", "/chill2.mp3", "/chill3.mp3", "/chill4.mp3", "/chill5.mp3"];
    const songTitles = ["#1 Đợi 52Hz", "#2 Ánh sao và bầu trời ", "#3 ĐỪNG LÀM TRÁI TIM ANH ĐAU", "#4 Khiem - Yên Bình Có Quá Đắt Không", "#5 Giấc Mơ Của Em (Suy Ver.)"];
    const [currentSongIndex, setCurrentSongIndex] = useState(0);
    const audioRef = useRef(null);

    const playNextSong = () => {
        setCurrentSongIndex((currentSongIndex + 1) % audioFiles.length);
    };

    const playPrevSong = () => {
        setCurrentSongIndex((currentSongIndex - 1 + audioFiles.length) % audioFiles.length);
    };

    const handleSongEnd = () => {
        if (currentSongIndex === audioFiles.length - 1) {
            setCurrentSongIndex(0);
        } else {
            playNextSong();
        }
    };

    return (
        <div key={currentSongIndex} className="bg-gray-300 max-w-[300px] rounded-lg border-2 border-orange-500">
            <div className="text-ellipsis flex justify-center">{songTitles[currentSongIndex]}</div>
            <audio
                controls
                autoPlay
                onEnded={handleSongEnd}
                ref={audioRef}
                className="px-2"
            >
                <source src={audioFiles[currentSongIndex]} type="audio/mpeg"/>
            </audio>
            <div className="flex justify-between px-2">
                <button onClick={playPrevSong}>Prev</button>
                <button onClick={playNextSong}>Next</button>
            </div>
        </div>
    );
};

export default AudioPlayer;