// Prevent real Redis connection during tests
jest.mock('../config/redis', () => ({
  client: { zAdd: jest.fn().mockResolvedValue(null), zRangeWithScores: jest.fn().mockResolvedValue([]) },
  redisHelper: { set: jest.fn(), get: jest.fn(), del: jest.fn() }
}));

// Mock supabase for newsService
jest.mock('../config/database', () => {
    let newsCall = 0;
    const makeChain = (result) => {
        const chain = {};
        chain.data = result.data;
        chain.error = result.error;
        chain.select = jest.fn().mockReturnThis();
        chain.eq = jest.fn().mockReturnThis();
        chain.insert = jest.fn().mockReturnValue({ select: jest.fn().mockReturnThis(), single: jest.fn().mockResolvedValue({ data: result.data, error: result.error }) });
        chain.single = jest.fn().mockResolvedValue({ data: result.data, error: result.error });
        return chain;
    };
    return {
        supabase: {
            from: jest.fn((table) => {
                newsCall++;
                if (table === 'news') {
                    if (newsCall === 1) return makeChain({ data: null, error: null });
                    return makeChain({ data: { title: 'Generated', affected_resource: 'GOLD', multiplier: 1.5, is_active: true, active_date: new Date().toISOString() }, error: null });
                }
                return makeChain({ data: [], error: null });
            })
        }
    };
});

const { generateDailyNews } = require('../services/newsService');

describe('News Service', () => {
    test('generateDailyNews returns inserted news object', async () => {
        const result = await generateDailyNews();
        expect(result).toEqual(expect.objectContaining({ title: expect.any(String), affected_resource: expect.any(String) }));
    });
});