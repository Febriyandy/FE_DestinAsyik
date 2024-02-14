import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Logo from "../assets/images/Logo1.png";
import { FaRegUser } from "react-icons/fa";
import { GrHistory } from "react-icons/gr";
import { BiLogOut } from "react-icons/bi";
import profil from "../assets/profil1.png";
import { FaRegHeart } from "react-icons/fa";
import jwt_decode from "jwt-decode";

const Navbar2 = () => {
  const [token, setToken] = useState("");
  const [expire, setExpire] = useState("");
  const [foto, setFoto] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  

  const refreshToken = async () => {
    try {
      const response = await axios.get("http://localhost:7000/token");
      setToken(response.data.accessToken);
      const decoded = jwt_decode(response.data.accessToken);
      setFoto(decoded.foto);
      setExpire(decoded.exp);
    } catch (error) {
      if (error.response) {
        navigate("/");
      }
    }
  };

  useEffect(() => {
    refreshToken();
  }, []);

  const axiosJWT = axios.create();

  axiosJWT.interceptors.request.use(
    async (config) => {
      const currentDate = new Date();
      if (expire * 1000 < currentDate.getTime()) {
        const response = await axios.get("http://localhost:7000/token");
        config.headers.Authorization = `Bearer ${response.data.accessToken}`;
        setToken(response.data.accessToken);
        const decoded = jwt_decode(response.data.accessToken);
        setExpire(decoded.exp);
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  const Logout = async () =>{
    try {
      await axios.delete('http://localhost:7000/logout');
      navigate('/')
    } catch (error) {
      console.log(error);
    }
  }
  const isActivePath = (path) => {
    return location.pathname.startsWith(path);
  };

  const menuItems = [
    { path: '/Profil', icon: <FaRegUser />, label: 'Profil' },
    { path: '/Like', icon: <FaRegHeart />, label: 'Suka' },
    { path: '/Transaksi', icon: <GrHistory />, label: 'Transaksi' },
    { path: '/', icon: <BiLogOut />, label: 'Keluar', onClick: Logout },
  ];

  const navigationItems = [
    { path: '/Landingpage', label: 'Beranda' },
    { path: '/kontak', label: 'Kontak' },
    { path: '/about', label: 'Tentang Kami' },
    { path: '/PaketWisata', label: 'Paket Wisata' },
  ];

  return (
    <>
      <div className='max-md:hidden fixed top-0 left-0 w-full h-16 flex bg-white z-[1000]'>
        <div className='w-60 h-screen bg-white'>
        <div className='flex pl-10 items-center'>
          <img className='w-44 mt-6 justify-center items-center' src={Logo} alt="" />
        </div>
          <div className='w-full mt-10 flex flex-col items-center'>
            {menuItems.map((menuItem, index) => (
              <div
                key={index}
                onClick={menuItem.onClick || (() => {})}
              >
                <Link to={menuItem.path}>
                <div className={`w-52 mb-2 flex rounded-md py-2 px-5 ${isActivePath(menuItem.path) && menuItem.label !== 'Keluar' ? 'bg-[#3c87ca] text-white' : 'bg-transparent hover:bg-[#3c87ca] hover:text-white'}`}>
                    <p className={`flex gap-4 text-base font-body font-bold justify-center items-center ${isActivePath(menuItem.path) && menuItem.label !== 'Keluar' ? 'text-white' : 'text-black'}`}>
                      {menuItem.icon}
                      {menuItem.label}
                    </p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
        <div className='flex flex-grow justify-end items-center gap-6 pr-10'>
          {navigationItems.map((navItem, index) => (
            <Link to={navItem.path} key={index} className={`font-body ${location.pathname === navItem.path ? 'text-[#3c87ca]' : 'text-black'} hover:text-[#3c87ca]`}>
              {navItem.label}
            </Link>
          ))}
          <Link to="/profil" className='text-4xl hover:text-[#3c87ca]'>
          <img  className='w-10 h-10 rounded-full' src={foto || profil} alt="" />
          </Link>
        </div>
      </div>

      
      <div className='ml-60 '>
        {/* Content */}
      </div>
    </>
  );
}

export default Navbar2;
