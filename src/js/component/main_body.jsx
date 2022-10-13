import React, {useState, useEffect, useRef} from "react";


const Main_body = ()=>{

    // play, pause
    const [controls_play_state, set_controls_play_state] = useState("fa-play")
     
    // cuando se esta reproduciendo la música
    let [selected, setSelected] = useState("")
    const audioElement = useRef();

    // para obtener el id de la cancion actual y transportarlo a otras funciones
    const next_down_ID_Element = useRef("");

    // el titulo
    let [title, setTitle] = useState("Aun no estas reproduciendo nada!")

    // lista de musicas
    const [list_music, setList_musica] = useState([])

    // la url de la api 
    let url_api = "https://assets.breatheco.de/apis/sound/"

    let [button_random_class, set_button_random_class] = useState("border-info")
    let [button_loop_class, set_button_loop_class] = useState("border-info")

    function api_sound(){
        fetch('https://assets.breatheco.de/apis/sound/songs')
            .then((response) => {
                return response.json()
            }) 
            .then((data) => setList_musica(data))
            .catch((err) => console.log(err))
    }
       
    // useEffect, llamamos a la api
    useEffect(()=>{
        api_sound()
    }, [])
    
    // selecciona la cancion el usuario
    let select_button = (id)=>{
        audioElement.current.src = url_api+list_music[id].url
        // cambia el titulo de la canción visible al usuario
        setTitle(list_music[id].name)

        // pasamos el valor(ID) para tenerlo presente en otras funciones por medio de un id
        next_down_ID_Element.current.id = id
    }

    // controles - funciones
    let controls_play = ()=>{
        // ve si el icono esta en play, sino dura 0 y si no esta pausado
        if(controls_play_state === "fa-play" 
        && audioElement.current.duration > 0 
        && !audioElement.current.paused){
            audioElement.current.pause()
            set_controls_play_state("fa-pause")
        // si el icono no esta en play, o dura 0, o esta pausado
        }else {
            audioElement.current.play()
            set_controls_play_state("fa-play")
        }
    }

    let button_random = ()=>{
        if(button_random_class === "border-info"){
            set_button_random_class("border-danger")
        }else{
            set_button_random_class("border-info")
        }
    }

    function random_music_next(){
        if(button_random_class === "border-info"){
            // al valor (id) que se genero por interaccion del usuario le sumamos
            // uno para que avance al siguiente elemento de la lista list_music
            next_down_ID_Element.current.id = Number(next_down_ID_Element.current.id) +1
        }else{
            next_down_ID_Element.current.id = Math.floor(Math.random(list_music.length-1) * list_music.length+1)

        }
    }

    function random_music_down(){
        if(button_random_class === "border-info"){
            // al valor (id) que se genero por interaccion del usuario le sumamos
            // uno para que avance al siguiente elemento de la lista list_music
            next_down_ID_Element.current.id = Number(next_down_ID_Element.current.id) -1
        }else{
            next_down_ID_Element.current.id = Math.floor(Math.random(list_music.length-1) * list_music.length+1)  
        }
    }

    let button_loop = ()=>{
        if(button_loop_class === "border-info"){
            set_button_loop_class("border-danger")
        }else{
            set_button_loop_class("border-info")
        }
    }

    // la funcion que se encarga una vez termina la canción
    let ended_function = ()=>{
        // si termina y esta activado el button_loop, empezara denuevo la cancion
        if(button_loop_class === "border-danger"){
            audioElement.current.src = url_api+list_music[Number(next_down_ID_Element.current.id)].url


            // si termina y esta desactivado el button_loop && esta 
            //desactivado el button_random comenzara la siguiente
        }else if(button_loop_class === "border-info" && button_random_class === "border-info"){
            audioElement.current.src = url_api+list_music[Number(next_down_ID_Element.current.id)+1].url


            // si termina y esta desactivado el button_loop && esta 
            // activado el button_random comenzara la siguiente de forma aleatoria
        }else if(button_loop_class === "border-info" && button_random_class === "border-danger"){
            next_down_ID_Element.current.id = Math.floor(Math.random(list_music.length-1) * list_music.length+1)
            audioElement.current.src = url_api+list_music[Number(next_down_ID_Element.current.id)].url
        }
    }

    let next_button = ()=>{
        
        random_music_next()

        // el if/else comprueba que haya elementos para seguir avanzando, sino lo devuelve al inicio
        if(Number(next_down_ID_Element.current.id)<list_music.length){
            audioElement.current.src = url_api+list_music[Number(next_down_ID_Element.current.id)].url
        }else {
            next_down_ID_Element.current.id = 0
            audioElement.current.src = url_api+list_music[Number(next_down_ID_Element.current.id)].url
        }

        // cambia el titulo al correspondiente
        setTitle(list_music[Number(next_down_ID_Element.current.id)].name)
    }

    let previous_button = ()=>{

        random_music_down()
        
        // el if/else comprueba que haya elementos para seguir atrasando, sino lo lleva al final
        if(Number(next_down_ID_Element.current.id)>-1){
            audioElement.current.src = url_api+list_music[Number(next_down_ID_Element.current.id)].url
        }else{
            next_down_ID_Element.current.id = list_music.length-1
            audioElement.current.src = url_api+list_music[Number(next_down_ID_Element.current.id)].url
        }
        // cambia el titulo al correspondiente
        setTitle(list_music[Number(next_down_ID_Element.current.id)].name)
    }
 
    // mapeo de la lista
    const screen_list_music = list_music.map((item, index)=>{
        return <div key={index} onClick={()=>select_button(index)} className={"text-light select_music "+selected}>
                    <hr />
                    <div className="d-flex align-items-center">
                        <p className="ms-4 my-1" style={{fontSize:"25px"}}>{index+1}.</p>
                        <p className="ms-5 my-1">{item.name}</p>
                    </div>
                    <hr />
                </div>})

    return (
        <div>
            <main className="container bg-dark rounded mt-3">
                <hr />
                {screen_list_music}
                <hr />
                <audio onEnded={()=>ended_function()} ref={audioElement} src="" autoPlay ></audio>
            </main>
            {/* adaptación visual */}
            <br />
            <br />
            <br />
            <br />
            <br />

            <div className="m-auto p-2 rounded fixed-bottom mb-3" style={{width:"55%", background:"#9b59b6", minWidth:"300px"}}>
                <div className="d-flex flex-column p-2 justify-content-center" style={{background:"#34495e"}}>
                    <p className="text-light text-center my-2" style={{fontSize:"30px"}}>{title}</p>
                    <hr />
                    <div className="d-flex justify-content-center">

                        {/* boton para ir atras */}
                        <button ref={next_down_ID_Element} id="" onClick={()=>previous_button()} className="btn text-light border-info mx-2">
                            <i className="fas fa-arrow-circle-left"></i>
                        </button>

                        {/* boton de play/pause */}
                        <button onClick={()=>controls_play()} className="btn text-light border-info mx-2">
                            <i className={"fas "+controls_play_state}></i>
                        </button>

                        {/* boton para hacer random */}
                        <button onClick={()=>button_random()} className={"btn text-light mx-2 "+button_random_class}>
                            <i className='fas fa-random'></i>
                        </button>

                        {/* boton para hacer un bucle infinito del audio */}
                        <button onClick={()=>button_loop()} className={"btn text-light mx-2 "+button_loop_class}>
                            ⥀
                        </button>


                        {/* boton para ir a la siguiente */}
                        <button ref={next_down_ID_Element} id="" onClick={()=>next_button()} className="btn text-light border-info mx-2">
                            <i className="fas fa-arrow-circle-right"></i>
                        </button>

                    </div>
                </div>
            </div>

        </div>
        )
}

export default Main_body