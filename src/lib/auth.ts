export const isAdmin = localStorage.getItem('jtk25_admin') === 'true';

export const getMyOotds = () => JSON.parse(localStorage.getItem('my_ootds') || '[]');
export const addMyOotd = (id: string) => { 
    const arr = getMyOotds(); 
    arr.push(id); 
    localStorage.setItem('my_ootds', JSON.stringify(arr)); 
};

export const getMyExchanges = () => JSON.parse(localStorage.getItem('my_exchanges') || '[]');
export const addMyExchange = (id: string) => { 
    const arr = getMyExchanges(); 
    arr.push(id); 
    localStorage.setItem('my_exchanges', JSON.stringify(arr)); 
};
