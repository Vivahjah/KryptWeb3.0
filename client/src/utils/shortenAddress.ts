export interface ShortenAddress {
    (address: string): string;
}

export const shortenAddress: ShortenAddress = (address: string): string =>
    `${address.slice(0, 5)}...${address.slice(address.length - 4)}`;