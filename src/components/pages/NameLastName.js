import '../styling/pages-styling/NameLastName.css'

const NameLastName = ({imeIPrezime, setImeIPrezime}) => {

    function handleName (event) {
        const value = event.target.value

        const onlyLetters = /^[A-Za-z\s]+$/;

        if (value === '' || onlyLetters.test(value)) {
            setImeIPrezime(value)
        }
    }

    return (
        <div className='name-lastname'>
            <div className='nl-container'>
                <input className='nl-name-input nl-input'
                    type='text'
                    value={imeIPrezime}
                    onChange={handleName}
                    placeholder='Name and Last Name'
                />
            </div>
        </div>
    );
}

export default NameLastName;