import React from 'react'
import AdminHeader from '../components/layouts/AdminHeader'
import AdminSideBar from '../components/Admin/Layout/AdminSideBar'
import AdminDashboardAllProducts from "../components/Admin/AdminDashboardAllProducts.jsx"
const AdminDashboardProducts = () => {
  return (
    <div>
    <AdminHeader/>

    <div className="flex items-start justify-between w-full">

    <div className="w-[100px] 800px:w-[330px]">
       <AdminSideBar active={5}/>
      </div>
     <AdminDashboardAllProducts />
    </div>
</div>
  )
}

export default AdminDashboardProducts