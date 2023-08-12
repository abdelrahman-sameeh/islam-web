import axios from "axios"
import { useEffect, useState } from "react"
import SubTitle from "./utility/SubTitle"

const AzanPageComp = () => {
  const cities = {
    cairo: 'القاهرة',
    menofia: 'المنوفيه',
    Alexandria: 'الاسكندرية',
    Gizeh: 'الجيزة',
    Suez: 'السويس',
    Luxor: 'الاقصر',
    alMansura: 'المنصوره',
    Tanta: 'طنطا',
    Asyut: 'اسيوط',
    Ismailia: 'الاسماعلية',
    Fayyum: 'الفيوم',
    Zagazig: 'الزقازيق',
    Aswan: 'اسوان',
    Damietta: 'دمياط',
    Damanhur: 'دمنهور',
    alMinya: 'المنيا',
    BeniSuef: 'بنى سويف',
    Qena: 'قنا',
    Sohag: 'سوهاج',
    Hurghada: 'الغردقه',
    Arish: 'العريش',
    KafrElSheikh: 'كفر الشيخ',
    MarsaMatruh: 'مرسى مطروح',
  }

  const [city, setCity] = useState('cairo');
  const [time, setTime] = useState({});
  const [loading, setLoading] = useState(true);
  const [isPress, setIsPress] = useState(false);


  const handleSelect = (e) => {
    setCity(e.target.value)
    setTime({})
  }


  let response = '';

  useEffect(() => {

    // get city azan time
    const getAzan = async () => {

      const date = new Date()
      try {
        setLoading(true)
        setIsPress(true)
        response = await axios.get(`https://api.aladhan.com/v1/timingsByCity/${date.toDateString()}?city=${city}&country=egypt`)
      } catch (err) {
        response = err.response
      }
      setLoading(false)
      setIsPress(false)
      setTime(response.data)




    }

    getAzan()

  }, [city])


  console.log(time);





  return (
    <div className="container">
      {/* sub title */}
      <SubTitle pageName='مواقيت الصلاة' />

      {/* filter  */}
      <div style={{ background: 'var(--alt-color)' }} className="filter rounded px-2 py-3 my-3 ">
        <div className="d-flex gap-3 justify-content-start align-items-center ">
          <span className="fs-4" htmlFor="select"> اختر البلد </span>
          <select onChange={handleSelect} style={{ backgroundColor: 'var(--main-color)', color: 'var(--black)' }} className="form-select w-fit fs-5" id="select">
            {Object.keys(cities).map((key, index) => {
              return <option key={index} value={key} > {cities[key]} </option>
            })}
          </select>
        </div>
        {
          time && time.data && time.code === 200 && <div className="d-flex justify-content-between align-items-center mt-2">
            <span className="fs-5"> {time && time.data && time.data.date.hijri.date} هجري   </span>
            <span className="fs-5"> {time && time.data && time.data.date.gregorian.date} ميلادى </span>
          </div>
        }
        <h2 className="mt-2 mb-1">التوقيت بمدينة {city ? cities[city] : 'القاهرة'} </h2>
      </div>

      {/* azan */}

      {
        (loading && isPress) ?
          (<div style={{ backgroundColor: 'var(--alt-color)' }} className="rounded my-3 d-flex justify-content-center align-items-center">
            <div className="lds-dual-ring"></div>
          </div>)
          :
          ((time && time.code === 400) ? 
          // if azan time not loaded and failre on server
          (<h2> حدث خطأ حاول فى وقت لاحق </h2>)          
           : ((time.data) && <table className="azan-table table rounded">
            <thead>
              <tr>
                <th scope="col">التوقيت</th>
                <th scope="col">الساعه</th>
              </tr>

            </thead>
            <tbody>
              <>
                <tr>
                  <td>الفجر</td>
                  <td>{time.data.timings.Fajr}</td>
                </tr>
                <tr>
                  <td>الشروق</td>
                  <td>{time.data.timings.Sunrise}</td>
                </tr>
                <tr>
                  <td>الظهر</td>
                  <td>{time.data.timings.Dhuhr}</td>
                </tr>
                <tr>
                  <td>العصر</td>
                  <td>{time.data.timings.Asr}</td>
                </tr>
                <tr>
                  <td>المغرب</td>
                  <td>{time.data.timings.Maghrib}</td>
                </tr>
                <tr>
                  <td>العشاء</td>
                  <td>{time.data.timings.Isha}</td>
                </tr>

              </>

            </tbody>
          </table>))
      }

    </div>
  )

}

export default AzanPageComp