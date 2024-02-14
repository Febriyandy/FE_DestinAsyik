import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import jwt_decode from "jwt-decode";
import { useParams, useNavigate } from "react-router-dom";
import NavbarAdmin from "../../Components/NavbarAdmin";

const TambahDataWisata = () => {
  const [token, setToken] = useState("");
  const [expire, setExpire] = useState("");
  const [nama_paket, setNama_paket] = useState("");
  const [lama_kegiatan, setLama_kegiatan] = useState("");
  const [rentang_harga, setRentang_harga] = useState("");
  const [destinasi, setDestinasi] = useState("");
  const [rangkaian_kegiatan, setRangkaian_kegiatan] = useState("");
  const [fasilitas, setFasilitas] = useState("");
  const [biaya, setBiaya] = useState("");
  const [cover, setCover] = useState("");
  const [preview, setPreview] = useState("");
  const [msg, setMsg] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();

  const loadImage = (e) => {
    const image = e.target.files[0];
    setCover(image);
    setPreview(URL.createObjectURL(image));
  };

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
    getPaketById();
  }, []);

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
          console.error("Error refreshing token:", error);
          navigate("/");
        }
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  const getPaketById = async () => {
    try {
      const response = await axiosJWT.get(`http://localhost:7000/paket/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data) {
        const data = response.data;
        const destinasiText = parseAndReplaceNewlines(data.destinasi || "");
        const rangkaianKegiatanText = parseAndReplaceNewlines(data.rangkaian_kegiatan || ""
        );
        const fasilitasText = parseAndReplaceNewlines(data.fasilitas || "");
        const biayaText = parseAndReplaceNewlines(data.biaya || "");

        setNama_paket(data.nama_paket || "");
        setLama_kegiatan(data.lama_kegiatan || "");
        setRentang_harga(data.rentang_harga || "");
        setDestinasi(destinasiText);
        setRangkaian_kegiatan(rangkaianKegiatanText);
        setFasilitas(fasilitasText);
        setBiaya(biayaText);
        setCover(data.cover || null);
        setPreview(
          data.cover ? `http://localhost:7000/paket/${data.nama_cover}` : ""
        );
      }
    } catch (error) {
      console.error("Error getting data:", error);
    }
  };

  const parseAndReplaceNewlines = (jsonString) => {
    try {
      const parsedData = JSON.parse(jsonString);
      if (typeof parsedData === "string") {
        return parsedData.replace(/\\r\\n/g, "\n");
      }
    } catch (error) {
      console.error("Error parsing JSON string:", error);
    }
    return "";
  };

  const editData = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("cover", cover);
      formData.append("nama_paket", nama_paket);
      formData.append("lama_kegiatan", lama_kegiatan);
      formData.append("rentang_harga", rentang_harga);
      formData.append("destinasi", destinasi);
      formData.append("rangkaian_kegiatan", rangkaian_kegiatan);
      formData.append("fasilitas", fasilitas);
      formData.append("biaya", biaya);

      await axiosJWT.patch(`http://localhost:7000/paket/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      Swal.fire({
        icon: "success",
        title: "Data berhasil diupdate!",
        showConfirmButton: false,
        timer: 2000,
      });

      setTimeout(() => {
        navigate("/DataPaketWisata");
        window.location.reload();
      }, 2000);
    } catch (error) {
      if (error.response) {
        const errorMessage = error.response.data.msg;
        setMsg(errorMessage);

        Swal.fire({
          icon: "error",
          title: "Gagal Update Data!",
          text: errorMessage,
        });
      } else {
        console.error("Unexpected error:", error);

        Swal.fire({
          icon: "error",
          title: "Gagal Update Data!",
          text: "Terjadi kesalahan",
        });
      }
    }
  };

  return (
    <>
      <NavbarAdmin />
      <div className="ml-60 flex mt-12 justify-center">
        <form onSubmit={editData} className="flex w-full justify-center">
          <div className="w-4/5 mt-10">
            <div className="bg-white pb-12 flex flex-col rounded-md shadow-lg w-full mb-5">
              <h2 className="bg-[#3c87ca] font-body w-full h-11 py-2.5 px-5 rounded-t-md text-white">
                Form Edit Paket Wisata
              </h2>
              <div className="px-10">
                <div className="w-full mt-5 flex flex-col items-center">
                  <div className="w-full font-body">
                    <label
                      htmlFor="Nama Paket"
                      className="block text-base font-medium text-black mb-1"
                    >
                      Nama Paket
                    </label>
                    <input
                      value={nama_paket}
                      onChange={(e) => setNama_paket(e.target.value)}
                      type="text"
                      id="nama"
                      className="w-full py-1 px-3 mb-3 rounded-md border border-slate-300 focus:outline-none focus:border-[#3c87ca] focus:ring-1 focus:ring-[#3c87ca] font-body"
                    />

                    <label
                      htmlFor="Nama Paket"
                      className="block text-base font-medium text-black mb-1"
                    >
                      Lama Kegiatan
                    </label>
                    <select
                      value={lama_kegiatan}
                      onChange={(e) => setLama_kegiatan(e.target.value)}
                      className="w-1/2 py-1 px-3 mb-3 rounded-md border border-slate-300 focus:outline-none focus:border-[#3c87ca] focus:ring-1 focus:ring-[#3c87ca] font-body"
                    >
                      <option value="" hidden>
                        Pilih Lama Kegiatan
                      </option>
                      <option value="1 Hari">1 Hari</option>
                      <option value="2 Hari">2 Hari</option>
                      <option value="3 Hari">3 Hari</option>
                    </select>
                    <label
                      htmlFor="Rentang Harga"
                      className="block text-base font-medium text-black mb-1"
                    >
                      Rentang Harga
                    </label>
                    <input
                      value={rentang_harga}
                      onChange={(e) => setRentang_harga(e.target.value)}
                      type="text"
                      id="nama"
                      className="w-full py-1 px-3 mb-3 rounded-md border border-slate-300 focus:outline-none focus:border-[#3c87ca] focus:ring-1 focus:ring-[#3c87ca] font-body"
                    />
                    <label
                      htmlFor="Destinasi Wisata"
                      className="block text-base font-medium text-black mb-1"
                    >
                      Destinasi Wisata
                    </label>
                    <textarea
                      value={destinasi}
                      onChange={(e) => setDestinasi(e.target.value)}
                      id="Destinasi"
                      className="w-full h-40 py-1 px-3  mb-3 rounded-md border border-slate-300 focus:outline-none focus:border-[#3c87ca] focus:ring-1 focus:ring-[#3c87ca] font-body placeholder-top transition-transform duration-300 ease-out focus:placeholder-translate-y-full"
                    />
                    <label
                      htmlFor="Rangkaian Kegiatan"
                      className="block text-base font-medium text-black mb-1"
                    >
                      Rangkaian Kegiatan
                    </label>
                    <textarea
                      value={rangkaian_kegiatan}
                      onChange={(e) => setRangkaian_kegiatan(e.target.value)}
                      id="Deskripsi"
                      className="w-full h-40 py-1 px-3  mb-3 rounded-md border border-slate-300 focus:outline-none focus:border-[#3c87ca] focus:ring-1 focus:ring-[#3c87ca] font-body placeholder-top transition-transform duration-300 ease-out focus:placeholder-translate-y-full"
                    />
                    <label
                      htmlFor="Fasilitas"
                      className="block text-base font-medium text-black mb-1"
                    >
                      Fasilitas
                    </label>
                    <textarea
                      value={fasilitas}
                      onChange={(e) => setFasilitas(e.target.value)}
                      id="Deskripsi"
                      className="w-full h-40 py-1 px-3  mb-3 rounded-md border border-slate-300 focus:outline-none focus:border-[#3c87ca] focus:ring-1 focus:ring-[#3c87ca] font-body placeholder-top transition-transform duration-300 ease-out focus:placeholder-translate-y-full"
                    />
                    <label
                      htmlFor="Biaya"
                      className="block text-base mt-5 font-medium text-black mb-1"
                    >
                      Biaya
                    </label>
                    <textarea
                      value={biaya}
                      onChange={(e) => setBiaya(e.target.value)}
                      id="Deskripsi"
                      className="w-full h-40 py-1 px-3  mb-3 rounded-md border border-slate-300 focus:outline-none focus:border-[#3c87ca] focus:ring-1 focus:ring-[#3c87ca] font-body placeholder-top transition-transform duration-300 ease-out focus:placeholder-translate-y-full"
                    />
                    <label className="block text-base mt-3 font-medium text-black mb-1">
                      Cover
                    </label>
                    <div className="">
                      {preview ? (
                        <figure className="">
                          <img
                            className="rounded-md w-40 h-24 object-cover"
                            src={preview}
                          />
                        </figure>
                      ) : (
                        ""
                      )}
                    </div>
                    <div className=" mt-5">
                      <label className="absolute text-xs hover:bg-[#3c87ca] hover:text-white cursor-pointer bg-transparent border border-[#3c87ca] font-body py-1 px-2 text-[#3c87ca] rounded-md inline-block">
                        <span>Pilih File Foto</span>
                        <input
                          onChange={loadImage}
                          type="file"
                          id="fileInput"
                          className="custom-file-input absolute inset-0 opacity-0 cursor-pointer"
                        />
                      </label>
                    </div>
                    <button
                      className=" float-right mt-10   rounded-md shadow-lg bg-[#3c87ca] hover:bg-[#2A5E8D] text-white py-2 px-4 font-body  "
                      type="submit"
                    >
                      Simpan Data
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default TambahDataWisata;
