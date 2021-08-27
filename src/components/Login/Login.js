import React ,{ useState , useEffect} from 'react';
import { Input } from '../Input/Input';
import './Login.css'
import { Button } from '../Button/Button';
import axios from 'axios'
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import AuthApi from '../AuthApi';
import Cookies from 'js-cookie';
import CircularProgress from '@material-ui/core/CircularProgress';


function Alert(props) {
    return <MuiAlert elevation={5} variant="filled" {...props} />;
}

export const Login = (props) => {

    const [user, setUser] = useState('')
    const messageInitial = props.location ? props.location.state.message : ''
    const [message, setMessage] =  useState(messageInitial)
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [intentosLogin, setIntentosLogin] = useState(0);
    const [tiempoDeEspera, setEspera] = useState(null)

    
    useEffect(()=> {
        if(message!==''){
            setOpen(true)
        }
    },[])
  
    const handleClose = (event, reason) => {
      if (reason === 'clickaway') {
        return;
      }
  
      setOpen(false);
    };

    const handleLogin = (event) => {
        event.preventDefault()
        
            let usuario = event.target[0].value
            let contrasenia = event.target[1].value

            const url = `http://localhost:8080/auth/loggin`
        if(tiempoDeEspera<=new Date().getMinutes()){
            setLoading(true)
            axios.post(url, 
                {
                    nombreDeUsuario:usuario,
                    contrasenia:contrasenia
                })
            .then((res) => {
                setLoading(false)
                setUser(usuario)
                setMessage('Acceso Exitoso')
                setOpen(true)
                Cookies.set("user",usuario)
            })
            .catch((err) => {
                setLoading(false)
                setMessage(err.response ? err.response.data.error : "Connection Fatal Error: "+err)
                setOpen(true)  
                console.log(err)
                setIntentosLogin(intentosLogin + 1)
                if(intentosLogin===3){
                    setEspera(new Date().getMinutes()+1)
                    setMessage('Demasiados intentos fallidos espera 1 minuto para reintentar')
                    console.log()
                    setIntentosLogin(0)
                }
            })
        }
    }

    return (
        
        <div className="container">
               <form onSubmit={handleLogin}>
                    <h1 className={'title'}>Bienvenido</h1>
                    <Input placeholder='Ingresa usuario'/>
                    <Input 
                        placeholder='Ingresa contraseña'
                        type='Password'
                    />
                    {
                    loading ?
                        <CircularProgress className="loading"/> : 
                        <Button
                            name='LOGIN'
                        />
                    }
                </form>
            
            <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
                <Alert onClose={handleClose} severity={user==='' ? "error" : "success"}>
                    {message}
                </Alert>
            </Snackbar>

        </div>
    )
} 