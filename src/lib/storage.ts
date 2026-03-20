import { createClient, VercelKV } from "@vercel/kv";
import fs from "fs";
import path from "path";

// Ensure URL starts with https (Upstash REST API requirement)
const getValidUrl = (url?: string) => {
    if (!url || url.includes("your-upstash-url-here")) return "";
    return url.startsWith("https") ? url : "";
};

const KV_CONFIG = {
    url: getValidUrl(process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || process.env.REDIS_URL),
    token: (process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || "").includes("your-token-here") ? "" : (process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || ""),
};

// Lazy initialization with connection check
let _kv: VercelKV | null = null;
export const getKV = () => {
    if (!_kv && KV_CONFIG.url && KV_CONFIG.token) {
        try {
            _kv = createClient(KV_CONFIG);
        } catch (e) {
            console.error("Failed to init KV client:", e);
        }
    }
    return _kv;
};

/**
 * Helper to wrap promises with a timeout
 */
async function withTimeout<T>(promise: Promise<T>, ms: number, fallback: T): Promise<T> {
    let timeoutId: NodeJS.Timeout;
    const timeoutPromise = new Promise<T>((resolve) => {
        timeoutId = setTimeout(() => {
            console.warn(`KV Operation timed out after ${ms}ms`);
            resolve(fallback);
        }, ms);
    });

    return Promise.race([
        promise.then((result) => {
            clearTimeout(timeoutId);
            return result;
        }),
        timeoutPromise
    ]);
}

export const HAS_DB = !!(KV_CONFIG.url && KV_CONFIG.token);

if (typeof window === 'undefined') {
    console.log("Redis Status:", { HAS_DB, urlType: KV_CONFIG.url ? "HTTPS" : "None/Invalid" });
}

export async function getLiveCheckins(categoryId: string, eventId: string): Promise<string[]> {
    const kv = getKV();
    if (!kv) return [];
    try {
        const key = `checkins:${categoryId}:${eventId}`;
        const checkins = await kv.sadd(key, []); // Ensure key exists
        return (await kv.smembers(key)) || [];
    } catch (e) {
        console.error("KV Error:", e);
        return [];
    }
}

export async function addLiveCheckin(categoryId: string, eventId: string, guestId: string) {
    const kv = getKV();
    if (!kv) return;
    try {
        const key = `checkins:${categoryId}:${eventId}`;
        await kv.sadd(key, guestId);
    } catch (e) {
        console.error("KV Error:", e);
    }
}

export async function removeLiveCheckin(categoryId: string, eventId: string, guestId: string, guestName?: string) {
    const kv = getKV();
    if (!kv) return;
    try {
        const key = `checkins:${categoryId}:${eventId}`;
        const itemsToRemove = [guestId];
        if (guestName) itemsToRemove.push(guestName);
        await kv.srem(key, ...itemsToRemove);
    } catch (e) {
        console.error("KV Error:", e);
    }
}

export async function clearAllEventAttendance(categoryId: string, eventId: string) {
    const kv = getKV();
    if (!kv) return;
    try {
        const keys = [
            `checkins:${categoryId}:${eventId}`,
            `names:${categoryId}:${eventId}`
        ];
        await kv.del(...keys);
        
        // Also update the global index in registry if needed
        // (This will be handled by the script calling this)
    } catch (e) {
        console.error("KV Clear Error:", e);
    }
}

export async function addLiveGuestName(categoryId: string, eventId: string, guestId: string, guestName: string) {
    const kv = getKV();
    if (!kv) return;
    try {
        const key = `names:${categoryId}:${eventId}`;
        const data = `${guestId}|${guestName}`;
        await kv.sadd(key, data);
    } catch (e) {
        console.error("KV Error:", e);
    }
}

export async function removeLiveGuestName(categoryId: string, eventId: string, guestId: string, guestName: string) {
    const kv = getKV();
    if (!kv) return;
    try {
        const key = `names:${categoryId}:${eventId}`;
        // Support both old and new formats for removal
        const data = `${guestId}|${guestName}`;
        await Promise.all([
            kv.srem(key, data),
            kv.srem(key, guestName)
        ]);
    } catch (e) {
        console.error("KV Error:", e);
    }
}

export async function getLiveUshers(categoryId: string, eventId: string): Promise<string[]> {
    const kv = getKV();
    if (!kv) return [];
    try {
        const key = `ushers:${categoryId}:${eventId}`;
        return (await kv.smembers(key)) || [];
    } catch (e) {
        console.error("KV Error:", e);
        return [];
    }
}

