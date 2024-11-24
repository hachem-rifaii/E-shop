import React           from 'react'
import DashboardHeader from '../../components/Shop/Layout/DashboardHeader'
import ShopSetting     from "../../components/Shop/ShopSetting"
import DashboardSideBar from '../../components/Shop/Layout/DashboardSideBar'
const ShopSettingsPage = () => {
  return (
    <div>
        <DashboardHeader />
        <div className="flex items-start justify-between w-full">
            <div className="w-[80px] 800px:w-[330px]">
                <DashboardSideBar active={11}/>
            </div>
            <ShopSetting />
        </div>
    </div>
  )
}

export default ShopSettingsPage