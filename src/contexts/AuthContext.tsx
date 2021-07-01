import { createContext, ReactNode, useEffect, useState } from "react";
import { auth, firebase } from "../services/firebase";

type User = {
    id: string;
    name: string;
    avatar: string | null;
}

type AuthContextType = {
    user: User | undefined;
    signInWithGoogle: () => Promise<void>;
}

type AuthContextProviderProps = {
    children: ReactNode; // quando você diz que vai receber um elemento jsx, você usa ReactNode
}

export const AuthContext = createContext({} as AuthContextType);

export function AuthContextProvider(props: AuthContextProviderProps) {

    const [user, setUser] = useState<User>();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (user) {
                const { photoURL, displayName, uid } = user

                if (!displayName || !photoURL) {
                    throw new Error('Missing inoformation from Google Account.');
                }

                setUser({
                    id: uid,
                    name: displayName,
                    avatar: photoURL
                })
            }

            return () => {
                unsubscribe(); // é uma boa pratica sempre quando você se cadastrar em algum eventListener você se descadastrar dele depois para que ele não fique rodando mesmo se o componente sair de tela, assim não retornando erro
            }
        })
    }, []); //vai disparar essa arrow function quando o vetor mudar, e se o vetor ficar vazio essa função só será chamada uma única vez quando o componente App for iniciado 
    async function signInWithGoogle() {
        const provider = new firebase.auth.GoogleAuthProvider();

        const result = await auth.signInWithPopup(provider)

        if (result.user) {
            const { photoURL, displayName, uid } = result.user

            if (!displayName || !photoURL) {
                throw new Error('Missing inoformation from Google Account.');
            }

            setUser({
                id: uid,
                name: displayName,
                avatar: photoURL
            })
        }
    }

    return (
        <AuthContext.Provider value={{ user, signInWithGoogle }}>
            {props.children}
        </AuthContext.Provider>
    );
}