import React from 'react';

export default function Lectory(props) {

    const {lectory} = props;

    if (!lectory) return <div/>

    let img;
    if (lectory.img) {
      img = <img src={lectory.img} />;
    } else {
      img = '';
    }

    return (
        <div className="lectory">
            <div className="lectory__title">Лекторій</div>
            <div className="lectory__room">-1 поверх</div>
            <div className="lectory__image">{img}</div>  
            <div className="lectory__author">{lectory.author}</div>
            <div className="lectory__subject">&laquo;{lectory.subject}&raquo;</div>
        </div>
    );

}