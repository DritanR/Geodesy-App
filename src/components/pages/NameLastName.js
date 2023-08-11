import '../styling/pages-styling/NameLastName.css'

const NameLastName = ({name, setName}) => {

    function handleName (event) {
        setName(event.target.value)
    }

    return (
        <div className='name-lastname'>
            <div className='nl-container'>
                <input className='nl-name-input nl-input'
                    type='text'
                    value={name}
                    onChange={handleName}
                    placeholder='Name and Last Name'
                />
            </div>
        </div>
    );
}

export default NameLastName;