import NoteCard from "../../components/Cards/NoteCard"
import Navbar from "../../components/Navbar/Navbar"
import AddEditNotes from "./AddEditNotes";
import axiosInstance from '../../utils/axiosInstance';
import Toast from "../../components/ToastMessage/Toast";
import EmptyCard from "../../components/EmptyCard/EmptyCard";

import AddNotesImg from '../../assets/images/add-note.svg';
import NoDataImg from '../../assets/images/no-data.svg';

import Modal from 'react-modal';

import { MdAdd } from 'react-icons/md';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

//! HACERLO RESPONSIVE

function Home() {

  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShow: false,
    type: 'add',
    data: null,
  });

  const [showToastMsg, setShowToastMsg] = useState({
    isShow: false,
    message: '',
    type: 'add',
  })

  const [userInfo, setUserInfo] = useState(null);
  const [allNotes, setAllNotes] = useState([]);

  const [isSearch, setIsSearch] = useState(false);
  const [isHome, setIsHome] = useState(false);

  const navigate = useNavigate();

  const handleEdit = (noteDetails) => {
    setOpenAddEditModal({ isShow: true, data: noteDetails, type: 'edit'});
  };

  const showToastMessage = (message, type) => {
    setShowToastMsg({
      isShow: true,
      message,
      type
    });
  };


  const handleCloseToast = () => {
    setShowToastMsg(prev => ({
      ...prev,
      isShow: false,
      message: ''
    }));
  };


  //* Obtener información del usuario
  const getUserInfo = async () => {
    try{
      const response = await axiosInstance.get('/get-user');

      //* Obtención de datos exitosa
      if(response.data && response.data.user){
        setUserInfo(response.data.user);
      }
    }
    catch(error){
      //* Error en la obtención de datos
      if(error.response.status === 401){
       localStorage.clear();
       navigate('/login');
      }
    }
  };

  //* Obtener notas
  const getAllNotes = async () => {
    try{
      const response = await axiosInstance.get('/get-all-notes');
  
   //* Obtención de notas exitosa
    if(response.data && response.data.notes){
      setAllNotes(response.data.notes);
      }
    }
    catch(error){
      //* Error en la obtención de notas
      console.log(error,'Error inesperado, intente nuevamente');
    }
  };

  //* Borrar nota
  const deleteNote = async (data) => {
    const noteId = data._id;
        try{
            const response = await axiosInstance.delete('/delete-note/'+ noteId);
          
            //* Nota borrada
            if(response.data && !response.data.error){
                showToastMessage('Nota Borrada', 'delete');
                getAllNotes();
            }
        }
        catch(error){
        //* Error al borrar
            if( error.response && error.response.data && error.response.data.message){
              console.log(error,'Error inesperado, intente nuevamente');
            }
        }
  };

  //* Buscar una nota
  const onSearchNote = async (query) => {
    try {
      const response = await axiosInstance.get('/search-notes', {
        params: { query }
      });

      if(response.data && response.data.notes){
        setIsSearch(true);
        setAllNotes(response.data.notes);
      }
    } catch(error){
      console.log(error);
    }
  };

  //* 
  const updateIsPinned = async (noteData) => {
    const noteId = noteData._id;
        try{
            const response = await axiosInstance.put('/update-note-pinned/'+ noteId, {
                isPinned: !noteData.isPinned
            });
          
            //* Nota editada
            if(response.data && response.data.note){
                showToastMessage('Nota Editada', 'edit');
                getAllNotes();
            }
        }
        catch(error){
        //* Error al editar
            console.log(error);
        }
  }

  const handleClearSearch = () => {
    setIsSearch(false);
    getAllNotes();
  }

  useEffect(() => {
    getUserInfo();
    getAllNotes();
    setIsHome(true);
  }, []); 



  return (
    <>
      <Navbar userInfo={userInfo} onSearchNote={onSearchNote} handleClearSearch={handleClearSearch} isHome={isHome}/>

      <div className="container mx-auto">
        {allNotes.length > 0 ? <div className="grid grid-cols-3 gap-4 mt-8">
          {allNotes.map((note,i) => (<NoteCard 
            key={note._id}
            title={note.title}
            date={note.createOn}
            content={note.content}
            tags={note.tags}
            isPinned={note.isPinned}
            onEdit={() => handleEdit(note)}
            onDelete={() => deleteNote(note)}
            onPinNote={() => updateIsPinned(note)}
          />)
          )}
        </div> : 
        <EmptyCard 
          imgSrc={ isSearch ? NoDataImg : AddNotesImg}
          message={isSearch ? 'Oops! No se han encontraron notas coincidentes.' : 'Comienza creando tu primer nota! Haz click en el botón "Añadir" para escribir tus tareas, ideas, lo que quieras.'}/>}
      </div>
      <button className="w-16 h-16 flex items-center justify-center rounded-2xl bg-primary hover:bg-indigo-700 absolute right-10 bottom-10 cursor-pointer" onClick={()=>{
        setOpenAddEditModal({ isShow: true, type: 'add', data: null });
      }}>
        <MdAdd className='text-[32px] text-white' />
      </button>

      <Modal 
        isOpen={openAddEditModal.isShow}
        onRequestClose={() => {}}
        style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
          },
        }}
        contentLabel=''
        className='w-[40%] max-h-3/4 bg-white rounded-md mx-auto mt-14 p-5'
      >
        <AddEditNotes 
          type={openAddEditModal.type}
          noteData={openAddEditModal.data}
          onClose={() => {
            setOpenAddEditModal({ isShow: false, type:'', data: null });
          }}
          getAllNotes={getAllNotes}
          showToastMessage={showToastMessage}
        />
      </Modal>
      <Toast 
        isShow={showToastMsg.isShow}
        message={showToastMsg.message}
        type={showToastMsg.type}
        onClose={handleCloseToast}
      />
    </>
  )
}

export default Home