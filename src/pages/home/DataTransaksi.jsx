import React, { useState, useEffect } from 'react';
import NavbarAdmin from '../../Components/NavbarAdmin';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { Link, useNavigate } from 'react-router-dom';

const DataTransaksi = () => {
  const [token, setToken] = useState('');
  const [expire, setExpire] = useState('');
  const [transaksi, setTransaksi] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showEntries, setShowEntries] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    refreshToken();
    getTransaksi();
    document.title = 'Transaksi';
  }, [currentPage, showEntries]); 

  const refreshToken = async () => {
    try {
      const response = await axios.get('http://localhost:7000/token');
      setToken(response.data.accessToken);
      const decoded = jwt_decode(response.data.accessToken);
      setExpire(decoded.exp);
    } catch (error) {
      if (error.response) {
        navigate('/');
      }
    }
  };

  const axiosJWT = axios.create();

  axiosJWT.interceptors.request.use(
    async (config) => {
      const currentDate = new Date();
      if (expire * 1000 < currentDate.getTime()) {
        const response = await axios.get('http://localhost:7000/token');
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

  const getTransaksi = async () => {
    try {
      const response = await axiosJWT.get('http://localhost:7000/transaksi', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTransaksi(response.data);
      setTotalPages(Math.ceil(response.data.length / showEntries));
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

 
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); 
  };

  const handleShowEntries = (e) => {
    setShowEntries(Number(e.target.value));
    setCurrentPage(1); 
    setTotalPages(Math.ceil(transaksi.length / Number(e.target.value)));
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const filteredTransaksi = transaksi.filter((u) => {
    return (
      u &&
      u.nama_pengguna &&
      u.nama_paket &&
      u.status_pembayaran &&
      (u.nama_pengguna.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.nama_paket.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.status_pembayaran.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  const paginatedTransaksi = filteredTransaksi.slice(
    (currentPage - 1) * showEntries,
    currentPage * showEntries
  );

  const renderedTransaksi = paginatedTransaksi || [];

  const getStatusColor = (status) => {
    const lowercaseStatus = status ? status.toLowerCase() : '';
  
    switch (lowercaseStatus) {
      case 'sukses':
        return 'text-green-500';
      case 'pending':
        return 'text-blue-500';
      case 'gagal':
        return 'text-red-500';
      default:
        return 'text-black'; 
    }
  };
  
  return (
    <>
    <NavbarAdmin/>
    <div className='ml-60 px-5 h-auto bg-[#FAFAFA] pb-10'>
        <h1 className='text-2xl font-body font-bold pt-5'>Data Transaksi</h1>
        <div className="container font-body mt-10  mx-auto bg-white p-10 rounded-md shadow-lg">
      <div className='flex justify-between mb-5'>
        <div className='flex justify-center  items-center gap-1'>
          <p>Show</p>
          <input
                className='border border-gray-400 focus:border-[#3c87ca] outline-none pl-2 w-16 rounded-md'
                type='number'
                value={showEntries}
                onChange={handleShowEntries}
              />
          <p>entries</p>
        </div>
        <div className='gap-1'>
          <label htmlFor="">Search: </label>
          <input
                className='border ml-3 border-gray-400 focus:border-[#3c87ca] outline-none pl-2 w-44 rounded-md'
                type='text'
                value={searchTerm}
                onChange={handleSearch}
              />
        </div>
      </div>
    <div className="container mx-auto ">
      <table className="min-w-full bg-white ">
        <thead>
          <tr className="text-left">
            <th className="py-2 px-4  text-center">No</th>
            <th className="py-2 px-4 ">Nama Pengguna</th>
            <th className="py-2 px-4 ">Paket Wisata</th>
            <th className="py-2 px-4 ">Tanggal</th>
            <th className="py-2 px-4 ">Status Pembayaran</th>
            <th className="py-2 px-4 ">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {renderedTransaksi.length > 0 ? (
            renderedTransaksi.map((transaksi, index) => (
            <tr key={transaksi.id}>
              <td className="py-2 px-4 border-y text-center">{index + 1}</td>
              <td className="py-2 px-4 border-y">{transaksi.nama_pengguna}</td>
              <td className="py-2 px-4 border-y">{transaksi.nama_paket}</td>
              <td className="py-2 px-4 border-y">{transaksi.tanggal_berwisata}</td>
              <td className={`py-2 px-4 border-y ${getStatusColor(transaksi.status_pembayaran)}`}>{transaksi.status_pembayaran}</td>
              <td className="py-2 px-4 border-y">

                <Link to={`DetailTransaksiAdmin/${transaksi.Order_Id}`} className="bg-blue-500 text-white px-4 py-1 rounded ml-2">Lihat Detail</Link>
              </td>
            </tr>
            ))
          ) : (
            <tr>
                    <td colSpan='5' className='py-3 px-4 text-center'>
                      Data tidak ditemukan
                    </td>
            </tr>
          )}
        </tbody>
      </table>
      <div className='flex justify-between mt-3'>
              <div>
                <p>Page {currentPage} of {totalPages}</p>
              </div>
              <div className='flex'>
                <button className='border px-2 rounded-l-md cursor-pointer  border-gray-400 hover:border-[#3c87ca]' onClick={handlePrevPage} disabled={currentPage === 1}>
                  Previous
                </button>
                <p className='px-2 py-1 text-white bg-[#3c87ca]'>{currentPage}</p>
                <button className='border px-2 rounded-r-md cursor-pointer  border-gray-400 hover:border-[#3c87ca]' onClick={handleNextPage} disabled={currentPage === totalPages}>
                  Next
                </button>
              </div>
            </div>
    </div>
    </div>
    </div>
    </>
  );
};

export default DataTransaksi