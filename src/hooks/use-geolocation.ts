import type { Coordinates } from "@/api/types";
import { useEffect, useState } from "react";

interface GeolocationState {
    coordinates:Coordinates | null;
    error:string | null;
    isLoading:boolean;
}

//通过浏览器提供的API读取当前地理位置
export function useGeolocation(){
    const [locationData,setLocationData] = useState<GeolocationState>({coordinates:null,error:null,isLoading:true});

    const getLocation = () => {
        setLocationData((prev)=>({...prev, isLoading:true, error:null}));
        
        if(!navigator.geolocation){
            setLocationData({coordinates:null,
                             error:"Geolocation is not supported by your browser",
                             isLoading:false
            });
            return ;
        }

        navigator.geolocation.getCurrentPosition(
            //successCallback,返回position对象
            (position)=>{
                setLocationData({coordinates:{lat:position.coords.latitude,
                                              lon:position.coords.longitude },
                                 error:null,
                                 isLoading:false                
                                });
            },//errorCallback，返回error对象
            (error)=>{
                let errorMessage:string;
                switch(error.code){
                    case error.PERMISSION_DENIED:
                        errorMessage = "Location permission denied. Please enable location access.";
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage = "Location information is unavailable.";
                        break;
                    case error.TIMEOUT:
                        errorMessage = "Location request timed out.";
                        break;
                    default:
                        errorMessage = "An unknown error occured.";                    
                }
                setLocationData({coordinates:null, error:errorMessage, isLoading:false});
            },//options
            {
                enableHighAccuracy:true,  //请求更高精度
                timeout:5000,   //超时5秒，则触发超时错误
                maximumAge:0    //不使用缓存的定位结果
            }
        );
    };

    useEffect(()=>getLocation() , []);

    return {...locationData , getLocation} ;
}