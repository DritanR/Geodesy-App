import '../styling/pages-styling/Date.css'

const Date = ({date, setDate}) => {

    function handleData (event) {
        setDate(event.target.value)
    }
    return (
        <div className='data'>
            <h2 className='data-title'>Adding data:</h2>
            <div className='data-container'>
                <input 
                className='data-input'
                type='date' 
                value={date}
                onChange={handleData}
                />
            </div>
        </div>
    );
}

export default Date;