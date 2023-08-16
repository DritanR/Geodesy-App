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
import All from './components/pages/All';

function App() {

  const lockPass = 'Hajvan'
  const [lockValue, setLockValue] = useState('')
  const [logOut, setLogOut] = useState(false)

  /* Routes Data */
  const [client, setClient] = useState([]);
  const [imeIPrezime, setImeIPrezime] = useState('')
  const [brojNaBaranje, setBrojNaBaranje] = useState('')
  const [id, setId] = useState('')
  const [telefonskiBroj, setTelefonskiBroj] = useState()
  const [adresa, setAdresa] = useState('')
  const [date, setDate] = useState('')
  const [vidNaUsloga, setVidNaUsloga] = useState('')
  const [ko, setKo] = useState('')
  const [kp, setKp] = useState('')

  return (
    <>
      {lockPass !== lockValue || logOut ? (
        <Lock lockPass={lockPass} lockValue={lockValue} setLockValue={setLockValue} />
      ) : (
        <>
          <Navbar setLogOut={setLogOut} setLockValue={setLockValue} imeIPrezime={imeIPrezime} setImeIPrezime={setImeIPrezime} setId={setId} date={date} setDate={setDate} telefonskiBroj={telefonskiBroj} setTelefonskiBroj={setTelefonskiBroj} adresa={adresa} setAdresa={setAdresa} vidNaUsloga={vidNaUsloga} setVidNaUsloga={setVidNaUsloga} ko={ko} setKo={setKo} brojNaBaranje={brojNaBaranje} setBrojNaBaranje={setBrojNaBaranje} kp={kp} setKp={setKp} id={id} client={client} setClient={setClient} />
          <Routes>
            <Route path='/all' element={<All client={client} setClient={setClient} />} />
            <Route path='/search' element={<Search client={client} setClient={setClient} />} />
            <Route path='/broj' element={<Broj brojNaBaranje={brojNaBaranje} setBrojNaBaranje={setBrojNaBaranje} />} />
            <Route path='/broj-na-baranje' element={<SearchingNumber id={id} setId={setId} />} />
            <Route path='/telefonski-broj' element={<PhoneNumber telefonskiBroj={telefonskiBroj} setTelefonskiBroj={setTelefonskiBroj} />} />
            <Route path='/ime-i-prezime' element={<NameLastName imeIPrezime={imeIPrezime} setImeIPrezime={setImeIPrezime}/>} />
            <Route path='/adresa' element={<Adress adresa={adresa} setAdresa={setAdresa} />} />
            <Route path='/data' element={<Date date={date} setDate={setDate} />} />
            <Route path='/vid-na-usloga' element={<VidNaUsloga vidNaUsloga={vidNaUsloga} setVidNaUsloga={setVidNaUsloga} />} />
            <Route path='/ko' element={<KO ko={ko} setKo={setKo} />} />
            <Route path='/kp' element={<KP kp={kp} setKp={setKp} />} />
          </Routes>
        </>
      )}
    </>
  );
}

export default App;
