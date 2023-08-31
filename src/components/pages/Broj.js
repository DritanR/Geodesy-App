import '../styling/pages-styling/Broj.css'

const Broj = ({brojNaBaranje, setBrojNaBaranje}) => {

    function handleBroj (event) {
        setBrojNaBaranje(event.target.value)
    }

    return (
        <div className="broj-na-baranje">
            <h2 className='broj-na-baranje-title'>Adding broj na baranje:</h2>
            <div className="broj-na-baranje-container">
                <input
                className='broj-na-baranje-input'
                type="text"
                value={brojNaBaranje}
                onChange={handleBroj}
                placeholder="Broj na baranje"
                />
            </div>
        </div>
    );
}
 
export default Broj;