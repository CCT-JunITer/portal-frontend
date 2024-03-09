import { differenceInWeeks, startOfWeek, addWeeks, endOfWeek, format } from 'date-fns';
import { de } from 'date-fns/locale';


export const weeksArray = (fromDate: string, toDate: string) => {
  const totalWeeks = differenceInWeeks(new Date(toDate), new Date(fromDate));
  const startWeek = startOfWeek(new Date(fromDate), { locale: de });

  const weeksArray = Array.from({ length: totalWeeks + 1 }, (_, i) => i).map((weekOffset) => {
    const date = addWeeks(startWeek, weekOffset);
    return {
      start: date,
      end: endOfWeek(date, { locale: de }),
      label: `KW ${format(date, 'w')}`,
      value: format(date, 'yyyy-w'),
    };
  });
  return weeksArray;
}