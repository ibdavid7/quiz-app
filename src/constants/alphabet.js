const ALPHABET_UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const alphabet = (index) => {
    return ALPHABET_UPPERCASE[index % 26];
}

export default alphabet;