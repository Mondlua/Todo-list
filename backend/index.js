require('dotenv').config();

const config = require('./config.json');
const mongoose = require('mongoose');

mongoose.connect(config.connectionString);

const User = require('./models/user.model');
const Note = require('./models/note.model');

const express = require('express');
const cors = require('cors');
const app = express();

const jwt = require('jsonwebtoken');
const { authenticateToken } = require('./utilities');

app.use(express.json());

app.use(
    cors({
        origin: "*",
    })
);

app.get("/", (req, res) => {
    res.json({ data: 'hello'});
});

//* Crear Cuenta
app.post("/create-account", async (req, res) => {
    const { fullName, email, password } = req.body;

    if(!fullName){
        return res
            .status(400)
            .json({error: true, message: 'Nombre requerido'});
    }
    if(!email){
        return res
            .status(400)
            .json({error: true, message: 'Email requerido'});
    }
    if(!password){
        return res
            .status(400)
            .json({error: true, message: 'Contraseña requerida'});
    }

    const isUser = await User.findOne({ email: email });

    if(isUser){
        return res.json({ error: true, message: 'El usuario ya existe'});
    }

    const user = new User({
        fullName,
        email,
        password,
    });

    await user.save();

    const accessToken = jwt.sign({user} , process.env.ACCESS_TOKEN_SECRET, {expiresIn: '36000m'});

    return res.json({
        error: false,
        user,
        accessToken,
        message: 'Usuario Registrado',
    });
});

//* Iniciar Sesión
app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if(!email){
        return res
            .status(400)
            .json({message: 'Email requerido'});
    }
    if(!password){
        return res
            .status(400)
            .json({message: 'Contraseña requerida'});
    }

    const userInfo = await User.findOne({ email: email });

    if(!userInfo){
        return res.json({ error: true, message: 'El usuario no existe'});
    }

    if(userInfo.email == email && userInfo.password == password){
        const user = {user: userInfo};
        const accessToken = jwt.sign(user , process.env.ACCESS_TOKEN_SECRET, {expiresIn: '36000m'});

        return res.json({
            error: false,
            message: 'Inicio de Sesión Exitosa',
            email,
            accessToken,
        })
    }else{
        return res.status(400).json({
            error: true,
            message: 'Credenciales Inválidas',
        });
    }
});

//* Obtener Usuario
app.get("/get-user", authenticateToken, async (req, res) => {
    const {user} = req.user;

    const isUser = await User.findOne({_id: user._id});

    if(!isUser){
        return res.sendStatus(401);
    }

    return res.json({
        user: {
            fullName: isUser.fullName, 
            email: isUser.email, 
            "_id": isUser._id, 
            createdOn: isUser.createdOn},
        message: ''
    });
});




//* Añadir Nota
app.post('/add-note', authenticateToken, async (req, res) => {
    const { title, content, tags } = req.body;
    const {user} = req.user;

    if(!title){
        return res
            .status(400)
            .json({message: 'El título es requerido'});
    }

    if(!content){
        return res
            .status(400)
            .json({message: 'El contenido es requerido'});
    }

    try{
        const note = new Note({
            title,
            content,
            tags: tags || [],
            userId: user._id
        });

        await note.save();

        return res.json({
            error: false,
            note,
            message: 'Nota añadida exitosamente',
        });
    }
    catch (error) {
        return res.status(500).json({
            error: true,
            message: 'Error Interno del Servidor'
        });
    }
});

//* Editar Nota
app.put('/edit-note/:noteId', authenticateToken, async (req, res) => {
    const noteId = req.params.noteId;
    const { title, content, tags, isPinned } = req.body;
    const {user} = req.user;

    if(!title && !content && !tags){
        return res
            .status(400)
            .json({error: true, message: 'No se han realizado cambios'});
    }

    try{
        const note = await Note.findOne({ _id: noteId, userId: user._id});

        if(!note){
            return res
            .status(400)
            .json({error: true, message: 'La nota no existe'});
        }

        if (title) note.title = title;
        if (content) note.content = content;
        if (tags) note.tags = tags;
        if (isPinned) note.isPinned = isPinned;

        await note.save();

        return res.json({
            error: false,
            note,
            message: 'Cambios Realizados'
        })
    }
    catch(error) {
        return res.status(500).json({
            error: true,
            message: 'Error Interno del Servidor'
        });
    }
});

//* Obetener Notas
app.get('/get-all-notes', authenticateToken, async (req, res) => {
    const {user} = req.user;

    try{
        const notes = await Note.find({userId: user._id}).sort({isPinned: -1});

        return res.json({
            error: false,
            notes,
            message: 'Recuperación de notas exitosa'
        })
    }
    catch(error) {
        return res.status(500).json({
            error: true,
            message: 'Error Interno del Servidor'
        });
    }
});

//* Eliminar Nota
app.delete('/delete-note/:noteId', authenticateToken, async (req, res) => {
    const noteId = req.params.noteId;
    const {user} = req.user;

    try{
        const note = await Note.findOne({ _id: noteId, userId: user._id});

        if(!note){
            return res
            .status(400)
            .json({error: true, message: 'La nota no existe'});
        }

        await note.deleteOne({_id: noteId, userId: user._id});

        return res.json({
            error: false,
            message: 'Nota Eliminada'
        })
    }
    catch(error) {
        return res.status(500).json({
            error: true,
            message: 'Error Interno del Servidor'
        });
    }
});


//* Priorizar una Nota
app.put('/update-note-pinned/:noteId', authenticateToken, async (req, res) => {
    const noteId = req.params.noteId;
    const { isPinned } = req.body;
    const {user} = req.user;

    try{
        const note = await Note.findOne({ _id: noteId, userId: user._id});

        if(!note){
            return res
            .status(400)
            .json({error: true, message: 'La nota no existe'});
        }

        note.isPinned = isPinned;

        await note.save();

        return res.json({
            error: false,
            note,
            message: 'Nota Fijada'
        })
    }
    catch(error) {
        return res.status(500).json({
            error: true,
            message: 'Error Interno del Servidor'
        });
    }
});

//* Buscar una Nota
app.get('/search-notes', authenticateToken, async (req, res) => {
    const {user} = req.user;
    const {query} = req.query;

    if(!query){
        return res
            .status(400)
            .json({error: true, message: 'Campo obigatorio para búsqueda'});
    }
    try {
        const matchingNotes = await Note.find({
            userId: user._id,
            $or: [
                { title: { $regex: new RegExp(query, 'i') }},
                { content: { $regex: new RegExp(query, 'i') }},
                { tags: { $regex: new RegExp(query, 'i') }},
            ]
        });
        
        return res.json({
            error: false,
            notes: matchingNotes,
            message: 'Busqueda Exitosa',
        });
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: 'Error Interno del Servidor'
        });
    }
})


app.listen(8000);

module.exports = app;