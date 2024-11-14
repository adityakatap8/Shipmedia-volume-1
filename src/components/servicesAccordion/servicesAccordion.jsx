import React, { useState } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import './index.css'

function ServicesAccordion() {
    const [selectedOptions, setSelectedOptions] = useState({
        codec: null,
        qualityCheck: null,
        fileTransfer: null,
    });


    const [selectedQc, setSelectedQc] = useState(1);     // Default to first quality check
    const [selectedFileTransfer, setSelectedFileTransfer] = useState(1);

    const [isQCCheckboxChecked, setIsQCCheckboxChecked] = useState(false);
    const [isFileTransferCheckboxChecked, setIsFileTransferCheckboxChecked] = useState(false);
    const [enableSection, setEnableSection] = useState(false);
    const [selectedCard, setSelectedCard] = useState(1); // Initialize as null
    const [expanded, setExpanded] = useState(false);
    const [selectedCardId, setSelectedCardId] = useState(null);
    const [selectedArtwork, setSelectedArtwork] = useState(null);

      const [selectedPortrait, setSelectedPortrait] = useState(1);
  const [selectedLandscape, setSelectedLandscape] = useState(1);


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
        // { id: 11, title: 'Original', container: 'N/A', videocodec: 'N/A', size: 'N/A', resolution: 'N/A', framerate: 'N/A', scantype: 'N/A', vbitdepth: 'N/A', chromasubsampling: 'N/A', videobitrate: 'N/A', HDR: 'N/A', audiocodec: 'N/A', samplerate: 'N/A', abitdepth: 'N/A', audiotrack: 'N/A' },
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
    const portrait = [
        { id: 1, title: '800x1200' },
        { id: 2, title: '1920x2560' },
        { id: 3, title: '1532x2176' },
        { id: 4, title: '1080x1920' },
    ];
    const landscape = [
      { id: 1, title: '4320x1300' },
      { id: 2, title: '3840x2160' },
      { id: 3, title: '2560x1920' },
      { id: 4, title: '2048x1024' },
      { id: 5, title: '2000x1125' },
      { id: 6, title: '1920x1080' },
      { id: 7, title: '1600x1200' },
      { id: 8, title: '1296x720' },
      { id: 9, title: '800x600' },
    ];

    const details = selectedCard ? cards.find((card) => card.id === selectedCard) : {
        title: '',
        container: '',
        videocodec: '',
        audiocodec: '',
        resolution: '',
        size: '',
        framerate: '',
        scantype: '',
        vbitdepth: '',
        chromasubsampling: '',
        videobitrate: '',
        HDR: '',
        samplerate: '',
        abitdepth: '',
        audiotrack: ''
    };

    const handleCardClick = (cardId) => {
        setSelectedCard(cardId); // Update the selected card
    };

    const handleAccordionChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };


    const toggleCheckboxCodec = () => {
        setIsCheckboxChecked(prevState => !prevState);
    };

    const toggleCheckboxQC = () => {
        setIsQCCheckboxChecked(prevState => !prevState);
    };

    const toggleCheckboxFileTransfer = () => {
        setIsFileTransferCheckboxChecked(prevState => !prevState);
    };

    return (


<div>
    {/* codec section start */}
<div className='section pt-16'>
  <div className='container-fluid'>
    <div className='row services-row-one'>
      
    <h2 className='service-title'>
    Our Services
  </h2>
  <div className="dotted-line-break-grey"></div>
      
      <div className='col-md-4 d-flex align-items-center justify-content-center'>
     
        {/* Left Column Content */}
        <div className='text-center'>
        <h2 className='service-title'>
    Video and Audio Codecs
  </h2>
  <div className="dotted-line-break-blue"></div>
          <p className='service-content'>
Explore our comprehensive range of video and audio services designed to meet your creative needs. Whether you’re working on professional video editing or high-quality audio production, we have the right solutions for you.

Our services ensure optimal performance and compatibility, allowing you to achieve outstanding results across all your projects. From captivating video content to crystal-clear audio, we cover every aspect of production.</p>
        </div>
      </div>
      <div className='col-md-8 d-flex align-items-center justify-content-center'>
        {/* Right Column Content */}
        <div className='text-center'>
          {/* <h2 className='text-2xl font-bold'>Codec Settings</h2> */}
          <div className="flex h-full border-2 rounded-3xl border-customGrey-300 p-8 mt-4 mb-4 m-4 overflow-hidden">
            <div className="w-2/3 overflow-y-auto pr-4 max-h-[400px] scrollable-content">
              <h2 className="text-xl font-semibold mb-4">Presets</h2>
              <div className="grid grid-cols-3 gap-4">
                {cards.map((card) => (
                  <button
                    key={card.id}
                    className={`p-2 border-2 rounded-3xl text-center ${selectedCard === card.id ? 'bg-customBlue-700 text-white' : 'border-gray-300 text-black'}`}
                    onClick={() => handleCardClick(card.id)}
                  >
                    <h3 className="text-sm font-bold">{card.title}</h3>
                    <p className="text-xs">{card.videocodec}/{card.audiocodec}</p>
                  </button>
                ))}
              </div>
            </div>
            <div className="w-1/2 bg-white rounded-3xl max-h-[400px] overflow-y-auto scrollable-content">
              <h2 className="text-xl font-semibold mb-2">{details.title}</h2>
              <hr className='mb-4' />
              <h2 className="text-xl font-semibold mb-4">Video Codec</h2>
              <div className="max-h-60 overflow-y-auto scrollable-content">
                <div className="grid grid-cols-2 gap-y-2">
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
        </div>
      </div>
    </div>
  </div>
</div>
{/* codec section ends */}



{/* quality check starts */}
<div className='section pt-16'>
  <div className='container-fluid'>
    <div className='row'>
      <div className='col-md-8 d-flex align-items-center justify-content-center'>
        {/* Left Column Content */}
        <div>
        <div className="flex h-screen border-2 rounded-3xl border-customGrey-300 p-8 mt-4 mb-8 m-4">
            {/* Left side with quality check buttons */}
            <div className="w-2/3 overflow-y-auto flex">
                <div className="w-full overflow-y-auto mb-8">
                    <h2 className="text-xl font-semibold mb-4">Quality Check</h2>
                    
                    <div className="grid grid-cols-3 gap-4">
                        {qualityCheck.map((qc) => (
                            <button
                                key={qc.id}
                                className={`p-2 border-2 rounded-3xl text-center ${
                                    selectedQc === qc.id 
                                        ? 'bg-customBlue-700 border-customCardBlue-700 text-white' 
                                        : 'border-gray-300 text-black'
                                }`}
                                onClick={() => setSelectedQc(qc.id)}
                            >
                                <h3 className="text-sm font-bold">{qc.title}</h3>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
            {/* Right side with details */}
            <div className="w-1/2 ml-6 bg-white p-6 rounded-3xl shadow text-left overflow-y-auto pr-4 scrollable-content">
                <h2 className="text-xl font-semibold mb-2 text-left">{selectedQc ? qualityCheck.find(q => q.id === selectedQc)?.title : ''}</h2>
                <hr className='mb-4' />
                <h2 className="text-xl font-semibold mb-4 text-left">Quality Check Details</h2>
                <div>
                    <ul style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
                        {selectedQc && qualityCheck.find(q => q.id === selectedQc)?.container.split(',').map((item, index) => (
                            <li style={{ marginBottom: '8px' }} key={index}>{item.trim()}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    </div>
      </div>
      <div className='col-md-4 d-flex align-items-center justify-content-center'>
        {/* Right Column Content */}
        <div className='text-center'>
          <h2 className='service-title'>Quality Check</h2>
          <div className="dotted-line-break-blue"></div>
         <p className='service-content'>Our quality check services ensure the integrity and excellence of your media. We perform thorough assessments across various categories, including container and compliance checks, as well as detailed video and audio evaluations. Our team meticulously analyzes technical specifications and synchronization to guarantee optimal performance and compliance. Trust us to enhance your production's reliability and deliver exceptional quality that captivates your audience.</p>
        </div>
      </div>
    </div>
  </div>
</div>
{/* quality check ends */}



{/* artwork section starts */}
<div className='section pt-16'>
      <div className='container-fluid'>
        <div className='row'>
             {/* Left Column Content */}
          <div className='col-md-4 d-flex align-items-center justify-content-center'>
            <div className='text-center'>
              <h2 className='service-title'>Artwork Automation</h2>
              <div className="dotted-line-break-blue"></div>
              <p className='service-content'>
                Our artwork automation services streamline the creation and optimization of digital art for various platforms. We offer custom solutions tailored to your needs, ensuring high-quality output across different devices and resolutions. From resizing and cropping to color correction and compression, our tools and expertise help you produce consistent, visually appealing artwork efficiently.
              </p>
            </div>
          </div>
           {/* Right Column Content */}
          <div className='col-md-8 d-flex align-items-center justify-content-center'>
            <div>
              <div className="flex border-2 rounded-3xl border-customGrey-300 p-8 mt-4 mb-8 m-4">
                {/* Combined Portrait and Landscape Sections */}
                <div className="d-flex flex-column gap-4">
                                   
                  {/* Portrait Artwork Formats */}
                  <div className="overflow-y-auto pr-4">
                    <h2 className="text-xl font-semibold mb-4">Portrait Artwork Formats</h2>
                    <div className="grid grid-cols-4 gap-4">
                      {portrait.map((artwork) => (
                        <button
                          key={artwork.id}
                          className={`p-4 text-black border-2 rounded-3xl text-center ${
                            selectedPortrait === artwork.id 
                              ? 'bg-customBlue-700 border-customCardBlue-700 text-white' 
                              : 'border-gray-300'
                          }`}
                          onClick={() => setSelectedPortrait(artwork.id)} // Handle portrait selection
                        >
                          <h3 className="text-sm font-bold">{artwork.title}</h3>
                        </button>
                      ))}
                    </div>
                  </div>

                  <hr className="my-4" />

                  {/* Landscape Artwork Formats */}
                  <div className="overflow-y-auto pr-4">
                    <h2 className="text-xl font-semibold mb-4">Landscape Artwork Formats</h2>
                    <div className="grid grid-cols-4 gap-4">
                      {landscape.map((artwork) => (
                        <button
                          key={artwork.id}
                          className={`p-4 text-black border-2 rounded-3xl text-center ${
                            selectedLandscape === artwork.id 
                              ? 'bg-customBlue-700 border-customCardBlue-700 text-white' 
                              : 'border-gray-300'
                          }`}
                          onClick={() => setSelectedLandscape(artwork.id)} // Handle landscape selection
                        >
                          <h3 className="text-sm font-bold">{artwork.title}</h3>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
{/* artwork section ends */}





   {/* file transfer section start */}
   <div className='section pt-16'>
  <div className='container-fluid'>
    <div className='row'>
       {/* Left Column Content */}
       <div className='col-md-8 d-flex align-items-center justify-content-center'>
       
       <div>
    <div className="flex border-2 rounded-3xl border-customGrey-300 p-8 mt-4 mb-8 m-4">
        {/* Left side with file transfer buttons */}
        <div className="overflow-y-auto pr-4">
            <h2 className="text-xl font-semibold mb-4">File Transfer and Packaging</h2>
            <div className="grid grid-cols-4 gap-4">
                {fileTransfer.map((ft) => (
                    <button
                        key={ft.id}
                        className={`p-4 text-black border-2 rounded-3xl text-center ${
                            selectedFileTransfer === ft.id 
                                ? 'bg-customBlue-700 border-customCardBlue-700 text-white' 
                                : 'border-gray-300'
                        }`}
                        onClick={() => setSelectedFileTransfer(ft.id)}
                    >
                        <h3 className="text-sm font-bold">{ft.title}</h3>
                    </button>
                ))}
            </div>
        </div>
    </div>
</div>
  </div>
    
       {/* Right Column Content */}
       <div className='col-md-4 d-flex align-items-center justify-content-center'>
       
       <div className='text-center'>
         <h2 className='service-title'>File Transfer and Packaging</h2>
         <div className="dotted-line-break-blue"></div>
         <p className='service-content'>Our file transfer and packaging services ensure secure and efficient delivery of your media assets. Using advanced technology, we provide fast and reliable transfers while maintaining top security standards. Our team expertly packages your files for optimal compatibility, ensuring they are ready for any platform. With meticulous attention to detail, we guarantee safe delivery and professional presentation, giving you peace of mind throughout the process.</p>
       </div>
     </div>
    </div>
  </div>
</div>
{/* file transfer section ends */}




</div>

    );
}

export default ServicesAccordion;
