import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import jwt_decode from "jwt-decode";
import { FaTimesCircle } from "react-icons/fa";
import NavbarAdmin from "../../Components/NavbarAdmin";

const TambahDataWisata = () => {
  const [token, setToken] = useState("");
  const [expire, setExpire] = useState("");
  const [nama_tempat, setNama_tempat] = useState("");
  const [alamat, setAlamat] = useState("");
  const [kabupaten, setKabupaten] = useState("");
  const [link_maps, setLink_maps] = useState("");
  const [cover, setCover] = useState(null);
  const [deskShort, setDeskShort] = useState("");
  const [deskLong, setDeskLong] = useState("");
  const [harga, setHarga] = useState("");
  const [foto, setFoto] = useState(null);
  const [preview1, setPreview1] = useState("");
  const [previews, setPreviews] = useState([]);
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const removeImage = (index) => {
    const updatedPreviews = [...previews];
    updatedPreviews.splice(index, 1);
    setPreviews(updatedPreviews);
  };

  const loadImage1 = (e) => {
    const image = e.target.files[0];
    setCover(image);
    setPreview1(URL.createObjectURL(image));
  };

  const loadImage = (e) => {
    const images = e.target.files;

    if (images && images.length > 0) {
      const newPreviews = Array.from(images).map((image) =>
        URL.createObjectURL(image)
      );
      setPreviews(newPreviews);
      setFoto(images);
    }
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
    document.title = 'Tambah Data Wisata';
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

  const saveData = async (e) => {
    e.preventDefault();

    try {
      if (!cover || !foto) {
        Swal.fire({
          icon: "error",
          title: "File Cover dan Foto harus diisi!",
        });
        return;
      }

      const formData = new FormData();
      formData.append("nama_tempat", nama_tempat);
      formData.append("alamat", alamat);
      formData.append("kabupaten", kabupaten);
      formData.append("link_maps", link_maps);
      formData.append("cover", cover);
      formData.append("deskShort", deskShort);
      formData.append("deskLong", deskLong);
      formData.append("harga", harga);

      for (let i = 0; i < foto.length; i++) {
        formData.append("foto", foto[i]);
      }

      await axiosJWT.post("http://localhost:7000/wisata", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      Swal.fire({
        icon: "success",
        title: "Data berhasil ditambahkan!",
        showConfirmButton: false,
        timer: 2000,
      });

      setTimeout(() => {
        navigate("/Destinasi");
        window.location.reload();
      }, 2000);
    } catch (error) {
      if (error.response) {
        const errorMessage = error.response.data.msg;
        setMsg(errorMessage);

        Swal.fire({
          icon: "error",
          title: "Gagal Menambahkan Data!",
          text: errorMessage,
        });
      } else {
        console.error("Unexpected error:", error);

        Swal.fire({
          icon: "error",
          title: "Gagal Menambahkan Data!",
          text: "Terjadi kesalahan",
        });
      }
    }
  };

  return (
    <>
      <NavbarAdmin />
      <div className="ml-60 flex mt-24 justify-center">
        <form onSubmit={saveData} className="flex w-full justify-center">
          <div className="w-4/5 -mt-2">
            <div className="bg-white pb-10 flex flex-col rounded-md shadow-lg w-full mb-5">
              <h2 className="bg-[#3c87ca] font-body w-full h-11 py-2.5 px-5 rounded-t-md text-white">
                Form Tambah Data Wisata
              </h2>
              <div className="px-10">
                <div className="w-full mt-5 flex flex-col items-center">
                  <div className="w-full font-body">
                    <label
                      htmlFor="Nama Tempat"
                      className="block text-base font-medium text-black mb-1"
                    >
                      Nama Tempat
                    </label>
                    <input
                      value={nama_tempat}
                      onChange={(e) => setNama_tempat(e.target.value)}
                      type="text"
                      id="nama"
                      className="w-full py-1 px-3 mb-3 rounded-md border border-slate-300 focus:outline-none focus:border-[#3c87ca] focus:ring-1 focus:ring-[#3c87ca] font-body"
                    />

                    <label
                      htmlFor="Alamat"
                      className="block text-base font-medium text-black mb-1"
                    >
                      Alamat
                    </label>
                    <input
                      value={alamat}
                      onChange={(e) => setAlamat(e.target.value)}
                      type="text"
                      id="alamat"
                      className="w-full py-1 px-3 mb-3 rounded-md border border-slate-300 focus:outline-none focus:border-[#3c87ca] focus:ring-1 focus:ring-[#3c87ca] font-body"
                    />
                    <label
                      htmlFor="Kabupaten"
                      className="block text-base font-medium text-black mb-1"
                    >
                      Kabupaten
                    </label>
                    <select
                              value={kabupaten}
                              onChange={(e) => setKabupaten(e.target.value)}
                              className="w-1/2 py-1 px-3 mb-3 rounded-md border border-slate-300 focus:outline-none focus:border-[#3c87ca] focus:ring-1 focus:ring-[#3c87ca] font-body"
                            >
                              <option value="" hidden>
                                Pilih Kabupaten/Kota
                              </option>
                              <option value="Kota Tanjungpinang">Kota Tanjungpinang</option>
                              <option value="Kota Batam">Kota Batam</option>
                              <option value="Kabupaten Bintan">Kabupaten Bintan</option>
                              <option value="Kabupaten Natuna">Kabupaten Natuna</option>
                              <option value="Kabupaten Kepulauan Anambas">Kabupaten Kepulauan Anambas</option>
                              <option value="Kabupaten Karimun">Kabupaten Karimun</option>
                              <option value="Kabupaten Lingga">Kabupaten Lingga</option>
                            </select>
                    <label
                      htmlFor="Link Maps"
                      className="block text-base font-medium text-black mb-1"
                    >
                      Link Maps
                    </label>
                    <input
                      value={link_maps}
                      onChange={(e) => setLink_maps(e.target.value)}
                      type="tex"
                      id="linkmaps"
                      className="w-full py-1 px-3 mb-3 rounded-md border border-slate-300 focus:outline-none focus:border-[#3c87ca] focus:ring-1 focus:ring-[#3c87ca] font-body"
                    />

                    <label
                      htmlFor="Keterangan Singkat"
                      className="block text-base font-medium text-black mb-1"
                    >
                      Keterangan Singkat
                    </label>
                    <input
                      value={deskShort}
                      onChange={(e) => setDeskShort(e.target.value)}
                      type="text"
                      id="keterangan"
                      className="w-full py-1 px-3 mb-3 rounded-md border border-slate-300 focus:outline-none focus:border-[#3c87ca] focus:ring-1 focus:ring-[#3c87ca] font-body"
                    />

                    <label
                      htmlFor="Deskripsi Wisata"
                      className="block text-base font-medium text-black mb-1"
                    >
                      Deskripsi Wisata
                    </label>
                    <textarea
                      value={deskLong}
                      onChange={(e) => setDeskLong(e.target.value)}
                      id="Deskripsi"
                      className="w-full h-40 py-1 px-3  mb-3 rounded-md border border-slate-300 focus:outline-none focus:border-[#3c87ca] focus:ring-1 focus:ring-[#3c87ca] font-body placeholder-top transition-transform duration-300 ease-out focus:placeholder-translate-y-full"
                    />
                    <label className="block text-base font-medium text-black mb-1">
                      Harga
                    </label>
                    <textarea
                      value={harga}
                      onChange={(e) => setHarga(e.target.value)}
                      id="Deskripsi"
                      className="w-full h-40 py-1 px-3  mb-3 rounded-md border border-slate-300 focus:outline-none focus:border-[#3c87ca] focus:ring-1 focus:ring-[#3c87ca] font-body placeholder-top transition-transform duration-300 ease-out focus:placeholder-translate-y-full"
                    />
                    <label className="block text-base mt-3 font-medium text-black mb-1">
                      Cover
                    </label>
                    <div className="">
                      {preview1 ? (
                        <figure className="">
                          <img
                            className="rounded-md w-40 h-24 object-cover"
                            src={preview1}
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
                          onChange={loadImage1}
                          type="file"
                          id="fileInput"
                          className="custom-file-input absolute inset-0 opacity-0 cursor-pointer"
                        />
                      </label>
                    </div>
                    <label className="block text-base mt-16 font-medium text-black mb-1">
                      Foto
                    </label>
                    <div className="grid grid-cols-5">
                      {previews.map((preview, index) => (
                        <div
                          key={index}
                          className=" h-auto rounded-md mr-4 mt-4 relative group overflow-hidden"
                        >
                          <figure className="">
                            <img
                              className="rounded-md transition-opacity h-24 w-40 object-cover"
                              src={preview}
                              alt={`Preview ${index}`}
                            />
                            <div className="overlay absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black bg-opacity-20">
                              <FaTimesCircle
                                className="text-white text-2xl cursor-pointer"
                                onClick={() => removeImage(index)}
                              />
                            </div>
                          </figure>
                        </div>
                      ))}
                    </div>
                    <div className="w-24 h-auto rounded-md mt-5">
                      <label className="absolute text-xs hover:bg-[#3c87ca] hover:text-white cursor-pointer bg-transparent border border-[#3c87ca] font-body py-1 px-2 text-[#3c87ca] rounded-md inline-block">
                        <span>Pilih File Foto</span>
                        <input
                          onChange={loadImage}
                          type="file"
                          id="fileInput"
                          className="custom-file-input absolute inset-0 opacity-0 cursor-pointer"
                          multiple
                        />
                      </label>
                    </div>
                    <div className="float-right mt-24 ">
                      <button
                        className="rounded-md shadow-lg bg-[#3c87ca] hover:bg-[#2A5E8D] text-white py-2 px-4 font-body "
                        type="submit"
                      >
                        Simpan Data
                      </button>
                    </div>
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
