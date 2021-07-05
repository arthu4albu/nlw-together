import { useHistory, useParams } from "react-router-dom";

// import { useAuth } from "../hooks/useAuth";
import { useRoom } from "../hooks/useRoom";

import { database } from "../services/firebase";

import { RoomCode } from "../components/RoomCode/index";
import { Button } from "../components/Button/index";
import { Question } from "../components/Question/index";

import "../styles/room.scss";

import logoImg from "../assets/images/logo.svg";
import deleteImg from "../assets/images/delete.svg"


type RoomParamsProps = {
    id: string;
}

export function AdminRoom() {
    // const { user } = useAuth();
    const history = useHistory();
    const params = useParams<RoomParamsProps>(); // para pegar os parâmetros passados na URL da página
    const roomId = params.id;

    const { questions, title } = useRoom(roomId);

    async function handleEndRoom() {
        await database.ref(`rooms/${roomId}`).update({
            endedAt: new Date(),
        })

        history.push("/");
    }

    async function handleDeleteQuestion(questionId: string) {
        if (window.confirm("Tem certeza que você deseja excluir esta pergunta?")) {
            await database.ref(`rooms/${roomId}/questions/${questionId}`).remove()
        }
    }


    return (
        <div id="page-room">
            <header>
                <div className="content">
                    <img src={logoImg} alt="Letmeask" />
                    <div>
                        <RoomCode code={roomId} />
                        <Button isOutlined onClick={handleEndRoom}>Encerrar sala</Button>
                    </div>
                </div>
            </header>

            <main className="content">
                <div className="room-title">
                    <h1>Sala: <span className="title">{title}</span></h1>
                    {questions.length > 0 && (<span>{questions.length} Pergunta(s)</span>)}
                </div>


                <div className="question-list">
                    {questions.map(question => {
                        return (
                            <Question
                                key={question.id}
                                content={question.content}
                                author={question.author}
                            >
                                <button type="button" onClick={() => { handleDeleteQuestion(question.id) }}>
                                    <img src={deleteImg} alt="Remover pergunta" />
                                </button>
                            </Question>
                        );
                    })}
                </div>
            </main>
        </div>
    );
}