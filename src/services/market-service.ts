import axios from "axios";

// GEt top 20 trending repos created in the last week, sorted by stars
export async function fetchRepos(language?: string) {
    try {
        const since = new Date(Date.now() - 7 * 864e5).toISOString().slice(0, 10);
        const langQuery = language && language !== 'All' ? `+language:${language}` : '';
        const url = `https://api.github.com/search/repositories?q=created:>${since}${langQuery}&sort=stars&order=desc&per_page=50`;
        const response = await axios.get(url, { headers: { Accept: 'application/vnd.github+json' } });
        return response.data.items || [];
    } catch (e) {
        throw new Error('GitHub API error');
    }
}
export interface UnifiedJob {
    id: string;
    title: string;
    company_name: string;
    url: string;
    source: "HN" | "Remotive";
    text: string;
}

export async function fetchHNJobs(keyword?: string): Promise<UnifiedJob[]> {
    try {
        const response = await axios.get('https://hn.algolia.com/api/v1/search_by_date?tags=ask_hn,story&query=who+is+hiring&hitsPerPage=1');
        const threadId = response.data.hits?.[0]?.objectID;
        if (!threadId) return [];
        
        const queryParam = keyword && keyword !== 'All' ? `&query=${encodeURIComponent(keyword)}` : '';
        const response2 = await axios.get(`https://hn.algolia.com/api/v1/search?tags=comment,story_${threadId}${queryParam}&hitsPerPage=50`);
        
        return (response2.data.hits || []).filter((h: any) => h.text && h.text.length > 40).map((h: any): UnifiedJob => {
            const rawText = h.text || '';
            const plainText = rawText.replace(/<[^>]+>/g, '');
            const firstLine = plainText.split(/\n|<p>|<br>/)[0].substring(0, 120);
            return {
                id: `hn-${h.objectID}`,
                title: firstLine || 'Software Engineer',
                company_name: h.author,
                url: `https://news.ycombinator.com/item?id=${h.objectID}`,
                source: 'HN',
                text: plainText,
            };
        });
    } catch (error) {
        console.error('HN Jobs fetch error:', error);
        return [];
    }
}

export async function fetchRemoteJobs(): Promise<UnifiedJob[]> {
    try {
        const response = await axios.get('https://remotive.com/api/remote-jobs?category=software-dev&limit=50');
        return (response.data.jobs || []).map((j: any): UnifiedJob => {
            const plainText = (j.description || '').replace(/<[^>]+>/g, '');
            return {
                id: `rm-${j.id}`,
                title: j.title,
                company_name: j.company_name,
                url: j.url,
                source: 'Remotive',
                text: plainText,
            };
        });
    } catch (error) {
        console.error('Remote jobs fetch error:', error);
        return [];
    }
}

export async function fetchAllJobs(keyword?: string): Promise<UnifiedJob[]> {
    try {
        const [hnJobs, remoteJobs] = await Promise.all([
            fetchHNJobs(keyword),
            fetchRemoteJobs()
        ]);
        
        // If there's a keyword, we filter Remotive jobs manually since their API doesn't support generic keyword search nicely
        let filteredRemote = remoteJobs;
        if (keyword && keyword !== 'All') {
            const lowerKeyword = keyword.toLowerCase();
            filteredRemote = remoteJobs.filter(j => 
                j.title.toLowerCase().includes(lowerKeyword) || 
                j.text.toLowerCase().includes(lowerKeyword)
            );
        }

        // Combine and shuffle/interleave slightly to mix sources
        const combined = [...hnJobs, ...filteredRemote];
        return combined.sort(() => Math.random() - 0.5); // Simple shuffle for varied feed
    } catch (error) {
        console.error('Error fetching all jobs:', error);
        return [];
    }
}