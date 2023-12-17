'use client';
import dynamic from "next/dynamic";
import style from '@/app/page.module.scss';
import {Park} from "@/app/components/park";
import {Button} from "@/app/components/button";
import {getParks, getParksSSR} from "@/app/actions/getParks";
import {useEffect, useMemo, useRef, useState} from "react";
import map from "lodash"
import _ from "lodash";
import {MapComponent} from "@/app/components/map";

export default function HomeWrapper({ parksInitial  }) {
    const [isByMeGeoActive, setIsByMyGeoActive] = useState(false);
    const [isByGeoActive, setIsByGeoActive] = useState(false);
    const [parks, setParks] = useState(parksInitial);
    const [sortByPrice, setSortByPrice] = useState(false);
    const [sortByBusy, setSortByBusy] = useState(false);
    const [ymaps, setYmaps] = useState(null);
    const ref = useRef(null)
    const [userCoords, setUserCoords] = useState({ center : [54.718127, 20.497499], zoom: 14});
    const [coords, setCoords] = useState({ center : [54.718127, 20.497499], zoom: 14});

    const requestCoords = useMemo(() => {
        if ((isByGeoActive === false && isByMeGeoActive === false) || isByMeGeoActive === true) return userCoords;
        return coords;
    }, [isByGeoActive, isByMeGeoActive]);

    useEffect(() => {
        const successCallback = (position) => {
            getData(position.coords.latitude, position.coords.longitude);
            setUserCoords(prevState => ({ ...prevState, center : [position.coords.latitude, position.coords.longitude ]}))
        };

        const errorCallback = (error) => {
            getData(userCoords.center[0], userCoords.center[1]);
            console.log(error);
        };

        navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
    }, []);

        function getData (userLat, userLon) {
            getParks({ userLat , userLon, price : Boolean(sortByPrice), busy : Boolean(sortByBusy) })
                .then(response => {
                    setParks(response.data)
                })
        }

        function onMyLocation () {
            setIsByMyGeoActive(true);
            setIsByGeoActive(false)
            draw(userCoords.center[0], userCoords.center[1], (first) => {
                ref.current.setCenter([first.lat, first.lon], userCoords.zoom, { duration : 300});
            });
        }

        function draw (userLat, userLon, callback, price = sortByPrice, busy = sortByBusy) {
            getParks({ userLat, userLon, price : Boolean(price), busy : Boolean(busy) })
                .then(response => {
                    const first = response.data?.[0];
                    if (ymaps) {
                        const multiRoute = new ymaps.multiRouter.MultiRoute(
                            {
                                referencePoints: [[userLat, userLon], [first.lat, first.lon]],
                                params: {
                                    results: 1
                                }
                            },
                            {
                                boundsAutoApply: true,
                                routeActiveStrokeWidth: 6,
                                routeActiveStrokeColor: "#00A7B2"
                            }
                        );
                        ref.current.geoObjects.each(obj => {
                            if (obj.options._name === "multiRoute") {
                                ref.current.geoObjects.remove(obj);
                            }
                        })
                        ref.current.geoObjects.add(multiRoute);
                    }
                    /*ref.current.setCenter([first.lat, first.lon], coords.zoom, { duration : 300});*/
                    callback && callback(first);
                    setParks(response.data);
                })
        }
        function onPosition ([userLat, userLon]) {
            if (!isByGeoActive) return;
            setCoords(prevState => {
                return {...prevState, center: [userLat, userLon]}
            })
            draw(userLat, userLon)
        }

        function sort (byPrice) {
            setSortByBusy(!byPrice)
            setSortByPrice(byPrice)

            draw(requestCoords.center[0], requestCoords.center[1], null, byPrice, !byPrice)
        }

        function onArrow () {
            document.body.scrollTo({
                top: 0,
                behavior: "smooth",
            })
        }

    return (
        <main className={style.main}>
            <button onClick={onArrow} className={style.arrow}>
                <svg data-name="1-Arrow Up" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="m26.71 10.29-10-10a1 1 0 0 0-1.41 0l-10 10 1.41 1.41L15 3.41V32h2V3.41l8.29 8.29z"/></svg>
            </button>
            <div className={style.header}>
                <svg xmlns="http://www.w3.org/2000/svg" width="39" height="48" viewBox="0 0 39 48" fill="none">
                    <path fillRule="evenodd" clipRule="evenodd" d="M32.7462 6.24871C40.0633 13.5658 40.0633 25.4291 32.7462 32.7462C30.6953 34.797 28.2873 36.2731 25.7224 37.1743L28.4267 39.8786L20.9039 47.4013L6.44746 32.9449L6.44893 32.9434C6.38182 32.8783 6.31509 32.8125 6.24873 32.7462C-1.06834 25.4291 -1.06834 13.5658 6.24873 6.24871C13.5658 -1.06836 25.4291 -1.06836 32.7462 6.24871ZM24.9974 13.9974C28.035 17.035 28.035 21.9599 24.9974 24.9974C21.9599 28.035 17.035 28.035 13.9974 24.9974C10.9599 21.9599 10.9599 17.035 13.9974 13.9974C17.035 10.9599 21.9599 10.9599 24.9974 13.9974Z" fill="#09929B"/>
                </svg>
            </div>
            <div className={style.container}>
                <div className={style.wrapper}>
                    <div>
                        <div className={style.title}>Выберите удобное место</div>
                        <div className={style.buttons}>
                            <Button
                                active={isByMeGeoActive}
                                onClick={onMyLocation}
                                icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"
                                           fill="none">
                                    <circle cx="10" cy="10" r="6" stroke="currentColor" strokeWidth="1.5"/>
                                    <circle cx="10" cy="10" r="1" fill="currentColor" stroke="currentColor" strokeWidth="1.5"/>
                                    <path d="M10 3V1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                                    <path d="M17 10L19 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                                    <path d="M10 19L10 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                                    <path d="M1 10H3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                                </svg>}>По моему местоположению</Button>
                            <Button
                                active={isByGeoActive}
                                onClick={_ => {
                                    setIsByMyGeoActive(false);
                                    setIsByGeoActive(true)
                                }}
                                icon={<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 13 13"
                                           fill="none">
                                    <path
                                        d="M1.04862 11.9159L6.45528 1.10258C6.4737 1.06573 6.5263 1.06573 6.54472 1.10258L11.9514 11.9159C11.9705 11.9541 11.936 11.9971 11.8945 11.9868L6.51213 10.6412C6.50416 10.6392 6.49584 10.6392 6.48787 10.6412L1.10547 11.9868C1.06402 11.9971 1.02951 11.9541 1.04862 11.9159Z"
                                        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                                </svg>}>По точке прибытия</Button>
                            <Button
                                active={sortByBusy}
                                onClick={() => {
                                    sort(false)
                                }}
                                icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="18" viewBox="0 0 20 18"
                                           fill="none">
                                    <path d="M6 7L6 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                                          strokeLinejoin="round"/>
                                    <path d="M10 9V13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                                          strokeLinejoin="round"/>
                                    <path d="M14 5V13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                                          strokeLinejoin="round"/>
                                    <rect x="1" y="1" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                                </svg>}>По загруженности</Button>
                            <Button
                                active={sortByPrice}
                                onClick={() => {
                                    sort(true)
                                }}
                                icon={<svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17"
                                           fill="none">
                                    <path
                                        d="M1 3V3C1 1.89543 1.89543 1 3 1L14.4286 1C14.4949 1 14.5281 1 14.556 1.00314C14.7878 1.02926 14.9707 1.21221 14.9969 1.44402C15 1.47192 15 1.50509 15 1.57143V1.57143C15 1.96946 15 2.16848 14.9811 2.33589C14.8244 3.72675 13.7268 4.82442 12.3359 4.98114C12.1685 5 11.9695 5 11.5714 5H11.5M1 3V3C1 4.10457 1.89543 5 3 5L14 5C14.9428 5 15.4142 5 15.7071 5.29289C16 5.58579 16 6.05719 16 7V9M1 3L1 12C1 13.8856 1 14.8284 1.58579 15.4142C2.17157 16 3.11438 16 5 16L14 16C14.9428 16 15.4142 16 15.7071 15.7071C16 15.4142 16 14.9428 16 14V13M16 13H14C13.0572 13 12.5858 13 12.2929 12.7071C12 12.4142 12 11.9428 12 11V11C12 10.0572 12 9.58579 12.2929 9.29289C12.5858 9 13.0572 9 14 9H16M16 13V9"
                                        stroke="currentColor" strokeWidth="1.5"/>
                                </svg>}>По цене</Button>
                        </div>
                        <div className={style.parks}>
                            {_.map(parks, park => {
                                return <Park tariff={park.price} key={park.id} title={park.name} commonRemaining={park.place.countNormal - park.placeBusy.countNormal} invalidRemaining={park.place.countInvalid - park.placeBusy.countInvalid} commonFill={Math.abs(((park.placeBusy.countNormal / park.place.countNormal) * 100) - 100)} invalidFill={Math.abs(((park.placeBusy.countInvalid / park.place.countInvalid) * 100) - 100)} distance={park.distation}/>
                            })}
                        </div>
                    </div>
                    <MapComponent setYmaps={setYmaps} onPosition={onPosition} ref={ref} coords={userCoords} parks={parks}/>
                </div>
            </div>
        </main>
    )
}


