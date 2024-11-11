// import React, { useState } from 'react';
// import { Tooltip } from 'bootstrap';

// const CodecSettings = ({ goToNextTab, goToPreviousTab }) => {

//     const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);
//     const [isQCCheckboxChecked, setIsQCCheckboxChecked] = useState(false);
//     const [isFileTransferCheckboxChecked, setIsFileTransferCheckboxChecked] = useState(false);
//     const [enableSection, setEnableSection] = useState(false);

//     const [selectedCard, setSelectedCard] = useState(1); // Default to first card
//     const [selectedQc, setSelectedQc] = useState(1);     // Default to first quality check
//     const [selectedFileTransfer, setSelectedFileTransfer] = useState(1); // Default to first option

//     const [selectedServices, setSelectedServices] = useState([]);
//     const [isEditing, setIsEditing] = useState(false); // New state for edit mode

//     const [selectedOptions, setSelectedOptions] = useState({
//         codec: [],          // Store selected codec ids
//         qualityCheck: [],    // Store selected QC ids
//         fileTransfer: []     // Store selected file transfer ids
//       });

//     const toggleCheckboxCodec = () => {
//         setIsCheckboxChecked(prevState => !prevState);
//     };

//     const toggleCheckboxQC = () => {
//         setIsQCCheckboxChecked(prevState => !prevState);
//     };

//     const toggleCheckboxFileTransfer = () => {
//         setIsFileTransferCheckboxChecked(prevState => !prevState);
//     };



//     const cards = [
//         { id: 1, title: 'MOV PRO RES HD ', container: 'MOV', videocodec: 'Pro-res 422', size: '1920X1080', resolution: 'HD', framerate: 'Same As Source', scantype: 'Progressive', vbitdepth: '10 bits', chromasubsampling: '422', videobitrate: '100mbps', HDR: 'No', audiocodec: 'PCM', samplerate: '48khz', abitdepth: '24', audiotrack: 'Same As Source' },
//         { id: 2, title: 'MXF HD', container: 'MXF', videocodec: 'Mpeg 2', size: '1920X1080', resolution: 'HD', framerate: 'Same As Source', scantype: 'Progressive', vbitdepth: '10 bits', chromasubsampling: '422', videobitrate: '100mbps', HDR: 'No', audiocodec: 'PCM', samplerate: '48khz', abitdepth: '24', audiotrack: 'Same As Source' },
//         { id: 3, title: 'MXF AVC HD', container: 'MXF', videocodec: 'AVC Intra', size: '1920X1080', resolution: 'HD', framerate: 'Same As Source', scantype: 'Progressive', vbitdepth: '10 bits', chromasubsampling: '422', videobitrate: '100mbps', HDR: 'No', audiocodec: 'PCM', samplerate: '48khz', abitdepth: '24', audiotrack: 'Same As Source' },
//         { id: 4, title: 'MPG H.264 AAC', container: 'MPG', videocodec: 'H.264', size: '1920X1080', resolution: 'HD', framerate: 'Same As Source', scantype: 'Progressive', vbitdepth: '10 bits', chromasubsampling: '422', videobitrate: '50mbps', HDR: 'No', audiocodec: 'AAC', samplerate: '48khz', abitdepth: '24', audiotrack: 'Same As Source' },
//         { id: 5, title: 'MPG MPEG2', container: 'MPG', videocodec: 'Mpeg 2', size: '1920X1080', resolution: 'HD', framerate: 'Same As Source', scantype: 'Progressive', vbitdepth: '10 bits', chromasubsampling: '422', videobitrate: '50mbps', HDR: 'No', audiocodec: 'MPEG2 Layer II', samplerate: '48khz', abitdepth: '24', audiotrack: 'Same As Source' },
//         { id: 6, title: 'MP4 H.264', container: 'Mp4', videocodec: 'H.264', size: '1920X1080', resolution: 'HD', framerate: 'Same As Source', scantype: 'Progressive', vbitdepth: '10 bits', chromasubsampling: '422', videobitrate: '50mbps', HDR: 'No', audiocodec: 'AAC', samplerate: '48khz', abitdepth: '24', audiotrack: 'Same As Source' },
//         { id: 7, title: 'MP4 HEVC', container: 'Mp4', videocodec: 'H.265', size: '1920X1080', resolution: 'HD', framerate: 'Same As Source', scantype: 'Progressive', vbitdepth: '10 bits', chromasubsampling: '422', videobitrate: '50mbps', HDR: 'No', audiocodec: 'AAC', samplerate: '48khz', abitdepth: '24', audiotrack: 'Same As Source' },
//         { id: 8, title: 'MOV PRO RES UHD', container: 'MOV', videocodec: 'Pro-res 422', size: '3840X2160', resolution: 'UHD', framerate: 'Same As Source', scantype: 'Progressive', vbitdepth: '10 bits', chromasubsampling: '422', videobitrate: '300mbps', HDR: 'No', audiocodec: 'PCM', samplerate: '48khz', abitdepth: '24', audiotrack: 'Same As Source' },
//         { id: 9, title: 'MOV PRO RES HQ UHD', container: 'MOV', videocodec: 'Pro-res 422 HQ', size: '3840X2160', resolution: 'UHD', framerate: 'Same As Source', scantype: 'Progressive', vbitdepth: '10 bits', chromasubsampling: '422', videobitrate: '300mbps', HDR: 'No', audiocodec: 'PCM', samplerate: '48khz', abitdepth: '24', audiotrack: 'Same As Source' },
//         { id: 10, title: 'MOV Pro XQ UHD', container: 'MOV', videocodec: 'Pro-res 422 XQ', size: '3840X2160', resolution: 'UHD', framerate: 'Same As Source', scantype: 'Progressive', vbitdepth: '12 bits', chromasubsampling: '444', videobitrate: '300mbps', HDR: 'Dolby Vision', audiocodec: 'PCM', samplerate: '48khz', abitdepth: '24', audiotrack: 'Same As Source' },
//         { id: 11, title: 'Original', container: 'N/A', videocodec: 'N/A', size: 'N/A', resolution: 'N/A', framerate: 'N/A', scantype: 'N/A', vbitdepth: 'N/A', chromasubsampling: 'N/A', videobitrate: 'N/A', HDR: 'N/A', audiocodec: 'N/A', samplerate: 'N/A', abitdepth: 'N/A', audiotrack: 'N/A' },
//     ];

