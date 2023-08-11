import '../styling/pages-styling/Date.css'

const Date = ({date, setDate}) => {

    function handleData (event) {
        setDate(event.target.value)
    }
    return (
        <div className='data'>
            <div className='data-container'>
                <input 
                type='date' 
                value={date}
                onChange={handleData}
                />
            </div>
        </div>
    );
}

export default Date;