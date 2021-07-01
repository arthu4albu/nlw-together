import { ButtonHTMLAttributes } from "react";

import "../styles/button.scss";

type buttonProps = ButtonHTMLAttributes<HTMLButtonElement>; // para poder passar todos os atributos que a tag button pode receber para o Button jsx

export function Button(props: buttonProps) {

    return (
        <button className="button" {...props} />
    );
}
