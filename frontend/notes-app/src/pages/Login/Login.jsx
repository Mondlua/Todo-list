import Navbar from '../../components/Navbar/Navbar';
import PasswordInput from '../../components/Input/PasswordInput';

import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { validateEmail } from '../../utils/helper';
import axiosInstance from '../../utils/axiosInstance';

const Login = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if(!validateEmail(email)){
      setError('Dirección de email inválida.');
      return;
    }

    if(!password){
      setError('Por favor ingrese la contraseña.');
      return;
    }

    setError('');


    //* Login API 
    try{
      const response = await axiosInstance.post('/login',{
        email: email,
        password: password
      })

      //* Inicio de sesión exitoso
      if(response.data && response.data.accessToken){
        localStorage.setItem('token', response.data.accessToken);
        navigate('/home');
      }
    }
    catch(error){
      //* Error de inicio de sesión
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
      
      <div className='flex items-center justify-center mt-28'>
        <div className='w-96 border rounded-sm bg-white px-7 py-10'>
          <form onSubmit={handleLogin}>
            <h1 className='text-2xl font-medium mb-7 text-primary'>Iniciar Sesión</h1>
            <input type='text' placeholder='Email' className='input-box'
              value={email}
              onChange={(e) => setEmail(e.target.value)}/>

            <PasswordInput 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && <p className='text-red-500 text-xs font-medium pb-1'>{error}</p>}

            <button type='submit' className='btn-primary'>
              Iniciar Sesión
            </button>
            <p className='text-sm text-center mt-4'>
              ¿No tienes una cuenta? {' '}
              <Link to='/signUp' className='font-medium text-primary underline'>
                Crear una Cuenta
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  )
}

export default Login