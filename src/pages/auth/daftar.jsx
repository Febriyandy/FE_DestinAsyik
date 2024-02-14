import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { FaEye, FaEyeSlash } from "react-icons/fa";
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
import logo from "../../assets/images/Logo1.png";

const Daftar = () => {
  const navigate = useNavigate();
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confPassword, setconfPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };
  const handleconfPasswordChange = (e) => {
    setconfPassword(e.target.value);
  };

  const Register = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("nama", nama);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("confPassword", confPassword);

      await axios.post("http://localhost:7000/register", formData);

      Swal.fire({
        icon: "success",
        title: "Pendaftaran Berhasil!",
        showConfirmButton: false,
        timer: 2000,
      });

      setTimeout(() => {
        navigate("/Login");
        window.location.reload();
      }, 2000);
    } catch (error) {
      if (error.response) {
        const errorMessage = error.response.data.msg;
        setMsg(errorMessage);

        Swal.fire({
          icon: "error",
          title: "Gagal Mendaftar!",
          text: errorMessage,
        });
      } else {
        console.error("Unexpected error:", error);

        Swal.fire({
          icon: "error",
          title: "Gagal Mendaftar!",
          text: "Terjadi kesalahan",
        });
      }
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

  useEffect (() => {
    document.title = 'Daftar';
  });

  return (
    <section id="home" className="w-full h-screen  bg-white md:flex" >
     <div className="w-full p-10 md:w-1/2 flex md:h-screen bg-white">
     <div className="flex gap-x-80 items-center mx-auto">
     <div className="md:w-96">
     <img src={logo} className="w-52 mb-10 mx-auto md:hidden" alt="" />
          <h1 className="animate__animated animate__fadeIn text-[#3c87ca] md:mt-32 font-body text-center font-bold text-xl md:text-3xl">
            Daftar Sekarang
          </h1>
          <p className="animate__animated animate__fadeInUp text-black font-body text-center font-normal">
            Masukkan data di bawah untuk daftar DestinAsyik
          </p>
          <form className="animate__animated animate__fadeInUp" onSubmit={Register}>
            <div className="mb-4 mt-4">
              <input
                type="text"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                placeholder="Masukkan Nama"
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-md  placeholder-slate-400
                focus:outline-none focus:border-[#3c87ca] focus:ring-1 focus:ring-[#3c87ca]"
              />
            </div>
            <div className="mb-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Masukkan email"
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-md  placeholder-slate-400
                focus:outline-none focus:border-[#3c87ca] focus:ring-1 focus:ring-[#3c87ca]"
              />
            </div>
            <div className="mb-4">
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={handlePasswordChange}
                  placeholder="Password"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-md  placeholder-slate-400
        focus:outline-none focus:border-[#3c87ca] focus:ring-1 focus:ring-[#3c87ca]"
                />
                <span
                  className="text-gray-400 absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>
            <div className="mb-4">
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={confPassword}
                  onChange={handleconfPasswordChange}
                  placeholder="Konfirmasi Password"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-md  placeholder-slate-400
        focus:outline-none focus:border-[#3c87ca] focus:ring-1 focus:ring-[#3c87ca]"
                />
                <span
                  className="text-gray-400 absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>
            <button
              type="submit"
              className="w-full px-3 py-2 font-body my-3 bg-[#3c87ca] text-white font-semibold rounded-full hover:bg-sky-800"
            >
              Daftar
            </button>
            <p className="font-body text-black text-center pt-3 mb-16">
              Sudah punya akun?
              <a href="/Login" className="text-[#3c87ca]">
                {" "}
                Masuk sekarang
              </a>
            </p>
          </form>
        </div>
        </div>
     </div>
     <div className="max-md:hidden animate__animated animate__fadeIn animate__delay-200ms w-1/2 h-screen bg-white">
     <Slider {...settings}>
      <div>
        <img className=" w-full  h-screen object-cover" src={foto1} alt="" />
      </div>
      <div>
        <img className=" w-full h-screen object-cover" src={foto2} alt="" />
      </div>
      <div>
        <img className=" w-full h-screen object-cover" src={foto3} alt="" />
      </div>
      <div>
        <img className=" w-full h-screen object-cover" src={foto4} alt="" />
      </div>
      <div>
      <img className=" w-full h-screen object-cover" src={foto5} alt="" />
    </div>
    <div>
      <img className=" w-full h-screen object-cover" src={foto6} alt="" />
    </div>
    <div>
      <img className=" w-full h-screen object-cover" src={foto7} alt="" />
    </div>
    </Slider>
    <div className="w-1/2 h-screen bg-black absolute top-0 opacity-40">

    </div>
     </div>
    </section>
  )
}

export default Daftar;