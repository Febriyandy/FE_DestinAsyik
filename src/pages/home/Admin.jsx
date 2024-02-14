import React, { useState, useEffect } from 'react';
import { IoLocation } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { MdOutlineTour } from "react-icons/md";
import { FaHistory } from "react-icons/fa";
import NavbarAdmin from '../../Components/NavbarAdmin';
import axios from "axios";
import jwt_decode from "jwt-decode";
import { Link, useNavigate } from "react-router-dom";

const Admin = () => {
  const [token, setToken] = useState("");
  const [expire, setExpire] = useState("");
  const [destinations, setDestinations] = useState(0);
  const [transactions, setTransactions] = useState(0);
  const [users, setUsers] = useState(0);
  const [travelPackages, setTravelPackages] = useState(0);
  const navigate = useNavigate();

  const refreshToken = async () => {
    try {
      const response = await axios.get("http://localhost:7000/token");
      setToken(response.data.accessToken);
      const decoded = jwt_decode(response.data.accessToken);
      setExpire(decoded.exp);
    } catch (error) {
      if (error.response) {
        navigate("/");
      }
    }
  };

  useEffect(() => {
    refreshToken();
    document.title = 'Dashboard';
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

  const fetchData = async () => {
    try {
      const [destinationsResponse, transactionsResponse, usersResponse, travelPackagesResponse] = await Promise.all([
        axiosJWT.get("http://localhost:7000/wisata", { headers: { Authorization: `Bearer ${token}` } }),
        axiosJWT.get("http://localhost:7000/transaksi", { headers: { Authorization: `Bearer ${token}` } }),
        axiosJWT.get("http://localhost:7000/users", { headers: { Authorization: `Bearer ${token}` } }),
        axiosJWT.get("http://localhost:7000/paket", { headers: { Authorization: `Bearer ${token}` } })
      ]);

      setDestinations(destinationsResponse.data.length);
      setTransactions(transactionsResponse.data.length);
      setUsers(usersResponse.data.length);
      setTravelPackages(travelPackagesResponse.data.length);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  return (
    <>
    <NavbarAdmin/>
    <div className='ml-60 px-5 mt-16 h-auto bg-[#FAFAFA]'>
        <h1 className='text-2xl font-body font-bold pt-10'>Dashboard</h1>
        <div className='flex justify-between mt-10'>
            <Link to="/Destinasi">
            <div className='w-64 flex p-3 h-20 border border-transparent hover:border-[#3c87ca] bg-white rounded-md shadow-lg'>
                <div className='w-14 p-2.5 h-14 rounded-md bg-[#3c87ca] '>
                    <h1 className='text-white text-4xl'><IoLocation/></h1>
                </div>
                <div>
                    <h1 className='text-3xl pl-3 font-body font-bold'>{destinations}</h1>
                    <p className='text-base font-body font-bold pl-3 '>Destinasi Wisata</p>
                </div>
            </div>
            </Link>
            <Link to="/DataTransaksi">
            <div className='w-64 flex p-3 h-20 border border-transparent hover:border-[#3c87ca] bg-white rounded-md shadow-lg'>
                <div className='w-14 p-2.5 h-14 rounded-md bg-[#3c87ca] '>
                    <h1 className='text-white text-4xl'><FaHistory /></h1>
                </div>
                <div>
                    <h1 className='text-3xl pl-3 font-body font-bold'>{transactions}</h1>
                    <p className='text-sm font-body font-bold pl-3 '>Transaksi</p>
                </div>
            </div>
            </Link>
            <Link to="/DataPenggunaWisata">
            <div className='w-64 flex p-3 h-20 border border-transparent hover:border-[#3c87ca] bg-white rounded-md shadow-lg'>
                <div className='w-14 p-2.5 h-14 rounded-md bg-[#3c87ca] '>
                    <h1 className='text-white text-4xl'><FaUser/></h1>
                </div>
                <div>
                    <h1 className='text-3xl pl-3 font-body font-bold'>{users}</h1>
                    <p className='text-base font-body font-bold pl-3 '>Total Pengguna</p>
                </div>
            </div>
            </Link>
            <Link to="/DataPaketWisata">
            <div className='w-64 flex p-3 h-20 border border-transparent hover:border-[#3c87ca] bg-white rounded-md shadow-lg'>
                <div className='w-14 p-2.5 h-14 rounded-md bg-[#3c87ca] '>
                    <h1 className='text-white text-4xl'><MdOutlineTour /></h1>
                </div>
                <div>
                    <h1 className='text-3xl pl-3 font-body font-bold'>{travelPackages}</h1>
                    <p className='text-base font-body font-bold pl-3 '>Paket Wisata</p>
                </div>
            </div>
            </Link>
            
            
        </div>
    </div>
    </>
  )
}

export default Admin