//     const qualityCheck = [
//         { id: 1, title: 'Container Checks', container: 'Content layout, Slates, Closed Caption, Duration, File size, Audio/Video duration mismatch, Compare System to elementary metadata, Timecode checks, Teletext, Packet size, Ancillary data, Number of audio/video streams,Synchronization' },
//         { id: 2, title: 'Compliance Checks', container: 'DPP compliance, Digital Cinema compliance, IMF compliance, CableLabs VOD compliance, ARD_ZDF_HDFcompliance, AS02 / AS03 / AS10 / AS11 compliance, TR101 290, ARIB specifications, DPI compliance Compliance Checks HDR' },
//         { id: 3, title: 'Video Checks', container: 'HDR Quality checks incl. SMPTE 2084 EOTF, lightness level (MaxFALL and MaxCLL), ST 2086, and ITU-R BT. 2020 compliance etc., Frame rate, Bit rate, Frame size, Aspect ratio, Duration, Resolution, Video format, Picture scanning type, AFD, GOP, Color format, Quantization parameter, Blockiness, Blurriness, Moiré pattern, Mosquito noise, Pixelation, Ringing artifact, Telecine/ cadence analysis, Combing errors, Field dominance, Field order, Duplicate frames, Freeze frames, Motion jerk, Ofcom- compliant Flash/ PSE (Flashy video), Action safe area, Blackbars, Black frames, Blank frames, Color bars, Color banding, Credits, Ghosting artifact, Image presence, Shot transition, Color gamut, Upconversion, Luma/Chroma levels, Video noise, Chroma change, Defective pixels, Halfline blanking, Video dropout, Brightness, Contrast, White point, 3D experience, Image tilting, Burnt-in text detection, VBI Lines detection, Flicker, Logo detection, Offline media, Pattern Noise, Black and White Frames, Sawtooth Artifact, Digital Ghosting Artifact, Scratch Artifact, De-interlaced Jerk, Flicker, Frame Jump, Compression Score, Aliasing, Pulldown Judder, Solarization, Half Flash, Pulsing Noise, Composite Signal Level, Progressive Segmented Frame(PsF), Frame Jump, Content Complexity' },
//         { id: 4, title: 'Audio Checks', container: 'Kantar BVS Watermark, Audio language detection, Audio level (Min, max, avg), Dialnorm, Level mismatch, Loudness compliance (ITU, EBU, CALM Act, OP59, ARIB) (BS.1770-1, -2,-3), PPM meter, Silence, Crackle, Background noise, Colored noise, High frequency noise, Jitter noise, Line Pattern noise, Transient noise, Overmodulation noise, Echo, Wow & Flutter, Audio Impulsive Noise, Nielsen & Cinavia watermark, Click and pop, Clipping, Audio dropout, EAS tones, Misplaced channels, Phase detection, Stereo pair detection,Test tones, DPLM, Bitdepth upconversion detection, Repetitive pattern detection, Spectral aliasing detection, Audio impulse noise, Teletrax watermark, Basic alignment of speech with captions detection, Reverb, Beep, Multi reel audio click noise, Low Pass Filter' },
//         { id: 5, title: 'Data Checks', container: 'Subtitle analysis and language detection, Burnt-in text detection and analysis, Closed Captions, DPI messages. Display Duration, Character Count, Spell check, IMSC1 profile Validation, Character Code Table, Subtitle Position, Caption/Subtitle Alignment, Dropout, Display Duration, 608/708 Specific Checks, XDS Checks' },
//         { id: 6, title: 'Content Classification Checks', container: 'Explicit, Health Advisory Products, General Scene Classification, Violence, Keyword Detection, Strong Language Detection' },
//         { id: 7, title: 'Eyeball Checks', container: '' },

//     ];
//     const fileTransfer = [
//         { id: 1, title: 'Storage on the Cloud' },
//         { id: 2, title: 'BackUp on the Cloud' },
//         { id: 3, title: 'Archive Tapes Restoration and Digitization' },
//     ];

//     // const [selectedCard, setSelectedCard] = useState(cards[0].id);
//     // const [selectedQc, setSelectedQc] = useState(qualityCheck[0].id)
//     // const [selectedFileTransfer, setSelectedFileTransfer] = useState(fileTransfer[0].id)

//     const details = selectedCard
//         ? cards.find((card) => card.id === selectedCard)
//         : { title: '', codec: '', frameRate: '', duration: '' };

//     const QCdetails = selectedQc
//         ? qualityCheck.find((qualityCheck) => qualityCheck.id === selectedQc)
//         : { title: '', codec: '', frameRate: '', duration: '' };

//     const FileTransferDetails = selectedFileTransfer
//         ? fileTransfer.find((fileTransfer) => fileTransfer.id === selectedFileTransfer)
//         : { title: '', codec: '', frameRate: '', duration: '' };

//         // Toggle card selection
// const handleCardSelection = (cardId) => {
//     setSelectedCards((prevSelected) => {
//       if (prevSelected.includes(cardId)) {
//         return prevSelected.filter(id => id !== cardId); // Remove if already selected
//       }
//       return [...prevSelected, cardId]; // Add card if not selected
//     });
//   };
  
//   // Create the getServiceData function to work with selected card IDs
//   const getServiceData = () => {
//     const services = {};
  
//     // Codec Service - handle multiple selected cards
//     if (isCheckboxChecked && selectedCards.length > 0) {
//       services.codecService = selectedCards.map(cardId => {
//         const card = cards.find(c => c.id === cardId);
//         return {
//           videoCodec: card?.videocodec,
//           audioCodec: card?.audiocodec,
//           resolution: card?.resolution,
//           bitRate: card?.videobitrate,
//           // Add other relevant data here
//         };
//       });
//     }
  
//     // Quality Check Service
//     if (isQCCheckboxChecked) {
//       services.qualityCheck = {
//         containerChecks: qualityCheck.find(q => q.id === selectedQc)?.container.split(','),
//       };
//     }
  
//     // File Transfer Service
//     if (isFileTransferCheckboxChecked) {
//       services.fileTransfer = {
//         selectedOption: fileTransfer.find(f => f.id === selectedFileTransfer)?.title,
//       };
//     }
  
//     return services;
//   };

//     // const getServiceData = () => {
//     //     const services = {};

//     //     // Codec Service
//     //     if (isCheckboxChecked) {
//     //         services.codecService = {
//     //             videoCodec: details.videocodec,
//     //             audioCodec: details.audiocodec,
//     //             resolution: details.resolution,
//     //             bitRate: details.videobitrate,
//     //             // Add other relevant data here
//     //         };
//     //     }

//     //     // Quality Check Service
//     //     if (isQCCheckboxChecked) {
//     //         services.qualityCheck = {
//     //             containerChecks: qualityCheck.find(q => q.id === selectedQc)?.container.split(','),
//     //             // Add other relevant quality check data if needed
//     //         };
//     //     }

//     //     // File Transfer and Packaging Service
//     //     if (isFileTransferCheckboxChecked) {
//     //         services.fileTransfer = {
//     //             selectedOption: fileTransfer.find(f => f.id === selectedFileTransfer)?.title,
//     //             // Add other details if needed
//     //         };
//     //     }

//     //     return services;
//     // };


//     // const handleSave = async () => {
//     //     setIsSaving(true);
//     //     const selectedServices = [];

//     //     const serviceMappings = {
//     //         codec: cards,
//     //         qualityCheck: qualityCheck,
//     //         fileTransfer: fileTransfer,
//     //     };

//     //     // Check and add selected services
//     //     if (isCheckboxChecked) {
//     //         const selectedCodecSettings = serviceMappings.codec.find(item => item.id === selectedCard);
//     //         if (selectedCodecSettings) {
//     //             selectedServices.push({
//     //                 serviceType: 'codec',
//     //                 settings: selectedCodecSettings,
//     //             });
//     //         }
//     //     }

//     //     if (isQCCheckboxChecked) {
//     //         const selectedQcSettings = serviceMappings.qualityCheck.find(item => item.id === selectedQc);
//     //         if (selectedQcSettings) {
//     //             selectedServices.push({
//     //                 serviceType: 'qualityCheck',
//     //                 settings: selectedQcSettings,
//     //             });
//     //         }
//     //     }

//     //     if (isFileTransferCheckboxChecked) {
//     //         const selectedFileTransferSettings = serviceMappings.fileTransfer.find(item => item.id === selectedFileTransfer);
//     //         if (selectedFileTransferSettings) {
//     //             selectedServices.push({
//     //                 serviceType: 'fileTransfer',
//     //                 settings: selectedFileTransferSettings,
//     //             });
//     //         }
//     //     }

//     //     console.log("Selected Services:", selectedServices);

//     //     if (selectedServices.length === 0) {
//     //         console.error("No services selected.");
//     //         setSuccessMessage("Please select at least one service.");
//     //         setIsSaving(false);
//     //         return;
//     //     }

//     //     const dataToSend = {
//     //         services: selectedServices,
//     //     };

//     //     console.log("Data to send:", JSON.stringify(dataToSend, null, 2));

//     //     try {
//     //         const response = await fetch('http://localhost:3000/api/services', {
//     //             method: 'POST',
//     //             headers: {
//     //                 'Content-Type': 'application/json',
//     //             },
//     //             body: JSON.stringify(dataToSend),
//     //         });

