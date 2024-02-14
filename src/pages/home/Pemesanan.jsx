import React, { useState, useEffect } from 'react';
import Navbar from '../../Components/Navbar';
import { Footer } from '../../Components/Footer';
import axios from 'axios';
import Swal from "sweetalert2";
import jwt_decode from "jwt-decode";
import { Link, useNavigate, useParams } from 'react-router-dom';

const Pemesanan = () => {
  useEffect(() => {
    const snapScript = "https://app.sandbox.midtrans.com/snap/snap.js";
    const clientKey = "SB-Mid-client-QvVfCv3niY8bhqBZ"; 
    const script = document.createElement('script');
    script.src = snapScript;
    script.setAttribute('data-client-key', clientKey);

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const [token, setToken] = useState("");
  const [expire, setExpire] = useState("");
  const { id } = useParams();
  const [paket, setPaket] = useState({});
  const [nama, setNama] = useState('');
  const [email, setEmail] = useState('');
  const [nama_paket, setNama_paket] = useState({});
  const [tanggal, setTanggal] = useState('');
  const [jumlah_orang, setJumlah_orang] = useState('');
  const [no_wa, setNo_wa] = useState('');
  const [hargaPerOrang, sethargaPerOrang] = useState('');
  const [totalPembayaran, setTotalPembayaran] = useState(0);
  const [snapShow, setSnapShow] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [userId, setUserId] = useState('');
  const navigate = useNavigate();

  const axiosJWT = axios.create();

  const refreshToken = async () => {
    try {
      const response = await axios.get("http://localhost:7000/token");
      setToken(response.data.accessToken);
      const decoded = jwt_decode(response.data.accessToken);
      setExpire(decoded.exp);
      setNama(decoded.nama);
      setEmail(decoded.email);
      setUserId(decoded.userId);
    } catch (error) {
      if (error.response) {
        navigate("/");
      }
    }
  };

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

  const getPaketById = async () => {
    try {
      const response = await axiosJWT.get(`http://localhost:7000/paket/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setPaket(response.data);
      setNama_paket(response.data.nama_paket);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

 

  const calculateTotalPembayaran = () => {
    let hargaPerOrang = 0;

    switch (paket.lama_kegiatan) {
      case '1 Hari':
        if (jumlah_orang >= 2 && jumlah_orang <= 3) {
          hargaPerOrang = 400000;
        } else if (jumlah_orang >= 4 && jumlah_orang <= 6) {
          hargaPerOrang = 350000;
        } else if (jumlah_orang >= 7 && jumlah_orang <= 11) {
          hargaPerOrang = 300000;
        }
        break;
      case '2 Hari':
        if (jumlah_orang >= 2 && jumlah_orang <= 3) {
          hargaPerOrang = 600000;
        } else if (jumlah_orang >= 4 && jumlah_orang <= 6) {
          hargaPerOrang = 550000;
        } else if (jumlah_orang >= 7 && jumlah_orang <= 11) {
          hargaPerOrang = 500000;
        }
        break;
      case '3 Hari':
        if (jumlah_orang >= 2 && jumlah_orang <= 3) {
          hargaPerOrang = 800000;
        } else if (jumlah_orang >= 4 && jumlah_orang <= 6) {
          hargaPerOrang = 750000;
        } else if (jumlah_orang >= 7 && jumlah_orang <= 11) {
          hargaPerOrang = 700000;
        }
        break;
      default:
        break;
    }

    const totalPembayaran = hargaPerOrang * jumlah_orang;
    setTotalPembayaran(totalPembayaran);
    sethargaPerOrang(hargaPerOrang);
  };

  const Bayar = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = {
        gross_amount: totalPembayaran,
        nama_pengguna: nama,
        email: email,
        nama_paket: nama_paket,
        tanggal_berwisata: tanggal,
        jumlah_orang: jumlah_orang,
        no_wa: no_wa,
        hargaPerOrang: hargaPerOrang,
        paketId: id,
        userId: userId,
      };

      const response = await axiosJWT.post("http://localhost:7000/transaksi", JSON.stringify(dataToSend), {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setOrderId(response.data.response.Order_Id);
      setSnapShow(true);
      window.snap.embed(response.data.token.token, {
        embedId: 'snap-container'
      });

    } catch (error) {
      if (error.response) {
        const errorMessage = error.response.data.msg;
        if (error.response.status === 409) {
          Swal.fire({
            icon: "info",
            title: "Transaksi Sudah Dikirim!",
            text: errorMessage,
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Gagal Mengirim Transaksi!",
            text: errorMessage,
          });
        }
      } else {
        console.error("Unexpected error:", error);
        Swal.fire({
          icon: "error",
          title: "Gagal Mengirim Transaksi!",
          text: "Terjadi kesalahan",
        });
      }
    }
  }


  useEffect(() => {
    const fetchData = async () => {
      await refreshToken();
      await getPaketById();
    };
    document.title = 'Pemesanan';
    fetchData();
  }, [id, token]);

  useEffect(() => {
    calculateTotalPembayaran();
  }, [paket, jumlah_orang]);


  return (
    <>
      <Navbar />
      <section className=' max-md:mt-16 p-5  md:py-20 flex justify-center w-full h-auto bg-[#FAFAFA]'>
          <div className='md:w-2/6 h-auto bg-white rounded-md shadow-lg'>
          {!snapShow && (
            <div>
              <h1 className='text-xl font-body font-bold text-center mt-10'>Formulir Pemesanan</h1>
              <div className=' mt-5 flex flex-col items-center justify-center'>
                <form onSubmit={Bayar} className='w-full px-5 md:px-10'>
                  <label className='text-base font-body'>Tanggal Berwisata</label>
                  <input
                    type="date"
                    id='tanggal'
                    placeholder='Masukkan Tanggal'
                    className='w-full py-1 px-3 mt-2 mb-3 rounded-lg border border-slate-300 focus:outline-none focus:border-[#3c87ca] focus:ring-1 focus:ring-[#3c87ca] font-body'
                    value={tanggal}
                    onChange={(e) => setTanggal(e.target.value)}
                  />
                  <label className='text-base font-body'>Jumlah Orang</label>
                  <input
                    type="number"
                    id='jumlah'
                    placeholder='Masukan Jumlah'
                    className='w-full py-1 px-3 mt-2 mb-3 rounded-lg border border-slate-300 focus:outline-none focus:border-[#3c87ca] focus:ring-1 focus:ring-[#3c87ca] font-body'
                    value={jumlah_orang}
                    onChange={(e) => setJumlah_orang(e.target.value)}
                  />
                  <label className='text-base font-body'>Nomor Whatsapp Aktif</label>
                  <input
                    type="tel"
                    id='nomor'
                    placeholder='628*****'
                    className='w-full py-1 px-3 mt-2 mb-3 rounded-lg border border-slate-300 focus:outline-none focus:border-[#3c87ca] focus:ring-1 focus:ring-[#3c87ca] font-body'
                    value={no_wa}
                    onChange={(e) => setNo_wa(e.target.value)}
                  />
                  <table className='w-full text-base mb-3 font-body font-semibold'>
                    <tbody>
                      <tr>
                        <td>Nama Paket</td>
                        <td className='text-right'>{paket.nama_paket}</td>
                      </tr>
                      <tr>
                        <td>Lama Kegiatan</td>
                        <td className='text-right'>{paket.lama_kegiatan}</td>
                      </tr>
                      <tr>
                        <td>Total Pembayaran</td>
                        <td className='text-right'>Rp {totalPembayaran.toLocaleString()}</td>
                      </tr>
                    </tbody>
                  </table>
                  <div className='flex flex-col justify-center'>
                  <button type='submit' className='font-body mb-5 py-2 px-10 mt-5 rounded-md text-white hover:bg-[#3373ac] bg-[#3c87ca]'>Selesaikan Pesanan</button>
                  
                  </div>
                </form>
              </div>
            </div>
          )}
          <div className='' style={{ width: '100%', maxWidth: '600px' }} id="snap-container"></div>
          <div className='flex justify-center'>
          <Link to={'/Transaksi'} className='font-body absolute  text-center py-2 px-10 rounded-md  text-white hover:bg-[#3373ac] bg-[#3c87ca]'>Lihat Transaksi</Link>
          </div>
          </div>
      </section>
      
      <Footer/>
    </>
  );
};

export default Pemesanan;
