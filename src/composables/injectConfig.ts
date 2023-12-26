export const useConfig = async () => {
    const config = await fetch(`/config/config.json?timestamp=${Date.now()}`);
    return await config.json()
}

