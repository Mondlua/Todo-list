import { useState } from 'react'
import { MdClose } from 'react-icons/md';


import TagInput from '../../components/Input/TagInput'
import axiosInstance from '../../utils/axiosInstance';

const AddEditNotes = ({ noteData, type, onClose, getAllNotes, showToastMessage }) => {

    const [title, setTitle] = useState(noteData?.title || '');
    const [content, setContent] = useState(noteData?.content ||'');
    const [tags, setTags] = useState(noteData?.tags || []);

    const [error, setError] = useState(null);

    //* Añadir Nota
    const addNewNote = async () => {
        try{
            const response = await axiosInstance.post('/add-note',{
                title,
                content,
                tags
            });
          
            //* Nota añadida
            if(response.data && response.data.note){
                showToastMessage('Nota Añadida', 'add');
                getAllNotes();
                onClose();
            }
        }
        catch(error){
        //* Error al añadir
            if( error.response && error.response.data && error.response.data.message){
                setError(error.response.data.message);
            }
        }
    }
    
    //* Editar Nota
    const editNote = async () => {
        const noteId = noteData._id;
        try{
            const response = await axiosInstance.put('/edit-note/'+ noteId, {
                title,
                content,
                tags
            });
          
            //* Nota editada
            if(response.data && response.data.note){
                showToastMessage('Nota Editada', 'edit');
                getAllNotes();
                onClose();
            }
        }
        catch(error){
        //* Error al editar
            if( error.response && error.response.data && error.response.data.message){
                setError(error.response.data.message);
            }
        }
    }

    const handleAddNote = () => {
        
        if(!title){
            setError('Por favor ingrese el título');
            return;
        }
        if(!content){
            setError('Por favor ingrese el contenido');
            return;
        }
        setError('');

        if(type === 'edit'){
            editNote();
        }else{
            addNewNote();
        }
    };

  return (
    <div className='relative'>

        <button 
            className='w-10 h-10 rounded-full flex items-center justify-center absolute -top-3 -right-3 hover:bg-[#f3ebfa] cursor-pointer'
            onClick={onClose}
        >
            <MdClose className='text-xl text-[#a385b5]' />
        </button>

        <div className="flex flex-col gap-2">
            <label className="input-label">TITULO</label>
            <input 
                type="text"
                className="text-2xl text-[#3d234b] outline-hidden"
                placeholder="Ir al Gimnasio a las 5"
                value={title}
                onChange={({ target }) => setTitle(target.value)}
            />
        </div>

        <div className="flex flex-col gap-2 mt-4"> 
            <label className="input-label">CONTENIDO</label>
            <textarea 
                type="text"
                className="text-sm text-[#3d234b] outline-hidden bg-[#f3ebfa] p-2 rounded-sm"
                placeholder="Contenido"
                rows={10}
                value={content}
                onChange={({ target }) => setContent(target.value)}
            />
        </div>

        <div className="mt-3">
            <label className="input-label">TAGS</label>
            <TagInput tags={tags} setTags={setTags}/>
        </div>

        {error && <p className='text-red-500 text-xs pt-4'>{error}</p>}
        
        <button className="btn-primary font-medium mt-5 p-3" onClick={handleAddNote}>
            {type === 'edit' ? 'EDITAR' : 'AÑADIR'}
        </button>
    </div>
  )
}

export default AddEditNotes