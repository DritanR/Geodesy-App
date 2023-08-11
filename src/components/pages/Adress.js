const Adress = ({city, setCity, province, setProvince, streetAdress, setStreetAdress, postalCode, setPostalCode}) => {

    function handleCity (event) {
        setCity(event.target.value);
    }
    
    function handleProvince (event) {
        setProvince(event.target.value);
    }

    function handleStreetAdress (event) {
        setStreetAdress(event.target.value);
    }

    function handlePostalCode (event) {
        setPostalCode(event.target.value);
    }

    function resetAdressData () {
        setCity('');
        setProvince('');
        setStreetAdress('');
        setPostalCode('');
    }

    return (
        <div className="adress">
            <div className="adress-container">
                <input className="city-adress"
                    type="text"
                    placeholder="City Adress"
                    value={city}
                    onChange={handleCity}
                />
                <input className="state/rovince"
                    type="text"
                    placeholder="State/Province Adress"
                    value={province}
                    onChange={handleProvince}
                />
                <input className="street-adress"
                    type="text"
                    placeholder="Street Adress"
                    value={streetAdress}
                    onChange={handleStreetAdress}
                />
                <input className="postal/zip-code"
                    type="text"
                    placeholder="Postal/Zip Code"
                    value={postalCode}
                    onChange={handlePostalCode}
                />
            </div>

            <button className="reset-adress-data" onClick={resetAdressData}>Reset</button>
        </div>
    );
}

export default Adress;