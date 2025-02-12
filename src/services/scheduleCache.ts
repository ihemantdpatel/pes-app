import Schedule from "../models/schedule";

// Global cache using a Map
const scheduleCache = new Map<string, Schedule[]>();

/**
 * Generates a cache key in the format `day.origin.destination`
 */
const generateCacheKey = (day: number, origin: string, destination: string): string => {
  return `${day}.${origin}.${destination}`;
};

/**
 * Loads schedules from the database into cache
 */
export const loadSchedulesIntoCache = async () => {
  const schedules: Schedule[] = await Schedule.findAll({
    attributes: ["id", "day", "origin", "destination"],
    raw: true, // Get plain objects instead of Sequelize models
  });

  // Reset the cache
  scheduleCache.clear();

  // Populate the cache
  schedules.forEach((schedule) => {
    const key = generateCacheKey(schedule.day, schedule.origin, schedule.destination);

    if (!scheduleCache.has(key)) {
      scheduleCache.set(key, []);
    }

    scheduleCache.get(key)!.push(schedule);
  });

  console.log("🚀 Schedules loaded into cache:", scheduleCache.size);
};

/**
 * Fetch a single schedule from cache based on day, origin, and destination
 */
export const getCachedSchedule = (day: number, origin: string, destination: string): Schedule | null => {
  const key = generateCacheKey(day, origin, destination);
  const schedules = scheduleCache.get(key);

  return schedules && schedules.length > 0 ? schedules[0] : null;
};

/**
 * Refresh cache when schedules are updated in the database
 */
export const refreshScheduleCache = async () => {
  await loadSchedulesIntoCache();
};
