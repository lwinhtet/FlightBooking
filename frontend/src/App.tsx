import { Outlet } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';

function App() {
  return (
    <main className="relative bg-main-1">
      <Navbar />

      <div className="flex">
        <section className="flex min-h-screen flex-1 flex-col px-6 pb-6 pt-28 max-md:pb-14 sm:px-14">
          <div className="w-full">
            <Outlet />
          </div>
        </section>
      </div>
    </main>
  );
}

export default App;
