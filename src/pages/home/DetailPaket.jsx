import React, { useState, useEffect } from "react";
import Navbar from "../../Components/Navbar";
import { Footer } from "../../Components/Footer";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { useParams, Link, useNavigate } from "react-router-dom";

const DetailPaket = () => {
  const [paket, setPaket] = useState(null);
  const [token, setToken] = useState("");
  const [expire, setExpire] = useState("");
  const { id } = useParams();
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

  const getPaketById = async () => {
    try {
      const response = await axiosJWT.get(`http://localhost:7000/paket/${id}`);
      setPaket(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getPaketById();
    refreshToken();
    document.title = 'Detail Paket Wisata';
  }, [id]);

  return (
    <>
      <Navbar />
      {paket && (
        <div className="flex max-md:mt-16  flex-col relative items-center bg-[#FAFAFA] h-auto w-full ">
          <div className="w-full h-72 md:h-screen relative">
            <img
              src={paket.cover}
              alt="foto"
              className="w-screen h-full object-cover"
            />
            <h1 className="absolute text-2xl max-md:px-10 md:text-3xl font-body font-bold text-white text-center w-full top-12 md:top-36">
              Paket Wisata {paket.nama_paket}
            </h1>
          </div>
          <div className="relative p-5 md:p-10 mb-10 -mt-32  md:-mt-96 bg-white  w-11/12 md:w-3/4 h-auto rounded-md shadow-md">
            <h1 className="font-body font-bold text-xl mb-3">Destinasi Wisata</h1>
            {Array.isArray(JSON.parse(paket.destinasi))
                  ? JSON.parse(paket.destinasi).map((item, index) => (
                      <li className="font-body font-normal text-base" key={index}>
                        {item}
                      </li>
                    ))
                  : JSON.parse(paket.destinasi)
                      .split("\n")
                      .map((item, index) => (
                        <li
                          className="font-body font-normal text-base"
                          key={index}
                        >
                          {item}
                        </li>
                      ))}
                  <h1 className="font-body font-bold text-xl mt-5 mb-3">Rangkaian Kegiatan</h1>
                  {Array.isArray(JSON.parse(paket.rangkaian_kegiatan))
                  ? JSON.parse(paket.rangkaian_kegiatan).map((item, index) => (
                      <li className="font-body font-normal text-base" key={index}>
                        {item}
                      </li>
                    ))
                  : JSON.parse(paket.rangkaian_kegiatan)
                      .split("\n")
                      .map((item, index) => (
                        <li
                          className="font-body font-normal text-base"
                          key={index}
                        >
                          {item}
                        </li>
                      ))}
                       <h1 className="font-body font-bold text-xl mt-5 mb-3">Fasilitas</h1>
                  {Array.isArray(JSON.parse(paket.fasilitas))
                  ? JSON.parse(paket.fasilitas).map((item, index) => (
                      <li className="font-body font-normal text-base" key={index}>
                        {item}
                      </li>
                    ))
                  : JSON.parse(paket.fasilitas)
                      .split("\n")
                      .map((item, index) => (
                        <li
                          className="font-body font-normal text-base"
                          key={index}
                        >
                          {item}
                        </li>
                      ))}
                       <h1 className="font-body font-bold text-xl mt-5 mb-3">Biaya</h1>
                  {Array.isArray(JSON.parse(paket.biaya))
                  ? JSON.parse(paket.biaya).map((item, index) => (
                      <li className="font-body font-normal text-base" key={index}>
                        {item}
                      </li>
                    ))
                  : JSON.parse(paket.biaya)
                      .split("\n")
                      .map((item, index) => (
                        <li
                          className="font-body font-normal text-base"
                          key={index}
                        >
                          {item}
                        </li>
                      ))}
                       <Link to={`/PaketWisata/Pemesanan/${paket.id}`} className='bg-[#3c87ca] py-2 px-8 text-sm rounded-md text-white font-body float-right md:mr-10 mt-5 hover:bg-[#2A5E8D] '><button>Pesan Sekarang</button></Link>
          </div>
        </div>
      )}
      <Footer/>
    </>
  );
};

export default DetailPaket;
