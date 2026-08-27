/**
 * Converts a File object to a base64 string
 * @param file - The file to convert
 * @returns Promise that resolves to a base64 string
 */
export const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
            if (typeof reader.result === 'string') {
                resolve(reader.result);
            } else {
                reject(new Error('Failed to convert file to base64'));
            }
        };

        reader.onerror = () => {
            reject(new Error('Error reading file'));
        };

        reader.readAsDataURL(file);
    });
};

/**
 * Reads the `filename=` parameter from a Content-Disposition header (not RFC 5987 `filename*`).
 * If the value is concatenated with `; filename*=...`, only the segment before `;` is kept.
 */
export function parseFilenameFromContentDisposition(
    header: string | null | undefined
): string | undefined {
    if (!header?.trim()) return undefined;
    for (const part of header.split(';')) {
        const trimmed = part.trim();
        const m = /^filename\s*=\s*(.+)$/i.exec(trimmed);
        if (!m) continue;
        let value = m[1].trim();
        if (
            (value.startsWith('"') && value.endsWith('"')) ||
            (value.startsWith("'") && value.endsWith("'"))
        ) {
            value = value.slice(1, -1);
        }
        value = value.split(';')[0].trim();
        return value || undefined;
    }
    return undefined;
}

/**
 * Triggers a file download from a Blob
 * @param blob - The Blob to download
 * @param filename - The name for the downloaded file (including extension)
 */
export const downloadReport = (blob: Blob, filename: string): void => {
    if (typeof window === 'undefined') return;
    if (!(blob instanceof Blob)) {
        if (process.env.NODE_ENV === "development") {
            console.error('downloadReport: se esperaba un Blob');
        }
        return;
    }
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
};

