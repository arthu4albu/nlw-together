import { Link, useHistory } from "react-router-dom";

import { FormEvent, useState } from "react"; // importação da tipagem do evento de um form

import { useAuth } from "../hooks/useAuth";

import { Button } from "../components/Button/index";

import "../styles/auth.scss";

import illustrationImg from "../assets/images/illustration.svg";
import logoImg from "../assets/images/logo.svg";
import { database } from "../services/firebase";



export function NewRoom() {
    const { user } = useAuth();
    const history = useHistory();
    const [newRoom, setNewRoom] = useState("");

    async function handleCreateRoom(event: FormEvent) {
        event.preventDefault() // prevenir o comportamento padrão do form, que é o recarregamento/redirecionamento da página

        if (newRoom.trim() === "") {
            return;
        }

        const roomRef = database.ref("rooms"); // essa linha quer dizer que lá dentro do banco de dados vai ter uma categoria chamada "rooms"
        const firebaseRoom = await roomRef.push({
            title: newRoom,
            authorId: user?.id
        }); // está sendo jogado/push uma nova informação no database na categoria "rooms"

        history.push(`/rooms/${firebaseRoom.key}`)
    }


    return (
        <div id="page-auth">
            <aside>
                <img src={illustrationImg} alt="Ilustração simbolizando perguntas e respostas" />
                <strong>Toda pergunta tem uma resposta</strong>
                <p>Aprenda e compartilhe conhecimento com outras pessoas</p>
            </aside>
            <main>
                <div className="main-content">
                    <img src={logoImg} alt="Letmeask" />
                    <h2>Criar uma nova sala</h2>
                    <form onSubmit={handleCreateRoom}>
                        <input
                            type="text"
                            placeholder="Nome da sala"
                            onChange={event => setNewRoom(event.target.value)}
                            value={newRoom}
                        />
                        <Button type="submit">Criar sala</Button>
                    </form>
                    <p>Quer entrar em uma sala já existente? <Link to="/">Clique aqui</Link></p>
                </div>
            </main>
        </div>
    );
}