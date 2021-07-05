import { ButtonHTMLAttributes } from "react";

import "./style.scss";

type buttonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    isOutlined?: boolean;
}; // para poder passar todos os atributos que a tag button pode receber para o Button jsx

export function Button({ isOutlined = false, ...props }: buttonProps) { // esse "...props" está dizendo que tudo que não for a propriedade isOutlined, vai cair na variável props, "rest operator"

    return (
        <button className={`button ${isOutlined ? "outlined" : ""}`} {...props} />
    );
}
