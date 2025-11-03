import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocalStorage } from "./use-localStorage";

interface SearchHistoryItem {
    id:string;
    query:string;
    lat:number;
    lon:number;
    name:string;
    country:string;
    state?:string;
    searchAt:number;
}

export function useSearchHistory(){
    const [history,setHistory] = useLocalStorage<SearchHistoryItem[]>("search-history",[]);

    const queryClient = useQueryClient(); //这是前提：拿到实例，方便后续对缓存进行更新修改

    //从本地存储中读取数据
    const historyQuery = useQuery({
        queryKey:["search-history"],
        queryFn:()=>history,
        initialData:history
    });

    //修改缓存：添加搜索历史的数据，且仅保留前10条搜索记录
    const addToHistory = useMutation({
        mutationFn : async (search:Omit<SearchHistoryItem, "id" | "searchAt">) => {
                        //新建对象，将新的搜索数据保存
                        const newSearch:SearchHistoryItem = {
                            ...search,
                            id:`${search.lat}-${search.lon}-${Date.now()}`,
                            searchAt:Date.now()
                        };
                        
                        //去重：从当前搜索历史中，移除与当前搜索相同的项
                        const filteredHistory = history.filter((item)=>!(item.lat === search.lat && item.lon === search.lon));
                        
                        //仅保留前10条搜索历史，并保存到本地存储
                        const newHistory = [newSearch,...filteredHistory].slice(0,10);
                        setHistory(newHistory);
                        return newHistory;
                    },
        
        //搜索历史写入本地存储后（即mutationFn成功后），手动更新缓存
        onSuccess:(newHistory) => {
            queryClient.setQueryData(["search-history"],newHistory);
        }      
    });

    const clearHistory = useMutation({
        mutationFn:async()=>{
            setHistory([]);
            return [];
        },
        onSuccess:()=>{
            queryClient.setQueryData(["search-history"],[]);
        }
    });

    return {
        history : historyQuery.data ?? [],
        addToHistory,
        clearHistory
    };
}