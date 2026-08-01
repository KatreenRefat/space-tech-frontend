import { Routes, Route } from "react-router-dom";
import Home from "../pages/technician/Home/Home";
import Jobs from "../pages/technician/Jobs/Jobs";
import JobDetails from "../pages/technician/JobDetails/JobDetails";
import ActiveJob from "../pages/technician/ActiveJob/ActiveJob";
import Schedule from "../pages/technician/Schedule/Schedule";

function TechnicianRoutes() {
  return (
    <Routes>
      <Route path="home" element={<Home />} />
      <Route path="jobs" element={<Jobs />} />
      <Route path="job-details" element={<JobDetails />} />
      <Route path="active-job" element={<ActiveJob />} />
      <Route path="schedule" element={<Schedule />} />
    </Routes>
  );
}

export default TechnicianRoutes;