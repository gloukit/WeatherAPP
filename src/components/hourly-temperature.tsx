import type { ForecastData } from "@/api/types";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import {format} from "date-fns";

interface HourlyTemperatureProps{
    data:ForecastData;
}

interface ChartData {
    time:string;
    temp:number;
    feels_like:number;
}

export function HourlyTemperature({data}:HourlyTemperatureProps){
    const chartData:ChartData[] = data.list.slice(0,8).map((item)=>({
        time:format(new Date(item.dt * 1000),"ha"),
        temp:Math.round(item.main.temp),
        feels_like:Math.round(item.main.feels_like)
    }));
    console.log(chartData)

    return (
        <Card className="flex-1">  {/*尽量撑满容器*/}
            <CardHeader>
                <CardTitle>Today's Temperature</CardTitle>
            </CardHeader>

            <CardContent>
                <div className="h-[200px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                            <XAxis dataKey="time" stroke="#888888" fontSize={12} tickLine={false} axisLine={false}/>
                            <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value)=>`${value}°`}/>
                            
                            {/*悬停提示框，显示温度和体感温度*/}
                            <Tooltip content={({active,payload})=>{
                                if(active && payload && payload.length){
                                    return (
                                        <div className="bg-background rounded-lg border py-2 px-4 shadow-sm">
                                            <div>
                                                <div className="flex flex-cols justify-between items-center gap-2">
                                                    <span className="text-[0.7rem] uppercase text-muted-foreground">Temperature : </span>
                                                    <span className="font-bold">{payload[0].value}°</span>
                                                </div>

                                                <div  className="flex flex-cols justify-between items-center gap-2">
                                                    <span className="text-[0.7rem] uppercase text-muted-foreground">Feels like : </span>
                                                    <span className="font-bold">{payload[1].value}°</span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                }
                                return null;
                            }}/> 

                            <Line dataKey="temp" type="monotone" stroke="#3563eb" strokeWidth={2} dot={false}/>
                            <Line dataKey="feels_like" type="monotone" stroke="#64748b" strokeWidth={2} dot={false} strokeDasharray="5 5"/>
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}