import type { Request, Response } from 'express';

export default async function handler(req: Request, res: Response) {
    // Add CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    console.log('Function started successfully');
    console.log('Request method:', req.method);
    console.log('Request headers:', req.headers);
    console.log('Request body type:', typeof req.body);
    
    try {
        // Simple health check
        if (req.method === 'GET') {
            return res.status(200).json({ status: 'ok', message: 'Telegram webhook is running' });
        }

        if (req.method !== 'POST') {
            return res.status(405).json({ error: 'Method not allowed' });
        }

        // Handle empty body
        let update = req.body;
        if (!update) {
            console.log('Empty request body received');
            return res.status(200).json({ status: 'ok', message: 'Empty body received' });
        }

        console.log('Received update:', update);

        // Test basic response
        return res.status(200).json({ status: 'ok', message: 'Update received' });
    } catch (error) {
        console.error('Webhook error:', error);
        console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
        if (!res.headersSent) {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}
