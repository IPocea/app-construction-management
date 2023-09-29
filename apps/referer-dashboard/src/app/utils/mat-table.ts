import { IProjectDetailsFilters } from '@interfaces';

export function setFullAvailableFilters(
  filters: IProjectDetailsFilters
): string {
  if (filters) {
    // set an array of filters as string in queryParams format
    const filtersArray = [];
    for (const [key, value] of Object.entries(filters)) {
      if (value) {
        filtersArray.push(`${key}=${value}`);
      }
    }
    // set the complete filterString by adding in start ? and joining the filter array with &
    return '?' + filtersArray.join('&');
  }
  return '';
}

export function setPageSize(filters: IProjectDetailsFilters): string {
  return filters?.pageSize ? `?pageSize=${filters.pageSize}` : '';
}
