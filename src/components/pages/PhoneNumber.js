import '../styling/pages-styling/PhoneNumber.css'
import PhoneInput from "react-phone-number-input";

const PhoneNumber = ({phoneNumber, setPhoneNumber}) => {

    function handlePhoneNumber (value) {
        setPhoneNumber(value);
    }


    return (
        <div className="phone-number">
            <div className='phone-number-container'>
            <PhoneInput style={{height: '40px', width: '40px'}}
           international
           defaultCountry="MK"
           value={phoneNumber}
           onChange={handlePhoneNumber}
            />
            </div>
        </div>
    );
}
 
export default PhoneNumber;