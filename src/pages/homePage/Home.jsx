import React, { useState } from 'react'
import "./index.css"
import 'bootstrap/dist/css/bootstrap.min.css';
import HomeDesign from "../../assets/HomeDesign.png"
// import Arrow from "../../assets/Arrow.png"
import aws from "../../assets/aws.png"
import azure from "../../assets/azure.png"
import gcp from "../../assets/gcp.png"
import Submit from '../../components/submit/Submit';
import mediaShippers from '../../assets/mediaShippers.png'
import BlueButton from '../../components/blueButton/BlueButton';
import ImageCarousel from '../../components/imageCarousel/imageCarousel';
import arrowblue from '../../assets/arrowblue.png'
import Arrow6 from '../../assets/Arrow 6.png';
import ServicesAccordion from '../../components/servicesAccordion/servicesAccordion';
import contentOperation from '../../assets/contentOperation.png'

import instagram from "../../assets/instagram.png";
import linkedin from "../../assets/linkedin.png";
import youtube from "../../assets/youtube.png";

import axios from 'axios';


function Home() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [organization, setOrganization] = useState('');
  const [region, setRegion] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [message, setMessage] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);  // State to handle loading during form submission
  const [error, setError] = useState(null);  // To capture errors
  const [successMessage, setSuccessMessage] = useState(null);

  

  const handleServiceChange = (event) => {
    setSelectedService(event.target.value);
  };


  const validate = () => {
    let isValid = true;
    let errorMessage = '';

    if (!name) {
      errorMessage += 'Name is required.\n';
      isValid = false;
    }
    if (!email) {
      errorMessage += 'Email is required.\n';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errorMessage += 'Email is invalid.\n';
    }
    if (!organization) {
      errorMessage += 'Organization Name is required.\n';
      isValid = false;
    }
    if (!phone) {
      errorMessage += 'Phone Number is required.\n';
      isValid = false;
    } else if (!/^\d+$/.test(phone)) {  // Check if phone number is numeric
      errorMessage += 'Phone Number must be numeric.\n';
      isValid = false;
    }
    if (!selectedService) {
      errorMessage += 'Service selection is required.\n';
      isValid = false;
    }
    if (!message) {
      errorMessage += 'Message is required.\n';
      isValid = false;
    }

    if (!isValid) {
      setError(errorMessage.trim());
    }

    return isValid;
  };

  // Create an Axios instance with default configuration
const apiInstance = axios.create({
  baseURL: '',
});

// Function to cancel the request if needed
function cancelRequest() {
  apiInstance.cancel('User cancelled the request');
}

  // const handleSubmit = async (e) => {
  //   e.preventDefault(); // Prevent form's default behavior (page reload)

  //   // Validate the form data
  //   if (!validate()) return;

  //   // Set loading state
  //   setIsSubmitting(true);
  //   setError(null); // Clear previous error
  //   setSuccessMessage(null); // Clear success message

  //   // Collect form data into an object
  //   const formData = {
  //     name,
  //     email,
  //     organization,
  //     phone,
  //     selectedService,
  //     message,
  //   };

  //   try {
  //     // Make the POST request to your backend API
  //     const response = await fetch('/api/submitform', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json', // Set the content type to JSON
  //       },
  //       body: JSON.stringify(formData), // Convert form data to JSON
  //     });

  //     const data = await response.json(); // Parse response data

  //     if (response.ok) {
  //       // If submission is successful, show success message and reset form
  //       setSuccessMessage('Form submitted successfully!');
  //       setName('');
  //       setEmail('');
  //       setOrganization('');
  //       setPhone('');
  //       setSelectedService('');
  //       setMessage('');
  //     } else {
  //       setError(data.message || 'Error submitting form');
  //     }
  //   } catch (error) {
  //     setError('There was an error submitting the form');
  //     console.error('Form submission error:', error);
  //   } finally {
  //     // Reset loading state after submission
  //     setIsSubmitting(false);
  //   }
  // };


  const services = [
    'Delivery to OTT Streaming Platforms',
    'Delivery to Film Festivals',
    'Delivery to Censor Board',
    'Dubbing Services',
    'Subtitling Services',
    'QC and Compliance Services',
    'Distribution Services'
  ];

  // const handleSubmit = async (e) => {
  //   e.preventDefault(); // Prevent form's default behavior
  
  //   // Validate the form data (with async validation if needed)
  //   if (!validate()) return;
  
  //   // Set loading state and reset error/success states
  //   setIsSubmitting(true);
  //   setError(null);
  //   setSuccessMessage(null);
  
  //   // Collect form data into an object
  //   const formData = { name, email, organization, phone, selectedService, message };
  
  //   try {
  //     // Use the fetch API efficiently
  //     const response = await fetch('/api/submitform', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(formData), // Send only necessary data
  //     });
  
  //     const data = await response.json(); // Parse the JSON response
  
  //     if (response.ok) {
  //       // Handle success (clear the form)
  //       setSuccessMessage('Form submitted successfully!');
  //       setName('');
  //       setEmail('');
  //       setOrganization('');
  //       setPhone('');
  //       setSelectedService('');
  //       setMessage('');
  //     } else {
  //       // Handle server errors
  //       setError(data.message || 'Error submitting form');
  //     }
  //   } catch (error) {
  //     // Handle any other errors
  //     setError('There was an error submitting the form');
  //     console.error('Form submission error:', error);
  //   } finally {
  //     setIsSubmitting(false); // Reset loading state
  //   }
  // };
  


 // Inside your Form component (Frontend)
