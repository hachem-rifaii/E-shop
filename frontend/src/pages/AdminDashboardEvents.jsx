import React from 'react'
import AdminHeader from '../components/layouts/AdminHeader'
import AdminSideBar from '../components/Admin/Layout/AdminSideBar'
import AdminDashboardAllEvents from "../components/Admin/AdminDashboardAllEvents.jsx"

const AdminDashboardEvents = () => {
  return (
    <div>
    <AdminHeader/>

    <div className="flex items-start justify-between w-full">

    <div className="w-[100px] 800px:w-[330px]">
       <AdminSideBar active={6}/>
      </div>
     <AdminDashboardAllEvents />
    </div>
</div>
  )
}

export default AdminDashboardEvents