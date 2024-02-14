import React, { useState, useEffect } from "react";
import { ImBin2 } from "react-icons/im";
import { MdEdit } from "react-icons/md";
import axios from "axios";
import Swal from "sweetalert2";
import jwt_decode from "jwt-decode";
import NavbarAdmin from "../../Components/NavbarAdmin";
import { Link, useNavigate } from "react-router-dom";

const Destinasi = () => {
  const [wisata, setWisata] = useState([]);
  const [token, setToken] = useState("");
  const [expire, setExpire] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showEntries, setShowEntries] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    getWisata();
    refreshToken();
    document.title = 'Destinasi Wisata';
  }, [currentPage, showEntries]);

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
      setTotalPages(Math.ceil(response.data.length / showEntries));
    } catch (error) {
      console.error("Error fetching wisata data:", error);
    }
  };

  const deleteWisata = async (wisataId) => {
    try {
      const result = await Swal.fire({
        title: "Konfirmasi Hapus",
        text: "Apakah Anda yakin ingin menghapus data ini?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Ya, Hapus!",
        cancelButtonText: "Batal",
      });

      if (result.isConfirmed) {
        await axiosJWT.delete(`http://localhost:7000/wisata/${wisataId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        getWisata();
        Swal.fire("Terhapus!", "Data berhasil dihapus.", "success");
      }
    } catch (error) {
      console.error("Error deleting Wisata:", error);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleShowEntries = (e) => {
    setShowEntries(Number(e.target.value));
    setCurrentPage(1);
    setTotalPages(Math.ceil(wisata.length / Number(e.target.value)));
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const filteredWisata = wisata.filter((u) => {
    return (
      u &&
      u.nama_tempat &&
      u.alamat &&
      (u.nama_tempat.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.alamat.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  const paginatedWisata = filteredWisata.slice(
    (currentPage - 1) * showEntries,
    currentPage * showEntries
  );

  const renderedWisata = paginatedWisata || [];
  return (
    <>
      <NavbarAdmin />
      <div className="ml-60 mt-16 px-5 h-auto bg-[#FAFAFA] pb-10">
      <h1 className="text-2xl font-body font-bold py-10">Data Destinasi</h1>
      <Link
        to={"/Destinasi/TambahDataWisata"}
        className=" float-right -mt-20 rounded-md shadow-lg bg-[#3c87ca] hover:bg-[#2A5E8D] text-white py-2 px-4 font-body "
      >
        Tambah Data
      </Link>
      <div className="container font-body  mx-auto bg-white p-10 rounded-md shadow-lg">
        <div className="flex justify-between mb-5">
          <div className="flex justify-center  items-center gap-1">
            <p>Show</p>
            <input
              className="border border-gray-400 focus:border-[#3c87ca] outline-none pl-2 w-16 rounded-md"
              type="number"
              value={showEntries}
              onChange={handleShowEntries}
            />
            <p>entries</p>
          </div>
          <div className="gap-1">
            <label htmlFor="">Search:</label>
            <input
              className="border ml-3 border-gray-400 focus:border-[#3c87ca] outline-none pl-2 w-44 rounded-md"
              type="text"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
        </div>
        <table className="min-w-full bg-white ">
          <thead>
            <tr className="text-left ">
              <th className="py-1 px-4 text-center ">No</th>
              <th className="py-1 px-4 ">Nama Destinasi</th>
              <th className="py-1 px-4 ">Alamat</th>
              <th className="py-1 px-4 ">Deskripsi Singkat</th>
              <th className="py-1 px-4 ">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {renderedWisata.length > 0 ? (
              renderedWisata.map((wisata, index) => (
                <tr key={wisata.id}>
                  <td className="py-2 px-4 border-y text-center">
                    {index + 1}
                  </td>
                  <td className="py-2 px-4 border-y">{wisata.nama_tempat}</td>
                  <td className="py-2 px-4 border-y">{wisata.alamat}</td>
                  <td className="py-2 px-4 border-y">{wisata.deskShort}</td>
                  <td className="py-2 px-4 border-y">
                    <div className="flex">
                      <Link
                        to={`EditDataWisata/${wisata.id}`}
                        className="bg-blue-500 text-white px-2 py-2 rounded-full ml-2"
                      >
                        <MdEdit />
                      </Link>
                      <button
                        onClick={() => deleteWisata(wisata.id)}
                        className="bg-red-500 text-white px-2 py-2 rounded-full ml-2"
                      >
                        <ImBin2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="py-3 px-4 text-center">
                  Data tidak ditemukan
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="flex justify-between mt-3">
          <div>
            <p>
              Page {currentPage} of {totalPages}
            </p>
          </div>
          <div className="flex">
            <button
              className="border px-2 rounded-l-md cursor-pointer  border-gray-400 hover:border-[#3c87ca]"
              onClick={handlePrevPage}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <p className="px-2 py-1 text-white bg-[#3c87ca]">{currentPage}</p>
            <button
              className="border px-2 rounded-r-md cursor-pointer  border-gray-400 hover:border-[#3c87ca]"
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </div>
      </div>
    </>
  );
};

export default Destinasi;
