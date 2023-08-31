import '../styling/pages-styling/VidNaUsloga.css'

const VidNaUsloga = ({ vidNaUsloga, setVidNaUsloga }) => {

    function handleVid(event) {
        setVidNaUsloga(event.target.value);
    }

    return (
        <div className="vid-na-usloga">
            <div className="vid-na-usloga-container">
                <h2 className='vid-na-usloga-title'>Adding Vid na usloga:</h2>
                <input
                    className='vid-na-usloga-input'
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