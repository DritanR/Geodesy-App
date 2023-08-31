import '../styling/pages-styling/PhoneNumber.css'

const PhoneNumber = ({telefonskiBroj, setTelefonskiBroj}) => {

    function handlePhoneNumber (e) {
        setTelefonskiBroj(e.target.value);
    }


    return (
        <div className="phone-number">
            <h2 className='phone-number-title'>Adding a Phone number:</h2>
            <div className='phone-number-container'>
                <input 
                className='phone-number-input'
                type='number'
                value={telefonskiBroj}
                onChange={handlePhoneNumber}
                placeholder='Telefonski broj'
                />
            </div>
        </div>
    );
}
 
export default PhoneNumber;