import { useState } from "react";
import { FaRegEye, FaRegEyeSlash} from 'react-icons/fa6';

const PasswordInput = ({ value, onChange, placeHolder }) => {

    const [isShowPassword, setIsShowPassword] = useState(false);

    const toggleShowPassword = () => {
        setIsShowPassword(!isShowPassword);
    };

  return (
    <div className="flex items-center bg-transparent border-[1.5px] px-5 rounded-sm mb-3">
        <input 
        value={value} 
        onChange={onChange} 
        type={isShowPassword ? 'text' : 'password'} 
        placeholder={placeHolder || 'Contraseña'} 
        className="w-full text-sm bg-transparent py-3 mr-3 rounded-sm outline-hidden"
        />

        { isShowPassword ? 
            <FaRegEye 
                size={22}
                className='text-primary cursor-pointer'
                onClick={() => toggleShowPassword()}
            /> : <FaRegEyeSlash 
                size={22}
                className='text-[#a385b5] cursor-pointer'
                onClick={() => toggleShowPassword()}
                />
        }
    </div>
  )
}

export default PasswordInput;