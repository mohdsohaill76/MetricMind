"use client";

import ReactECharts from "echarts-for-react";

export default function SalesChart() {

    const option = {

        tooltip: {
            trigger: "item",
        },

        legend: {
            bottom: 0,
        },

        series: [

            {
                type: "pie",

                radius: ["40%", "70%"],

                data: [

                    { value: 450, name: "North" },
                    { value: 320, name: "South" },
                    { value: 270, name: "East" },
                    { value: 180, name: "West" }

                ]

            }

        ]

    };

    return (

<div className="
rounded-2xl
bg-white
p-6
shadow-md
transition-all
duration-300
hover:shadow-xl
hover:scale-[1.01]
">
            <h2 className="text-xl font-semibold mb-5">
                Sales by Region
            </h2>

            <ReactECharts
                option={option}
                style={{ height: "350px" }}
            />

        </div>

    );

}