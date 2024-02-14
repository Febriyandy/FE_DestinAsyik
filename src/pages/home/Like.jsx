import React, { useState, useEffect } from "react";
import Navbar2 from "../../Components/Navbar2";
import Navbar from "../../Components/Navbar";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import jwt_decode from "jwt-decode";

const Like = () => {
  const [token, setToken] = useState("");
  const [expire, setExpire] = useState("");
  const [like, setLike] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    refreshToken();
    document.title = 'Suka';
  }, []);

  const refreshToken = async () => {
    try {
      const response = await axios.get("http://localhost:7000/token");
      setToken(response.data.accessToken);
      const decoded = jwt_decode(response.data.accessToken);
      setExpire(decoded.exp);
      getLike(decoded.userId); // Panggil getLike dengan userId yang sudah didapatkan dari token
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

  const getLike = async (userId) => {
    try {
      const response = await axiosJWT.get(
        `http://localhost:7000/like/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setLike(response.data);
    } catch (error) {
      console.error("Error fetching like data:", error);
    }
  };

  return (
    <>
    <Navbar />
      <Navbar2 />
      <div className="md:ml-60 mt-16 flex   justify-center h-auto pb-10 bg-[#FAFAFA]">
        <div className="md:grid grid-cols-3  justify-center gap-16 mt-5">
          {like.map((like) => (
            <div
              key={like.id}
              className="w-64 my-5 h-auto pb-5 bg-white rounded-md shadow-md"
            >
              <img
                className="w-64 h-40 object-cover rounded-t-md"
                src={like.dataWisatum.cover}
                alt="cover"
              />
              <h1 className="font-body font-bold px-5 py-2 text-lg">
                {like.dataWisatum.nama_tempat}
              </h1>
              <p className="font-body h-28 px-5 text-sm">
                {like.dataWisatum.deskShort.split(" ").slice(0, 15).join(" ")}...
              </p>
              <div className="flex -mt-3 px-5  justify-between">
                <Link
                  to={`/Wisata/DetailWisata/${like.dataWisatum.id}`}
                  className="px-3 py-2 mr-5 font-body rounded-md border border-[#3c87ca] shadow-md text-xs text-[#3c87ca] "
                >
                  Lihat Selengkapnya
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Like;