export async function removeLiveUsher(categoryId: string, eventId: string, usherName: string) {
    const kv = getKV();
    if (!kv) return;
    try {
        const key = `ushers:${categoryId}:${eventId}`;
        await kv.srem(key, usherName);
    } catch (e) {
        console.error("KV Error:", e);
    }
}

export async function addLiveUsher(categoryId: string, eventId: string, usherName: string) {
    const kv = getKV();
    if (!kv) return;
    try {
        const key = `ushers:${categoryId}:${eventId}`;
        await kv.sadd(key, usherName);
    } catch (e) {
        console.error("KV Error:", e);
    }
}

export async function getEventStatus(categoryId: string, eventId: string): Promise<boolean> {
    const kv = getKV();
    if (!kv) return false;
    try {
        const status = await kv.get(`status:${categoryId}:${eventId}`);
        return !!status;
    } catch (e) {
        return false;
    }
}

export async function setEventStatus(categoryId: string, eventId: string, completed: boolean) {
    const kv = getKV();
    if (!kv) return;
    try {
        await kv.set(`status:${categoryId}:${eventId}`, completed);
    } catch (e) {
        console.error("KV Error:", e);
    }
}

export async function deleteEventFromKV(categoryId: string, eventId: string) {
    const kv = getKV();
    if (!kv) return;
    try {
        const keys = [
            `checkins:${categoryId}:${eventId}`,
            `names:${categoryId}:${eventId}`,
            `ushers:${categoryId}:${eventId}`,
            `status:${categoryId}:${eventId}`
        ];
        await kv.del(...keys);
    } catch (e) {
        console.error("KV Delete Error:", e);
    }
}

/**
 * Marks an event as deleted in KV for filtering read-only filesystem lists.
 */
export async function markEventAsDeleted(categoryId: string, eventId: string) {
    const kv = getKV();
    if (!kv) return;
    try {
        await kv.sadd('deleted_events', `${categoryId}:${eventId}`);
    } catch (e) {
        console.error("KV Soft-Delete Error:", e);
    }
}

/**
 * Checks if an event has been marked as deleted in KV.
 */
export async function isEventDeleted(categoryId: string, eventId: string): Promise<boolean> {
    const kv = getKV();
    if (!kv) return false;
    try {
        return await kv.sismember('deleted_events', `${categoryId}:${eventId}`) === 1;
    } catch (e) {
        return false;
    }
}

/**
 * Merges local file data with live KV data
 */
export async function mergeLiveGuestData(categoryId: string, eventId: string, localGuests: any[]) {
    const kv = getKV();
    if (!kv) return localGuests;
    
    try {
        const checkedInIds = await kv.smembers(`checkins:${categoryId}:${eventId}`);
        if (checkedInIds === null) return localGuests; // Only fallback if KV actually fails/is null

        const idSet = new Set(checkedInIds.map(String));
        return localGuests.map(guest => {
            const guestId = String(guest.id);
            // STRICT ID-ONLY MATCHING (Kills Name-based "Ghosts")
            const isLiveCheckedIn = idSet.has(guestId);
            
            return {
                ...guest,
                attended: isLiveCheckedIn
            };
        });
    } catch (e) {
        return localGuests;
    }
}

/**
 * Merges the entire registry index with KV data for global dashboards
 */
