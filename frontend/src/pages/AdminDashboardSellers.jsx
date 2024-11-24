import React from 'react'
import AdminHeader from '../components/layouts/AdminHeader'
import AdminSideBar from '../components/Admin/Layout/AdminSideBar'
import AllSellers from "../components/Admin/AllSellers.jsx"

const AdminDashboardSellers = () => {
  return (
    <div>
        <AdminHeader/>

        <div className="flex items-start justify-between w-full">

        <div className="w-[100px] 800px:w-[330px]">
           <AdminSideBar active={3}/>
          </div>
         <AllSellers />
        </div>
    </div>
  )
}

export default AdminDashboardSellers