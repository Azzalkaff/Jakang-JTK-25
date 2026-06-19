declare global {
    interface Window {
        checkWashing: () => void;
        checkIron: () => void;
        likeOotd: (id: string) => void;
        deleteOotd: (id: string, imageUrl: string) => void;
        deleteExchange: (id: string) => void;
        fetchOotdPosts: () => void;
        fetchExchanges: () => void;
        enableAdmin: () => void;
    }
}
export {};
//# sourceMappingURL=script.d.ts.map