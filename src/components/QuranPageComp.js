import React, { useEffect, useRef, useState } from "react";
import SubTitle from "./utility/SubTitle";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { suwar } from "../utils/suwarList";

const QuranPageComp = () => {
  const { id: surahId } = useParams();
  const [surahNum, setSurahNum] = useState(surahId);
  const [surahText, setSurahText] = useState();
  const surahAudioLink = useRef();
  const navigate = useNavigate();

  const handleSelect = (e) => {
    setSurahNum(e.target.value);
    navigate(`/quran/surah/${e.target.value}`);
    setSurahText([]);
  };

  useEffect(() => {
    // get audio
    const getSurahAudio = (surahNumber = 1) => {
      if (surahNumber < 100 && surahNumber > 10) {
        surahNumber = `0${surahNumber}`;
      } else if (surahNumber < 10) {
        surahNumber = `00${surahNumber}`;
      }
      surahAudioLink.current.src = `https://download.quranicaudio.com/quran/mishaari_raashid_al_3afaasee/${surahNumber}.mp3`;
    };

    getSurahAudio(surahNum);

    // get audio
    const getSurahText = async (surahNumber = 1) => {
      const res = await axios.get(
        `https://quranenc.com/api/v1/translation/sura/arabic_moyassar/${surahNumber}`
      );
      setSurahText(res.data.result);
    };

    getSurahText(surahNum);
  }, [surahNum]);

  return (
    <div>
      {/* sub title */}
      <SubTitle pageName=" القران الكريم" />
      {/* audio */}
      <div
        style={{ flexWrap: "wrap" }}
        className="d-flex justify-content-between gap-2"
      >
        <select
          onChange={handleSelect}
          value={surahNum}
          className="form-select w-fit"
          name=""
          id=""
        >
          {suwar.map((surah) => (
            <option key={surah.value} value={surah.value}>
              {surah.label}
            </option>
          ))}
        </select>

        <audio
          style={{ minWidth: "200px" }}
          ref={surahAudioLink}
          controls
        ></audio>
      </div>
      {/* text */}
      {surahText && surahText.length ? (
        <>
          <h2 className="text-center"> {} </h2>
          <div
            style={{
              backgroundColor: "var(--alt-color)",
              fontFamily: "sans-serif",
              lineHeight: "1.7",
            }}
            className="px-2 py-3 rounded my-3 fs-5"
          >
            <div className="text-center fs-3 mb-2">
              {" "}
              بِسۡمِ ٱللَّهِ ٱلرَّحۡمَٰنِ ٱلرَّحِيمِ{" "}
            </div>
            {surahText.map((ayah) => {
              return (
                <span key={ayah.id}>
                  {" "}
                  {ayah.arabic_text} ({ayah.aya}){" "}
                </span>
              );
            })}
            <div className="text-center fs-3 mt-2"> صدق الله العظيم </div>
          </div>
        </>
      ) : (
        // loading
        <div
          style={{ backgroundColor: "var(--alt-color)" }}
          className="rounded my-3 d-flex justify-content-center align-items-center"
        >
          <div className="lds-dual-ring"></div>
        </div>
      )}
    </div>
  );
};

export default QuranPageComp;
