import React from 'react';

export default function Auditories(props) {

    const {auditories} = props;

    if (!auditories) return <div/>

    const floors = auditories.reduce((rv, i) => { (rv[i.floor] = rv[i.floor] || []).push(i); return rv; }, {});

    return (
            <div className="auditories">
                {
                    Object.keys(floors).map(key => 
                        <div className="auditories__item" key={key}> 
                            <div className="floor">{key} поверх</div>
                            <div className="rooms">
                                {auditories.filter(item => item.floor == key).map((item) => 
                                    <div className="rooms__item" key={item.auditory}>
                                        <div className="rooms__num">{item.auditory}</div>
                                        <div className="rooms__event">{item.description}</div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )
                }
            </div>
        );
    
}