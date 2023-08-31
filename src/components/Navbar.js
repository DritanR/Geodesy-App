import { Link } from 'react-router-dom';
import NavbarElement from './NavbarElement';
import './styling/Navbar.css'
import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import { HiOutlineMenu } from "react-icons/hi";

const Navbar = ({ setLogOut, setLockValue, imeIPrezime, setImeIPrezime, setId, date, setDate, telefonskiBroj, setTelefonskiBroj, adresa, setAdresa, vidNaUsloga, setVidNaUsloga, ko, setKo, brojNaBaranje, setBrojNaBaranje, kp, setKp, id, client, setClient, clientFiles, setClientFiles }) => {

    const [addMessage, setAddMessage] = useState(null)
    const [addedMessage, setAddedMessage] = useState(null)
    const [showModal, setShowModal] = useState(false)
    const [showAddClient, setShowAddClient] = useState(false)
    const [showButtons, setShowButtons] = useState(false)

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

    function resetClient() {
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

    function addClientTricks() {
        setShowAddClient(true)
        setShowModal(false)
    }

    function closeClient () {
        setShowAddClient(false)
        resetData()
    }

    function buttons () {
        if (showButtons) {
            setShowButtons(false)
        } else {
            setShowButtons(true)
        }
    }

    return (
        <div className='navbar'>

            {showAddClient ? (
                <div className='navbar-right'>
                        <div className="add-clients-pages">
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

                        <div className="add-clients-buttons">
                            <button className='clients-button' onClick={resetData}>Reset Data</button>
                            <Link to='/'><button className='clients-button' onClick={closeClient}>Close the client</button></Link>
                            <button className='clients-button' onClick={() => setShowModal(true)}>Save the client</button>
                        </div>

                    <div className="add-clients-errors">
                        <p className='add-message error'>{addMessage}</p>
                        <p className='added-message msg'>{addedMessage}</p>
                    </div>
                    
                    {showModal && (
                        <div className='modal'>
                            <p className='modal-text'>Are you sure you want to add a client?</p>
                            <div className='modal-buttons'>
                            <button className='yes' onClick={handleAddClient}>Yes</button>
                            <button className='no' onClick={() => setShowModal(false)}>No</button>
                            </div>
                        </div>
                    )}
                </div>) : (
                    <>
                <div className="navbar-container nvbc-show">
                    <div className="navbar-left">
                        <button className='button-navbar navbar-element' onClick={handleLogOut}>Log Out</button>
                        <Link to='/'><button className="navbar-element">Home</button></Link>
                    </div>

                    <div className="navbar-center">
                        <Link to='/search'><button className='button-navbar navbar-element' onClick={resetClient}>Search</button></Link>
                        <Link to='/all'><button className='button-navbar navbar-element' onClick={fetchClientData}>All Clients</button></Link>
                    </div>
                    <Link to='/broj-na-baranje'><button className="navbar-element button-navbar" onClick={addClientTricks}>Add Client</button></Link>
                </div>
                
                <button className='menu' onClick={buttons}><HiOutlineMenu /></button>
                {showButtons &&<div className="navbar-container nvbc-hide">
                    <div className="navbar-left">
                        <button className='button-navbar navbar-element' onClick={handleLogOut}>Log Out</button>
                        <Link to='/'><button className="navbar-element">Home</button></Link>
                    </div>

                    <div className="navbar-center">
                        <Link to='/search'><button className='button-navbar navbar-element' onClick={resetClient}>Search</button></Link>
                        <Link to='/all'><button className='button-navbar navbar-element' onClick={fetchClientData}>All Clients</button></Link>
                    </div>
                    <button className="navbar-element button-navbar" onClick={addClientTricks}><Link to='/broj-na-baranje'>Add Client</Link></button>
                </div>}
                </>
            )}
        </div>
    );
}

export default Navbar;