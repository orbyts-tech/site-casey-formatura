import "server-only";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { resolveDataBackend } from "@/infrastructure/data-backend";
import { assertNoSupabaseError, getSupabaseServiceClient } from "@/infrastructure/supabase/service-client";
import { GIFT_IMAGE_EXTENSIONS, type GiftImageStorage, type GiftImageUpload } from "../domain/gift-catalog";

const GIFT_IMAGES_BUCKET = "gift-images";
const DEVELOPMENT_UPLOADS_PATH = ["uploads", "gifts"] as const;

function buildImageFileName(image: GiftImageUpload): string {
  return `${crypto.randomUUID()}.${GIFT_IMAGE_EXTENSIONS[image.contentType]}`;
}

class SupabaseGiftImageStorage implements GiftImageStorage {
  async upload(image: GiftImageUpload): Promise<string> {
    const client = getSupabaseServiceClient();
    const fileName = buildImageFileName(image);

    const { error } = await client.storage.from(GIFT_IMAGES_BUCKET).upload(fileName, image.bytes, {
      contentType: image.contentType,
      cacheControl: "31536000",
      upsert: false,
    });
    assertNoSupabaseError(error, "Falha ao enviar imagem do presente");

    return client.storage.from(GIFT_IMAGES_BUCKET).getPublicUrl(fileName).data.publicUrl;
  }
}

class DevelopmentGiftImageStorage implements GiftImageStorage {
  async upload(image: GiftImageUpload): Promise<string> {
    const uploadsDirectory = path.join(/*turbopackIgnore: true*/ process.cwd(), "public", ...DEVELOPMENT_UPLOADS_PATH);
    const fileName = buildImageFileName(image);

    await mkdir(uploadsDirectory, { recursive: true });
    await writeFile(path.join(/*turbopackIgnore: true*/ uploadsDirectory, fileName), image.bytes);

    return `/${DEVELOPMENT_UPLOADS_PATH.join("/")}/${fileName}`;
  }
}

export function getGiftImageStorage(): GiftImageStorage {
  return resolveDataBackend() === "supabase" ? new SupabaseGiftImageStorage() : new DevelopmentGiftImageStorage();
}