//     //         if (response.ok) {
//     //             const result = await response.json();
//     //             console.log('Response Data:', result);
//     //             setSelectedServices(result.data); // Save the selected services in state
//     //             setSuccessMessage("Successfully saved the selected services.");
//     //             setIsEditing(false); // Hide the main div
//     //         } else {
//     //             const errorResponse = await response.json();
//     //             console.error(`Failed to save: ${response.status} ${response.statusText}`);
//     //             console.error('Response body:', errorResponse);
//     //             setSuccessMessage(`Failed to save the options. Status: ${response.status} ${response.statusText}`);
//     //         }
//     //     } catch (error) {
//     //         console.error('Error occurred during the save operation:', error);
//     //         const errorMessage = error instanceof Error ? error.message : 'Unknown error';
//     //         setSuccessMessage(`An error occurred while saving the options. Details: ${errorMessage}`);
//     //     } finally {
//     //         setIsSaving(false);
//     //     }
//     // };

    

//     const handleSelection = (service, id) => {
//         setSelectedOptions(prev => {
//           const updatedSelections = prev[service].includes(id)
//             ? prev[service].filter(itemId => itemId !== id)  // Deselect if already selected
//             : [...prev[service], id];  // Select the item if not selected
      
//           return { ...prev, [service]: updatedSelections };
//         });
//       };
      
//     const handleSave = async () => {
//         setIsSaving(true);
//         const selectedServices = [];
      
//         const serviceMappings = {
//           codec: cards,
//           qualityCheck: qualityCheck,
//           fileTransfer: fileTransfer,
//         };
      
//         // Check and add selected services
//         if (isCheckboxChecked && selectedCards.length > 0) {
//           selectedCards.forEach((cardId) => {
//             const selectedCodecSettings = serviceMappings.codec.find(item => item.id === cardId);
//             if (selectedCodecSettings) {
//               selectedServices.push({
//                 serviceType: 'codec',
//                 settings: selectedCodecSettings,
//               });
//             }
//           });
//         }
      
//         if (isQCCheckboxChecked) {
//           const selectedQcSettings = serviceMappings.qualityCheck.find(item => item.id === selectedQc);
//           if (selectedQcSettings) {
//             selectedServices.push({
//               serviceType: 'qualityCheck',
//               settings: selectedQcSettings,
//             });
//           }
//         }
      
//         if (isFileTransferCheckboxChecked) {
//           const selectedFileTransferSettings = serviceMappings.fileTransfer.find(item => item.id === selectedFileTransfer);
//           if (selectedFileTransferSettings) {
//             selectedServices.push({
//               serviceType: 'fileTransfer',
//               settings: selectedFileTransferSettings,
//             });
//           }
//         }
      
//         console.log("Selected Services:", selectedServices);
      
//         if (selectedServices.length === 0) {
//           console.error("No services selected.");
//           setSuccessMessage("Please select at least one service.");
//           setIsSaving(false);
//           return;
//         }
      
//         const dataToSend = {
//           services: selectedServices, // Send selected service details
//         };
      
//         console.log("Data to send:", JSON.stringify(dataToSend, null, 2));
      
//         try {
//           const response = await fetch('http://localhost:3000/api/services', {
//             method: 'POST',
//             headers: {
//               'Content-Type': 'application/json',
//             },
//             body: JSON.stringify(dataToSend),
//           });
      
//           if (response.ok) {
//             const result = await response.json();
//             console.log('Response Data:', result);
//             setSelectedServices(result.data); // Save the selected services in state
//             setSuccessMessage("Successfully saved the selected services.");
//             setIsEditing(false); // Hide the main div
//           } else {
//             const errorResponse = await response.json();
//             console.error(`Failed to save: ${response.status} ${response.statusText}`);
//             setSuccessMessage(`Failed to save the options. Status: ${response.status} ${response.statusText}`);
//           }
//         } catch (error) {
//           console.error('Error occurred during the save operation:', error);
//           const errorMessage = error instanceof Error ? error.message : 'Unknown error';
//           setSuccessMessage(`An error occurred while saving the options. Details: ${errorMessage}`);
//         } finally {
//           setIsSaving(false);
//         }
//       };




//     // const [selectedOptions, setSelectedOptions] = useState({
//     //     codec: null,
//     //     qualityCheck: null,
//     //     fileTransfer: null,
//     // });

//     const [isSaving, setIsSaving] = useState(false);
//     const [successMessage, setSuccessMessage] = useState('');

//     return (
//         <div>
//             {!successMessage ? (
//                 <div>
//                     {/* Your main content div here */}
//                     <div className='border-2 rounded-3xl border-customGrey-300 text-left mt-4'
//                         data-bs-toggle="tooltip"
//                         data-bs-placement="top"
//                         title="please check the box to add this service for your order"
//                     >  <input
//                             type="checkbox"
//                             checked={isCheckboxChecked}
//                             onChange={toggleCheckboxCodec}
//                             className="mr-2 cursor-pointer border-2 rounded-3xl border-customGrey-300 p-8 mt-4 mb-4 m-4"
//                         />
//                         <span>Codec Service</span></div>

//                     {/* codec settings start */}
//                     <div
//                         className={`flex h-screen border-2 rounded-3xl border-customGrey-300 p-8 mt-4 mb-4 m-4 ${!isCheckboxChecked ? 'opacity-50 pointer-events-none' : ''}`}
//                         style={{
//                             transition: 'opacity 0.3s ease',
//                         }}
//                     >
//                         {/* Left side with cards */}
//                         <div className="w-2/3 overflow-y-auto pr-4">
//     <h2 className="text-xl font-semibold mb-4">Presets</h2>
//     <div className="grid grid-cols-3 gap-4">
//       {cards.map((card) => (
//         <button
//           key={card.id}
//           className={`p-4 text-black border-2 border-gray-300 rounded-3xl text-center ${selectedOptions.codec.includes(card.id) ? 'bg-customBlue-700 border-customCardBlue-700 text-white' : 'border-gray-300'}`}
//           onClick={() => isCheckboxChecked && handleSelection('codec', card.id)}
//           disabled={!isCheckboxChecked}
//         >
//           <h3 className="text-sm font-bold">{card.title}</h3>
//           <p className="text-xs text-white-600">{card.videocodec}/{card.audiocodec}</p>
//         </button>
//       ))}
//     </div>
//   </div>

//                         {/* Right side with details */}
//                         <div className="w-1/2 ml-6 bg-white p-6 rounded-3xl shadow text-left overflow-y-auto pr-4">
//                             <h2 className="text-xl font-semibold mb-2">{details.title}</h2>
//                             <hr className='mb-4' />
//                             <h2 className="text-xl font-semibold mb-4">Video Codec</h2>
//                             <div className="grid grid-cols-2 gap-x-8 gap-y-2">
//                                 <div><p><strong>Container</strong></p></div>
//                                 <div><p><strong>Video Codec</strong></p></div>
//                                 <div><p>{details.container}</p></div>
//                                 <div><p>{details.videocodec}</p></div>
//                                 <div><p><strong>Size</strong></p></div>
//                                 <div><p><strong>Resolution</strong></p></div>
//                                 <div><p>{details.size}</p></div>
//                                 <div><p>{details.resolution}</p></div>
//                                 <div><p><strong>Frame Rate</strong></p></div>
//                                 <div><p><strong>Scan Type</strong></p></div>
//                                 <div><p>{details.framerate}</p></div>
//                                 <div><p>{details.scantype}</p></div>
//                                 <div><p><strong>Bit Depth</strong></p></div>
//                                 <div><p><strong>Chroma Subsampling</strong></p></div>
//                                 <div><p>{details.vbitdepth}</p></div>
//                                 <div><p>{details.chromasubsampling}</p></div>
//                                 <div><p><strong>Video Bit Rate</strong></p></div>
//                                 <div><p><strong>HDR</strong></p></div>
//                                 <div><p>{details.videobitrate}</p></div>
//                                 <div><p>{details.HDR}</p></div>
//                             </div>
//                             <hr className='m-4' />
//                             <h2 className="text-xl font-semibold mb-4">Audio Codec</h2>
//                             <div className="grid grid-cols-2 gap-x-8 gap-y-2">
//                                 <div><p><strong>Audio Codec</strong></p></div>
//                                 <div><p><strong>Sample Rate</strong></p></div>
//                                 <div><p>{details.audiocodec}</p></div>
//                                 <div><p>{details.samplerate}</p></div>
//                                 <div><p><strong>Bit Depth</strong></p></div>
//                                 <div><p><strong>Audio Track</strong></p></div>
//                                 <div><p>{details.abitdepth}</p></div>
//                                 <div><p>{details.audiotrack}</p></div>
//                             </div>
//                         </div>
//                     </div>

