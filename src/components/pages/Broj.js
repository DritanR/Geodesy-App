import '../styling/pages-styling/Broj.css'

const Broj = ({brojNaBaranje, setBrojNaBaranje}) => {

    function handleBroj (event) {
        setBrojNaBaranje(event.target.value)
    }

    return (
        <div className="broj">
            <div className="broj-container">
                <input
                type="text"
                value={brojNaBaranje}
                onChange={handleBroj}
                placeholder="Broj"
                />
            </div>
        </div>
    );
}
 
export default Broj;