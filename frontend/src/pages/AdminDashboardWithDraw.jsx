import React from 'react'
import AdminHeader from '../components/layouts/AdminHeader';
import AdminSideBar from '../components/Admin/Layout/AdminSideBar';
import AllWithdraw from "../components/Admin/AllWithdraw";

const AdminDashboardWithDraw = () => {
  return (
    <div>
    <AdminHeader/>

    <div className="flex items-start justify-between w-full">

    <div className="w-[100px] 800px:w-[330px]">
       <AdminSideBar active={7}/>
      </div>
     <AllWithdraw />
    </div>
</div>
  )
}

export default AdminDashboardWithDraw