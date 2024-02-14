import React, { useState, useEffect } from "react";
import NavbarAdmin from '../../Components/NavbarAdmin'
import axios from "axios";
import jwt_decode from "jwt-decode";
import { useParams, useNavigate } from "react-router-dom";

const DetailTransaksi = () => {
  const [token, setToken] = useState("");
  const [expire, setExpire] = useState("");
  const [transaksi, setTransaksi] = useState(null);
  const { orderId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    refreshToken();
    getTransaksi();
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
      <div className="ml-60 mt-16 flex flex-col items-center  justify-center h-auto pb-10 bg-[#FAFAFA]">
        {transaksi && (
          <div className="relative bg-white p-5 pb-10 mt-10 h-auto w-4/6  mx-auto rounded-md shadow-lg  z-10">
            <div className="flex justify-between">
              <h1 className="text-xl pt-5 pl-5 font-body font-bold">
                Detail Transaksi
              </h1>
            </div>
            <table className="ml-5 mt-10 text-base font-body">
              <tbody className="w-1/2">
                <tr>
                  <td >Nama Pengguna</td>
                  <td className="pl-24">{transaksi.nama_pengguna}</td>
                </tr>
                <tr>
                  <td >Email</td>
                  <td className="pl-24">{transaksi.email}</td>
                </tr>
                <tr>
                  <td >Nama Paket Wisata</td>
                  <td className="pl-24">{transaksi.nama_paket}</td>
                </tr>
                <tr>
                  <td >Tanggal</td>
                  <td className="pl-24">{transaksi.tanggal_berwisata}</td>
                </tr>
                <tr>
                  <td>Jumlah Orang</td>
                  <td className="pl-24">{transaksi.jumlah_orang}</td>
                </tr>
                <tr>
                  <td>Total Biaya</td>
                  <td className="pl-24">Rp {Number(transaksi.total_harga).toLocaleString()}</td>
                </tr>
                <tr>
                  <td>Status Pembayaran</td>
                  <td className={`pl-24 ${getStatusColor(transaksi.status_pembayaran)}`}>{transaksi.status_pembayaran}</td>
                </tr>
                <tr>
                  <td>Status Perjalanan</td>
                  <td className="pl-24">Belum Berlangsung</td>
                </tr>
                <tr>
                  <td>No Whatsapp Aktif</td>
                  <td className="pl-24">{transaksi.no_wa}</td>
                </tr>
              </tbody>
            </table>
            <div className="w-full flex justify-end ">
            <button className="font-body py-2 px-10 mt-10 mr-10 rounded-md text-white hover:bg-[#3373ac] bg-[#3c87ca] ">
            Tandai Selesai
            </button>
            </div>
          </div>
           )}
        </div>
    </>
  );
};

export default DetailTransaksi;
