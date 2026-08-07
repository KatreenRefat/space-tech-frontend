import { Navigate, Route, Routes } from 'react-router-dom';

import TechnicianLayout from '@/layouts/TechnicianLayout.jsx';
import ActiveJob from '@/pages/technician/ActiveJob.jsx';
import Home from '@/pages/technician/Home.jsx';
import JobDetails from '@/pages/technician/JobDetails.jsx';
import Jobs from '@/pages/technician/Jobs.jsx';
import Schedule from '@/pages/technician/Schedule.jsx';

export default function TechnicianRoutes() {
  return (
    <Routes>
      <Route element={<TechnicianLayout />}>
        <Route index element={<Navigate to="home" replace />} />
        <Route path="home" element={<Home />} />
        <Route path="jobs" element={<Jobs />} />
        <Route path="job-details" element={<JobDetails />} />
        <Route path="active-job" element={<ActiveJob />} />
        <Route path="schedule" element={<Schedule />} />
        <Route path="*" element={<Navigate to="home" replace />} />
      </Route>
    </Routes>
  );
}
