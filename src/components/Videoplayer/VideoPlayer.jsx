import React from 'react';
import './videoplayer.css';

const VideoPlayer = () => {
    return (
        <div className="video-wrapper">
            <h3 className="video-title">Фитбоксинг</h3>
            <video
                className="responsive-video"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
            >
                <source src="https://storage.yandexcloud.net/files-for-sites/fitbox.mp4" type="video/mp4" />
                Ваш браузер не поддерживает видео. Обновите его или используйте другой.
            </video>
        </div>
    );
};

export default VideoPlayer;
