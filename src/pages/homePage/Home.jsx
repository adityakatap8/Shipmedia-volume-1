import React from 'react'
import "./index.css"
import 'bootstrap/dist/css/bootstrap.min.css';
import HomeDesign from "../../assets/HomeDesign.png"
import Arrow from "../../assets/Arrow.png"
import aws from "../../assets/aws.png"
import azure from "../../assets/azure.png"
import gcp from "../../assets/gcp.png"
import Submit from '../../components/submit/Submit';
import ShipmediaLogo2 from '../../assets/ShipmediaLogo2.png'
import BlueButton from '../../components/BlueButton/BlueButton';

function Home() {
  return (
    <div>
      {/* homepage main section */}
      <div className='section'>
        <div className='container-fluid home-container'>
          <div className='row'>
            <div className='col-md-4 pt-12 pl-24'>
              <img className='home-image img-fluid' src={HomeDesign} alt="Home Design" />
            </div>

            <div className='col-md-8 d-flex align-items-center'>
              <div className='align-items-center'>
                {/* <img className='img-fluid' src={HomeMainContent} alt="Home Main Content" /> */}
                <h1 className='text-5xl font-bold text-white text-left'>Ingest</h1>
                <p className='text-xl font-thin text-white h-8 w-40 pt-4 text-left'>Ingest Or Upload Desired Files</p>
              </div>
              <div className='align-items-center'>
                <img src={Arrow} className='h-8 w-24' alt="" />
              </div>

              <div className='align-items-center pl-4'>
                {/* <img className='img-fluid' src={HomeMainContent} alt="Home Main Content" /> */}
                <h1 className='text-5xl font-bold text-white text-left'>Convert</h1>
                <p className='text-xl font-thin text-white h-8 w-40 pt-4 text-left'>Choose a Format to Convert</p>
              </div>
              <div className='align-items-center pl-4'>
                <img src={Arrow} className='h-8 w-24' alt="" />
              </div>

              <div className='align-items-center pl-4'>
                {/* <img className='img-fluid' src={HomeMainContent} alt="Home Main Content" /> */}
                <h1 className='text-5xl font-bold text-white text-left'>Deliver</h1>
                <p className='text-xl font-thin text-white h-8 w-40 pt-4 text-left'>Select your Desired
                  Location for Delivery</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* homepage second section */}
      <div className='section pt-16'>
        <div className='container bg-custom-gray-400 p-4 text-white'>
          <div className='row'>
            <div className='col-md-6'>
              <h1 className='text-6xl font-bold text-left text-custom-blue'>Customize your settings as per your need </h1>
              <p className='text-black text-left pt-5'>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.</p>
            </div>
            <div className='col-md-6 d-flex border-box'>
              <div><img className='aws-box' src={aws} alt="" /></div>
              <div><img className='gcp-box' src={gcp} alt="" /></div>
              <div><img className='azure-box' src={azure} alt="" /></div>
            </div>
          </div>
        </div>
      </div>


      {/* homepage plans section */}
      <div className='section pt-48'>
        <div className='pb-12'>
          <h3 className='text-custom-blue text-3xl'>We are here to understand and Deliver the Best Plans as per your needs</h3>
        </div>
        <div className='plans-container'>
          {/* plans row 1 start */}
          <div className='row d-flex'>
            <div className='col d-flex'>
              <div className='w-64 h-40 box'>
                <div className='px-auto align-center pt-12'>
                  <h1 className='text-custom-blue text-4xl'>Core</h1>
                  <h1 className='text-custom-blue text-2xl'>(on demand)</h1>
                </div>
              </div>
            </div>
            <div className='col d-flex'>
              <div className='w-64 h-40 box'>
                <div className='px-auto pt-16'>
                  <h1 className='font-bold text-custom-blue'>Upload Speed</h1>
                  <h1 className='font-bold text-custom-blue'>100/MBPS</h1>
                </div>
              </div>
            </div>
            <div className='col d-flex'>
              <div className='w-64 h-40 box'>
                <div className='px-auto align-center pt-10'>
                  <ul class="list-disc list-inside space-y-2">
                    <li class="flex items-center text-custom-blue font-bold">
                      <i class="fas fa-check text-custom-blue mr-2"></i>
                      Each Credit $2/GB
                    </li>
                    <li class="flex items-center text-custom-blue font-bold">
                      <i class="fas fa-check text-custom-blue mr-2"></i>
                      Unlimited Conversions
                    </li>
                    <li class="flex items-center text-custom-blue font-bold">
                      <i class="fas fa-check mr-2"></i>
                      Watchfolder
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className='col d-flex'>
              <div className='w-64 h-40 no-box pt-12'>
                <div className='px-auto align-center'>
                  <div>
                  <BlueButton lable="Buy Credits" to="/Register" /> 
                  </div>
                </div>
              </div>
            </div>

            <div className='flex justify-center pt-12'>
              <hr className='line-break' />
            </div>

          </div>

          {/* plans row 1 end */}

          {/* plans row 2 start */}
          <div className='row d-flex pt-8'>
            <div className='col d-flex'>
              <div className='w-64 h-40 box'>
                <div className='px-auto align-center pt-12'>
                  <h1 className='text-custom-blue text-4xl'>Core</h1>
                  <h1 className='text-custom-blue text-2xl'>(on demand)</h1>
                </div>
              </div>
            </div>
            <div className='col d-flex'>
              <div className='w-64 h-40 box'>
                <div className='px-auto pt-16'>
                  <h1 className='font-bold text-custom-blue'>Upload Speed</h1>
                  <h1 className='font-bold text-custom-blue'>100/MBPS</h1>
                </div>
              </div>
            </div>
            <div className='col d-flex'>
              <div className='w-64 h-40 box'>
                <div className='px-auto align-center pt-10'>
                  <ul class="list-disc list-inside space-y-2">
                    <li class="flex items-center text-custom-blue font-bold">
                      <i class="fas fa-check text-custom-blue mr-2"></i>
                      Each Credit $2/GB
                    </li>
                    <li class="flex items-center text-custom-blue font-bold">
                      <i class="fas fa-check text-custom-blue mr-2"></i>
                      Unlimited Conversions
                    </li>
                    <li class="flex items-center text-custom-blue font-bold">
                      <i class="fas fa-check mr-2"></i>
                      Watchfolder
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className='col d-flex'>
              <div className='w-64 h-40 no-box pt-12'>
                <div className='px-auto align-center'>
                  <div>
                    <h1 className='text-custom-blue text-4xl font-bold pb-3'>$199</h1>
                    <BlueButton lable="Subscribe" to="/Register" />
                  </div>
                </div>
              </div>
            </div>

            <div className='flex justify-center pt-12'>
              <hr className='line-break' />
            </div>

          </div>
          {/* plans row 2 end */}

          {/* plans row 3 start */}
          <div className='row d-flex pt-8'>
            <div className='col d-flex'>
              <div className='w-64 h-40 box'>
                <div className='px-auto align-center pt-12'>
                  <h1 className='text-custom-blue text-4xl'>Core</h1>
                  <h1 className='text-custom-blue text-2xl'>(on demand)</h1>
                </div>
              </div>
            </div>
            <div className='col d-flex'>
              <div className='w-64 h-40 box'>
                <div className='px-auto pt-16'>
                  <h1 className='font-bold text-custom-blue'>Upload Speed</h1>
                  <h1 className='font-bold text-custom-blue'>100/MBPS</h1>
                </div>
              </div>
            </div>
            <div className='col d-flex'>
              <div className='w-64 h-40 box'>
                <div className='px-auto align-center pt-10'>
                  <ul class="list-disc list-inside space-y-2">
                    <li class="flex items-center text-custom-blue font-bold">
                      <i class="fas fa-check text-custom-blue mr-2"></i>
                      Each Credit $2/GB
                    </li>
                    <li class="flex items-center text-custom-blue font-bold">
                      <i class="fas fa-check text-custom-blue mr-2"></i>
                      Unlimited Conversions
                    </li>
                    <li class="flex items-center text-custom-blue font-bold">
                      <i class="fas fa-check mr-2"></i>
                      Watchfolder
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className='col d-flex'>
              <div className='w-64 h-40 no-box pt-8'>
                <div className='px-auto align-center'>
                  <div>
                    <h1 className='text-custom-blue text-4xl font-bold pb-3'>$399</h1>
                    <BlueButton lable="Subscribe" to="/Register" /> 
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* plans row 3 end */}



        </div>
      </div>







      {/* Home page contact form section */}
      <div className='section pt-48 pb-20'>
        <div className='container'>
          <div className='row'>
            <h2 className='mb-5' style={{ textAlign: 'center', fontSize: '40px', fontWeight: '700', color: '#3754B9' }}>Contact Us</h2>
            <div className='col-md-6'>
              <div className="contact-right-section flex-grow-1 d-flex">
                <form className="form-container">

                  <div className="form-group pt-1">
                    <input type="text" className="form-textarea px-3 py-2 border border-black-300 rounded-lg placeholder-gray-500 focus:outline-none focus:ring focus:ring-blue-300" placeholder="Enter Name" />
                  </div>
                  <div className="form-group pt-1">
                    <input type="email" className="form-textarea px-3 py-2 border border-gray-300 rounded-lg placeholder-gray-500 focus:outline-none focus:ring focus:ring-blue-300" placeholder="Enter Email" />
                  </div>

                  <div className="form-group mb-4 pt-1">
                    <textarea
                      className="form-textarea px-3 py-2 border border-gray-300 rounded-lg placeholder-gray-500 focus:outline-none focus:ring focus:ring-blue-300"
                      rows="4"
                      placeholder="Enter your message here"
                    />
                  </div>
                  <div className="mb-4 flex">
                    <Submit lable="Submit" />
                  </div>
                </form>
              </div>
            </div>

            <div className='col-md-6 px-auto flex items-center contact-left-section'>
              <img className='contact-logo-image mx-auto' src={ShipmediaLogo2} alt="" />
            </div>
          </div>
        </div>
      </div>

      {/* <!-- Footer --> */}
      <footer class="bg-custom-blue text-white py-4">
        <div class="container mx-auto text-center">
          <p class="text-sm">© 2024 Shipmedia. All rights reserved.</p>
          {/* <p class="text-sm">1234 Street Address, City, State, 12345</p>
      <p class="text-sm">Follow us on 
        <a href="#" class="underline">Social Media</a>
      </p> */}
        </div>
      </footer>


    </div>
  )
}

export default Home
