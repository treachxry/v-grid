import {IQueryResult} from "@v-grid/core";

export function usePagination(displayLimit: number) {
    const PLACEHOLDER: number = -1;

    function calculatePages(page: number, pageSize: number, total: number, displayLimit: number): number[] {
        const pageCount: number = Math.ceil(total / pageSize);

        if(pageCount <= 0) {
            return [];
        }

        let start: number;
        let end: number;
        const half = Math.floor(displayLimit / 2);

        if(pageCount <= displayLimit) {
            start = 1;
            end = pageCount;
        }
        else if(page <= half + 1) {
            start = 1;
            end = Math.min(pageCount, displayLimit - 2);
        }
        else if(page >= pageCount - half) {
            start = Math.max(1, pageCount - displayLimit + 3);
            end = pageCount;
        }
        else {
            start = Math.max(1, page - half + 2);
            end = Math.min(pageCount, page + half - 2);
        }

        const results = Array.from({length: end - start + 1}, (_, i) => i + start);

        if(results[0] > 1) {
            results.unshift(1);
        }

        if(results[results.length - 1] !== pageCount) {
            results.push(pageCount);
        }

        for(let i = 0; i < results.length; i++) {
            const item = results[i];

            if(i < results.length - 1 && results[i + 1] - item > 1) {
                results.splice(i + 1, 0, PLACEHOLDER);
                i++;
            }
        }

        return results;
    }

    function isPlaceholderValue(value: number): boolean {
        return value === PLACEHOLDER;
    }

    function getPages(page: number, pageSize: number, total: number): number[] {
        return calculatePages(page, pageSize, total, displayLimit);
    }

    function getPagesFromQuery(queryResult: IQueryResult<unknown>): number[] {
        const page: number = queryResult.request.page;
        const pageSize: number = queryResult.request.pageSize;
        const total: number = queryResult.total;

        return calculatePages(page, pageSize, total, displayLimit);
    }

    return {
        getPages,
        getPagesFromQuery,
        isPlaceholderValue
    };
}