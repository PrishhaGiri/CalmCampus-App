
const SESSION_KEY = "calmcampus_session";

export function saveSession(token, user) {
  sessionStorage.setItem(
    SESSION_KEY,
    JSON.stringify({
      mode: "user",
      token,
      user,
    })
  );
}

export function startGuestSession() {
  sessionStorage.setItem(
    SESSION_KEY,
    JSON.stringify({
      mode: "guest",
      token: null,
      user: null,
    })
  );
}

export function getSession() {
  try {
    const stored = sessionStorage.getItem(SESSION_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

export function getToken() {
  return getSession()?.token || null;
}

export function clearSession() {
  sessionStorage.removeItem(SESSION_KEY);
}

export function isAuthenticated() {
  const session = getSession();

  return Boolean(
    session &&
    (session.mode === "guest" ||
      (session.mode === "user" && session.token))
  );
}
