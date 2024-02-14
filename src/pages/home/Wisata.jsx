import React, { useState, useEffect } from "react";
import Navbar from "../../Components/Navbar";
import { Footer } from "../../Components/Footer";
import { IoSearch } from "react-icons/io5";
import { FaHome } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { IoMdShareAlt } from "react-icons/io";

const Wisata = () => {
  const [wisata, setWisata] = useState([]);
  const [token, setToken] = useState("");
  const [expire, setExpire] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    getWisata();
    refreshToken();
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

  

  return (
    <>
      <Navbar />
      <div className="relative mt-16 bg-[#FAFAFA] pb-10">
        <div className="flex">
          <div class="flex font-body ml-28 mt-10 font-bold mb-10 ">
            <Link
              to={"/Landingpage"}
              class="px-4 py-1 text-xl pt-1.5 shadow-lg  bg-white rounded-s-full hover:bg-[#3c87ca] hover:text-white text-[#3c87ca]"
            >
              {" "}
              <FaHome />{" "}
            </Link>
            <a href="">
              <button class="px-4 py-1 shadow-lg bg-[#3c87ca] text-white">
                Wisata
              </button>
            </a>
            <Link
              to={"/NonWisata"}
              class="px-4 py-1  shadow-lg rounded-e-full bg-white hover:bg-[#3c87ca] hover:text-white text-black"
            >
              Non-Wisata
            </Link>
          </div>
          <div className=" mt-10 flex right-0 mr-24 absolute rounded-2xl border-2 ">
            <input
              className="pl-5 p-1 w-64  shadow-md outline-[#3c87ca]  rounded-2xl text-md placeholder-slate-400"
              type="text"
              placeholder="Search..."
            />
            <a
              className="absolute text-2xl pt-1 ml-56 hover:text-[#3c87ca]"
              href="#"
            >
              <IoSearch />
            </a>
          </div>
        </div>
        <div className="flex justify-center">
          <div className="grid grid-cols-4 gap-10">
            {wisata.map((wisata) => (
              <div
                key={wisata.id}
                className="w-64 h-96 bg-white rounded-md shadow-md"
              >
                <img
                  className="w-64 h-40 object-cover rounded-t-md"
                  src={wisata.cover}
                  alt="cover"
                />
                <h1 className="font-body font-bold px-5 py-2 text-lg">
                  {wisata.nama_tempat}
                </h1>
                <p className="font-body w-full h-28 px-5 text-sm">
                  {wisata.deskLong.split(" ").slice(0, 16).join(" ")}...
                </p>
                <div className="flex justify-between ">
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
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Wisata;
