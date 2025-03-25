import { BrowserRouter as Router, Route, Routes } from 'react-router'
import Layout from './Layout'
import Home from './pages/Home'
import About from './pages/About'
import FeaturesPage from './pages/FeaturesPage'
import ContactPage from './pages/ContactPage'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import HRHomePage from './pages/hr/HRHomePage'
import PostJobPage from './components/hr/PostJobPage'
import HRLoginPage from './pages/hr/HRLoginPage'
import HRProfilePage from './pages/hr/HRProfilePage'
import JobApplicantsPage from './components/hr/jobs/id/JobApplicantsPage'
import HRJobsPage from './components/hr/jobs/HRJobsPage'
import HRJobDetailPage from './pages/hr/job_details/HRJobDetailPage'
import HRUserProfilePage from './pages/hr/user-profile/[id]/HRUserProfilePage'
import HRRegisterPage from './pages/hr/register/HRRegisterPage'
// User
import UserHomePage from './pages/user/UserHomePage'
import UserLoginPage from './pages/user/login/UserLoginPage'
import UserRegisterPage from './pages/user/register/UserRegisterPage'
import UserProfilePage from './pages/user/profile/UserProfilePage'
import EditProfilePage from './pages/user/edit_profile/EditProfilePage'
import ApplicationDetailPage from './pages/user/applications/[id]/ApplicationDetailPage'
import UserApplicationsPage from './pages/user/applications/UserApplicationsPage'
import UserJobsPage from './pages/user/jobs/UserJobsPage'
import UserJobDetailPage from './pages/user/jobs/[id]/UserJobDetailPage'

function App() {
  return (
    <>
      <div className="App min-h-screen">
        <Router>
          <Navbar />
          <br />
          <br />
          <br />
          <br />
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/features" element={<FeaturesPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/hr" element={<HRHomePage />} />
              <Route path="/hr/post-job" element={<PostJobPage />} />
              <Route path="/profile" element={<UserProfilePage />} />
              <Route path="/hr/register" element={<HRRegisterPage />} />
              <Route path="/hr/login" element={<HRLoginPage />} />
              <Route path="/hr/profile" element={<HRProfilePage />} />
              <Route path="/hr/jobs" element={<HRJobsPage />} />
              <Route path="/hr/jobs/:id" element={<HRJobDetailPage />} />
              <Route path="/hr/jobs/:id/applicants" element={<JobApplicantsPage />} />
              <Route path="/hr/user-profile/:id" element={<HRUserProfilePage />} />

              {/* USER */}

              <Route path="/user" element={<UserHomePage />} />
              <Route path="/user/login" element={<UserLoginPage />} />
              <Route path="/user/register" element={<UserRegisterPage />} />
              <Route path="/user/profile" element={<UserProfilePage />} />
              <Route path="/user/edit-profile" element={<EditProfilePage />} />
              <Route path="/user/jobs" element={<UserJobsPage />} />
              <Route path="/user/jobs/:id" element={<UserJobDetailPage />} />
              <Route path="/user/applications" element={<UserApplicationsPage/>} />
              <Route path="/user/applications/:id" element={<ApplicationDetailPage/>} />
            </Routes>
            <Footer />
          </Layout>
        </Router>
      </div>
    </>
  )
}

export default App

