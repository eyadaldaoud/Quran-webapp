import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import { MdNavigateNext, MdNavigateBefore } from 'react-icons/md';

function App() {
  const [isLoading, setLoading] = useState(true);
  const [surahNumber, setSurahNumber] = useState(1);
  const [data, setData] = useState([]);
  const [highlightedSegments, setHighlightedSegments] = useState([]);
  const [audioSrc, setAudioSrc] = useState('');

  const fetchData = async () => {
    const jsonFiles = [];
    const response = await import(
      surahNumber < 10
        ? `./assets/rectjson/00${surahNumber}.json`
        : surahNumber < 100
        ? `./assets/rectjson/0${surahNumber}.json`
        : `./assets/rectjson/${surahNumber}.json`
    );
    const jsonData = await response.default;
    jsonFiles.push(jsonData);
    setData(jsonFiles);
  };

  useEffect(() => {
    setLoading(false);
    fetchData();
  }, [surahNumber]);

  const handleClickOnImage = (e) => {
    const boundingRect = e.target.getBoundingClientRect();
    const x = e.clientX - boundingRect.left;
    const y = e.clientY - boundingRect.top;

    const clickedSegments = data.flat().filter((item) => {
      return item.segs.some((seg) => {
        const scaledX = seg.x * (300 / 1250);
        const scaledY = seg.y * (300 / 1250);
        const scaledW = seg.w * (300 / 1250);
        const scaledH = seg.h * (200 / 1250);
        return x >= scaledX && x <= scaledX + scaledW && y >= scaledY && y <= scaledY + scaledH;
      });
    });

    const clickedAyaIds = clickedSegments.map((item) => `${item.sura_id}:${item.aya_id}`);

    const allHighlightedSegments = data.flat().filter((item) => {
      return clickedAyaIds.includes(`${item.sura_id}:${item.aya_id}`);
    });

    setHighlightedSegments(allHighlightedSegments);
    const surahNum = allHighlightedSegments[0].sura_id < 9 ? '00' + allHighlightedSegments[0].sura_id :
    allHighlightedSegments[0].sura_id < 99 ? '0' + allHighlightedSegments[0].sura_id : allHighlightedSegments[0].sura_id

    const audioUrl = `https://everyayah.com/data/AbdulSamad_64kbps_QuranExplorer.Com/${surahNum}${pad(
      clickedAyaIds[0].split(':')[1],
      3
    )}.mp3`;
    setAudioSrc(audioUrl);
    console.log(audioUrl)
  };

  // Helper function to pad the number with zeros
  const pad = (num, size) => {
    let s = String(num);
    while (s.length < size) s = '0' + s;
    return s;
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Navbar />
      <div style={{ position: 'relative', textAlign: 'center', marginTop: '10px' }} onClick={handleClickOnImage}>
        {data.map((itemGroup, i) => (
          <div key={i} style={{ position: 'relative', display: 'inline-block', textAlign: 'left' }}>
            {itemGroup.map((item) =>
              item.segs.map((seg, index) => {
                const scaledX = seg.x * (300 / 1250) - 150;
                const scaledY = seg.y * (300 / 1250) + 10;
                const scaledW = seg.w * (300 / 1250);
                const scaledH = seg.h * (200 / 1250);

                const isHighlighted = highlightedSegments.some(
                  (highlightedSeg) =>
                    highlightedSeg.sura_id === item.sura_id && highlightedSeg.aya_id === item.aya_id
                );

                return (
                  <div
                    key={index}
                    className={isHighlighted ? 'bg-blue-600 opacity-40' : ''}
                    style={{
                      position: 'absolute',
                      left: scaledX,
                      top: scaledY,
                      width: scaledW,
                      height: scaledH,
                      pointerEvents: 'none',
                    }}
                  />
                );
              })
            )}
          </div>
        ))}
        <img
          src={
            surahNumber < 10
              ? `/png/00${surahNumber}.png`
              : surahNumber > 9 && surahNumber < 100
              ? `/png/0${surahNumber}.png`
              : `/png/${surahNumber}.png`
          }
          style={{ width: '300px', height: 'auto', display: 'block', margin: '0 auto' }} // Center align the image
        />
      </div>

      {audioSrc && (
        <audio controls autoPlay src={audioSrc} className='hidden'>
          Your browser does not support the audio element.
        </audio>
      )}

      <div className='flex justify-center'>
        {surahNumber > 1 ? (
          <button
            onClick={() => {
              setSurahNumber(surahNumber - 1);
            }}
            className='flex p-2 mt-2 ml-2 mb-8 border-2 rounded border-black hover:text-white hover:bg-black ease-in duration-150 cursor-pointer'
          >
            <MdNavigateBefore className='mt-auto mb-auto' />
            Previous Page
          </button>
        ) : (
          <button
            disabled
            className='flex p-2 mt-2 ml-2 mb-8 border-2 rounded border-gray-500 bg-gray-500 ease-in duration-150 cursor-pointer'
          >
            <MdNavigateBefore className='mt-auto mb-auto' />
            <span className='mt-auto mb-auto'>Previous Page</span>
          </button>
        )}

        <button
          onClick={() => {
            setSurahNumber(surahNumber + 1);
          }}
          className='flex p-2 mt-2 ml-2 mb-8 border-2 rounded border-black hover:text-white hover:bg-black ease-in duration-150 cursor-pointer'
        >
          <span className='mt-auto mb-auto'>Next Page</span> <MdNavigateNext className='mt-auto mb-auto' />
        </button>
      </div>
    </div>
  );
}

export default App;
