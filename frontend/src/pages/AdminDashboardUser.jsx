import React from 'react'
import AdminHeader from '../components/layouts/AdminHeader'
import AdminSideBar from '../components/Admin/Layout/AdminSideBar'
import AllUsers from "../components/Admin/AllUsers.jsx"
const AdminDashboardUser = () => {
  return (
    <div>
        <AdminHeader/>

        <div className="flex items-start justify-between w-full">

        <div className="w-[100px] 800px:w-[330px]">
           <AdminSideBar active={4}/>
          </div>
         <AllUsers />
        </div>
    </div>
  )
}

export default AdminDashboardUser