const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validate()) return;

  setIsSubmitting(true);
  setError(null);
  setSuccessMessage(null);

  // Normalize the selected service to ensure it matches the expected value
  const normalizedService = selectedService.trim();

  // Collect form data into an object
  const formData = { name, email, organization, phone, selectedService: normalizedService, message };

  try {
    const response = await fetch('/api/submitform', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (response.ok) {
      setSuccessMessage('Form submitted successfully!');
      setName('');
      setEmail('');
      setOrganization('');
      setPhone('');
      setSelectedService('');
      setMessage('');
    } else {
      setError(data.message || 'Error submitting form');
    }
  } catch (error) {
    setError('There was an error submitting the form');
    console.error('Form submission error:', error);
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <div>
      {/* homepage main section */}
      <div className='section' style={{ marginBottom: '0px' }}>
        <div className='container-fluid home-container'>
          <div className='row'>
            <div className='col-md-8  d-flex justify-content-center align-items-center'>
              {/* Content for the left side */}
              <ImageCarousel />
            </div>
            <div className='col-md-4'>
              {/* Content for the right side */}
              <div className='d-flex align-items-center justify-content-center h-auto mt-5'>
                <div className="contact-right-section flex-grow-1 d-flex">
                
                <form className="form-container glass-effect" style={{ flex: 1 }} onSubmit={handleSubmit}>
  <h1 className='align-items-center text-xxl'>Inquiry Form</h1>
  {/* Form Fields */}
  <div className="form-group pt-1">
    <input
      type="text"
      className="form-textarea px-3 py-2 border border-gray-300 rounded-lg placeholder-gray-500 focus:outline-none focus:ring focus:ring-blue-300"
      placeholder="Enter Name"
      value={name}
      onChange={(e) => setName(e.target.value)}
    />
  </div>
  <div className="form-group pt-1">
    <input
      type="email"
      className="form-textarea px-3 py-2 border border-gray-300 rounded-lg placeholder-gray-500 focus:outline-none focus:ring focus:ring-blue-300"
      placeholder="Enter Email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
    />
  </div>
  <div className="form-group pt-1">
    <input
      type="text"
      className="form-textarea px-3 py-2 border border-gray-300 rounded-lg placeholder-gray-500 focus:outline-none focus:ring focus:ring-blue-300"
      placeholder="Enter Organization Name"
      value={organization}
      onChange={(e) => setOrganization(e.target.value)}
    />
  </div>

  <div className="form-group pt-1">
    <input
      type="tel"
      className="form-textarea px-3 py-2 border border-gray-300 rounded-lg placeholder-gray-500 focus:outline-none focus:ring focus:ring-blue-300"
      placeholder="Enter Phone Number"
      value={phone}
      onChange={(e) => setPhone(e.target.value)}
    />
  </div>

  <div className="form-group pt-1">
    <select
      id="service"
      className="form-textarea px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
      style={{
        color: selectedService ? 'black' : '#6B7280',
        width: '23pc',
      }}
      value={selectedService}
      onChange={(e) => setSelectedService(e.target.value)}
    >
      <option value="" disabled>Select your Service</option>
      {services.map((service, index) => (
        <option key={index} value={service}>{service}</option>
      ))}
    </select>
  </div>

  <div className="form-group mb-4 pt-1">
    <textarea
      className="form-textarea px-3 py-2 border border-gray-300 rounded-lg placeholder-gray-500 focus:outline-none focus:ring focus:ring-blue-300"
      rows="4"
      placeholder="Enter your message here"
      value={message}
      onChange={(e) => setMessage(e.target.value)}
    />
  </div>

  {/* Error or Success Messages */}
  {error && (
    <div className="alert alert-danger custom-alert">
      <strong></strong> {error}
    </div>
  )}
  {successMessage && (
    <div className="alert alert-success custom-alert">
      <strong>Success:</strong> {successMessage}
    </div>
  )}

  {/* Submit Button */}
  <div className="flex">
    <button 
      type="submit" 
      disabled={isSubmitting} 
      className="submit-btn"
    >
      {isSubmitting ? 'Submitting...' : 'Submit'}
    </button>
  </div>
</form>

                </div>
              </div>


            </div>
          </div>
        </div>
      </div>
  
          {/* Service accordion starts */}

      <ServicesAccordion />


      {/* Services accordion ends */}



      <div className="section pb-10">
      <div className="dotted-line-break-grey"></div>
  <div className='container mx-auto px-4 py-2 flex flex-col items-center'>
    
    {/* Logo Section */}
    <div className="flex justify-center items-center mb-8 ml-12">
  <img
    className="contact-logo-image"
    src={mediaShippers}
    alt="Logo"
    style={{ width: '60%' }}
  />
</div>
    
 {/* Social Media Icons */}
{/* <div className="social-media-icons-wrapper">
  <div className="d-flex justify-content-center align-items-center">
    <div className="me-3">
      <img src={instagram} alt="Instagram Logo" className="social-icon" />
    </div>
    <div className="me-3">
      <img src={linkedin} alt="LinkedIn Logo" className="social-icon" />
    </div>
    <div className="me-3">
      <img src={youtube} alt="YouTube Logo" className="social-icon" />
    </div>
  </div>
</div> */}

    
    </div>
</div>


  
      {/* Home page contact form section end */}
      {/* <!-- Footer --> */}
      <footer className="bg-custom-blue text-white py-4">
        <div className="container mx-auto text-center">
          <p className="text-sm">© 2024 Shipmedia. All rights reserved.</p>
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
