import './App.scss'
import Login from './features/login/login';

function App() {

  return (
    <div className="flex flex-col flex-l-1 w-full h-full gap-4">
      <div className='h-[2rem] leading-8 header'></div>
      <div className='flex-l-1 relative'>
        <Login />
      </div>
      <div className='h-[2rem] leading-8'></div>
    </div>
  )
}

export default App
