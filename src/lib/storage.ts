import fs from "fs";
import path from "path";

export const HAS_DB = false;

const DATA_DIR = path.join(process.cwd(), "src/data");

export async function getLiveCheckins(categoryId: string, eventId: string): Promise<string[]> {
    // Revert to FS-only checkins (handled via the guest files themselves)
    const filePath = path.join(DATA_DIR, categoryId, `${eventId}.json`);
    if (!fs.existsSync(filePath)) return [];
    try {
        const contents = JSON.parse(fs.readFileSync(filePath, "utf8"));
        return Array.isArray(contents) ? contents.filter(g => g.attended).map(g => String(g.id)) : [];
    } catch (e) {
        return [];
    }
}

export async function addLiveCheckin(categoryId: string, eventId: string, guestId: string) {
    // In the old workflow, checkins are handled by updating the local JSON files.
    // The "sync" should happen in the API route calling this.
}

export async function removeLiveCheckin(categoryId: string, eventId: string, guestId: string) {
    // Same as above.
}

export async function clearAllEventAttendance(categoryId: string, eventId: string) {
    // FS-only: We'd iterate the file and set all 'attended' to false.
}

export async function addLiveGuestName(categoryId: string, eventId: string, guestId: string, guestName: string) {}
export async function removeLiveGuestName(categoryId: string, eventId: string, guestId: string, guestName: string) {}

export async function getLiveUshers(categoryId: string, eventId: string): Promise<string[]> {
    const usherFilePath = path.join(DATA_DIR, "ushers", `${categoryId}-${eventId}.json`);
    if (!fs.existsSync(usherFilePath)) return [];
    try {
        const contents = JSON.parse(fs.readFileSync(usherFilePath, "utf8"));
        return Array.isArray(contents) ? contents.map(u => u.name) : [];
    } catch (e) {
        return [];
    }
}

export async function removeLiveUsher(categoryId: string, eventId: string, usherName: string) {}
export async function addLiveUsher(categoryId: string, eventId: string, usherName: string) {}

export async function getEventStatus(categoryId: string, eventId: string): Promise<boolean> {
    const metaPath = path.join(DATA_DIR, "metadata", categoryId, `${eventId}.json`);
    if (!fs.existsSync(metaPath)) return false;
    try {
        const metadata = JSON.parse(fs.readFileSync(metaPath, "utf8"));
        return !!metadata.completed;
    } catch (e) {
        return false;
    }
}

export async function setEventStatus(categoryId: string, eventId: string, completed: boolean) {}

export async function deleteEventFromKV(categoryId: string, eventId: string) {}
export async function markEventAsDeleted(categoryId: string, eventId: string) {}
export async function isEventDeleted(categoryId: string, eventId: string): Promise<boolean> {
    return false;
}

/**
 * Merges local file data with live data (No-op in FS-only mode)
 */
export async function mergeLiveGuestData(categoryId: string, eventId: string, localGuests: any[]) {
    return localGuests;
}

/**
 * Merges the entire registry index with live data (No-op in FS-only mode)
 */
export async function mergeRegistryWithKV(index: any) {
    return index;
}
