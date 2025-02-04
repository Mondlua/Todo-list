import { FaMagnifyingGlass} from 'react-icons/fa6';
import { IoMdClose} from 'react-icons/io';

function SearchBar({ value, onChange, handleSearch, onClearSearch }) {
  return (
    <div className="w-80 flex items-center px-4 bg-[#f1eaf7] rounded-md">
        <input 
            type="text"
            placeholder="Buscar Notas"
            className="w-full text-xs bg-transparent py-[11px] outline-hidden"
            value={value}
            onChange={onChange}

        />

        {value && (<IoMdClose className='text-xl text-[#8c6a9e] cursor-pointer hover:text-primary mr-3' onClick={onClearSearch}/>)}

        <FaMagnifyingGlass className='text-[#a385b5] cursor-pointer hover:text-primary' onClick={handleSearch}/>
    </div>
  )
}

export default SearchBar