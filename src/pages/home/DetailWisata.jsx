import React, { useRef, useState, useEffect } from "react";
import Navbar from "../../Components/Navbar";
import { Footer } from "../../Components/Footer";
import profil from "../../assets/profil1.png";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { FaRegStar, FaStar } from "react-icons/fa6";
import jwt_decode from "jwt-decode";
import {FaHeart, FaRegHeart } from "react-icons/fa";
import Swal from "sweetalert2";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";
import { FaLocationDot } from "react-icons/fa6";

const DetailWisata = () => {
  const [wisata, setWisata] = useState(null);
  const { id } = useParams();
  const [token, setToken] = useState("");
  const [expire, setExpire] = useState("");
  const [userId, setUserId] = useState("");
  const [liked, setLiked] = useState(false);
  const [bintang, setBintang] = useState(0);
  const [ulasan, setUlasan] = useState("");
  const [getReview, setGetUlasan] = useState([]);
  const sliderRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  const axiosJWT = axios.create();

  axiosJWT.interceptors.request.use(
    async (config) => {
      const currentDate = new Date();
      if (expire * 1000 < currentDate.getTime()) {
        try {
          const response = await axios.get("http://localhost:7000/token");
          config.headers.Authorization = `Bearer ${response.data.accessToken}`;
          setToken(response.data.accessToken);
          const decoded = jwt_decode(response.data.accessToken);
          setExpire(decoded.exp);
        } catch (error) {
          if (error.response) {
            navigate("/");
          }
        }
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  const getWisataById = async () => {
    try {
      const response = await axiosJWT.get(
        `http://localhost:7000/wisata/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data) {
        setWisata(response.data);
        setLiked(response.data.isLikedByUser);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleLike = async () => {
    try {
      const response = await axiosJWT.post(
        "http://localhost:7000/like",
        {
          userId: userId,
          wisataId: id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setLiked(response.data.isLikedByUser);
      console.log(response.data.msg);
    } catch (error) {
      console.error("Error in handleLike:", error.message);
    }
  };

  const saveUlasan = async (e) => {
    try {
      await axiosJWT.post(
        "http://localhost:7000/ulasan",
        {
          bintang: bintang,
          ulasan: ulasan,
          userId: userId,
          wisataId: id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      Swal.fire({
        icon: "success",
        title: "Berhasil Mengirim Ulasan!",
        showConfirmButton: false,
        timer: 2000,
      });
      setTimeout(() => {
        navigate(`Wisata/DetailWisata/${id}`);
        window.location.reload();
      }, 2000);
    } catch (error) {
      if (error.response) {
        const errorMessage = error.response.data.msg;
        if (error.response.status === 409) {
          Swal.fire({
            icon: "info",
            title: "Ulasan Sudah Dikirim!",
            text: errorMessage,
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Gagal Mengirim Ulasan!",
            text: errorMessage,
          });
        }
      } else {
        console.error("Unexpected error:", error);
        Swal.fire({
          icon: "error",
          title: "Gagal Mengirim Ulasan!",
          text: "Terjadi kesalahan",
        });
      }
    }
  };

  const getUlasan = async () => {
    try {
      const response = await axiosJWT.get(
        `http://localhost:7000/ulasan/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setGetUlasan(response.data);
    } catch (error) {
      console.error("Error fetching ulasan:", error);
    }
  };

  useEffect(() => {
    const refreshToken = async () => {
      try {
        const response = await axios.get("http://localhost:7000/token");
        setToken(response.data.accessToken);
        const decoded = jwt_decode(response.data.accessToken);
        setExpire(decoded.exp);
        setUserId(decoded.userId);
      } catch (error) {
        if (error.response) {
          navigate("/");
        }
      }
    };

    refreshToken();
    getWisataById();
    getUlasan();
    document.title = 'Detail Wisata';
  }, [id, navigate, token, userId]);

  const settings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    customPaging: function (i) {
      return (
        <div
          className={`w-2 h-2 mt-2 mx-2 rounded-full border border-[#3c87ca] ${
            currentSlide === i ? "bg-[#3c87ca]" : "bg-white"
          }`}
        ></div>
      );
    },
    beforeChange: (current, next) => setCurrentSlide(next),
  };

  const goToNextSlide = () => {
    sliderRef.current.slickNext();
  };

  const goToPrevSlide = () => {
    sliderRef.current.slickPrev();
  };

  const handleBintangChange = (value) => {
    setBintang((prevBintang) => (prevBintang === value ? 0 : value));
  };

  const toggleForm = () => {
    setShowForm(!showForm);
  };

  const toggleCloseForm = () => {
    setShowForm(false);
  };

  return (
    <>
      <Navbar/>
      {wisata && (
        <div className="relative max-md:mt-16 bg-[#FAFAFA]">
          <div className="relative">
            <div className="w-full h-auto md:h-screen">
              <img
                src={wisata.cover}
                alt="Parangtritis"
                className="w-full h-72 md:h-full object-cover"
              />
            </div>

            <div className="absolute gap-16 left-0 max-md:top-52 md:bottom-0 text-white pl-5 md:pl-10 pb-3">
              <h1 className=" animate__animated animate__fadeInUp animate__delay-200ms text-2xl md:text-4xl font-bold tracking-wide">
                {wisata.nama_tempat}
              </h1>
              <div className="flex ">
              <p className="animate__animated animate__fadeInUp animate__delay-200ms text-lg md:text-xl mt-2"><FaLocationDot/></p> <p className="animate__animated animate__fadeInUp animate__delay-200ms font-body md:text-lg font-light mt-2 ml-1">{wisata.kabupaten}</p>
              </div>
            </div>
            <div className="flex gap-4 right-0 max-md:top-60 md:bottom-0 pr-5 md:pr-10 pb-5 absolute text-white">
              <button
                onClick={handleLike}
                style={{
                  color: liked ? "white" : "white",
                  border: "none",
                  background: "none",
                }}
              >
                {liked ? <FaHeart size={30} /> : <FaRegHeart size={30} />}
              </button>
            </div>
          </div>
          <div className="flex  items-center justify-center">
            <div className="md:w-4/5 w-full pb-24 relative   text-body md:text-lg font-semibold  pt-5 px-5 md:px-10 h-auto rounded-2xl ">
              <section className="">
                <h1  className=" text-[#3c87ca] text-xl md:text-2xl font-body my-2 font-bold">
                  {wisata.nama_tempat}
                </h1>
                {Array.isArray(JSON.parse(wisata.deskLong))
                  ? JSON.parse(wisata.deskLong).map((paragraph, index) => (
                      <p
                        className="font-body font-normal text-sm md:text-base text-justify mb-10"
                        key={index}
                      >
                        {paragraph}
                      </p>
                    ))
                  : JSON.parse(wisata.deskLong)
                      .split("\n")
                      .map((paragraph, index) => (
                        <p
                          className="font-body  font-normal text-sm md:text-base text-justify mb-10"
                          key={index}
                        >
                          {paragraph}
                        </p>
                      ))}
              </section>
              <section data-aos="fade-up" data-aos-duration="1000" className="md:flex gap-10">
                <div className="w-full md:w-3/5">
                  <h1 className=" mt-5 text-[#3c87ca] text-xl md:text-2xl font-body my-2 font-bold">
                    Lokasi
                  </h1>
                  <div className="w-full h-72 border-2 p-2 rounded-md border-[#3c87ca]">
                    <iframe
                      className="w-full h-full"
                      src={wisata.link_maps}
                    ></iframe>
                  </div>
                </div>
                <div className="md:w-1/3 w-full">
                  <h1 className=" mt-5 text-[#3c87ca] text-xl md:text-2xl font-body my-2 font-bold">
                    Alamat
                  </h1>
                  <p className="font-body font-normal text-sm">{wisata.alamat}</p>
                </div>
              </section>
              <section data-aos="fade-up" data-aos-duration="1000">
                <h1 className=" mt-5 text-[#3c87ca] text-xl md:text-2xl font-body my-2 font-bold">
                  Harga
                </h1>
                {Array.isArray(JSON.parse(wisata.harga))
                  ? JSON.parse(wisata.harga).map((item, index) => (
                      <li className="font-body font-normal text-base" key={index}>
                        {item}
                      </li>
                    ))
                  : JSON.parse(wisata.harga)
                      .split("\n")
                      .map((item, index) => (
                        <li
                          className="font-body font-normal text-sm md:text-base leading-10"
                          key={index}
                        >
                          {item}
                        </li>
                      ))}
              </section>
              <div data-aos="fade-up" data-aos-duration="1000">
                <h1
                  id="foto"
                  className=" mt-5 text-[#3c87ca] text-xl md:text-2xl font-body my-2 font-bold"
                >
                  Foto
                </h1>
                <div className="justify-center items-center flex">
                  <div className="md:w-4/5 w-full px-2">
                    <div className="max-w-screen-xl object-cover mx-auto mt-4 md:mt-8 relative">
                      <Slider className="" ref={sliderRef} {...settings}>
                        {Array.isArray(JSON.parse(wisata.foto))
                          ? JSON.parse(wisata.foto).map((item, index) => (
                              <div key={index}>
                                <img
                                  src={item}
                                  alt={`Photo ${index}`}
                                  className="w-full h-full object-cover rounded-lg"
                                />
                              </div>
                            ))
                          : null}
                      </Slider>
                      <button
                        onClick={goToPrevSlide}
                        className="absolute max-md:hidden top-1/2 -left-12 shadow-lg transform -translate-y-1/2 hover:text-white text-4xl hover:bg-[#3c87ca] rounded-full text-[#3c87ca] bg-white focus:outline-none"
                      >
                        <BiChevronLeft />
                      </button>
                      <button
                        onClick={goToNextSlide}
                        className="absolute max-md:hidden top-1/2 -right-12 shadow-lg transform -translate-y-1/2 hover:text-white text-4xl hover:bg-[#3c87ca] rounded-full text-[#3c87ca] bg-white focus:outline-none"
                      >
                        <BiChevronRight />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div   className="mt-10">
                <div data-aos="fade-up" data-aos-duration="2000" className="flex justify-between">
                  <h1 className=" mt-5 text-[#3c87ca] text-xl md:text-2xl font-body my-2 font-bold">
                    Ulasan
                  </h1>
                  <button
                    onClick={toggleForm}
                    className=" text-sm px-3 float-right relative text-center hover:bg-[#3c87ca] hover:text-white cursor-pointer bg-transparent border border-[#3c87ca] font-body mt-10 py-1  text-black rounded-md inline-block"
                  >
                    Tulis Ulasan
                  </button>
                </div>

                <div data-aos="fade-up" data-aos-duration="2000" className="md:flex overflow-x-auto h-60 md:space-x-4 py-4 md:p-4">
                  {Array.isArray(getReview) &&
                    getReview.map((review, index) => (
                      <div
                        key={index}
                        className="w-full md:w-1/3 mb-5 h-44 flex-shrink-0 bg-white rounded-lg shadow-md"
                      >
                        <div className="flex">
                          <img
                            className="w-10 h-10 mt-3 mx-4 rounded-full"
                            src={review.user.foto || profil}
                            alt=""
                          />
                          <p className="text-md font-body pt-5">
                            {review.user && review.user.nama}
                          </p>
                        </div>
                        <div className="flex pl-4 pt-2 text-yellow-500">
                          {[...Array(5)].map((_, index) => (
                            <FaStar
                              key={index}
                              className={
                                index < review.bintang
                                  ? "text-yellow-500"
                                  : "text-gray-300"
                              }
                            />
                          ))}
                        </div>
                        <p className="text-xs font-body pt-2 px-4">
                          {review.ulasan}
                        </p>
                      </div>
                    ))}
                </div>

                {showForm && (
                  <form onSubmit={saveUlasan}>
                    <div className="fixed z-[1000] p-5 top-0 left-0 w-full h-screen bg-black bg-opacity-50 flex items-center justify-center">
                      <div className="md:w-2/5 w-full h-72 rounded-md shadow-md py-5 px-7 bg-white">
                        <h1 className="font-body">Ulasan</h1>
                        <div className="flex mt-5 gap-1 text-xl">
                          {[1, 2, 3, 4, 5].map((value) =>
                            value <= bintang ? (
                              <FaStar
                                key={value}
                                className="text-yellow-500"
                                onClick={() => handleBintangChange(value)}
                              />
                            ) : (
                              <FaRegStar
                                key={value}
                                className="text-gray-300"
                                onClick={() => handleBintangChange(value)}
                              />
                            )
                          )}
                        </div>
                        <div>
                          <textarea
                            id="ulasan"
                            value={ulasan}
                            onChange={(e) => setUlasan(e.target.value)}
                            className="w-full h-24 text-sm py-1 px-3 mt-5 mb-3 rounded-md border border-slate-300 focus:outline-none focus:border-[#3c87ca] focus:ring-1 focus:ring-[#3c87ca] font-body placeholder-top transition-transform duration-300 ease-out focus:placeholder-translate-y-full"
                          />
                        </div>
                        <div className="flex gap-3 float-right">
                          <button
                            className="bg-[#3c87ca] float-right text-sm font-body text-white px-6 py-2 rounded-md mt-4"
                            onClick={toggleCloseForm}
                          >
                            Batal
                          </button>
                          <button
                            className="bg-[#3c87ca] float-right text-sm font-body text-white px-6 py-2 rounded-md mt-4"
                            type="submit"
                          >
                            Kirim Ulasan
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </>
  );
};

export default DetailWisata;
