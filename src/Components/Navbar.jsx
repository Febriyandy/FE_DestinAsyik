import React, { useState, useEffect } from 'react'
import Logo from "../assets/images/Logo1.png";
import profil from "../assets/profil1.png";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from "axios";
import jwt_decode from "jwt-decode";
import { IoMenuSharp } from "react-icons/io5";
import { BiX } from "react-icons/bi";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";



const Navbar = () => {
  const [token, setToken] = useState("");
  const [expire, setExpire] = useState("");
  const [foto, setFoto] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen(!menuOpen);
  const [profilOpen, setProfilOpen] = useState(false);
  const toggleProfil = () => setProfilOpen(!profilOpen);
  

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

  const navigationItems = [
    { path: '/Landingpage', label: 'Beranda' },
    { path: '/kontak', label: 'Kontak' },
    { path: '/about', label: 'Tentang Kami' },
    { path: '/PaketWisata', label: 'Paket Wisata' },
  ];
  return (
    <>
    <nav className="md:hidden w-full h-16 -mt-16 fixed z-[1000] flex hover:text-black backdrop-blur-md">
        <div className="flex items-center justify-between w-full">
          <div className="ml-5">
            <img className="w-32" src={Logo} alt="" />
          </div>
          <div className="mr-6">
            <button className="text-2xl justify-end" onClick={toggleMenu}>
             {menuOpen ? <BiX /> : < IoMenuSharp/> } 
            </button>
          </div>
        </div>
      </nav>
      {menuOpen && (
        <div className="w-full h-auto bg-white  fixed z-[1000] ">
        <div className="w-full flex font-semibold justify-between text-[#3c87ca] font-body text-sm  border-[#3c87ca] py-5 px-5">
          <p>Aktivitas</p>
          <button className="text-2xl justify-end " onClick={toggleProfil}>
             {profilOpen ? <IoIosArrowUp /> : < IoIosArrowDown/> } 
            </button>
        </div>
        {profilOpen && (
          <div>
          <Link to="/Profil">
          <div className="w-full font-semibold ml-10  text-[#3c87ca] font-body text-sm  border-[#3c87ca] py-3 border-l-2 px-3">
            Profil
          </div>
          </Link>
          <Link to="/Like">
          <div className="w-full font-semibold ml-10  text-[#3c87ca] font-body text-sm  border-[#3c87ca] py-3 border-l-2 px-3">
            Suka
          </div>
          </Link>
          <Link to="/Transaksi">
          <div className="w-full font-semibold ml-10  text-[#3c87ca] font-body text-sm  border-[#3c87ca] py-3 border-l-2 px-3">
            Transaksi
          </div>
          </Link>
          </div>  
        )}
        
      <Link to="/Landingpage">
        <div className="w-full font-semibold text-[#3c87ca] font-body text-sm  py-5 px-5">
          Beranda
        </div>
      </Link>
      <Link to="/kontak">
        <div className="w-full font-semibold text-[#3c87ca] font-body text-sm  py-5 px-5">
          Kontak
        </div>
      </Link>
      <Link to="/about">
        <div className="w-full font-semibold text-[#3c87ca] font-body text-sm  py-5 px-5">
          Tentang Kami
        </div>
      </Link>
      <Link to="/PaketWisata">
        <div className="w-full font-semibold text-[#3c87ca] font-body text-sm  py-5 px-5">
          Paket Wisata
        </div>
      </Link>
      <button onClick={Logout}>
        <div className="w-full font-semibold text-[#3c87ca] font-body text-sm  py-5 px-5">
          Keluar
        </div>
      </button>
      </div>

      )}
      
    <nav  className= 'max-md:hidden animate__animated  animate__fadeInDown fixed top-0 z-[1000] h-16 w-full flex backdrop-blur-md ' >
        <div className='flex pl-10 items-center'>
          <img className='w-44 justify-center items-center' src={Logo} alt="" />
        </div>
        <div className='flex flex-grow justify-end items-center gap-6 pr-10'>
          {navigationItems.map((navItem, index) => (
            <Link to={navItem.path} key={index} className={`font-body ${location.pathname === navItem.path ? 'text-[#3c87ca]' : 'text-black'} hover:text-[#3c87ca]`}>
              {navItem.label}
            </Link>
          ))}
          <Link to="/Profil" className='text-4xl hover:text-[#3c87ca]'>
            <img  className='w-10 h-10 rounded-full' src={foto || profil} alt="" />
          </Link>
        </div>
    </nav>
    </>
  )
}

export default Navbar