export function validateFileName(fileName) {
    const forbiddenCharsRegex = /[<>:"/\\|?*\0]/;
    const reservedNames = /^(con|prn|aux|nul|com[0-9]|lpt[0-9])$/i;
    const maxLength = 255;

    if (fileName.trim() === '') {
        return { isValid: false, errorMessage: 'Имя файла не должно быть пустым' };
    }

    if (forbiddenCharsRegex.test(fileName)) {
        return { isValid: false, errorMessage: 'Имя файла содержит недопустимые символы: < > : " / \\ | ? *' };
    }

    if (fileName.startsWith(' ') || fileName.endsWith(' ')) {
        return { isValid: false, errorMessage: 'Имя файла не должно начинаться или заканчиваться пробелами.' };
    }

    if (fileName === '.' || fileName === '..') {
        return { isValid: false, errorMessage: 'Имя файла не может быть "." или "..".' };
    }

    if (reservedNames.test(fileName)) {
        return { isValid: false, errorMessage: 'Имя файла является зарезервированным именем (CON, PRN, AUX, NUL, COM0-9, LPT0-9).' };
    }

    if (fileName.length > maxLength) {
        return { isValid: false, errorMessage: `Имя файла слишком длинное (максимум ${maxLength} символов).` };
    }

    return { isValid: true, errorMessage: '' };
}
