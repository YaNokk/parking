import style from "./style.module.scss";
import classNames from "classnames";

export function Button ({ children, icon, active, ...rest }) {
    return  <button className={classNames(style.button, {[style.active] :  active})} {...rest}>
        <span>{icon}</span>
        <div className={style.content}>{children}</div>
    </button>
}