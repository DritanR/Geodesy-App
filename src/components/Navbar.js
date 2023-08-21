import { Link } from 'react-router-dom';
import NavbarElement from './NavbarElement';
import './styling/Navbar.css'
import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';

const Navbar = ({ setLogOut, setLockValue, imeIPrezime, setImeIPrezime, setId, date, setDate, telefonskiBroj, setTelefonskiBroj, adresa, setAdresa, vidNaUsloga, setVidNaUsloga, ko, setKo, brojNaBaranje, setBrojNaBaranje, kp, setKp, id, client, setClient }) => {

    const [addMessage, setAddMessage] = useState(null)
    const [addedMessage, setAddedMessage] = useState(null)
    const [showModal, setShowModal] = useState(false)

    useEffect(() => {
        if (addedMessage || addMessage) {
            const timeout = setTimeout(() => {
                setAddedMessage(null);
                setAddMessage(null)
            }, 3000);

            return () => {
                clearTimeout(timeout);
            };
        }
    }, [addedMessage, addMessage]);

    function handleLogOut() {
        setLogOut(true)
        setLockValue('')
        setLogOut(false)
    }

    function resetData() {
        setImeIPrezime('')
        setId('')
        setDate('')
        setTelefonskiBroj('')
        setAdresa('')
        setVidNaUsloga('')
        setKo('')
        setBrojNaBaranje('')
        setKp('')
        setAddMessage(null)
    }

    function resetClient () {
        setClient([])
    }

    const handleAddClient = async () => {
        if ((id === '' || id === undefined) && imeIPrezime === '') {
            setAddMessage('Please fill the empty ID and Name field to add a client!')
        } else if ((id !== '' && id !== undefined) && imeIPrezime === '') {
            setAddMessage('Please fill the empty Name field to add a client!')
        } else if ((id === '' || id === undefined) && imeIPrezime !== '') {
            setAddMessage('Please fill the empty ID field to add a client!')
        } else {
            try {
                resetData()
                setAddMessage(null)
                setShowModal(false)

                const response = await fetch('http://localhost:5000/add/client', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ id, brojNaBaranje, imeIPrezime, adresa, telefonskiBroj, vidNaUsloga, ko, kp, date }),
                })

                const data = await response.json()
                setAddedMessage(data.message)
                console.log(data)
            } catch (error) {
                if (error.response && error.response.status === 400) {
                    setAddMessage(error.response.data.message)
                } else {
                    console.error('Error saving the client data', error)
                }
            }
        }
    }

    const fetchClientData = async () => {
        try {
            resetData()
            const response = await axios.get('http://localhost:5000/get/client');
            setClient(response.data);
        } catch (error) {
            console.error('Error fetching client data:', error);
        }
    };

    return (
        <div className='navbar'>

            <div className='navbar-container-left'>
                <button className='log-out-button' onClick={handleLogOut}>Log Out</button>
                <Link to='/search'><button className='search-button' onClick={resetClient}><NavbarElement name='Search' /></button></Link>
                <Link to ='/all'><button className='all-button' onClick={fetchClientData}>All</button></Link>
            </div>

            <div className='navbar-container-center'>
                <div className='add-clients-container'>
                    <Link to='/broj-na-baranje'><NavbarElement name="Id" /></Link>
                    <Link to='/broj'><NavbarElement name="Broj Na Baranje" /></Link>
                    <Link to='/ime-i-prezime'><NavbarElement name="Ime I Prezime" /></Link>
                    <Link to='/adresa'><NavbarElement name="Adresa" /></Link>
                    <Link to='/telefonski-broj'><NavbarElement name="Telefonski Broj" /></Link>
                    <Link to='/vid-na-usloga'><NavbarElement name="Vid na usloga" /></Link>
                    <Link to='/ko'><NavbarElement name="KO" /></Link>
                    <Link to='/kp'><NavbarElement name="KP" /></Link>
                    <Link to='/data'><NavbarElement name="Data" /></Link>
                </div>
                <p className='add-message'>{addMessage}</p>
                <p className='added-message'>{addedMessage}</p>
                {showModal && (
                    <div className='modal'>
                        <p>Are you sure you want to add a client?</p>
                        <button className='yes' onClick={handleAddClient}>Yes</button>
                        <button className='no' onClick={() => setShowModal(false)}>No</button>
                    </div>
                )}
            </div>

            <div className='navbar-container-right'>
                <button className='reset-data' onClick={resetData}>Reset Data</button>
                <button className='add-to-database' onClick={() => setShowModal(true)}>Add Client</button>
            </div>

        </div>
    );
}

export default Navbar;