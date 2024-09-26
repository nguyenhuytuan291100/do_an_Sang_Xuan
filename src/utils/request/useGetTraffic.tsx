import useSWR from "swr"


export const useGetTraffic  = () => {
    const { data, error, isLoading, mutate } = useSWR(
        `/traffic`,
        { refreshInterval: 0}
    );
    return {
        data, error, isLoading, mutate
    };
}

