import { BrowserRouter, Route, Routes } from 'react-router-dom';
import {QueryClient,QueryClientProvider} from "@tanstack/react-query";
import {ReactQueryDevtools} from "@tanstack/react-query-devtools";
import './App.css';
import { Layout } from './components/layout';
import { ThemeProvider } from './context/theme-provider';
import WeatherDashBoard from './pages/weather-dashboard';
import CityPage from './pages/city-page';
import { Toaster } from 'sonner';


function App() {
  
  const queryClient = new QueryClient({
    defaultOptions:{
      queries:{
        staleTime:5*60*1000, //数据新鲜时间为5分钟，这段时间内不会自动重新请求数据
        gcTime:10*60*1000,   //数据缓存保留时间为10分钟，超出则数据会被清除出内存
        retry:false,         //请求失败时，不会自动重试
        refetchOnWindowFocus:false //当用户重新切回浏览器标签页时，不会自动刷新
      }
    }
  });

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter  basename="/Weather-APP/">
        <ThemeProvider defaultTheme='dark'>
            <Layout>
              <Routes>
                <Route path='/' element={<WeatherDashBoard/>}/>
                <Route path='/city/:cityName' element={<CityPage/>}/>
              </Routes>
            </Layout>
            <Toaster richColors/>
        </ThemeProvider>
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false}/>  {/*tanstack query的开发调试工具*/}
    </QueryClientProvider>
  )
}

export default App;
