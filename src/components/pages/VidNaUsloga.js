import '../styling/pages-styling/VidNaUsloga.css'

const VidNaUsloga = ({ vidNaUsloga, setVidNaUsloga }) => {

    function handleVid(event) {
        setVidNaUsloga(event.target.value);
    }

    return (
        <div className="vid-na-usloga">
            <div className="vid-na-usloga-container">
                <input
                    type="text"
                    placeholder="Vid Na Usloga"
                    value={vidNaUsloga}
                    onChange={handleVid}
                />
            </div>
        </div>
    );
}

export default VidNaUsloga;