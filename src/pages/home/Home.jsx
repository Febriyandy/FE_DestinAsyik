import React, { useState, useEffect } from "react";
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
import mockup from "../../assets/images/mockup.png";
import { Link } from "react-router-dom";
import Logo from "../../assets/images/Logo2.png";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { Footer } from "../../Components/Footer";
import { IoMenuSharp } from "react-icons/io5";
import { BiX } from "react-icons/bi";

const Home = () => {
  const navigate = useNavigate();
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [no_hp, setNo_hp] = useState("");
  const [perusahaan, setPerusahaan] = useState("");
  const [pesan, setPesan] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen(!menuOpen);

  const saveData = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("nama", nama);
      formData.append("email", email);
      formData.append("no_hp", no_hp);
      formData.append("perusahaan", perusahaan);
      formData.append("pesan", pesan);

      await axios.post("http://localhost:7000/kontak", formData);
      Swal.fire({
        icon: "success",
        title: "Pesan Terkirim!",
        showConfirmButton: false,
        timer: 2000,
      });

      setTimeout(() => {
        navigate("/home");
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error("Error adding data:", error);

      Swal.fire({
        icon: "error",
        title: "Gagal Mengirim Pesan!",
        text: "Terjadi kesalahan dalam mengirim pesan.",
      });
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

  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset >= 0 && offset < 600) {
        setActiveSection("home");
      } else if (offset >= 600 && offset < 1200) {
        setActiveSection("about");
      } else if (offset >= 1200 && offset < 1800) {
        setActiveSection("kontak");
      }
    };

    document.title = "DestinAsyik";
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  });

  

  return (
    <>
      <nav className="md:hidden w-full h-16 fixed z-[1000] flex hover:text-black backdrop-blur-md">
        <div className="flex items-center justify-between w-full">
          <div className="ml-5">
            <img className="w-32" src={logo} alt="" />
          </div>
          <div className="mr-6">
            <button className="text-2xl justify-end" onClick={toggleMenu}>
             {menuOpen ? <BiX /> : < IoMenuSharp/> } 
            </button>
          </div>
        </div>
      </nav>
      {menuOpen && (
        <div className="w-full h-auto bg-white  fixed z-[1000] mt-16">
      <a href="#home">
        <div className="w-full text-[#3c87ca] font-body text-sm border-y border-[#3c87ca] py-5 px-10">
          Beranda
        </div>
      </a>
      <a href="#about">
        <div className="w-full text-[#3c87ca] font-body text-sm border-b border-[#3c87ca] py-5 px-10">
          Tentang Kami
        </div>
      </a>
      <a href="#kontak">
        <div className="w-full text-[#3c87ca] font-body text-sm border-b border-[#3c87ca] py-5 px-10">
          Kontak
        </div>
      </a>
      </div>
      )}
      
      <nav className="max-md:hidden animate__animated  animate__fadeInDown h-16 w-full flex fixed z-[1000] hover:text-black backdrop-blur-md">
        <div className="flex items-center">
          <img
            className="w-44 ml-10 justify-center items-center"
            src={logo}
            alt=""
          />
        </div>
        <div className="flex flex-grow justify-end items-center gap-6 pr-10">
          <a
            className={`hover:text-white  font-body  py-1 rounded-md after:border-b-[#122a3f] ${
              activeSection === "home" ? "text-[#3c87ca] font-body" : ""
            }`}
            href="#home"
          >
            Beranda
          </a>
          <a
            className={`hover:text-white font-body  py-1 rounded-md focus:border-b-[#122a3f] ${
              activeSection === "about" ? "text-[#3c87ca] font-body" : ""
            }`}
            href="#about"
          >
            Tentang Kami
          </a>
          <a
            className={`hover:text-white font-body  py-1 rounded-md focus:border-b-[#122a3f] ${
              activeSection === "kontak" ? "text-[#3c87ca] font-body" : ""
            }`}
            href="#kontak"
          >
            Kontak
          </a>
        </div>
      </nav>
      <section
        id="home"
        className="w-full h-96 md:h-screen bg-gradient-to-r from-[#B1CFEA] to-[#0d1d2b]"
      >
        <Slider {...settings}>
          <div>
            <img
              className="opacity-80 h-96 w-full md:h-screen object-cover"
              src={foto1}
              alt=""
            />
          </div>
          <div>
            <img
              className="opacity-80 h-96 w-full md:h-screen object-cover"
              src={foto2}
              alt=""
            />
          </div>
          <div>
            <img
              className="opacity-80 h-96 w-full md:h-screen object-cover"
              src={foto3}
              alt=""
            />
          </div>
          <div>
            <img
              className="opacity-80 h-96 w-full md:h-screen object-cover"
              src={foto4}
              alt=""
            />
          </div>
          <div>
            <img
              className="opacity-80 h-96 w-full md:h-screen object-cover"
              src={foto5}
              alt=""
            />
          </div>
          <div>
            <img
              className="opacity-80 h-96 w-full md:h-screen object-cover"
              src={foto6}
              alt=""
            />
          </div>
          <div>
            <img
              className="opacity-80 h-96 w-full md:h-screen object-cover"
              src={foto7}
              alt=""
            />
          </div>
        </Slider>
        <div className="absolute flex w-full top-40 md:top-60 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white pl-10 pb-32">
          <h1 className="animate__animated animate__fadeIn animate__delay-200ms text-xl absolute  md:text-5xl  font-body leading-tight md:pl-10 font-extrabold text-white">
            BINGUNG MAU KEMANA?
            <br />
            DESTINASYIK SOLUSINYA
          </h1>
        </div>
        <div className="absolute flex w-full top-60 md:top-96 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white pl-10 pb-28">
          <p className="animate__animated  animate__fadeInUp absolute text-xl md:text-2xl font-body leading-tight md:leading-normal md:pl-10 font-extrabold text-white">
            Solusi Perjalanan Yang Menyenangkan
            <br />
            Easy Way To Find And Go
          </p>
        </div>
        <div className="flex absolute  w-full md:mt-5  gap-5 top-1/2 -mt-10  left-1/2 md:top-3/4 md:left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white md:pl-20 pl-8">
          <Link
            to={"daftar"}
            className="animate__animated ml-2 animate__fadeInUp bg-[#3c87ca] hover:bg-[#3373ac] text-sm md:text-base py-2 px-5 rounded-md text-white font-body"
          >
            Daftar Sekarang
          </Link>
          <Link
            to={"login"}
            className="animate__animated  animate__fadeInUp border-2 border-white hover:bg-[#3373ac] text-sm md:text-base py-2 px-5 rounded-md hover:text-white text-white font-body"
          >
            Masuk
          </Link>
        </div>
      </section>
      <section
        id="about"
        className="w-full flex p-5 md:p-20 md:h-screen justify-center items-center bg-[#FAFAFA]"
      >
        <div
          data-aos="fade-up"
          className="w-full h-full flex bg-white rounded-md shadow-lg p-10"
        >
          <div className="md:w-1/2 w-full">
            <h1
              data-aos="fade-up"
              data-aos-duration="1000"
              className="font-body w-full font-bold  md:pt-10 text-lg md:text-2xl text-[#3c87ca]"
            >
              Tentang DestinAsyik
            </h1>
            <p
              data-aos="fade-up"
              data-aos-duration="1500"
              className="font-body text-sm md:text-base pt-5"
            >
              DestinAsyik merupakan sebuah website yang bertujuan menyediakan
              informasi terkini, promosi tempat-tempat menarik, rekomendasi
              lengkap untuk tempat wisata, nongkrong, tempat makan dan minum,
              serta menyediakan paket wisata perjalanan untuk anda yang ingin
              mengunjungi Yogyakarta.
            </p>
            <p
              data-aos="fade-up"
              data-aos-duration="1500"
              className="font-body text-sm md:text-xl font-bold pt-5 md:pt-10"
            >
              Tunggu apalagi segera rencanakan <br /> perjalanan anda bersama
              DestinAsyik
            </p>
          </div>
          <div className="w-1/2 max-md:hidden">
            <img
              data-aos="zoom-in"
              data-aos-duration="3000"
              className="w-4/5 mx-auto mt-10 max-md:hidden"
              src={mockup}
              alt=""
            />
          </div>
        </div>
      </section>
      <section
        id="kontak"
        className="w-full p-5 md:h-screen bg-[#ecf3fa] flex items-center justify-center"
      >
        <div
          data-aos="fade-up"
          className="w-full md:w-4/5 h-4/5 md:flex bg-white rounded-xl shadow-lg"
        >
          <div className="md:w-1/2 relative flex flex-col">
            <img
              data-aos="zoom-in"
              data-aos-duration="2000"
              className="w-44 md:w-56 mx-auto md:mt-10"
              src={Logo}
              alt="Logo"
            />
            <p
              data-aos="fade-up"
              data-aos-duration="1000"
              className="text-center text-sm md:text-lg font-body md:mt-4 px-10"
            >
              Tempat terbaik untuk menemukan rekomendasi pariwisata dan tempat
              nongkrong! Jika Anda memiliki pertanyaan, masukan, atau ingin
              berkolaborasi, kami siap membantu.
            </p>
          </div>
          <div
            data-aos="fade-up"
            data-aos-duration="1000"
            className="md:w-1/2 mt-10 flex flex-col  items-center"
          >
            <form onSubmit={saveData} className="w-4/5">
              <input
                type="text"
                id="nama"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                placeholder="Nama"
                className="w-full py-1 px-3 mb-3 rounded-lg border border-slate-300 focus:outline-none focus:border-[#3c87ca] focus:ring-1 focus:ring-[#3c87ca] font-body"
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                id="email"
                placeholder="Email"
                className="w-full py-1 px-3 mb-3 rounded-lg border border-slate-300 focus:outline-none focus:border-[#3c87ca] focus:ring-1 focus:ring-[#3c87ca] font-body"
              />
              <input
                type="tel"
                value={no_hp}
                onChange={(e) => setNo_hp(e.target.value)}
                id="telepon"
                placeholder="No Telepon"
                className="w-full py-1 px-3 mb-3 rounded-lg border border-slate-300 focus:outline-none focus:border-[#3c87ca] focus:ring-1 focus:ring-[#3c87ca] font-body"
              />
              <input
                type="text"
                value={perusahaan}
                onChange={(e) => setPerusahaan(e.target.value)}
                id="perusahaan"
                placeholder="Perusahaan (Opsional)"
                className="w-full py-1 px-3 mb-3 rounded-lg border border-slate-300 focus:outline-none focus:border-[#3c87ca] focus:ring-1 focus:ring-[#3c87ca] font-body"
              />
              <textarea
                id="pesan"
                value={pesan}
                onChange={(e) => setPesan(e.target.value)}
                placeholder="Pesan"
                className="w-full h-32 py-1 px-3 mb-3 rounded-lg border border-slate-300 focus:outline-none focus:border-[#3c87ca] focus:ring-1 focus:ring-[#3c87ca] font-body placeholder-top transition-transform duration-300 ease-out focus:placeholder-translate-y-full"
              />
              <div className="mt-2 mb-5 flex justify-center">
                <a href="">
                  <button
                    type="submit"
                    className="font-body py-1 px-7 mx-auto rounded-md text-white hover:bg-[#3373ac] bg-[#3c87ca]"
                  >
                    Kirim
                  </button>
                </a>
              </div>
            </form>
          </div>
        </div>
      </section>
      <Footer/>
    </>
  );
};

export default Home;
