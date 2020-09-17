import React from 'react';
import moment from 'moment';

import Auditories from './components/Auditories';
import Lectory from './components/Lectory';
import Header from './components/Header';

const urls = {
}

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = { headerData: '', auditories: null, lectory: null };
        this.tick = this.tick.bind(this);
        this.getData = this.getData.bind(this);
        this.parseData = this.parseData.bind(this);
    }

    componentDidMount() {
        this.tick();

        this.timerID = setInterval(
            () => this.tick(),
            60000
        );
    }
  
    componentWillUnmount() {
        clearInterval(this.timerID);
    }

    tick() {
        const date = moment();
        date.locale('uk');
        const day = date.format('D MMMM');
        const month = date.month();
        const weekday = date.format('ddd');
        let timeRange = '';
        const format = 'hh:mm:ss';
        const timeDay = moment().isBetween(moment('09:00:00',format), moment('19:00:00',format));
        const timeEvening = moment().isBetween(moment('19:00:00',format), moment('22:00:00',format));
        
        if (timeDay) {
            timeRange = '9:00–19:00';
            this.getData(urls.day);
            this.getData(urls.lectory);
        } else if (timeEvening) { 
            timeRange = '19:00–22:00'
            this.getData(urls.evening);
            this.getData(urls.lectory);
        } else { 
            timeRange = '*'
            // Если время не входит в рабочий диапазон - обнуляем данные
            this.setState({
                lectory: null,
                auditories: null
            });
        }

        // Записываем данные заголовка в state
        this.setState({
          headerData: { day, weekday, timeRange },
        });
    }

    getData(url) {
        // функция-коллбек внутри then затрет значение this (станет undefined)
        // что-бы не потерять наш this (А сейчас там находится компонент App)
        // запишем его в константу self
        const self = this;
        fetch(url)
        .then(function(response) {
            return response.json()
        }).then(function(data) {
            console.log(data);
            // получаем соответствующее расписание и приводим его к виду который хранится в state
            const stateData = self.parseData(data);
            console.log(stateData);
            // передаем данные в state (после чего интерфейс обновится в соответсвии с новыми данными)
            self.setState(stateData);
        }).catch(function(ex) {
            console.log('fetch data failed', ex)
        })
    }

    parseData(json) {
        const date = moment().startOf('day');

        const parseAuditory = todaySchedule => {
            const result = Object.keys(todaySchedule)
            .filter(key => key.match(/^gsx\$a?\d\d$/))
            .map(key => {
                const description = todaySchedule[key].$t;
                const auditory = key.replace(/^gsx\$a?(\d\d)$/, '$1');
                const floor = auditory[0];
                return {
                    auditory,
                    floor,
                    description
                };
            });
            return { auditories: result };
        };

        const parseLectory = todaySchedule => {
                let result = {};
                Object.keys(todaySchedule)
                .filter(key => key.match(/^gsx\$(.*)$/) && key !== 'gsx$date')
                .forEach(key => {
                    const resultKey = key.replace(/^gsx\$(.*$)/, '$1');
                    result[resultKey] = todaySchedule[key].$t;
                });
                return { lectory: result };
            };

        const todaySchedule = json.feed.entry.filter(item => date.isSame(moment(item.gsx$date.$t, 'DD.MM.YY')))[0]; // в ответе feed содержит массив entry записей по каждой дате. достаем из пришедших данных только обьект с сегодняшней датой
        const title = json.feed.title.$t; // в ответе feed содержит поле title - day, evening, lectory, в зависимости от файла из которого мы парсим ответ
        if(todaySchedule !== undefined) {
            return (title === 'lectory') ? parseLectory(todaySchedule) : parseAuditory(todaySchedule);
        }

        return null;
    }

    render() {
        return (
            <div className="schedule">
                <Header data={this.state.headerData} />
                <main className="main">
                    <Auditories auditories={this.state.auditories} />
                    <Lectory lectory={this.state.lectory} />
                </main>
            </div>
        );
    }
}

export default App;
