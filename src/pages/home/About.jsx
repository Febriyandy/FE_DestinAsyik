import React, { useState, useEffect } from "react";
import mockup from "../../assets/mockup.png";
import web from "../../assets/WebCrafters.png";
import Navbar from '../../Components/Navbar';
import { Footer } from '../../Components/Footer';
import axios from "axios";
import jwt_decode from "jwt-decode";
import {useNavigate } from "react-router-dom";

const About = () => {
  const [token, setToken] = useState("");
  const [expire, setExpire] = useState("");
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
    document.title = 'Tentang Kami';
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
  
  return (
    <>
    <Navbar/>
      <div className=" flex items-center mt-16 p-5 md:pt-10 justify-center h-auto bg-[#FAFAFA]">
        <div className="md:w-4/5 w-full h-auto mb-10 md:flex flex-wrap bg-white rounded-xl shadow-lg">
          <div className="md:w-1/2 w-full">
            <h1 className="animate__animated animate__fadeIn animate__delay-1000ms font-body p-5 md:p-10 font-bold text-xl md:text-2xl text-[#3c87ca]">
              Tentang DestinAsyik
            </h1>
            <img className="md:hidden animate__animated animate__fadeIn animate__delay-1000ms w-4/5 mx-auto mt-10 " src={mockup} alt="" />
            <p className=" animate__animated animate__fadeIn animate__delay-1000ms font-body text-sm md:text-base px-5 md:pl-10">
              DestinAsyik merupakan sebuah website yang bertujuan menyediakan
              informasi terkini, promosi tempat-tempat menarik, rekomendasi
              lengkap untuk tempat wisata, nongkrong, tempat makan dan minum,
              serta menyediakan jasa tour guide yang ada di Yogyakarta.
            </p>
          </div>
          <div className="w-1/2 max-md:hidden">
            <img className="animate__animated animate__fadeIn animate__delay-1000ms w-4/5 mx-auto mt-10 " src={mockup} alt="" />
          </div>
          <div className="w-1/2 max-md:hidden">
            <img
              className=" animate__animated animate__fadeIn animate__delay-1000ms mx-auto w-72 bg-[#3c87ca] mb-24 mt-10 p-10 rounded-2xl shadow-lg"
              src={web}
              alt=""
            />
          </div>
          <div className="md:w-1/2 w-full px-5 ">
            <h1 className=" animate__animated animate__fadeIn animate__delay-1000ms font-body pt-10 font-bold text-xl md:text-2xl text-[#3c87ca]">
              Web Crafters
            </h1>
            <img
              className="md:hidden animate__animated animate__fadeIn animate__delay-1000ms mx-auto w-32 bg-[#3c87ca] mt-10 p-10 rounded-2xl shadow-lg"
              src={web}
              alt=""
            />
            <p className=" animate__animated animate__fadeIn animate__delay-1000ms font-body text-sm pb-10 md:text-base mt-5 md:pr-10">
              Hallo sobat DestinAsyik,
              <br />
              Web Crafters merupakan tim developer dari pengembangan website
              DestinAsyik yang menyediakan jasa pelayanan website khusus untuk
              pengembangan industri pariwisata. Melalui kerjasama tim yang kuat,
              kami selalu berkomitmen untuk terus mengembangkan website
              DestinAsyik yang sesuai dengan minat pengguna untuk memberikan
              pengalaman yang terbaik untuk Anda. Jangan ragu untuk menghubungi
              kami dan berkonsultasi lebih lanjut. <br /> <br />
              Salam, Web Crafters
            </p>
          </div>
        </div>
      </div>
      <Footer/>
    </>
  );
};

export default About;
