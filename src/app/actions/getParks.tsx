import {http} from "@/app/actions/http";

export async function getParksSSR() {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/parks`
    );
    if (!res.ok) {
        throw new Error('Не удалось получить информацию о парковках');
    }
    return res.json();
}

export async function getParks(params) {
    return http.get('/parks', { params });
}

