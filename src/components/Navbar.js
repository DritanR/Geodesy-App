import { Link } from 'react-router-dom';
import NavbarElement from './NavbarElement';
import './styling/Navbar.css'

const Navbar = ({ setLogOut, setLockValue, name, setName, setId, date, setDate, phoneNumber, setPhoneNumber, city, setCity, province, setProvince, streetAdress, setStreetAdress, postalCode, setPostalCode, vid, setVid, ko, setKo, broj, setBroj, kp, setKp, id }) => {

    function handleLogOut() {
        setLogOut(true)
        setLockValue('')
        setLogOut(false)
    }

    function resetData() {
        setName('')
        setId(0)
        setDate('')
        setPhoneNumber('')
        setCity('')
        setProvince('')
        setStreetAdress('')
        setPostalCode('')
        setVid('')
        setKo('')
        setBroj('')
        setKp('')
    }

    const handleAddClient = async () => {

        resetData()

        try {
            const response = await fetch('http://localhost:5000/add/client', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', // Add this line
                },
                body: JSON.stringify({ id, broj, name, city, province, streetAdress, postalCode, phoneNumber, vid, ko, kp, date }),
            })
    
            const data = await response.json()
            console.log(data)
        } catch (error) {
            console.error('Error saving the client data', error)
        }
    }


    return (
        <div className='navbar'>

            <div className='navbar-container-left'>
                <button className='log-out-button' onClick={handleLogOut}>Log Out</button>
                <Link to='/'><NavbarElement name='Search' /></Link>
            </div>

            <div className='navbar-container-right'>
                <Link to='/broj-na-baranje'><NavbarElement name="Br. Na Baranje" /></Link>
                <Link to='/broj'><NavbarElement name="Broj" /></Link>
                <Link to='/ime-i-prezime'><NavbarElement name="Ime I Prezime" /></Link>
                <Link to='/adresa'><NavbarElement name="Adresa" /></Link>
                <Link to='/telefonski-broj'><NavbarElement name="Telefonski Broj" /></Link>
                <Link to='/vid-na-usloga'><NavbarElement name="Vid na usloga" /></Link>
                <Link to='/ko'><NavbarElement name="KO" /></Link>
                <Link to='/kp'><NavbarElement name="KP" /></Link>
                <Link to='/data'><NavbarElement name="Data" /></Link>
            </div>

            <button className='reset-data' onClick={resetData}>Reset Data</button>
            <button className='add-to-database' onClick={handleAddClient}>Add</button>

        </div>
    );
}

export default Navbar;