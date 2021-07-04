import { useParams } from "react-router-dom";

import { useState, FormEvent, useEffect } from "react";

import { useAuth } from "../hooks/useAuth";

import { database } from "../services/firebase";


import { RoomCode } from "../components/RoomCode";
import { Button } from "../components/Button";

import "../styles/room.scss";

import logoImg from "../assets/images/logo.svg";

type FirebaseQuestionProps = Record<string, {
    author: {
        name: string,
        avatar: string
    },
    content: string,
    isAnswered: boolean,
    isHighlighted: boolean
}>

type Question = {
    id: string;
    author: {
        name: string,
        avatar: string
    },
    content: string,
    isAnswered: boolean,
    isHighlighted: boolean
}
type RoomParamsProps = {
    id: string;
}

export function Room() {
    const { user } = useAuth();
    const [newQuestion, setNewQuestion] = useState("");
    const params = useParams<RoomParamsProps>(); // para pegar os parâmetros passados na URL da página
    const roomId = params.id;
    const [questions, setQuestions] = useState<Question[]>([]); // esse estado está recebendo um Array de Question
    const [title, setTitle] = useState("");

    useEffect(() => {
        const roomRef = database.ref(`/rooms/${roomId}`)

        roomRef.on('value', room => {
            const databaseRoom = room.val();
            const firebaseQuestions: FirebaseQuestionProps = databaseRoom.questions ?? {}
            const parsedQuestions = Object.entries(firebaseQuestions).map(([key, value]) => {
                return {
                    id: key,
                    content: value.content,
                    author: value.author,
                    isHighlighted: value.isHighlighted,
                    isAnswered: value.isAnswered
                }
            })

            setTitle(databaseRoom.title);
            setQuestions(parsedQuestions);
        })
    }, [roomId])

    async function handleSendQuestion(event: FormEvent) {
        event.preventDefault();

        if (newQuestion.trim() === "") {
            return;
        }

        if (!user) {
            throw new Error("you must be logged in")
        }

        const question = {
            content: newQuestion,
            author: {
                name: user.name,
                avatar: user.avatar
            },
            isHighlighted: false,
            isAnswered: false
        };

        await database.ref(`/rooms/${roomId}/questions`).push(question);

        setNewQuestion("");
    }
    return (
        <div id="page-room">
            <header>
                <div className="content">
                    <img src={logoImg} alt="Letmeask" />
                    <RoomCode code={roomId} />
                </div>
            </header>

            <main className="content">
                <div className="room-title">
                    <h1>Sala <span className="title">{title}</span></h1>
                    {questions.length > 0 && (<span>{questions.length} Pergunta(s)</span>)}
                </div>

                <form onSubmit={handleSendQuestion}>
                    <textarea
                        placeholder="O que você quer perguntar?"
                        onChange={event => setNewQuestion(event.target.value)}
                        value={newQuestion}
                    />

                    <div className="form-footer">
                        {user ? (
                            <div className="user-info">
                                <img src={user.avatar} alt={user?.name} />
                                <span>{user.name}</span>
                            </div>
                        ) : (
                            <span>Para fazer uma pergunta, <button>faça seu login</button>.</span>
                        )}
                        <Button type="submit" disabled={!user}>Enviar pergunta</Button>
                    </div>
                </form>
                {JSON.stringify(questions)}
            </main>
        </div>
    );
}