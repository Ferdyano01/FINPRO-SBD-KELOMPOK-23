const newsFetcher = require('../utils/newsFetcher');
const NewsModel = require('../models/newsModel');
const supabase = require('../config/database');

const newsAutomationService = {
    generateDailyEvent: async () => {

        const mapNewsToEffect = (title, description) => {
            const text = (title + " " + description).toLowerCase();
        
            // Definisi Kategori dan Keywords
            const mappings = [
                { 
                    resource: 'ENERGY', 
                    buff: ['renewable', 'solar', 'breakthrough', 'surplus'], 
                    debuff: ['crisis', 'blackout', 'shortage', 'oil rise'] 
                },
                { 
                    resource: 'GOLD', 
                    buff: ['growth', 'investment', 'stimulus', 'profit'], 
                    debuff: ['inflation', 'recession', 'crash', 'debt'] 
                },
                { 
                    resource: 'MATERIAL', 
                    buff: ['discovery', 'mining', 'construction', 'export'], 
                    debuff: ['scarcity', 'strike', 'sanction', 'bottleneck'] 
                },
                { 
                    resource: 'TECH_PARTS', 
                    buff: ['innovation', 'ai', 'quantum', 'patent'], 
                    debuff: ['hack', 'breach', 'regulation', 'failure'] 
                }
            ];
        
            for (const map of mappings) {
                // Cek BUFF
                if (map.buff.some(word => text.includes(word))) {
                    return { resource: map.resource, type: 'BUFF', mult: 1.5 };
                }
                // Cek DEBUFF
                if (map.debuff.some(word => text.includes(word))) {
                    return { resource: map.resource, type: 'DEBUFF', mult: 0.5 };
                }
            }
        
            // Default jika tidak ada keyword yang cocok
            return { resource: 'GOLD', type: 'BUFF', mult: 1.0 };
        };

        // 1. Ambil berita terbaru dengan keyword spesifik (misal: 'energy crisis')
        const rawNews = await newsFetcher.fetchGlobalNews('energy crisis');
        
        if (!rawNews) return;

        // 2. Tentukan efek mekanik game secara otomatis
        // Logika sederhana: jika ada kata 'crisis' atau 'low', beri DEBUFF
        let effectType = 'BUFF';
        let multiplier = 1.2;
        let affectedResource = 'ENERGY';

        if (rawNews.title.toLowerCase().includes('crisis') || rawNews.title.toLowerCase().includes('down')) {
            effectType = 'DEBUFF';
            multiplier = 0.8;
        }

        // 3. Simpan ke PostgreSQL (tabel news) agar bisa dikonsumsi ResourceService
        const newsData = {
            title: rawNews.title,
            content: rawNews.content,
            affected_resource: affectedResource,
            effect_type: effectType,
            multiplier: multiplier,
            active_date: new Date().toISOString().split('T')[0]
        };

        const { data, error } = await supabase.from('news').insert([newsData]);
        if (error) console.error("Gagal menyimpan berita otomatis:", error);
        
        return data;
    }

};

module.exports = newsAutomationService;