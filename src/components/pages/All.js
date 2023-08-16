import React from 'react'
import Search from './Search'

export default function All({client, setClient}) {
  return (
    <div className='all'>
        {client.length > 0 &&
                <div className='client-container'>
                    {client.map((person) => (
                        <div className='client-data-container' key={person._id}>
                            {editingClients.includes(person._id) ? (
                                <>
                                    Id: <input
                                        type="number"
                                        placeholder="Id"
                                        value={updatedData.id}
                                        onChange={(e) => setUpdatedData({ ...updatedData, id: e.target.value })}
                                    />
                                    Broj Na Baranje: <input
                                        type="text"
                                        placeholder="Broj Na Baranje"
                                        value={updatedData.brojNaBaranje}
                                        onChange={(e) => setUpdatedData({ ...updatedData, brojNaBaranje: e.target.value })}
                                    />
                                    <input
                                        type="text"
                                        value={updatedData.imeIPrezime}
                                        onChange={(e) => setUpdatedData({ ...updatedData, imeIPrezime: e.target.value })}
                                    />
                                    <input
                                        type="text"
                                        value={updatedData.adresa}
                                        onChange={(e) => setUpdatedData({ ...updatedData, adresa: e.target.value })}
                                    />
                                    <input
                                        type="number"
                                        value={updatedData.telefonskiBroj}
                                        onChange={(e) => setUpdatedData({ ...updatedData, telefonskiBroj: e.target.value })}
                                    />
                                    <input
                                        type="text"
                                        value={updatedData.vidNaUsloga}
                                        onChange={(e) => setUpdatedData({ ...updatedData, vidNaUsloga: e.target.value })}
                                    />
                                    <input
                                        type="text"
                                        value={updatedData.ko}
                                        onChange={(e) => setUpdatedData({ ...updatedData, ko: e.target.value })}
                                    />
                                    <input
                                        type="text"
                                        value={updatedData.kp}
                                        onChange={(e) => setUpdatedData({ ...updatedData, kp: e.target.value })}
                                    />
                                    <input
                                        type="date"
                                        value={updatedData.date}
                                        onChange={(e) => setUpdatedData({ ...updatedData, date: e.target.value })}
                                    />
                                    <button onClick={() => handleUpdateClient(person._id, updatedData)}>Update</button>
                                    <button onClick={() => handleCancelEdit(person._id)}>Cancel</button>
                                    {updateMsg}
                                </>
                            ) : (
                                <>
                                    <button onClick={() => handleEditClient(person._id)}>Edit</button>
                                    <button onClick={() => deleteClient(person._id)}>Delete client</button>
                                    <p className='client-data'>Id: {person.id}</p>
                                    <div className='client-data'>{person.brojNaBaranje !== '' && 'Broj Na Baranje: ' + person.brojNaBaranje} {person.brojNaBaranje !== '' && <button onClick={() => clearValue(person._id, 'brojNaBaranje')}>Delete</button>}</div>
                                    <p className='client-data'>Ime i Prezime: {person.imeIPrezime}</p>
                                    <p className='client-data'>{person.adresa !== '' && 'Adresa: ' + person.adresa}</p>
                                    <p className='client-data'>{(person.telefonskiBroj !== '' && person.telefonskiBroj !== undefined) && 'Telefonski Broj: ' + person.telefonskiBroj}</p>
                                    <p className='client-data'>{person.vidNaUsloga !== '' && 'Vid Na Usloga: ' + person.vidNaUsloga}</p>
                                    <p className='client-data'>{person.ko !== '' && 'KO: ' + person.ko}</p>
                                    <p className='client-data'>{person.kp !== '' && 'KP: ' + person.kp}</p>
                                    <p className='client-data'>{(person.date !== undefined && person.date !== '') && 'Data: ' + person.date}</p>
                                    <br></br>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            }
    </div>
  )
}
