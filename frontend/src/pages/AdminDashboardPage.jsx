import React from 'react'
import AdminHeader from "../components/layouts/AdminHeader";
import AdminSideBar from "../components/Admin/Layout/AdminSideBar";
import AdminDashboardMain from "../components/Admin/AdminDashboardMain";

const AdminDashboardPage = () => {
  return (
    <div>
        <AdminHeader/>

        <div className="flex items-start justify-between w-full">

        <div className="w-[100px] 800px:w-[330px]">
           <AdminSideBar active={1}/>
          </div>
         <AdminDashboardMain />
        </div>
    </div>
  )
}

export default AdminDashboardPage