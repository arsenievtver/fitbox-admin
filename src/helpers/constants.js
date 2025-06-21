export const PREFIX = 'https://fitbox.bounceme.net';
export const loginUrl = '/api/v1/auth/jwt/login';
export const refreshUrl = '/api/v1/auth/auth/jwt/refresh';
export const JWT_STORAGE_KEY = 'jwt_token';
export const registerUrl = '/api/v1/auth/register';
export const logoutUrl = '/api/v1/auth/jwt/logout';
export const GetallusersUrl = '/api/v1/users/';
export const GetallslotsUrl = '/api/v1/slots/';
export const GetoneuserUrl = (id) => `/api/v1/users/${id}`;
export const PatchoneusersUrl = (id) => `/api/v1/users/${id}`;
export const postSlotsBulkUrl = `/api/v1/slots/bulk`;
export const postBookingAdminsUrl = '/api/v1/bookings/by-admin';
export const deleteSlotUrl = (id) => `/api/v1/slots/${id}`;
export const deleteBookingUrl = (id) => `/api/v1/bookings/${id}`;
export const postWeightMeUrl = '/api/v1/records'
export const postWeightUrl = '/api/v1/records/by-admin'
export const GetOneUserBookingUrl = (id) => `api/v1/bookings/?user_id__in=${id}`;
export const GetBookingFilterUrl = (slot_id) => `api/v1/bookings/?slot_id__in=${slot_id}`;
export const getSlotsFilterUrl = (start_time, stop_time) =>
	`/api/v1/slots/?time__gt=${encodeURIComponent(start_time)}&time__lt=${encodeURIComponent(stop_time)}`;