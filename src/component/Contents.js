import React, {useState, useEffect} from 'react'
import {Bar} from 'react-chartjs-2'
import axios from 'axios';

const Contents = () => {
    const [confirmedData, setConfirmedData] = useState({
        labels : ["1월", "2월", "3월"],
        datasets : [
            {
                label : "국내 누적 확진자",
                backgroundcolor : "salmon",
                fill : true,
                data : [10, 5, 3],
            },
        ],
    });
    const options = {
        plugins: {
            title: { display: true, text: "누적 확진자 추이", fontSize: 16 },
            legend: { display: true, position: "bottom" },
        },
    };
    useEffect(()=>{
        const fetchEvent = async() =>{ // async과 await을 통해 정보를 GET 해오는 것을 마쳤을 때, 순차적으로 코드가 진행되도록 함.
            const res = await axios.get("https://api.covid19api.com/total/dayone/country/kr");
            makeData(res.data);
        }
        const makeData = (items) =>{
            // items.forEach(item => console.log(item));
            const arr = items.reduce((acc, cur)=>{
                const currentDate = new Date(cur.Date);
                const year = currentDate.getFullYear();
                const month = currentDate.getMonth();
                const date = currentDate.getDate();
                const confirmed = cur.Confirmed;
                const active = cur.Active;
                const death = cur.Deaths;
                const recovered = cur.Recovered;
                const findItem = acc.find(a=> a.year === year && a.month === month && a.date === date);

                if (!findItem){
                    arr.push({year, month, date, confirmed, active, death, recovered});
                }
                if (findItem && findItem.date < date){
                    findItem.year = year;
                    findItem.month = month;
                    findItem.date = date;
                    findItem.confirmed = confirmed;
                    findItem.active = active;
                    findItem.death = death;
                    findItem.recovered = recovered;
                }

                console.log(year, month, date);
                return cur;
            }, []);
        }
        fetchEvent()
    })

    return (
        <section>
            <h2>국내 코로나 현황</h2>
            <div className = "contents">
                <div>
                <Bar data={confirmedData} options={options}/>
                </div>
            </div>
       </section>
    )
}

export default Contents
