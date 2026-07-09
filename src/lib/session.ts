import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const STAFF_COOKIE = "dc_team_session";
const PARTICIPANT_COOKIE = "dc_programm_session";
const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 30; // 30 Tage

function getSecretKey() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error("SESSION_SECRET ist nicht gesetzt.");
  }
  return new TextEncoder().encode(secret);
}

export type StaffSessionPayload = {
  role: "STAFF";
  staffId: string;
};

export type ParticipantSessionPayload = {
  role: "PARTICIPANT";
  participantId: string;
};

async function signSession(
  payload: StaffSessionPayload | ParticipantSessionPayload,
) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_SECONDS}s`)
    .sign(getSecretKey());
}

async function verifySession<T>(token: string | undefined): Promise<T | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    return payload as T;
  } catch {
    return null;
  }
}

export async function createStaffSession(staffId: string) {
  const token = await signSession({ role: "STAFF", staffId });
  const store = await cookies();
  store.set(STAFF_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_DURATION_SECONDS,
  });
}

export async function createParticipantSession(participantId: string) {
  const token = await signSession({ role: "PARTICIPANT", participantId });
  const store = await cookies();
  store.set(PARTICIPANT_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_DURATION_SECONDS,
  });
}

export async function getStaffSession() {
  const store = await cookies();
  return verifySession<StaffSessionPayload>(store.get(STAFF_COOKIE)?.value);
}

export async function getParticipantSession() {
  const store = await cookies();
  return verifySession<ParticipantSessionPayload>(
    store.get(PARTICIPANT_COOKIE)?.value,
  );
}

export async function destroyStaffSession() {
  const store = await cookies();
  store.delete(STAFF_COOKIE);
}

export async function destroyParticipantSession() {
  const store = await cookies();
  store.delete(PARTICIPANT_COOKIE);
}
