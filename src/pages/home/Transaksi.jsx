import React, { useState, useEffect } from "react";
import Navbar2 from "../../Components/Navbar2";
import Navbar from "../../Components/Navbar";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { Link, useNavigate, useParams } from "react-router-dom";

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

const Transaksi = () => {
  const [token, setToken] = useState("");
  const [expire, setExpire] = useState("");
  const [transaksi, setTransaksi] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    refreshToken();
    document.title = 'Transaksi';
  }, []);

  const refreshToken = async () => {
    try {
      const response = await axios.get("http://localhost:7000/token");
      setToken(response.data.accessToken);
      const decoded = jwt_decode(response.data.accessToken);
      setExpire(decoded.exp);
      getTransaksi(decoded.userId);
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

  const getTransaksi = async (userId) => {
    try {
      const response = await axiosJWT.get(`http://localhost:7000/transaksiByuserId/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTransaksi(response.data);
    } catch (error) {
      console.error("Error fetching like data:", error);
    }
  };

  return (
    <>
    <Navbar />
      <Navbar2 />
      <div className="md:ml-40 mt-16 flex px-5 justify-center h-auto md:h-screen pb-10 bg-[#FAFAFA]">
        <div className="md:w-4/5 md:mr-24 md:grid grid-cols-3 mx-auto md:gap-24">
          {transaksi.map((transaksi) => (
            <div key={transaksi.id} className="w-72 h-80 flex flex-col  mt-5  bg-[#FAFAFA] rounded-md shadow-lg">
              <img className="rounded-md h-1/2 object-cover w-full" src={transaksi.paketWisatum.cover} alt="" />
              <h1 className="text-black font-body px-5 font-bold text-lg mt-3">
                {transaksi.nama_paket}
              </h1>
              <table className="w-full mt-2">
                <tbody>
                  <tr>
                    <td className="pl-5 text-sm font-body">Status Pembayaran</td>
                    <td className={`pl-5 text-sm font-body ${getStatusColor(transaksi.status_pembayaran)}`}>
                      {transaksi.status_pembayaran}
                    </td>
                  </tr>
                  <tr>
                    <td className="pl-5 text-sm font-body">Total Harga</td>
                    <td className="pl-5 text-sm font-body">Rp {Number(transaksi.total_harga).toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>
              <Link
                to={`DetailTransaksi/${transaksi.Order_Id}`}
                className="bg-[#3c87ca] text-center py-1.5 mx-5 mt-3 px-7 rounded-md text-white font-body hover:bg-[#2A5E8D]"
              >
                <button>Lihat Detail</button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Transaksi;
