const DATABASE_NAME = "daqaeq-noor-offline-v1";
const DATABASE_VERSION = 1;
const RESOURCE_STORE = "resources";
const GROUP_INDEX = "group";

let databasePromise;

const canUseIndexedDb = () =>
  typeof window !== "undefined" && "indexedDB" in window;

const openDatabase = () => {
  if (!canUseIndexedDb()) return Promise.resolve(null);
  if (databasePromise) return databasePromise;

  databasePromise = new Promise((resolve) => {
    const request = window.indexedDB.open(DATABASE_NAME, DATABASE_VERSION);

    request.onupgradeneeded = () => {
      const database = request.result;
      if (database.objectStoreNames.contains(RESOURCE_STORE)) return;

      const store = database.createObjectStore(RESOURCE_STORE, {
        keyPath: "key",
      });
      store.createIndex(GROUP_INDEX, GROUP_INDEX, { unique: false });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => resolve(null);
    request.onblocked = () => resolve(null);
  });

  return databasePromise;
};

export const getOfflineResource = async (key) => {
  try {
    const database = await openDatabase();
    if (!database) return null;

    return await new Promise((resolve) => {
      const transaction = database.transaction(RESOURCE_STORE, "readonly");
      const request = transaction.objectStore(RESOURCE_STORE).get(key);

      request.onsuccess = () => resolve(request.result?.value ?? null);
      request.onerror = () => resolve(null);
      transaction.onabort = () => resolve(null);
    });
  } catch {
    return null;
  }
};

export const setOfflineResource = async ({
  key,
  group,
  value,
  limit,
  metadata,
}) => {
  try {
    const database = await openDatabase();
    if (!database) return false;

    return await new Promise((resolve) => {
      const transaction = database.transaction(RESOURCE_STORE, "readwrite");
      const store = transaction.objectStore(RESOURCE_STORE);
      const savedAt = Date.now();

      store.put({ key, group, value, savedAt, metadata });

      if (Number.isInteger(limit) && limit > 0) {
        const groupRequest = store.index(GROUP_INDEX).getAll(group);
        groupRequest.onsuccess = () => {
          groupRequest.result
            .sort((first, second) => second.savedAt - first.savedAt)
            .slice(limit)
            .forEach((record) => store.delete(record.key));
        };
      }

      transaction.oncomplete = () => resolve(true);
      transaction.onerror = () => resolve(false);
      transaction.onabort = () => resolve(false);
    });
  } catch {
    return false;
  }
};

export const getOfflineResourcesByGroup = async (group) => {
  try {
    const database = await openDatabase();
    if (!database) return [];

    return await new Promise((resolve) => {
      const transaction = database.transaction(RESOURCE_STORE, "readonly");
      const request = transaction
        .objectStore(RESOURCE_STORE)
        .index(GROUP_INDEX)
        .getAll(group);

      request.onsuccess = () => resolve(request.result ?? []);
      request.onerror = () => resolve([]);
      transaction.onabort = () => resolve([]);
    });
  } catch {
    return [];
  }
};

export const deleteOfflineResource = async (key) => {
  try {
    const database = await openDatabase();
    if (!database) return false;

    return await new Promise((resolve) => {
      const transaction = database.transaction(RESOURCE_STORE, "readwrite");
      transaction.objectStore(RESOURCE_STORE).delete(key);
      transaction.oncomplete = () => resolve(true);
      transaction.onerror = () => resolve(false);
      transaction.onabort = () => resolve(false);
    });
  } catch {
    return false;
  }
};

export const loadWithOfflineFallback = async ({
  key,
  group,
  limit,
  signal,
  load,
  isValid,
}) => {
  try {
    const value = await load();
    if (!isValid(value)) throw new Error("INVALID_OFFLINE_RESOURCE");

    await setOfflineResource({ key, group, value, limit });
    return value;
  } catch (error) {
    if (signal?.aborted) throw error;

    const cachedValue = await getOfflineResource(key);
    if (isValid(cachedValue)) return cachedValue;

    throw error;
  }
};
