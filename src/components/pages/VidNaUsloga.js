import '../styling/pages-styling/VidNaUsloga.css'

const VidNaUsloga = ({ vid, setVid }) => {

    function handleVid(event) {
        setVid(event.target.value);
    }

    return (
        <div className="vid-na-usloga">
            <div className="vid-na-usloga-container">
                <input
                    type="text"
                    placeholder="Vid Na Usloga"
                    value={vid}
                    onChange={handleVid}
                />
            </div>
        </div>
    );
}

export default VidNaUsloga;