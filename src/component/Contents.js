import React, {useState, useEffect} from 'react'
import {Bar, Doughnut, Line} from 'react-chartjs-2'
import axios from 'axios';

const Contents = () => {
    const [confirmedData, setConfirmedData] = useState({});
    const [quarantinedData, setQuarantinedData] = useState({});
    const [comparedData, setComparedData] = useState({});

    const options1 = {
        plugins: {
            title: { display: true, text: "누적 확진자 추이", fontSize: 16 },
            legend: { display: true, position: "bottom" },
        },
    };
    const options2 = {
        plugins: {
            title: { display: true, text: "월별 격리자 현황", fontSize: 16 },
            legend: { display: true, position: "bottom" },
        },
    };

    const options3 = {
        plugins: {
            title: { display: true, text: `누적 확진/해제/사망 (10월)`, fontSize: 16 },
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
                console.log(cur);
                
                const findItem = acc.find(a=> a.year === year && a.month === month);

                if (!findItem && year === 2021){
                    acc.push({year, month, date, confirmed, active, death, recovered});
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
                return acc;
            }, []);

            console.log(arr);

            setConfirmedData({
                labels : arr.map((item)=> `${item.month+1}월`),
                datasets : [
                    {
                        label : "국내 누적 확진자",
                        backgroundColor : "salmon",
                        fill:true,
                        data : arr.map((item)=> item.confirmed),
                    },
                ]
            });
            setQuarantinedData({
                labels : arr.map((item)=> `${item.month+1}월`),
                datasets : [
                    {
                        label : "월별 격리자 현황",
                        borderColor : "salmon",
                        fill: false,
                        data : arr.map((item)=> item.confirmed),
                    },
                ]
            });
            const last = arr[arr.length - 2];
            setComparedData({
                labels : ["확진자", "격리해제", "사망"],
                datasets : [
                    {
                        label : "누적 확진/해제/사망 비율",
                        backgroundColor : ["#ff3d67", "#059bff", "#ffc233"],
                        borderColor : ["#ff3d67", "#059bff", "#ffc233"],
                        fill: true,
                        data : [last.confirmed, last.recovered, last.death],
                    },
                ]
            });
        }
        fetchEvent()
    },[]);

    return (
        <section>
            <h2>국내 코로나 현황</h2>
            <div className = "contents">
                <div>
                    <Bar data={confirmedData} options={options1} />
                </div>
                <div>
                    <Line data={quarantinedData} options={options2} />
                </div>
                <div>
                    <Doughnut data={comparedData} options={options3} />
                </div>
            </div>
       </section>
    )
}

export default Contents
