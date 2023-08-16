import '../styling/pages-styling/SearchingNumber.css'

const SearchingNumber = ({id, setId}) => {

    function handleId (event) {
        const inputNumber = event.target.value

        const onlyNumbers = inputNumber.replace(/[^0-9]/g, '')
        setId(onlyNumbers)
    }

    const handleKeyDown = (event) => {
        if (event.key === '-' || event.key === '+') {
          event.preventDefault();
        }
      };


    return (
        <div className="searching-number">
            <div className='search-number-container'>
                <input
                type='number'
                placeholder='id'
                value={id}
                onChange={handleId}
                onKeyDown={handleKeyDown}
                />
            </div>
        </div>
    );
}
 
export default SearchingNumber;