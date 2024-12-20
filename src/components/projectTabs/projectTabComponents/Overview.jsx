import React, { useState } from 'react';
import './index.css';

function Overview() {
  const [selectedImage, setSelectedImage] = useState(null);

  // Handle file selection and image preview
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result); // Set the image URL to state
      };
      reader.readAsDataURL(file); // Read the file as a data URL
    }
  };

  return (
    <div className="container-fluid overview-container">
      <div className="upload-and-content-container">
        
        {/* Image Upload Box */}
        <div className="image-upload-box">
          {/* Show uploaded image as a preview */}
          {selectedImage ? (
            <img
              src={selectedImage}
              alt="User Profile"
              className="image-preview"
            />
          ) : (
            <p className="placeholder-text">Choose a photo</p>
          )}

          {/* File input for uploading photo inside the box */}
          <label htmlFor="image-upload" className="file-label">
            <input
              type="file"
              id="image-upload"
              accept="image/*"
              onChange={handleImageChange}
              className="file-input"
            />
            Choose File
          </label>
        </div>

        {/* Content Section */}
        <div className="content-container col-md-8">
          <h2>Story or Content</h2>
          <p>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ipsam doloribus, doloremque odio modi quo voluptates sed molestiae architecto atque neque dolorum consequatur laborum cupiditate maxime repellendus inventore laudantium non corrupti autem voluptate tenetur reiciendis. Quasi ea ipsum corrupti ullam sed tempora quisquam nisi molestias at dolores, adipisci error optio beatae reprehenderit dignissimos modi amet fugiat asperiores assumenda voluptate officia vero libero obcaecati. Soluta ipsam doloremque, ex minus modi ea accusantium?
          </p>
          <p>
            Phasellus consequat quam id sem blandit, vel gravida nunc tristique. Proin vulputate lorem vitae auctor scelerisque. In congue purus eu risus consectetur, ac faucibus felis euismod. Ut venenatis mollis magna, sed vehicula risus dictum sit amet. Donec vestibulum, metus id aliquet finibus, metus orci ultricies purus, vel auctor elit mi sit amet risus.
          </p>
          {/* Add more paragraphs as needed */}
        </div>
      </div>
    </div>
  );
}

export default Overview;
