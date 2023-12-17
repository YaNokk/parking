"use client"
import style from './style.module.scss';
import classNames from "classnames";
import {className} from "postcss-selector-parser";
export function Park ({ title,distance, commonFill, invalidFill, commonRemaining, invalidRemaining, tariff  }) {
    const isBigger = distance >= 1000;
    return <div className={style.park}>
            <div className={style.title}>{title}</div>
        <div className={style.statuses}>
            <div className={style.geo}>
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="14" viewBox="0 0 13 14" fill="none">
                    <path d="M12.2683 6.32267C12.2683 9.80142 8.33411 12.1741 7.04078 12.8601C6.784 12.9963 6.48429 12.9963 6.22752 12.8601C4.93418 12.1741 1 9.80142 1 6.32267C1 3.12907 3.72994 1 6.63415 1C9.63902 1 12.2683 3.12907 12.2683 6.32267Z" stroke="#222222"/>
                    <path d="M9.13903 6.32267C9.13903 7.58792 8.04473 8.66143 6.63415 8.66143C5.22357 8.66143 4.12927 7.58792 4.12927 6.32267C4.12927 5.05742 5.22357 3.98391 6.63415 3.98391C8.04473 3.98391 9.13903 5.05742 9.13903 6.32267Z" stroke="#222222"/>
                </svg>
                <span className={style.status}>{`${isBigger ? distance / 1000 : distance} ${isBigger ? 'км' : 'м'}`}</span>
            </div>
            <span className={style.status}>{(commonRemaining === 0 && invalidRemaining === 0) ? "Заполнена" : "Свободна"}</span>
            <span className={style.status}>{`от ${tariff} руб`}</span>
        </div>
        <div className={style.indicators}>
            <Indicator name={'Обычные'} fill={commonFill} remaining={commonRemaining}/>
            <Indicator name={'Для инвалидов'} fill={invalidFill} remaining={invalidRemaining}/>
        </div>
        <div className={style.footer}>
            <button className={classNames(style.buttonBorder, style.yellow)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17" fill="none">
                    <path d="M16 13.2506V1.81191C16 1.45847 15.6112 1.24299 15.3115 1.43031L12.1847 3.38455C12.068 3.45747 11.9244 3.47301 11.7949 3.42674L5.20514 1.07326C5.07557 1.02699 4.93195 1.04253 4.81528 1.11545L1.2115 3.36781C1.07993 3.45004 1 3.59426 1 3.74941V15.1881C1 15.5415 1.38878 15.757 1.6885 15.5697L4.81528 13.6154C4.93195 13.5425 5.07557 13.527 5.20514 13.5733L11.7949 15.9267C11.9244 15.973 12.068 15.9575 12.1847 15.8846L15.7885 13.6322C15.9201 13.55 16 13.4057 16 13.2506Z" stroke="#B29600" stroke-width="1.5"/>
                    <path d="M12 16V3.5" stroke="#B29600" strokeWidth="1.5"/>
                    <path d="M5 13.5V1" stroke="#B29600" strokeWidth="1.5"/>
                </svg>
                Проложить маршрут
            </button>
            <button className={classNames(style.buttonBorder, style.blue)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="17" height="16" viewBox="0 0 17 16" fill="none">
                    <path d="M14.5 8.89475C14.5 12.4414 11.7779 15.25 8.5 15.25C5.22208 15.25 2.5 12.4414 2.5 8.89475C2.5 5.34812 5.22208 2.53949 8.5 2.53949C11.7779 2.53949 14.5 5.34812 14.5 8.89475Z" stroke="#00A7B2" stroke-width="1.5"/>
                    <path d="M3.25 1.63462C2.56591 2.05036 1.99784 2.64833 1.60289 3.36842" stroke="#00A7B2" strokeWidth="1.5" strokeLinecap="round"/>
                    <path d="M13.75 1.63462C14.4341 2.05036 15.0022 2.64833 15.3971 3.36842" stroke="#00A7B2" strokeWidth="1.5" strokeLinecap="round"/>
                    <path d="M8.5 4.55261V8.64472C8.5 8.78279 8.61193 8.89472 8.75 8.89472H11.875" stroke="#00A7B2" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                Бронь
            </button>
        </div>
    </div>
}

function Indicator ({ name, remaining, fill}) {
    return <div className={style.indicator}>
        <div className={style.header}>
            <span>{name}</span>
            <span>{`Осталось ${remaining}`}</span>
        </div>
        <div className={style.progress}>
            <div className={classNames(style.fill, fill <= 40 ? style.danger : fill >= 40 && fill <= 80 ? style.common : style.success)} style={{ width : `${fill}%`}}/>
        </div>
    </div>
}