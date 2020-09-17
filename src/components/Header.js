import React from 'react';

export default function Header(props) {
    const dt = props.data;

    return (
        <header className="header">
            {/*<h1>Розклад</h1>*/}
            <div className="date">
                <span className="date__day">
                    {dt.day + ', '} 
                </span>
                <span className="date__dayweek">
                    {dt.weekday + ', '}
                </span>
                <span className="date__range">
                    {dt.timeRange}
                </span>
            </div>
        </header>
    );
}
