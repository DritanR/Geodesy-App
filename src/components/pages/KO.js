import '../styling/pages-styling/KO.css'

const KO = ({ko, setKo}) => {

    function handleKo (event) {
        setKo(event.target.value)
    }

    return (
        <div className="ko">
            <div className="ko-container">
                <input
                type="text"
                value={ko}
                onChange={handleKo}
                placeholder="KO"
                />
            </div>
        </div>
    );
}
 
export default KO;