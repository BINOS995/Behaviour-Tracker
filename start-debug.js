const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const PUBLIC_DIR = __dirname;

const MIME_TYPES = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.txt': 'text/plain',
    '.pdf': 'application/pdf'
};

function getContentType(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    return MIME_TYPES[ext] || 'application/octet-stream';
}

function serveFile(filePath, res) {
    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('File not found');
            return;
        }

        const contentType = getContentType(filePath);
        
        // Add cache-busting headers
        res.writeHead(200, {
            'Content-Type': contentType,
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
        });
        
        res.end(data);
    });
}

const server = http.createServer((req, res) => {
    let filePath = path.join(PUBLIC_DIR, req.url);
    
    // Default to index.html for root path
    if (req.url === '/') {
        filePath = path.join(PUBLIC_DIR, 'index.html');
    }
    
    // Handle query parameters by removing them for file serving
    const cleanPath = filePath.split('?')[0];
    
    fs.stat(cleanPath, (err, stats) => {
        if (err) {
            // Try adding .html extension
            const htmlPath = cleanPath + '.html';
            fs.stat(htmlPath, (err2, stats2) => {
                if (err2) {
                    res.writeHead(404, { 'Content-Type': 'text/plain' });
                    res.end('File not found');
                } else {
                    serveFile(htmlPath, res);
                }
            });
            return;
        }
        
        if (stats.isDirectory()) {
            filePath = path.join(cleanPath, 'index.html');
        } else {
            filePath = cleanPath;
        }
        
        serveFile(filePath, res);
    });
});

server.listen(PORT, () => {
    console.log(`🚀 Debug server running at http://localhost:${PORT}`);
    console.log(`📁 Serving files from: ${PUBLIC_DIR}`);
    console.log(`🛠️  Debug tools available at: http://localhost:${PORT}/debug.html`);
    console.log(`🔄 Cache-busting enabled - all files served with no-cache headers`);
    console.log(`📱 Test PWA at: http://localhost:${PORT}`);
    console.log(`👨‍👩‍👧‍👦 Parent app at: http://localhost:${PORT}/parent-app.html`);
    console.log(`📊 Dashboard at: http://localhost:${PORT}/dashboard.html`);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
    console.log('Shutting down server...');
    server.close();
});