//                     <style jsx>{`
//   .opacity-50 {
//     opacity: 0.5;
//   }
//   .pointer-events-none {
//     pointer-events: none;
//   }
// `}</style>

//                     {/* codec settings end */}
//                     <div>


//                         {/* Quality Check  start*/}
//                         <div>
//                             {/* Quality Check Section */}
//                             <div className=''>
//                                 <div className='border-2 rounded-3xl border-customGrey-300 text-left mt-4'>
//                                     <input
//                                         type="checkbox"
//                                         checked={isQCCheckboxChecked}
//                                         onChange={toggleCheckboxQC}
//                                         className="mr-2 cursor-pointer border-2 rounded-3xl border-customGrey-300 p-8 mt-4 mb-4 m-4"
//                                     />
//                                     <span>Quality Check Service</span>
//                                 </div>
//                                 <div className={` ${!isQCCheckboxChecked ? 'opacity-50 pointer-events-none' : ''}`}>
//                                     <div className="flex h-screen border-2 rounded-3xl border-customGrey-300 p-8 mt-4 mb-8 m-4">
//                                         {/* Left side with cards */}
//                                         <div className="w-2/3 overflow-y-auto pr-4 flex">
//                                             <div className="w-full overflow-y-auto pr-4 mb-8">
//                                                 <h2 className="text-xl font-semibold mb-4">Quality Check</h2>
//                                                 <div className="grid grid-cols-3 gap-4">
//                                                     {qualityCheck.map((qc) => (
//                                                         <button
//                                                             key={qc.id}
//                                                             className={`p-4 text-black border-2 border-gray-300 rounded-3xl text-center ${selectedQc === qc.id ? 'bg-customBlue-700 border-customCardBlue-700 text-white' : ''}`}
//                                                             onClick={() => isQCCheckboxChecked && setSelectedQc(qc.id)}
//                                                             disabled={!isQCCheckboxChecked}
//                                                         >
//                                                             <h3 className="text-sm font-bold">{qc.title}</h3>
//                                                         </button>
//                                                     ))}
//                                                 </div>
//                                             </div>
//                                         </div>
//                                         {/* Right side with details */}
//                                         <div className="w-1/2 ml-6 bg-white p-6 rounded-3xl shadow text-left overflow-y-auto pr-4">
//                                             <h2 className="text-xl font-semibold mb-2 text-left">{selectedQc ? qualityCheck.find(q => q.id === selectedQc)?.title : ''}</h2>
//                                             <hr className='mb-4' />
//                                             <h2 className="text-xl font-semibold mb-4 text-left">Quality Check Details</h2>
//                                             <div>
//                                                 <ul style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
//                                                     {selectedQc && qualityCheck.find(q => q.id === selectedQc)?.container.split(',').map((item, index) => (
//                                                         <li style={{ marginBottom: '8px' }} key={index}>{item.trim()}</li>
//                                                     ))}
//                                                 </ul>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>

//                             {/* Quality Check  end*/}


//                             {/* File transfer and packaging start*/}
//                             {/* File Transfer and Packaging Section */}
//                             <div>
//                                 <div className='border-2 rounded-3xl border-customGrey-300 text-left mt-4'>
//                                     <input
//                                         type="checkbox"
//                                         checked={isFileTransferCheckboxChecked}
//                                         onChange={toggleCheckboxFileTransfer}
//                                         className="mr-2 cursor-pointer border-2 rounded-3xl border-customGrey-300 p-8 mt-4 mb-4 m-4"
//                                     />
//                                     <span>File Transfer and Packaging Service</span>
//                                 </div>
//                                 <div className={` ${!isFileTransferCheckboxChecked ? 'opacity-50 pointer-events-none' : ''}`}>
//                                     <div className="flex border-2 rounded-3xl border-customGrey-300 p-8 mt-4 mb-8 m-4">
//                                         {/* Left side with cards */}
//                                         <div className="overflow-y-auto pr-4">
//                                             <h2 className="text-xl font-semibold mb-4">File Transfer and Packaging</h2>
//                                             <div className="grid grid-cols-4 gap-4">
//                                                 {fileTransfer.map((ft) => (
//                                                     <button
//                                                         key={ft.id}
//                                                         className={`p-4 text-black border-2 rounded-3xl text-center ${selectedFileTransfer === ft.id ? 'bg-customBlue-700 border-customCardBlue-700 text-white' : 'border-gray-300'}`}
//                                                         onClick={() => isFileTransferCheckboxChecked && setSelectedFileTransfer(ft.id)}
//                                                         disabled={!isFileTransferCheckboxChecked}
//                                                     >
//                                                         <h3 className="text-sm font-bold">{ft.title}</h3>
//                                                     </button>
//                                                 ))}
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>

//                             {/* Save Button */}
//                             <div className='flex justify-center'>
//                                 <button
//                                     onClick={handleSave}
//                                     className='py-2 px-5 bg-customCardBlue text-white rounded-3xl'>
//                                     {isSaving ? 'Saving...' : 'Save'}
//                                 </button>
//                             </div>

//                             {/* Success Message */}
//                             {successMessage && <div className="text-center mt-4">{successMessage}</div>}
//                         </div>

//                         <style jsx>{`
//     .opacity-50 {
//       opacity: 0.5;
//     }
//     .pointer-events-none {
//       pointer-events: none;
//     }
//     .bg-customBlue-700 {
//       background-color: #3754B90; /* Your custom blue */
//     }
//     .border-customCardBlue-700 {
//       border-color: #3754B90; /* Your custom blue */
//     }
//     .text-white {
//       color: white;
//     }
//     .border-gray-300 {
//       border-color: #e2e8f0;
//     }
//   `}</style>
//                     </div>
//                     {/* File transfer and packaging end*/}


//                     {/* Other services' components (Quality Check, File Transfer, etc.) */}


//                 </div>
//             ) : (
//                 <div className="text-center mt-4">
//                     <h2>{successMessage}</h2>
//                     <h3>Selected Services:</h3>
//                     <pre>{JSON.stringify(selectedServices, null, 2)}</pre>

//                 </div>

// //                 <div className="text-center mt-4">
// //     <h2 className="text-xl font-semibold">{successMessage}</h2>
// //     <h3 className="text-lg mt-2">Selected Services:</h3>
// //     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-2">
// //         {Object.entries(selectedServices).map(([service, details]) => {
// //             // Check if the details object has values
// //             if (details && details._id) {
// //                 return (
// //                     <div key={details._id} className="border p-4 rounded-lg bg-gray-100">
// //                         <h4 className="font-bold">{service}</h4>
// //                         <p><strong>Type:</strong> {details.serviceType}</p>
// //                         <p><strong>ID:</strong> {details._id}</p>
// //                         <p><strong>Settings:</strong> {JSON.stringify(details.settings)}</p>
// //                     </div>
// //                 );
// //             }
// //             return null; // Return null if there are no details
// //         })}
// //     </div>
// // </div>
//             )}

