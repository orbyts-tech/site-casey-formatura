import "server-only";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";

const DEVELOPMENT_DATA_DIRECTORY = path.join(process.cwd(), ".data");
const pendingWritesByCollection = new Map<string, Promise<unknown>>();

function getCollectionFilePath(collectionName: string): string {
  return path.join(DEVELOPMENT_DATA_DIRECTORY, `${collectionName}.json`);
}

async function readCollectionFile<TItem>(collectionName: string, seed: readonly TItem[]): Promise<readonly TItem[]> {
  try {
    const fileContents = await readFile(getCollectionFilePath(collectionName), "utf8");
    return JSON.parse(fileContents) as TItem[];
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return seed;
    throw error;
  }
}

async function writeCollectionFile<TItem>(collectionName: string, items: readonly TItem[]): Promise<void> {
  await mkdir(DEVELOPMENT_DATA_DIRECTORY, { recursive: true });
  const filePath = getCollectionFilePath(collectionName);
  const temporaryFilePath = `${filePath}.${process.pid}.tmp`;
  await writeFile(temporaryFilePath, JSON.stringify(items, null, 2), "utf8");
  await rename(temporaryFilePath, filePath);
}

export async function readDevelopmentCollection<TItem>(
  collectionName: string,
  seed: readonly TItem[] = [],
): Promise<readonly TItem[]> {
  await pendingWritesByCollection.get(collectionName);
  return readCollectionFile(collectionName, seed);
}

// Writes are chained per collection so concurrent server actions never overwrite each other.
export function updateDevelopmentCollection<TItem>(
  collectionName: string,
  updateItems: (currentItems: readonly TItem[]) => readonly TItem[],
  seed: readonly TItem[] = [],
): Promise<readonly TItem[]> {
  const previousWrite = pendingWritesByCollection.get(collectionName) ?? Promise.resolve();
  const nextWrite = previousWrite
    .catch(() => undefined)
    .then(async () => {
      const nextItems = updateItems(await readCollectionFile(collectionName, seed));
      await writeCollectionFile(collectionName, nextItems);
      return nextItems;
    });

  pendingWritesByCollection.set(collectionName, nextWrite);
  return nextWrite;
}
