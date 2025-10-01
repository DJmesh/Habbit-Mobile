import { create } from 'zustand';
import { getItem, setItem } from '@/lib/storage';
import { seed, type DB, type GPSSession, type GPSPoint } from '@/lib/mockDb';
import * as Location from 'expo-location';

const KEY = 'DB_V1';

type LocationState = {
  db: DB;
  recording: boolean;
  watcher?: Location.LocationSubscription | null;
  reload: () => Promise<void>;
  start: () => Promise<void>;
  stop: () => Promise<void>;
};

export const useLocationStore = create<LocationState>((set, get) => ({
  db: seed,
  recording: seed.locationRecording,
  watcher: null,

  async reload() {
    const loaded = await getItem<DB>(KEY, seed);
    set({ db: loaded, recording: loaded.locationRecording });
  },

  async start() {
    // ask permission
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      alert('Permissão de localização negada.');
      return;
    }
    const { db } = get();
    if (get().recording) return;
    const session: GPSSession = { id: 'g' + (db.gpsSessions.length + 1), startedAt: Date.now(), points: [] };
    const next: DB = { ...db, gpsSessions: [...db.gpsSessions, session], locationRecording: true };
    await setItem(KEY, next);
    set({ db: next, recording: true });

    const watcher = await Location.watchPositionAsync(
      { accuracy: Location.Accuracy.Balanced, timeInterval: 5000, distanceInterval: 10 },
      (loc) => {
        const p: GPSPoint = { id: 'p' + Date.now(), lat: loc.coords.latitude, lon: loc.coords.longitude, timestamp: loc.timestamp ?? Date.now() };
        const current = get().db;
        const lastSession = { ...current.gpsSessions[current.gpsSessions.length - 1] };
        lastSession.points = [...lastSession.points, p];
        const gpsSessions = [...current.gpsSessions.slice(0, -1), lastSession];
        const updated: DB = { ...current, gpsSessions };
        set({ db: updated });
        setItem(KEY, updated);
      }
    );
    set({ watcher });
  },

  async stop() {
    const { watcher, db } = get();
    if (watcher) { try { watcher.remove(); } catch {} }
    const last = db.gpsSessions[db.gpsSessions.length - 1];
    const updatedLast = last ? { ...last, endedAt: Date.now() } : last;
    const gpsSessions = last ? [...db.gpsSessions.slice(0, -1), updatedLast] : db.gpsSessions;
    const next: DB = { ...db, gpsSessions, locationRecording: false };
    await setItem(KEY, next);
    set({ db: next, recording: false, watcher: null });
  }
}));
