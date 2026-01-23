
import { UpdateItem, Tag, Company } from './types';

export interface UpdateGroup {
    type: 'group';
    id: string; // ID of the latest item
    company: Company;
    tag: Tag;
    title: string; // Common title or "3 Updates"
    date: string; // Date of latest
    items: UpdateItem[];
}

export type FeedItem = UpdateItem | UpdateGroup;

function getCommonPrefix(a: string, b: string): string {
    let i = 0;
    while (i < a.length && i < b.length && a[i] === b[i]) i++;
    return a.substring(0, i);
}

export function groupUpdates(updates: UpdateItem[]): FeedItem[] {
    if (updates.length === 0) return [];

    const result: FeedItem[] = [];
    let buffer: UpdateItem[] = [updates[0]];

    for (let i = 1; i < updates.length; i++) {
        const item = updates[i];
        const prev = buffer[0];

        const sameCompany = prev.company === item.company;
        const sameTag = prev.tag === item.tag;

        // Title similarity check
        const prefix = getCommonPrefix(prev.title, item.title);
        // We want to group things like "OpenAI Python Library v1.0" and "OpenAI Python Library v1.1"
        // But NOT "Research on X" and "Research on Y" (unless they are very similar series)
        // Heuristic: Prefix match > 15 chars OR (same tag 'Release'/'Engineering' + prefix > 10 chars)
        const meaningfulPrefix = prefix.length > 20 || (['Release', 'Engineering'].includes(prev.tag) && prefix.length > 10);

        // Also ensure the items are somewhat close in time? (optional, list is already sorted by date)
        // And ensure we don't group too many disparate things.

        if (sameCompany && sameTag && meaningfulPrefix) {
            buffer.push(item);
        } else {
            // Flush buffer
            if (buffer.length > 1) {
                result.push({
                    type: 'group',
                    id: buffer[0].id + '-group',
                    company: prev.company,
                    tag: prev.tag,
                    title: prefix.trim().replace(/[-:]$/, '').trim() || `${prev.company} Updates`,
                    date: buffer[0].date,
                    items: [...buffer]
                });
            } else {
                result.push(prev);
            }
            buffer = [item];
        }
    }

    // Flush final buffer
    if (buffer.length > 1) {
        result.push({
            type: 'group',
            id: buffer[0].id + '-group',
            company: buffer[0].company,
            tag: buffer[0].tag,
            title: getCommonPrefix(buffer[0].title, buffer[1].title).trim().replace(/[-:]$/, '').trim() || `${buffer[0].company} Updates`,
            date: buffer[0].date,
            items: [...buffer]
        });
    } else {
        result.push(buffer[0]);
    }

    return result;
}
