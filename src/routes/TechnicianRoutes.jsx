import { Routes, Route } from "react-router-dom";
import Home from "../Pages/Technician/Home/Home";
import Jobs from "../Pages/Technician/Jobs/Jobs";
import JobDetails from "../Pages/Technician/JobDetails/JobDetails";
import ActiveJob from "../Pages/Technician/ActiveJob/ActiveJob";
import Schedule from "../Pages/Technician/Schedule/Schedule";

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