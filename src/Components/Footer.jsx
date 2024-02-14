import React from 'react'
import { FaInstagram } from "react-icons/fa";
import logo from '../assets/images/Logo1.png';
import { PiTiktokLogo } from "react-icons/pi";
import { RiTwitterXFill } from "react-icons/ri";
import { FiFacebook } from "react-icons/fi";
import { FaLocationDot } from "react-icons/fa6";
import { BsFillTelephoneFill } from "react-icons/bs";
import { IoIosMail } from "react-icons/io";


export const Footer = () => {
  return (
    <>
    <footer className='h-auto md:h-80 justify-center w-full bg-white relative bottom-0'>
        <img className='w-44 m-5 md:w-52 md:my-10 md:ml-10' src={logo} alt="" />
        <div className='md:flex justify-between'>
          <table className=''>
            <tbody>
            <tr>
              <td className='md:pl-16  pb-5 pl-5'>
                <div className='w-10 h-10 text-white justify-center items-center flex text-xl bg-[#3c87ca] rounded-full'>
                  <FaLocationDot/>
                </div>
              </td>
              <td className='md:w-96  pb-5 px-5 md:pl-10 text-sm md:text-base font-body'>
               <b> Alamat</b> <br />Jl. Nglengkong Besi No.15, Area Sawah, Sukoharjo, Kec. Ngaglik, Kabupaten Sleman, Daerah Istimewa Yogyakarta 55581
              </td>
            </tr>
            <tr>
            <td className='md:pl-16  pb-5 pl-5'>
                <div className='w-10 h-10 text-white justify-center items-center flex text-xl bg-[#3c87ca] rounded-full'>
                  <BsFillTelephoneFill/>
                </div>
              </td>
              <td className='md:w-96 pb-5 px-5 md:pl-10 text-sm md:text-base font-body'>
               <b>Telepon</b> <br /> +62 812 9501 2659
              </td>
            </tr>
            <tr>
            <td className='md:pl-16 pl-5 pb-10'>
                <div className='w-10 h-10 text-white justify-center items-center flex text-2xl bg-[#3c87ca] rounded-full'>
                  <IoIosMail />
                </div>
              </td>
              <td className='md:w-96 pb-5 px-5 md:pl-10 text-sm md:text-base font-body'>
               <b>Email</b> <br /> destinasyik@gmail.com
              </td>
            </tr>
            </tbody>
          </table>
          <p className='font-body md:text-base text-sm pl-5 md:leading-relaxed'><b>Tautan</b> <br />Syarat dan Ketentuan <br />Kemitraan Perusahaan <br />Hubungi Kami</p>
          <div className='flex md:hidden w-full justify-between py-10 px-10'>
              <div className='w-10 h-10 bg-[#3c87ca] text-white justify-center items-center flex rounded-md text-2xl '>
                <a href="https://www.instagram.com/destinasyik_?utm_source=ig_web_button_share_sheet&igsh=OGQ5ZDc2ODk2ZA=="><FaInstagram/></a>
              </div>
              <div className='w-10 h-10 bg-[#3c87ca] text-white justify-center items-center flex rounded-md text-2xl '>
              <a href="https://www.facebook.com/profile.php?id=61554670656473&mibextid=LQQJ4d"><FiFacebook/></a>
              </div>
              <div className='w-10 h-10 bg-[#3c87ca] text-white justify-center items-center flex rounded-md text-2xl '>
              <a href="https://www.facebook.com/profile.php?id=61554670656473&mibextid=LQQJ4d"><PiTiktokLogo/></a>
              </div>
              <div className='w-10 h-10 bg-[#3c87ca] text-white justify-center items-center flex rounded-md text-2xl '>
              <a href=""><RiTwitterXFill/></a>
              </div>
          </div>
          <div className='max-md:hidden mr-32 font-body'>
            <p className='font-bold'>Ikuti Kami di :</p>
            <table className=''>
              <tbody>
              <tr>
                <td className='text-2xl hover:text-[#3c87ca] pr-3 pt-3'><a href="https://www.instagram.com/destinasyik_?utm_source=ig_web_button_share_sheet&igsh=OGQ5ZDc2ODk2ZA=="><FaInstagram/></a></td>
                <td className='pt-3'>destinasyik_</td>
              </tr>
              <tr>
                <td className='text-2xl hover:text-[#3c87ca] pr-3 pt-3'><a href="https://www.facebook.com/profile.php?id=61554670656473&mibextid=LQQJ4d"><FiFacebook/></a></td>
                <td className='pt-3'>Destinasyik</td>
              </tr>
              <tr>
                <td className='text-2xl hover:text-[#3c87ca] pr-3 pt-3'><a href="https://www.facebook.com/profile.php?id=61554670656473&mibextid=LQQJ4d"><PiTiktokLogo/></a></td>
                <td className='pt-3'>destinasyik5</td>
              </tr>
              <tr>
                <td className='text-2xl hover:text-[#3c87ca] pr-3 pt-3'><a href=""><RiTwitterXFill/></a></td>
                <td className='pt-3'>Destinasyik</td>
              </tr>
              </tbody>
            </table>
           
          </div>
        </div>
        <div className='w-full flex h-16 items-center justify-center bg-[#3c87ca]'>
        <p className=' font-body text-white absolute md:text-base text-sm text-center '>© 2023 DestinAsyik. All Rights Reserved</p>
        </div>
    </footer>
    </>
    
  )
}
