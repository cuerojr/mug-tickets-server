Back: 
    + CRUD de usuarios
    + Autenticación/Uso de token
    + Manejo de sesión (esto capaz que es front)
    + CRUD evento


    ESTRUCTURA DE DATOS TENTATIVA (Y HECHA ASI NOMAS):    
    
    Evetos: 
        + Tipo de entrada (General, Platea, etc)
        + Cantidad de entradas disponibles
        + Fecha limite de compra de entradas
        + Información sobre el show (Titulo, dirección, fecha y hora, etc)
        
    Entradas: 
        + Evento al que pertenece
        + Titular (quien hizo la compra: Nombre y apellido, DNI)
        + Asistente (quien va a asistir al show)
        + Fue validada? (Boolean. True: si la persona ya ingresó al evento)
        + Fecha y hora de compra
        + Fecha y hora de validación
    
    Usuarios:
        + Nombre y apellido
        + DNI
        + Historial de entradas compradas
        + Entradas activas (no tiene que estar necesariamente en la db)


