import React, { useState, useEffect } from "react";
import Navbar2 from "../../Components/Navbar2";
import Navbar from "../../Components/Navbar";
import foto1 from "../../assets/profil.png";
import axios from "axios";
import jwt_decode from "jwt-decode";
import Swal from "sweetalert2";
import { useParams, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Profil = () => {
  const [token, setToken] = useState("");
  const [expire, setExpire] = useState("");
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [no_hp, setNo_hp] = useState("");
  const [Alamat, setAlamat] = useState("");
  const [Jenis_Kelamin, setJenis_Kelamin] = useState("");
  const [foto, setFoto] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [showFormPassword, setShowFormPassword] = useState(false);
  const [preview, setPreview] = useState("");
  const { id } = useParams();
  const [msg, setMsg] = useState("");
  const [uuid, setUuid] = useState("");
  const [oldPassword, setOldpassword] = useState("");
  const [newPassword, setPassword] = useState("");
  const [confPassword, setconfPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const updatePassword = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("oldPassword", oldPassword);
    formData.append("newPassword", newPassword);
    formData.append("confPassword", confPassword);

    try {
      await axiosJWT.patch(`http://localhost:7000/update/${uuid}`, formData, {
        headers: {
          "Content-type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      Swal.fire({
        icon: "success",
        title: "Password Berhasil di Ubah!",
        showConfirmButton: false,
        timer: 2000,
      });
      setTimeout(() => {
        navigate("/Profil");
        window.location.reload();
      }, 2000);
    } catch (error) {
      if (error.response) {
        const errorMessage = error.response.data.msg;
        setMsg(errorMessage);

        Swal.fire({
          icon: "error",
          title: "Gagal Update Password!",
          text: errorMessage,
        });
      } else {
        console.error("Unexpected error:", error);

        Swal.fire({
          icon: "error",
          title: "Gagal Update Password!",
          text: "Terjadi kesalahan",
        });
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleOldpasswordChange = (e) => {
    setOldpassword(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };
  const handleconfPasswordChange = (e) => {
    setconfPassword(e.target.value);
  };

  const refreshToken = async () => {
    try {
      const response = await axios.get("http://localhost:7000/token");
      setToken(response.data.accessToken);
      const decoded = jwt_decode(response.data.accessToken);
      setNama(decoded.nama);
      setEmail(decoded.email);
      setNo_hp(decoded.no_hp);
      setAlamat(decoded.Alamat);
      setJenis_Kelamin(decoded.Jenis_Kelamin);
      setFoto(decoded.foto);
      setExpire(decoded.exp);
      setUuid(decoded.uuid);
    } catch (error) {
      if (error.response) {
        navigate("/");
      }
    }
  };

  useEffect(() => {
    refreshToken();
    getUsersById();
    document.title = 'Profil';
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

  const getUsersById = async () => {
    const response = await axiosJWT.get(`http://localhost:7000/users/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.data) {
      setNama(response.data.nama || "");
      setEmail(response.data.email || "");
      setNo_hp(response.data.no_hp || "");
      setAlamat(response.data.Alamat || "");
      setJenis_Kelamin(response.data.Jenis_Kelamin || "");
      setFoto(response.data.image || "");
      setPreview(response.data.foto || "");
    }
  };

  const updateProfil = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("nama", nama);
    formData.append("email", email);
    formData.append("no_hp", no_hp);
    formData.append("Alamat", Alamat);
    formData.append("Jenis_Kelamin", Jenis_Kelamin);
    formData.append("foto", foto);
    try {
      await axiosJWT.patch(`http://localhost:7000/users/${uuid}`, formData, {
        headers: {
          "Content-type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      Swal.fire({
        icon: "success",
        title: "Profil Berhasil di Ubah!",
        showConfirmButton: false,
        timer: 2000,
      });
      setTimeout(() => {
        navigate("/Profil");
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

  const toggleForm = () => {
    setShowForm(!showForm);
  };

  const toggleFormPassword = () => {
    setShowFormPassword(!showFormPassword);
  };

  const toggleCloseFormProfil = () => {
    setShowForm(false);
  };

  const toggleCloseFormPassword = () => {
    setShowFormPassword(false);
  };

  const loadImage = (e) => {
    const image = e.target.files[0];
    setFoto(image);
    setPreview(URL.createObjectURL(image));
  };

  return (
    <>
    <Navbar />
      <Navbar2 />
      <div className="md:ml-60 mt-16 justify-center p-5 md:py-10 h-auto bg-[#FAFAFA]">
        <div className="md:w-4/5 w-full mx-auto  h-auto px-5 md:px-10 py-5 bg-white shadow-md  rounded-lg">
          <h1 className="text-lg font-body font-bold">Profil</h1>
          <p className="text-xl font-body font-bold">{nama}</p>
          <div className="w-full gap-5 md:flex  rounded-md mt-5 md:p-5 h-auto md:bg-[#FAFAFA]">
            <div className="md:w-48 md:h-48 p-6 md:py-6 mx-auto rounded-md bg-white md:shadow-lg">
              <img
                className="md:w-36 w-48 h-48 md:h-36 object-cover  mx-auto my-auto"
                src={foto || foto1}
                alt=""
              />
            </div>
            <div className="md:w-3/4 h-auto pt-5 md:pl-10 md:rounded-md md:bg-white md:shadow-lg">
              <p className="text-xl font-body font-bold text-[#3c87ca]">
                Biodata Diri
              </p>
              <div className="flex">
                <table className="font-body w-full">
                  <tbody>
                    <tr>
                      <td className="py-2">Nama</td>
                      <td className="py-2">{nama}</td>
                    </tr>
                    <tr>
                      <td className="py-2">Email</td>
                      <td className="py-2">{email}</td>
                    </tr>
                    <tr>
                      <td className="py-2">Nomor Hp</td>
                      <td className="py-2">{no_hp}</td>
                    </tr>
                    <tr>
                      <td className="py-2">Alamat</td>
                      <td className="py-2">{Alamat}</td>
                    </tr>
                    <tr>
                      <td className="py-2">Jenis Kelamin</td>
                      <td className="py-2">{Jenis_Kelamin}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className=" md:float-right flex">
                <button
                  onClick={toggleForm}
                  className=" text-sm px-3 mb-10 md:float-right mr-5 md:mr-10 relative text-center hover:bg-[#3c87ca] hover:text-white cursor-pointer bg-transparent border border-[#3c87ca] font-body mt-10 py-1  text-black rounded-md inline-block"
                >
                  Ubah Profil
                </button>
                <button
                  onClick={toggleFormPassword}
                  className=" text-sm px-3 mb-10 md:float-right mr-5 relative text-center hover:bg-[#3c87ca] hover:text-white cursor-pointer bg-transparent border border-[#3c87ca] font-body mt-10 py-1  text-black rounded-md inline-block"
                >
                  Ubah Password
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showForm && (
        <form onSubmit={updateProfil}>
          <div className="fixed z-[1000] top-0 left-0 p-5 w-full h-screen bg-black bg-opacity-50 flex items-center justify-center">
            <div className="md:w-2/3 w-full h-auto md:h-4/5 bg-white md:p-8 pb-5 rounded-md">
              <h1 className="text-xl pt-5 pl-5 font-body font-bold mb-4">
                Ubah Biodata Diri
              </h1>
              <div className="md:flex">
                <div className="w-48 h-60 mx-auto flex flex-col py-6 px-6 md:mr-5 md:rounded-md md:bg-white md:shadow-lg">
                  {preview || foto ? (
                    <figure className="image is-128x128">
                      <img
                        className="w-36 h-36 object-cover mx-auto"
                        src={preview || foto || foto1}
                        alt="Preview Image"
                      />
                    </figure>
                  ) : (
                    ""
                  )}

                  <label className=" text-ms mt-5 text-center items-center justify-center  hover:bg-[#3c87ca] hover:text-white cursor-pointer bg-transparent border border-[#3c87ca] font-body  py-1 px-6  text-[#3c87ca] rounded-md ">
                    <span>Pilih Foto</span>
                    <input
                      onChange={loadImage}
                      type="file"
                      id="fileInput"
                      className="custom-file-input absolute -ml-24 text-xs w-32 opacity-0 cursor-pointer"
                    />
                  </label>
                </div>
                <div className="md:w-3/4 w-full h-auto py-5 px-5 md:px-10 md:rounded-md md:bg-white md:shadow-lg">
                  <div className="flex">
                    <table className="font-body w-full">
                      <tbody>
                        <tr>
                          <td className="py-2">Nama</td>
                          <td className="py-2">
                            <input
                              type="text"
                              value={nama}
                              onChange={(e) => setNama(e.target.value)}
                              className="outline-none border border-[#3c87ca] py-1 px-3 w-full rounded-md"
                            />
                          </td>
                        </tr>
                        <tr>
                          <td className="py-2">Email</td>
                          <td className="py-2">
                            <input
                              type="text"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              className="outline-none border border-[#3c87ca] py-1 px-3 w-full rounded-md"
                            />
                          </td>
                        </tr>
                        <tr>
                          <td className="py-2">Nomor Hp</td>
                          <td className="py-2">
                            <input
                              type="text"
                              value={no_hp}
                              onChange={(e) => setNo_hp(e.target.value)}
                              className="outline-none border border-[#3c87ca] py-1 px-3 w-full rounded-md"
                            />
                          </td>
                        </tr>
                        <tr>
                          <td className="py-2">Alamat</td>
                          <td className="py-2">
                            <input
                              type="text"
                              value={Alamat}
                              onChange={(e) => setAlamat(e.target.value)}
                              className="outline-none border border-[#3c87ca] py-1 px-3 w-full rounded-md"
                            />
                          </td>
                        </tr>
                        <tr>
                          <td className="py-2">Jenis Kelamin</td>
                          <td className="py-2">
                            <select
                              value={Jenis_Kelamin}
                              onChange={(e) => setJenis_Kelamin(e.target.value)}
                              className="outline-none border border-[#3c87ca] py-1 px-3 w-full rounded-md"
                            >
                              <option value="" hidden>
                                Pilih Jenis Kelamin
                              </option>
                              <option value="Laki-Laki">Laki-Laki</option>
                              <option value="Perempuan">Perempuan</option>
                            </select>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="flex gap-3 float-right">
                    <button
                      className="bg-[#3c87ca] float-right text-sm font-body text-white px-6 py-2 rounded-md mt-4"
                      onClick={toggleCloseFormProfil}
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="bg-[#3c87ca] float-right text-sm font-body text-white px-6 py-2 rounded-md mt-4"
                    >
                      Simpan
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      )}
      {showFormPassword && (
        <form onSubmit={updatePassword}>
          <div className="fixed z-[1000] top-0 left-0 px-5 w-full h-screen bg-black bg-opacity-50 flex items-center justify-center">
            <div className="md:w-2/5 w-full h-auto md:h-3/5 bg-white p-8 rounded-md relative">
              <h1 className="text-xl font-body font-bold mb-4">
                Ubah Password
              </h1>
              <label className="font-body block my-2">Password Lama</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  onChange={handleOldpasswordChange}
                  className="outline-none border border-[#3c87ca] py-1 px-3 w-full rounded-md pr-10"
                />
                <span
                  className="text-gray-400 right-2 top-1/2 transform -translate-y-1/2 cursor-pointer absolute"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              <label className="font-body block my-2">Password Baru</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  onChange={handlePasswordChange}
                  className="outline-none border border-[#3c87ca] py-1 px-3 w-full rounded-md pr-10"
                />
                <span
                  className="text-gray-400 right-2 top-1/2 transform -translate-y-1/2 cursor-pointer absolute"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              <label className="font-body block my-2">
                Konfirmasi Password Baru
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  onChange={handleconfPasswordChange}
                  className="outline-none border border-[#3c87ca] py-1 px-3 w-full rounded-md pr-10"
                />
                <span
                  className="text-gray-400 right-2 top-1/2 transform -translate-y-1/2 cursor-pointer absolute"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              <div className="flex gap-3 float-right">
                <button
                  className="bg-[#3c87ca] float-right text-sm font-body text-white px-6 py-2 rounded-md mt-4"
                  onClick={toggleCloseFormPassword}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-[#3c87ca] float-right text-sm font-body text-white px-6 py-2 rounded-md mt-4"
                >
                  Simpan
                </button>
              </div>
            </div>
          </div>
        </form>
      )}
    </>
  );
};

export default Profil;
