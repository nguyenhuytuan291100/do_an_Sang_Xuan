import useSWR from "swr"


export const useGetLog = () => {
    const { data, error, isLoading, mutate } = useSWR(
        `/log`,
        { refreshInterval: 0}
    );
    return {
        data, error, isLoading, mutate
    };
}

