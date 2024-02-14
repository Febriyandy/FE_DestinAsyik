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

const login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const Auth = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);
    
      const response = await axios.post("http://localhost:7000/login", formData);
    
      if (response.data.role === "user") {
        navigate("/Landingpage");
      } else if (response.data.role === "admin") {
        navigate("/Admin");
      } 
        Swal.fire({
          icon: "success",  // Corrected this line
          title: "Login Berhasil!",
          showConfirmButton: false,
          timer: 2000,
        });
        setTimeout(() => {
          window.location.reload();
        }, 2000);
    } catch (error) {
      if (error.response){
        const errorMessage = error.response.data.msg;
        setMsg(errorMessage);
    
        Swal.fire({
          icon: "error",
          title: "Gagal Masuk!",
          text: errorMessage, 
        });
      }else {
        console.error("Unexpected error:", error);
    
        Swal.fire({
          icon: "error",
          title: "Gagal Masuk!",
          text: "Terjadi kesalahan",
        });
    }
  }
  };

  useEffect (() => {
    document.title = 'Login';
  });

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

  return (
    <section id="home" className="w-full md:h-screen  bg-white md:flex" >
     <div className="w-full p-10 md:w-1/2 flex md:h-screen bg-white">
     <div className="flex gap-x-80 items-center mx-auto">
        <div className="md:w-96">
          <img src={logo} className="w-52 mb-10 mx-auto md:hidden" alt="" />
          <h1 className="animate__animated animate__fadeIn text-[#3c87ca] font-body text-center font-bold text-xl md:text-3xl">
            Login
          </h1>
          <p className="animate__animated animate__fadeInUp text-black font-body text-center font-normal">
            <br />
            Masukkan email dan password untuk autentikasi
          </p>
          <form className="animate__animated animate__fadeInUp" onSubmit={Auth}>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block mt-5 mb-2 font-body font-normal text-black"
              >
                Email
              </label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Masukkan email"
                className="w-full px-3 py-2  border border-slate-300 rounded-md text-md  placeholder-slate-400
                focus:outline-none focus:border-[#3c87ca] focus:ring-1 focus:ring-[#3c87ca]"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="password"
                className="block mb-2 font-body font-normal text-black"
              >
                Password
              </label>
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
            <a
              href="/Lupa"
              className="font-body py-2 text-[#3c87ca] float-right"
            >
              Lupa Password?
            </a>
            <button
              type="submit"
              className="w-full p-3 font-body my-3 bg-[#3c87ca] text-white font-semibold rounded-full hover:bg-sky-800"
            >
            Masuk
            </button>
            <p className="font-body text-black text-center pt-3">
              Belum punya akun?
              <a href="/Daftar" className="text-[#3c87ca]">
                {" "}
                Buat akun
              </a>
            </p>
          </form>
        </div>
        </div>
     </div>
     <div className="animate__animated animate__fadeIn animate__delay-200ms max-md:hidden md:w-1/2 h-screen bg-white">
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

export default login