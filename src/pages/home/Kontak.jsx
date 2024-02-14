import React, { useState, useEffect } from "react";
import Logo from "../../assets/Logo.png";
import Navbar from "../../Components/Navbar";
import { Footer } from "../../Components/Footer";
import axios from "axios";
import jwt_decode from "jwt-decode";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const Kontak = () => {
  const navigate = useNavigate();
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [no_hp, setNo_hp] = useState("");
  const [perusahaan, setPerusahaan] = useState("");
  const [pesan, setPesan] = useState("");
  const [token, setToken] = useState("");
  const [expire, setExpire] = useState("");
  const [msg, setMsg] = useState("");

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
    document.title = 'Kontak';
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

  const saveData = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("nama", nama);
      formData.append("email", email);
      formData.append("no_hp", no_hp);
      formData.append("perusahaan", perusahaan);
      formData.append("pesan", pesan);

      await axiosJWT.post(`http://localhost:7000/kontak`, formData, {
        headers: {
          "Content-type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      Swal.fire({
        icon: "success",
        title: "Pesan Terkirim!",
        showConfirmButton: false,
        timer: 2000,
      });

      setTimeout(() => {
        navigate("/Kontak");
        window.location.reload();
      }, 2000);
    } catch (error) {
      if (error.response) {
        const errorMessage = error.response.data.msg;
        setMsg(errorMessage);

        Swal.fire({
          icon: "error",
          title: "Gagal Mengirim Pesan!",
          text: errorMessage,
        });
      } else {
        console.error("Unexpected error:", error);

        Swal.fire({
          icon: "error",
          title: "Gagal Mengirim Pesan!",
          text: "Terjadi kesalahan",
        });
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex mt-16 items-center p-5 justify-center h-screen bg-[#FAFAFA]">
        <div className="md:w-4/5 w-full  h-auto p-5 md:h-4/5 md:flex bg-white rounded-xl shadow-lg">
          <div className="md:w-1/2 w-full relative">
            <img className="animate__animated animate__fadeIn animate__delay-300ms w-32 md:w-56 md:mt-10 mx-auto" src={Logo} alt="Logo" />
            <p className="text-center text-sm md:text-lg font-body mt-4 md:px-10">
              Tempat terbaik untuk menemukan rekomendasi pariwisata dan tempat
              nongkrong! Jika Anda memiliki pertanyaan, masukan, atau ingin
              berkolaborasi, kami siap membantu.
            </p>
          </div>
          <div className="md:w-1/2 w-full mt-10 flex flex-col  items-center">
            <form onSubmit={saveData} className="md:w-4/5">
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
              <div className="mt-2 flex justify-center">
                  <button
                    type="submit"
                    className="font-body py-1 px-7 rounded-md text-white hover:bg-[#3373ac] bg-[#3c87ca]"
                  >
                    Kirim
                  </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Kontak;
