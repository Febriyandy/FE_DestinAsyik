import React, { useState, useEffect, useRef } from "react";
import Navbar from "../../Components/Navbar";
import { Footer } from "../../Components/Footer";
import { IoSearch } from "react-icons/io5";
import axios from "axios";
import jwt_decode from "jwt-decode";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import foto1 from "../../assets/images/dasboard2.jpg";
import foto2 from "../../assets/images/dasboard6.jpg";
import foto3 from "../../assets/images/dasboard3.jpeg";
import foto4 from "../../assets/images/dasboard4.png";
import foto5 from "../../assets/images/dasboard1.jpg";
import foto6 from "../../assets/images/dasboard5.jpg";
import foto7 from "../../assets/images/dashboard.jpg";
import { Link, useNavigate } from "react-router-dom";
import { IoMdShareAlt } from "react-icons/io";

const Home = () => {
  const [wisata, setWisata] = useState([]);
  const [token, setToken] = useState("");
  const [expire, setExpire] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();
  const searchResultsRef = useRef(null);

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
    getWisata();
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

  const getWisata = async () => {
    try {
      const response = await axiosJWT.get("http://localhost:7000/wisata", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setWisata(response.data);
    } catch (error) {
      console.error("Error fetching wisata data:", error);
    }
  };

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    fade: "linear",
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
    cssEase: "linear",
  };

  const handleSearch = () => {
    const filteredWisata = wisata.filter(
      (item) =>
        item.nama_tempat.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.alamat.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSearchResults(filteredWisata);

    if (searchResultsRef.current) {
      searchResultsRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <>
      <Navbar/>
      <div className="relative mt-16 bg-[#FAFAFA] pb-10">
        <section
          id="home"
          className="md:w-full h-96 md:h-screen  bg-gradient-to-r from-[#B1CFEA] to-[#0d1d2b]"
        >
           <Slider {...settings}>
            <div>
              <img className="opacity-80 w-full h-96 md:h-screen object-cover" src={foto1} alt="" />
            </div>
            <div>
              <img className="opacity-80 w-full h-96 md:h-screen object-cover" src={foto2} alt="" />
            </div>
            <div>
              <img className="opacity-80 w-full h-96 md:h-screen object-cover" src={foto3} alt="" />
            </div>
            <div>
              <img className="opacity-80 w-full h-96 md:h-screen object-cover" src={foto4} alt="" />
            </div>
            <div>
            <img className="opacity-80 w-full h-96 md:h-screen object-cover" src={foto5} alt="" />
          </div>
          <div>
            <img className="opacity-80 w-full h-96 md:h-screen object-cover" src={foto6} alt="" />
          </div>
          <div>
            <img className="opacity-80 w-full h-96 md:h-screen object-cover" src={foto7} alt="" />
          </div>
          </Slider>
          <div className="absolute flex w-full  h-44 justify-center top-12 md:top-40  text-white">
            <h1 className="animate__animated  animate__fadeIn animate__delay-300ms text-lg md:text-4xl font-body leading-tight font-bold text-white">
              SELAMAT DATANG DI DESTINASYIK
            </h1>
            <p className="animate__animated  animate__fadeIn animate__delay-300ms absolute md:text-2xl font-body mt-6 md:mt-12 leading-normal font-bold text-white">
              Easy Way To Find And Go
            </p>
            <div className="absolute md:w-1/2 w-full px-5 mt-20 md:mt-28 flex">
              <input
                type="text"
                placeholder="Search..."
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full h-12  md:h-14 text-sm rounded-md border-slate-300 md:text-lg font-body pl-4 shadow-md placeholder-white
                focus:outline-none focus:border-[#3c87ca] focus:ring-1 focus:ring-[#3c87ca]
                backdrop-filter backdrop-blur-sm bg-opacity-50 bg-transparent"
              />
              <button
                className="text-xl md:text-2xl -ml-10 relative hover:text-[#3c87ca]"
                onClick={handleSearch}
              >
                <IoSearch />
              </button>
            </div>
            <div className="absolute w-full px-5 md:w-1/2 h-24 mt-40 md:mt-44 ">
              <h1 className="animate__animated  animate__fadeInUp animate__delay-300ms font-body text-center">Filter Berdasarkan Kabupaten/Kota di Kepulauan Riau</h1>
              <div className="animate__animated  animate__fadeInUp animate__delay-300ms flex overflow-x-auto scrollbar-hide mt-10 md:mt-3 space-x-2  gap-2">
                <Link className="font-body transition duration-300 ease-in-out flex-shrink-0 py-2 px-4 text-black rounded-md font-semibold hover:bg-[#3c87ca] hover:text-white shadow-md bg-white">Tanjungpinang</Link>
                <Link className="font-body transition duration-300 ease-in-out flex-shrink-0 py-2 px-4 text-black rounded-md font-semibold hover:bg-[#3c87ca] hover:text-white shadow-md bg-white">Bintan</Link>
                <Link className="font-body transition duration-300 ease-in-out flex-shrink-0 py-2 px-4 text-black rounded-md font-semibold hover:bg-[#3c87ca] hover:text-white shadow-md bg-white">Batam</Link>
                <Link className="font-body transition duration-300 ease-in-out flex-shrink-0 py-2 px-4 text-black rounded-md font-semibold hover:bg-[#3c87ca] hover:text-white shadow-md bg-white">Natuna</Link>
                <Link className="font-body transition duration-300 ease-in-out flex-shrink-0 py-2 px-4 text-black rounded-md font-semibold hover:bg-[#3c87ca] hover:text-white shadow-md bg-white">Kepulauan Anambas</Link>
                <Link className="font-body transition duration-300 ease-in-out flex-shrink-0 py-2 px-4 text-black rounded-md font-semibold hover:bg-[#3c87ca] hover:text-white shadow-md bg-white">Lingga</Link>
                <Link className="font-body transition duration-300 ease-in-out flex-shrink-0 py-2 px-4 text-black rounded-md font-semibold hover:bg-[#3c87ca] hover:text-white shadow-md bg-white">Karimun</Link>
              </div>
            </div>
          </div>
        </section>
        <section ref={searchResultsRef}>
          <div className="flex mt-10 justify-center">
            <div data-aos="fade-up" data-aos-duration="1000" className="md:grid grid-cols-4 gap-10">
              {searchResults.length > 0
                ? searchResults.map((wisata) => (
                    <div key={wisata.id}  className="w-64 h-96  bg-white rounded-md shadow-md">
                      <img
                        className="w-64 h-40 object-cover rounded-t-md"
                        src={wisata.cover}
                        alt="cover"
                      />
                      <h1 className="font-body font-bold px-5 py-2 text-lg">
                        {wisata.nama_tempat}
                      </h1>
                      <p className="font-body w-full h-28 px-5 text-sm">
                        {wisata.deskShort.split(" ").slice(0,15).join(" ")}...
                      </p>
                      <div className="flex mt-3 justify-between ">
                        <button className=" bg-[#3c87ca] rounded-full ml-5 p-2 text-xl justify-center text-white">
                          <IoMdShareAlt />
                        </button>
                        <Link
                          to={`DetailWisata/${wisata.id}`}
                          className="px-3 py-2 mr-5 font-body rounded-md border border-[#3c87ca] shadow-md text-xs text-[#3c87ca] "
                        >
                          Lihat Selengkapnya
                        </Link>
                      </div>
                    </div>
                  ))
                : wisata.map((wisata) => (
                    <div key={wisata.id} className="w-64 h-auto my-5 pb-5 bg-white rounded-md shadow-md">
                      <img
                        className="w-64 h-40 object-cover rounded-t-md"
                        src={wisata.cover}
                        alt="cover"
                      />
                      <h1 className="font-body font-bold px-5 py-2 text-lg">
                        {wisata.nama_tempat}
                      </h1>
                      <p className="font-body w-full h-28 px-5 text-sm">
                        {wisata.deskShort.split(" ").slice(0, 15).join(" ")}...
                      </p>
                      <div className="flex -mt-3 px-5  justify-between ">
                        <Link
                          to={`DetailWisata/${wisata.id}`}
                          className="px-3 py-2 mr-5 font-body rounded-md border border-[#3c87ca]  text-xs text-[#3c87ca] "
                        >
                          Lihat Selengkapnya
                        </Link>
                      </div>
                    </div>
                  ))}
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default Home;


