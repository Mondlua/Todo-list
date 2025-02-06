import ProfileInfo from "../Cards/ProfileInfo";
import { useNavigate } from 'react-router-dom';
import SearchBar from "../SearchBar/SearchBar";
import { useState } from "react";

const Navbar = ({ userInfo, onSearchNote, handleClearSearch, isHome }) => {

  const [searchQuery, setSearchQuery] = useState('');

  const navigate = useNavigate();

  const onLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const handleSearch = () => {
    if(searchQuery){
      onSearchNote(searchQuery);
    }else{
      handleClearSearch();
    }
  };

  const onClearSearch = () => {
    setSearchQuery('');
    handleClearSearch();
  };

  return (
    <nav className="bg-white flex items-center justify-between px-4 sm:px-6 py-2 drop-shadow-sm shadow-[#dccfec]">
      <h2 className="text-xl font-semibold text-primary">Notas</h2>

      {isHome &&
        <div className="flex flex-grow justify-end max-w-md mr-3 sm:mr-0">
            <SearchBar
            value={searchQuery} 
            onChange={({target}) => {setSearchQuery(target.value)}}
            handleSearch={handleSearch}
            onClearSearch={onClearSearch}
            />
        </div>
      }

      {isHome &&
        <ProfileInfo userInfo={userInfo} onLogout={onLogout}/>
      }

    </nav>
  )
}

export default Navbar