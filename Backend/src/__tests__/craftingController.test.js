// Mock supabase used by the controller
// Prevent real Redis connection during tests
jest.mock('../config/redis', () => ({
  client: { zAdd: jest.fn().mockResolvedValue(null), zRangeWithScores: jest.fn().mockResolvedValue([]) },
  redisHelper: { set: jest.fn(), get: jest.fn(), del: jest.fn() }
}));

jest.mock('../config/database', () => {
    const makeChain = (result) => {
        const chain = {};
        chain.select = jest.fn().mockReturnThis();
        chain.eq = jest.fn().mockReturnThis();
        chain.update = jest.fn().mockReturnValue(() => {});
        chain.update = jest.fn().mockImplementation(() => {
            const upd = {};
            upd.eq = jest.fn().mockImplementation(() => upd);
            upd.then = (onFulfilled) => Promise.resolve({ error: result.error }).then(onFulfilled);
            return upd;
        });
        chain.insert = jest.fn().mockReturnValue({ select: jest.fn().mockReturnThis(), single: jest.fn().mockResolvedValue({ data: result.dataSingle || result.dataAll, error: result.error }) });
        chain.single = jest.fn().mockResolvedValue({ data: result.dataSingle !== undefined ? result.dataSingle : (result.dataAll ? result.dataAll[0] : null), error: result.error });
        chain.then = (onFulfilled) => Promise.resolve({ data: result.dataAll, error: result.error }).then(onFulfilled);
        return chain;
    };
    return {
        supabase: {
            from: jest.fn().mockImplementation((table) => {
                if (table === 'resources') return makeChain({ dataAll: [{ resource_type: 'WOOD', amount: '10', base_production_rate: '1', updated_at: new Date().toISOString(), id: 1, created_at: new Date().toISOString() }], dataSingle: { amount: '10' }, error: null });
                return makeChain({ dataAll: [], dataSingle: null, error: null });
            })
        }
    };
});

const { craftItem } = require('../controllers/craftingController');

describe('Crafting Controller', () => {
    describe('craftItem', () => {
        test('should craft item successfully', async () => {
            const req = { user: { id: 1 }, body: { itemId: 'PLANK' } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
            await craftItem(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
        });

        test('should return 400 when missing user or itemId', async () => {
            const req = { user: null, body: {} };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
            await craftItem(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: false }));
        });
    });
});