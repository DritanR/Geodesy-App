import '../styling/pages-styling/KP.css'

const KP = ({kp, setKp}) => {

    function handleKp (event) {
        setKp(event.target.value)
    }

    return (
        <div className="kp">
            <div className="kp-container">
                <input className="kp-input"
                type="text"
                value={kp}
                onChange={handleKp}
                placeholder="KP"
                />
            </div>
        </div>
    );
}
 
export default KP;