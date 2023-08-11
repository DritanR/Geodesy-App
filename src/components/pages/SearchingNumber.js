import '../styling/pages-styling/SearchingNumber.css'

const SearchingNumber = ({id, setId}) => {

    function handleId (event) {
        setId(event.target.value)
    }

    return (
        <div className="searching-number">
            <div className='search-number-container'>
                <input
                type='number'
                placeholder='id'
                value={id}
                onChange={handleId}
                />
            </div>
        </div>
    );
}
 
export default SearchingNumber;