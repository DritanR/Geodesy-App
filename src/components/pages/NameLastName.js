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
            <h2 className='name-lastname-title'>Adding Name and Last Name:</h2>
            <div className='name-lastname-container'>
                <input
                    className="name-lastname-input"
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