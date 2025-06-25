import CookieService from "../services/CookieService";

export const token = CookieService.get("jwt");
