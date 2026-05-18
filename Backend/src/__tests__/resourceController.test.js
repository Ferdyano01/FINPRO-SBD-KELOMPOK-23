// Mock supabase chainable queries used by the controller
// Prevent real Redis connection during tests
jest.mock('../config/database', () => {
    let callCount = 0;
    const makeChain = (result) => {
        const chain = {};
        chain.select = jest.fn().mockReturnThis();
        chain.eq = jest.fn().mockReturnThis();
        chain.order = jest.fn().mockReturnThis();
        chain.limit = jest.fn().mockReturnThis();

        chain.single = jest.fn().mockResolvedValue({ data: result.dataSingle !== undefined ? result.dataSingle : (result.dataAll ? result.dataAll[0] : null), error: result.error });

        chain.insert = jest.fn().mockReturnValue({ select: jest.fn().mockReturnThis(), single: jest.fn().mockResolvedValue({ data: result.dataSingle || result.dataAll, error: result.error }) });

        chain.update = jest.fn().mockReturnValue(() => {});
        // make update().eq().eq() chainable and awaitable
        chain.update = jest.fn().mockImplementation(() => {
            const upd = {};
            upd.eq = jest.fn().mockImplementation(() => upd);
            upd.then = (onFulfilled) => Promise.resolve({ error: result.error }).then(onFulfilled);
            return upd;
        });

        // make chain awaitable (thenable) to support code that awaits select().eq() without .single()
        chain.then = (onFulfilled) => Promise.resolve({ data: result.dataAll, error: result.error }).then(onFulfilled);

        return chain;
    };

    return {
        supabase: {
            from: jest.fn().mockImplementation((table) => {
                callCount++;
                if (table === 'news') {
                    if (callCount === 1) return makeChain({ dataAll: null, dataSingle: null, error: null });
                    return makeChain({ dataAll: null, dataSingle: { title: 'Test News', affected_resource: 'GOLD', multiplier: 1.5, is_active: true, active_date: new Date().toISOString() }, error: null });
                }
                if (table === 'resources') {
                    return makeChain({ dataAll: [{ resource_type: 'WOOD', amount: '10', base_production_rate: '1', updated_at: new Date().toISOString(), id: 1, created_at: new Date().toISOString() }], dataSingle: { amount: '10' }, error: null });
                }
                return makeChain({ dataAll: [], dataSingle: null, error: null });
            })
        }
    };
});
 

const ResourceController = require('../controllers/resourceController');

describe('Resource Controller', () => {
    test('syncResources returns success and data', async () => {
        const req = { user: { id: 1, username: 'tester' }, body: {} };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        await ResourceController.syncResources(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
    });

    test('sellResource returns success when item exists', async () => {
        const req = { user: { id: 1 }, body: { itemId: 'WOOD' } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        await ResourceController.sellResource(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
    });
});