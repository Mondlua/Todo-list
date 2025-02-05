import Navbar from '../../components/Navbar/Navbar';
import PasswordInput from '../../components/Input/PasswordInput';
import axiosInstance from '../../utils/axiosInstance';

import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { validateEmail } from '../../utils/helper';

function SignUp() {

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const navigate = useNavigate();


  const handleSignUp = async (e) => {
    e.preventDefault();

    if(!name){
      setError('Por favor ingrese su nombre.');
      return;
    }

    if(!validateEmail(email)){
      setError('Dirección de email inválida.');
      return;
    }

    if(!password){
      setError('Por favor ingrese la contraseña.');
      return;
    }

    setError('');

    //* SignUp API
    try{
      const response = await axiosInstance.post('/create-account',{
        fullName: name,
        email: email,
        password: password
      })

      //* Registro exitoso
      if(response.data && response.data.error){
        setError(response.data.message);
        return
      }

      if(response.data && response.data.accessToken){
        localStorage.setItem('token', response.data.accessToken);
        navigate('/home');
      }
    }
    catch(error){
      //* Error de registro
      if(error.response && error.response.data && error.response.data.message){
        setError(error.response.data.message);
      }else {
        setError('Error inesperado. Intente de nuevo');
      }
    }
  }

  return (
    <>
    <Navbar />
    <div className='min-h-screen flex items-center justify-center px-6'>
      <div className='w-full max-w-md border rounded-md bg-white px-7 py-10 shadow-lg shadow-[#dccfec]'>
        <form onSubmit={handleSignUp}>
          <h1 className='text-2xl font-medium mb-6 text-primary text-center'>Crear Cuenta</h1>
          <input
            type='text'
            placeholder='Nombre'
            className='input-box w-full px-4 py-2 border rounded-md mb-3'
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type='text'
            placeholder='Email'
            className='input-box w-full px-4 py-2 border rounded-md mb-3'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <PasswordInput value={password} onChange={(e) => setPassword(e.target.value)} />
          {error && <p className='text-red-500 text-xs font-medium pb-1'>{error}</p>}
          <button type='submit' className='btn-primary w-full py-2 rounded-md mt-3'>
            Crear Cuenta
          </button>
          <p className='text-sm text-center mt-4'>
            ¿Ya tienes una cuenta?{' '}
            <Link to='/login' className='font-medium text-primary underline'>
              Iniciar Sesión
            </Link>
          </p>
        </form>
      </div>
    </div>
  </>
  )
}

export default SignUp