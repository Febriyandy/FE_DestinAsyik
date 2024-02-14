import React from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar2 from '../Components/Navbar2'
import About  from "../pages/home/About";
import Kontak from "../pages/home/Kontak";
import Login from '../pages/auth/login';
import Daftar from '../pages/auth/daftar';
import Notfound from '../pages/home/Notfound';
import { Footer } from '../Components/Footer';
import DetailWisata from '../pages/home/DetailWisata';
import Home from '../pages/home/Home';
import Landingpage from '../pages/home/Landingpage';
import Profil from '../pages/home/Profil';
import Like from '../pages/home/Like';
import PaketWisata from '../pages/home/PaketWisata';
import DetailPaket from '../pages/home/DetailPaket';
import Pemesanan from '../pages/home/Pemesanan';
import Transaksi from '../pages/home/Transaksi';
import DetailTransaksi from '../pages/home/DetailTransaksi';
import NavbarAdmin from '../Components/NavbarAdmin';
import DataWisata from '../pages/home/DataWisata';
import DataPaketWisata from '../pages/home/DataPaketWisata';
import DataPenggunaWisata from '../pages/home/DataPenggunaWisata';
import DataTransaksi from '../pages/home/DataTransaksi';
import Admin from '../pages/home/Admin';
import Destinasi from '../pages/home/Destinasi';
import TambahDataWisata from '../pages/home/TambahDataWisata';
import TambahDataPaketWisata from '../pages/home/TambahDataPaketWisata';
import DetailTransaksiAdmin from '../pages/home/DetailTransaksiAdmin';
import Wisata from '../pages/home/Wisata';
import DataKontak from '../pages/home/DataKontak';
import EditDataWisata from '../pages/home/EditDataWisata';
import EditPaketWisata from '../pages/home/EditPaketWisata';



const Routing = () =>{
    return(
        <Routes> 
              <Route path="/login" element={<Login />} />
              <Route path="/Daftar" element={<Daftar />} />
              <Route path="/" element={<Home />} />
              <Route path='/landingpage' element={<Landingpage/>} />
              <Route path="/about" element={<About />} />
              <Route path="/kontak" element={<Kontak />} />
              <Route path='/footer' element={<Footer />} />
              <Route path='/Wisata/DetailWisata/:id' element={<DetailWisata/>} />
              <Route path='/Landingpage/DetailWisata/:id' element={<DetailWisata/>} />
              <Route path="*" element={<Notfound />} />
              <Route path='/Navbar2' element={<Navbar2 />} />
              <Route path='/Profil' element={<Profil/>} />
              <Route path='/Like' element={<Like/>}/>
              <Route path='/PaketWisata' element={<PaketWisata/>}/>
              <Route path='/PaketWisata/DetailPaket/:id' element={<DetailPaket/>}/>
              <Route path='/PaketWisata/Pemesanan/:id' element={<Pemesanan/>} />
              <Route path='/Transaksi' element={<Transaksi/>} />
              <Route path='/Transaksi/DetailTransaksi/:orderId' element={<DetailTransaksi/>} />
              <Route path='/Navbaradmin' element={<NavbarAdmin/>}/>
              <Route path='/DataWisata' element={<DataWisata/>}/>
              <Route path='/DataPaketWisata' element={<DataPaketWisata/>}/>
              <Route path='/DataPaketWisata/EditPaketWisata/:id' element={<EditPaketWisata/>}/>
              <Route path='/DataPenggunaWisata' element={<DataPenggunaWisata/>}/>
              <Route path='/DataTransaksi' element={<DataTransaksi/>}/>
              <Route path='/Admin' element={<Admin/>}/>
              <Route path='/Destinasi' element={<Destinasi/>} />
              <Route path='/Destinasi/TambahDataWisata' element={<TambahDataWisata/>}/>
              <Route path='/Destinasi/EditDataWisata/:id' element={<EditDataWisata/>}/>
              <Route path='/TambahDataPaketWisata' element={<TambahDataPaketWisata/>}/>
              <Route path='/DataTransaksi/DetailTransaksiAdmin/:orderId' element={<DetailTransaksiAdmin/>}/>
              <Route path='/Wisata' element={<Wisata/>}/>
              <Route path='/DataKontak' element={<DataKontak/>}/> 
        </Routes>
        
    );



};

export default Routing