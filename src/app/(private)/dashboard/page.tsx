import React from "react";
import OrganizerDashboardPage from "./dashboardClient";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const page = () => {
  return (
    <>
      <Navbar />
      <OrganizerDashboardPage />
      <Footer />
    </>
  );
};

export default page;