//             {/* Your custom styling */}
//             <style jsx>{`
//             .opacity-50 {
//                 opacity: 0.5;
//             }
//             .pointer-events-none {
//                 pointer-events: none;
//             }
//         `}</style>
//             <div>
//                 <div className='flex items-center justify-between' style={{ marginTop: '8rem' }}>
//                     <div className='justify-start text-left'>
//                         <h1 className='text-customBlue text-xl font-bold'>Need Something Custom?</h1>
//                         <br />
//                         <h2 className='custom-blue text-xs font-bold'>
//                             If our presets don’t fit your needs, let us create a tailored one just for you. <br />
//                             Contact us at <span className='text-customOrange'>
//                                 <a href="mailto:support@entertainmenttechnologists.com">support@entertainmenttechnologists.com</a>
//                             </span> for personalized assistance.
//                         </h2>
//                     </div>

//                 </div>
//                 {/* Your setup source folder content here */}
//                 <div className="flex justify-end w-full">
//                     {/* Back Button */}
//                     <button
//                         onClick={goToPreviousTab}
//                         className="py-2 px-5 bg-gray-400 text-white rounded-3xl mr-4"
//                     >
//                         Back
//                     </button>

//                     {/* Next Button */}
//                     <button
//                         onClick={goToNextTab}
//                         className="py-2 px-5 bg-customCardBlue text-white rounded-3xl"
//                     >
//                         Next
//                     </button>
//                 </div>
//             </div>
//         </div >
//     );
// }


// export default CodecSettings;































import React, { useState } from 'react';
import { Tooltip } from 'bootstrap';

