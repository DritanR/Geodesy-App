import '../styling/pages-styling/Broj.css'

const Broj = ({broj, setBroj}) => {

    function handleBroj (event) {
        setBroj(event.target.value)
    }

    return (
        <div className="broj">
            <div className="broj-container">
                <input
                type="text"
                value={broj}
                onChange={handleBroj}
                placeholder="Broj"
                />
            </div>
        </div>
    );
}
 
export default Broj;