import React, { useState, useEffect } from "react";
import Navbar2 from "../../Components/Navbar2";
import Navbar from "../../Components/Navbar";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { useParams, Link, useNavigate } from "react-router-dom";

const DetailTransaksi = () => {
  const [token, setToken] = useState("");
  const [expire, setExpire] = useState("");
  const [transaksi, setTransaksi] = useState(null);
  const { orderId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    refreshToken();
    getTransaksi();
    updateStatus();
  }, []);

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

  const getTransaksi = async () => {
    try {
      const response = await axiosJWT.get(`http://localhost:7000/transaksi/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTransaksi(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const updateStatus = async () => {
    try {
      await axiosJWT.get(`http://localhost:7000/transaksi/status/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

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
    <Navbar />
      <Navbar2 />
      <div className="md:ml-60 mt-16 flex flex-col items-center justify-center h-auto pb-10 bg-[#FAFAFA]">
        {transaksi &&(
          <div className="w-full">
          <div className="relative w-full h-72 ">
          <img src={transaksi.paketWisatum.cover} className="w-full h-full object-cover" alt="" />
          <h1 className="absolute w-full top-14 text-white font-body text-base md:text-3xl font-bold text-center">
            Selamat Anda sudah Melakukan Booking <br />
            Paket Wisata {transaksi.nama_paket}
          </h1>
        </div>
        <div className="relative bg-white p-5 pb-10 h-auto md:w-4/6 w-11/12 -mt-32 mx-auto rounded-md shadow-lg  z-10">
          <div className="flex justify-between">
            <h1 className="text-xl pt-5 md:pl-5 font-body font-bold">Detail Pesanan</h1>
            <Link to={`/PaketWisata/DetailPaket/${transaksi.paketId}`}>
              <button className="font-body max-md:hidden py-2 px-10 mt-5 rounded-md text-white hover:bg-[#3373ac] bg-[#3c87ca]">
                Detail Paket Wisata
              </button>
            </Link>
          </div>
          <table className="md:ml-5 mt-5 md:mt-10 text-base font-body">
            <tbody className="w-1/2">
            <tr>
                <td>Nama</td>
                <td className="md:pl-24 pl-6">{transaksi.nama_pengguna}</td>
              </tr>
              <tr>
                <td>Email</td>
                <td className="md:pl-24 pl-6">{transaksi.email}</td>
              </tr>
              <tr>
                <td>No Whatsapp</td>
                <td className="md:pl-24 pl-6">{transaksi.no_wa}</td>
              </tr>
              <tr>
                <td>Nama Paket</td>
                <td className="md:pl-24 pl-6">{transaksi.nama_paket}</td>
              </tr>
              <tr>
                <td>Tanggal Berwisata</td>
                <td className="md:pl-24 pl-6">{transaksi.tanggal_berwisata}</td>
              </tr>
              <tr>
                <td>Jumlah Orang</td>
                <td className="md:pl-24 pl-6">{transaksi.jumlah_orang} Orang</td>
              </tr>
              <tr>
                <td>Total Biaya</td>
                <td className="md:pl-24 pl-6">Rp {Number(transaksi.total_harga).toLocaleString()}</td>
              </tr>
              <tr>
                <td>Status Pembayaran</td>
                <td className={`md:pl-24 pl-6 ${getStatusColor(transaksi.status_pembayaran)}`}>
                  {transaksi.status_pembayaran}
                </td>
              </tr>
              <tr>
                <td>Status Perjalanan</td>
                <td className="md:pl-24 pl-6">Belum Berlangsung</td>
              </tr>
            </tbody>
          </table>
          <h1 className="md:text-xl md:w-2/3 pt-5 md:pl-5 font-body font-bold">
            Silahkan hubungi nomor dibawah ini untuk memberikan lokasi penjemputan
          </h1>
          <p className="font-body mt-5 md:ml-5">Telepon / Whatsapp</p>
          <button className="font-body py-2 px-10 mt-5 md:ml-5 rounded-md text-white hover:bg-[#3373ac] bg-[#3c87ca]">
            0851-2289-0989
          </button>
          <Link to={`/PaketWisata/DetailPaket/${transaksi.paketId}`}>
              <button className="font-body md:hidden py-2 px-10 mt-5 rounded-md text-white hover:bg-[#3373ac] bg-[#3c87ca]">
                Detail Paket Wisata
              </button>
            </Link>
        </div>
        </div>
        )}
        
      </div>
    </>
  );
};

export default DetailTransaksi;
