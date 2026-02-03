import { Outlet } from "react-router-dom";
import StudentSidebar from "./StudentSidebar";

const StudentLayout = () => {
  return (
    <div className="min-h-screen bg-background">
      <StudentSidebar />
      <main className="lg:ml-72 min-h-screen">
        <div className="p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default StudentLayout;
