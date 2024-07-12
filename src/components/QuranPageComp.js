import React, { useEffect, useRef, useState } from "react";
import SubTitle from "./utility/SubTitle";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import suwarList from "../utils/suwar";
import { Autocomplete, Grid, TextField } from "@mui/material";

const QuranPageComp = () => {
  const { id: surahId } = useParams();
  const [suwar, setSuwar] = useState(suwarList);
  const [surahNum, setSurahNum] = useState(surahId);
  const [surahText, setSurahText] = useState();
  const [reciters, setReciters] = useState([]);
  const [server, setServer] = useState("https://server8.mp3quran.net/lhdan/");
  const [moshafs, setMoshafs] = useState([]);
  const [moshaf, setMoshaf] = useState({});
  const [reciterName, setReciterName] = useState("محمد اللحيدان");

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
      if (surahNumber < 100 && surahNumber >= 10) {
        surahNumber = `0${surahNumber}`;
      } else if (surahNumber < 10) {
        surahNumber = `00${surahNumber}`;
      }
      surahAudioLink.current.src = `${server}${surahNumber}.mp3`;
    };
    getSurahAudio(surahNum);

    // get text
    const getSurahText = async (surahNumber = 1) => {
      const res = await axios.get(
        `https://quranenc.com/api/v1/translation/sura/arabic_moyassar/${surahNumber}`
      );
      setSurahText(res.data.result);
    };

    getSurahText(surahNum);
  }, [surahNum, server]);

  const getReciters = async () => {
    try {
      const response = await axios.get(
        "https://www.mp3quran.net/api/v3/reciters?language=ar"
      );
      if (response.status == 200) {
        const newReciters = response?.data?.reciters?.map((reciter) => ({
          ...reciter,
          label: reciter.name,
        }));
        setReciters(newReciters);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getReciters();
  }, []);

  const handleChangeReciter = (e, newValue) => {
    if(newValue?.id){
      setReciterName(newValue?.name);
      setMoshafs(newValue?.moshaf);
      setMoshaf(newValue?.moshaf[0]);
      setServer(newValue?.moshaf[0]?.server);

      const availableSuwar = newValue?.moshaf[0]?.surah_list?.split(',')
      const filteredSuwar = suwarList.filter(surah=>availableSuwar.includes(surah.id))
      setSuwar(filteredSuwar)
    }
  };

  return (
    <div>
      {/* sub title */}
      <SubTitle pageName=" القران الكريم" />

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Autocomplete
            onChange={handleChangeReciter}
            disablePortal
            options={reciters}
            value={reciterName}
            sx={{ backgroundColor: "white", width: "100%", direction: "rtl" }}
            renderInput={(params) => (
              <TextField {...params} label="ابحث عن قارئ" />
            )}
          />
        </Grid>

        {moshafs?.length > 1 && (
          <Grid item xs={12} md={6}>
            <select
              onChange={(e) => {
                const newMoshaf = JSON.parse(e.target.value);
                setMoshaf(newMoshaf);
                setServer(newMoshaf?.server);
                // 
                const availableSuwar = newMoshaf?.surah_list?.split(',')
                const filteredSuwar = suwarList.filter(surah=>availableSuwar.includes(surah.id))
                setSuwar(filteredSuwar)
              }}
              value={JSON.stringify(moshaf)}
              className="form-select"
            >
              {moshafs.map((moshaf) => (
                <option key={moshaf.id} value={JSON.stringify(moshaf)}>
                  {moshaf.name}
                </option>
              ))}
            </select>
          </Grid>
        )}

        <Grid item xs={12} md={6}>
          <select
            onChange={handleSelect}
            value={surahNum}
            className="form-select"
          >
            {suwar.map((surah) => (
              <option key={surah.id} value={surah.id}>
                {surah.label}
              </option>
            ))}
          </select>
        </Grid>
        <Grid item xs={12} md={6}>
          <audio
            style={{ width: "100%" }}
            ref={surahAudioLink}
            controls
          ></audio>
        </Grid>
      </Grid>

      {/* text */}
      {surahText && surahText.length ? (
        <>
          <h2 className="text-center"> {} </h2>
          <div
            style={{
              backgroundColor: "var(--alt-color)",
              lineHeight: "1.7",
            }}
            className="px-2 py-3 rounded my-3 fs-5 quran-font"
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
