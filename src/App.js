import { useState } from 'react';
import Lock from './components/Lock'
import Navbar from './components/Navbar';
import { Routes, Route } from 'react-router-dom';
import NameLastName from './components/pages/NameLastName';
import SearchingNumber from './components/pages/SearchingNumber';
import PhoneNumber from './components/pages/PhoneNumber';
import Adress from './components/pages/Adress';
import Date from './components/pages/Date';
import VidNaUsloga from './components/pages/VidNaUsloga';
import KO from './components/pages/KO';
import Broj from './components/pages/Broj';
import KP from './components/pages/KP';
import Search from './components/pages/Search';

function App() {

  const lockPass = 'Hajvan'
  const [lockValue, setLockValue] = useState('')
  const [logOut, setLogOut] = useState(false)

  /* Routes Data */

  const [name, setName] = useState('')
  const [broj, setBroj] = useState('')
  const [id, setId] = useState(0)
  const [phoneNumber, setPhoneNumber] = useState()
  const [city, setCity] = useState('')
  const [province, setProvince] = useState('')
  const [streetAdress, setStreetAdress] = useState('')
  const [postalCode, setPostalCode] = useState('')
  const [date, setDate] = useState('')
  const [vid, setVid] = useState('')
  const [ko, setKo] = useState('')
  const [kp, setKp] = useState('')

  return (
    <>
      {lockPass !== lockValue || logOut ? (
        <Lock lockPass={lockPass} lockValue={lockValue} setLockValue={setLockValue} />
      ) : (
        <>
          <Navbar setLogOut={setLogOut} setLockValue={setLockValue} name={name} setName={setName} setId={setId} date={date} setDate={setDate} phoneNumber={phoneNumber} setPhoneNumber={setPhoneNumber} city={city} setCity={setCity} province={province} setProvince={setProvince} setStreetAdress={setStreetAdress} streetAdress={streetAdress} postalCode={postalCode} setPostalCode={setPostalCode} vid={vid} setVid={setVid} ko={ko} setKo={setKo} broj={broj} setBroj={setBroj} kp={kp} setKp={setKp} id={id} />
          <Routes>
            <Route index element={<Search />} />
            <Route path='/broj' element={<Broj broj={broj} setBroj={setBroj} />} />
            <Route path='/broj-na-baranje' element={<SearchingNumber id={id} setId={setId} />} />
            <Route path='/telefonski-broj' element={<PhoneNumber phoneNumber={phoneNumber} setPhoneNumber={setPhoneNumber} />} />
            <Route path='/ime-i-prezime' element={<NameLastName name={name} setName={setName}/>} />
            <Route path='/adresa' element={<Adress city={city} setCity={setCity} province={province} setProvince={setProvince} streetAdress={streetAdress} setStreetAdress={setStreetAdress} postalCode={postalCode} setPostalCode={setPostalCode} />} />
            <Route path='/data' element={<Date date={date} setDate={setDate} />} />
            <Route path='/vid-na-usloga' element={<VidNaUsloga vid={vid} setVid={setVid} />} />
            <Route path='/ko' element={<KO ko={ko} setKo={setKo} />} />
            <Route path='/kp' element={<KP kp={kp} setKp={setKp} />} />
          </Routes>
        </>
      )}
    </>
  );
}

export default App;
