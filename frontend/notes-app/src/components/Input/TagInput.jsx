import { useState } from 'react';
import { MdAdd, MdClose } from 'react-icons/md';

function TagInput({ tags, setTags }) {

    const [inputValue, setInputValue] = useState('');

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    const addNewTag = () => {
        if(inputValue.trim() !== ''){
            setTags([...tags, inputValue.trim()]);
            setInputValue('');
        }
    };

    const handleKeyDown = (e) => {
        if(e.key === 'Enter'){
            addNewTag();
        }
    };

    const handleRemoveTag =(tagToRemove) => {
        setTags(tags.filter((tag) => tag !== tagToRemove))
    };

  return (
    <div>

        {tags?.length > 0 && (
            <div className='flex items-center gap-2 flex-wrap mt-2'>
                {tags.map((tag,index) => (
                    <span key={index} className='flex items-center gap-2 text-sm text-[#3c2746] bg-[#f3ebfa] px-3 py-1 rounded-sm'>
                        # {tag}
                        <button className='cursor-pointer' onClick={() => {handleRemoveTag(tag)}}>
                            <MdClose />
                        </button>
                    </span>
                ))}
            </div>
        )}

        <div className="flex items-center gap-4 mt-3">
            <input 
                type="text" 
                value={inputValue}
                className="text-sm bg-transparent border px-3 py-2 rounded-sm outline-hidden min-w-0" 
                placeholder="Añadir Tag" 
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
            />
            <button className="w-8 h-8 flex items-center justify-center rounded-sm border border-primary hover:bg-indigo-700" 
            onClick={() => {
                addNewTag();
            }}>
                <MdAdd className='text-2xl text-primary hover:text-white cursor-pointer'/>
            </button>
        </div>
    </div>
  )
}

export default TagInput