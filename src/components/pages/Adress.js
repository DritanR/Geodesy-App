import '../styling/pages-styling/Adress.css'

const Adress = ({adresa, setAdresa}) => {

    function handleCity (event) {
        setAdresa(event.target.value);
    }

    return (
        <div className="adress">
            <h2 className='adress-title'>Adding adress: </h2>
            <div className="adress-container">
                <input className="adress-input"
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