export async function mergeRegistryWithKV(index: any) {
    const kv = getKV();
    if (!kv) return index;

    try {
        const fetchPromises: Promise<any>[] = [];

        // Collect all data fetching promises to run in parallel
        for (const category of index.categories) {
            for (const event of category.events) {
                const eventId = event.id;
                const catId = category.id;

                const eventSync = (async () => {
                    try {
                        const [isCompleted, checkedInIds, liveNames, usherNames] = await Promise.all([
                            withTimeout(kv.get(`status:${catId}:${eventId}`), 1000, null),
                            withTimeout(kv.smembers(`checkins:${catId}:${eventId}`), 1000, []),
                            withTimeout(kv.smembers(`names:${catId}:${eventId}`), 1000, []),
                            withTimeout(kv.smembers(`ushers:${catId}:${eventId}`), 1000, [])
                        ]);

                        // 1. Completion Status
                        if (isCompleted !== null) {
                            event.completed = !!isCompleted;
                        }

                        // 2. Check-in Counts
                        if (checkedInIds) {
                            event.checkedInGuests = checkedInIds.length;
                        }

                        // 3. Guest Names and Info
                        const infoMap = new Map<string, string>();
                        const rawNames = new Set<string>();
                        const isKvManaged = (liveNames && liveNames.length > 0) || (checkedInIds && checkedInIds.length > 0);

                        if (isKvManaged) {
                            // NEW: Resolve IDs into Real Names by reading the roster file
                            // This guarantees the "Pending" list filters correctly even with ID-only checkins
                            try {
                                const rosterPath = path.join(process.cwd(), "src/data", catId, `${eventId}.json`);
                                if (fs.existsSync(rosterPath)) {
                                    const roster = JSON.parse(fs.readFileSync(rosterPath, "utf8"));
                                    if (Array.isArray(roster)) {
                                        roster.forEach((g: any) => {
                                            const name = g.name || `${g.firstName || ""} ${g.lastName || ""}`.trim();
                                            infoMap.set(String(g.id), name);
                                        });
                                    }
                                }
                            } catch (e) {
                                console.error("Error loading roster for resolution:", e);
                            }

                            if (liveNames) {
                                liveNames.forEach((item: string) => {
                                    if (item.includes('|')) {
                                        const [id, name] = item.split('|');
                                        infoMap.set(id, name);
                                    }
                                });
                            }
                            
                            // Sync rawNames based on IDs found in KV
                            checkedInIds.forEach((id: string) => {
                                const name = infoMap.get(String(id)) || `Guest ${id}`;
                                rawNames.add(name);
                            });
                        } else if (!HAS_DB) {
                            // ONLY Fallback to existing file data if we have NO Database connection at all
                            (event.checkedInGuestNames || []).forEach((n: string) => rawNames.add(n));
                            (event.checkedInGuestsInfo || []).forEach((info: any) => {
                                if (!infoMap.has(info.id)) {
                                    infoMap.set(info.id, info.name);
                                    rawNames.add(info.name);
                                }
                            });
                        }

                        event.checkedInGuestNames = Array.from(rawNames);
                        
                        // FIX: Only include guests who are ACTUALLY checked in (by ID) in Info
                        const checkedInIdSet = new Set(checkedInIds.map(String));
                        event.checkedInGuestsInfo = Array.from(infoMap.entries())
                            .filter(([id]) => checkedInIdSet.has(id))
                            .map(([id, name]) => ({ id, name }));

                        event.checkedInGuests = event.checkedInGuestsInfo.length;

                        // Robust filtering of "Pending" list
                        const arrivedNames = new Set(event.checkedInGuestNames.map((n: string) => n.toLowerCase().trim()));
                        event.unarrivedGuestNames = (event.unarrivedGuestNames || []).filter((n: string) => {
                            const normalized = n.toLowerCase().trim();
                            return !arrivedNames.has(normalized);
                        });

                        // 4. Ushers
                        if (usherNames && usherNames.length > 0) {
                            const existingUshers = new Set(event.usherNames || []);
                            usherNames.forEach((u: any) => existingUshers.add(String(u)));
                            event.usherNames = Array.from(existingUshers);
                            event.usherCount = event.usherNames.length;
                        }
                    } catch (err) {
                        // Single event failure shouldn't stop the loop
                    }
                })();
                fetchPromises.push(eventSync);
            }
        }

        // Wait for all event data to be merged (max 1.5s total wait time for the batch)
        await withTimeout(Promise.all(fetchPromises), 1500, []);

        // 5. Handle soft-deleted events
        const deletedEvents = await withTimeout(kv.smembers('deleted_events'), 800, [] as string[]);
        const deletedSet = new Set(deletedEvents || []);

        // Recalculate totals after all parallel updates are done
        for (const category of index.categories) {
            // Filter out soft-deleted events
            category.events = category.events.filter((e: any) => !deletedSet.has(`${category.id}:${e.id}`));

            category.activeCount = category.events.filter((e: any) => !e.completed).length;
            category.doneCount = category.events.filter((e: any) => e.completed).length;
            category.guestCount = category.events.reduce((acc: number, e: any) => acc + (e.totalGuests || 0), 0);
        }

        index.globalStats.totalCheckins = index.categories.reduce((acc: number, cat: any) => 
            acc + cat.events.reduce((eAcc: number, ev: any) => eAcc + ev.checkedInGuests, 0), 0);
        
        index.globalStats.activeEvents = index.categories.reduce((acc: number, c: any) => acc + c.activeCount, 0);
        index.globalStats.doneEvents = index.categories.reduce((acc: number, c: any) => acc + c.doneCount, 0);
        index.globalStats.totalGuests = index.categories.reduce((acc: number, c: any) => acc + c.guestCount, 0);

    } catch (e) {
        console.error("Registry Merge Error:", e);
    }

    return index;
}
