// src/helpers/ApiClient.jsx
import axios from 'axios';
import { PREFIX, JWT_STORAGE_KEY, refreshUrl } from './constants';
import { parseISO, formatISO } from 'date-fns';
import * as dateFnsTz from 'date-fns-tz';

const MSK_TZ = 'Europe/Moscow';

// Преобразуем ISO-строку времени из UTC в МСК и обратно в ISO строку
function convertTimeStringToMSK(timeStr) {
	try {
		const utcDate = parseISO(timeStr);
		const zonedDate = dateFnsTz.utcToZonedTime(utcDate, MSK_TZ);
		return formatISO(zonedDate);
	} catch {
		return timeStr;
	}
}

// Рекурсивно ищем в объекте поля с названием 'time' и конвертируем их
function convertTimesInObject(obj) {
	if (Array.isArray(obj)) {
		return obj.map(convertTimesInObject);
	} else if (obj && typeof obj === 'object') {
		const newObj = {};
		for (const key in obj) {
			if (key === 'time' && typeof obj[key] === 'string') {
				newObj[key] = convertTimeStringToMSK(obj[key]);
			} else {
				newObj[key] = convertTimesInObject(obj[key]);
			}
		}
		return newObj;
	}
	return obj;
}

export function createApi(navigate) {
	const api = axios.create({
		baseURL: PREFIX,
		withCredentials: true
	});

	api.interceptors.request.use(cfg => {
		if (!cfg.url.includes('refresh')) {
			const t = localStorage.getItem(JWT_STORAGE_KEY);
			if (t) cfg.headers.Authorization = `Bearer ${t}`;
		}
		return cfg;
	});

	let refreshing = false;
	let queue = [];

	const subscribe = (cb) => queue.push(cb);
	const publish = (tok, err) => {
		queue.forEach(cb => cb(tok, err));
		queue = [];
	};

	api.interceptors.response.use(
		resp => {
			// Преобразуем все поля time в ответе в МСК
			resp.data = convertTimesInObject(resp.data);
			return resp;
		},
		async (err) => {
			const { response, config } = err;
			const original = config;

			if (response?.status === 401 && !original._retry) {
				if (refreshing) {
					return new Promise((res, rej) =>
						subscribe((tok, e) => e ? rej(e) : res(api({ ...original, headers: { ...original.headers, Authorization: `Bearer ${tok}` } })))
					);
				}

				original._retry = true;
				refreshing = true;

				try {
					const { data } = await api.post(refreshUrl, {});
					const newToken = data.access_token;
					localStorage.setItem(JWT_STORAGE_KEY, newToken);
					api.defaults.headers.Authorization = `Bearer ${newToken}`;
					publish(newToken);

					original.headers.Authorization = `Bearer ${newToken}`;
					return api(original);
				} catch (e) {
					publish(null, e);
					localStorage.removeItem(JWT_STORAGE_KEY);
					navigate('/');
					return Promise.reject(e);
				} finally {
					refreshing = false;
				}
			}

			return Promise.reject(err);
		}
	);

	return api;
}
