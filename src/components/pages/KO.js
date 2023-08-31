import '../styling/pages-styling/KO.css'

const KO = ({ko, setKo}) => {

    function handleKo (event) {
        setKo(event.target.value)
    }

    return (
        <div className="ko">
            <h2 className='ko-title'>Adding ko:</h2>
            <div className="ko-container">
                <input
                className='ko-input'
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