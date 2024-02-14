import React, { useState, useEffect, useRef } from "react";
import Foto from "../../assets/images/dasboard2.jpg";
import Navbar from "../../Components/Navbar";
import { Footer } from "../../Components/Footer";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { Link, useNavigate } from "react-router-dom";
import { FiArrowRightCircle } from "react-icons/fi";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const PaketWisata = () => {
  const [paket1day, setPaket1day] = useState([]);
  const [paket2day, setPaket2day] = useState([]);
  const [paket3day, setPaket3day] = useState([]);
  const [token, setToken] = useState("");
  const [expire, setExpire] = useState("");
  const sliderRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    getPaket1day();
    getPaket2day();
    getPaket3day();
    refreshToken();
    document.title = 'Paket Wisata';
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

  const getPaket1day = async () => {
    try {
      const response = await axiosJWT.get("http://localhost:7000/paket1day", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPaket1day(response.data);
    } catch (error) {
      console.error("Error fetching wisata data:", error);
    }
  };

  const getPaket2day = async () => {
    try {
      const response = await axiosJWT.get("http://localhost:7000/paket2day", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPaket2day(response.data);
    } catch (error) {
      console.error("Error fetching wisata data:", error);
    }
  };

  const getPaket3day = async () => {
    try {
      const response = await axiosJWT.get("http://localhost:7000/paket3day", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPaket3day(response.data);
    } catch (error) {
      console.error("Error fetching wisata data:", error);
    }
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false,
    autoplaySpeed: 4000,
    customPaging: function (i) {
      return (
        <div
          className={`w-2 h-2  mx-2 rounded-full border border-[#3c87ca] ${
            currentSlide === i ? "bg-[#3c87ca]" : "bg-white"
          }`}
        ></div>
      );
    },
    beforeChange: (current, next) => setCurrentSlide(next),
  };
  

  return (
    <>
      <Navbar />
      <div className="relative max-md:mt-16 bg-[#FAFAFA] pb-10">
        <div className="relative">
          <img
            src={Foto}
            className="w-full h-72 md:h-screen object-cover"
            alt="bg-paketwisata"
          />
          <div className="absolute w-4/5 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-center">
            <h1 className="animate__animated animate__fadeIn animate__delay-300ms text-base md:text-4xl font-body md:leading-relaxed font-bold ">
              Temukan Paket Wisata Terjangkau <br />
              dan Menyenangkan Bersama DestinAsyik <br />
              Untuk Menjelajah Kepulauan Riau
            </h1>
          </div>
        </div>
        <div className="md:w-4/5 h-auto py-5 md:py-10 bg-white rounded-md shadow-lg md:mt-10 mx-auto">
          <h1  className="bg-[#77ABDA] w-60 text-white font-body font-bold py-3 px-10 rounded-r-full">
            Paket Wisata 1 Hari{" "}
          </h1>
          <div data-aos="fade-up" data-aos-duration="1000" className="flex">
            <Slider className="md:hidden w-4/5 mx-auto py-5" {...settings}>
            {paket1day.map((paket, index) => (
              <div key={index} className="w-full h-44 rounded-md  bg-white relative overflow-hidden group">
                <img
                    className="rounded-md h-44 object-cover transition-transform duration-300 transform scale-100 group-hover:scale-105"
                    src={paket.cover}
                    alt=""
                  />
                  <h1 className="text-white absolute ml-2 -mt-14 font-body font-bold text-xl">
                    {paket.nama_paket}
                  </h1>
                  <p className="absolute -mt-8 text-sm text-white ml-2 font-body font-semibold">
                    Mulai dari {paket.rentang_harga}
                  </p>
                  <div className="absolute bottom-0 right-0 w-full h-full flex flex-col justify-end bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex justify-end mr-2 mb-2">
                      <Link to={`DetailPaket/${paket.id}`} className="text-white text-3xl cursor-pointer">
                        <FiArrowRightCircle />
                      </Link>
                    </div>
                  </div>
              </div>
              ))}
            </Slider>
            <div className="max-md:hidden w-full overflow-hidden px-10 grid grid-cols-3 gap-4 justify-between">
              {paket1day.map((paket, index) => (
                <div key={index} className="relative w-72 h-44 mt-10 mx-auto bg-[#FAFAFA] rounded-md shadow-lg overflow-hidden group">
                  <img
                    className="rounded-md h-44 object-cover transition-transform duration-300 transform scale-100 group-hover:scale-105"
                    src={paket.cover}
                    alt=""
                  />
                  <h1 className="text-white absolute ml-2 -mt-14 font-body font-bold text-xl">
                    {paket.nama_paket}
                  </h1>
                  <p className="absolute -mt-8 text-sm text-white ml-2 font-body font-semibold">
                    Mulai dari {paket.rentang_harga}
                  </p>
                  <div className="absolute bottom-0 right-0 w-full h-full flex flex-col justify-end bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex justify-end mr-2 mb-2">
                      <Link to={`DetailPaket/${paket.id}`} className="text-white text-3xl cursor-pointer">
                        <FiArrowRightCircle />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <h1 className="bg-[#3c87ca] mt-10 w-60 text-white font-body font-bold py-3 px-10 rounded-r-full">
            Paket Wisata 2 Hari{" "}
          </h1>
          <div data-aos="fade-up" data-aos-duration="1000"  className="flex">
          <Slider className="md:hidden w-4/5 mx-auto py-5" {...settings}>
            {paket2day.map((paket, index) => (
              <div key={index} className="w-full h-44 rounded-md  bg-white relative overflow-hidden group">
                <img
                    className="rounded-md h-44 object-cover transition-transform duration-300 transform scale-100 group-hover:scale-105"
                    src={paket.cover}
                    alt=""
                  />
                  <h1 className="text-white absolute ml-2 -mt-14 font-body font-bold text-xl">
                    {paket.nama_paket}
                  </h1>
                  <p className="absolute -mt-8 text-sm text-white ml-2 font-body font-semibold">
                    Mulai dari {paket.rentang_harga}
                  </p>
                  <div className="absolute bottom-0 right-0 w-full h-full flex flex-col justify-end bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex justify-end mr-2 mb-2">
                      <Link to={`DetailPaket/${paket.id}`} className="text-white text-3xl cursor-pointer">
                        <FiArrowRightCircle />
                      </Link>
                    </div>
                  </div>
              </div>
              ))}
            </Slider>
            <div className="max-md:hidden w-full overflow-hidden px-10 grid grid-cols-3 gap-4 justify-between">
              {paket2day.map((paket, index) => (
                <div key={index} className="relative w-72 h-44 mt-10 mx-auto bg-[#FAFAFA] rounded-md shadow-lg overflow-hidden group">
                  <img
                    className="rounded-md h-44 object-cover transition-transform duration-300 transform scale-100 group-hover:scale-105"
                    src={paket.cover}
                    alt=""
                  />
                  <h1 className="text-white absolute ml-2 -mt-14 font-body font-bold text-xl">
                    {paket.nama_paket}
                  </h1>
                  <p className="absolute -mt-8 text-sm text-white ml-2 font-body font-semibold">
                    Mulai dari {paket.rentang_harga}
                  </p>
                  <div className="absolute bottom-0 right-0 w-full h-full flex flex-col justify-end bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex justify-end mr-2 mb-2">
                      <Link to={`DetailPaket/${paket.id}`} className="text-white text-3xl cursor-pointer">
                        <FiArrowRightCircle />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <h1 className="bg-[#2A5E8D] mt-10 w-60 text-white font-body font-bold py-3 px-10 rounded-r-full">
            Paket Wisata 3 Hari{" "}
          </h1>
          <div data-aos="fade-up" data-aos-duration="1000" className="flex">
          <Slider className="md:hidden w-4/5 mx-auto py-5" {...settings}>
            {paket3day.map((paket, index) => (
              <div key={index} className="w-full h-44 rounded-md  bg-white relative overflow-hidden group">
                <img
                    className="rounded-md h-44 object-cover transition-transform duration-300 transform scale-100 group-hover:scale-105"
                    src={paket.cover}
                    alt=""
                  />
                  <h1 className="text-white absolute ml-2 -mt-14 font-body font-bold text-xl">
                    {paket.nama_paket}
                  </h1>
                  <p className="absolute -mt-8 text-sm text-white ml-2 font-body font-semibold">
                    Mulai dari {paket.rentang_harga}
                  </p>
                  <div className="absolute bottom-0 right-0 w-full h-full flex flex-col justify-end bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex justify-end mr-2 mb-2">
                      <Link to={`DetailPaket/${paket.id}`} className="text-white text-3xl cursor-pointer">
                        <FiArrowRightCircle />
                      </Link>
                    </div>
                  </div>
              </div>
              ))}
            </Slider>
            <div className="max-md:hidden w-full overflow-hidden px-10 grid grid-cols-3 gap-4 justify-between">
              {paket3day.map((paket, index) => (
                <div key={index} className="relative w-72 h-44 mt-10 mx-auto bg-[#FAFAFA] rounded-md shadow-lg overflow-hidden group">
                  <img
                    className="rounded-md h-44 object-cover transition-transform duration-300 transform scale-100 group-hover:scale-105"
                    src={paket.cover}
                    alt=""
                  />
                  <h1 className="text-white absolute ml-2 -mt-14 font-body font-bold text-xl">
                    {paket.nama_paket}
                  </h1>
                  <p className="absolute -mt-8 text-sm text-white ml-2 font-body font-semibold">
                    Mulai dari {paket.rentang_harga}
                  </p>
                  <div className="absolute bottom-0 right-0 w-full h-full flex flex-col justify-end bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex justify-end mr-2 mb-2">
                      <Link to={`DetailPaket/${paket.id}`} className="text-white text-3xl cursor-pointer">
                        <FiArrowRightCircle />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PaketWisata;
