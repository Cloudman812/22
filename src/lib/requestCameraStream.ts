/**
 * Safari отдаёт камеру только в безопасном контексте (HTTPS или localhost).
 */
export async function requestCameraStream(): Promise<
  | { ok: true; stream: MediaStream }
  | { ok: false; message: string }
> {
  if (typeof window === "undefined") {
    return {
      ok: false,
      message: "Нет доступа к камере в этой среде.",
    };
  }

  if (!window.isSecureContext) {
    return {
      ok: false,
      message:
        "Камера доступна только по HTTPS (например задеплоенный сайт на GitHub Pages) или по http://localhost при разработке. Открой приложение по защищённому адресу.",
    };
  }

  const md = navigator.mediaDevices;
  if (!md?.getUserMedia) {
    return {
      ok: false,
      message:
        "Браузер не даёт доступ к камере. Открой страницу в Safari, не во встроенном браузере другого приложения.",
    };
  }

  try {
    const stream = await md.getUserMedia({
      video: { facingMode: { ideal: "environment" } },
      audio: false,
    });
    return { ok: true, stream };
  } catch {
    return {
      ok: false,
      message:
        "Не удалось включить камеру. В Safari: «Аа» → «Настройки для сайта» → Камера → Разрешить.",
    };
  }
}
