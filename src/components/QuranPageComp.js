import React, { useEffect, useRef, useState } from 'react'
import SubTitle from './utility/SubTitle'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'

const QuranPageComp = () => {

  const {id: surahId} = useParams()
  const [surahNum, setSurahNum] = useState(surahId)
  const [surahText, setSurahText] = useState()
  const surahAudioLink = useRef()
  const navigate = useNavigate()

  const handleSelect = (e) => {
    setSurahNum(e.target.value)
    navigate(`/quran/surah/${e.target.value}`)
    setSurahText([])
  }

  useEffect(() => {
    // get audio
    const getSurahAudio = (surahNumber = 1) => {
      if (surahNumber < 100 && surahNumber > 10) {
        surahNumber = `0${surahNumber}`
      } else if (surahNumber < 10) {
        surahNumber = `00${surahNumber}`
      }
      surahAudioLink.current.src = `https://download.quranicaudio.com/quran/mishaari_raashid_al_3afaasee/${surahNumber}.mp3`
    }

    getSurahAudio(surahNum)


    // get audio
    const getSurahText = async (surahNumber = 1) => {

      const res = await axios.get(`https://quranenc.com/api/v1/translation/sura/arabic_moyassar/${surahNumber}`)
      setSurahText(res.data.result)

    }

    getSurahText(surahNum)


  }, [surahNum])


  return (
    <div>
      {/* sub title */}
      <SubTitle pageName=' القران الكريم' />
      {/* audio */}
      <div className="d-flex justify-content-between align-items-center gap-2">
        <select onChange={handleSelect} value={surahNum} className='form-select w-fit' name="" id=""><option value="1"> سُورَةُ ٱلْفَاتِحَةِ </option><option value="2"> سُورَةُ البَقَرَةِ </option><option value="3"> سُورَةُ آلِ عِمۡرَانَ </option><option value="4"> سُورَةُ النِّسَاءِ </option><option value="5"> سُورَةُ المَائـِدَةِ </option><option value="6"> سُورَةُ الأَنۡعَامِ </option><option value="7"> سُورَةُ الأَعۡرَافِ </option><option value="8"> سُورَةُ الأَنفَالِ </option><option value="9"> سُورَةُ التَّوۡبَةِ </option><option value="10"> سُورَةُ يُونُسَ </option><option value="11"> سُورَةُ هُودٍ </option><option value="12"> سُورَةُ يُوسُفَ </option><option value="13"> سُورَةُ الرَّعۡدِ </option><option value="14"> سُورَةُ إِبۡرَاهِيمَ </option><option value="15"> سُورَةُ الحِجۡرِ </option><option value="16"> سُورَةُ النَّحۡلِ </option><option value="17"> سُورَةُ الإِسۡرَاءِ </option><option value="18"> سُورَةُ الكَهۡفِ </option><option value="19"> سُورَةُ مَرۡيَمَ </option><option value="20"> سُورَةُ طه </option><option value="21"> سُورَةُ الأَنبِيَاءِ </option><option value="22"> سُورَةُ الحَجِّ </option><option value="23"> سُورَةُ المُؤۡمِنُونَ </option><option value="24"> سُورَةُ النُّورِ </option><option value="25"> سُورَةُ الفُرۡقَانِ </option><option value="26"> سُورَةُ الشُّعَرَاءِ </option><option value="27"> سُورَةُ النَّمۡلِ </option><option value="28"> سُورَةُ القَصَصِ </option><option value="29"> سُورَةُ العَنكَبُوتِ </option><option value="30"> سُورَةُ الرُّومِ </option><option value="31"> سُورَةُ لُقۡمَانَ </option><option value="32"> سُورَةُ السَّجۡدَةِ </option><option value="33"> سُورَةُ الأَحۡزَابِ </option><option value="34"> سُورَةُ سَبَإٍ </option><option value="35"> سُورَةُ فَاطِرٍ </option><option value="36"> سُورَةُ يسٓ </option><option value="37"> سُورَةُ الصَّافَّاتِ </option><option value="38"> سُورَةُ صٓ </option><option value="39"> سُورَةُ الزُّمَرِ </option><option value="40"> سُورَةُ غَافِرٍ </option><option value="41"> سُورَةُ فُصِّلَتۡ </option><option value="42"> سُورَةُ الشُّورَىٰ </option><option value="43"> سُورَةُ الزُّخۡرُفِ </option><option value="44"> سُورَةُ الدُّخَانِ </option><option value="45"> سُورَةُ الجَاثِيَةِ </option><option value="46"> سُورَةُ الأَحۡقَافِ </option><option value="47"> سُورَةُ مُحَمَّدٍ </option><option value="48"> سُورَةُ الفَتۡحِ </option><option value="49"> سُورَةُ الحُجُرَاتِ </option><option value="50"> سُورَةُ قٓ </option><option value="51"> سُورَةُ الذَّارِيَاتِ </option><option value="52"> سُورَةُ الطُّورِ </option><option value="53"> سُورَةُ النَّجۡمِ </option><option value="54"> سُورَةُ القَمَرِ </option><option value="55"> سُورَةُ الرَّحۡمَٰن </option><option value="56"> سُورَةُ الوَاقِعَةِ </option><option value="57"> سُورَةُ الحَدِيدِ </option><option value="58"> سُورَةُ المُجَادلَةِ </option><option value="59"> سُورَةُ الحَشۡرِ </option><option value="60"> سُورَةُ المُمۡتَحنَةِ </option><option value="61"> سُورَةُ الصَّفِّ </option><option value="62"> سُورَةُ الجُمُعَةِ </option><option value="63"> سُورَةُ المُنَافِقُونَ </option><option value="64"> سُورَةُ التَّغَابُنِ </option><option value="65"> سُورَةُ الطَّلَاقِ </option><option value="66"> سُورَةُ التَّحۡرِيمِ </option><option value="67"> سُورَةُ المُلۡكِ </option><option value="68"> سُورَةُ القَلَمِ </option><option value="69"> سُورَةُ الحَاقَّةِ </option><option value="70"> سُورَةُ المَعَارِجِ </option><option value="71"> سُورَةُ نُوحٍ </option><option value="72"> سُورَةُ الجِنِّ </option><option value="73"> سُورَةُ المُزَّمِّلِ </option><option value="74"> سُورَةُ المُدَّثِّرِ </option><option value="75"> سُورَةُ القِيَامَةِ </option><option value="76"> سُورَةُ الإِنسَانِ </option><option value="77"> سُورَةُ المُرۡسَلَاتِ </option><option value="78"> سُورَةُ النَّبَإِ </option><option value="79"> سُورَةُ النَّازِعَاتِ </option><option value="80"> سُورَةُ عَبَسَ </option><option value="81"> سُورَةُ التَّكۡوِيرِ </option><option value="82"> سُورَةُ الانفِطَارِ </option><option value="83"> سُورَةُ المُطَفِّفِينَ </option><option value="84"> سُورَةُ الانشِقَاقِ </option><option value="85"> سُورَةُ البُرُوجِ </option><option value="86"> سُورَةُ الطَّارِقِ </option><option value="87"> سُورَةُ الأَعۡلَىٰ </option><option value="88"> سُورَةُ الغَاشِيَةِ </option><option value="89"> سُورَةُ الفَجۡرِ </option><option value="90"> سُورَةُ البَلَدِ </option><option value="91"> سُورَةُ الشَّمۡسِ </option><option value="92"> سُورَةُ اللَّيۡلِ </option><option value="93"> سُورَةُ الضُّحَىٰ </option><option value="94"> سُورَةُ الشَّرۡحِ </option><option value="95"> سُورَةُ التِّينِ </option><option value="96"> سُورَةُ العَلَقِ </option><option value="97"> سُورَةُ القَدۡرِ </option><option value="98"> سُورَةُ البَيِّنَةِ </option><option value="99"> سُورَةُ الزَّلۡزَلَةِ </option><option value="100"> سُورَةُ العَادِيَاتِ </option><option value="101"> سُورَةُ القَارِعَةِ </option><option value="102"> سُورَةُ التَّكَاثُرِ </option><option value="103"> سُورَةُ العَصۡرِ </option><option value="104"> سُورَةُ الهُمَزَةِ </option><option value="105"> سُورَةُ الفِيلِ </option><option value="106"> سُورَةُ قُرَيۡشٍ </option><option value="107"> سُورَةُ المَاعُونِ </option><option value="108"> سُورَةُ الكَوۡثَرِ </option><option value="109"> سُورَةُ الكَافِرُونَ </option><option value="110"> سُورَةُ النَّصۡرِ </option><option value="111"> سُورَةُ المَسَدِ </option><option value="112"> سُورَةُ الإِخۡلَاصِ </option><option value="113"> سُورَةُ الفَلَقِ </option><option value="114"> سُورَةُ النَّاسِ </option></select>
        <audio ref={surahAudioLink} controls></audio>
      </div>
      {/* text */}
      {surahText && surahText.length ?
        <>
          <h2 className="text-center"> { } </h2>
          <div style={{ backgroundColor: 'var(--alt-color)', fontFamily: 'sans-serif', lineHeight:'1.7' }} className="px-2 py-3 rounded my-3 fs-5">
            <div className='text-center fs-3 mb-2'>  بِسۡمِ ٱللَّهِ ٱلرَّحۡمَٰنِ ٱلرَّحِيمِ  </div>
            {surahText.map(ayah => {
              return <span key={ayah.id} > {ayah.arabic_text} ({ayah.aya}) </span>
            })}
            <div className='text-center fs-3 mt-2'>  صدق الله العظيم </div>
          </div>
        </>
        : // loading
        <div style={{ backgroundColor: 'var(--alt-color)' }} className="rounded my-3 d-flex justify-content-center align-items-center">
          <div className="lds-dual-ring"></div>
        </div>
      }
    </div>
  )
}

export default QuranPageComp