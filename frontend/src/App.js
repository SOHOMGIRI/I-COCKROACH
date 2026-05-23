import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import PostJob from './pages/PostJob';
import JobListings from './pages/JobListings';
import PitchForm from './pages/PitchForm';
import StudentDashboard from './pages/StudentDashboard';
import BusinessDashboard from './pages/BusinessDashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="app-wrapper">
        <Navbar />
        <main className="app-main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/post-job" element={<PostJob />} />
            <Route path="/jobs" element={<JobListings />} />
            <Route path="/pitch/:jobId" element={<PitchForm />} />
            <Route path="/student-dashboard" element={<StudentDashboard />} />
            <Route path="/business-dashboard" element={<BusinessDashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
