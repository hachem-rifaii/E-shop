import React, { useState } from 'react'
import Header from '../components/layouts/Header'
import styles from '../style/style';
import ProfileSideBar from "../components/Profile/ProfileSideBar.jsx"
import ProfileContent from "../components/Profile/ProfileContent.jsx"
const ProfilePage = () => {
    const [active, setActive] = useState(1);

  return (
    <div>
        <Header />
        <div className={`${styles.section} flex bg-[#f5f5f5] py-10`}>
            <div className="w-[50px] 800px:w-[335px] sticky mt-[18%] 800px:mt-0">
                <ProfileSideBar active={active} setActive={setActive}/>
            </div>
            <ProfileContent active={active} />
        </div>
    </div>
  )
}

export default ProfilePage