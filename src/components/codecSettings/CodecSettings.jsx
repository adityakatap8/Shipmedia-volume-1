import React, { useState } from 'react';

const CodecSettings = () => {

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
    ];

    const [selectedCard, setSelectedCard] = useState(cards[0].id);

    const details = selectedCard
        ? cards.find((card) => card.id === selectedCard)
        : { title: '', codec: '', frameRate: '', duration: '' };

    return (
        <div>
            <div className="flex h-screen border-2 rounded-3xl border-customGrey-300 p-8 mt-4 mb-4 m-4">
                {/* Left side with cards */}
                <div className="w-2/3 overflow-y-auto  pr-4">
                    <h2 className="text-xl font-semibold mb-4">Quick Export</h2>
                    <div className="grid grid-cols-3 gap-4">
                        {cards.map((card) => (
                            <button
                                key={card.id}
                                className={`p-4 text-black border-2 border-gray-300 text-black p-2 rounded-3xl text-center ${selectedCard === card.id ? 'bg-customBlue-700 border-customCardBlue-700 text-white' : 'border-gray-300'}`}
                                onClick={() => setSelectedCard(card.id)}
                            >
                                <h3 className="text-lg font-bold">{card.title}</h3>
                                <p className="text-sm text-white-600">{card.videocodec}/{card.audiocodec}</p>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Right side with details */}
                <div className="w-1/2 ml-6 bg-white p-6 rounded-3xl shadow text-left overflow-y-auto pr-4">
                    <h2 className="text-xl font-semibold mb-2">{details.title}</h2>
                    <hr className='mb-4'></hr>
                    <h2 className="text-xl font-semibold mb-4">Video Codec</h2>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                        <div>
                            <p><strong>Container</strong></p>
                        </div>
                        <div>
                            <p><strong>Video Codec</strong></p>
                        </div>
                        <div>
                            <p>{details.container}</p>
                        </div>
                        <div>
                            <p>{details.videocodec}</p>
                        </div>

                        <div>
                            <p><strong>Size</strong></p>
                        </div>
                        <div>
                            <p><strong>Resolution</strong></p>
                        </div>
                        <div>
                            <p>{details.size}</p>
                        </div>
                        <div>
                            <p>{details.resolution}</p>
                        </div>

                        <div>
                            <p><strong>Frame Rate</strong></p>
                        </div>
                        <div>
                            <p><strong>Scan Type</strong></p>
                        </div>
                        <div>
                            <p>{details.framerate}</p>
                        </div>
                        <div>
                            <p>{details.scantype}</p>
                        </div>

                        <div>
                            <p><strong>Bit Depth</strong></p>
                        </div>
                        <div>
                            <p><strong>Chroma Subsampling</strong></p>
                        </div>
                        <div>
                            <p>{details.vbitdepth}</p>
                        </div>
                        <div>
                            <p>{details.chromasubsampling}</p>
                        </div>

                        <div>
                            <p><strong>Video Bit Rate</strong></p>
                        </div>
                        <div>
                            <p><strong>HDR</strong></p>
                        </div>
                        <div>
                            <p>{details.videobitrate}</p>
                        </div>
                        <div>
                            <p>{details.HDR}</p>
                        </div>
                    </div>
                    <hr className='m-4'></hr>
                    <h2 className="text-xl font-semibold mb-4">Audio Codec</h2>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                        <div>
                            <p><strong>Audio Codec</strong></p>
                        </div>
                        <div>
                            <p><strong>Sample Rate</strong></p>
                        </div>
                        <div>
                            <p>{details.audiocodec}</p>
                        </div>
                        <div>
                            <p>{details.samplerate}</p>
                        </div>

                        <div>
                            <p><strong>Bit Depth</strong></p>
                        </div>
                        <div>
                            <p><strong>Audio Track</strong></p>
                        </div>
                        <div>
                            <p>{details.abitdepth}</p>
                        </div>
                        <div>
                            <p>{details.audiotrack}</p>
                        </div>
                       
                    </div>

                    {/* <h1 className="text-xl font-semibold mb-4 ml-6 text-customCardBlue">{details.title}</h1>
                    <h2 className="text-xl font-semibold mb-4 ml-6">Video Codec</h2>
                    <div className='ml-6'>
                        <p><strong>Container : </strong> {details.container}</p>
                        <p><strong>Video Codec : </strong> {details.videocodec}</p>
                        <p><strong>Size : </strong> {details.size}</p>
                        <p><strong>Resolution : </strong> {details.resolution}</p>
                        <p><strong>Frame Rate : </strong> {details.framerate}</p>
                        <p><strong>Scan Type : </strong> {details.scantype}</p>
                        <p><strong>Bit Depth : </strong> {details.vbitdepth}</p>
                        <p><strong>Chroma Subsampling : </strong> {details.chromasubsampling}</p>
                        <p><strong>Video Bit Rate : </strong> {details.videobitrate}</p>
                        <p><strong>HDR : </strong> {details.HDR}</p>
                    </div>
                    <hr className='m-4'></hr>
                    <h2 className="text-xl font-semibold mb-4 ml-6">Audio Codec</h2>
                    <div className='ml-6'>
                        <p><strong>Audio Codec : </strong> {details.audiocodec}</p>
                        <p><strong>Sample Rate : </strong> {details.samplerate}</p>
                        <p><strong>Bit Depth : </strong> {details.abitdepth}</p>
                        <p><strong>Audio Track : </strong> {details.audiotrack}</p>
                    </div> */}
                </div>
            </div>
            <div className="flex justify-end">
                <button
                    className="py-2 px-5 bg-customCardBlue text-white rounded-3xl mr-4 mb-2"
                >
                    Next
                </button>
            </div>

        </div>

    );
}

export default CodecSettings;
