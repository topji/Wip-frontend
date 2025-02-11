import CryptoJS from 'crypto-js';

type InputType = {
    type: 'text';
    content: string;
} | {
    type: 'file';
    content: File;
};

export const useGenerateHash = () => {
    const generateNodeHash = (data: CryptoJS.lib.WordArray): string => {
        return CryptoJS.SHA256(data).toString(CryptoJS.enc.Hex);
    };

    const hash = async function generateHash(input: InputType): Promise<string> {
        return new Promise((resolve, reject) => {
            if (input.type === 'text') {
                try {
                    // Directly hash text content
                    const wordArray = CryptoJS.enc.Utf8.parse(input.content);
                    const hash = generateNodeHash(wordArray);
                    resolve(hash);
                } catch (error) {
                    reject(error);
                }
            } else {
                // Handle file input
                const chunks: ArrayBuffer[] = [];
                let offset = 0;
                const chunkSize = 2097152; // 2MB chunks

                const readNextChunk = () => {
                    const reader = new FileReader();

                    reader.onload = (e) => {
                        try {
                            if (e.target?.result) {
                                chunks.push(e.target.result as ArrayBuffer);
                            }

                            if (offset < input.content.size) {
                                // Read next chunk
                                const slice = input.content.slice(offset, offset + chunkSize);
                                offset += chunkSize;
                                reader.readAsArrayBuffer(slice);
                            } else {
                                // All chunks read, build the tree
                                let currentLevel = chunks.map(chunk => {
                                    const wordArray = CryptoJS.lib.WordArray.create(chunk as any);
                                    return generateNodeHash(wordArray);
                                });

                                // Build tree levels until we reach the root
                                while (currentLevel.length > 1) {
                                    const nextLevel: string[] = [];

                                    for (let i = 0; i < currentLevel.length; i += 2) {
                                        const left = currentLevel[i];
                                        const right = i + 1 < currentLevel.length
                                            ? currentLevel[i + 1]
                                            : left;

                                        const leftWords = CryptoJS.enc.Hex.parse(left);
                                        const rightWords = CryptoJS.enc.Hex.parse(right);
                                        const combined = leftWords.concat(rightWords);
                                        const parentHash = generateNodeHash(combined);
                                        nextLevel.push(parentHash);
                                    }

                                    currentLevel = nextLevel;
                                }

                                resolve(currentLevel[0]); // Root hash
                            }
                        } catch (error) {
                            reject(error);
                        }
                    };

                    reader.onerror = () => {
                        reject(new Error('Error reading file chunk'));
                    };

                    const slice = input.content.slice(offset, offset + chunkSize);
                    reader.readAsArrayBuffer(slice);
                };

                // Start reading chunks
                readNextChunk();
            }
        });
    };

    return hash;
};

// Usage example:
// const generateHash = useGenerateHash();
//
// // For text:
// const textHash = await generateHash({ type: 'text', content: 'Hello World' });
//
// // For file:
// const fileHash = await generateHash({ type: 'file', content: fileObject });

