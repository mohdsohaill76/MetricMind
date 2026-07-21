"use client";

import ReactECharts from "echarts-for-react";

export default function PerformanceChart() {

    const option = {

        tooltip: {},

        xAxis: {

            data: [
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun"
            ]

        },

        yAxis: {},

        series: [

            {

                type: "bar",

                data: [

                    25,
                    40,
                    35,
                    55,
                    60,
                    72

                ]

            }

        ]

    };

    return (

    <div className="card rounded-2xl p-6 shadow-md">
        <h2 className="text-xl font-semibold mb-5">

                Monthly Performance

            </h2>

            <ReactECharts
                option={option}
                style={{ height: "350px" }}
            />

        </div>

    );

}