const CodecSettings = ({ goToNextTab, goToPreviousTab }) => {

    const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);
    const [isQCCheckboxChecked, setIsQCCheckboxChecked] = useState(false);
    const [isFileTransferCheckboxChecked, setIsFileTransferCheckboxChecked] = useState(false);
    const [enableSection, setEnableSection] = useState(false);

    const [selectedCard, setSelectedCard] = useState(1); // Default to first card
    const [selectedQc, setSelectedQc] = useState(1);     // Default to first quality check
    const [selectedFileTransfer, setSelectedFileTransfer] = useState(1); // Default to first option
    
    const [selectedCards, setSelectedCards] = useState([]);


    const [selectedServices, setSelectedServices] = useState([]);
    const [isEditing, setIsEditing] = useState(false); // New state for edit mode

    const [selectedOptions, setSelectedOptions] = useState({
        codec: [],          // Store selected codec ids
        qualityCheck: [],    // Store selected QC ids
        fileTransfer: []     // Store selected file transfer ids
    });

    const toggleCheckboxCodec = () => {
        setIsCheckboxChecked(prevState => !prevState);
    };

    const toggleCheckboxQC = () => {
        setIsQCCheckboxChecked(prevState => !prevState);
    };

    const toggleCheckboxFileTransfer = () => {
        setIsFileTransferCheckboxChecked(prevState => !prevState);
    };



    const cards = [
        { id: 1, title: 'MOV PRO RES HD ', container: 'MOV', videocodec: 'Pro-res 422', size: '1920X1080', resolution: 'HD', framerate: 'Same As Source', scantype: 'Progressive', vbitdepth: '10 bits', chromasubsampling: '422', videobitrate: '100mbps', HDR: 'No', audiocodec: 'PCM', samplerate: '48khz', abitdepth: '24', audiotrack: 'Same As Source' },
        { id: 2, title: 'MXF HD', container: 'MXF', videocodec: 'Mpeg 2', size: '1920X1080', resolution: 'HD', framerate: 'Same As Source', scantype: 'Progressive', vbitdepth: '10 bits', chromasubsampling: '422', videobitrate: '100mbps', HDR: 'No', audiocodec: 'PCM', samplerate: '48khz', abitdepth: '24', audiotrack: 'Same As Source' },
        { id: 3, title: 'MXF AVC HD', container: 'MXF', videocodec: 'AVC Intra', size: '1920X1080', resolution: 'HD', framerate: 'Same As Source', scantype: 'Progressive', vbitdepth: '10 bits', chromasubsampling: '422', videobitrate: '100mbps', HDR: 'No', audiocodec: 'PCM', samplerate: '48khz', abitdepth: '24', audiotrack: 'Same As Source' },
        { id: 4, title: 'MPG H.264 AAC', container: 'MPG', videocodec: 'H.264', size: '1920X1080', resolution: 'HD', framerate: 'Same As Source', scantype: 'Progressive', vbitdepth: '10 bits', chromasubsampling: '422', videobitrate: '50mbps', HDR: 'No', audiocodec: 'AAC', samplerate: '48khz', abitdepth: '24', audiotrack: 'Same As Source' },
        { id: 5, title: 'MPG MPEG2', container: 'MPG', videocodec: 'Mpeg 2', size: '1920X1080', resolution: 'HD', framerate: 'Same As Source', scantype: 'Progressive', vbitdepth: '10 bits', chromasubsampling: '422', videobitrate: '50mbps', HDR: 'No', audiocodec: 'MPEG2 Layer II', samplerate: '48khz', abitdepth: '24', audiotrack: 'Same As Source' },
        { id: 6, title: 'MP4 H.264', container: 'Mp4', videocodec: 'H.264', size: '1920X1080', resolution: 'HD', framerate: 'Same As Source', scantype: 'Progressive', vbitdepth: '10 bits', chromasubsampling: '422', videobitrate: '50mbps', HDR: 'No', audiocodec: 'AAC', samplerate: '48khz', abitdepth: '24', audiotrack: 'Same As Source' },
        { id: 7, title: 'MP4 HEVC', container: 'Mp4', videocodec: 'H.265', size: '1920X1080', resolution: 'HD', framerate: 'Same As Source', scantype: 'Progressive', vbitdepth: '10 bits', chromasubsampling: '422', videobitrate: '50mbps', HDR: 'No', audiocodec: 'AAC', samplerate: '48khz', abitdepth: '24', audiotrack: 'Same As Source' },
        { id: 8, title: 'MOV PRO RES UHD', container: 'MOV', videocodec: 'Pro-res 422', size: '3840X2160', resolution: 'UHD', framerate: 'Same As Source', scantype: 'Progressive', vbitdepth: '10 bits', chromasubsampling: '422', videobitrate: '300mbps', HDR: 'No', audiocodec: 'PCM', samplerate: '48khz', abitdepth: '24', audiotrack: 'Same As Source' },
        { id: 9, title: 'MOV PRO RES HQ UHD', container: 'MOV', videocodec: 'Pro-res 422 HQ', size: '3840X2160', resolution: 'UHD', framerate: 'Same As Source', scantype: 'Progressive', vbitdepth: '10 bits', chromasubsampling: '422', videobitrate: '300mbps', HDR: 'No', audiocodec: 'PCM', samplerate: '48khz', abitdepth: '24', audiotrack: 'Same As Source' },
        { id: 10, title: 'MOV Pro XQ UHD', container: 'MOV', videocodec: 'Pro-res 422 XQ', size: '3840X2160', resolution: 'UHD', framerate: 'Same As Source', scantype: 'Progressive', vbitdepth: '12 bits', chromasubsampling: '444', videobitrate: '300mbps', HDR: 'Dolby Vision', audiocodec: 'PCM', samplerate: '48khz', abitdepth: '24', audiotrack: 'Same As Source' },
        { id: 11, title: 'Original', container: 'N/A', videocodec: 'N/A', size: 'N/A', resolution: 'N/A', framerate: 'N/A', scantype: 'N/A', vbitdepth: 'N/A', chromasubsampling: 'N/A', videobitrate: 'N/A', HDR: 'N/A', audiocodec: 'N/A', samplerate: 'N/A', abitdepth: 'N/A', audiotrack: 'N/A' },
    ];

    const qualityCheck = [
        { id: 1, title: 'Container Checks', container: 'Content layout, Slates, Closed Caption, Duration, File size, Audio/Video duration mismatch, Compare System to elementary metadata, Timecode checks, Teletext, Packet size, Ancillary data, Number of audio/video streams,Synchronization' },
        { id: 2, title: 'Compliance Checks', container: 'DPP compliance, Digital Cinema compliance, IMF compliance, CableLabs VOD compliance, ARD_ZDF_HDFcompliance, AS02 / AS03 / AS10 / AS11 compliance, TR101 290, ARIB specifications, DPI compliance Compliance Checks HDR' },
        { id: 3, title: 'Video Checks', container: 'HDR Quality checks incl. SMPTE 2084 EOTF, lightness level (MaxFALL and MaxCLL), ST 2086, and ITU-R BT. 2020 compliance etc., Frame rate, Bit rate, Frame size, Aspect ratio, Duration, Resolution, Video format, Picture scanning type, AFD, GOP, Color format, Quantization parameter, Blockiness, Blurriness, Moiré pattern, Mosquito noise, Pixelation, Ringing artifact, Telecine/ cadence analysis, Combing errors, Field dominance, Field order, Duplicate frames, Freeze frames, Motion jerk, Ofcom- compliant Flash/ PSE (Flashy video), Action safe area, Blackbars, Black frames, Blank frames, Color bars, Color banding, Credits, Ghosting artifact, Image presence, Shot transition, Color gamut, Upconversion, Luma/Chroma levels, Video noise, Chroma change, Defective pixels, Halfline blanking, Video dropout, Brightness, Contrast, White point, 3D experience, Image tilting, Burnt-in text detection, VBI Lines detection, Flicker, Logo detection, Offline media, Pattern Noise, Black and White Frames, Sawtooth Artifact, Digital Ghosting Artifact, Scratch Artifact, De-interlaced Jerk, Flicker, Frame Jump, Compression Score, Aliasing, Pulldown Judder, Solarization, Half Flash, Pulsing Noise, Composite Signal Level, Progressive Segmented Frame(PsF), Frame Jump, Content Complexity' },
        { id: 4, title: 'Audio Checks', container: 'Kantar BVS Watermark, Audio language detection, Audio level (Min, max, avg), Dialnorm, Level mismatch, Loudness compliance (ITU, EBU, CALM Act, OP59, ARIB) (BS.1770-1, -2,-3), PPM meter, Silence, Crackle, Background noise, Colored noise, High frequency noise, Jitter noise, Line Pattern noise, Transient noise, Overmodulation noise, Echo, Wow & Flutter, Audio Impulsive Noise, Nielsen & Cinavia watermark, Click and pop, Clipping, Audio dropout, EAS tones, Misplaced channels, Phase detection, Stereo pair detection,Test tones, DPLM, Bitdepth upconversion detection, Repetitive pattern detection, Spectral aliasing detection, Audio impulse noise, Teletrax watermark, Basic alignment of speech with captions detection, Reverb, Beep, Multi reel audio click noise, Low Pass Filter' },
        { id: 5, title: 'Data Checks', container: 'Subtitle analysis and language detection, Burnt-in text detection and analysis, Closed Captions, DPI messages. Display Duration, Character Count, Spell check, IMSC1 profile Validation, Character Code Table, Subtitle Position, Caption/Subtitle Alignment, Dropout, Display Duration, 608/708 Specific Checks, XDS Checks' },
        { id: 6, title: 'Content Classification Checks', container: 'Explicit, Health Advisory Products, General Scene Classification, Violence, Keyword Detection, Strong Language Detection' },
        { id: 7, title: 'Eyeball Checks', container: '' },

    ];
    const fileTransfer = [
        { id: 1, title: 'Storage on the Cloud' },
        { id: 2, title: 'BackUp on the Cloud' },
        { id: 3, title: 'Archive Tapes Restoration and Digitization' },
    ];

    // const [selectedCard, setSelectedCard] = useState(cards[0].id);
    // const [selectedQc, setSelectedQc] = useState(qualityCheck[0].id)
    // const [selectedFileTransfer, setSelectedFileTransfer] = useState(fileTransfer[0].id)

    const details = selectedCard
        ? cards.find((card) => card.id === selectedCard)
        : { title: '', codec: '', frameRate: '', duration: '' };

    const QCdetails = selectedQc
        ? qualityCheck.find((qualityCheck) => qualityCheck.id === selectedQc)
        : { title: '', codec: '', frameRate: '', duration: '' };

    const FileTransferDetails = selectedFileTransfer
        ? fileTransfer.find((fileTransfer) => fileTransfer.id === selectedFileTransfer)
        : { title: '', codec: '', frameRate: '', duration: '' };

    // Toggle card selection
    const handleCardSelection = (cardId) => {
        setSelectedCards((prevSelected) => {
            if (prevSelected.includes(cardId)) {
                return prevSelected.filter(id => id !== cardId); // Remove if already selected
            }
            return [...prevSelected, cardId]; // Add card if not selected
        });
    };

    // Create the getServiceData function to work with selected card IDs
    const getServiceData = () => {
        const services = {};

        // Codec Service - handle multiple selected cards
        if (isCheckboxChecked && selectedCards.length > 0) {
            services.codecService = selectedCards.map(cardId => {
                const card = cards.find(c => c.id === cardId);
                return {
                    videoCodec: card?.videocodec,
                    audioCodec: card?.audiocodec,
                    resolution: card?.resolution,
                    bitRate: card?.videobitrate,
                    // Add other relevant data here
                };
            });
        }

        // Quality Check Service
        if (isQCCheckboxChecked) {
            services.qualityCheck = {
                containerChecks: qualityCheck.find(q => q.id === selectedQc)?.container.split(','),
            };
        }

        // File Transfer Service
        if (isFileTransferCheckboxChecked) {
            services.fileTransfer = {
                selectedOption: fileTransfer.find(f => f.id === selectedFileTransfer)?.title,
            };
        }

        return services;
    };

    // const getServiceData = () => {
    //     const services = {};

    //     // Codec Service
    //     if (isCheckboxChecked) {
    //         services.codecService = {
    //             videoCodec: details.videocodec,
    //             audioCodec: details.audiocodec,
    //             resolution: details.resolution,
    //             bitRate: details.videobitrate,
    //             // Add other relevant data here
    //         };
    //     }

    //     // Quality Check Service
    //     if (isQCCheckboxChecked) {
    //         services.qualityCheck = {
    //             containerChecks: qualityCheck.find(q => q.id === selectedQc)?.container.split(','),
    //             // Add other relevant quality check data if needed
    //         };
    //     }

    //     // File Transfer and Packaging Service
    //     if (isFileTransferCheckboxChecked) {
    //         services.fileTransfer = {
    //             selectedOption: fileTransfer.find(f => f.id === selectedFileTransfer)?.title,
    //             // Add other details if needed
    //         };
    //     }

    //     return services;
    // };


    // const handleSave = async () => {
    //     setIsSaving(true);
    //     const selectedServices = [];

    //     const serviceMappings = {
    //         codec: cards,
    //         qualityCheck: qualityCheck,
    //         fileTransfer: fileTransfer,
    //     };

    //     // Check and add selected services
    //     if (isCheckboxChecked) {
    //         const selectedCodecSettings = serviceMappings.codec.find(item => item.id === selectedCard);
    //         if (selectedCodecSettings) {
    //             selectedServices.push({
    //                 serviceType: 'codec',
    //                 settings: selectedCodecSettings,
    //             });
    //         }
    //     }

    //     if (isQCCheckboxChecked) {
    //         const selectedQcSettings = serviceMappings.qualityCheck.find(item => item.id === selectedQc);
    //         if (selectedQcSettings) {
    //             selectedServices.push({
    //                 serviceType: 'qualityCheck',
    //                 settings: selectedQcSettings,
    //             });
    //         }
    //     }

    //     if (isFileTransferCheckboxChecked) {
    //         const selectedFileTransferSettings = serviceMappings.fileTransfer.find(item => item.id === selectedFileTransfer);
    //         if (selectedFileTransferSettings) {
    //             selectedServices.push({
    //                 serviceType: 'fileTransfer',
    //                 settings: selectedFileTransferSettings,
    //             });
    //         }
    //     }

    //     console.log("Selected Services:", selectedServices);

    //     if (selectedServices.length === 0) {
    //         console.error("No services selected.");
    //         setSuccessMessage("Please select at least one service.");
    //         setIsSaving(false);
    //         return;
    //     }

    //     const dataToSend = {
    //         services: selectedServices,
    //     };

    //     console.log("Data to send:", JSON.stringify(dataToSend, null, 2));

    //     try {
    //         const response = await fetch('http://localhost:3000/api/services', {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify(dataToSend),
    //         });

    //         if (response.ok) {
    //             const result = await response.json();
    //             console.log('Response Data:', result);
    //             setSelectedServices(result.data); // Save the selected services in state
    //             setSuccessMessage("Successfully saved the selected services.");
    //             setIsEditing(false); // Hide the main div
    //         } else {
    //             const errorResponse = await response.json();
    //             console.error(`Failed to save: ${response.status} ${response.statusText}`);
    //             console.error('Response body:', errorResponse);
    //             setSuccessMessage(`Failed to save the options. Status: ${response.status} ${response.statusText}`);
    //         }
    //     } catch (error) {
    //         console.error('Error occurred during the save operation:', error);
    //         const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    //         setSuccessMessage(`An error occurred while saving the options. Details: ${errorMessage}`);
    //     } finally {
    //         setIsSaving(false);
    //     }
    // };



    const handleSelection = (service, id) => {
        setSelectedOptions(prev => {
            const updatedSelections = prev[service].includes(id)
                ? prev[service].filter(itemId => itemId !== id)  // Deselect if already selected
                : [...prev[service], id];  // Select the item if not selected

            return { ...prev, [service]: updatedSelections };
        });
    };

    const handleSave = async () => {
        setIsSaving(true);
        const selectedServices = [];

        const serviceMappings = {
            codec: cards,
            qualityCheck: qualityCheck,
            fileTransfer: fileTransfer,
        };

        // Check and add selected services
        if (isCheckboxChecked && selectedCards.length > 0) {
            selectedCards.forEach((cardId) => {
                const selectedCodecSettings = serviceMappings.codec.find(item => item.id === cardId);
                if (selectedCodecSettings) {
                    selectedServices.push({
                        serviceType: 'codec',
                        settings: selectedCodecSettings,
                    });
                }
            });
        }

        if (isQCCheckboxChecked) {
            const selectedQcSettings = serviceMappings.qualityCheck.find(item => item.id === selectedQc);
            if (selectedQcSettings) {
                selectedServices.push({
                    serviceType: 'qualityCheck',
                    settings: selectedQcSettings,
                });
            }
        }

        if (isFileTransferCheckboxChecked) {
            const selectedFileTransferSettings = serviceMappings.fileTransfer.find(item => item.id === selectedFileTransfer);
            if (selectedFileTransferSettings) {
                selectedServices.push({
                    serviceType: 'fileTransfer',
                    settings: selectedFileTransferSettings,
                });
            }
        }

        console.log("Selected Services:", selectedServices);

        if (selectedServices.length === 0) {
            console.error("No services selected.");
            setSuccessMessage("Please select at least one service.");
            setIsSaving(false);
            return;
        }

        const dataToSend = {
            services: selectedServices, // Send selected service details
        };

        console.log("Data to send:", JSON.stringify(dataToSend, null, 2));

        try {
            const response = await fetch('http://localhost:3000/api/services', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToSend),
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Response Data:', result);
                setSelectedServices(result.data); // Save the selected services in state
                setSuccessMessage("Successfully saved the selected services.");
                setIsEditing(false); // Hide the main div
            } else {
                const errorResponse = await response.json();
                console.error(`Failed to save: ${response.status} ${response.statusText}`);
                setSuccessMessage(`Failed to save the options. Status: ${response.status} ${response.statusText}`);
            }
        } catch (error) {
            console.error('Error occurred during the save operation:', error);
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            setSuccessMessage(`An error occurred while saving the options. Details: ${errorMessage}`);
        } finally {
            setIsSaving(false);
        }
    };




    // const [selectedOptions, setSelectedOptions] = useState({
    //     codec: null,
    //     qualityCheck: null,
    //     fileTransfer: null,
    // });

    const [isSaving, setIsSaving] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    return (
        <div>
            {!successMessage ? (
                <div>
                    {/* Your main content div here */}
                    <div className='border-2 rounded-3xl border-customGrey-300 text-left mt-4'
                        data-bs-toggle="tooltip"
                        data-bs-placement="top"
                        title="please check the box to add this service for your order"
                    >  <input
                            type="checkbox"
                            checked={isCheckboxChecked}
                            onChange={toggleCheckboxCodec}
                            className="mr-2 cursor-pointer border-2 rounded-3xl border-customGrey-300 p-8 mt-4 mb-4 m-4"
                        />
                        <span>Codec Service</span></div>

                    {/* codec settings start */}
                    <div
                        className={`flex h-screen border-2 rounded-3xl border-customGrey-300 p-8 mt-4 mb-4 m-4 ${!isCheckboxChecked ? 'opacity-50 pointer-events-none' : ''}`}
                        style={{
                            transition: 'opacity 0.3s ease',
                        }}
                    >
                        {/* Left side with cards */}
                        <div className="w-2/3 overflow-y-auto pr-4">
                            <h2 className="text-xl font-semibold mb-4">Presets</h2>
                            <div className="grid grid-cols-3 gap-4">
                                {cards.map((card) => (
                                    <button
                                        key={card.id}
                                        className={`p-4 text-black border-2 border-gray-300 rounded-3xl text-center ${selectedOptions.codec.includes(card.id) ? 'bg-customBlue-700 border-customCardBlue-700 text-white' : 'border-gray-300'}`}
                                        onClick={() => isCheckboxChecked && handleSelection('codec', card.id)}
                                        disabled={!isCheckboxChecked}
                                    >
                                        <h3 className="text-sm font-bold">{card.title}</h3>
                                        <p className="text-xs text-white-600">{card.videocodec}/{card.audiocodec}</p>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Right side with details */}
                        <div className="w-1/2 ml-6 bg-white p-6 rounded-3xl shadow text-left overflow-y-auto pr-4">
                            <h2 className="text-xl font-semibold mb-2">{details.title}</h2>
                            <hr className='mb-4' />
                            <h2 className="text-xl font-semibold mb-4">Video Codec</h2>
                            <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                                <div><p><strong>Container</strong></p></div>
                                <div><p><strong>Video Codec</strong></p></div>
                                <div><p>{details.container}</p></div>
                                <div><p>{details.videocodec}</p></div>
                                <div><p><strong>Size</strong></p></div>
                                <div><p><strong>Resolution</strong></p></div>
                                <div><p>{details.size}</p></div>
                                <div><p>{details.resolution}</p></div>
                                <div><p><strong>Frame Rate</strong></p></div>
                                <div><p><strong>Scan Type</strong></p></div>
                                <div><p>{details.framerate}</p></div>
                                <div><p>{details.scantype}</p></div>
                                <div><p><strong>Bit Depth</strong></p></div>
                                <div><p><strong>Chroma Subsampling</strong></p></div>
                                <div><p>{details.vbitdepth}</p></div>
                                <div><p>{details.chromasubsampling}</p></div>
                                <div><p><strong>Video Bit Rate</strong></p></div>
                                <div><p><strong>HDR</strong></p></div>
                                <div><p>{details.videobitrate}</p></div>
                                <div><p>{details.HDR}</p></div>
                            </div>
                            <hr className='m-4' />
                            <h2 className="text-xl font-semibold mb-4">Audio Codec</h2>
                            <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                                <div><p><strong>Audio Codec</strong></p></div>
                                <div><p><strong>Sample Rate</strong></p></div>
                                <div><p>{details.audiocodec}</p></div>
                                <div><p>{details.samplerate}</p></div>
                                <div><p><strong>Bit Depth</strong></p></div>
                                <div><p><strong>Audio Track</strong></p></div>
                                <div><p>{details.abitdepth}</p></div>
                                <div><p>{details.audiotrack}</p></div>
                            </div>
                        </div>
                    </div>

                    <style jsx>{`
  .opacity-50 {
    opacity: 0.5;
  }
  .pointer-events-none {
    pointer-events: none;
  }
`}</style>

                    {/* codec settings end */}
                    <div>


                        {/* Quality Check  start*/}
                        <div>
                            {/* Quality Check Section */}
                            <div className=''>
                                <div className='border-2 rounded-3xl border-customGrey-300 text-left mt-4'>
                                    <input
                                        type="checkbox"
                                        checked={isQCCheckboxChecked}
                                        onChange={toggleCheckboxQC}
                                        className="mr-2 cursor-pointer border-2 rounded-3xl border-customGrey-300 p-8 mt-4 mb-4 m-4"
                                    />
                                    <span>Quality Check Service</span>
                                </div>
                                <div className={` ${!isQCCheckboxChecked ? 'opacity-50 pointer-events-none' : ''}`}>
                                    <div className="flex h-screen border-2 rounded-3xl border-customGrey-300 p-8 mt-4 mb-8 m-4">
                                        {/* Left side with cards */}
                                        <div className="w-2/3 overflow-y-auto pr-4">
                                            <h2 className="text-xl font-semibold mb-4">Quality Check</h2>
                                            <div className="grid grid-cols-3 gap-4">
                                                {qualityCheck.map((qc) => (
                                                    <button
                                                        key={qc.id}
                                                        className={`p-4 text-black border-2 border-gray-300 rounded-3xl text-center ${selectedOptions.qualityCheck.includes(qc.id) ? 'bg-customBlue-700 border-customCardBlue-700 text-white' : 'border-gray-300'}`}
                                                        onClick={() => isQCCheckboxChecked && handleSelection('qualityCheck', qc.id)}
                                                        disabled={!isQCCheckboxChecked}
                                                    >
                                                        <h3 className="text-sm font-bold">{qc.title}</h3>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        {/* Right side with details */}
                                        <div className="w-1/2 ml-6 bg-white p-6 rounded-3xl shadow text-left overflow-y-auto pr-4">
                                            <h2 className="text-xl font-semibold mb-2">{selectedQc ? qualityCheck.find(q => q.id === selectedQc)?.title : ''}</h2>
                                            <hr className="mb-4" />
                                            {/* Display QC details */}
                                            <h2 className="text-xl font-semibold mb-4">Quality Check Details</h2>
                                            {/* Display Quality Check information */}
                                        </div>
                                    </div>

                                </div>
                            </div>

                            {/* Quality Check  end*/}


                            {/* File transfer and packaging start*/}
                            {/* File Transfer and Packaging Section */}
                            <div>
                                <div className='border-2 rounded-3xl border-customGrey-300 text-left mt-4'>
                                    <input
                                        type="checkbox"
                                        checked={isFileTransferCheckboxChecked}
                                        onChange={toggleCheckboxFileTransfer}
                                        className="mr-2 cursor-pointer border-2 rounded-3xl border-customGrey-300 p-8 mt-4 mb-4 m-4"
                                    />
                                    <span>File Transfer and Packaging Service</span>
                                </div>
                                <div className={` ${!isFileTransferCheckboxChecked ? 'opacity-50 pointer-events-none' : ''}`}>
                                    <div className="flex border-2 rounded-3xl border-customGrey-300 p-8 mt-4 mb-8 m-4">
                                        {/* Left side with cards */}
                                        <div className="overflow-y-auto pr-4">
    <h2 className="text-xl font-semibold mb-4">File Transfer and Packaging</h2>
    <div className="grid grid-cols-4 gap-4">
      {fileTransfer.map((ft) => (
        <button
          key={ft.id}
          className={`p-4 text-black border-2 border-gray-300 rounded-3xl text-center ${selectedOptions.fileTransfer.includes(ft.id) ? 'bg-customBlue-700 border-customCardBlue-700 text-white' : 'border-gray-300'}`}
          onClick={() => isFileTransferCheckboxChecked && handleSelection('fileTransfer', ft.id)}
          disabled={!isFileTransferCheckboxChecked}
        >
          <h3 className="text-sm font-bold">{ft.title}</h3>
        </button>
      ))}
    </div>
  </div>
                                    </div>
                                </div>
                            </div>

                            {/* Save Button */}
                            <div className='flex justify-center'>
                                <button
                                    onClick={handleSave}
                                    className='py-2 px-5 bg-customCardBlue text-white rounded-3xl'>
                                    {isSaving ? 'Saving...' : 'Save'}
                                </button>
                            </div>

                            {/* Success Message */}
                            {successMessage && <div className="text-center mt-4">{successMessage}</div>}
                        </div>

                        <style jsx>{`
    .opacity-50 {
      opacity: 0.5;
    }
    .pointer-events-none {
      pointer-events: none;
    }
    .bg-customBlue-700 {
      background-color: #3754B90; /* Your custom blue */
    }
    .border-customCardBlue-700 {
      border-color: #3754B90; /* Your custom blue */
    }
    .text-white {
      color: white;
    }
    .border-gray-300 {
      border-color: #e2e8f0;
    }
  `}</style>
                    </div>
                    {/* File transfer and packaging end*/}


                    {/* Other services' components (Quality Check, File Transfer, etc.) */}


                </div>
            ) : (
                <div className="text-center mt-4">
                    <h2>{successMessage}</h2>
                    <h3>Selected Services:</h3>
                    <pre>{JSON.stringify(selectedServices, null, 2)}</pre>

                </div>

                //                 <div className="text-center mt-4">
                //     <h2 className="text-xl font-semibold">{successMessage}</h2>
                //     <h3 className="text-lg mt-2">Selected Services:</h3>
                //     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                //         {Object.entries(selectedServices).map(([service, details]) => {
                //             // Check if the details object has values
                //             if (details && details._id) {
                //                 return (
                //                     <div key={details._id} className="border p-4 rounded-lg bg-gray-100">
                //                         <h4 className="font-bold">{service}</h4>
                //                         <p><strong>Type:</strong> {details.serviceType}</p>
                //                         <p><strong>ID:</strong> {details._id}</p>
                //                         <p><strong>Settings:</strong> {JSON.stringify(details.settings)}</p>
                //                     </div>
                //                 );
                //             }
                //             return null; // Return null if there are no details
                //         })}
                //     </div>
                // </div>
            )
            }

            {/* Your custom styling */}
            <style jsx>{`
            .opacity-50 {
                opacity: 0.5;
            }
            .pointer-events-none {
                pointer-events: none;
            }
        `}</style>
            <div>
                <div className='flex items-center justify-between' style={{ marginTop: '8rem' }}>
                    <div className='justify-start text-left'>
                        <h1 className='text-customBlue text-xl font-bold'>Need Something Custom?</h1>
                        <br />
                        <h2 className='custom-blue text-xs font-bold'>
                            If our presets don’t fit your needs, let us create a tailored one just for you. <br />
                            Contact us at <span className='text-customOrange'>
                                <a href="mailto:support@entertainmenttechnologists.com">support@entertainmenttechnologists.com</a>
                            </span> for personalized assistance.
                        </h2>
                    </div>

                </div>
                {/* Your setup source folder content here */}
                <div className="flex justify-end w-full">
                    {/* Back Button */}
                    <button
                        onClick={goToPreviousTab}
                        className="py-2 px-5 bg-gray-400 text-white rounded-3xl mr-4"
                    >
                        Back
                    </button>

                    {/* Next Button */}
                    <button
                        onClick={goToNextTab}
                        className="py-2 px-5 bg-customCardBlue text-white rounded-3xl"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div >
    );
}


export default CodecSettings;

