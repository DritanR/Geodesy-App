const Adress = ({adresa, setAdresa}) => {

    function handleCity (event) {
        setAdresa(event.target.value);
    }

    return (
        <div className="adress">
            <div className="adress-container">
                <input className="city-adress"
                    type="text"
                    placeholder="Adresa"
                    value={adresa}
                    onChange={handleCity}
                />
            </div>
        </div>
    );
}

export default Adress;