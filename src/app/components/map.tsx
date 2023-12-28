'use client';
import {type FC, forwardRef, useEffect, useState} from 'react';
import React from 'react';
import ReactDOM from 'react-dom';
import style from './style.module.scss'
import map from "lodash";
import _ from "lodash";
import {YMaps, Map, Placemark, TrafficControl} from "@pbe/react-yandex-maps";


export const MapComponent = forwardRef(({ parks, coords, onPosition, setYmaps }, ref) => {
    return (
        <YMaps query={{ apikey : process.env.NEXT_PUBLIC_MAP_API_KEY}}>
            <div className={style.mapWrapper}>
            <Map
                onLoad={ymaps => setYmaps(ymaps)}
                onClick={e => onPosition(e._sourceEvent.originalEvent.coords)}
                instanceRef={ref}
                className={style.map}
                defaultState={{
                    center: coords.center,
                    zoom: coords.zoom,
                    controls: ["zoomControl", "fullscreenControl"],
                }}
                modules={["control.ZoomControl", "control.FullscreenControl"]}
            >
                <TrafficControl options={{ float: "right" }} />
                {
                    _.map(parks, park => {
                        return <Placemark
                            key={park.id}
                            options={{ preset : 'islands#blueAutoIcon'}}
                            modules={["geoObject.addon.balloon", "multiRouter.MultiRoute"]}
                            defaultGeometry={[park.lat, park.lon]}
                            properties={{
                                balloonContentBody: `Организация: ${park?.owner?.organization?.name}&#13;Тест`,
                                balloonContentFooter : park.name,
                                iconCaption : park.name
                            }}
                        />
                    })
                }
            </Map>
            </div>
        </YMaps>
    );
});